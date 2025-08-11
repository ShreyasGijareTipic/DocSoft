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



// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   CCard, CCardBody, CRow, CCol, CForm, CFormInput, CButton, CInputGroup, CInputGroupText, CFormLabel
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilClock, cilCalendar, cilSettings, cilSearch, cilUser, cilInfo } from '@coreui/icons';
// import { getAPICall, post } from '../../../util/api';
// import { showToast } from '../toastContainer/toastContainer';

// const TokenAppointment = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { formDataa } = location.state || {};

//   // Move all state declarations to the top
//   const [patientName, setPatientName] = useState(formDataa?.patient_name || '');
//   const [patientAddress, setPatientAddress] = useState(formDataa?.patient_address || '');
//   const [email, setEmail] = useState(formDataa?.patient_email || '');
//   const [phone, setContactNumber] = useState(formDataa?.patient_contact || '');
//   const [dob, setDob] = useState(formDataa?.patient_dob || '');
//   const [occupation, setOccupation] = useState(formDataa?.occupation || '');
//   const [pincode, setPincode] = useState(formDataa?.pincode || '');
//   const [tokanPatientID, setTokanPatientID] = useState(null);
//   const [selectedOption, setSelectedOption] = useState('');
//   const [inputValue, setInputValue] = useState('');
//   const [data, setData] = useState(null);
//   const [patientSuggestionId, setPatientSuggestionId] = useState(null);
//   const [suggestions, setSuggestions] = useState([]);
//   const [isSuggestionClicked, setIsSuggestionClicked] = useState(false);
//   const [showPatientCard, setShowPatientCard] = useState(false);
//   const [lastBill, setLastBill] = useState([]);
//   const [healthDirectives, setHealthDirectives] = useState([]);
//   const [patientExaminations, setPatientExaminations] = useState([]);
//   const [ayurvedicExaminations, setAyurvedicExaminations] = useState([]);
//   const [isActive, setIsActive] = useState(false);
//   const [isActive1, setIsActive1] = useState(false);

//   // Fetch patient suggestions
//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       if (patientName.length >= 2 && !isSuggestionClicked) {
//         try {
//           const response = await getAPICall(`/api/suggestionPatient?query=${patientName}`);
//           setSuggestions(response.filter(p => p.id !== patientSuggestionId));
//         } catch (error) {
//           console.error('Error fetching suggestions:', error);
//         }
//       } else {
//         setSuggestions([]);
//       }
//       setIsSuggestionClicked(false);
//     };
//     fetchSuggestions();
//   }, [patientName, isSuggestionClicked, patientSuggestionId]);

//   // Handle dropdown selection
//   const handleDropdownSelect = (option) => {
//     setSelectedOption(option);
//     setInputValue('');
//     setData(null);
//     setIsActive(option === 'Appointment');
//     setIsActive1(option === 'Default');
//   };

//   // Handle input change
//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//   };

//   // Handle suggestion click
//   const handleSuggestionClick = async (patient) => {
//     setPatientSuggestionId(patient.id);
//     setPatientName(patient.name);
//     setPatientAddress(patient.address);
//     setContactNumber(patient.phone);
//     setEmail(patient.email);
//     setOccupation(patient.occupation);
//     setPincode(patient.pincode);
//     setDob(patient.dob);
//     setIsSuggestionClicked(true);
//     setSuggestions([]);
//     try {
//       const res = await getAPICall(`/api/patient-details/${patient.id}`);
//       setLastBill(res?.last_bill || []);
//       setHealthDirectives(res?.health_directives || []);
//       setPatientExaminations(res?.patient_examinations || []);
//       setAyurvedicExaminations(res?.ayurvedic_examintion || []);
//       setShowPatientCard(true);
//     } catch (error) {
//       console.error('Error fetching patient details:', error);
//       setShowPatientCard(false);
//     }
//   };

//   // Fetch patient data
//   const handleFetchData = async () => {
//     if (!inputValue) {
//       showToast('Please enter an ID.', 'Validation Error', '#d9534f');
//       return;
//     }

//     try {
//       let response, patientId;
//       let skipAddPatient = false;

//       if (selectedOption === 'Appointment') {
//         response = await getAPICall(`/api/getAppointmentByToken/${inputValue}`);
//         const tokenRes = await post('/api/checkToken', { tokan: inputValue });
//         patientId = tokenRes.patient_id;

