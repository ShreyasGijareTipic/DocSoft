// import React, { useState, useEffect } from 'react';
// import {
//   CCard, CRow, CCol, CFormLabel, CFormInput, CButton, CFormCheck, CFormSelect
// } from '@coreui/react';
// import Select from 'react-select';
// import { getAPICall } from '../../../util/api';
// import { cilFile } from '@coreui/icons';
// import CIcon from '@coreui/icons-react';

// const MedicalObservations = ({ userData }) => {
//   const [isMedicalExpanded, setIsMedicalExpanded] = useState(false);
//   const [isAyurvedicExpanded, setIsAyurvedicExpanded] = useState(false);
//   const [bp, setBp] = useState("");
//   const [weight, setWeight] = useState("");
//   const [height, setHeight] = useState("");
//   const [pulse, setPulse] = useState("");
//   const [pastHistory, setPastHistory] = useState("");
//   const [complaints, setComplaints] = useState("");
//   const [sysExGeneral, setSysExGeneral] = useState("");
//   const [sysExPA, setSysExPA] = useState("");
//   const [emaill, setEmaill] = useState('');
//   const [ayurPastHistory, setAyurPastHistory] = useState('');
//   const [prasavvedanParikshayein, setPrasavvedanParikshayein] = useState('');
//   const [labInvestigation, setLabInvestigation] = useState('');
//   const [foodAndDrugAllergy, setFoodAndDrugAllergy] = useState('');
//   const [drugAllergy, setDrugAllergy] = useState('');
//   const [lmp, setLmp] = useState('');
//   const [edd, setEdd] = useState('');
//   const [doctorObservationSettings, setDoctorObservationSettings] = useState(null);
//   const [doctorAyurvedicObservationSettings, setDoctorAyurvedicObservationSettings] = useState(null);
//   const [showAllergyFields, setShowAllergyFields] = useState(false);
//   const [showHabits, setShowHabits] = useState(false);
//   const [habits, setHabits] = useState({
//     alcohol: '', cold_drink: '', fast_food: '', salty_food: '', tobbacco: '',
//     chocolate: '', drug_addict: '', late_night_sleep: '', smoking: '', coffee: '',
//     eating_habits: '', pan_masala: '', tea: ''
//   });
//   const [showPersonalHistory, setShowPersonalHistory] = useState(false);
//   const [showAshtvidh, setShowAshtvidh] = useState(false);
//   const [ashtvidhData, setAshtvidhData] = useState({
//     nadi: [], jihva: [], mala: [], mutra: [], netra: [], aakruti: [], shabda: [], sparsha: [],
//   });

//   const investigationOptions = [
//     "Complete Haemogram", "CBC", "Hb", "WBC", "Platelet count", "Rh Type", "BT CT", "Mantour Test",
//     "D Dimer", "ESR", "UPT", "Urine Routine", "PAP smear", "Sputum", "LFT", "KFT", "Urea", "Uric Acid",
//     "Creatinine", "Total Cholesterol", "SGPT", "SGOT", "Blood Cuture", "Urine Culture", "Stool Culture",
//     "HIV", "T3", "T4", "TSH", "Blood Glucose", "BSL Random", "BSL Fasting & PP", "HBA1C", "LH", "FSH",
//     "Progesterone", "Estrogen", "Testosterone", "HSG", "HCG", "CRP", "HBSAG", "VDRL", "ASO", "RA",
//     "ECG", "Urine Sugar", "Cancer Marker Test", "Blood Sugar"
//   ].map(item => ({ label: item, value: item }));

//   useEffect(() => {
//     if (!userData?.user?.id) return;

//     const fetchObservationSettings = async () => {
//       try {
//         const doctorId = userData.user.id;
//         const res = await getAPICall(`/api/doctor-medical-observations/${doctorId}`);
//         const normalizedMedical = Object.fromEntries(
//           Object.entries(res.medical_observations || {}).map(([key, val]) => [key, Boolean(Number(val))])
//         );
//         const normalizedAyurvedic = Object.fromEntries(
//           Object.entries(res.ayurvedic_observations || {}).map(([key, val]) => [key, Boolean(Number(val))])
//         );
//         setDoctorObservationSettings(normalizedMedical);
//         setDoctorAyurvedicObservationSettings(normalizedAyurvedic);
//       } catch (error) {
//         console.error("Error fetching observation settings:", error);
//       }
//     };

//     fetchObservationSettings();
//   }, [userData?.user?.id]);

//   const toggleMedicalForm = () => setIsMedicalExpanded(!isMedicalExpanded);
//   const toggleAyurvedicForm = () => setIsAyurvedicExpanded(!isAyurvedicExpanded);
//   const toggleFields = () => setShowAllergyFields(!showAllergyFields);

//   const handleHabitChange = (habitKey, value) => {
//     setHabits((prevHabits) => {
//       const currentValues = prevHabits[habitKey] ? prevHabits[habitKey].split(',').map(v => v.trim()) : [];
//       const updatedValues = currentValues.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value];
//       return { ...prevHabits, [habitKey]: updatedValues.join(', ') };
//     });
//   };

//   const handleAshtvidhChange = (key, value) => {
//     setAshtvidhData((prev) => {
//       const currentValues = prev[key] || [];
//       const updatedValues = currentValues.includes(value) ? currentValues.filter(item => item !== value) : [...currentValues, value];
//       return { ...prev, [key]: updatedValues };
//     });
//   };

//   return (
//     <CCard className="mb-2 mt-2 p-3 rounded-4 border border-gray-200" style={{ backgroundColor: '#F0F8FF' }}>
//       <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-start gap-1 gap-md-3 mb-2">
//         <div className="d-flex align-items-center gap-2">
//           <div className="d-flex align-items-center justify-content-center bg-white border border-primary" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
//             <CIcon icon={cilFile} size="lg" className="text-primary" />
//           </div>
//           <h6 className="mb-0 fw-semibold">Medical Observations</h6>
//         </div>
//         <div className="d-flex flex-column flex-sm-column flex-md-row gap-2 mt-2 mt-md-0">
//           <CButton
//             color="light"
//             className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-4"
//             onClick={toggleMedicalForm}
//             style={{ border: '2px solid #1B9C8F', backgroundColor: 'white', transition: 'background-color 0.3s' }}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D5ECE9')}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
//           >
//             <span style={{ color: '#1B9C8F' }}>
//               🩺 {isMedicalExpanded ? 'Close' : 'Add Medical Observation'}
//             </span>
//           </CButton>
//           <CButton
//             color="light"
//             className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-4"
//             onClick={toggleAyurvedicForm}
//             style={{ border: '2px solid #8B3E2F', backgroundColor: 'white', transition: 'background-color 0.3s' }}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EED7D3')}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
//           >
//             <span style={{ color: '#8B3E2F' }}>
//               🌿 {isAyurvedicExpanded ? 'Close' : 'Add Ayurvedic Observation'}
//             </span>
//           </CButton>
//         </div>
//       </div>

