// import React, { useState } from 'react';
// import {
//   CCard, CCardBody, CRow, CCol, CFormLabel, CInputGroup, CInputGroupText, CFormInput, CButton,
//   CForm
// } from '@coreui/react';
// import { cilClock, cilCalendar, cilSettings, cilUser, cilSearch, cilInfo } from '@coreui/icons';
// import { getAPICall, post } from '../../../util/api';
// import { showToast } from '../toastContainer/toastContainer';
// import { CIconSvg } from '@coreui/icons-react';


// const TokenAppointment = ({
//   selectedOption, setSelectedOption, inputValue, setInputValue, setData,
//   setShowPatientCard, setLastBill, setHealthdirectives, setPatientExaminations, setAyurvedicExaminations, setTokanPatientID
// }) => {
//   const handleDropdownSelect = (option) => {
//     setSelectedOption(option);
//     setInputValue('');
//     setData(null);
//   };

//   const handleFetchData = async () => {
//     if (!inputValue) {
//       showToast('Please enter an ID!', 'Validation Error', '#d9534f');
//       return;
//     }

//     try {
//       let response, patientId;
//       let skipAddPatient = false;

//       if (selectedOption === 'Appointment') {
//         const endpoint = `/api/getAppointmentByToken/${inputValue}`;
//         response = await getAPICall(endpoint);
//         const tokenRes = await post('/api/checkToken', { tokan: inputValue });
//         const appointmentPatientId = tokenRes.patient_id;

//         if (tokenRes.exists) {
//           skipAddPatient = true;
//         }
//         patientId = appointmentPatientId || response?.patient_id;

//         if (!patientId && response?.phone) {
//           const phoneOnly10Digits = response.phone.slice(-10);
//           try {
//             const matchResponse = await getAPICall(`/api/findByPhone/${phoneOnly10Digits}`);
//             if (matchResponse?.patient?.id) {
//               patientId = matchResponse.patient.id;
//               setLastBill(matchResponse?.last_bill || []);
//               setHealthdirectives(matchResponse?.health_directives || []);
//               setPatientExaminations(matchResponse?.patient_examinations || []);
//               setAyurvedicExaminations(matchResponse?.ayurvedic_examintion || []);
//             }
//           } catch (error) {
//             console.warn("No patient match found by phone.");
//           }
//         }

//         setData(response);
//         setTokanPatientID(patientId || null);

//         if (patientId) {
//           const res = await getAPICall(`/api/patient-details/${patientId}`);
//           setLastBill(res?.last_bill || []);
//           setHealthdirectives(res?.health_directives || []);
//           setPatientExaminations(res?.patient_examinations || []);
//           setAyurvedicExaminations(res?.ayurvedic_examintion || []);
//         } else {
//           setLastBill([]);
//           setHealthdirectives([]);
//           setPatientExaminations([]);
//           setAyurvedicExaminations([]);
//         }

//         setShowPatientCard(true);
//       } else {
//         const endpoint = `/api/getPatientInfo`;
//         response = await post(endpoint, { tokan_number: inputValue });
//         patientId = response?.patient?.id;

//         if (!patientId) {
//           throw new Error("Patient ID not found in token response.");
//         }

//         setData(response);
//         setTokanPatientID(patientId);

//         const res = await getAPICall(`/api/patient-details/${patientId}`);
//         setLastBill(res?.last_bill || []);
//         setHealthdirectives(res?.health_directives || []);
//         setPatientExaminations(res?.patient_examinations || []);
//         setAyurvedicExaminations(res?.ayurvedic_examintion || []);
//         setShowPatientCard(true);
//       }
//     } catch (error) {
//       console.error("Error fetching patient full details", error);
//       showToast('Failed to fetch data. Please check the ID and try again.', 'Validation Error', '#d9534f');
//       setData(null);
//       setShowPatientCard(false);
//     }
//   };