//         if (!patientId && response?.phone) {
//           const phoneOnly10Digits = response.phone.slice(-10);
//           const matchResponse = await getAPICall(`/api/findByPhone/${phoneOnly10Digits}`);
//           patientId = matchResponse?.patient?.id;
//         }

//         setData(response);
//         setTokanPatientID(patientId || null);

//         if (patientId) {
//           const res = await getAPICall(`/api/patient-details/${patientId}`);
//           setLastBill(res?.last_bill || []);
//           setHealthDirectives(res?.health_directives || []);
//           setPatientExaminations(res?.patient_examinations || []);
//           setAyurvedicExaminations(res?.ayurvedic_examintion || []);
//           setShowPatientCard(true);
//         } else {
//           setLastBill([]);
//           setHealthDirectives([]);
//           setPatientExaminations([]);
//           setAyurvedicExaminations([]);
//           setShowPatientCard(true);
//         }
//       } else {
//         response = await post('/api/getPatientInfo', { tokan_number: inputValue });
//         patientId = response?.patient?.id;

//         if (!patientId) {
//           throw new Error('Patient ID not found in token response.');
//         }

//         setData(response);
//         setTokanPatientID(patientId);

//         const res = await getAPICall(`/api/patient-details/${patientId}`);
//         setLastBill(res?.last_bill || []);
//         setHealthDirectives(res?.health_directives || []);
//         setPatientExaminations(res?.patient_examinations || []);
//         setAyurvedicExaminations(res?.ayurvedic_examintion || []);
//         setShowPatientCard(true);
//       }