//       {isMedicalExpanded && doctorObservationSettings && (
//         <div className="p-2">
//           <CRow className="mb-2">
//             {doctorObservationSettings.bp && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">BP</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   placeholder="e.g. 120/80"
//                   value={bp || '/'}
//                   onChange={(e) => setBp(e.target.value)}
//                   onKeyDown={(e) => {
//                     const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', '/', 'Delete'];
//                     if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                 />
//               </CCol>
//             )}
//             {doctorObservationSettings.weight && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Weight (Kg)</CFormLabel>
//                 <CFormInput
//                   value={weight}
//                   type="number"
//                   onChange={(e) => setWeight(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === "E") {
//                       e.preventDefault();
//                     }
//                   }}
//                   min="0"
//                 />
//               </CCol>
//             )}
//             {doctorObservationSettings.height && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Height (CM)</CFormLabel>
//                 <CFormInput
//                   value={height}
//                   type="number"
//                   onChange={(e) => setHeight(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === "E") {
//                       e.preventDefault();
//                     }
//                   }}
//                   min="0"
//                 />
//               </CCol>
//             )}
//             {doctorObservationSettings.pulse && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Pulse</CFormLabel>
//                 <CFormInput value={pulse} onChange={(e) => setPulse(e.target.value)} />
//               </CCol>
//             )}
//           </CRow>
//           <CRow className="mb-2">
//             {doctorObservationSettings.past_history && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Known History</CFormLabel>
//                 <CFormInput value={pastHistory} onChange={(e) => setPastHistory(e.target.value)} />
//               </CCol>
//             )}
//             {doctorObservationSettings.complaint && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Complaints</CFormLabel>
//                 <CFormInput value={complaints} onChange={(e) => setComplaints(e.target.value)} />
//               </CCol>
//             )}
//           </CRow>
//           <CRow className="mb-2">
//             {doctorObservationSettings.systemic_examination && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Systemic Examination</CFormLabel>
//                 <CFormInput value={sysExGeneral} onChange={(e) => setSysExGeneral(e.target.value)} />
//               </CCol>
//             )}
//             {doctorObservationSettings.diagnosis && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Diagnosis</CFormLabel>
//                 <CFormInput value={sysExPA} onChange={(e) => setSysExPA(e.target.value)} />
//               </CCol>
//             )}
//           </CRow>
//         </div>
//       )}

//       {isAyurvedicExpanded && doctorAyurvedicObservationSettings && (
//         <div className="p-2">
//           <CRow className="mb-2">
//             {doctorAyurvedicObservationSettings.past_history && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Past History</CFormLabel>
//                 <CFormInput value={ayurPastHistory} onChange={(e) => setAyurPastHistory(e.target.value)} />
//               </CCol>
//             )}
//             {doctorAyurvedicObservationSettings.lab_investigation && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Investigation</CFormLabel>
//                 <Select
//                   options={investigationOptions}
//                   isSearchable
//                   value={investigationOptions.find(opt => opt.value === labInvestigation) || null}
//                   onChange={(selectedOption) => setLabInvestigation(selectedOption?.value || "")}
//                   placeholder="Select or search investigation..."
//                 />
//               </CCol>
//             )}
//           </CRow>
//           <CRow className="mb-2">
//             {doctorAyurvedicObservationSettings.lmp && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">LMP</CFormLabel>
//                 <CFormInput type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} />
//               </CCol>
//             )}
//             {doctorAyurvedicObservationSettings.edd && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">EDD</CFormLabel>
//                 <CFormInput type="date" value={edd} onChange={(e) => setEdd(e.target.value)} />
//               </CCol>
//             )}
//           </CRow>
//           {(doctorAyurvedicObservationSettings.food_and_drug_allergy || doctorAyurvedicObservationSettings.habits) && (
//             <CRow className="align-items-center mb-2 mt-3">
//               {doctorAyurvedicObservationSettings.food_and_drug_allergy && (
//                 <CCol xs={12} md={6} className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="fw-bold mb-0">Allergy</h6>
//                   <CButton
//                     size="sm"
//                     onClick={toggleFields}
//                     className="btn btn-sm btn-outline-primary"
//                   >
//                     {showAllergyFields ? '-' : '+'}
//                   </CButton>
//                 </CCol>
//               )}
//               {doctorAyurvedicObservationSettings.habits && (
//                 <CCol xs={12} md={6} className="d-flex justify-content-between align-items-center">
//                   <h6 className="fw-bold mb-0">Habits</h6>
//                   <CButton
//                     size="sm"
//                     onClick={() => setShowHabits(!showHabits)}
//                     className="btn btn-sm btn-outline-primary"
//                   >
//                     {showHabits ? '-' : '+'}
//                   </CButton>
//                 </CCol>
//               )}
//             </CRow>
//           )}
//           {showAllergyFields && (
//             <CRow>
//               <CCol xs={12}>
//                 <div className="d-flex flex-column gap-2">
//                   <CFormInput
//                     placeholder="Food Allergy"
//                     value={foodAndDrugAllergy}
//                     onChange={(e) => setFoodAndDrugAllergy(e.target.value)}
//                   />
//                   <CFormInput
//                     placeholder="Drug Allergy"
//                     value={drugAllergy}
//                     onChange={(e) => setDrugAllergy(e.target.value)}
//                   />
//                 </div>
//               </CCol>
//             </CRow>
//           )}
//           {showHabits && (
//             <CRow className="mb-3">
//               <CCol xs={12} md={4}>
//                 {["Alcohol", "Cold Drink", "Fast Food", "Salty Food"].map((habit) => (
//                   <CCol xs={12} className="mb-3" key={habit}>
//                     <CFormLabel className="fw-bold">{habit}</CFormLabel>
//                     <div className="d-flex flex-wrap gap-3 mt-1">
//                       {(habit === "Fast Food" ? ["Sometimes", "Twice In week", "Once In Week"] : ["Normal", "Moderate", "Heavy"]).map((option) => (
//                         <CFormCheck
//                           key={option}
//                           type="checkbox"
//                           label={option}
//                           checked={habits[habit.toLowerCase().replace(' ', '_')] === option}
//                           onChange={() => handleHabitChange(habit.toLowerCase().replace(' ', '_'), option)}
//                         />
//                       ))}
//                     </div>
//                   </CCol>
//                 ))}
//               </CCol>
//               <CCol xs={12} md={4}>
//                 {["Chocolate", "Drug Addict", "Late Night Sleep", "Smoking"].map((habit) => (
//                   <CCol xs={12} className="mb-3" key={habit}>
//                     <CFormLabel className="fw-bold">{habit}</CFormLabel>
//                     <div className="d-flex flex-wrap gap-3 mt-1">
//                       {(habit === "Late Night Sleep" ? ["Sometimes", "Not Regular", "Regular"] : ["Normal", "Moderate", "Heavy"]).map((option) => (
//                         <CFormCheck
//                           key={option}
//                           type="checkbox"
//                           label={option}
//                           checked={habits[habit.toLowerCase().replace(' ', '_')] === option}
//                           onChange={() => handleHabitChange(habit.toLowerCase().replace(' ', '_'), option)}
//                         />
//                       ))}
//                     </div>
//                   </CCol>
//                 ))}
//               </CCol>
//               <CCol xs={12} md={4}>
//                 {["Tobbacco", "Coffee", "Eating Habits", "Pan Masala", "Tea"].map((habit) => (
//                   <CCol xs={12} className="mb-3" key={habit}>
//                     <CFormLabel className="fw-bold">{habit}</CFormLabel>
//                     <div className="d-flex flex-wrap gap-3 mt-1">
//                       {["Normal", "Moderate", "Heavy"].map((option) => (
//                         <CFormCheck
//                           key={option}
//                           type="checkbox"
//                           label={option}
//                           checked={habits[habit.toLowerCase().replace(' ', '_')] === option}
//                           onChange={() => handleHabitChange(habit.toLowerCase().replace(' ', '_'), option)}
//                         />
//                       ))}
//                     </div>
//                   </CCol>
//                 ))}
//               </CCol>
//             </CRow>
//           )}
//           {(doctorAyurvedicObservationSettings.personal_history || doctorAyurvedicObservationSettings.prasavvedan_parikshayein) && (
//             <CRow className="align-items-center mb-2 mt-3">
//               {doctorAyurvedicObservationSettings.personal_history && (
//                 <CCol xs={12} md={6} className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="fw-bold mb-0">Personal History</h6>
//                   <CButton
//                     size="sm"
//                     onClick={() => setShowPersonalHistory(!showPersonalHistory)}
//                     className="btn btn-sm btn-outline-primary"
//                   >
//                     {showPersonalHistory ? '-' : '+'}
//                   </CButton>
//                 </CCol>
//               )}
//               {doctorAyurvedicObservationSettings.prasavvedan_parikshayein && (
//                 <CCol xs={12} md={6} className="d-flex justify-content-between align-items-center">
//                   <h6 className="fw-bold mb-0">Ashtvidh Parikshayein</h6>
//                   <CButton
//                     size="sm"
//                     onClick={() => setShowAshtvidh(!showAshtvidh)}
//                     className="btn btn-sm btn-outline-primary"
//                   >
//                     {showAshtvidh ? '-' : '+'}
//                   </CButton>
//                 </CCol>
//               )}
//             </CRow>
//           )}
//           {showPersonalHistory && (
//             <CRow>
//               {["Diet", "Appetite", "Sleep", "Thirst", "Bowel", "Micturition"].map((field) => (
//                 <CCol xs={12} sm={6} className="mb-3" key={field}>
//                   <CFormLabel className="fw-bold">{field}</CFormLabel>
//                   <div className="d-flex flex-wrap gap-3 mt-1">
//                     {(field === "Diet" ? ["Vegetarian", "Non-Vegetarian", "Mixed"] :
//                       field === "Appetite" ? ["Good", "Normal", "Poor"] :
//                       field === "Sleep" ? ["Sound", "Interrupted", "Insomnia"] :
//                       field === "Thirst" ? ["Normal", "Medium", "Heavy", "Poor"] :
//                       field === "Bowel" ? ["Regular", "Irregular", "Constipated"] :
//                       ["Normal", "Poor", "Painful", "Burning", "Frequent"]).map((option) => (
//                         <CFormCheck
//                           key={option}
//                           type="checkbox"
//                           label={option}
//                           checked={ashtvidhData[field.toLowerCase()]?.includes(option)}
//                           onChange={() => handleAshtvidhChange(field.toLowerCase(), option)}
//                         />
//                       ))}
//                   </div>
//                 </CCol>
//               ))}
//             </CRow>
//           )}
//           {showAshtvidh && (
//             <CRow>
//               {[
//                 { label: "नाड़ी", key: "nadi", options: ["साम", "निराम", "क्षीण", "द्रूत", "गुरु", "वात", "पित", "कफ", "वातपित", "पितकफ", "कफवात", "त्रिदोष", "सर्पवत्", "मन्चुकवत्", "हंसवत्"] },
//                 { label: "जिव्हा", key: "jihva", options: ["साम", "निराम", "दारुण", "पिच्छिल", "स्फुटित", "श्याम", "निलवर्ण", "शुष्क", "वर्ण", "मुरवपाक", "सम्यक्", "निल", "श्वेत", "रक्तवर्ण"] },
//                 { label: "मल", key: "mala", options: ["सविबन्ध", "मुह मुह", "द्रव", "बध्ध्", "सरकत", "भोजनोतर", "सपूय", "पिच्छिल", "सम्यक्", "वेदनायुक्त", "Daily", "Alternate day", "शुष्क", "पिताभवर्ण", "श्वेतवर्ण"] },
//                 { label: "मूत्र", key: "mutra", options: ["सदाह", "अल्पमुत्रता", "बहुमुत्रता", "सशुल", "रात्रिकालिनबहुमुत्रता", "शैयामूत्रता", "मेयुकत", "अवरोधित", "अनियत्रित", "दीर्घकालीन स तैलसम", "श्वेत वर्ण"] },
//                 { label: "नेत्र", key: "netra", options: ["कंड", "पिच्छिल", "मलिन पित्", "निल", "स्ताव", "श्पाव", "शुष्क", "प्रकाश अराहत्व", "सशुल", "दाद् श्रीण", "नेत्रविकार", "सम्यक्", "संकुचित", "विस्फारित", "क्षेत", "अरुण", "पित"] },
//                 { label: "आकृति", key: "aakruti", options: ["कृश", "स्थूल", "मध्यम"] },
//                 { label: "शब्द", key: "shabda", options: ["गम्भीर", "खिग्ध", "गदगद", "रुक्ष", "मिमिन"] },
//                 { label: "स्पर्श", key: "sparsha", options: ["सिाध", "शीत", "अनष्णाशीत", "रुक्ष", "उषा", "प्रशष्"] }
//               ].map(({ label, key, options }) => (
//                 <CCol xs={12} className="mb-3" key={key}>
//                   <CFormLabel className="fw-bold">{label}</CFormLabel>
//                   <div className="d-flex flex-wrap gap-3 mt-1">
//                     {options.map((option) => (
//                       <CFormCheck
//                         key={option}
//                         type="checkbox"
//                         label={option}
//                         checked={ashtvidhData[key].includes(option)}
//                         onChange={() => handleAshtvidhChange(key, option)}
//                       />
//                     ))}
//                   </div>
//                 </CCol>
//               ))}
//             </CRow>
//           )}
//         </div>
//       )}
//     </CCard>
//   );
// };

