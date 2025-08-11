
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   CCardBody, CRow, CCol, CButton, CForm, CFormInput
// } from '@coreui/react';
// import { getAPICall, post } from '../../../util/api';
// import { getUser } from '../../../util/session';
// import { showToast } from '../toastContainer/toastContainer';
// import TokenAppointment from './TokenAppointment';
// import PatientInformation from './PatientInformation';
// import PastHistory from './PastHistory';
// import MedicalObservations from './MedicalObservations';
// import MedicalPrescriptions from './MedicalPrescriptions';
// import BillingDetails from './BillingDetails';

// const MainPage = () => {
//   const today = new Date().toISOString().split('T')[0];
//   const user = getUser();
//   const location = useLocation();
//   const { formDataa } = location.state || {};
//   const navigate = useNavigate();

//   // Shared state
//   const [patientName, setPatientName] = useState(formDataa?.patient_name || '');
//   const [patientAddress, setPatientAddress] = useState(formDataa?.patient_address || '');
//   const [email, setEmail] = useState(formDataa?.patient_email || '');
//   const [phone, setContactNumber] = useState(formDataa?.patient_contact || '');
//   const [dob, setDob] = useState(formDataa?.patient_dob || '');
//   const [occupation, setOccupation] = useState(formDataa?.occupation || '');
//   const [pincode, setPincode] = useState(formDataa?.pincode || '');
//   const [visitDate, setVisitDate] = useState(formDataa?.visit_date || today);
//   const [followupdate, setFollowupdate] = useState('');
//   const [patientSuggestionId, setPatientSuggestionId] = useState(null);
//   const [lastBill, setLastBill] = useState(formDataa?.last_bill || []);
//   const [healthDirectives, setHealthDirectives] = useState(formDataa?.health_directives || []);
//   const [patientExaminations, setPatientExaminations] = useState(formDataa?.patient_examinations || []);
//   const [ayurvedicExaminations, setAyurvedicExaminations] = useState(formDataa?.ayurvedic_examintion || []);
//   const [showPatientCard, setShowPatientCard] = useState(false);
//   const [doctor_name, setDoctorName] = useState('');
//   const [registration_number, setRegistration] = useState('');
//   const [rows, setRows] = useState([
//     { description: 'Consulting', quantity: 0, price: user?.consulting_fee || 0, gst: 0, total: 0 }
//   ]);
//   const [rowss, setRowss] = useState([
//     {
//       description: '',
//       strength: '',
//       dosage: '',
//       timing: '',
//       frequency: '',
//       duration: '',
//       isCustom: false,
//       price: '',
//       drugDetails: [],
//     },
//   ]);
//   const [grandTotal, setGrandTotal] = useState('0.00');
//   const [showGST, setShowGST] = useState(true);
//   const [data, setData] = useState(null);
//   const [tokanPatientID, setTokanPatientID] = useState(null);
//   const [errors, setErrors] = useState({
//     patientName: '', patientAddress: '', phone: '', email: '', dob: '', visitDate: '',
//   });
//   const [rowErrors, setRowErrors] = useState([]);

//   const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');

//   // Calculate totalPrice for prescriptions
//   const totalPrice = rowss.reduce((acc, row) => {
//     if (!row || typeof row !== 'object' || !row.dosage || !row.duration || (!row.price && !row.drugDetails?.[0]?.price)) {
//       return acc;
//     }
//     const dosage = row.dosage || '';
//     const durationStr = row.duration || '';
//     const pricePerTablet = Number(row.price) || Number(row.drugDetails?.[0]?.price) || 0;
//     if (!/^[0-6]-[0-6]-[0-6]$/.test(dosage)) return acc;
//     const dailyDose = dosage.split('-').reduce((sum, val) => sum + Number(val), 0);
//     const durationMatch = durationStr.match(/\d+/) || [0];
//     const duration = parseInt(durationMatch[0], 10);
//     const total = dailyDose * duration * pricePerTablet;
//     return acc + (isNaN(total) ? 0 : total);
//   }, 0);

//   // Fetch patient data
//   const handleFetchData = async (selectedOption, inputValue) => {
//     if (!inputValue) {
//       showToast('Please enter an ID.', 'Validation Error', '#d9534f');
//       return;
//     }

//     try {
//       let response, patientId;
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
//           setPatientName(response?.patient?.name || response?.appointment?.name || '');
//           setPatientAddress(response?.patient?.address || '');
//           setEmail(response?.patient?.email || '');
//           setContactNumber(response?.patient?.phone || response?.appointment?.phone || '');
//           setDob(response?.patient?.dob || '');
//           setOccupation(response?.patient?.occupation || '');
//           setPincode(response?.patient?.pincode || '');
//           setPatientSuggestionId(patientId);
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
//         setPatientName(response?.patient?.name || '');
//         setPatientAddress(response?.patient?.address || '');
//         setEmail(response?.patient?.email || '');
//         setContactNumber(response?.patient?.phone || '');
//         setDob(response?.patient?.dob || '');
//         setOccupation(response?.patient?.occupation || '');
//         setPincode(response?.patient?.pincode || '');
//         setPatientSuggestionId(patientId);
//       }
//     } catch (error) {
//       console.error('Error fetching patient details:', error);
//       showToast('Failed to fetch data. Please check the ID and try again.', 'Validation Error', '#d9534f');
//       setData(null);
//       setShowPatientCard(false);
//       setLastBill([]);
//       setHealthDirectives([]);
//       setPatientExaminations([]);
//       setAyurvedicExaminations([]);
//     }
//   };

//   const validateForm = () => {
//     let formErrors = {};
//     let isValid = true;

//     if (!data?.patient?.name && !data?.appointment?.name && !patientName.trim()) {
//       formErrors['patientName'] = 'Patient name is required';
//       isValid = false;
//     }

//     if (!data?.patient?.address && !patientAddress.trim()) {
//       formErrors['patientAddress'] = 'Patient address is required';
//       isValid = false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (email.trim() && !emailRegex.test(email.trim())) {
//       formErrors['email'] = 'Enter a valid email address';
//       isValid = false;
//     }

//     if (!data?.patient?.dob && !dob) {
//       formErrors['dob'] = 'Date of birth is required';
//       isValid = false;
//     } else if (new Date(dob) >= new Date()) {
//       formErrors['dob'] = 'Date of birth cannot be in the future';
//       isValid = false;
//     }

//     if (!visitDate) {
//       formErrors.visitDate = 'Visit date is required';
//       isValid = false;
//     } else if (new Date(visitDate) > new Date()) {
//       formErrors.visitDate = 'Visit date cannot be in the future';
//       isValid = false;
//     }

//     setErrors(formErrors);
//     return isValid;
//   };

//   const validateRows = (rows) => {
//     let errors = rows.map((row) => ({
//       quantity: !row.quantity || row.quantity <= 0 ? 'Quantity is required and must be positive' : '',
//       price: !row.price || row.price <= 0 ? 'Price is required and must be positive' : '',
//     }));
//     setRowErrors(errors);
//     return !errors.some((error) => Object.values(error).some((err) => err));
//   };

//     let r_num='';
//   if(registration_number==''){
//     r_num=user.registration_number;
//   }
//   else{
//     r_num=registration_number;
//   }

//   let d_name='';
//   if(doctor_name==''){
//     d_name=user.name;
//   }
//   else{
//     d_name=doctor_name;
//   }

//   const handleSubmit = async () => {
//     if (!validateForm()) return;
//     if (!validateRows(rows)) return;

//     const today = new Date();
//     const dobDate = new Date(dob);
//     if (dobDate >= today) {
//       showToast('Date of birth cannot be in the future.', 'Validation Error', '#d9534f');
//       return;
//     }

//     try {
//       const patientId = data?.patient?.id || tokanPatientID;
//       const tokenNumber = data?.tokan;
//       let skipAddPatient = false;
//       let manualPatientID = null;

//       if (patientSuggestionId) {
//         const patientRes = await post('/api/checkPatient', { id: patientSuggestionId });
//         const tokenRes = await post('/api/checkToken', { patient_id: patientSuggestionId });
//         if (patientRes.exists || tokenRes.exists) {
//           skipAddPatient = true;
//         }
//       } else if (tokenNumber) {
//         const tokenRes = await post('/api/checkToken', { tokan: tokenNumber });
//         if (tokenRes.exists) {
//           skipAddPatient = true;
//         }
//       } else if (patientId) {
//         const tokenRes = await post('/api/checkToken', { patient_id: patientId });
//         if (tokenRes.exists) {
//           skipAddPatient = true;
//         }
//       }

//       if (!skipAddPatient && (!patientId || (patientId && !data?.patient?.fromSuggestion))) {
//         const newPatientData = {
//           clinic_id: 'CLINIC123',
//           doctor_id: userData.id || '1',
//           name: patientName || data?.appointment?.name,
//           email,
//           phone: data?.appointment?.phone || phone || data?.patient?.phone,
//           address: patientAddress,
//           dob,
//           occupation,
//           pincode
//         };

//         const added = await post('/api/manuallyAddPatient', newPatientData);
//         manualPatientID = added?.patient?.id;
//       }

//       const billData = {
//         patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get tokan',
//         patient_name: data?.patient?.name || patientName || data?.appointment?.name,
//         address: data?.patient?.address || patientAddress,
//         email: data?.patient?.email || email,
//         contact: data?.patient?.phone || data?.appointment?.phone || `91${phone}`,
//         dob: data?.patient?.dob || dob,
//         occupation: data?.patient?.occupation || occupation,
//         pincode: data?.patient?.pincode || pincode,
//         doctor_name: userData?.name || d_name || '',
//         registration_number: userData?.registration_number || r_num ||'',
//         visit_date: visitDate,
//         followup_date: followupdate,
//         grand_total: grandTotal,
//       };

//       const billResponse = await post('/api/bills', billData);
//       const billno = billResponse.id;

//       const descriptionData = rows.map((row) => ({
//         bill_id: `${billno}`,
//         description: row.description,
//         quantity: row.quantity,
//         price: row.price,
//         gst: row.gst,
//         total: row.total,
//       }));
//       await post('/api/descriptions', { descriptions: descriptionData });

//       showToast('Bill and descriptions created successfully!', 'Successfully Submitted', '#198754');
//       navigate('/Invoice', { state: { billId: billno } });
//     } catch (error) {
//       console.error('Error in handleSubmit:', error);
//       showToast('An error occurred while submitting data.', 'Validation Error', '#d9534f');
//     }
//   };

//   return (
//     <CForm>
//       <TokenAppointment
//         setData={setData}
//         setShowPatientCard={setShowPatientCard}
//         setLastBill={setLastBill}
//         setHealthDirectives={setHealthDirectives}
//         setPatientExaminations={setPatientExaminations}
//         setAyurvedicExaminations={setAyurvedicExaminations}
//         setTokanPatientID={setTokanPatientID}
//         setPatientName={setPatientName}
//         setPatientAddress={setPatientAddress}
//         setEmail={setEmail}
//         setContactNumber={setContactNumber}
//         setDob={setDob}
//         setOccupation={setOccupation}
//         setPincode={setPincode}
//         setPatientSuggestionId={setPatientSuggestionId}
//         handleFetchData={handleFetchData}
//       />
//       <PatientInformation
//         patientName={patientName}
//         setPatientName={setPatientName}
//         patientAddress={patientAddress}
//         setPatientAddress={setPatientAddress}
//         email={email}
//         setEmail={setEmail}
//         phone={phone}
//         setContactNumber={setContactNumber}
//         dob={dob}
//         setDob={setDob}
//         occupation={occupation}
//         setOccupation={setOccupation}
//         pincode={pincode}
//         setPincode={setPincode}
//         visitDate={visitDate}
//         setVisitDate={setVisitDate}
//         patientSuggestionId={patientSuggestionId}
//         setPatientSuggestionId={setPatientSuggestionId}
//         data={data}
//         errors={errors}
//         setLastBill={setLastBill}
//         setHealthDirectives={setHealthDirectives}
//         setPatientExaminations={setPatientExaminations}
//         setAyurvedicExaminations={setAyurvedicExaminations}
//         setShowPatientCard={setShowPatientCard}
//       />
//       <PastHistory
//         showPatientCard={showPatientCard}
//         lastBill={lastBill}
//         healthDirectives={healthDirectives}
//         patientExaminations={patientExaminations}
//         ayurvedicExaminations={ayurvedicExaminations}
//       />
//       <MedicalObservations
//         userData={userData}
//       />
//       <MedicalPrescriptions
//         rowss={rowss}
//         setRowss={setRowss}
//         rowErrors={rowErrors}
//         setRowErrors={setRowErrors}
//       />
//       <BillingDetails
//         rows={rows}
//         setRows={setRows}
//         rowErrors={rowErrors}
//         setRowErrors={setRowErrors}
//         showGST={showGST}
//         setShowGST={setShowGST}
//         rowss={rowss}
//         totalPrice={totalPrice}
//         setGrandTotal={setGrandTotal}
//       />
//       <CCardBody>
//         <CRow className="g-3 align-items-center">
//           <CCol xs={12} md={8} lg={7}>
//             <div className="d-flex flex-column flex-md-row align-items-md-center">
//               <label htmlFor="followupdate" className="fw-semibold mb-2 mb-md-0 me-md-2" style={{ minWidth: '150px' }}>
//                 📅 Followup Date
//               </label>
//               <CFormInput
//                 type="date"
//                 id="followupdate"
//                 value={followupdate}
//                 onChange={(e) => setFollowupdate(e.target.value)}
//                 required
//                 className="me-md-2 border border-2 border-black"
//               />
//               <CButton color="primary" onClick={handleSubmit} className="mt-2 mt-md-0 fw-semibold w-75">
//                 Submit
//               </CButton>
//             </div>
//           </CCol>
//         </CRow>
//       </CCardBody>
//     </CForm>
//   );
// };