//       // Navigate to MedicalForm with fetched data
//       navigate('/PatientInformation', {
//         state: {
//           formDataa: {
//             patient_id: patientId,
//             patient_name: response?.patient?.name || response?.appointment?.name,
//             patient_address: response?.patient?.address,
//             patient_email: response?.patient?.email,
//             patient_contact: response?.patient?.phone || response?.appointment?.phone,
//             patient_dob: response?.patient?.dob,
//             occupation: response?.patient?.occupation,
//             pincode: response?.patient?.pincode,
//             visit_date: new Date().toISOString().split('T')[0],
//             last_bill: lastBill,
//             health_directives: healthDirectives,
//             patient_examinations: patientExaminations,
//             ayurvedic_examintion: ayurvedicExaminations,
//           },
//         },
//       });
//     } catch (error) {
//       console.error('Error fetching patient details:', error);
//       showToast('Failed to fetch data. Please check the ID and try again.', 'Validation Error', '#d9534f');
//       setData(null);
//       setShowPatientCard(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <CCardBody
//         className="bg-grey border rounded-4 p-4"
//         style={{
//           background: 'linear-gradient(135deg, #e0f7fa, #f0fdf4)',
//         }}
//       >
//         <CForm>
//           <CRow className="mb-1">
//             <CCol xs={12} sm={6} md={4}>
//               <CCard
//                 onClick={() => handleDropdownSelect('Token')}
//                 className={`mb-2 shadow-sm border-2 ${selectedOption === 'Token' ? 'border-primary' : 'border-primary'}`}
//                 style={{
//                   borderRadius: '1rem',
//                   backgroundColor: selectedOption === 'Token' ? '#eaf3ff' : '#f8f9fa',
//                   transition: '0.3s ease',
//                   cursor: 'pointer',
//                 }}
//               >
//                 <CCardBody className="d-flex align-items-center gap-3 py-2">
//                   <div
//                     className="d-flex align-items-center justify-content-center bg-white border border-primary"
//                     style={{
//                       width: '36px',
//                       height: '36px',
//                       borderRadius: '10px',
//                     }}
//                   >
//                     <CIcon icon={cilClock} size="lg" className="text-primary" />
//                   </div>
//                   <div>
//                     <div className="fw-semibold text-primary small">Walk-in Consultation</div>
//                     <div className="text-medium-emphasis" style={{ fontSize: '0.75rem' }}>
//                       Immediate medical attention
//                     </div>
//                   </div>
//                 </CCardBody>
//               </CCard>
//             </CCol>
//             <CCol xs={12} sm={6} md={4}>
//               <CCard
//                 onClick={() => handleDropdownSelect('Appointment')}
//                 className={`mb-2 shadow-sm border-2 ${isActive ? 'border-success' : 'border-success'}`}
//                 style={{
//                   borderRadius: '1rem',
//                   backgroundColor: isActive ? '#d4f7e4' : '#f8f9fa',
//                   transition: '0.3s ease',
//                   cursor: 'pointer',
//                 }}
//               >
//                 <CCardBody className="d-flex align-items-center gap-3 py-2">
//                   <div
//                     className="d-flex align-items-center justify-content-center bg-white border border-success"
//                     style={{
//                       width: '36px',
//                       height: '36px',
//                       borderRadius: '10px',
//                     }}
//                   >
//                     <CIcon icon={cilCalendar} size="lg" className="text-success" />
//                   </div>
//                   <div>
//                     <div className="fw-semibold text-success small">Scheduled Appointment</div>
//                     <div className="text-medium-emphasis" style={{ fontSize: '0.75rem' }}>
//                       Pre-booked consultation
//                     </div>
//                   </div>
//                 </CCardBody>
//               </CCard>
//             </CCol>
//             <CCol xs={12} sm={6} md={4}>
//               <CCard
//                 onClick={() => handleDropdownSelect('Default')}
//                 className={`mb-2 shadow-sm border-2 ${isActive1 ? 'border-primary' : 'border-primary'}`}
//                 style={{
//                   borderRadius: '1rem',
//                   backgroundColor: isActive1 ? '#f6efff' : '#f8f9fa',
//                   transition: '0.3s ease',
//                   cursor: 'pointer',
//                 }}
//               >
//                 <CCardBody className="d-flex align-items-center gap-3 py-2">
//                   <div
//                     className="d-flex align-items-center justify-content-center bg-white border border-primary"
//                     style={{
//                       width: '36px',
//                       height: '36px',
//                       borderRadius: '10px',
//                     }}
//                   >
//                     <CIcon icon={cilSettings} size="lg" style={{ color: '#8000ff' }} />
//                   </div>
//                   <div>
//                     <div className="fw-semibold" style={{ color: '#8000ff', fontSize: '0.95rem' }}>
//                       Default
//                     </div>
//                     <div className="text-medium-emphasis" style={{ fontSize: '0.75rem' }}>
//                       Default configuration
//                     </div>
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
//               className="fw-semibold px-0 p-2 ps-2 pe-2"
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
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormInput
//                       type="text"
//                       placeholder={`Enter ${selectedOption} ID`}
//                       value={inputValue}
//                       onChange={handleInputChange}
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
//                     <CIcon icon={cilSearch} className="me-2" />
//                     Search Patient
//                   </CButton>
//                 </CCol>
//               </CRow>
//               {selectedOption === 'Token' && (
//                 <CCard
//                   className="border-0 shadow-sm"
//                   style={{ backgroundColor: '#e9f2ff', borderLeft: '5px solid #3182ce' }}
//                 >
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
//         </CForm>
//       </CCardBody>
//     </div>
//   );
// };

// export default TokenAppointment;





import React, { useState } from 'react';
import {
  CCard, CCardBody, CRow, CCol, CForm, CFormInput, CButton, CInputGroup, CInputGroupText, CFormLabel
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilClock, cilCalendar, cilSettings, cilSearch, cilUser, cilInfo } from '@coreui/icons';
import { showToast } from '../toastContainer/toastContainer';