// export default MedicalObservations;




// import React, { useState, useEffect } from 'react';
// import {
//   CCard, CRow, CCol, CFormLabel, CFormInput, CButton, CFormCheck, CFormSelect
// } from '@coreui/react';
// import Select from 'react-select';
// import { getAPICall } from '../../../util/api';
// import { cilFile } from '@coreui/icons';
// import CIcon from '@coreui/icons-react';

// const MedicalObservations = ({
//   userData,
//   bp, setBp,
//   pulse, setPulse,
//   pastHistory, setPastHistory,
//   complaints, setComplaints,
//   sysExGeneral, setSysExGeneral,
//   sysExPA, setSysExPA,
//   weight, setWeight,
//   height, setHeight,
//   emaill, setEmaill,
//   ayurPastHistory, setAyurPastHistory,
//   prasavvedanParikshayein, setPrasavvedanParikshayein,
//   habits, setHabits,
//   labInvestigation, setLabInvestigation,
//   personalHistory, setPersonalHistory,
//   foodAndDrugAllergy, setFoodAndDrugAllergy,
//   drugAllergy, setDrugAllergy,
//   lmp, setLmp,
//   edd, setEdd,
//   ashtvidhData, setAshtvidhData
// }) => {
//   const [isMedicalExpanded, setIsMedicalExpanded] = useState(false);
//   const [isAyurvedicExpanded, setIsAyurvedicExpanded] = useState(false);
//   const [doctorObservationSettings, setDoctorObservationSettings] = useState(null);
//   const [doctorAyurvedicObservationSettings, setDoctorAyurvedicObservationSettings] = useState(null);
//   const [showAllergyFields, setShowAllergyFields] = useState(false);
//   const [showHabits, setShowHabits] = useState(false);
//   const [showPersonalHistory, setShowPersonalHistory] = useState(false);
//   const [showAshtvidh, setShowAshtvidh] = useState(false);

//   const investigationOptions = [
//     "Complete Haemogram", "CBC", "Hb", "WBC", "Platelet count", "Rh Type", "BT CT", "Mantour Test",
//     "D Dimer", "ESR", "UPT", "Urine Routine", "PAP smear", "Sputum", "LFT", "KFT", "Urea", "Uric Acid",
//     "Creatinine", "Total Cholesterol", "SGPT", "SGOT", "Blood Cuture", "Urine Culture", "Stool Culture",
//     "HIV", "T3", "T4", "TSH", "Blood Glucose", "BSL Random", "BSL Fasting & PP", "HBA1C", "LH", "FSH",
//     "Progesterone", "Estrogen", "Testosterone", "HSG", "HCG", "CRP", "HBSAG", "VDRL", "ASO", "RA",
//     "ECG", "Urine Sugar", "Cancer Marker Test", "Blood Sugar"
//   ].map(item => ({ label: item, value: item }));

//   useEffect(() => {
//     if (!userData?.user?.id) return;

//     const fetchObservationSettings = async () => {
//       try {
//         const doctorId = userData.user.id;
//         const res = await getAPICall(`/api/doctor-medical-observations/${doctorId}`);
//         const normalizedMedical = Object.fromEntries(
//           Object.entries(res.medical_observations || {}).map(([key, val]) => [key, Boolean(Number(val))])
//         );
//         const normalizedAyurvedic = Object.fromEntries(
//           Object.entries(res.ayurvedic_observations || {}).map(([key, val]) => [key, Boolean(Number(val))])
//         );
//         setDoctorObservationSettings(normalizedMedical);
//         setDoctorAyurvedicObservationSettings(normalizedAyurvedic);
//       } catch (error) {
//         console.error("Error fetching observation settings:", error);
//       }
//     };