// export default MainPage;























// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   CCardBody, CRow, CCol, CButton, CForm, CFormInput
// } from '@coreui/react';
// import { getAPICall, post } from '../../../util/api';
// import { getUser } from '../../../util/session';
// import { showToast } from '../toastContainer/toastContainer';
// import TokenAppointment from './TokenAppointment';
// import PatientInformation from './PatientInformation';
// import PastHistory from './PastHistory';
// import MedicalObservations from './MedicalObservations';
// import MedicalPrescriptions from './MedicalPrescriptions';
// import BillingDetails from './BillingDetails';

// const MainPage = () => {
//   const today = new Date().toISOString().split('T')[0];
//   const user = getUser();
//   const location = useLocation();
//   const { formDataa } = location.state || {};
//   const navigate = useNavigate();

//   // Shared state
//   const [patientName, setPatientName] = useState(formDataa?.patient_name || '');
//   const [patientAddress, setPatientAddress] = useState(formDataa?.patient_address || '');
//   const [email, setEmail] = useState(formDataa?.patient_email || '');
//   const [phone, setContactNumber] = useState(formDataa?.patient_contact || '');
//   const [dob, setDob] = useState(formDataa?.patient_dob || '');
//   const [occupation, setOccupation] = useState(formDataa?.occupation || '');
//   const [pincode, setPincode] = useState(formDataa?.pincode || '');
//   const [visitDate, setVisitDate] = useState(formDataa?.visit_date || today);
//   const [followupdate, setFollowupdate] = useState('');
//   const [patientSuggestionId, setPatientSuggestionId] = useState(null);
//   const [lastBill, setLastBill] = useState(formDataa?.last_bill || []);
//   const [healthDirectives, setHealthDirectives] = useState(formDataa?.health_directives || []);
//   const [patientExaminations, setPatientExaminations] = useState(formDataa?.patient_examinations || []);
//   const [ayurvedicExaminations, setAyurvedicExaminations] = useState(formDataa?.ayurvedic_examintion || []);
//   const [showPatientCard, setShowPatientCard] = useState(false);
//   const [doctor_name, setDoctorName] = useState('');
//   const [registration_number, setRegistration] = useState('');
//   const [rows, setRows] = useState([
//     { description: 'Consulting', quantity: 0, price: user?.consulting_fee || 0, gst: 0, total: 0 }
//   ]);
//   const [rowss, setRowss] = useState([]); // Initialize empty
//   const [grandTotal, setGrandTotal] = useState('0.00');
//   const [showGST, setShowGST] = useState(true);
//   const [data, setData] = useState(null);
//   const [tokanPatientID, setTokanPatientID] = useState(null);
//   const [errors, setErrors] = useState({
//     patientName: '', patientAddress: '', phone: '', email: '', dob: '', visitDate: '',
//   });
//   const [rowErrors, setRowErrors] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   const [medicines, setMedicines] = useState([]);

//   // Medical Observations states
//   const [bp, setBp] = useState('');
//   const [pulse, setPulse] = useState('');
//   const [pastHistory, setPastHistory] = useState('');
//   const [complaints, setComplaints] = useState('');
//   const [sysExGeneral, setSysExGeneral] = useState('');
//   const [sysExPA, setSysExPA] = useState('');
//   const [weight, setWeight] = useState('');
//   const [height, setHeight] = useState('');
//   const [emaill, setEmaill] = useState('');
//   const [ayurPastHistory, setAyurPastHistory] = useState('');
//   const [prasavvedanParikshayein, setPrasavvedanParikshayein] = useState('');
//   const [habits, setHabits] = useState({});
//   const [labInvestigation, setLabInvestigation] = useState('');
//   const [personalHistory, setPersonalHistory] = useState({});
//   const [foodAndDrugAllergy, setFoodAndDrugAllergy] = useState('');
//   const [drugAllergy, setDrugAllergy] = useState('');
//   const [lmp, setLmp] = useState('');
//   const [edd, setEdd] = useState('');
//   const [ashtvidhData, setAshtvidhData] = useState({});

//   const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');

//   const [isMedicalExpanded, setIsMedicalExpanded] = useState(false);
//   const [isAyurvedicExpanded, setIsAyurvedicExpanded] = useState(false);

//   // Calculate totalPrice for prescriptions
//   const totalPrice = rowss.reduce((acc, row) => {
//     if (!row || typeof row !== 'object' || !row.dosage || !row.duration || (!row.price && !row.drugDetails?.[0]?.price)) {
//       return acc;
//     }
//     const dosage = row.dosage || '';
//     const durationStr = row.duration || '';
//     const pricePerTablet = Number(row.price) || Number(row.drugDetails?.[0]?.price) || 0;
//     if (!/^[0-6]-[0-6]-[0-6]$/.test(dosage)) return acc;
//     const dailyDose = dosage.split('-').reduce((sum, val) => sum + Number(val), 0);
//     const durationMatch = durationStr.match(/\d+/) || [0];
//     const duration = parseInt(durationMatch[0], 10);
//     const total = dailyDose * duration * pricePerTablet;
//     return acc + (isNaN(total) ? 0 : total);
//   }, 0);

//   // Fetch patient data
//   const handleFetchData = async (selectedOption, inputValue) => {
//     if (!inputValue) {
//       showToast('Please enter an ID.', 'Validation Error', '#d9534f');
//       return;
//     }

//     try {
//       let response, patientId;
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
//           setPatientName(response?.patient?.name || response?.appointment?.name || '');
//           setPatientAddress(response?.patient?.address || '');
//           setEmail(response?.patient?.email || '');
//           setContactNumber(response?.patient?.phone || response?.appointment?.phone || '');
//           setDob(response?.patient?.dob || '');
//           setOccupation(response?.patient?.occupation || '');
//           setPincode(response?.patient?.pincode || '');
//           setPatientSuggestionId(patientId);
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
//         setPatientName(response?.patient?.name || '');
//         setPatientAddress(response?.patient?.address || '');
//         setEmail(response?.patient?.email || '');
//         setContactNumber(response?.patient?.phone || '');
//         setDob(response?.patient?.dob || '');
//         setOccupation(response?.patient?.occupation || '');
//         setPincode(response?.patient?.pincode || '');
//         setPatientSuggestionId(patientId);
//       }
//     } catch (error) {
//       console.error('Error fetching patient details:', error);
//       showToast('Failed to fetch data. Please check the ID and try again.', 'Validation Error', '#d9534f');
//       setData(null);
//       setShowPatientCard(false);
//       setLastBill([]);
//       setHealthDirectives([]);
//       setPatientExaminations([]);
//       setAyurvedicExaminations([]);
//     }
//   };

//   const validateForm = () => {
//     let formErrors = {};
//     let isValid = true;

//     if (!data?.patient?.name && !data?.appointment?.name && !patientName.trim()) {
//       formErrors['patientName'] = 'Patient name is required';
//       isValid = false;
//     }

//     if (!data?.patient?.address && !patientAddress.trim()) {
//       formErrors['patientAddress'] = 'Patient address is required';
//       isValid = false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (email.trim() && !emailRegex.test(email.trim())) {
//       formErrors['email'] = 'Enter a valid email address';
//       isValid = false;
//     }

//     if (!data?.patient?.dob && !dob) {
//       formErrors['dob'] = 'Date of birth is required';
//       isValid = false;
//     } else if (new Date(dob) >= new Date()) {
//       formErrors['dob'] = 'Date of birth cannot be in the future';
//       isValid = false;
//     }

//     if (!visitDate) {
//       formErrors.visitDate = 'Visit date is required';
//       isValid = false;
//     } else if (new Date(visitDate) > new Date()) {
//       formErrors.visitDate = 'Visit date cannot be in the future';
//       isValid = false;
//     }

//     setErrors(formErrors);
//     return isValid;
//   };

//   const validateRows = (rows) => {
//     let errors = rows.map((row) => ({
//       quantity: !row.quantity || row.quantity <= 0 ? 'Quantity is required and must be positive' : '',
//       price: !row.price || row.price <= 0 ? 'Price is required and must be positive' : '',
//     }));
//     setRowErrors(errors);
//     return !errors.some((error) => Object.values(error).some((err) => err));
//   };

//   // const validateRowss = () => {
//   //   // Filter only valid rows
//   //   const validRows = rowss.filter(row => 
//   //     row.description && row.description.trim() !== '' &&
//   //     row.strength && row.strength.trim() !== '' &&
//   //     row.dosage && /^[0-6]-[0-6]-[0-6]$/.test(row.dosage) &&
//   //     row.timing && row.timing.trim() !== '' &&
//   //     row.frequency && row.frequency.trim() !== '' &&
//   //     row.duration && row.duration.trim() !== '' &&
//   //     (row.price || row.drugDetails?.[0]?.price)
//   //   );

//   //   const errors = rowss.map((row, index) => {
//   //     const rowErrors = {};
      
//   //     if (!row.description || row.description.trim() === '') {
//   //       rowErrors.description = 'Medicine selection is required';
//   //     }
//   //     if (!row.strength || row.strength.trim() === '') {
//   //       rowErrors.strength = 'Strength is required';
//   //     }
//   //     if (!row.dosage || !/^[0-6]-[0-6]-[0-6]$/.test(row.dosage)) {
//   //       rowErrors.dosage = 'Valid dosage (e.g., 1-0-1) is required';
//   //     }
//   //     if (!row.timing || row.timing.trim() === '') {
//   //       rowErrors.timing = 'Timing is required';
//   //     }
//   //     if (!row.frequency || row.frequency.trim() === '') {
//   //       rowErrors.frequency = 'Frequency is required';
//   //     }
//   //     if (!row.duration || row.duration.trim() === '') {
//   //       rowErrors.duration = 'Duration is required';
//   //     }
//   //     if (!row.price && !row.drugDetails?.[0]?.price) {
//   //       rowErrors.price = 'Price is required';
//   //     }
      
//   //     return rowErrors;
//   //   });

//   //   setRowErrors((prev) => {
//   //     const updated = {};
//   //     rowss.forEach((_, index) => {
//   //       if (Object.keys(errors[index]).length > 0) {
//   //         updated[index] = errors[index];
//   //       }
//   //     });
//   //     return updated;
//   //   });

//   //   const hasErrors = errors.some((error) => Object.values(error).some((err) => err));
//   //   console.log('Prescription validation:', { validRows, hasErrors });
//   //   return { isValid: !hasErrors, validRows };
//   // };

// const validateRowss = () => {
//   const errors = rowss.map((row) => {
//     const rowErrors = {};

//     // rowErrors.description = (typeof row.description === 'string' && row.description.trim() !== '')
//     //   ? null : 'Medicine is required.';

//     rowErrors.strength = (typeof row.strength === 'string' && row.strength.trim() !== '')
//       ? null : 'Strength is required.';

