
// import React, { useState } from 'react';
// import { CAlert, CButton } from '@coreui/react';

// const PastHistory = ({ showPatientCard, lastBill, healthDirectives, patientExaminations, ayurvedicExaminations }) => {
//   const [showAllHistory, setShowAllHistory] = useState(false);
//   const [expandedVisits, setExpandedVisits] = useState({});

//   const toggleVisitExpansion = (visitId) => {
//     setExpandedVisits(prev => ({ ...prev, [visitId]: !prev[visitId] }));
//   };

//   // Helper to check if ayurvedic examination has meaningful data
//   const hasMeaningfulAyurvedicData = (exam) => {
//     return (
//       exam.occupation ||
//       exam.pincode ||
//       exam.ayurPastHistory ||
//       exam.prasavvedan_parikshayein ||
//       (exam.habits && Object.values(exam.habits).some(val => val && val !== '')) ||
//       exam.lab_investigation ||
//       exam.personal_history ||
//       exam.food_and_drug_allergy ||
//       exam.drug_allery ||
//       exam.lmp ||
//       exam.edd
//     );
//   };

//   // Sort bills by visit_date in descending order
//   const sortedBills = Array.isArray(lastBill)
//     ? [...lastBill].sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date))
//     : [];

//   return (
//     <>
//       {showPatientCard && (
//         <>
//           <CAlert color="info" className="p-3 rounded shadow-sm mb-3 border border-secondary">
//             <div className="d-flex justify-content-between align-items-center">
//               <h5 className="mb-0 text-dark">Past History</h5>
//               <CButton
//                 color="light"
//                 size="sm"
//                 onClick={() => setShowAllHistory(!showAllHistory)}
//               >
//                 {showAllHistory ? '▲' : '▼'}
//               </CButton>
//             </div>
//           </CAlert>
//           {showAllHistory && (
//             <>
//               {sortedBills.length > 0 ? (
//                 sortedBills.map((bill, index) => {
//                   const directivesForBill = Array.isArray(healthDirectives)
//                     ? healthDirectives.filter(d => d.p_p_i_id === String(bill.id))
//                     : [];
//                   const examsForBill = Array.isArray(patientExaminations)
//                     ? patientExaminations.filter(e => e.p_p_i_id === String(bill.id))
//                     : [];
//                   const ayurvedicExamination = Array.isArray(ayurvedicExaminations)
//                     ? ayurvedicExaminations.filter(e => e.p_p_i_id === String(bill.id))
//                     : [];
//                   const isExpanded = expandedVisits[bill.id];