//     fetchObservationSettings();
//   }, [userData?.user?.id]);

//   const toggleMedicalForm = () => setIsMedicalExpanded(!isMedicalExpanded);
//   const toggleAyurvedicForm = () => setIsAyurvedicExpanded(!isAyurvedicExpanded);
//   const toggleFields = () => setShowAllergyFields(!showAllergyFields);

//   const handleHabitChange = (habitKey, value) => {
//     setHabits((prevHabits) => {
//       const currentValues = prevHabits[habitKey] ? prevHabits[habitKey].split(',').map(v => v.trim()) : [];
//       const updatedValues = currentValues.includes(value)
//         ? currentValues.filter(v => v !== value)
//         : [...currentValues, value];
//       return { ...prevHabits, [habitKey]: updatedValues.join(', ') };
//     });
//   };

//   const handlePersonalHistoryChange = (key, value) => {
//     setPersonalHistory((prev) => {
//       const currentValues = prev[key] ? prev[key].split(',').map(v => v.trim()) : [];
//       const updatedValues = currentValues.includes(value)
//         ? currentValues.filter(v => v !== value)
//         : [...currentValues, value];
//       return { ...prev, [key]: updatedValues.join(', ') };
//     });
//   };

//   const handleAshtvidhChange = (key, value) => {
//     setAshtvidhData((prev) => {
//       const currentValues = prev[key] || [];
//       const updatedValues = currentValues.includes(value)
//         ? currentValues.filter(item => item !== value)
//         : [...currentValues, value];
//       return { ...prev, [key]: updatedValues };
//     });
//   };

//   return (
//     <CCard className="mb-2 mt-2 p-3 rounded-4 border border-gray-200" style={{ backgroundColor: '#F0F8FF' }}>
//       <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-start gap-1 gap-md-3 mb-2">
//         <div className="d-flex align-items-center gap-2">
//           <div className="d-flex align-items-center justify-content-center bg-white border border-primary" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
//             <CIcon icon={cilFile} size="lg" className="text-primary" />
//           </div>
//           <h6 className="mb-0 fw-semibold">Medical Observations</h6>
//         </div>
//         <div className="d-flex flex-column flex-sm-column flex-md-row gap-2 mt-2 mt-md-0">
//           <CButton
//             color="light"
//             className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-4"
//             onClick={toggleMedicalForm}
//             style={{ border: '2px solid #1B9C8F', backgroundColor: 'white', transition: 'background-color 0.3s' }}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D5ECE9')}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
//           >
//             <span style={{ color: '#1B9C8F' }}>
//               🩺 {isMedicalExpanded ? 'Close' : 'Add Medical Observation'}
//             </span>
//           </CButton>
//           <CButton
//             color="light"
//             className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-4"
//             onClick={toggleAyurvedicForm}
//             style={{ border: '2px solid #8B3E2F', backgroundColor: 'white', transition: 'background-color 0.3s' }}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EED7D3')}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
//           >
//             <span style={{ color: '#8B3E2F' }}>
//               🌿 {isAyurvedicExpanded ? 'Close' : 'Add Ayurvedic Observation'}
//             </span>
//           </CButton>
//         </div>
//       </div>

//       {isMedicalExpanded && doctorObservationSettings && (
//         <div className="p-2">
//           <CRow className="mb-2">
//             {doctorObservationSettings.bp && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">BP</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   placeholder="e.g. 120/80"
//                   value={bp || '/'}
//                   onChange={(e) => setBp(e.target.value)}
//                   onKeyDown={(e) => {
//                     const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', '/', 'Delete'];
//                     if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                 />
//               </CCol>
//             )}
//             {doctorObservationSettings.weight && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Weight (Kg)</CFormLabel>
//                 <CFormInput
//                   value={weight}
//                   type="number"
//                   onChange={(e) => setWeight(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === "E") {
//                       e.preventDefault();
//                     }
//                   }}
//                   min="0"
//                 />
//               </CCol>
//             )}
//             {doctorObservationSettings.height && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Height (CM)</CFormLabel>
//                 <CFormInput
//                   value={height}
//                   type="number"
//                   onChange={(e) => setHeight(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === "E") {
//                       e.preventDefault();
//                     }
//                   }}
//                   min="0"
//                 />
//               </CCol>
//             )}
//             {doctorObservationSettings.pulse && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Pulse</CFormLabel>
//                 <CFormInput value={pulse} onChange={(e) => setPulse(e.target.value)} />
//               </CCol>
//             )}
//           </CRow>
//           <CRow className="mb-2">
//             {doctorObservationSettings.past_history && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Known History</CFormLabel>
//                 <CFormInput value={pastHistory} onChange={(e) => setPastHistory(e.target.value)} />
//               </CCol>
//             )}
//             {doctorObservationSettings.complaint && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Complaints</CFormLabel>
//                 <CFormInput value={complaints} onChange={(e) => setComplaints(e.target.value)} />
//               </CCol>
//             )}
//           </CRow>
//           <CRow className="mb-2">
//             {doctorObservationSettings.systemic_examination && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Systemic Examination</CFormLabel>
//                 <CFormInput value={sysExGeneral} onChange={(e) => setSysExGeneral(e.target.value)} />
//               </CCol>
//             )}
//             {doctorObservationSettings.diagnosis && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Diagnosis</CFormLabel>
//                 <CFormInput value={sysExPA} onChange={(e) => setSysExPA(e.target.value)} />
//               </CCol>
//             )}
//           </CRow>
//         </div>
//       )}