//     rowErrors.dosage = (typeof row.dosage === 'string' && /^[0-6]-[0-6]-[0-6]$/.test(row.dosage.trim()))
//       ? null : 'Valid dosage (e.g., 1-0-1) is required.';

//     rowErrors.timing = (typeof row.timing === 'string' && row.timing.trim() !== '')
//       ? null : 'Timing is required.';

//     rowErrors.frequency = (typeof row.frequency === 'string' && row.frequency.trim() !== '')
//       ? null : 'Frequency is required.';

//     rowErrors.duration = (typeof row.duration === 'string' && row.duration.trim() !== '')
//       ? null : 'Duration is required.';

//     rowErrors.price = (row.price || row.drugDetails?.[0]?.price)
//       ? null : 'Price is required.';

//     return rowErrors;
//   });

//   // Save error state for display
//   setRowErrors(errors);

//   // Check if any errors
//   const hasErrors = errors.some(error => Object.values(error).some(val => val !== null));

//   // Prepare valid rows for submission
//   const validRows = rowss.filter((_, idx) =>
//     Object.values(errors[idx]).every(val => val === null)
//   );

//   return { isValid: !hasErrors, validRows };
// };



//   let r_num = registration_number || user?.registration_number || '';
//   let d_name = doctor_name || user?.name || '';

//   // const handleSubmit = async () => {
//   //   console.log('Starting submit process...');
    
//   //   if (!validateForm()) {
//   //     console.log('Form validation failed');
//   //     showToast('Please correct form fields.', 'Validation Error', '#d9534f');
//   //     return;
//   //   }
    
//   //   if (!validateRows(rows)) {
//   //     console.log('Billing rows validation failed');
//   //     showToast('Please correct billing details.', 'Validation Error', '#d9534f');
//   //     return;
//   //   }
    
//   //   const { isValid, validRows } = validateRowss();
//   //   if (showTable && !isValid) {
//   //     showToast('Please correct prescription fields.', 'Validation Error', '#d9534f');
//   //     console.log('Prescription validation failed');
//   //     return;
//   //   }

//   //   const today = new Date();
//   //   const dobDate = new Date(dob);
//   //   if (dobDate >= today) {
//   //     showToast('Date of birth cannot be in the future.', 'Validation Error', '#d9534f');
//   //     return;
//   //   }

//   //   try {
//   //     const patientId = data?.patient?.id || tokanPatientID;
//   //     const tokenNumber = data?.tokan;
//   //     let skipAddPatient = false;
//   //     let manualPatientID = null;

//   //     console.log('Patient ID:', patientId);
//   //     console.log('Token Number:', tokenNumber);
//   //     console.log('Patient Suggestion ID:', patientSuggestionId);

//   //     // Check if patient already exists
//   //     if (patientSuggestionId) {
//   //       try {
//   //         const patientRes = await post('/api/checkPatient', { id: patientSuggestionId });
//   //         const tokenRes = await post('/api/checkToken', { patient_id: patientSuggestionId });
//   //         if (patientRes.exists || tokenRes.exists) {
//   //           skipAddPatient = true;
//   //         }
//   //       } catch (error) {
//   //         console.error('Error checking patient existence:', error);
//   //       }
//   //     } else if (tokenNumber) {
//   //       try {
//   //         const tokenRes = await post('/api/checkToken', { tokan: tokenNumber });
//   //         if (tokenRes.exists) {
//   //           skipAddPatient = true;
//   //         }
//   //       } catch (error) {
//   //         console.error('Error checking token:', error);
//   //       }
//   //     } else if (patientId) {
//   //       try {
//   //         const tokenRes = await post('/api/checkToken', { patient_id: patientId });
//   //         if (tokenRes.exists) {
//   //           skipAddPatient = true;
//   //         }
//   //       } catch (error) {
//   //         console.error('Error checking patient token:', error);
//   //       }
//   //     }

//   //     // Add patient if needed
//   //     if (!skipAddPatient && (!patientId || (patientId && !data?.patient?.fromSuggestion))) {
//   //       console.log('Adding new patient...');
        
//   //       const newPatientData = {
//   //         clinic_id: 'CLINIC123',
//   //         doctor_id: userData.id || '1',
//   //         name: patientName || data?.appointment?.name,
//   //         email,
//   //         phone: data?.appointment?.phone || phone || data?.patient?.phone,
//   //         address: patientAddress,
//   //         dob,
//   //         occupation,
//   //         pincode
//   //       };

//   //       console.log('New patient data:', newPatientData);

//   //       try {
//   //         const added = await post('/api/manuallyAddPatient', newPatientData);
//   //         manualPatientID = added?.patient?.id;
//   //         console.log('Patient added successfully with ID:', manualPatientID);
//   //       } catch (error) {
//   //         console.error('Error adding patient:', error);
//   //         showToast('Failed to add patient. Please try again.', 'Error', '#d9534f');
//   //         return;
//   //       }
//   //     }

//   //     // Create bill
//   //     console.log('Creating bill...');
      
//   //     const billData = {
//   //       patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get tokan',
//   //       patient_name: data?.patient?.name || patientName || data?.appointment?.name,
//   //       address: data?.patient?.address || patientAddress,
//   //       email: data?.patient?.email || email,
//   //       contact: data?.patient?.phone || data?.appointment?.phone || `91${phone}`,
//   //       dob: data?.patient?.dob || dob,
//   //       occupation: data?.patient?.occupation || occupation,
//   //       pincode: data?.patient?.pincode || pincode,
//   //       doctor_name: d_name,
//   //       registration_number: r_num,
//   //       visit_date: visitDate,
//   //       followup_date: followupdate,
//   //       grand_total: grandTotal,
//   //     };

//   //     console.log('Bill data:', billData);

//   //     let billResponse, billno;
//   //     try {
//   //       billResponse = await post('/api/bills', billData);
//   //       billno = billResponse.id;
//   //       console.log('Bill created successfully with ID:', billno);
//   //     } catch (error) {
//   //       console.error('Error creating bill:', error);
//   //       showToast('Failed to create bill. Please try again.', 'Error', '#d9534f');
//   //       return;
//   //     }

//   //     // Add bill descriptions
//   //     console.log('Adding bill descriptions...');
      
//   //     const descriptionData = rows.map((row) => ({
//   //       bill_id: `${billno}`,
//   //       description: row.description,
//   //       quantity: row.quantity,
//   //       price: row.price,
//   //       gst: row.gst,
//   //       total: row.total,
//   //     }));
      
//   //     console.log('Description data:', descriptionData);
      
//   //     try {
//   //       await post('/api/descriptions', { descriptions: descriptionData });
//   //       console.log('Descriptions added successfully');
//   //     } catch (error) {
//   //       console.error('Error adding descriptions:', error);
//   //       showToast('Failed to add bill descriptions.', 'Warning', '#ffc107');
//   //     }

//   //     // Add prescriptions if showTable is true
//   //     if (showTable) {
//   //       console.log('Processing prescriptions...');
        
//   //       try {
//   //         const prescriptionData = validRows.map((row) => ({
//   //           p_p_i_id: `${billno}` ,
//   //           patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get Patient ID',
//   //           medicine: medicines.find(med => med.id === parseInt(row.description, 10))?.drug_name || row.description,
//   //           strength: row.strength || '',
//   //           dosage: row.dosage || '',
//   //           timing: row.timing || '',
//   //           frequency: row.frequency || '',
//   //           duration: row.duration || '',
//   //         }));
          
//   //         console.log('Prescription data to send:', prescriptionData);
          
//   //         // Call API with prescriptions array (can be empty)
//   //         await post('/api/healthdirectives', { prescriptions: prescriptionData });
//   //         console.log('Prescriptions API called successfully');
//   //       } catch (error) {
//   //         console.error('Error calling prescriptions API:', error);
//   //         showToast('Failed to process prescriptions.', 'Warning', '#ffc107');
//   //       }
//   //     } else {
//   //       console.log('Skipping prescriptions as table is not shown');
//   //     }

//   //     // Add examinations if any data exists
//   //     const hasPatientExamData = bp || pulse || pastHistory || complaints || sysExGeneral || sysExPA || weight || height;
//   //     const hasAyurvedicDiagnosisData = emaill || ayurPastHistory || prasavvedanParikshayein ||
//   //       Object.keys(habits).length > 0 || labInvestigation || Object.keys(personalHistory).length > 0 || 
//   //       foodAndDrugAllergy || drugAllergy || lmp || edd;

//   //     if (hasPatientExamData || hasAyurvedicDiagnosisData) {
//   //       console.log('Adding patient examinations...');
        
//   //       const patientExaminationData = hasPatientExamData
//   //         ? {
//   //             p_p_i_id: `${billno}`,
//   //             patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get patient ID',
//   //             bp: bp || '',
//   //             pulse: pulse || '',
//   //             weight: weight || '',
//   //             height: height || '',
//   //             past_history: pastHistory || '',
//   //             complaints: complaints || '',
//   //             systemic_exam_general: sysExGeneral || '',
//   //             systemic_exam_pa: sysExPA || '',
//   //           }
//   //         : {};

//   //       const ayurvedicDiagnosisData = hasAyurvedicDiagnosisData
//   //         ? {
//   //             p_p_i_id: `${billno}`,
//   //             patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get patient ID',
//   //             email: emaill || '',
//   //             ayurPastHistory: ayurPastHistory || '',
//   //             prasavvedan_parikshayein: JSON.stringify(prasavvedanParikshayein) || '{}',
//   //             habits: JSON.stringify(habits) || '{}',
//   //             lab_investigation: labInvestigation || '',
//   //             personal_history: JSON.stringify(personalHistory) || '{}',
//   //             food_and_drug_allergy: foodAndDrugAllergy || '',
//   //             drug_allery: drugAllergy || '',
//   //             lmp: lmp || '',
//   //             edd: edd || ''
//   //           }
//   //         : {};

//   //       const payload = {
//   //         ...patientExaminationData,
//   //         ...ayurvedicDiagnosisData,
//   //       };

//   //       console.log('Examination payload:', payload);

//   //       try {
//   //         await post('/api/patientexaminations', payload);
//   //         console.log('Patient examinations added successfully');
//   //       } catch (error) {
//   //         console.error('Error adding patient examinations:', error);
//   //         showToast('Failed to add patient examinations.', 'Warning', '#ffc107');
//   //       }
//   //     }

//   //     showToast('Bill and descriptions created successfully!', 'Successfully Submitted', '#198754');
//   //     navigate('/Invoice', { state: { billId: billno } });
      
//   //   } catch (error) {
//   //     console.error('Error in handleSubmit:', error);
//   //     showToast('An error occurred while submitting data.', 'Validation Error', '#d9534f');
//   //   }
//   // };


// const handleSubmit = async () => {
//   console.log('Starting submit process...');

//   if (!validateForm()) {
//     console.log('Form validation failed');
//     showToast('Please correct form fields.', 'Validation Error', '#d9534f');
//     return;
//   }

//   if (!validateRows(rows)) {
//     console.log('Billing rows validation failed');
//     showToast('Please correct billing details.', 'Validation Error', '#d9534f');
//     return;
//   }

//   const { isValid, validRows } = validateRowss();
//   if (showTable && !isValid) {
//     showToast('Please correct prescription fields.', 'Validation Error', '#d9534f');
//     console.log('Prescription validation failed');
//     return;
//   }

//   const today = new Date();
//   const dobDate = new Date(dob);
//   if (dobDate >= today) {
//     showToast('Date of birth cannot be in the future.', 'Validation Error', '#d9534f');
//     return;
//   }

//   try {
//     const patientId = data?.patient?.id || tokanPatientID;
//     const tokenNumber = data?.tokan;
//     let skipAddPatient = false;
//     let manualPatientID = null;

//     console.log('Patient ID:', patientId);
//     console.log('Token Number:', tokenNumber);
//     console.log('Patient Suggestion ID:', patientSuggestionId);