const TokenAppointment = ({
  setData, setShowPatientCard, setLastBill, setHealthDirectives, setPatientExaminations,
  setAyurvedicExaminations, setTokanPatientID, setPatientName, setPatientAddress, setEmail,
  setContactNumber, setDob, setOccupation, setPincode, setPatientSuggestionId, handleFetchData
}) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isActive1, setIsActive1] = useState(false);

  // Handle dropdown selection
  const handleDropdownSelect = (option) => {
    setSelectedOption(option);
    setInputValue('');
    setData(null);
    setIsActive(option === 'Appointment');
    setIsActive1(option === 'Default');
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="p-4">
      <CCardBody
        className="bg-grey border rounded-4 p-4"
        style={{
          background: 'linear-gradient(135deg, #e0f7fa, #f0fdf4)',
        }}
      >
        <CForm>
          <CRow className="mb-1">
            <CCol xs={12} sm={6} md={4}>
              <CCard
                onClick={() => handleDropdownSelect('Token')}
                className={`mb-2 shadow-sm border-2 ${selectedOption === 'Token' ? 'border-primary' : 'border-primary'}`}
                style={{
                  borderRadius: '1rem',
                  backgroundColor: selectedOption === 'Token' ? '#eaf3ff' : '#f8f9fa',
                  transition: '0.3s ease',
                  cursor: 'pointer',
                }}
              >
                <CCardBody className="d-flex align-items-center gap-3 py-2">
                  <div
                    className="d-flex align-items-center justify-content-center bg-white border border-primary"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                    }}
                  >
                    <CIcon icon={cilClock} size="lg" className="text-primary" />
                  </div>
                  <div>
                    <div className="fw-semibold text-primary small">Walk-in Consultation</div>
                    <div className="text-medium-emphasis" style={{ fontSize: '0.75rem' }}>
                      Immediate medical attention
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={12} sm={6} md={4}>
              <CCard
                onClick={() => handleDropdownSelect('Appointment')}
                className={`mb-2 shadow-sm border-2 ${isActive ? 'border-success' : 'border-success'}`}
                style={{
                  borderRadius: '1rem',
                  backgroundColor: isActive ? '#d4f7e4' : '#f8f9fa',
                  transition: '0.3s ease',
                  cursor: 'pointer',
                }}
              >
                <CCardBody className="d-flex align-items-center gap-3 py-2">
                  <div
                    className="d-flex align-items-center justify-content-center bg-white border border-success"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                    }}
                  >
                    <CIcon icon={cilCalendar} size="lg" className="text-success" />
                  </div>
                  <div>
                    <div className="fw-semibold text-success small">Scheduled Appointment</div>
                    <div className="text-medium-emphasis" style={{ fontSize: '0.75rem' }}>
                      Pre-booked consultation
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={12} sm={6} md={4}>
              <CCard
                onClick={() => handleDropdownSelect('Default')}
                className={`mb-2 shadow-sm border-2 ${isActive1 ? 'border-primary' : 'border-primary'}`}
                style={{
                  borderRadius: '1rem',
                  backgroundColor: isActive1 ? '#f6efff' : '#f8f9fa',
                  transition: '0.3s ease',
                  cursor: 'pointer',
                }}
              >
                <CCardBody className="d-flex align-items-center gap-3 py-2">
                  <div
                    className="d-flex align-items-center justify-content-center bg-white border border-primary"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                    }}
                  >
                    <CIcon icon={cilSettings} size="lg" style={{ color: '#8000ff' }} />
                  </div>
                  <div>
                    <div className="fw-semibold" style={{ color: '#8000ff', fontSize: '0.95rem' }}>
                      Default
                    </div>
                    <div className="text-medium-emphasis" style={{ fontSize: '0.75rem' }}>
                      Default configuration
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          {selectedOption && (
            <CButton
              onClick={() => {
                setSelectedOption('');
                setInputValue('');
              }}
              color="danger"
              variant="ghost"
              shape="rounded-pill"
              size="sm"
              className="fw-semibold px-0 p-2 ps-2 pe-2"
              title="Clear"
            >
              ✕ Clear Section
            </CButton>
          )}
          {selectedOption && (
            <>
              <CRow className="mb-3 align-items-end">
                <CCol md={6} lg={8}>
                  <CFormLabel className="fw-semibold mb-1">{selectedOption} ID</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder={`Enter ${selectedOption} ID`}
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={6} lg={4}>
                  <CButton
                    color="success"
                    className="w-100 mt-2 py-2 d-flex align-items-center justify-content-center"
                    style={{ borderRadius: '10px', fontWeight: 'bold' }}
                    onClick={() => handleFetchData(selectedOption, inputValue)}
                  >
                    <CIcon icon={cilSearch} className="me-2" />
                    Search Patient
                  </CButton>
                </CCol>
              </CRow>
              {selectedOption === 'Token' && (
                <CCard
                  className="border-0 shadow-sm"
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
        </CForm>
      </CCardBody>
    </div>
  );
};

export default TokenAppointment;