//       {isAyurvedicExpanded && doctorAyurvedicObservationSettings && (
//         <div className="p-2">
//           <CRow className="mb-2">
//             {doctorAyurvedicObservationSettings.past_history && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Past History</CFormLabel>
//                 <CFormInput
//                   value={ayurPastHistory}
//                   onChange={(e) => setAyurPastHistory(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
//                 />
//               </CCol>
//             )}
//             {doctorAyurvedicObservationSettings.lab_investigation && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">Investigation</CFormLabel>
//                 <Select
//                   options={investigationOptions}
//                   isSearchable
//                   value={investigationOptions.find(opt => opt.value === labInvestigation) || null}
//                   onChange={(selectedOption) => setLabInvestigation(selectedOption?.value || "")}
//                   placeholder="Select or search investigation..."
//                 />
//               </CCol>
//             )}
//           </CRow>
//           <CRow className="mb-2">
//             {doctorAyurvedicObservationSettings.lmp && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">LMP</CFormLabel>
//                 <CFormInput type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} />
//               </CCol>
//             )}
//             {doctorAyurvedicObservationSettings.edd && (
//               <CCol xs={12} sm={6}>
//                 <CFormLabel className="fw-bold">EDD</CFormLabel>
//                 <CFormInput type="date" value={edd} onChange={(e) => setEdd(e.target.value)} />
//               </CCol>
//             )}
//           </CRow>
//           {(doctorAyurvedicObservationSettings.food_and_drug_allergy || doctorAyurvedicObservationSettings.habits) && (
//             <CRow className="align-items-center mb-2 mt-3">
//               {doctorAyurvedicObservationSettings.food_and_drug_allergy && (
//                 <CCol xs={12} md={6} className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="fw-bold mb-0">Allergy</h6>
//                   <CButton
//                     size="sm"
//                     onClick={toggleFields}
//                     className="btn btn-sm btn-outline-primary"
//                   >
//                     {showAllergyFields ? '-' : '+'}
//                   </CButton>
//                 </CCol>
//               )}
//               {doctorAyurvedicObservationSettings.habits && (
//                 <CCol xs={12} md={6} className="d-flex justify-content-between align-items-center">
//                   <h6 className="fw-bold mb-0">Habits</h6>
//                   <CButton
//                     size="sm"
//                     onClick={() => setShowHabits(!showHabits)}
//                     className="btn btn-sm btn-outline-primary"
//                   >
//                     {showHabits ? '-' : '+'}
//                   </CButton>
//                 </CCol>
//               )}
//             </CRow>
//           )}
//           {showAllergyFields && (
//             <CRow>
//               <CCol xs={12}>
//                 <div className="d-flex flex-column gap-2">
//                   <CFormInput
//                     placeholder="Food Allergy"
//                     value={foodAndDrugAllergy}
//                     onChange={(e) => setFoodAndDrugAllergy(e.target.value)}
//                   />
//                   <CFormInput
//                     placeholder="Drug Allergy"
//                     value={drugAllergy}
//                     onChange={(e) => setDrugAllergy(e.target.value)}
//                   />
//                 </div>
//               </CCol>
//             </CRow>
//           )}
//           {showHabits && (
//             <CRow className="mb-3">
//               <CCol xs={12} md={4}>
//                 {["Alcohol", "Cold Drink", "Fast Food", "Salty Food"].map((habit) => (
//                   <CCol xs={12} className="mb-3" key={habit}>
//                     <CFormLabel className="fw-bold">{habit}</CFormLabel>
//                     <div className="d-flex flex-wrap gap-3 mt-1">
//                       {(habit === "Fast Food" ? ["Sometimes", "Twice In week", "Once In Week"] : ["Normal", "Moderate", "Heavy"]).map((option) => (
//                         <CFormCheck
//                           key={option}
//                           type="checkbox"
//                           label={option}
//                           checked={habits[habit.toLowerCase().replace(' ', '_')]?.includes(option)}
//                           onChange={() => handleHabitChange(habit.toLowerCase().replace(' ', '_'), option)}
//                         />
//                       ))}
//                     </div>
//                   </CCol>
//                 ))}
//               </CCol>
//               <CCol xs={12} md={4}>
//                 {["Chocolate", "Drug Addict", "Late Night Sleep", "Smoking"].map((habit) => (
//                   <CCol xs={12} className="mb-3" key={habit}>
//                     <CFormLabel className="fw-bold">{habit}</CFormLabel>
//                     <div className="d-flex flex-wrap gap-3 mt-1">
//                       {(habit === "Late Night Sleep" ? ["Sometimes", "Not Regular", "Regular"] : ["Normal", "Moderate", "Heavy"]).map((option) => (
//                         <CFormCheck
//                           key={option}
//                           type="checkbox"
//                           label={option}
//                           checked={habits[habit.toLowerCase().replace(' ', '_')]?.includes(option)}
//                           onChange={() => handleHabitChange(habit.toLowerCase().replace(' ', '_'), option)}
//                         />
//                       ))}
//                     </div>
//                   </CCol>
//                 ))}
//               </CCol>
//               <CCol xs={12} md={4}>
//                 {["Tobbacco", "Coffee", "Eating Habits", "Pan Masala", "Tea"].map((habit) => (
//                   <CCol xs={12} className="mb-3" key={habit}>
//                     <CFormLabel className="fw-bold">{habit}</CFormLabel>
//                     <div className="d-flex flex-wrap gap-3 mt-1">
//                       {["Normal", "Moderate", "Heavy"].map((option) => (
//                         <CFormCheck
//                           key={option}
//                           type="checkbox"
//                           label={option}
//                           checked={habits[habit.toLowerCase().replace(' ', '_')]?.includes(option)}
//                           onChange={() => handleHabitChange(habit.toLowerCase().replace(' ', '_'), option)}
//                         />
//                       ))}
//                     </div>
//                   </CCol>
//                 ))}
//               </CCol>
//             </CRow>
//           )}
//           {(doctorAyurvedicObservationSettings.personal_history || doctorAyurvedicObservationSettings.prasavvedan_parikshayein) && (
//             <CRow className="align-items-center mb-2 mt-3">
//               {doctorAyurvedicObservationSettings.personal_history && (
//                 <CCol xs={12} md={6} className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="fw-bold mb-0">Personal History</h6>
//                   <CButton
//                     size="sm"
//                     onClick={() => setShowPersonalHistory(!showPersonalHistory)}
//                     className="btn btn-sm btn-outline-primary"
//                   >
//                     {showPersonalHistory ? '-' : '+'}
//                   </CButton>
//                 </CCol>
//               )}
//               {doctorAyurvedicObservationSettings.prasavvedan_parikshayein && (
//                 <CCol xs={12} md={6} className="d-flex justify-content-between align-items-center">
//                   <h6 className="fw-bold mb-0">Ashtvidh Parikshayein</h6>
//                   <CButton
//                     size="sm"
//                     onClick={() => setShowAshtvidh(!showAshtvidh)}
//                     className="btn btn-sm btn-outline-primary"
//                   >
//                     {showAshtvidh ? '-' : '+'}
//                   </CButton>
//                 </CCol>
//               )}
//             </CRow>
//           )}
//           {showPersonalHistory && (
//             <CRow>
//               {["Diet", "Appetite", "Sleep", "Thirst", "Bowel", "Micturition"].map((field) => (
//                 <CCol xs={12} sm={6} className="mb-3" key={field}>
//                   <CFormLabel className="fw-bold">{field}</CFormLabel>
//                   <div className="d-flex flex-wrap gap-3 mt-1">
//                     {(field === "Diet" ? ["Vegetarian", "Non-Vegetarian", "Mixed"] :
//                       field === "Appetite" ? ["Good", "Normal", "Poor"] :
//                       field === "Sleep" ? ["Sound", "Interrupted", "Insomnia"] :
//                       field === "Thirst" ? ["Normal", "Medium", "Heavy", "Poor"] :
//                       field === "Bowel" ? ["Regular", "Irregular", "Constipated"] :
//                       ["Normal", "Poor", "Painful", "Burning", "Frequent"]).map((option) => (
//                         <CFormCheck
//                           key={option}
//                           type="checkbox"
//                           label={option}
//                           checked={personalHistory[field.toLowerCase()]?.includes(option)}
//                           onChange={() => handlePersonalHistoryChange(field.toLowerCase(), option)}
//                         />
//                       ))}
//                   </div>
//                 </CCol>
//               ))}
//             </CRow>
//           )}
//           {showAshtvidh && (
//             <CRow>
//               {[
//                 { label: "नाड़ी", key: "nadi", options: ["साम", "निराम", "क्षीण", "द्रूत", "गुरु", "वात", "पित", "कफ", "वातपित", "पितकफ", "कफवात", "त्रिदोष", "सर्पवत्", "मन्चुकवत्", "हंसवत्"] },
//                 { label: "जिव्हा", key: "jihva", options: ["साम", "निराम", "दारुण", "पिच्छिल", "स्फुटित", "श्याम", "निलवर्ण", "शुष्क", "वर्ण", "मुरवपाक", "सम्यक्", "निल", "श्वेत", "रक्तवर्ण"] },
//                 { label: "मल", key: "mala", options: ["सविबन्ध", "मुह मुह", "द्रव", "बध्ध्", "सरकत", "भोजनोतर", "सपूय", "पिच्छिल", "सम्यक्", "वेदनायुक्त", "Daily", "Alternate day", "शुष्क", "पिताभवर्ण", "श्वेतवर्ण"] },
//                 { label: "मूत्र", key: "mutra", options: ["सदाह", "अल्पमुत्रता", "बहुमुत्रता", "सशुल", "रात्रिकालिनबहुमुत्रता", "शैयामूत्रता", "मेयुकत", "अवरोधित", "अनियत्रित", "दीर्घकालीन स तैलसम", "श्वेत वर्ण"] },
//                 { label: "नेत्र", key: "netra", options: ["कंड", "पिच्छिल", "मलिन पित्", "निल", "स्ताव", "श्पाव", "शुष्क", "प्रकाश अराहत्व", "सशुल", "दाद् श्रीण", "नेत्रविकार", "सम्यक्", "संकुचित", "विस्फारित", "क्षेत", "अरुण", "पित"] },
//                 { label: "आकृति", key: "aakruti", options: ["कृश", "स्थूल", "मध्यम"] },
//                 { label: "शब्द", key: "shabda", options: ["गम्भीर", "खिग्ध", "गदगद", "रुक्ष", "मिमिन"] },
//                 { label: "स्पर्श", key: "sparsha", options: ["सिाध", "शीत", "अनष्णाशीत", "रुक्ष", "उषा", "प्रशष्"] }
//               ].map(({ label, key, options }) => (
//                 <CCol xs={12} className="mb-3" key={key}>
//                   <CFormLabel className="fw-bold">{label}</CFormLabel>
//                   <div className="d-flex flex-wrap gap-3 mt-1">
//                     {options.map((option) => (
//                       <CFormCheck
//                         key={option}
//                         type="checkbox"
//                         label={option}
//                         checked={ashtvidhData[key].includes(option)}
//                         onChange={() => handleAshtvidhChange(key, option)}
//                       />
//                     ))}
//                   </div>
//                 </CCol>
//               ))}
//             </CRow>
//           )}
//         </div>
//       )}
//     </CCard>
//   );
// };