//     // Check if patient already exists
//     if (patientSuggestionId) {
//       try {
//         const patientRes = await post('/api/checkPatient', { id: patientSuggestionId });
//         const tokenRes = await post('/api/checkToken', { patient_id: patientSuggestionId });
//         if (patientRes.exists || tokenRes.exists) {
//           skipAddPatient = true;
//         }
//       } catch (error) {
//         console.error('Error checking patient existence:', error);
//       }
//     } else if (tokenNumber) {
//       try {
//         const tokenRes = await post('/api/checkToken', { tokan: tokenNumber });
//         if (tokenRes.exists) {
//           skipAddPatient = true;
//         }
//       } catch (error) {
//         console.error('Error checking token:', error);
//       }
//     } else if (patientId) {
//       try {
//         const tokenRes = await post('/api/checkToken', { patient_id: patientId });
//         if (tokenRes.exists) {
//           skipAddPatient = true;
//         }
//       } catch (error) {
//         console.error('Error checking patient token:', error);
//       }
//     }

//     // Add patient if needed
//     if (!skipAddPatient && (!patientId || (patientId && !data?.patient?.fromSuggestion))) {
//       console.log('Adding new patient...');

//       const newPatientData = {
//         clinic_id: 'CLINIC123',
//         doctor_id: userData.id || '1',
//         name: patientName || data?.appointment?.name,
//         email,
//         phone: data?.appointment?.phone || phone || data?.patient?.phone,
//         address: patientAddress,
//         dob,
//         occupation,
//         pincode
//       };

//       console.log('New patient data:', newPatientData);

//       try {
//         const added = await post('/api/manuallyAddPatient', newPatientData);
//         manualPatientID = added?.patient?.id;
//         console.log('Patient added successfully with ID:', manualPatientID);
//       } catch (error) {
//         console.error('Error adding patient:', error);
//         showToast('Failed to add patient. Please try again.', 'Error', '#d9534f');
//         return;
//       }
//     }

//     // Create bill
//     console.log('Creating bill...');

//     const billData = {
//       patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get tokan',
//       patient_name: data?.patient?.name || patientName || data?.appointment?.name,
//       address: data?.patient?.address || patientAddress,
//       email: data?.patient?.email || email,
//       contact: data?.patient?.phone || data?.appointment?.phone || `91${phone}`,
//       dob: data?.patient?.dob || dob,
//       occupation: data?.patient?.occupation || occupation,
//       pincode: data?.patient?.pincode || pincode,
//       doctor_name: d_name,
//       registration_number: r_num,
//       visit_date: visitDate,
//       followup_date: followupdate,
//       grand_total: grandTotal,
//     };

//     console.log('Bill data:', billData);

//     let billResponse, billno;
//     try {
//       billResponse = await post('/api/bills', billData);
//       billno = billResponse.id;
//       console.log('Bill created successfully with ID:', billno);
//     } catch (error) {
//       console.error('Error creating bill:', error);
//       showToast('Failed to create bill. Please try again.', 'Error', '#d9534f');
//       return;
//     }

//     // Add bill descriptions
//     console.log('Adding bill descriptions...');

//     const descriptionData = rows.map((row) => ({
//       bill_id: `${billno}`,
//       description: row.description,
//       quantity: row.quantity,
//       price: row.price,
//       gst: row.gst,
//       total: row.total,
//     }));

//     console.log('Description data:', descriptionData);

//     try {
//       await post('/api/descriptions', { descriptions: descriptionData });
//       console.log('Descriptions added successfully');
//     } catch (error) {
//       console.error('Error adding descriptions:', error);
//       showToast('Failed to add bill descriptions.', 'Warning', '#ffc107');
//     }

//     // Add prescriptions if showTable is true
//     if (showTable) {
//       console.log('Processing prescriptions...');

//       try {
//         const prescriptionData = validRows.map((row) => ({
//           p_p_i_id: `${billno}`,
//           patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get Patient ID',
//           medicine: medicines.find(med => med.id === parseInt(row.description, 10))?.drug_name || row.description,
//           strength: row.strength || '',
//           dosage: row.dosage || '',
//           timing: row.timing || '',
//           frequency: row.frequency || '',
//           duration: row.duration || '',
//         }));

//         console.log('Prescription data to send:', prescriptionData);

//         await post('/api/healthdirectives', { prescriptions: prescriptionData });
//         console.log('Prescriptions API called successfully');
//       } catch (error) {
//         console.error('Error calling prescriptions API:', error);
//         showToast('Failed to process prescriptions.', 'Warning', '#ffc107');
//       }
//     } else {
//       console.log('Skipping prescriptions as table is not shown');
//     }

//     // Add examinations if medical or ayurvedic sections are expanded
//     if (isMedicalExpanded || isAyurvedicExpanded) {
//       console.log('Adding patient examinations...');

//       const patientExaminationData = {
//         p_p_i_id: `${billno}`,
//         patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get patient ID',
//         bp: bp || '',
//         pulse: pulse || '',
//         weight: weight || '',
//         height: height || '',
//         past_history: pastHistory || '',
//         complaints: complaints || '',
//         systemic_exam_general: sysExGeneral || '',
//         systemic_exam_pa: sysExPA || '',
//       };

//       const ayurvedicDiagnosisData = {
//         p_p_i_id: `${billno}`,
//         patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get patient ID',
//         email: emaill || '',
//         ayurPastHistory: ayurPastHistory || '',
//         prasavvedan_parikshayein: JSON.stringify(prasavvedanParikshayein || ''),
//         habits: JSON.stringify(habits || {}),
//         lab_investigation: labInvestigation || '',
//         personal_history: JSON.stringify(personalHistory || {}),
//         food_and_drug_allergy: foodAndDrugAllergy || '',
//         drug_allery: drugAllergy || '', // Note: 'drug_allery' matches backend field name
//         lmp: lmp || '',
//         edd: edd || '',
//         ashtvidh_parikshayein: JSON.stringify(ashtvidhData || {}),
//       };

//       const payload = {
//         ...patientExaminationData,
//         ...ayurvedicDiagnosisData,
//       };

//       console.log('Examination payload:', payload);

//       try {
//         await post('/api/patientexaminations', payload);
//         console.log('Patient examinations API called successfully');
//       } catch (error) {
//         console.error('Error calling patient examinations API:', error);
//         showToast('Failed to add patient examinations.', 'Warning', '#ffc107');
//       }
//     } else {
//       console.log('Skipping patient examinations as neither section is expanded');
//     }

//     showToast('Bill and descriptions created successfully!', 'Successfully Submitted', '#198754');
//     navigate('/Invoice', { state: { billId: billno } });

//   } catch (error) {
//     console.error('Error in handleSubmit:', error);
//     showToast('An error occurred while submitting data.', 'Validation Error', '#d9534f');
//   }
// };

//   return (
//     <CForm>
//       <TokenAppointment
//         setData={setData}
//         setShowPatientCard={setShowPatientCard}
//         setLastBill={setLastBill}
//         setHealthDirectives={setHealthDirectives}
//         setPatientExaminations={setPatientExaminations}
//         setAyurvedicExaminations={setAyurvedicExaminations}
//         setTokanPatientID={setTokanPatientID}
//         setPatientName={setPatientName}
//         setPatientAddress={setPatientAddress}
//         setEmail={setEmail}
//         setContactNumber={setContactNumber}
//         setDob={setDob}
//         setOccupation={setOccupation}
//         setPincode={setPincode}
//         setPatientSuggestionId={setPatientSuggestionId}
//         handleFetchData={handleFetchData}
//       />
//       <PatientInformation
//         patientName={patientName}
//         setPatientName={setPatientName}
//         patientAddress={patientAddress}
//         setPatientAddress={setPatientAddress}
//         email={email}
//         setEmail={setEmail}
//         phone={phone}
//         setContactNumber={setContactNumber}
//         dob={dob}
//         setDob={setDob}
//         occupation={occupation}
//         setOccupation={setOccupation}
//         pincode={pincode}
//         setPincode={setPincode}
//         visitDate={visitDate}
//         setVisitDate={setVisitDate}
//         patientSuggestionId={patientSuggestionId}
//         setPatientSuggestionId={setPatientSuggestionId}
//         data={data}
//         errors={errors}
//         setLastBill={setLastBill}
//         setHealthDirectives={setHealthDirectives}
//         setPatientExaminations={setPatientExaminations}
//         setAyurvedicExaminations={setAyurvedicExaminations}
//         setShowPatientCard={setShowPatientCard}
//       />
//       <PastHistory
//         showPatientCard={showPatientCard}
//         lastBill={lastBill}
//         healthDirectives={healthDirectives}
//         patientExaminations={patientExaminations}
//         ayurvedicExaminations={ayurvedicExaminations}
//       />
//       {/* <MedicalObservations
//         userData={userData}
//         bp={bp}
//         setBp={setBp}
//         pulse={pulse}
//         setPulse={setPulse}
//         pastHistory={pastHistory}
//         setPastHistory={setPastHistory}
//         complaints={complaints}
//         setComplaints={setComplaints}
//         sysExGeneral={sysExGeneral}
//         setSysExGeneral={setSysExGeneral}
//         sysExPA={sysExPA}
//         setSysExPA={setSysExPA}
//         weight={weight}
//         setWeight={setWeight}
//         height={height}
//         setHeight={setHeight}
//         emaill={emaill}
//         setEmaill={setEmaill}
//         ayurPastHistory={ayurPastHistory}
//         setAyurPastHistory={setAyurPastHistory}
//         prasavvedanParikshayein={prasavvedanParikshayein}
//         setPrasavvedanParikshayein={setPrasavvedanParikshayein}
//         habits={habits}
//         setHabits={setHabits}
//         labInvestigation={labInvestigation}
//         setLabInvestigation={setLabInvestigation}
//         personalHistory={personalHistory}
//         setPersonalHistory={setPersonalHistory}
//         foodAndDrugAllergy={foodAndDrugAllergy}
//         setFoodAndDrugAllergy={setFoodAndDrugAllergy}
//         drugAllergy={drugAllergy}
//         setDrugAllergy={setDrugAllergy}
//         lmp={lmp}
//         setLmp={setLmp}
//         edd={edd}
//         setEdd={setEdd}
//         ashtvidhData={ashtvidhData}
//         setAshtvidhData={setAshtvidhData}
//       /> */}
//       <MedicalObservations
//   userData={userData}
//   bp={bp}
//   setBp={setBp}
//   pulse={pulse}
//   setPulse={setPulse}
//   pastHistory={pastHistory}
//   setPastHistory={setPastHistory}
//   complaints={complaints}
//   setComplaints={setComplaints}
//   sysExGeneral={sysExGeneral}
//   setSysExGeneral={setSysExGeneral}
//   sysExPA={sysExPA}
//   setSysExPA={setSysExPA}
//   weight={weight}
//   setWeight={setWeight}
//   height={height}
//   setHeight={setHeight}
//   emaill={emaill}
//   setEmaill={setEmaill}
//   ayurPastHistory={ayurPastHistory}
//   setAyurPastHistory={setAyurPastHistory}
//   prasavvedanParikshayein={prasavvedanParikshayein}
//   setPrasavvedanParikshayein={setPrasavvedanParikshayein}
//   habits={habits}
//   setHabits={setHabits}
//   labInvestigation={labInvestigation}
//   setLabInvestigation={setLabInvestigation}
//   personalHistory={personalHistory}
//   setPersonalHistory={setPersonalHistory}
//   foodAndDrugAllergy={foodAndDrugAllergy}
//   setFoodAndDrugAllergy={setFoodAndDrugAllergy}
//   drugAllergy={drugAllergy}
//   setDrugAllergy={setDrugAllergy}
//   lmp={lmp}
//   setLmp={setLmp}
//   edd={edd}
//   setEdd={setEdd}
//   ashtvidhData={ashtvidhData}
//   setAshtvidhData={setAshtvidhData}
//   isMedicalExpanded={isMedicalExpanded}
//   setIsMedicalExpanded={setIsMedicalExpanded}
//   isAyurvedicExpanded={isAyurvedicExpanded}
//   setIsAyurvedicExpanded={setIsAyurvedicExpanded}
// />
//       <MedicalPrescriptions
//         rowss={rowss}
//         setRowss={setRowss}
//         rowErrors={rowErrors}
//         setRowErrors={setRowErrors}
//         showTable={showTable}
//         setShowTable={setShowTable}
//         medicines={medicines}
//         setMedicines={setMedicines}
//       />
//       <BillingDetails
//         rows={rows}
//         setRows={setRows}
//         rowErrors={rowErrors}
//         setRowErrors={setRowErrors}
//         showGST={showGST}
//         setShowGST={setShowGST}
//         rowss={rowss}
//         totalPrice={totalPrice}
//         setGrandTotal={setGrandTotal}
//       />
//       <CCardBody>
//         <CRow className="g-3 align-items-center">
//           <CCol xs={12} md={8} lg={7}>
//             <div className="d-flex flex-column flex-md-row align-items-md-center">
//               <label htmlFor="followupdate" className="fw-semibold mb-2 mb-md-0 me-md-2" style={{ minWidth: '150px' }}>
//                 📅 Followup Date
//               </label>
//               <CFormInput
//                 type="date"
//                 id="followupdate"
//                 value={followupdate}
//                 onChange={(e) => setFollowupdate(e.target.value)}
//                 required
//                 className="me-md-2 border border-2 border-black"
//               />
//               <CButton color="primary" onClick={handleSubmit} className="mt-2 mt-md-0 fw-semibold w-75">
//                 Submit
//               </CButton>
//             </div>
//           </CCol>
//         </CRow>
//       </CCardBody>
//     </CForm>
//   );
// };

