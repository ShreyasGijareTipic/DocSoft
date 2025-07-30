import React, { useState } from 'react';
import { CAlert, CButton } from '@coreui/react';

const PastHistory = ({ showPatientCard, lastBill, healthdirectives, patientExaminations, ayurvedicExaminations }) => {
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [expandedVisits, setExpandedVisits] = useState({});

  const toggleVisitExpansion = (visitId) => {
    setExpandedVisits(prev => ({ ...prev, [visitId]: !prev[visitId] }));
  };

  return (
    <>
      {showPatientCard && (
        <>
          <CAlert color="info" className="p-3 rounded shadow-sm mb-3 border border-secondary">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-dark">Past History</h5>
              <CButton
                color="light"
                size="sm"
                onClick={() => setShowAllHistory(!showAllHistory)}
              >
                {showAllHistory ? '▲' : '▼'}
              </CButton>
            </div>
          </CAlert>
          {showAllHistory && lastBill && (
            <div>
              {lastBill.map((bill, index) => {
                const directivesForBill = healthdirectives.filter(d => d.p_p_i_id == bill.id);
                const examsForBill = patientExaminations.filter(e => e.p_p_i_id == bill.id);
                const ayurvedicExamination = ayurvedicExaminations.filter(e => e.p_p_i_id == bill.id);
                const isExpanded = expandedVisits[bill.id];

                return (
                  <CAlert key={index} color="success" className="p-2 rounded shadow-sm mb-3 border border-black">
                    <div
                      className="d-flex justify-content-between align-items-center"
                      onClick={() => toggleVisitExpansion(bill.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <strong className="text-dark">Visit Date: {bill.visit_date}</strong>
                      <span>{isExpanded ? '▲' : '▼'}</span>
                    </div>
                    {isExpanded && (
                      <>
                        {directivesForBill.length > 0 && (
                          <>
                            <div className="mt-2 text-dark"><strong>Health Directives</strong></div>
                            {directivesForBill.map((directive, dIndex) => (
                              <div key={dIndex} className="border-bottom pb-2 mb-2">
                                <div className="d-flex flex-wrap gap-4 text-dark">
                                  <div><strong>Medicine:</strong> {directive.medicine}</div>
                                  <div><strong>Frequency:</strong> {directive.frequency}</div>
                                  <div><strong>Duration:</strong> {directive.duration}</div>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                        {examsForBill.length > 0 && (
                          <div className="mt-2">
                            <div className="mb-2 text-dark"><strong>Examination</strong></div>
                            {examsForBill.map((exam, eIndex) => (
                              <div key={eIndex} className="d-flex flex-wrap gap-3 text-dark">
                                <div><strong>Blood Pressure:</strong> {exam.bp}</div>
                                <div><strong>Pulse:</strong> {exam.pulse}</div>
                                <div><strong>Past History:</strong> {exam.past_history}</div>
                                <div><strong>Complaints:</strong> {exam.complaints}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {ayurvedicExamination.length > 0 && (
                          <div className="mt-2">
                            <div className="mb-2 text-dark"><strong>Ayurvedic Examination</strong></div>
                            {ayurvedicExamination.map((exam, eIndex) => (
                              <div key={eIndex} className="d-flex flex-wrap gap-3 text-dark">
                                <div><strong>Occupation:</strong> {exam.occupation}</div>
                                <div><strong>Pincode:</strong> {exam.pincode}</div>
                                <div><strong>Past History:</strong> {exam.ayurPastHistory}</div>
                                {exam?.habits && Object.values(exam.habits).some(val => val && val !== '') && (
                                  <div>
                                    <strong>Habits:</strong>
                                    <ul style={{ marginLeft: '1rem', listStyleType: 'disc' }}>
                                      {Object.entries(exam.habits)
                                        .filter(([_, val]) => val && val !== '')
                                        .map(([key, val]) => (
                                          <li key={key}>
                                            {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}: {val}
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                )}
                                <div><strong>Lab Investigation:</strong> {exam.lab_investigation}</div>
                                <div><strong>LMP:</strong> {exam.lmp}</div>
                                <div><strong>EDD:</strong> {exam.edd}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </CAlert>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PastHistory;