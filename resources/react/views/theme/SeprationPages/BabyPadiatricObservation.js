import React, { useState, useEffect } from 'react';
import {
  CCard, CRow, CCol, CFormLabel, CFormInput, CButton
} from '@coreui/react';
import { cilFile, cilPushchair } from '@coreui/icons';
import { getAPICall } from '../../../util/api'; // Assuming this is the same API utility
import CIcon from '@coreui/icons-react';

const BabyPediatricObservation = ({
  userData,
  type, // Assuming type is passed as a prop to determine visibility
  weightBaby, setWeightBaby,
  heightBaby, setHeightBaby,
  headCircumference, setHeadCircumference,
  temperature, setTemperature,
  heartRate, setHeartRate,
  respiratoryRate, setRespiratoryRate,
  vaccinationsGiven, setVaccinationsGiven,
  milestonesAchieved, setMilestonesAchieved,
  remarks, setRemarks
}) => {
  const [doctorObservationSettings, setDoctorObservationSettings] = useState(null);
  const [isPediatricExpanded, setIsPediatricExpanded] = useState(false);

  useEffect(() => {
    if (!userData?.user?.id) return;

    const fetchObservationSettings = async () => {
      try {
        const doctorId = userData.user.id;
        console.log("hdgsdystdyt",doctorId);
        
        const res = await getAPICall(`/api/doctor-medical-observations/${doctorId}`);
        const normalizedPediatric = Object.fromEntries(
          Object.entries(res.baby_pediatric || {}).map(([key, val]) => [key, Boolean(Number(val))])
        );
        setDoctorObservationSettings(normalizedPediatric);
      } catch (error) {
        console.error("Error fetching pediatric observation settings:", error);
      }
    };

    fetchObservationSettings();
  }, [userData?.user?.id]);

  const togglePediatricForm = () => setIsPediatricExpanded(!isPediatricExpanded);

  // Only show the button if type is 1
  // if (type !== 1) {
  //   return null;
  // }
  const hasAnyFieldEnabled = doctorObservationSettings 
  ? Object.values(doctorObservationSettings).some(Boolean) 
  : false;

if (type !== 1 || !hasAnyFieldEnabled) {
  return null;
}


  return (
    <CCard className="mb-2 mt-2 p-3 rounded-4 border border-gray-200" style={{ backgroundColor: '#F0F8FF' }}>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-start gap-1 gap-md-3 mb-2">
        <div className="d-flex align-items-center gap-2">
          <div className="d-flex align-items-center justify-content-center bg-white border border-primary" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
            <CIcon icon={cilPushchair} size="lg" className="text-primary" />
            
          </div>
          <h6 className="mb-0 fw-semibold">Pediatric Observations</h6>
        </div>
        <div className="d-flex flex-column flex-sm-column flex-md-row gap-2 mt-2 mt-md-0">
          <CButton
            color="light"
            className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-4"
            onClick={togglePediatricForm}
            style={{ border: '2px solid #CD5E77', backgroundColor: 'white', transition: 'background-color 0.3s' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F4C2C2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          >
            <span style={{ color: '#CD5E77' }}>
              🩺 {isPediatricExpanded ? 'Close' : 'Add Pediatric Observation'}
            </span>
          </CButton>
        </div>
      </div>

      {isPediatricExpanded && doctorObservationSettings && (
        <div className="p-2">
          <CRow className="mb-2">
            {doctorObservationSettings.weightBaby && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">Weight (Kg)</CFormLabel>
                <CFormInput
                  type="number"
                  value={weightBaby}
                  onChange={(e) => setWeightBaby(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                  min="0"
                />
              </CCol>
            )}
            {doctorObservationSettings.heightBaby && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">Height (Cm)</CFormLabel>
                <CFormInput
                  type="number"
                  value={heightBaby}
                  onChange={(e) => setHeightBaby(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                  min="0"
                />
              </CCol>
            )}
            {doctorObservationSettings.head_circumference && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">Head Circumference (Cm)</CFormLabel>
                <CFormInput
                  type="number"
                  value={headCircumference}
                  onChange={(e) => setHeadCircumference(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                  min="0"
                />
              </CCol>
            )}
            {doctorObservationSettings.temperature && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">Temperature (°C)</CFormLabel>
                <CFormInput
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                  min="0"
                />
              </CCol>
            )}
          </CRow>
          <CRow className="mb-2">
            {doctorObservationSettings.heart_rate && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">Heart Rate (bpm)</CFormLabel>
                <CFormInput
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                  min="0"
                />
              </CCol>
            )}
            {doctorObservationSettings.respiratory_rate && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">Respiratory Rate (breaths/min)</CFormLabel>
                <CFormInput
                  type="number"
                  value={respiratoryRate}
                  onChange={(e) => setRespiratoryRate(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                  min="0"
                />
              </CCol>
            )}
          </CRow>
          <CRow className="mb-2">
            {doctorObservationSettings.vaccinations_given && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">Vaccinations Given</CFormLabel>
                <CFormInput
                  type="text"
                  value={vaccinationsGiven}
                  onChange={(e) => setVaccinationsGiven(e.target.value)}
                />
              </CCol>
            )}
            {doctorObservationSettings.milestones_achieved && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">Milestones Achieved</CFormLabel>
                <CFormInput
                  type="text"
                  value={milestonesAchieved}
                  onChange={(e) => setMilestonesAchieved(e.target.value)}
                />
              </CCol>
            )}
          </CRow>
          <CRow className="mb-2">
            {doctorObservationSettings.remarks && (
              <CCol xs={12}>
                <CFormLabel className="fw-bold">Remarks</CFormLabel>
                <CFormInput
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </CCol>
            )}
          </CRow>
        </div>
      )}
    </CCard>
  );
};

export default BabyPediatricObservation;