// export default MainPage;
















// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   CCardBody, CRow, CCol, CButton, CForm, CFormInput
// } from '@coreui/react';
// import { getAPICall, post } from '../../../util/api';
// import { getUser } from '../../../util/session';
// import { showToast } from '../toastContainer/toastContainer';
// import TokenAppointment from './TokenAppointment';
// import PatientInformation from './PatientInformation';
// import PastHistory from './PastHistory';
// import MedicalObservations from './MedicalObservations';
// import MedicalPrescriptions from './MedicalPrescriptions';
// import BillingDetails from './BillingDetails';

// const MainPage = () => {
//   const today = new Date().toISOString().split('T')[0];
//   const user = getUser();
//   const location = useLocation();
//   const { formDataa } = location.state || {};
//   const navigate = useNavigate();

//   // Shared state
//   const [patientName, setPatientName] = useState(formDataa?.patient_name || '');
//   const [patientAddress, setPatientAddress] = useState(formDataa?.patient_address || '');
//   const [email, setEmail] = useState(formDataa?.patient_email || '');
//   const [phone, setContactNumber] = useState(formDataa?.patient_contact || '');
//   const [dob, setDob] = useState(formDataa?.patient_dob || '');
//   const [occupation, setOccupation] = useState(formDataa?.occupation || '');
//   const [pincode, setPincode] = useState(formDataa?.pincode || '');
//   const [visitDate, setVisitDate] = useState(formDataa?.visit_date || today);
//   const [followupdate, setFollowupdate] = useState('');
//   const [patientSuggestionId, setPatientSuggestionId] = useState(null);
//   const [lastBill, setLastBill] = useState(formDataa?.last_bill || []);
//   const [healthDirectives, setHealthDirectives] = useState(formDataa?.health_directives || []);
//   const [patientExaminations, setPatientExaminations] = useState(formDataa?.patient_examinations || []);
//   const [ayurvedicExaminations, setAyurvedicExaminations] = useState(formDataa?.ayurvedic_examintion || []);
//   const [showPatientCard, setShowPatientCard] = useState(false);
//   const [doctor_name, setDoctorName] = useState('');
//   const [registration_number, setRegistration] = useState('');
//   const [rows, setRows] = useState([
//     { description: 'Consulting', quantity: 0, price: user?.consulting_fee || 0, gst: 0, total: 0 }
//   ]);
//   const [rowss, setRowss] = useState([]);
//   const [grandTotal, setGrandTotal] = useState('0.00');
//   const [showGST, setShowGST] = useState(true);
//   const [data, setData] = useState(null);
//   const [tokanPatientID, setTokanPatientID] = useState(null);
//   const [errors, setErrors] = useState({
//     patientName: '', patientAddress: '', phone: '', email: '', dob: '', visitDate: '',
//   });
//   const [rowErrors, setRowErrors] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   const [medicines, setMedicines] = useState([]);
//   const [isMedicalExpanded, setIsMedicalExpanded] = useState(false);
//   const [isAyurvedicExpanded, setIsAyurvedicExpanded] = useState(false);

//   // Medical Observations states
//   const [bp, setBp] = useState('');
//   const [pulse, setPulse] = useState('');
//   const [pastHistory, setPastHistory] = useState('');
//   const [complaints, setComplaints] = useState('');
//   const [sysExGeneral, setSysExGeneral] = useState('');
//   const [sysExPA, setSysExPA] = useState('');
//   const [weight, setWeight] = useState('');
//   const [height, setHeight] = useState('');
//   const [emaill, setEmaill] = useState('');
//   const [ayurPastHistory, setAyurPastHistory] = useState('');
//   const [prasavvedanParikshayein, setPrasavvedanParikshayein] = useState('');
//   const [habits, setHabits] = useState({
//     alcohol: '', cold_drink: '', fast_food: '', salty_food: '',
//     tobbacco: '', chocolate: '', drug_addict: '', late_night_sleep: '',
//     smoking: '', coffee: '', eating_habits: '', pan_masala: '', tea: ''
//   });
//   const [labInvestigation, setLabInvestigation] = useState('');
//   const [personalHistory, setPersonalHistory] = useState({
//     diet: '', appetite: '', sleep: '', thirst: '', bowel: '', micturition: ''
//   });
//   const [foodAndDrugAllergy, setFoodAndDrugAllergy] = useState('');
//   const [drugAllergy, setDrugAllergy] = useState('');
//   const [lmp, setLmp] = useState('');
//   const [edd, setEdd] = useState('');
//   const [ashtvidhData, setAshtvidhData] = useState({
//     nadi: [], jihva: [], mala: [], mutra: [], netra: [], aakruti: [], shabda: [], sparsha: []
//   });

//   const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');

//   // Calculate totalPrice for prescriptions
//   const totalPrice = rowss.reduce((acc, row) => {
//     if (!row || typeof row !== 'object' || !row.dosage || !row.duration || (!row.price && !row.drugDetails?.[0]?.price)) {
//       return acc;
//     }
//     const dosage = row.dosage || '';
//     const durationStr = row.duration || '';
//     const pricePerTablet = Number(row.price) || Number(row.drugDetails?.[0]?.price) || 0;
//     if (!/^[0-6]-[0-6]-[0-6]$/.test(dosage)) return acc;
//     const dailyDose = dosage.split('-').reduce((sum, val) => sum + Number(val), 0);
//     const durationMatch = durationStr.match(/\d+/) || [0];
//     const duration = parseInt(durationMatch[0], 10);
//     const total = dailyDose * duration * pricePerTablet;
//     return acc + (isNaN(total) ? 0 : total);
//   }, 0);

//   // Fetch patient data
//   const handleFetchData = async (selectedOption, inputValue) => {
//     if (!inputValue) {
//       showToast('Please enter an ID.', 'Validation Error', '#d9534f');
//       return;
//     }

//     try {
//       let response, patientId;
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
//           setPatientName(response?.patient?.name || response?.appointment?.name || '');
//           setPatientAddress(response?.patient?.address || '');
//           setEmail(response?.patient?.email || '');
//           setContactNumber(response?.patient?.phone || response?.appointment?.phone || '');
//           setDob(response?.patient?.dob || '');
//           setOccupation(response?.patient?.occupation || '');
//           setPincode(response?.patient?.pincode || '');
//           setPatientSuggestionId(patientId);
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
//         setPatientName(response?.patient?.name || '');
//         setPatientAddress(response?.patient?.address || '');
//         setEmail(response?.patient?.email || '');
//         setContactNumber(response?.patient?.phone || '');
//         setDob(response?.patient?.dob || '');
//         setOccupation(response?.patient?.occupation || '');
//         setPincode(response?.patient?.pincode || '');
//         setPatientSuggestionId(patientId);
//       }
//     } catch (error) {
//       console.error('Error fetching patient details:', error);
//       showToast('Failed to fetch data. Please check the ID and try again.', 'Validation Error', '#d9534f');
//       setData(null);
//       setShowPatientCard(false);
//       setLastBill([]);
//       setHealthDirectives([]);
//       setPatientExaminations([]);
//       setAyurvedicExaminations([]);
//     }
//   };

//   const validateForm = () => {
//     let formErrors = {};
//     let isValid = true;

//     if (!data?.patient?.name && !data?.appointment?.name && !patientName.trim()) {
//       formErrors['patientName'] = 'Patient name is required';
//       isValid = false;
//     }

//     if (!data?.patient?.address && !patientAddress.trim()) {
//       formErrors['patientAddress'] = 'Patient address is required';
//       isValid = false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (email.trim() && !emailRegex.test(email.trim())) {
//       formErrors['email'] = 'Enter a valid email address';
//       isValid = false;
//     }

//     if (!data?.patient?.dob && !dob) {
//       formErrors['dob'] = 'Date of birth is required';
//       isValid = false;
//     } else if (new Date(dob) >= new Date()) {
//       formErrors['dob'] = 'Date of birth cannot be in the future';
//       isValid = false;
//     }

//     if (!visitDate) {
//       formErrors.visitDate = 'Visit date is required';
//       isValid = false;
//     } else if (new Date(visitDate) > new Date()) {
//       formErrors.visitDate = 'Visit date cannot be in the future';
//       isValid = false;
//     }

//     setErrors(formErrors);
//     return isValid;
//   };

//   const validateRows = (rows) => {
//     let errors = rows.map((row) => ({
//       quantity: !row.quantity || row.quantity <= 0 ? 'Quantity is required and must be positive' : '',
//       price: !row.price || row.price <= 0 ? 'Price is required and must be positive' : '',
//     }));
//     setRowErrors(errors);
//     return !errors.some((error) => Object.values(error).some((err) => err));
//   };

//   const validateRowss = () => {
//     const errors = rowss.map((row) => {
//       const rowErrors = {};

//       rowErrors.strength = (typeof row.strength === 'string' && row.strength.trim() !== '')
//         ? null : 'Strength is required.';

//       rowErrors.dosage = (typeof row.dosage === 'string' && /^[0-6]-[0-6]-[0-6]$/.test(row.dosage.trim()))
//         ? null : 'Valid dosage (e.g., 1-0-1) is required.';

//       rowErrors.timing = (typeof row.timing === 'string' && row.timing.trim() !== '')
//         ? null : 'Timing is required.';

//       rowErrors.frequency = (typeof row.frequency === 'string' && row.frequency.trim() !== '')
//         ? null : 'Frequency is required.';

//       rowErrors.duration = (typeof row.duration === 'string' && row.duration.trim() !== '')
//         ? null : 'Duration is required.';

//       rowErrors.price = (row.price || row.drugDetails?.[0]?.price)
//         ? null : 'Price is required.';

//       return rowErrors;
//     });

//     setRowErrors(errors);
//     const hasErrors = errors.some(error => Object.values(error).some(val => val !== null));
//     const validRows = rowss.filter((_, idx) => Object.values(errors[idx]).every(val => val === null));
//     return { isValid: !hasErrors, validRows };
//   };

//   let r_num = registration_number || user?.registration_number || '';
//   let d_name = doctor_name || user?.name || '';

//   const handleSubmit = async () => {
//     console.log('Starting submit process...');

//     if (!validateForm()) {
//       console.log('Form validation failed');
//       showToast('Please correct form fields.', 'Validation Error', '#d9534f');
//       return;
//     }

//     if (!validateRows(rows)) {
//       console.log('Billing rows validation failed');
//       showToast('Please correct billing details.', 'Validation Error', '#d9534f');
//       return;
//     }

//     const { isValid, validRows } = validateRowss();
//     if (showTable && !isValid) {
//       showToast('Please correct prescription fields.', 'Validation Error', '#d9534f');
//       console.log('Prescription validation failed');
//       return;
//     }

//     const today = new Date();
//     const dobDate = new Date(dob);
//     if (dobDate >= today) {
//       showToast('Date of birth cannot be in the future.', 'Validation Error', '#d9534f');
//       return;
//     }

//     try {
//       const patientId = data?.patient?.id || tokanPatientID;
//       const tokenNumber = data?.tokan;
//       let skipAddPatient = false;
//       let manualPatientID = null;

//       console.log('Patient ID:', patientId);
//       console.log('Token Number:', tokenNumber);
//       console.log('Patient Suggestion ID:', patientSuggestionId);