//   return (
//     <CCardBody className="bg-grey border rounded-4 p-4" style={{ background: 'linear-gradient(135deg, #e0f7fa, #f0fdf4)' }}>
//       <CForm>
//         <div className="flex flex-wrap gap-3 items-center mb-2">
//           <CRow className="mb-1">
//             <CCol xs={12} sm={6} md={4}>
//               <CCard
//                 onClick={() => handleDropdownSelect('Token')}
//                 className={`mb-2 shadow-sm border-2 ${selectedOption === 'Token' ? 'border-primary' : 'border-primary'}`}
//                 style={{ borderRadius: '1rem', backgroundColor: selectedOption === 'Token' ? '#eaf3ff' : '#f8f9fa', transition: '0.3s ease', cursor: 'pointer' }}
//               >
//                 <CCardBody className="d-flex align-items-center gap-3 py-2">
//                   <div className="d-flex align-items-center justify-content-center bg-white border border-primary" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
//                     <CIconSvg icon={cilClock} size="lg" className="text-primary" />
//                   </div>
//                   <div>
//                     <div className="fw-semibold text-primary small">Walk-in Consultation</div>
//                     <div className="text-medium-emphasis" style={{ fontSize: '0.75rem' }}>Immediate medical attention</div>
//                   </div>
//                 </CCardBody>
//               </CCard>
//             </CCol>
//             <CCol xs={12} sm={6} md={4}>
//               <CCard
//                 onClick={() => handleDropdownSelect('Appointment')}
//                 className={`mb-2 shadow-sm border-2 ${selectedOption === 'Appointment' ? 'border-success' : 'border-success'}`}
//                 style={{ borderRadius: '1rem', backgroundColor: selectedOption === 'Appointment' ? '#d4f7e4' : '#f8f9fa', transition: '0.3s ease', cursor: 'pointer' }}
//               >
//                 <CCardBody className="d-flex align-items-center gap-3 py-2">
//                   <div className="d-flex align-items-center justify-content-center bg-white border border-success" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
//                     {/* <CIcon icon={cilCalendar} size="lg" className="text-success" /> */}
//                   </div>
//                   <div>
//                     <div className="fw-semibold text-success small">Scheduled Appointment</div>
//                     <div className="text-medium-emphasis" style={{ fontSize: '0.75rem' }}>Pre-booked consultation</div>
//                   </div>
//                 </CCardBody>
//               </CCard>
//             </CCol>
//             <CCol xs={12} sm={6} md={4}>
//               <CCard
//                 className={`mb-2 shadow-sm border-2 ${selectedOption === 'Default' ? 'border-primary' : 'border-primary'}`}
//                 style={{ borderRadius: '1rem', backgroundColor: selectedOption === 'Default' ? '#f6efff' : '#f8f9fa', transition: '0.3s ease', cursor: 'pointer' }}
//               >
//                 <CCardBody className="d-flex align-items-center gap-3 py-2">
//                   <div className="d-flex align-items-center justify-content-center bg-white border border-primary" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
//                     {/* <CIcon icon={cilSettings} size="lg" style={{ color: '#8000ff' }} /> */}
//                   </div>
//                   <div>
//                     <div className="fw-semibold" style={{ color: '#8000ff', fontSize: '0.95rem' }}>Default</div>
//                     <div className="text-medium-emphasis" style={{ fontSize: '0.75rem' }}>Default configuration</div>
//                   </div>
//                 </CCardBody>
//               </CCard>
//             </CCol>
//           </CRow>

//           {selectedOption && (
//             <CButton
//               onClick={() => {
//                 setSelectedOption('');
//                 setInputValue('');
//               }}
//               color="danger"
//               variant="ghost"
//               shape="rounded-pill"
//               size="sm"
//               className="fw-semibold text-lg font-bold px-0 p-2 ps-2 pe-2"
//               title="Clear"
//             >
//               ✕ Clear Section
//             </CButton>
//           )}