// export default MedicalObservations;



















import React, { useState, useEffect } from 'react';
import {
  CCard, CRow, CCol, CFormLabel, CFormInput, CButton, CFormCheck, CFormSelect
} from '@coreui/react';
import Select from 'react-select';
import { getAPICall } from '../../../util/api';
import { cilFile } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const MedicalObservations = ({
  userData,
  bp, setBp,
  pulse, setPulse,
  pastHistory, setPastHistory,
  complaints, setComplaints,
  sysExGeneral, setSysExGeneral,
  sysExPA, setSysExPA,
  weight, setWeight,
  height, setHeight,
  emaill, setEmaill,
  ayurPastHistory, setAyurPastHistory,
  habits, setHabits,
  labInvestigation, setLabInvestigation,
  personalHistory, setPersonalHistory,
  foodAndDrugAllergy, setFoodAndDrugAllergy,
  drugAllergy, setDrugAllergy,
  lmp, setLmp,
  edd, setEdd,
  ashtvidhData, setAshtvidhData,
  isMedicalExpanded, setIsMedicalExpanded,
  isAyurvedicExpanded, setIsAyurvedicExpanded
}) => {
  const [doctorObservationSettings, setDoctorObservationSettings] = useState(null);
  const [doctorAyurvedicObservationSettings, setDoctorAyurvedicObservationSettings] = useState(null);
  const [showAllergyFields, setShowAllergyFields] = useState(false);
  const [showHabits, setShowHabits] = useState(false);
  const [showPersonalHistory, setShowPersonalHistory] = useState(false);
  const [showAshtvidh, setShowAshtvidh] = useState(false);

  const investigationOptions = [
    "Complete Haemogram", "CBC", "Hb", "WBC", "Platelet count", "Rh Type", "BT CT", "Mantour Test",
    "D Dimer", "ESR", "UPT", "Urine Routine", "PAP smear", "Sputum", "LFT", "KFT", "Urea", "Uric Acid",
    "Creatinine", "Total Cholesterol", "SGPT", "SGOT", "Blood Cuture", "Urine Culture", "Stool Culture",
    "HIV", "T3", "T4", "TSH", "Blood Glucose", "BSL Random", "BSL Fasting & PP", "HBA1C", "LH", "FSH",
    "Progesterone", "Estrogen", "Testosterone", "HSG", "HCG", "CRP", "HBSAG", "VDRL", "ASO", "RA",
    "ECG", "Urine Sugar", "Cancer Marker Test", "Blood Sugar"
  ].map(item => ({ label: item, value: item }));

  useEffect(() => {
    if (!userData?.user?.id) return;

    const fetchObservationSettings = async () => {
      try {
        const doctorId = userData.user.id;
        const res = await getAPICall(`/api/doctor-medical-observations/${doctorId}`);
        const normalizedMedical = Object.fromEntries(
          Object.entries(res.medical_observations || {}).map(([key, val]) => [key, Boolean(Number(val))])
        );
        const normalizedAyurvedic = Object.fromEntries(
          Object.entries(res.ayurvedic_observations || {}).map(([key, val]) => [key, Boolean(Number(val))])
        );
        setDoctorObservationSettings(normalizedMedical);
        setDoctorAyurvedicObservationSettings(normalizedAyurvedic);
      } catch (error) {
        console.error("Error fetching observation settings:", error);
      }
    };

    fetchObservationSettings();
  }, [userData?.user?.id]);

  const toggleMedicalForm = () => setIsMedicalExpanded(!isMedicalExpanded);
  const toggleAyurvedicForm = () => setIsAyurvedicExpanded(!isAyurvedicExpanded);
  const toggleFields = () => setShowAllergyFields(!showAllergyFields);

  const handleHabitChange = (habitKey, value) => {
    setHabits((prevHabits) => {
      const currentValues = prevHabits[habitKey] ? prevHabits[habitKey].split(',').map(v => v.trim()) : [];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prevHabits, [habitKey]: updatedValues.join(', ') };
    });
  };

  const handlePersonalHistoryChange = (key, value) => {
    setPersonalHistory((prev) => {
      const currentValues = prev[key] ? prev[key].split(',').map(v => v.trim()) : [];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [key]: updatedValues.join(', ') };
    });
  };

  const handleAshtvidhChange = (key, value) => {
    setAshtvidhData((prev) => {
      const currentValues = prev[key] || [];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [key]: updatedValues };
    });
  };

  // Check if any medical or ayurvedic observation field is enabled
  const hasMedicalFields = doctorObservationSettings && Object.values(doctorObservationSettings).some(val => val);
  const hasAyurvedicFields = doctorAyurvedicObservationSettings && Object.values(doctorAyurvedicObservationSettings).some(val => val);

  return (
    <CCard className="mb-2 mt-2 p-3 rounded-4 border border-gray-200" style={{ backgroundColor: '#F0F8FF' }}>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-start gap-1 gap-md-3 mb-2">
        <div className="d-flex align-items-center gap-2">
          <div className="d-flex align-items-center justify-content-center bg-white border border-primary" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
            <CIcon icon={cilFile} size="lg" className="text-primary" />
          </div>
          <h6 className="mb-0 fw-semibold">Medical Observations</h6>
        </div>
        {/* <div className="d-flex flex-column flex-sm-column flex-md-row gap-2 mt-2 mt-md-0">
          <CButton
            color="light"
            className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-4"
            onClick={toggleMedicalForm}
            style={{ border: '2px solid #1B9C8F', backgroundColor: 'white', transition: 'background-color 0.3s' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D5ECE9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          >
            <span style={{ color: '#1B9C8F' }}>
              🩺 {isMedicalExpanded ? 'Close' : 'Add Medical Observation'}
            </span>
          </CButton>
          <CButton
            color="light"
            className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-4"
            onClick={toggleAyurvedicForm}
            style={{ border: '2px solid #8B3E2F', backgroundColor: 'white', transition: 'background-color 0.3s' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EED7D3')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          >
            <span style={{ color: '#8B3E2F' }}>
              🌿 {isAyurvedicExpanded ? 'Close' : 'Add Ayurvedic Observation'}
            </span>
          </CButton>
        </div> */}
        <div className="d-flex flex-column flex-sm-column flex-md-row gap-2 mt-2 mt-md-0">
          {hasMedicalFields && (
            <CButton
              color="light"
              className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-4"
              onClick={toggleMedicalForm}
              style={{ border: '2px solid #1B9C8F', backgroundColor: 'white', transition: 'background-color 0.3s' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D5ECE9')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
            >
              <span style={{ color: '#1B9C8F' }}>
                🩺 {isMedicalExpanded ? 'Close' : 'Add Medical Observation'}
              </span>
            </CButton>
          )}
          {hasAyurvedicFields && (
            <CButton
              color="light"
              className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-4"
              onClick={toggleAyurvedicForm}
              style={{ border: '2px solid #8B3E2F', backgroundColor: 'white', transition: 'background-color 0.3s' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EED7D3')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
            >
              <span style={{ color: '#8B3E2F' }}>
                🌿 {isAyurvedicExpanded ? 'Close' : 'Add Ayurvedic Observation'}
              </span>
            </CButton>
          )}
        </div>
      </div>

      {isMedicalExpanded && doctorObservationSettings && (
        <div className="p-2">
          <CRow className="mb-2">
            {doctorObservationSettings.bp && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">BP</CFormLabel>
                <CFormInput
                  type="text"
                  placeholder="e.g. 120/80"
                  value={bp || '/'}
                  onChange={(e) => setBp(e.target.value)}
                  onKeyDown={(e) => {
                    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', '/', 'Delete'];
                    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </CCol>
            )}
            {doctorObservationSettings.weight && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">Weight (Kg)</CFormLabel>
                <CFormInput
                  value={weight}
                  type="number"
                  onChange={(e) => setWeight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                  min="0"
                />
              </CCol>
            )}
            {doctorObservationSettings.height && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">Height (CM)</CFormLabel>
                <CFormInput
                  value={height}
                  type="number"
                  onChange={(e) => setHeight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                  min="0"
                />
              </CCol>
            )}
            {doctorObservationSettings.pulse && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">Pulse</CFormLabel>
                <CFormInput value={pulse} onChange={(e) => setPulse(e.target.value)} />
              </CCol>
            )}
          </CRow>
          <CRow className="mb-2">
            {doctorObservationSettings.past_history && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">Known History</CFormLabel>
                <CFormInput value={pastHistory} onChange={(e) => setPastHistory(e.target.value)} />
              </CCol>
            )}
            {doctorObservationSettings.complaint && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">Complaints</CFormLabel>
                <CFormInput value={complaints} onChange={(e) => setComplaints(e.target.value)} />
              </CCol>
            )}
          </CRow>
          <CRow className="mb-2">
            {doctorObservationSettings.systemic_examination && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">Systemic Examination</CFormLabel>
                <CFormInput value={sysExGeneral} onChange={(e) => setSysExGeneral(e.target.value)} />
              </CCol>
            )}
            {doctorObservationSettings.diagnosis && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">Diagnosis</CFormLabel>
                <CFormInput value={sysExPA} onChange={(e) => setSysExPA(e.target.value)} />
              </CCol>
            )}
          </CRow>
        </div>
      )}

      {isAyurvedicExpanded && doctorAyurvedicObservationSettings && (
        <div className="p-2">
          <CRow className="mb-2">
            {doctorAyurvedicObservationSettings.past_history && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">Past History</CFormLabel>
                <CFormInput
                  value={ayurPastHistory}
                  onChange={(e) => setAyurPastHistory(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                />
              </CCol>
            )}
            {doctorAyurvedicObservationSettings.lab_investigation && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">Investigation</CFormLabel>
                <Select
                  options={investigationOptions}
                  isSearchable
                  value={investigationOptions.find(opt => opt.value === labInvestigation) || null}
                  onChange={(selectedOption) => setLabInvestigation(selectedOption?.value || "")}
                  placeholder="Select or search investigation..."
                />
              </CCol>
            )}
          </CRow>
          <CRow className="mb-2">
            {doctorAyurvedicObservationSettings.lmp && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">LMP</CFormLabel>
                <CFormInput type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} />
              </CCol>
            )}
            {doctorAyurvedicObservationSettings.edd && (
              <CCol xs={12} sm={6}>
                <CFormLabel className="fw-bold">EDD</CFormLabel>
                <CFormInput type="date" value={edd} onChange={(e) => setEdd(e.target.value)} />
              </CCol>
            )}
          </CRow>
          {(doctorAyurvedicObservationSettings.food_and_drug_allergy || doctorAyurvedicObservationSettings.habits) && (
            <CRow className="align-items-center mb-2 mt-3">
              {doctorAyurvedicObservationSettings.food_and_drug_allergy && (
                <CCol xs={12} md={6} className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0">Allergy</h6>
                  <CButton
                    size="sm"
                    onClick={toggleFields}
                    className="btn btn-sm btn-outline-primary"
                  >
                    {showAllergyFields ? '-' : '+'}
                  </CButton>
                </CCol>
              )}
              {doctorAyurvedicObservationSettings.habits && (
                <CCol xs={12} md={6} className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold mb-0">Habits</h6>
                  <CButton
                    size="sm"
                    onClick={() => setShowHabits(!showHabits)}
                    className="btn btn-sm btn-outline-primary"
                  >
                    {showHabits ? '-' : '+'}
                  </CButton>
                </CCol>
              )}
            </CRow>
          )}
          {showAllergyFields && (
            <CRow>
              <CCol xs={12}>
                <div className="d-flex flex-column gap-2">
                  <CFormInput
                    placeholder="Food Allergy"
                    value={foodAndDrugAllergy}
                    onChange={(e) => setFoodAndDrugAllergy(e.target.value)}
                  />
                  <CFormInput
                    placeholder="Drug Allergy"
                    value={drugAllergy}
                    onChange={(e) => setDrugAllergy(e.target.value)}
                  />
                </div>
              </CCol>
            </CRow>
          )}
          {showHabits && (
            <CRow className="mb-3">
              <CCol xs={12} md={4}>
                {["Alcohol", "Cold Drink", "Fast Food", "Salty Food"].map((habit) => (
                  <CCol xs={12} className="mb-3" key={habit}>
                    <CFormLabel className="fw-bold">{habit}</CFormLabel>
                    <div className="d-flex flex-wrap gap-3 mt-1">
                      {(habit === "Fast Food" ? ["Sometimes", "Twice In week", "Once In Week"] : ["Normal", "Moderate", "Heavy"]).map((option) => (
                        <CFormCheck
                          key={option}
                          type="checkbox"
                          label={option}
                          checked={habits[habit.toLowerCase().replace(' ', '_')]?.includes(option)}
                          onChange={() => handleHabitChange(habit.toLowerCase().replace(' ', '_'), option)}
                        />
                      ))}
                    </div>
                  </CCol>
                ))}
              </CCol>
              <CCol xs={12} md={4}>
                {["Chocolate", "Drug Addict", "Late Night Sleep", "Smoking"].map((habit) => (
                  <CCol xs={12} className="mb-3" key={habit}>
                    <CFormLabel className="fw-bold">{habit}</CFormLabel>
                    <div className="d-flex flex-wrap gap-3 mt-1">
                      {(habit === "Late Night Sleep" ? ["Sometimes", "Not Regular", "Regular"] : ["Normal", "Moderate", "Heavy"]).map((option) => (
                        <CFormCheck
                          key={option}
                          type="checkbox"
                          label={option}
                          checked={habits[habit.toLowerCase().replace(' ', '_')]?.includes(option)}
                          onChange={() => handleHabitChange(habit.toLowerCase().replace(' ', '_'), option)}
                        />
                      ))}
                    </div>
                  </CCol>
                ))}
              </CCol>
              <CCol xs={12} md={4}>
                {["Tobbacco", "Coffee", "Eating Habits", "Pan Masala", "Tea"].map((habit) => (
                  <CCol xs={12} className="mb-3" key={habit}>
                    <CFormLabel className="fw-bold">{habit}</CFormLabel>
                    <div className="d-flex flex-wrap gap-3 mt-1">
                      {["Normal", "Moderate", "Heavy"].map((option) => (
                        <CFormCheck
                          key={option}
                          type="checkbox"
                          label={option}
                          checked={habits[habit.toLowerCase().replace(' ', '_')]?.includes(option)}
                          onChange={() => handleHabitChange(habit.toLowerCase().replace(' ', '_'), option)}
                        />
                      ))}
                    </div>
                  </CCol>
                ))}
              </CCol>
            </CRow>
          )}
          {(doctorAyurvedicObservationSettings.personal_history || doctorAyurvedicObservationSettings.prasavvedan_parikshayein) && (
            <CRow className="align-items-center mb-2 mt-3">
              {doctorAyurvedicObservationSettings.personal_history && (
                <CCol xs={12} md={6} className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0">Personal History</h6>
                  <CButton
                    size="sm"
                    onClick={() => setShowPersonalHistory(!showPersonalHistory)}
                    className="btn btn-sm btn-outline-primary"
                  >
                    {showPersonalHistory ? '-' : '+'}
                  </CButton>
                </CCol>
              )}
              {doctorAyurvedicObservationSettings.prasavvedan_parikshayein && (
                <CCol xs={12} md={6} className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold mb-0">Ashtvidh Parikshayein</h6>
                  <CButton
                    size="sm"
                    onClick={() => setShowAshtvidh(!showAshtvidh)}
                    className="btn btn-sm btn-outline-primary"
                  >
                    {showAshtvidh ? '-' : '+'}
                  </CButton>
                </CCol>
              )}
            </CRow>
          )}
          {showPersonalHistory && (
            <CRow>
              {["Diet", "Appetite", "Sleep", "Thirst", "Bowel", "Micturition"].map((field) => (
                <CCol xs={12} sm={6} className="mb-3" key={field}>
                  <CFormLabel className="fw-bold">{field}</CFormLabel>
                  <div className="d-flex flex-wrap gap-3 mt-1">
                    {(field === "Diet" ? ["Vegetarian", "Non-Vegetarian", "Mixed"] :
                      field === "Appetite" ? ["Good", "Normal", "Poor"] :
                      field === "Sleep" ? ["Sound", "Interrupted", "Insomnia"] :
                      field === "Thirst" ? ["Normal", "Medium", "Heavy", "Poor"] :
                      field === "Bowel" ? ["Regular", "Irregular", "Constipated"] :
                      ["Normal", "Poor", "Painful", "Burning", "Frequent"]).map((option) => (
                        <CFormCheck
                          key={option}
                          type="checkbox"
                          label={option}
                          checked={personalHistory[field.toLowerCase()]?.includes(option)}
                          onChange={() => handlePersonalHistoryChange(field.toLowerCase(), option)}
                        />
                      ))}
                  </div>
                </CCol>
              ))}
            </CRow>
          )}
          {showAshtvidh && (
            <CRow>
              <CCol xs={12} className="mb-3">
                <CFormLabel className="fw-bold">नाड़ी</CFormLabel>
                <div className="d-flex flex-wrap gap-3 mt-1">
                  {["साम", "निराम", "क्षीण", "द्रूत", "गुरु", "वात", "पित", "कफ", "वातपित", "पितकफ", "कफवात", "त्रिदोष", "सर्पवत्", "मन्चुकवत्", "हंसवत्"].map((option) => (
                    <CFormCheck
                      key={option}
                      type="checkbox"
                      label={option}
                      checked={ashtvidhData.nadi.includes(option)}
                      onChange={() => handleAshtvidhChange('nadi', option)}
                    />
                  ))}
                </div>
              </CCol>
              <CCol xs={12} className="mb-3">
                <CFormLabel className="fw-bold">जिव्हा</CFormLabel>
                <div className="d-flex flex-wrap gap-3 mt-1">
                  {["साम", "निराम", "दारुण", "पिच्छिल", "स्फुटित", "श्याम", "निलवर्ण", "शुष्क", "वर्ण", "मुरवपाक", "सम्यक्", "निल", "श्वेत", "रक्तवर्ण"].map((option) => (
                    <CFormCheck
                      key={option}
                      type="checkbox"
                      label={option}
                      checked={ashtvidhData.jihva.includes(option)}
                      onChange={() => handleAshtvidhChange('jihva', option)}
                    />
                  ))}
                </div>
              </CCol>
              <CCol xs={12} className="mb-3">
                <CFormLabel className="fw-bold">मल</CFormLabel>
                <div className="d-flex flex-wrap gap-3 mt-1">
                  {["सविबन्ध", "मुह मुह", "द्रव", "बध्ध्", "सरकत", "भोजनोतर", "सपूय", "पिच्छिल", "सम्यक्", "वेदनायुक्त", "Daily", "Alternate day", "शुष्क", "पिताभवर्ण", "श्वेतवर्ण"].map((option) => (
                    <CFormCheck
                      key={option}
                      type="checkbox"
                      label={option}
                      checked={ashtvidhData.mala.includes(option)}
                      onChange={() => handleAshtvidhChange('mala', option)}
                    />
                  ))}
                </div>
              </CCol>
              <CCol xs={12} className="mb-3">
                <CFormLabel className="fw-bold">मूत्र</CFormLabel>
                <div className="d-flex flex-wrap gap-3 mt-1">
                  {["सदाह", "अल्पमुत्रता", "बहुमुत्रता", "सशुल", "रात्रिकालिनबहुमुत्रता", "शैयामूत्रता", "मेयुकत", "अवरोधित", "अनियत्रित", "दीर्घकालीन स तैलसम", "श्वेत वर्ण"].map((option) => (
                    <CFormCheck
                      key={option}
                      type="checkbox"
                      label={option}
                      checked={ashtvidhData.mutra.includes(option)}
                      onChange={() => handleAshtvidhChange('mutra', option)}
                    />
                  ))}
                </div>
              </CCol>
              <CCol xs={12} className="mb-3">
                <CFormLabel className="fw-bold">नेत्र</CFormLabel>
                <div className="d-flex flex-wrap gap-3 mt-1">
                  {["कंड", "पिच्छिल", "मलिन पित्", "निल", "स्ताव", "श्पाव", "शुष्क", "प्रकाश अराहत्व", "सशुल", "दाद् श्रीण", "नेत्रविकार", "सम्यक्", "संकुचित", "विस्फारित", "क्षेत", "अरुण", "पित"].map((option) => (
                    <CFormCheck
                      key={option}
                      type="checkbox"
                      label={option}
                      checked={ashtvidhData.netra.includes(option)}
                      onChange={() => handleAshtvidhChange('netra', option)}
                    />
                  ))}
                </div>
              </CCol>
              <CCol xs={12} className="mb-3">
                <CFormLabel className="fw-bold">आकृति</CFormLabel>
                <div className="d-flex flex-wrap gap-3 mt-1">
                  {["कृश", "स्थूल", "मध्यम"].map((option) => (
                    <CFormCheck
                      key={option}
                      type="checkbox"
                      label={option}
                      checked={ashtvidhData.aakruti.includes(option)}
                      onChange={() => handleAshtvidhChange('aakruti', option)}
                    />
                  ))}
                </div>
              </CCol>
              <CCol xs={12} className="mb-3">
                <CFormLabel className="fw-bold">शब्द</CFormLabel>
                <div className="d-flex flex-wrap gap-3 mt-1">
                  {["गम्भीर", "खिग्ध", "गदगद", "रुक्ष", "मिमिन"].map((option) => (
                    <CFormCheck
                      key={option}
                      type="checkbox"
                      label={option}
                      checked={ashtvidhData.shabda.includes(option)}
                      onChange={() => handleAshtvidhChange('shabda', option)}
                    />
                  ))}
                </div>
              </CCol>
              <CCol xs={12} className="mb-3">
                <CFormLabel className="fw-bold">स्पर्श</CFormLabel>
                <div className="d-flex flex-wrap gap-3 mt-1">
                  {["सिाध", "शीत", "अनष्णाशीत", "रुक्ष", "उषा", "प्रशष्"].map((option) => (
                    <CFormCheck
                      key={option}
                      type="checkbox"
                      label={option}
                      checked={ashtvidhData.sparsha.includes(option)}
                      onChange={() => handleAshtvidhChange('sparsha', option)}
                    />
                  ))}
                </div>
              </CCol>
            </CRow>
          )}
        </div>
      )}
    </CCard>
  );
};

export default MedicalObservations;