//       // Check if patient already exists
//       if (patientSuggestionId) {
//         const patientRes = await post('/api/checkPatient', { id: patientSuggestionId });
//         const tokenRes = await post('/api/checkToken', { patient_id: patientSuggestionId });
//         if (patientRes.exists || tokenRes.exists) {
//           skipAddPatient = true;
//         }
//       } else if (tokenNumber) {
//         const tokenRes = await post('/api/checkToken', { tokan: tokenNumber });
//         if (tokenRes.exists) {
//           skipAddPatient = true;
//         }
//       } else if (patientId) {
//         const tokenRes = await post('/api/checkToken', { patient_id: patientId });
//         if (tokenRes.exists) {
//           skipAddPatient = true;
//         }
//       }

//       // Add patient if needed
//       if (!skipAddPatient && (!patientId || (patientId && !data?.patient?.fromSuggestion))) {
//         console.log('Adding new patient...');
//         const newPatientData = {
//           clinic_id: 'CLINIC123',
//           doctor_id: userData.id || '1',
//           name: patientName || data?.appointment?.name,
//           email,
//           phone: data?.appointment?.phone || phone || data?.patient?.phone,
//           address: patientAddress,
//           dob,
//           occupation,
//           pincode
//         };

//         console.log('New patient data:', newPatientData);

//         const added = await post('/api/manuallyAddPatient', newPatientData);
//         manualPatientID = added?.patient?.id;
//         console.log('Patient added successfully with ID:', manualPatientID);
//       }

//       // Create bill
//       console.log('Creating bill...');
//       const billData = {
//         patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get tokan',
//         patient_name: data?.patient?.name || patientName || data?.appointment?.name,
//         address: data?.patient?.address || patientAddress,
//         email: data?.patient?.email || email,
//         contact: data?.patient?.phone || data?.appointment?.phone || `91${phone}`,
//         dob: data?.patient?.dob || dob,
//         occupation: data?.patient?.occupation || occupation,
//         pincode: data?.patient?.pincode || pincode,
//         doctor_name: d_name,
//         registration_number: r_num,
//         visit_date: visitDate,
//         followup_date: followupdate,
//         grand_total: grandTotal,
//       };

//       console.log('Bill data:', billData);

//       const billResponse = await post('/api/bills', billData);
//       const billno = billResponse.id;
//       console.log('Bill created successfully with ID:', billno);

//       // Add bill descriptions
//       console.log('Adding bill descriptions...');
//       const descriptionData = rows.map((row) => ({
//         bill_id: `${billno}`,
//         description: row.description,
//         quantity: row.quantity,
//         price: row.price,
//         gst: row.gst,
//         total: row.total,
//       }));

//       console.log('Description data:', descriptionData);
//       await post('/api/descriptions', { descriptions: descriptionData });
//       console.log('Descriptions added successfully');

//       // Add prescriptions if showTable is true
//       if (showTable && validRows.length > 0) {
//         console.log('Processing prescriptions...');
//         const prescriptionData = validRows.map((row) => ({
//           p_p_i_id: `${billno}`,
//           patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get Patient ID',
//           medicine: medicines.find(med => med.id === parseInt(row.description, 10))?.drug_name || row.description,
//           strength: row.strength || '',
//           dosage: row.dosage || '',
//           timing: row.timing || '',
//           frequency: row.frequency || '',
//           duration: row.duration || '',
//         }));

//         console.log('Prescription data to send:', prescriptionData);
//         await post('/api/healthdirectives', { prescriptions: prescriptionData });
//         console.log('Prescriptions API called successfully');
//       } else {
//         console.log('Skipping prescriptions as table is not shown or no valid rows');
//       }

//       // Add examinations if any data exists
//       const hasPatientExamData = bp || pulse || pastHistory || complaints || sysExGeneral || sysExPA || weight || height;
//       const hasAyurvedicDiagnosisData = emaill || ayurPastHistory || prasavvedanParikshayein ||
//         Object.values(habits).some(val => val) || labInvestigation || 
//         Object.values(personalHistory).some(val => val) || foodAndDrugAllergy || drugAllergy || lmp || edd ||
//         Object.values(ashtvidhData).some(arr => arr.length > 0);

//       if (hasPatientExamData || hasAyurvedicDiagnosisData) {
//         console.log('Adding patient examinations...');
//         const patientExaminationData = hasPatientExamData ? {
//           p_p_i_id: `${billno}`,
//           patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get patient ID',
//           bp: bp || '',
//           pulse: pulse || '',
//           weight: weight || '',
//           height: height || '',
//           past_history: pastHistory || '',
//           complaints: complaints || '',
//           systemic_exam_general: sysExGeneral || '',
//           systemic_exam_pa: sysExPA || '',
//         } : {};

//         const ayurvedicDiagnosisData = hasAyurvedicDiagnosisData ? {
//           p_p_i_id: `${billno}`,
//           patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get patient ID',
//           email: emaill || '',
//           ayurPastHistory: ayurPastHistory || '',
//           prasavvedan_parikshayein: JSON.stringify(prasavvedanParikshayein || {}),
//           habits: JSON.stringify(habits || {}),
//           lab_investigation: labInvestigation || '',
//           personal_history: JSON.stringify(personalHistory || {}),
//           food_and_drug_allergy: foodAndDrugAllergy || '',
//           drug_allery: drugAllergy || '',
//           lmp: lmp || '',
//           edd: edd || '',
//           ashtvidh_parikshayein: JSON.stringify(ashtvidhData || {}),
//         } : {};

//         const payload = {
//           ...patientExaminationData,
//           ...ayurvedicDiagnosisData,
//         };

//         console.log('Examination payload:', payload);
//         await post('/api/patientexaminations', payload);
//         console.log('Patient examinations API called successfully');
//       } else {
//         console.log('Skipping patient examinations as no data provided');
//       }

//       showToast('Bill and descriptions created successfully!', 'Successfully Submitted', '#198754');
//       navigate('/Invoice', { state: { billId: billno } });
//     } catch (error) {
//       console.error('Error in handleSubmit:', error);
//       showToast('An error occurred while submitting data.', 'Validation Error', '#d9534f');
//     }
//   };

//   return (
//     <CForm>
//       <TokenAppointment
//         setData={setData}
//         setShowPatientCard={setShowPatientCard}
//         setLastBill={setLastBill}
//         setHealthDirectives={setHealthDirectives}
//         setPatientExaminations={setPatientExaminations}
//         setAyurvedicExaminations={setAyurvedicExaminations}
//         setTokanPatientID={setTokanPatientID}
//         setPatientName={setPatientName}
//         setPatientAddress={setPatientAddress}
//         setEmail={setEmail}
//         setContactNumber={setContactNumber}
//         setDob={setDob}
//         setOccupation={setOccupation}
//         setPincode={setPincode}
//         setPatientSuggestionId={setPatientSuggestionId}
//         handleFetchData={handleFetchData}
//       />
//       <PatientInformation
//         patientName={patientName}
//         setPatientName={setPatientName}
//         patientAddress={patientAddress}
//         setPatientAddress={setPatientAddress}
//         email={email}
//         setEmail={setEmail}
//         phone={phone}
//         setContactNumber={setContactNumber}
//         dob={dob}
//         setDob={setDob}
//         occupation={occupation}
//         setOccupation={setOccupation}
//         pincode={pincode}
//         setPincode={setPincode}
//         visitDate={visitDate}
//         setVisitDate={setVisitDate}
//         patientSuggestionId={patientSuggestionId}
//         setPatientSuggestionId={setPatientSuggestionId}
//         data={data}
//         errors={errors}
//         setLastBill={setLastBill}
//         setHealthDirectives={setHealthDirectives}
//         setPatientExaminations={setPatientExaminations}
//         setAyurvedicExaminations={setAyurvedicExaminations}
//         setShowPatientCard={setShowPatientCard}
//       />
//       <PastHistory
//         showPatientCard={showPatientCard}
//         lastBill={lastBill}
//         healthDirectives={healthDirectives}
//         patientExaminations={patientExaminations}
//         ayurvedicExaminations={ayurvedicExaminations}
//       />
//       <MedicalObservations
//         userData={userData}
//         bp={bp}
//         setBp={setBp}
//         pulse={pulse}
//         setPulse={setPulse}
//         pastHistory={pastHistory}
//         setPastHistory={setPastHistory}
//         complaints={complaints}
//         setComplaints={setComplaints}
//         sysExGeneral={sysExGeneral}
//         setSysExGeneral={setSysExGeneral}
//         sysExPA={sysExPA}
//         setSysExPA={setSysExPA}
//         weight={weight}
//         setWeight={setWeight}
//         height={height}
//         setHeight={setHeight}
//         emaill={emaill}
//         setEmaill={setEmaill}
//         ayurPastHistory={ayurPastHistory}
//         setAyurPastHistory={setAyurPastHistory}
//         prasavvedanParikshayein={prasavvedanParikshayein}
//         setPrasavvedanParikshayein={setPrasavvedanParikshayein}
//         habits={habits}
//         setHabits={setHabits}
//         labInvestigation={labInvestigation}
//         setLabInvestigation={setLabInvestigation}
//         personalHistory={personalHistory}
//         setPersonalHistory={setPersonalHistory}
//         foodAndDrugAllergy={foodAndDrugAllergy}
//         setFoodAndDrugAllergy={setFoodAndDrugAllergy}
//         drugAllergy={drugAllergy}
//         setDrugAllergy={setDrugAllergy}
//         lmp={lmp}
//         setLmp={setLmp}
//         edd={edd}
//         setEdd={setEdd}
//         ashtvidhData={ashtvidhData}
//         setAshtvidhData={setAshtvidhData}
//         isMedicalExpanded={isMedicalExpanded}
//         setIsMedicalExpanded={setIsMedicalExpanded}
//         isAyurvedicExpanded={isAyurvedicExpanded}
//         setIsAyurvedicExpanded={setIsAyurvedicExpanded}
//       />
//       <MedicalPrescriptions
//         rowss={rowss}
//         setRowss={setRowss}
//         rowErrors={rowErrors}
//         setRowErrors={setRowErrors}
//         showTable={showTable}
//         setShowTable={setShowTable}
//         medicines={medicines}
//         setMedicines={setMedicines}
//       />
//       <BillingDetails
//         rows={rows}
//         setRows={setRows}
//         rowErrors={rowErrors}
//         setRowErrors={setRowErrors}
//         showGST={showGST}
//         setShowGST={setShowGST}
//         rowss={rowss}
//         totalPrice={totalPrice}
//         setGrandTotal={setGrandTotal}
//       />
//       <CCardBody>
//         <CRow className="g-3 align-items-center">
//           <CCol xs={12} md={8} lg={7}>
//             <div className="d-flex flex-column flex-md-row align-items-md-center">
//               <label htmlFor="followupdate" className="fw-semibold mb-2 mb-md-0 me-md-2" style={{ minWidth: '150px' }}>
//                 📅 Followup Date
//               </label>
//               <CFormInput
//                 type="date"
//                 id="followupdate"
//                 value={followupdate}
//                 onChange={(e) => setFollowupdate(e.target.value)}
//                 required
//                 className="me-md-2 border border-2 border-black"
//               />
//               <CButton color="primary" onClick={handleSubmit} className="mt-2 mt-md-0 fw-semibold w-75">
//                 Submit
//               </CButton>
//             </div>
//           </CCol>
//         </CRow>
//       </CCardBody>
//     </CForm>
//   );
// };

// export default MainPage;
























import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CCardBody, CRow, CCol, CButton, CForm, CFormInput
} from '@coreui/react';
import { getAPICall, post } from '../../../util/api';
import { getUser } from '../../../util/session';
import { showToast } from '../toastContainer/toastContainer';
import TokenAppointment from './TokenAppointment';
import PatientInformation from './PatientInformation';
import PastHistory from './PastHistory';
import MedicalObservations from './MedicalObservations';
import MedicalPrescriptions from './MedicalPrescriptions';
import BillingDetails from './BillingDetails';
import BabyPadiatricObservation from './BabyPadiatricObservation';
import BabyPediatricObservation from './BabyPadiatricObservation';