//                   return (
//                     <CAlert key={index} color="success" className="p-3 rounded shadow-sm mb-3 border border-dark">
//                       <div
//                         className="d-flex justify-content-between align-items-center"
//                         onClick={() => toggleVisitExpansion(bill.id)}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         <strong className="text-dark">
//                           Visit Date: {bill.visit_date || 'N/A'} (Dr. {bill.doctor_name || 'N/A'})
//                         </strong>
//                         <span>{isExpanded ? '▲' : '▼'}</span>
//                       </div>
//                       {isExpanded && (
//                         <div className="mt-2">
//                           <div className="mb-2 text-dark">
//                             <strong>Total:</strong> ₹{bill.grand_total || 'N/A'}
//                             {bill.followup_date && (
//                               <>
//                                 {' | '}
//                                 <strong>Follow-up:</strong> {bill.followup_date}
//                               </>
//                             )}
//                           </div>
//                           {directivesForBill.length > 0 && (
//                             <>
//                               <div className="mt-2 text-dark"><strong>Health Directives</strong></div>
//                               {directivesForBill.map((directive, dIndex) => (
//                                 <div key={dIndex} className="border-bottom pb-2 mb-2">
//                                   <div className="d-flex flex-wrap gap-3 text-dark">
//                                     {directive.medicine && <div><strong>Medicine:</strong> {directive.medicine}</div>}
//                                     {directive.strength && <div><strong>Strength:</strong> {directive.strength}</div>}
//                                     {directive.dosage && <div><strong>Dosage:</strong> {directive.dosage}</div>}
//                                     {directive.timing && <div><strong>Timing:</strong> {directive.timing}</div>}
//                                     {directive.frequency && <div><strong>Frequency:</strong> {directive.frequency}</div>}
//                                     {directive.duration && <div><strong>Duration:</strong> {directive.duration}</div>}
//                                   </div>
//                                 </div>
//                               ))}
//                             </>
//                           )}
//                           {examsForBill.length > 0 && (
//                             <div className="mt-2">
//                               <div className="mb-2 text-dark"><strong>Examination</strong></div>
//                               {examsForBill.map((exam, eIndex) => (
//                                 <div key={eIndex} className="d-flex flex-wrap gap-3 text-dark">
//                                   {exam.bp && <div><strong>Blood Pressure:</strong> {exam.bp}</div>}
//                                   {exam.pulse && <div><strong>Pulse:</strong> {exam.pulse}</div>}
//                                   {exam.past_history && <div><strong>Past History:</strong> {exam.past_history}</div>}
//                                   {exam.complaints && <div><strong>Complaints:</strong> {exam.complaints}</div>}
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                           {ayurvedicExamination.length > 0 && ayurvedicExamination.some(hasMeaningfulAyurvedicData) && (
//                             <div className="mt-2">
//                               <div className="mb-2 text-dark"><strong>Ayurvedic Examination</strong></div>
//                               {ayurvedicExamination.map((exam, eIndex) => (
//                                 <div key={eIndex} className="d-flex flex-wrap gap-3 text-dark">
//                                   {/* {exam.occupation && <div><strong>Occupation:</strong> {exam.occupation}</div>}
//                                   {exam.pincode && <div><strong>Pincode:</strong> {exam.pincode}</div>} */}
//                                   {exam.ayurPastHistory && <div><strong>Past History:</strong> {exam.ayurPastHistory}</div>}
//                                   {exam.prasavvedan_parikshayein && (
//   <div>
//     <strong>Prasavvedan Parikshayein:</strong>
//     <ul style={{ marginLeft: '1rem' }}>
//       {Object.entries(
//         typeof exam.prasavvedan_parikshayein === 'string'
//           ? JSON.parse(exam.prasavvedan_parikshayein)
//           : exam.prasavvedan_parikshayein
//       ).map(([key, value]) => (
//         <li key={key}>
//           {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}: {Array.isArray(value) ? value.join(', ') : value}
//         </li>
//       ))}
//     </ul>
//   </div>
// )}

//                                   {exam.habits && Object.values(exam.habits).some(val => val && val !== '') && (
//                                     <div>
//                                       <strong>Habits:</strong>
//                                       <ul style={{ marginLeft: '1rem', listStyleType: 'disc' }}>
//                                         {Object.entries(exam.habits)
//                                           .filter(([_, val]) => val && val !== '')
//                                           .map(([key, val]) => (
//                                             <li key={key}>
//                                               {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}: {val}
//                                             </li>
//                                           ))}
//                                       </ul>
//                                     </div>
//                                   )}
//                                   {exam.lab_investigation && <div><strong>Lab Investigation:</strong> {exam.lab_investigation}</div>}
//                                   {exam.personal_history && <div><strong>Personal History:</strong> {exam.personal_history}</div>}
//                                   {exam.food_and_drug_allergy && (
//                                     <div><strong>Food/Drug Allergy:</strong> {exam.food_and_drug_allergy}</div>
//                                   )}
//                                   {exam.drug_allery && <div><strong>Drug Allergy:</strong> {exam.drug_allery}</div>}
//                                   {exam.lmp && <div><strong>LMP:</strong> {exam.lmp}</div>}
//                                   {exam.edd && <div><strong>EDD:</strong> {exam.edd}</div>}
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                           {directivesForBill.length === 0 && examsForBill.length === 0 && !ayurvedicExamination.some(hasMeaningfulAyurvedicData) && (
//                             <div className="mt-2 text-dark">No medical data available for this visit.</div>
//                           )}
//                         </div>
//                       )}
//                     </CAlert>
//                   );
//                 })
//               ) : (
//                 <CAlert color="warning" className="p-2 rounded shadow-sm mb-3">
//                   No past history available for this patient.
//                 </CAlert>
//               )}
//             </>
//           )}
//         </>
//       )}
//     </>
//   );
// };

// export default PastHistory;


import React, { useState } from 'react';
import {
  CAlert, CButton, CRow, CCol, CFormInput, CFormSelect, CFormCheck, CFormLabel
} from '@coreui/react';

const PastHistory = ({
  showPatientCard,
  lastBill,
  healthDirectives,
  patientExaminations,
  ayurvedicExaminations,
  setBp,
  setPulse,
  setPastHistory,
  setComplaints,
  setSysExGeneral,
  setSysExPA,
  setWeight,
  setHeight,
  setEmaill,
  setAyurPastHistory,
  setHabits,
  setLabInvestigation,
  setPersonalHistory,
  setFoodAndDrugAllergy,
  setDrugAllergy,
  setLmp,
  setEdd,
  setAshtvidhData,
  rowss = [], // Default to empty array to prevent undefined
  setRowss,
  medicines,
  setMedicineSearch
}) => {
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [expandedVisits, setExpandedVisits] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Sort bills by visit_date in descending order
  const sortedBills = Array.isArray(lastBill)
    ? [...lastBill].sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date))
    : [];

  // Toggle visit expansion
  const toggleVisitExpansion = (visitId) => {
    setExpandedVisits(prev => ({ ...prev, [visitId]: !prev[visitId] }));
  };

  // Handle autofill for a visit (examinations and prescriptions)
  const handleAutofill = (billId) => {
    const examsForBill = patientExaminations.filter(e => e.p_p_i_id === String(billId));
    const ayurvedicExams = ayurvedicExaminations.filter(e => e.p_p_i_id === String(billId));
    const prescriptions = healthDirectives.filter(d => d.p_p_i_id === String(billId));
    const examRecord = examsForBill[0] || ayurvedicExams[0]; // Prioritize medical

    if (!examRecord && prescriptions.length === 0) {
      setSelectedRecord(null);
      return;
    }

    const type = examsForBill[0] ? 'medical' : (ayurvedicExams[0] ? 'ayurvedic' : 'prescriptions_only');
    setSelectedRecord({ type, examData: examRecord, prescriptions, billId });

    // Autofill examination data
    if (examRecord) {
      if (type === 'medical') {
        setBp(examRecord.bp || '');
        setPulse(examRecord.pulse || '');
        setPastHistory(examRecord.past_history || '');
        setComplaints(examRecord.complaints || '');
        setSysExGeneral(examRecord.systemic_exam_general || '');
        setSysExPA(examRecord.systemic_exam_pa || '');
        setWeight(examRecord.weight || '');
        setHeight(examRecord.height || '');
        setEmaill('');
        setAyurPastHistory('');
        setLabInvestigation('');
        setFoodAndDrugAllergy('');
        setDrugAllergy('');
        setLmp('');
        setEdd('');
        setHabits({ alcohol: '', cold_drink: '', fast_food: '', salty_food: '', tobbacco: '', chocolate: '', drug_addict: '', late_night_sleep: '', smoking: '', coffee: '', eating_habits: '', pan_masala: '', tea: '' });
        setPersonalHistory({ diet: '', appetite: '', sleep: '', thirst: '', bowel: '', micturition: '' });
        setAshtvidhData({ nadi: [], jihva: [], mala: [], mutra: [], netra: [], aakruti: [], shabda: [], sparsha: [] });
      } else {
        setEmaill(examRecord.email || '');
        setAyurPastHistory(examRecord.ayurPastHistory || '');
        setLabInvestigation(examRecord.lab_investigation || '');
        setFoodAndDrugAllergy(examRecord.food_and_drug_allergy || '');
        setDrugAllergy(examRecord.drug_allery || '');
        setLmp(examRecord.lmp || '');
        setEdd(examRecord.edd || '');
        try {
          setHabits(JSON.parse(examRecord.habits) || {
            alcohol: '', cold_drink: '', fast_food: '', salty_food: '',
            tobbacco: '', chocolate: '', drug_addict: '', late_night_sleep: '',
            smoking: '', coffee: '', eating_habits: '', pan_masala: '', tea: ''
          });
          setPersonalHistory(JSON.parse(examRecord.personal_history) || {
            diet: '', appetite: '', sleep: '', thirst: '', bowel: '', micturition: ''
          });
          setAshtvidhData(JSON.parse(examRecord.ashtvidh_parikshayein) || {
            nadi: [], jihva: [], mala: [], mutra: [], netra: [], aakruti: [], shabda: [], sparsha: []
          });
        } catch (error) {
          console.error('Error parsing JSON data:', error);
        }
        setBp('');
        setPulse('');
        setPastHistory('');
        setComplaints('');
        setSysExGeneral('');
        setSysExPA('');
        setWeight('');
        setHeight('');
      }
    } else {
      // Reset examination fields if only prescriptions are available
      setBp('');
      setPulse('');
      setPastHistory('');
      setComplaints('');
      setSysExGeneral('');
      setSysExPA('');
      setWeight('');
      setHeight('');
      setEmaill('');
      setAyurPastHistory('');
      setLabInvestigation('');
      setFoodAndDrugAllergy('');
      setDrugAllergy('');
      setLmp('');
      setEdd('');
      setHabits({ alcohol: '', cold_drink: '', fast_food: '', salty_food: '', tobbacco: '', chocolate: '', drug_addict: '', late_night_sleep: '', smoking: '', coffee: '', eating_habits: '', pan_masala: '', tea: '' });
      setPersonalHistory({ diet: '', appetite: '', sleep: '', thirst: '', bowel: '', micturition: '' });
      setAshtvidhData({ nadi: [], jihva: [], mala: [], mutra: [], netra: [], aakruti: [], shabda: [], sparsha: [] });
    }

    // Autofill prescription data with validation
    const updatedRows = prescriptions.map((p, index) => {
      const medicine = medicines.find(med => med.drug_name.toLowerCase() === p.medicine.toLowerCase());
      setMedicineSearch(prev => ({ ...prev, [index]: p.medicine })); // Update medicineSearch for validation
      return {
        description: medicine ? String(medicine.id) : p.medicine, // Use drug_id if available, else drug name
        medicine: p.medicine || '', // Store drug name for submission
        strength: p.strength || '',
        dosage: p.dosage || '',
        timing: p.timing || '',
        frequency: p.frequency || '',
        duration: p.duration || '',
        isCustom: p.duration === 'SOS',
        price: p.price || '0', // Ensure price is included
        drugDetails: medicine ? [{ drug_id: medicine.id, price: p.price || '0' }] : []
      };
    });

    setRowss(updatedRows); // Update rowss state for submission
  };

  // Handle changes to examination fields
  const handleFieldChange = (field, value) => {
    if (selectedRecord?.type === 'medical') {
      switch (field) {
        case 'bp': setBp(value); break;
        case 'pulse': setPulse(value); break;
        case 'past_history': setPastHistory(value); break;
        case 'complaints': setComplaints(value); break;
        case 'systemic_exam_general': setSysExGeneral(value); break;
        case 'systemic_exam_pa': setSysExPA(value); break;
        case 'weight': setWeight(value); break;
        case 'height': setHeight(value); break;
        default: break;
      }
    } else if (selectedRecord?.type === 'ayurvedic') {
      switch (field) {
        case 'email': setEmaill(value); break;
        case 'ayurPastHistory': setAyurPastHistory(value); break;
        case 'lab_investigation': setLabInvestigation(value); break;
        case 'food_and_drug_allergy': setFoodAndDrugAllergy(value); break;
        case 'drug_allery': setDrugAllergy(value); break;
        case 'lmp': setLmp(value); break;
        case 'edd': setEdd(value); break;
        default: break;
      }
    }
  };

  // Handle checkbox changes for habits, personal history, and ashtvidh
  const handleCheckboxChange = (category, key, value) => {
    if (category === 'habits') {
      setHabits((prev) => ({
        ...prev,
        [key]: prev[key] === value ? '' : value
      }));
    } else if (category === 'personal_history') {
      setPersonalHistory((prev) => ({
        ...prev,
        [key]: prev[key] === value ? '' : value
      }));
    } else if (category === 'ashtvidh') {
      setAshtvidhData((prev) => {
        const currentValues = prev[key] || [];
        const updatedValues = currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value];
        return { ...prev, [key]: updatedValues };
      });
    }
  };

  // Handle changes to prescription fields
  const handlePrescriptionChange = (index, field, value) => {
    setRowss((prev) => {
      const updatedRows = [...prev];
      // Ensure the index exists in updatedRows
      if (!updatedRows[index]) {
        updatedRows[index] = {
          description: '',
          medicine: '',
          strength: '',
          dosage: '',
          timing: '',
          frequency: '',
          duration: '',
          isCustom: false,
          price: '0',
          drugDetails: []
        };
      }
      updatedRows[index] = { ...updatedRows[index], [field]: value };
      if (field === 'medicine') {
        const medicine = medicines.find(med => med.drug_name.toLowerCase() === value.toLowerCase());
        updatedRows[index].description = medicine ? String(medicine.id) : value;
        updatedRows[index].drugDetails = medicine ? [{ drug_id: medicine.id, price: updatedRows[index].price || '0' }] : [];
        setMedicineSearch(prev => ({ ...prev, [index]: value }));
      }
      if (field === 'duration') {
        updatedRows[index].isCustom = value === 'SOS';
      }
      return updatedRows;
    });
  };

  // Check for meaningful ayurvedic data
  const hasMeaningfulAyurvedicData = (exam) => {
    return (
      exam.ayurPastHistory ||
      exam.lab_investigation ||
      exam.food_and_drug_allergy ||
      exam.drug_allery ||
      exam.lmp ||
      exam.edd ||
      (exam.habits && Object.values(JSON.parse(exam.habits || '{}')).some(val => val && val !== '')) ||
      (exam.personal_history && Object.values(JSON.parse(exam.personal_history || '{}')).some(val => val && val !== '')) ||
      (exam.ashtvidh_parikshayein && Object.values(JSON.parse(exam.ashtvidh_parikshayein || '{}')).some(val => Array.isArray(val) && val.length > 0))
    );
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
                style={{ borderRadius: '8px' }}
              >
                {showAllHistory ? '▲' : '▼'}
              </CButton>
            </div>
          </CAlert>
          {showAllHistory && (
            <>
              {sortedBills.length > 0 ? (
                sortedBills.map((bill, index) => {
                  const directivesForBill = Array.isArray(healthDirectives)
                    ? healthDirectives.filter(d => d.p_p_i_id === String(bill.id))
                    : [];
                  const examsForBill = Array.isArray(patientExaminations)
                    ? patientExaminations.filter(e => e.p_p_i_id === String(bill.id))
                    : [];
                  const ayurvedicExams = Array.isArray(ayurvedicExaminations)
                    ? ayurvedicExaminations.filter(e => e.p_p_i_id === String(bill.id))
                    : [];
                  const isExpanded = expandedVisits[bill.id];

                  return (
                    <CAlert key={index} color="success" className="p-3 rounded shadow-sm mb-3 border border-dark">
                      <div
                        className="d-flex justify-content-between align-items-center"
                        onClick={() => toggleVisitExpansion(bill.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <strong className="text-dark">
                          Visit Date: {bill.visit_date || 'N/A'} (Dr. {bill.doctor_name || 'N/A'})
                        </strong>
                        <span>{isExpanded ? '▲' : '▼'}</span>
                      </div>
                      {isExpanded && (
                        <div className="mt-2">
                          <div className="mb-2 text-dark">
                            <strong>Total:</strong> ₹{bill.grand_total || 'N/A'}
                            {bill.followup_date && (
                              <>
                                {' | '}
                                <strong>Follow-up:</strong> {bill.followup_date}
                              </>
                            )}
                          </div>
                          {(examsForBill.length > 0 || ayurvedicExams.length > 0 || directivesForBill.length > 0) && (
                            <CButton
                              color="primary"
                              size="sm"
                              className="mb-2"
                              onClick={() => handleAutofill(bill.id)}
                              style={{ borderRadius: '8px', padding: '4px 8px' }}
                            >
                              Autofill
                            </CButton>
                          )}
                          {selectedRecord && selectedRecord.billId === bill.id && (
                            <div className="mt-2 p-2 rounded border border-primary" style={{ backgroundColor: '#E6F3FF' }}>
                              {selectedRecord.examData && (
                                <>
                                  <h6 className="fw-bold mb-2 text-primary">
                                    {selectedRecord.type === 'medical' ? 'Medical Examination' : 'Ayurvedic Examination'}
                                  </h6>
                                  {selectedRecord.type === 'medical' ? (
                                    <CRow className="g-2">
                                      <CCol xs={12} sm={6}>
                                        <CFormLabel className="fw-bold">BP</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={selectedRecord.examData.bp || ''}
                                          onChange={(e) => handleFieldChange('bp', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12} sm={6}>
                                        <CFormLabel className="fw-bold">Pulse</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={selectedRecord.examData.pulse || ''}
                                          onChange={(e) => handleFieldChange('pulse', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12} sm={6}>
                                        <CFormLabel className="fw-bold">Weight (Kg)</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          type="number"
                                          value={selectedRecord.examData.weight || ''}
                                          onChange={(e) => handleFieldChange('weight', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12} sm={6}>
                                        <CFormLabel className="fw-bold">Height (Cm)</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          type="number"
                                          value={selectedRecord.examData.height || ''}
                                          onChange={(e) => handleFieldChange('height', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12}>
                                        <CFormLabel className="fw-bold">Past History</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={selectedRecord.examData.past_history || ''}
                                          onChange={(e) => handleFieldChange('past_history', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12}>
                                        <CFormLabel className="fw-bold">Complaints</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={selectedRecord.examData.complaints || ''}
                                          onChange={(e) => handleFieldChange('complaints', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12}>
                                        <CFormLabel className="fw-bold">Systemic Exam General</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={selectedRecord.examData.systemic_exam_general || ''}
                                          onChange={(e) => handleFieldChange('systemic_exam_general', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12}>
                                        <CFormLabel className="fw-bold">Diagnosis</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={selectedRecord.examData.systemic_exam_pa || ''}
                                          onChange={(e) => handleFieldChange('systemic_exam_pa', e.target.value)}
                                        />
                                      </CCol>
                                    </CRow>
                                  ) : (
                                    <CRow className="g-2">
                                      <CCol xs={12} sm={6}>
                                        <CFormLabel className="fw-bold">Email</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={selectedRecord.examData.email || ''}
                                          onChange={(e) => handleFieldChange('email', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12} sm={6}>
                                        <CFormLabel className="fw-bold">Past History</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={selectedRecord.examData.ayurPastHistory || ''}
                                          onChange={(e) => handleFieldChange('ayurPastHistory', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12} sm={6}>
                                        <CFormLabel className="fw-bold">Investigation</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={selectedRecord.examData.lab_investigation || ''}
                                          onChange={(e) => handleFieldChange('lab_investigation', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12} sm={6}>
                                        <CFormLabel className="fw-bold">Food & Drug Allergy</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={selectedRecord.examData.food_and_drug_allergy || ''}
                                          onChange={(e) => handleFieldChange('food_and_drug_allergy', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12} sm={6}>
                                        <CFormLabel className="fw-bold">Drug Allergy</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={selectedRecord.examData.drug_allery || ''}
                                          onChange={(e) => handleFieldChange('drug_allery', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12} sm={6}>
                                        <CFormLabel className="fw-bold">LMP</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          type="date"
                                          value={selectedRecord.examData.lmp || ''}
                                          onChange={(e) => handleFieldChange('lmp', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12} sm={6}>
                                        <CFormLabel className="fw-bold">EDD</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          type="date"
                                          value={selectedRecord.examData.edd || ''}
                                          onChange={(e) => handleFieldChange('edd', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12}>
                                        <CFormLabel className="fw-bold">Habits</CFormLabel>
                                        <CRow className="g-2">
                                          {['alcohol', 'smoking', 'coffee'].map((habit) => (
                                            <CCol xs={12} sm={4} key={habit}>
                                              <CFormLabel>{habit.replace('_', ' ').toUpperCase()}</CFormLabel>
                                              <CFormSelect
                                                size="sm"
                                                value={habits[habit] || ''}
                                                onChange={(e) => handleCheckboxChange('habits', habit, e.target.value)}
                                              >
                                                <option value="">Select</option>
                                                {['Normal', 'Moderate', 'Heavy'].map((option) => (
                                                  <option key={option} value={option}>{option}</option>
                                                ))}
                                              </CFormSelect>
                                            </CCol>
                                          ))}
                                        </CRow>
                                      </CCol>
                                      <CCol xs={12}>
                                        <CFormLabel className="fw-bold">Personal History</CFormLabel>
                                        <CRow className="g-2">
                                          {['diet', 'sleep', 'bowel'].map((field) => (
                                            <CCol xs={12} sm={4} key={field}>
                                              <CFormLabel>{field.toUpperCase()}</CFormLabel>
                                              <CFormSelect
                                                size="sm"
                                                value={personalHistory[field] || ''}
                                                onChange={(e) => handleCheckboxChange('personal_history', field, e.target.value)}
                                              >
                                                <option value="">Select</option>
                                                {field === 'diet' ? ['Vegetarian', 'Non-Vegetarian', 'Mixed'] :
                                                 field === 'sleep' ? ['Sound', 'Interrupted', 'Insomnia'] :
                                                 ['Regular', 'Irregular', 'Constipated'].map((option) => (
                                                  <option key={option} value={option}>{option}</option>
                                                ))}
                                              </CFormSelect>
                                            </CCol>
                                          ))}
                                        </CRow>
                                      </CCol>
                                      <CCol xs={12}>
                                        <CFormLabel className="fw-bold">Ashtvidh Parikshayein</CFormLabel>
                                        <CRow className="g-2">
                                          {['nadi', 'jihva', 'mala'].map((key) => (
                                            <CCol xs={12} sm={4} key={key}>
                                              <CFormLabel>{key.toUpperCase()}</CFormLabel>
                                              <div className="d-flex flex-wrap gap-2">
                                                {(key === 'nadi' ? ['वात', 'पित', 'कफ'] :
                                                  key === 'jihva' ? ['साम', 'निराम', 'शुष्क'] :
                                                  ['सविबन्ध', 'द्रव', 'सम्यक्']).map((option) => (
                                                    <CFormCheck
                                                      key={option}
                                                      label={option}
                                                      checked={ashtvidhData[key]?.includes(option)}
                                                      onChange={() => handleCheckboxChange('ashtvidh', key, option)}
                                                    />
                                                  ))}
                                              </div>
                                            </CCol>
                                          ))}
                                        </CRow>
                                      </CCol>
                                    </CRow>
                                  )}
                                </>
                              )}
                              {selectedRecord.prescriptions.length > 0 && (
                                <>
                                  <h6 className="fw-bold mb-2 mt-3 text-primary">Prescriptions</h6>
                                  {selectedRecord.prescriptions.map((prescription, index) => (
                                    <CRow key={index} className="g-2 mb-2 border-bottom pb-2">
                                      <CCol xs={12} sm={4}>
                                        <CFormLabel className="fw-bold">Medicine</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={(rowss[index] && rowss[index].medicine) || prescription.medicine || ''}
                                          onChange={(e) => handlePrescriptionChange(index, 'medicine', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12} sm={4}>
                                        <CFormLabel className="fw-bold">Strength</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={(rowss[index] && rowss[index].strength) || prescription.strength || ''}
                                          onChange={(e) => handlePrescriptionChange(index, 'strength', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12} sm={4}>
                                        <CFormLabel className="fw-bold">Dosage</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={(rowss[index] && rowss[index].dosage) || prescription.dosage || ''}
                                          onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12} sm={4}>
                                        <CFormLabel className="fw-bold">Timing</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={(rowss[index] && rowss[index].timing) || prescription.timing || ''}
                                          onChange={(e) => handlePrescriptionChange(index, 'timing', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12} sm={4}>
                                        <CFormLabel className="fw-bold">Frequency</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={(rowss[index] && rowss[index].frequency) || prescription.frequency || ''}
                                          onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)}
                                        />
                                      </CCol>
                                      <CCol xs={12} sm={4}>
                                        <CFormLabel className="fw-bold">Duration</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={(rowss[index] && rowss[index].duration) || prescription.duration || ''}
                                          onChange={(e) => handlePrescriptionChange(index, 'duration', e.target.value)}
                                        />
                                      </CCol>
                                    </CRow>
                                  ))}
                                </>
                              )}
                            </div>
                          )}
                          {directivesForBill.length > 0 && (
                            <>
                              <div className="mt-2 text-dark"><strong>Health Directives</strong></div>
                              {directivesForBill.map((directive, dIndex) => (
                                <div key={dIndex} className="border-bottom pb-2 mb-2">
                                  <div className="d-flex flex-wrap gap-3 text-dark">
                                    {directive.medicine && <div><strong>Medicine:</strong> {directive.medicine}</div>}
                                    {directive.strength && <div><strong>Strength:</strong> {directive.strength}</div>}
                                    {directive.dosage && <div><strong>Dosage:</strong> {directive.dosage}</div>}
                                    {directive.timing && <div><strong>Timing:</strong> {directive.timing}</div>}
                                    {directive.frequency && <div><strong>Frequency:</strong> {directive.frequency}</div>}
                                    {directive.duration && <div><strong>Duration:</strong> {directive.duration}</div>}
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                          {examsForBill.length > 0 && (
                            <div className="mt-2">
                              <div className="mb-2 text-dark"><strong>Medical Examination</strong></div>
                              {examsForBill.map((exam, eIndex) => (
                                <div key={eIndex} className="d-flex flex-wrap gap-3 text-dark">
                                  {exam.bp && <div><strong>Blood Pressure:</strong> {exam.bp}</div>}
                                  {exam.pulse && <div><strong>Pulse:</strong> {exam.pulse}</div>}
                                  {exam.weight && <div><strong>Weight:</strong> {exam.weight}</div>}
                                  {exam.height && <div><strong>Height:</strong> {exam.height}</div>}
                                  {exam.past_history && <div><strong>Past History:</strong> {exam.past_history}</div>}
                                  {exam.complaints && <div><strong>Complaints:</strong> {exam.complaints}</div>}
                                  {exam.systemic_exam_general && <div><strong>Systemic Exam General:</strong> {exam.systemic_exam_general}</div>}
                                  {exam.systemic_exam_pa && <div><strong>Diagnosis:</strong> {exam.systemic_exam_pa}</div>}
                                </div>
                              ))}
                            </div>
                          )}
                          {ayurvedicExams.length > 0 && ayurvedicExams.some(hasMeaningfulAyurvedicData) && (
                            <div className="mt-2">
                              <div className="mb-2 text-dark"><strong>Ayurvedic Examination</strong></div>
                              {ayurvedicExams.map((exam, eIndex) => (
                                <div key={eIndex} className="d-flex flex-wrap gap-3 text-dark">
                                  {exam.ayurPastHistory && <div><strong>Past History:</strong> {exam.ayurPastHistory}</div>}
                                  {exam.lab_investigation && <div><strong>Lab Investigation:</strong> {exam.lab_investigation}</div>}
                                  {exam.food_and_drug_allergy && <div><strong>Food/Drug Allergy:</strong> {exam.food_and_drug_allergy}</div>}
                                  {exam.drug_allery && <div><strong>Drug Allergy:</strong> {exam.drug_allery}</div>}
                                  {exam.lmp && <div><strong>LMP:</strong> {exam.lmp}</div>}
                                  {exam.edd && <div><strong>EDD:</strong> {exam.edd}</div>}
                                  {exam.habits && Object.values(JSON.parse(exam.habits || '{}')).some(val => val && val !== '') && (
                                    <div>
                                      <strong>Habits:</strong>
                                      <ul style={{ marginLeft: '1rem', listStyleType: 'disc' }}>
                                        {Object.entries(JSON.parse(exam.habits || '{}'))
                                          .filter(([_, val]) => val && val !== '')
                                          .map(([key, val]) => (
                                            <li key={key}>
                                              {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}: {val}
                                            </li>
                                          ))}
                                      </ul>
                                    </div>
                                  )}
                                  {exam.personal_history && Object.values(JSON.parse(exam.personal_history || '{}')).some(val => val && val !== '') && (
                                    <div>
                                      <strong>Personal History:</strong>
                                      <ul style={{ marginLeft: '1rem', listStyleType: 'disc' }}>
                                        {Object.entries(JSON.parse(exam.personal_history || '{}'))
                                          .filter(([_, val]) => val && val !== '')
                                          .map(([key, val]) => (
                                            <li key={key}>
                                              {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}: {val}
                                            </li>
                                          ))}
                                      </ul>
                                    </div>
                                  )}
                                  {exam.ashtvidh_parikshayein && Object.values(JSON.parse(exam.ashtvidh_parikshayein || '{}')).some(val => Array.isArray(val) && val.length > 0) && (
                                    <div>
                                      <strong>Ashtvidh Parikshayein:</strong>
                                      <ul style={{ marginLeft: '1rem', listStyleType: 'disc' }}>
                                        {Object.entries(JSON.parse(exam.ashtvidh_parikshayein || '{}'))
                                          .filter(([_, val]) => Array.isArray(val) && val.length > 0)
                                          .map(([key, val]) => (
                                            <li key={key}>
                                              {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}: {val.join(', ')}
                                            </li>
                                          ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          {directivesForBill.length === 0 && examsForBill.length === 0 && !ayurvedicExams.some(hasMeaningfulAyurvedicData) && (
                            <div className="mt-2 text-dark">No medical data available for this visit.</div>
                          )}
                        </div>
                      )}
                    </CAlert>
                  );
                })
              ) : (
                <CAlert color="warning" className="p-2 rounded shadow-sm mb-3">
                  No past history available for this patient.
                </CAlert>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default PastHistory;