//           {selectedOption && (
//             <>
//               <CRow className="mb-3 align-items-end">
//                 <CCol md={6} lg={8}>
//                   <CFormLabel className="fw-semibold mb-1">{selectedOption} ID</CFormLabel>
//                   <CInputGroup>
//                     <CInputGroupText>
//                       {/* <CIcon icon={cilUser} /> */}
//                     </CInputGroupText>
//                     <CFormInput
//                       type="text"
//                       placeholder={`Enter ${selectedOption} ID`}
//                       value={inputValue}
//                       onChange={(e) => setInputValue(e.target.value)}
//                     />
//                   </CInputGroup>
//                 </CCol>
//                 <CCol md={6} lg={4}>
//                   <CButton
//                     color="success"
//                     className="w-100 mt-2 py-2 d-flex align-items-center justify-content-center"
//                     style={{ borderRadius: '10px', fontWeight: 'bold' }}
//                     onClick={handleFetchData}
//                   >
//                     {/* <CIcon icon={cilSearch} className="me-2" /> */}
//                     Search Patient
//                   </CButton>
//                 </CCol>
//               </CRow>
//               {selectedOption === 'Token' && (
//                 <CCard className="border-0 shadow-sm" style={{ backgroundColor: '#e9f2ff', borderLeft: '5px solid #3182ce' }}>
//                   <CCardBody className="d-flex">
//                     <CIcon icon={cilInfo} className="text-primary me-3 mt-1" size="lg" />
//                     <div>
//                       <div className="fw-semibold text-primary mb-1">Token Information</div>
//                       <div className="text-muted">
//                         Token-based visits are processed in order of arrival. Please ensure the token number is valid.
//                       </div>
//                     </div>
//                   </CCardBody>
//                 </CCard>
//               )}
//             </>
//           )}
//         </div>
//       </CForm>
//     </CCardBody>
//   );
// };

// export default TokenAppointment;


import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
  CForm,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilInfo } from '@coreui/icons';

const PatientSearchForm = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setInputValue('');
    setFormVisible(false);
    setFormData(null);
  };

  const handleFetchData = async () => {
    if (!inputValue) return alert('Please enter ID');

    setFormVisible(false);
    setFormData(null);

    try {
      // Replace this with your actual API call
      const response = await fetch(`https://dummyjson.com/users/${inputValue}`);
      if (!response.ok) throw new Error('Patient not found');
      const data = await response.json();

      // Simulate checking patient data
      if (data && data.id) {
        setFormData(data);
        setFormVisible(true);
      } else {
        alert('Patient not found');
      }
    } catch (error) {
      console.error(error);
      alert('Patient not found');
    }
  };

  return (
    <CCard className="p-4 rounded-4 shadow-sm">
      <CForm>
        {/* Token Type Selection */}
        <CRow className="mb-4">
          <CCol md={6}>
            <CFormLabel className="fw-semibold">Search Patient By</CFormLabel>
            <select
              className="form-select"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <option value="">-- Select --</option>
              <option value="Token">Token</option>
              <option value="Mobile">Mobile</option>
              <option value="PatientId">Patient ID</option>
            </select>
          </CCol>
        </CRow>

        {/* Search Box and Button */}
        {selectedOption && (
          <>
            <CRow className="mb-3 align-items-end">
              <CCol md={8}>
                <CFormLabel className="fw-semibold mb-1">{selectedOption} ID</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>#</CInputGroupText>
                  <CFormInput
                    type="text"
                    placeholder={`Enter ${selectedOption} ID`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={4}>
                <CButton
                  color="success"
                  className="w-100 mt-2 py-2 d-flex align-items-center justify-content-center"
                  style={{ borderRadius: '10px', fontWeight: 'bold' }}
                  onClick={handleFetchData}
                >
                  Search Patient
                </CButton>
              </CCol>
            </CRow>

            {selectedOption === 'Token' && (
              <CCard
                className="border-0 shadow-sm mb-3"
                style={{ backgroundColor: '#e9f2ff', borderLeft: '5px solid #3182ce' }}
              >
                <CCardBody className="d-flex">
                  <CIcon icon={cilInfo} className="text-primary me-3 mt-1" size="lg" />
                  <div>
                    <div className="fw-semibold text-primary mb-1">Token Information</div>
                    <div className="text-muted">
                      Token-based visits are processed in order of arrival. Please ensure the token number is valid.
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            )}
          </>
        )}

        {/* Patient Form Shown Only If Found */}
        {formVisible && formData && (
          <CCard className="bg-white border-0 shadow-sm rounded-4 p-3 mt-4">
            <CCardBody>
              <h5 className="fw-bold text-primary mb-3">Patient Details</h5>
              <CRow>
                <CCol md={6} className="mb-3">
                  <strong>Full Name:</strong> {formData.firstName} {formData.lastName}
                </CCol>
                <CCol md={6} className="mb-3">
                  <strong>Email:</strong> {formData.email}
                </CCol>
                <CCol md={6} className="mb-3">
                  <strong>Phone:</strong> {formData.phone}
                </CCol>
                <CCol md={6} className="mb-3">
                  <strong>Age:</strong> {formData.age}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        )}
      </CForm>
    </CCard>
  );
};

export default PatientSearchForm;