const MainPage = () => {
  const today = new Date().toISOString().split('T')[0];
  const user = getUser();
  const location = useLocation();
  const { formDataa } = location.state || {};
  const navigate = useNavigate();

  // Shared state
  const [patientName, setPatientName] = useState(formDataa?.patient_name || '');
  const [patientAddress, setPatientAddress] = useState(formDataa?.patient_address || '');
  const [email, setEmail] = useState(formDataa?.patient_email || '');
  const [phone, setContactNumber] = useState(formDataa?.patient_contact || '');
  const [dob, setDob] = useState(formDataa?.patient_dob || '');
  const [occupation, setOccupation] = useState(formDataa?.occupation || '');
  const [pincode, setPincode] = useState(formDataa?.pincode || '');
  const [visitDate, setVisitDate] = useState(formDataa?.visit_date || today);
  const [followupdate, setFollowupdate] = useState('');
  const [patientSuggestionId, setPatientSuggestionId] = useState(null);
  const [lastBill, setLastBill] = useState(formDataa?.last_bill || []);
  const [healthDirectives, setHealthDirectives] = useState(formDataa?.health_directives || []);
  const [patientExaminations, setPatientExaminations] = useState(formDataa?.patient_examinations || []);
  const [ayurvedicExaminations, setAyurvedicExaminations] = useState(formDataa?.ayurvedic_examintion || []);
  const [showPatientCard, setShowPatientCard] = useState(false);
  const [doctor_name, setDoctorName] = useState('');
  const [registration_number, setRegistration] = useState('');
  const [rows, setRows] = useState([
    { description: 'Consulting', quantity: 0, price: user?.consulting_fee || 0, gst: 0, total: 0 }
  ]);
  const [rowss, setRowss] = useState([]);
  const [grandTotal, setGrandTotal] = useState('0.00');
  const [showGST, setShowGST] = useState(true);
  const [data, setData] = useState(null);
  const [tokanPatientID, setTokanPatientID] = useState(null);
  const [errors, setErrors] = useState({
    patientName: '', patientAddress: '', phone: '', email: '', dob: '', visitDate: '',
  });
  const [rowErrors, setRowErrors] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [isMedicalExpanded, setIsMedicalExpanded] = useState(false);
  const [isAyurvedicExpanded, setIsAyurvedicExpanded] = useState(false);

  // Medical Observations states
  const [bp, setBp] = useState('');
  const [pulse, setPulse] = useState('');
  const [pastHistory, setPastHistory] = useState('');
  const [complaints, setComplaints] = useState('');
  const [sysExGeneral, setSysExGeneral] = useState('');
  const [sysExPA, setSysExPA] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [emaill, setEmaill] = useState('');
  const [ayurPastHistory, setAyurPastHistory] = useState('');
  const [habits, setHabits] = useState({
    alcohol: '', cold_drink: '', fast_food: '', salty_food: '',
    tobbacco: '', chocolate: '', drug_addict: '', late_night_sleep: '',
    smoking: '', coffee: '', eating_habits: '', pan_masala: '', tea: ''
  });
  const [labInvestigation, setLabInvestigation] = useState('');
  const [personalHistory, setPersonalHistory] = useState({
    diet: '', appetite: '', sleep: '', thirst: '', bowel: '', micturition: ''
  });
  const [foodAndDrugAllergy, setFoodAndDrugAllergy] = useState('');
  const [drugAllergy, setDrugAllergy] = useState('');
  const [lmp, setLmp] = useState('');
  const [edd, setEdd] = useState('');
  const [ashtvidhData, setAshtvidhData] = useState({
    nadi: [], jihva: [], mala: [], mutra: [], netra: [], aakruti: [], shabda: [], sparsha: []
  });

  // Baby Pediatric Observation states
  const [weightBaby, setWeightBaby] = useState('');
  const [heightBaby, setHeightBaby] = useState('');
  const [headCircumference, setHeadCircumference] = useState('');
  const [temperature, setTemperature] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [respiratoryRate, setRespiratoryRate] = useState('');
  const [vaccinationsGiven, setVaccinationsGiven] = useState('');
  const [milestonesAchieved, setMilestonesAchieved] = useState('');
  const [remarks, setRemarks] = useState('');

  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');

  // Calculate totalPrice for prescriptions
  const totalPrice = rowss.reduce((acc, row) => {
    if (!row || typeof row !== 'object' || !row.dosage || !row.duration || (!row.price && !row.drugDetails?.[0]?.price)) {
      return acc;
    }
    const dosage = row.dosage || '';
    const durationStr = row.duration || '';
    const pricePerTablet = Number(row.price) || Number(row.drugDetails?.[0]?.price) || 0;
    if (!/^[0-6]-[0-6]-[0-6]$/.test(dosage)) return acc;
    const dailyDose = dosage.split('-').reduce((sum, val) => sum + Number(val), 0);
    const durationMatch = durationStr.match(/\d+/) || [0];
    const duration = parseInt(durationMatch[0], 10);
    const total = dailyDose * duration * pricePerTablet;
    return acc + (isNaN(total) ? 0 : total);
  }, 0);

  // Fetch patient data
  const handleFetchData = async (selectedOption, inputValue) => {
    if (!inputValue) {
      showToast('Please enter an ID.', 'Validation Error', '#d9534f');
      return;
    }

    try {
      let response, patientId;
      if (selectedOption === 'Appointment') {
        response = await getAPICall(`/api/getAppointmentByToken/${inputValue}`);
        const tokenRes = await post('/api/checkToken', { tokan: inputValue });
        patientId = tokenRes.patient_id;

        if (!patientId && response?.phone) {
          const phoneOnly10Digits = response.phone.slice(-10);
          const matchResponse = await getAPICall(`/api/findByPhone/${phoneOnly10Digits}`);
          patientId = matchResponse?.patient?.id;
        }

        setData(response);
        setTokanPatientID(patientId || null);

        if (patientId) {
          const res = await getAPICall(`/api/patient-details/${patientId}`);
          setLastBill(res?.last_bill || []);
          setHealthDirectives(res?.health_directives || []);
          setPatientExaminations(res?.patient_examinations || []);
          setAyurvedicExaminations(res?.ayurvedic_examintion || []);
          setShowPatientCard(true);
          setPatientName(response?.patient?.name || response?.appointment?.name || '');
          setPatientAddress(response?.patient?.address || '');
          setEmail(response?.patient?.email || '');
          setContactNumber(response?.patient?.phone || response?.appointment?.phone || '');
          setDob(response?.patient?.dob || '');
          setOccupation(response?.patient?.occupation || '');
          setPincode(response?.patient?.pincode || '');
          setPatientSuggestionId(patientId);
        } else {
          setLastBill([]);
          setHealthDirectives([]);
          setPatientExaminations([]);
          setAyurvedicExaminations([]);
          setShowPatientCard(true);
        }
      } else {
        response = await post('/api/getPatientInfo', { tokan_number: inputValue });
        patientId = response?.patient?.id;

        if (!patientId) {
          throw new Error('Patient ID not found in token response.');
        }

        setData(response);
        setTokanPatientID(patientId);

        const res = await getAPICall(`/api/patient-details/${patientId}`);
        setLastBill(res?.last_bill || []);
        setHealthDirectives(res?.health_directives || []);
        setPatientExaminations(res?.patient_examinations || []);
        setAyurvedicExaminations(res?.ayurvedic_examintion || []);
        setShowPatientCard(true);
        setPatientName(response?.patient?.name || '');
        setPatientAddress(response?.patient?.address || '');
        setEmail(response?.patient?.email || '');
        setContactNumber(response?.patient?.phone || '');
        setDob(response?.patient?.dob || '');
        setOccupation(response?.patient?.occupation || '');
        setPincode(response?.patient?.pincode || '');
        setPatientSuggestionId(patientId);
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
      showToast('Failed to fetch data. Please check the ID and try again.', 'Validation Error', '#d9534f');
      setData(null);
      setShowPatientCard(false);
      setLastBill([]);
      setHealthDirectives([]);
      setPatientExaminations([]);
      setAyurvedicExaminations([]);
    }
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!data?.patient?.name && !data?.appointment?.name && !patientName.trim()) {
      formErrors['patientName'] = 'Patient name is required';
      isValid = false;
    }

    if (!data?.patient?.address && !patientAddress.trim()) {
      formErrors['patientAddress'] = 'Patient address is required';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() && !emailRegex.test(email.trim())) {
      formErrors['email'] = 'Enter a valid email address';
      isValid = false;
    }

    if (!data?.patient?.dob && !dob) {
      formErrors['dob'] = 'Date of birth is required';
      isValid = false;
    } else if (new Date(dob) >= new Date()) {
      formErrors['dob'] = 'Date of birth cannot be in the future';
      isValid = false;
    }

    if (!visitDate) {
      formErrors.visitDate = 'Visit date is required';
      isValid = false;
    } else if (new Date(visitDate) > new Date()) {
      formErrors.visitDate = 'Visit date cannot be in the future';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const validateRows = (rows) => {
    let errors = rows.map((row) => ({
      quantity: !row.quantity || row.quantity <= 0 ? 'Quantity is required and must be positive' : '',
      price: !row.price || row.price <= 0 ? 'Price is required and must be positive' : '',
    }));
    setRowErrors(errors);
    return !errors.some((error) => Object.values(error).some((err) => err));
  };

  const validateRowss = () => {
    const errors = rowss.map((row) => {
      const rowErrors = {};

      rowErrors.strength = (typeof row.strength === 'string' && row.strength.trim() !== '')
        ? null : 'Strength is required.';

      rowErrors.dosage = (typeof row.dosage === 'string' && /^[0-6]-[0-6]-[0-6]$/.test(row.dosage.trim()))
        ? null : 'Valid dosage (e.g., 1-0-1) is required.';

      rowErrors.timing = (typeof row.timing === 'string' && row.timing.trim() !== '')
        ? null : 'Timing is required.';

      rowErrors.frequency = (typeof row.frequency === 'string' && row.frequency.trim() !== '')
        ? null : 'Frequency is required.';

      rowErrors.duration = (typeof row.duration === 'string' && row.duration.trim() !== '')
        ? null : 'Duration is required.';

      rowErrors.price = (row.price || row.drugDetails?.[0]?.price)
        ? null : 'Price is required.';

      return rowErrors;
    });

    setRowErrors(errors);
    const hasErrors = errors.some(error => Object.values(error).some(val => val !== null));
    const validRows = rowss.filter((_, idx) => Object.values(errors[idx]).every(val => val === null));
    return { isValid: !hasErrors, validRows };
  };

  let r_num = registration_number || user?.registration_number || '';
  let d_name = doctor_name || user?.name || '';

  const handleSubmit = async () => {
    console.log('Starting submit process...');

    if (!validateForm()) {
      console.log('Form validation failed');
      showToast('Please correct form fields.', 'Validation Error', '#d9534f');
      return;
    }

    if (!validateRows(rows)) {
      console.log('Billing rows validation failed');
      showToast('Please correct billing details.', 'Validation Error', '#d9534f');
      return;
    }

    const { isValid, validRows } = validateRowss();
    if (showTable && !isValid) {
      showToast('Please correct prescription fields.', 'Validation Error', '#d9534f');
      console.log('Prescription validation failed');
      return;
    }

    const today = new Date();
    const dobDate = new Date(dob);
    if (dobDate >= today) {
      showToast('Date of birth cannot be in the future.', 'Validation Error', '#d9534f');
      return;
    }

    try {
      const patientId = data?.patient?.id || tokanPatientID;
      const tokenNumber = data?.tokan;
      let skipAddPatient = false;
      let manualPatientID = null;

      console.log('Patient ID:', patientId);
      console.log('Token Number:', tokenNumber);
      console.log('Patient Suggestion ID:', patientSuggestionId);

      // Check if patient already exists
      if (patientSuggestionId) {
        const patientRes = await post('/api/checkPatient', { id: patientSuggestionId });
        const tokenRes = await post('/api/checkToken', { patient_id: patientSuggestionId });
        if (patientRes.exists || tokenRes.exists) {
          skipAddPatient = true;
        }
      } else if (tokenNumber) {
        const tokenRes = await post('/api/checkToken', { tokan: tokenNumber });
        if (tokenRes.exists) {
          skipAddPatient = true;
        }
      } else if (patientId) {
        const tokenRes = await post('/api/checkToken', { patient_id: patientId });
        if (tokenRes.exists) {
          skipAddPatient = true;
        }
      }

      // Add patient if needed
      if (!skipAddPatient && (!patientId || (patientId && !data?.patient?.fromSuggestion))) {
        console.log('Adding new patient...');
        const newPatientData = {
          clinic_id: 'CLINIC123',
          doctor_id: userData.id || '1',
          name: patientName || data?.appointment?.name,
          email,
          phone: data?.appointment?.phone || phone || data?.patient?.phone,
          address: patientAddress,
          dob,
          occupation,
          pincode
        };

        console.log('New patient data:', newPatientData);

        const added = await post('/api/manuallyAddPatient', newPatientData);
        manualPatientID = added?.patient?.id;
        console.log('Patient added successfully with ID:', manualPatientID);
      }

      // Create bill
      console.log('Creating bill...');
      const billData = {
        patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get tokan',
        patient_name: data?.patient?.name || patientName || data?.appointment?.name,
        address: data?.patient?.address || patientAddress,
        email: data?.patient?.email || email,
        contact: data?.patient?.phone || data?.appointment?.phone || `91${phone}`,
        dob: data?.patient?.dob || dob,
        occupation: data?.patient?.occupation || occupation,
        pincode: data?.patient?.pincode || pincode,
        doctor_name: d_name,
        registration_number: r_num,
        visit_date: visitDate,
        followup_date: followupdate,
        grand_total: grandTotal,
      };

      console.log('Bill data:', billData);

      const billResponse = await post('/api/bills', billData);
      const billno = billResponse.id;
      console.log('Bill created successfully with ID:', billno);

      // Add bill descriptions
      console.log('Adding bill descriptions...');
      const descriptionData = rows.map((row) => ({
        bill_id: `${billno}`,
        description: row.description,
        quantity: row.quantity,
        price: row.price,
        gst: row.gst,
        total: row.total,
      }));

      console.log('Description data:', descriptionData);
      await post('/api/descriptions', { descriptions: descriptionData });
      console.log('Descriptions added successfully');

      // Add prescriptions if showTable is true
      if (showTable && validRows.length > 0) {
        console.log('Processing prescriptions...');
        const prescriptionData = validRows.map((row) => ({
          p_p_i_id: `${billno}`,
          patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get Patient ID',
          medicine: medicines.find(med => med.id === parseInt(row.description, 10))?.drug_name || row.description,
          strength: row.strength || '',
          dosage: row.dosage || '',
          timing: row.timing || '',
          frequency: row.frequency || '',
          duration: row.duration || '',
        }));

        console.log('Prescription data to send:', prescriptionData);
        await post('/api/healthdirectives', { prescriptions: prescriptionData });
        console.log('Prescriptions API called successfully');
      } else {
        console.log('Skipping prescriptions as table is not shown or no valid rows');
      }

      // Add examinations if any data exists
      const hasPatientExamData = bp || pulse || pastHistory || complaints || sysExGeneral || sysExPA || weight || height;
      const hasAyurvedicDiagnosisData = emaill || ayurPastHistory ||
        Object.values(habits).some(val => val) || labInvestigation || 
        Object.values(personalHistory).some(val => val) || foodAndDrugAllergy || drugAllergy || lmp || edd ||
        Object.values(ashtvidhData).some(arr => arr.length > 0);
      const hasBabyPediatricData = weight || height || headCircumference || temperature || heartRate || respiratoryRate || vaccinationsGiven || milestonesAchieved || remarks ;
        
       
      if (hasPatientExamData || hasAyurvedicDiagnosisData || hasBabyPediatricData) {
        console.log('Adding patient examinations...');
        const patientExaminationData = hasPatientExamData ? {
          p_p_i_id: `${billno}`,
          patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get patient ID',
          bp: bp || '',
          pulse: pulse || '',
          weight: weight || '',
          height: height || '',
          past_history: pastHistory || '',
          complaints: complaints || '',
          systemic_exam_general: sysExGeneral || '',
          systemic_exam_pa: sysExPA || '',
        } : {};

        const ayurvedicDiagnosisData = hasAyurvedicDiagnosisData ? {
          p_p_i_id: `${billno}`,
          patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get patient ID',
          email: emaill || '',
          ayurPastHistory: ayurPastHistory || '',
          prasavvedan_parikshayein: JSON.stringify(ashtvidhData),
          habits: JSON.stringify(habits || {}),
          lab_investigation: labInvestigation || '',
          personal_history: JSON.stringify(personalHistory || {}),
          food_and_drug_allergy: foodAndDrugAllergy || '',
          drug_allery: drugAllergy || '',
          lmp: lmp || '',
          edd: edd || '',
          ashtvidh_parikshayein: JSON.stringify(ashtvidhData || {}),
        } : {}; 

       const babyPediatricData = hasBabyPediatricData ? {
          p_p_i_id: `${billno}`,
          patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get patient ID',
          doctor_id: user?.id,
          weightBaby: weightBaby || '',
          heightBaby: heightBaby || '',
          head_circumference: headCircumference || '',
          temperature: temperature || '',
          heart_rate: heartRate || '',
          respiratory_rate: respiratoryRate || '',
          vaccinations_given: vaccinationsGiven || '',
          milestones_achieved: milestonesAchieved || '',
          remarks: remarks || ''

       } :{};

        const payload = {
          ...patientExaminationData,
          ...ayurvedicDiagnosisData,
          ...babyPediatricData,
        };

        console.log('Examination payload:', payload);
        await post('/api/patientexaminations', payload);
        console.log('Patient examinations API called successfully');
      } else {
        console.log('Skipping patient examinations as no data provided');
      }




      showToast('Bill and descriptions created successfully!', 'Successfully Submitted', '#198754');
      navigate('/Invoice', { state: { billId: billno } });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      showToast('An error occurred while submitting data.', 'Validation Error', '#d9534f');
    }
  };

  return (
    <CForm>
      <TokenAppointment
        setData={setData}
        setShowPatientCard={setShowPatientCard}
        setLastBill={setLastBill}
        setHealthDirectives={setHealthDirectives}
        setPatientExaminations={setPatientExaminations}
        setAyurvedicExaminations={setAyurvedicExaminations}
        setTokanPatientID={setTokanPatientID}
        setPatientName={setPatientName}
        setPatientAddress={setPatientAddress}
        setEmail={setEmail}
        setContactNumber={setContactNumber}
        setDob={setDob}
        setOccupation={setOccupation}
        setPincode={setPincode}
        setPatientSuggestionId={setPatientSuggestionId}
        handleFetchData={handleFetchData}
      />
      <PatientInformation
        patientName={patientName}
        setPatientName={setPatientName}
        patientAddress={patientAddress}
        setPatientAddress={setPatientAddress}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setContactNumber={setContactNumber}
        dob={dob}
        setDob={setDob}
        occupation={occupation}
        setOccupation={setOccupation}
        pincode={pincode}
        setPincode={setPincode}
        visitDate={visitDate}
        setVisitDate={setVisitDate}
        patientSuggestionId={patientSuggestionId}
        setPatientSuggestionId={setPatientSuggestionId}
        data={data}
        errors={errors}
        setLastBill={setLastBill}
        setHealthDirectives={setHealthDirectives}
        setPatientExaminations={setPatientExaminations}
        setAyurvedicExaminations={setAyurvedicExaminations}
        setShowPatientCard={setShowPatientCard}
      />
      <PastHistory
        showPatientCard={showPatientCard}
        lastBill={lastBill}
        healthDirectives={healthDirectives}
        patientExaminations={patientExaminations}
        ayurvedicExaminations={ayurvedicExaminations}

         bp={bp}
        setBp={setBp}
        pulse={pulse}
        setPulse={setPulse}
        pastHistory={pastHistory}
        setPastHistory={setPastHistory}
        complaints={complaints}
        setComplaints={setComplaints}
        sysExGeneral={sysExGeneral}
        setSysExGeneral={setSysExGeneral}
        sysExPA={sysExPA}
        setSysExPA={setSysExPA}
        weight={weight}
        setWeight={setWeight}
        height={height}
        setHeight={setHeight}
        emaill={emaill}
        setEmaill={setEmaill}
        ayurPastHistory={ayurPastHistory}
        setAyurPastHistory={setAyurPastHistory}
        habits={habits}
        setHabits={setHabits}
        labInvestigation={labInvestigation}
        setLabInvestigation={setLabInvestigation}
        personalHistory={personalHistory}
        setPersonalHistory={setPersonalHistory}
        foodAndDrugAllergy={foodAndDrugAllergy}
        setFoodAndDrugAllergy={setFoodAndDrugAllergy}
        drugAllergy={drugAllergy}
        setDrugAllergy={setDrugAllergy}
        lmp={lmp}
        setLmp={setLmp}
        edd={edd}
        setEdd={setEdd}
        ashtvidhData={ashtvidhData}
        setAshtvidhData={setAshtvidhData}
      />
      <MedicalObservations
        userData={userData}
        bp={bp}
        setBp={setBp}
        pulse={pulse}
        setPulse={setPulse}
        pastHistory={pastHistory}
        setPastHistory={setPastHistory}
        complaints={complaints}
        setComplaints={setComplaints}
        sysExGeneral={sysExGeneral}
        setSysExGeneral={setSysExGeneral}
        sysExPA={sysExPA}
        setSysExPA={setSysExPA}
        weight={weight}
        setWeight={setWeight}
        height={height}
        setHeight={setHeight}
        emaill={emaill}
        setEmaill={setEmaill}
        ayurPastHistory={ayurPastHistory}
        setAyurPastHistory={setAyurPastHistory}
        habits={habits}
        setHabits={setHabits}
        labInvestigation={labInvestigation}
        setLabInvestigation={setLabInvestigation}
        personalHistory={personalHistory}
        setPersonalHistory={setPersonalHistory}
        foodAndDrugAllergy={foodAndDrugAllergy}
        setFoodAndDrugAllergy={setFoodAndDrugAllergy}
        drugAllergy={drugAllergy}
        setDrugAllergy={setDrugAllergy}
        lmp={lmp}
        setLmp={setLmp}
        edd={edd}
        setEdd={setEdd}
        ashtvidhData={ashtvidhData}
        setAshtvidhData={setAshtvidhData}
        isMedicalExpanded={isMedicalExpanded}
        setIsMedicalExpanded={setIsMedicalExpanded}
        isAyurvedicExpanded={isAyurvedicExpanded}
        setIsAyurvedicExpanded={setIsAyurvedicExpanded}
      />
      <BabyPediatricObservation
 userData={userData}
  type={1}
  weightBaby={weightBaby}
  setWeightBaby={setWeightBaby}
  heightBaby={heightBaby}
  setHeightBaby={setHeightBaby}
  headCircumference={headCircumference}
  setHeadCircumference={setHeadCircumference}
  temperature={temperature}
  setTemperature={setTemperature}
  heartRate={heartRate}
  setHeartRate={setHeartRate}
  respiratoryRate={respiratoryRate}
  setRespiratoryRate={setRespiratoryRate}
  vaccinationsGiven={vaccinationsGiven}
  setVaccinationsGiven={setVaccinationsGiven}
  milestonesAchieved={milestonesAchieved}
  setMilestonesAchieved={setMilestonesAchieved}
  remarks={remarks}
  setRemarks={setRemarks}
/>
      <MedicalPrescriptions
        rowss={rowss}
        setRowss={setRowss}
        rowErrors={rowErrors}
        setRowErrors={setRowErrors}
        showTable={showTable}
        setShowTable={setShowTable}
        medicines={medicines}
        setMedicines={setMedicines}
      />
      <BillingDetails
        rows={rows}
        setRows={setRows}
        rowErrors={rowErrors}
        setRowErrors={setRowErrors}
        showGST={showGST}
        setShowGST={setShowGST}
        rowss={rowss}
        totalPrice={totalPrice}
        setGrandTotal={setGrandTotal}
      />
      <CCardBody>
        <CRow className="g-3 align-items-center">
          <CCol xs={12} md={8} lg={7}>
            <div className="d-flex flex-column flex-md-row align-items-md-center">
              <label htmlFor="followupdate" className="fw-semibold mb-2 mb-md-0 me-md-2" style={{ minWidth: '150px' }}>
                📅 Followup Date
              </label>
              <CFormInput
                type="date"
                id="followupdate"
                value={followupdate}
                onChange={(e) => setFollowupdate(e.target.value)}
                required
                className="me-md-2 border border-2 border-black"
              />
              <CButton color="primary" onClick={handleSubmit} className="mt-2 mt-md-0 fw-semibold w-75">
                Submit
              </CButton>
            </div>
          </CCol>
        </CRow>
      </CCardBody>
    </CForm>
  );
};

export default MainPage;