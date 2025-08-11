// import React, { useState, useEffect, useRef } from 'react';
// import { CButton, CCard, CCardBody, CCardHeader, CContainer } from '@coreui/react';
// import { generatePDF, generatePDFBlob } from './invoicePDF';
// import { getAPICall, post, postFormData } from '../../../util/api';
// import { useParams, useLocation } from 'react-router-dom';
// import { useToast } from '../../common/toast/ToastContext';

// const inv = () => {
//   const location = useLocation();
//   const { billId , billIds} = location.state || {};
//   const param = useParams();
//   const { showToast } = useToast();
//   console.log(billIds);
  
//   const [remainingAmount, setRemainingAmount] = useState(0);
//   const [totalAmountWords, setTotalAmountWords] = useState('');
//   const [grandTotal, setGrandTotal] = useState(0);
//   const [formData, setFormData] = useState({});
//   const [descriptions, setDescriptions] = useState([]);
//   const [doctorData, setDoctorData] = useState({});
//   const [file, setFile] = useState(null); // State to hold the file
//   const fileInputRef = useRef(null); // Ref for triggering file input programmatically
//   const [clinicData, setClinicData] = useState(null);
//   const [healthDirectives, setHealthDirectives] = useState([]);
//   const [PatientExaminations, setpatientexaminations] = useState([]);
//   console.log("Patientexaminations", PatientExaminations);
//   const [AyurvedicExaminations, setayurvedicExaminations] = useState([]);
//   console.log("AyurvedicExaminations", AyurvedicExaminations);
  
//   // Trigger file input dialog
//   // const handleFileInputClick = () => {
//   //   handleDownload();
//   //   fileInputRef.current.click(); // Triggers the file input click
//   // };

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0]; // Get selected file
//     if (selectedFile) {
//      // handleDownload(); // Download the bill after file selection
//       setFile(selectedFile); // Set selected file to state
//       handleSendWhatsApp(selectedFile); // Immediately send the bill to WhatsApp after file selection
//     }
//   };

//   const fetchProduct = async () => {
//     try {
//       const response = await getAPICall(`/api/bill/${billId ?? billIds}`);
//       setFormData(response);
//       const finalAmount = Math.round(response.finalAmount);
//       const remaining = finalAmount - response.paidAmount;
//       setRemainingAmount(Math.max(0, remaining));

//       const doctorResponse = await getAPICall(`/api/users/${response.doctor_id}`);
//       setDoctorData(doctorResponse);
//       console.log("doctorResponse",doctorResponse.clinic_id);

//       if (doctorResponse && doctorResponse.clinic_id) {
//         const clinicResponse = await getAPICall(`/api/clinic/${doctorResponse.clinic_id}`);
//         setClinicData(clinicResponse);
//         // console.log(clinicResponse.logo);
//       }
      
//       setGrandTotal(finalAmount);
//       setTotalAmountWords(numberToWords(finalAmount));
//     } catch (error) {
//       console.error('Error fetching product data:', error);
//     }
//   };

//   const fetchDescriptions = async () => {
//     try {
//       const response = await getAPICall(`/api/descriptions/${billId ?? billIds}`);
//       setDescriptions(response);
//     } catch (error) {
//       console.error('Error fetching description data:', error);
//     }
//   };

//   // Fetch Health Directives
//   const fetchHealthDirectives = async () => {
//     try {
//       const response = await getAPICall(`/api/healthdirectivesData/${billId ?? billIds}`);
//       setHealthDirectives(Array.isArray(response) ? response : []); // Ensure it's an array
//     } catch (error) {
//       console.error("Error fetching prescription data:", error);
//       setHealthDirectives([]); // Prevent undefined errors
//     }
//   };

//   // Fetch Patient Examinations
//   const fetchPatientExaminations = async () => {
//     try {
//       const response = await getAPICall(`/api/patientexaminationsData/${billId ?? billIds}`);
//       console.log(response);
      
//       setpatientexaminations(Array.isArray(response) ? response : []);
//     } catch (error) {
//       console.error('Error fetching patientexaminationsData data:', error);
//       setpatientexaminations([]);
//     }
//   }; 


//    // Fetch Ayurvedic Examinations
//   const fetchAyurvedicExaminations = async () => {
//     try {
//       const response = await getAPICall(`/api/ayurvedicexaminationsData/${billId ?? billIds}`);
//       console.log(response);
      
//       setayurvedicExaminations(Array.isArray(response) ? response : []);
//     } catch (error) {
//       console.error('Error fetching ayurvedicexaminationsData data:', error);
//      setayurvedicExaminations([]);
//     }
//   };

//   useEffect(() => {
//     let count = 0; // Counter to track iterations

//     const interval = setInterval(() => {
//       if (count >= 2) {
//         clearInterval(interval);
//         console.log("Completed 2 iterations, stopping updates.");
//         return;
//       }

//       fetchProduct();
//       fetchDescriptions();
//       fetchHealthDirectives();
//       fetchPatientExaminations();
//      fetchAyurvedicExaminations();
//       count++; // Increment counter
//     }, 100);

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, [billId]);

//   const numberToWords = (number) => {
//     const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//     const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

//     if (number === 0) {
//       return 'Zero';
//     }

//     let words = '';
//     if (number >= 100000) {
//       words += numberToWords(Math.floor(number / 1000)) + ' Lakh ';
//       number %= 100000;
//     }

//     if (number >= 1000) {
//       words += numberToWords(Math.floor(number / 1000)) + ' Thousand ';
//       number %= 1000;
//     }

//     if (number >= 100) {
//       words += units[Math.floor(number / 100)] + ' Hundred ';
//       number %= 100;
//     }

//     if (number >= 20) {
//       words += tens[Math.floor(number / 10)] + ' ';
//       number %= 10;
//     }

//     if (number >= 10) {
//       words += teens[number - 10] + ' ';
//       number = 0;
//     }

//     if (number > 0) {
//       words += units[number] + ' ';
//     }

//     return words.trim();
//   };

//   const handleDownload = () => {
//     const totalAmount = descriptions.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    
//     generatePDF(
//       grandTotal || 0, 
//       formData.id || "N/A", 
//       formData.patient_name || "N/A", 
//       formData || {}, 
//       remainingAmount || 0, 
//       totalAmountWords || "Zero", 
//       descriptions || [], 
//       doctorData || {}, 
//       clinicData || {}, 
//       healthDirectives || [],   
//       PatientExaminations || [],
//       AyurvedicExaminations || [],
//       billId,
//       billIds,
//       formData.DeliveryDate ||{},
//       totalAmount
//     );
//   };

// const handleShareWhatsApp = async () => {
//   const billNumber = formData.id || billId;
//   const totalAmount = descriptions.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);

//   // Get the patient's phone number
//   const patientPhone = formData.patient_contact;
//   if (!patientPhone) {
//     showToast('warning', 'Patient contact number is not available');
//     return;
//   }
  
//   // Remove any non-numeric characters from phone number
//   const formattedPhone = patientPhone.replace(/\D/g, '');

//   try {
//     console.log('Starting PDF generation for WhatsApp sharing...');
    
//     // Validate required data before PDF generation
//     if (!formData || !descriptions || descriptions.length === 0) {
//       throw new Error('Missing required data for PDF generation');
//     }

//     // Generate PDF blob (in memory only)
//     const pdfBlob = generatePDFBlob(
//       grandTotal || totalAmount || 0, 
//       billNumber || "N/A", 
//       formData.patient_name || "N/A", 
//       formData, 
//       remainingAmount || 0, 
//       totalAmountWords || "Zero", 
//       descriptions, 
//       doctorData || {}, 
//       clinicData || {}, 
//       healthDirectives || [],   
//       PatientExaminations || [],
//       AyurvedicExaminations || [],
//       billId || billNumber,
//       formData.visit_date || new Date().toISOString().split('T')[0],
//       totalAmount
//     );

//     // Check if PDF was generated successfully
//     if (!pdfBlob || !(pdfBlob instanceof Blob)) {
//       throw new Error('PDF generation failed - invalid blob returned');
//     }

//     // Verify blob has content
//     if (pdfBlob.size === 0) {
//       throw new Error('PDF generation failed - empty file generated');
//     }

//     console.log('PDF generated successfully, size:', pdfBlob.size, 'bytes');

//     const fileName = `Bill-${billNumber}-${formData.patient_name?.replace(/[^a-zA-Z0-9]/g, '') || 'Patient'}.pdf`;
    
//     // Method 1: Try Web Share API first (works best on mobile devices)
//     if (navigator.share) {
//       try {
//         const file = new File([pdfBlob], fileName, { 
//           type: 'application/pdf',
//           lastModified: Date.now()
//         });
        
//         const shareData = {
//           title: `Medical Bill - ${formData.patient_name}`,
//           text: `Medical Bill #${billNumber} for ${formData.patient_name}. Total Amount: Rs. ${totalAmount}`,
//           files: [file]
//         };

//         // Check if sharing files is supported
//         if (navigator.canShare && navigator.canShare(shareData)) {
//           console.log('Using Web Share API...');
//           await navigator.share(shareData);
//           showToast('success', 'Bill shared successfully!');
//           return;
//         } else {
//           console.log('Web Share API does not support file sharing on this device');
//         }
//       } catch (shareError) {
//         console.log('Web Share API failed:', shareError);
//         // Continue to fallback method
//       }
//     }

//     // Method 2: Create temporary object URL and share via WhatsApp (NO DOWNLOAD)
//     console.log('Using fallback method - temporary URL for WhatsApp sharing...');
    
//     // Create temporary URL for the PDF (in memory only)
//     const tempUrl = URL.createObjectURL(pdfBlob);
    
//     // Create WhatsApp message
//     const message = encodeURIComponent(
//       `Hello ${formData.patient_name}!\n\n` +
//       `Here is your medical bill:\n` +
//       `📄 Bill Number: ${billNumber}\n` +
//       `💰 Total Amount: Rs. ${totalAmount}\n` +
//       `📅 Date: ${formData.visit_date}\n\n` +
//       `PDF file is ready for sharing.\n\n` +
//       `Thank you!`
//     );

//     // Try to share directly via WhatsApp Web API
//     const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
//     console.log('Opening WhatsApp:', whatsappUrl);
//     window.open(whatsappUrl, '_blank');
    
//     // For mobile WhatsApp app (alternative approach)
//     // You can also try: whatsapp://send?phone=${formattedPhone}&text=${message}
    
//     // Show user instructions for sharing the PDF
//     showToast('info', 'WhatsApp opened! You can manually attach the PDF file if needed.');
    
//     // Clean up the temporary URL after some time
//     setTimeout(() => {
//       URL.revokeObjectURL(tempUrl);
//       console.log('Temporary URL cleaned up');
//     }, 30000); // Clean up after 30 seconds
    
//   } catch (error) {
//     console.error('Error in WhatsApp sharing:', error);
//     showToast('danger', 'Error generating PDF for WhatsApp sharing: ' + error.message);
    
//     // Fallback to text-only sharing if PDF generation fails
//     try {
//       console.log('Attempting fallback to text-only WhatsApp sharing...');
      
//       const whatsappMessage = encodeURIComponent(
//         `Hello ${formData.patient_name}!\n\n` +
//         `Your medical bill details:\n` +
//         `📄 Bill Number: ${billNumber}\n` +
//         `💰 Total Amount: Rs. ${totalAmount}\n` +
//         `📅 Date: ${formData.visit_date}\n\n` +
//         `Please contact us to get your detailed bill copy.\n\n` +
//         `Thank you!`
//       );
      
//       const whatsappUrl = `https://wa.me/${formattedPhone}?text=${whatsappMessage}`;
//       window.open(whatsappUrl, '_blank');
//       showToast('info', 'WhatsApp opened with bill details. PDF sharing not available.');
      
//     } catch (fallbackError) {
//       console.error('All WhatsApp sharing methods failed:', fallbackError);
//       showToast('danger', 'Unable to share via WhatsApp. Please try the download option instead.');
//     }
//   }
// };

// // Alternative method: Direct WhatsApp sharing with Base64 (for better compatibility)
// const handleShareWhatsAppBase64 = async () => {
//   const billNumber = formData.id || billId;
//   const totalAmount = descriptions.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
//   const patientPhone = formData.patient_contact?.replace(/\D/g, '');

//   if (!patientPhone) {
//     showToast('warning', 'Patient contact number is not available');
//     return;
//   }

//   try {
//     // Generate PDF blob
//     const pdfBlob = generatePDFBlob(
//       grandTotal || totalAmount || 0, 
//       billNumber || "N/A", 
//       formData.patient_name || "N/A", 
//       formData, 
//       remainingAmount || 0, 
//       totalAmountWords || "Zero", 
//       descriptions, 
//       doctorData || {}, 
//       clinicData || {}, 
//       healthDirectives || [],   
//       PatientExaminations || [],
//       AyurvedicExaminations || [],
//       billId || billNumber,
//       formData.visit_date || new Date().toISOString().split('T')[0],
//       totalAmount
//     );

//     // Convert blob to base64 for sharing
//     const reader = new FileReader();
//     reader.onload = function() {
//       const base64Data = reader.result;
      
//       const message = encodeURIComponent(
//         `Hello ${formData.patient_name}!\n\n` +
//         `Your medical bill is ready:\n` +
//         `📄 Bill Number: ${billNumber}\n` +
//         `💰 Total Amount: Rs. ${totalAmount}\n` +
//         `📅 Date: ${formData.visit_date}\n\n` +
//         `PDF Data: ${base64Data.substring(0, 100)}...\n\n` +
//         `Thank you!`
//       );
      
//       const whatsappUrl = `https://wa.me/${patientPhone}?text=${message}`;
//       window.open(whatsappUrl, '_blank');
//       showToast('success', 'WhatsApp opened with bill data!');
//     };
    
//     reader.readAsDataURL(pdfBlob);
    
//   } catch (error) {
//     console.error('Error in Base64 WhatsApp sharing:', error);
//     showToast('danger', 'Error sharing via WhatsApp: ' + error.message);
//   }
// };

// // BONUS: Simple download handler
// const handleDownloadPDF = () => {
//   try {
//     const billNumber = formData.id || billId;
//     const totalAmount = descriptions.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);

//     downloadPDF(
//       grandTotal || totalAmount || 0,
//       billNumber || "N/A",
//       formData.patient_name || "N/A",
//       formData,
//       remainingAmount || 0,
//       totalAmountWords || "Zero",
//       descriptions,
//       doctorData || {},
//       clinicData || {},
//       healthDirectives || [],
//       PatientExaminations || [],
//       AyurvedicExaminations || [],
//       billId || billNumber,
//       formData.visit_date || new Date().toISOString().split('T')[0],
//       totalAmount
//     );

//     showToast('success', 'PDF downloaded successfully!');

//   } catch (error) {
//     console.error('Error downloading PDF:', error);
//     showToast('danger', 'Error downloading PDF: ' + error.message);
//   }
// };
// // Also, remove the handleDownload call from handleFileInputClick
// const handleFileInputClick = () => {
//   // Removed handleDownload() call - no need to download when just opening file picker
//   fileInputRef.current.click(); // Triggers the file input click
// };

//   const handleSendWhatsApp = async (selectedFile) => {
//     if (!selectedFile) {
//       alert("Please upload the bill file!");
//       return;
//     }

//     const formDataToSend = new FormData();
    
//     // Append the phone number and the selected file
//     formDataToSend.append("phone_number", formData.patient_contact); 
//     formDataToSend.append("bill_file", selectedFile); // Attach the PDF file
    
//     try {
//       const response = await postFormData("/api/sendBill", formDataToSend);
//       console.log("WhatsApp message sent successfully!", response.data);
//       showToast('success', 'Bill sent via WhatsApp successfully!');
//     } catch (error) {
//       if (error.response) {
//         console.error("Server Error Response:", error.response.data); // Backend error
//         showToast('danger', 'Error sending WhatsApp: ' + error.response.data.message);
//       } else {
//         console.error("Error sending WhatsApp:", error.message); // Network or client error
//         showToast('danger', 'Error sending WhatsApp: ' + error.message);
//       }
//     }
//   };

//   // Function to check if the field has data
//   const hasData = (field) => field && field !== "N/A" && field !== "";

//   // Get the observation fields that have data
//   const getObservationFields = () => {
//     if (!PatientExaminations || PatientExaminations.length === 0) return [];
    
//     const observation = PatientExaminations[0];
//     const fields = [];
    
//     if (hasData(observation?.bp)) fields.push({ name: "BP", value: observation.bp });
//     if (hasData(observation?.pulse)) fields.push({ name: "Pulse", value: observation.pulse });
//     if (hasData(observation?.height)) fields.push({ name: "Height", value: observation.height });
//     if (hasData(observation?.weight)) fields.push({ name: "Weight", value: observation.weight });
//     if (hasData(observation?.past_history)) fields.push({ name: "Past History", value: observation.past_history });
//     if (hasData(observation?.complaints)) fields.push({ name: "Complaints", value: observation.complaints });
//     if (hasData(observation?.systemic_exam_general)) fields.push({ name: "Systemic Examination", value: observation.systemic_exam_general });
//     if (hasData(observation?.systemic_exam_pa)) fields.push({ name: "Diagnosis", value: observation.systemic_exam_pa });
    
//     return fields;
//   };


//   // Utility function to check if a field has valid data
// // const hasData1 = (field) => {
// //   // return field && field.trim().toUpperCase() !== "NA";
// //   return typeof field === 'string' && field.trim() !== '';
// // };
// const hasData1 = (field) => {
//   if (typeof field === 'string') {
//     return field.trim() !== '';
//   }
//   if (typeof field === 'object' && field !== null) {
//     return Object.values(field).some(
//       (v) => typeof v === 'string' && v.trim() !== ''
//     );
//   }
//   return false;
// };


// // Get valid Ayurvedic observation fields
// const getAyurvedicObservationFields = () => {
//   if (!AyurvedicExaminations || AyurvedicExaminations.length === 0) return [];

//   const observation = AyurvedicExaminations[0]; // assuming only one record or we show the first
//   const fields = [];

//   if (hasData1(observation?.occupation)) fields.push({ name: "Occupation", value: observation.occupation });
//   if (hasData1(observation?.pincode)) fields.push({ name: "Pincode", value: observation.pincode });
//   if (hasData1(observation?.email)) fields.push({ name: "Email", value: observation.email });
//   if (hasData1(observation?.ayurPastHistory)) fields.push({ name: "Past History", value: observation.ayurPastHistory });
//   // if (hasData1(observation?.prasavvedan_parikshayein)) fields.push({ name: "Prasavvedan Parikshayein", value: observation.prasavvedan_parikshayein });




//   //  if (hasData1(observation?.habits)) fields.push({ name: "Habits", value: observation.habits });


//   if (hasData1(observation?.lab_investigation)) fields.push({ name: "Lab Investigation", value: observation.lab_investigation });
//   // if (hasData1(observation?.personal_history)) fields.push({ name: "Personal History", value: observation.personal_history });

//   if (hasData1(observation?.food_and_drug_allergy)) fields.push({ name: "Food Allergy", value: observation.food_and_drug_allergy });
//    if (hasData1(observation?.drug_allery)) fields.push({ name: "Drug Allergy", value: observation.drug_allery });
//   if (hasData1(observation?.lmp)) fields.push({ name: "LMP", value: observation.lmp });
//   if (hasData1(observation?.edd)) fields.push({ name: "EDD", value: observation.edd });  

// // --------------------------------- 
//   if (
//   observation?.prasavvedan_parikshayein &&
//   typeof observation.prasavvedan_parikshayein === 'object'
// ) {
//   const prasavData = observation.prasavvedan_parikshayein;

//   const formatted = Object.entries(prasavData)
//     .filter(([_, value]) => Array.isArray(value) && value.length > 0)
//     .map(([key, value]) => (
//       <div key={key} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
//         <strong style={{ width: '120px' }}>
//           {key.charAt(0).toUpperCase() + key.slice(1)}:
//         </strong>
//         <span>{value.join(', ')}</span>
//       </div>
//     ));

//   if (formatted.length > 0) {
//     fields.push({
//       name: "Prasavvedan Parikshayein",
//       value: formatted,
//     });
//   }
// }

// // ------------------------- 
// if (hasData1(observation?.habits)) {
//   const personalData = observation.habits;
//   const entries = Object.entries(personalData)
//     .filter(([_, v]) => typeof v === 'string' && v.trim() !== '');

//   const formatted = entries.map(([key, value], index) => (
//     <div key={key} style={{ display: 'flex', gap: '6px' }}>
//       <strong style={{ width: '120px' }}>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
//       <span>{value}{index < entries.length - 1 && ','}</span>
//     </div>
//   ));

//   fields.push({ name: "Habits", value: formatted });
// }
  
// // --------------- 
// if (hasData1(observation?.personal_history)) {
//   const personalData = observation.personal_history;
//   const entries = Object.entries(personalData)
//     .filter(([_, v]) => typeof v === 'string' && v.trim() !== '');

//   const formatted = entries.map(([key, value], index) => (
//     <div key={key} style={{ display: 'flex', gap: '6px' }}>
//       <strong style={{ width: '120px' }}>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
//       <span>{value}{index < entries.length - 1 && ','}</span>
//     </div>
//   ));

//   fields.push({ name: "Personal History", value: formatted });
// }



//   return fields;
// };



//   // Check if prescriptions have data for specific columns
//   const hasPrescriptionData = (column) => {
//     return healthDirectives.some(item => hasData(item[column]));
//   };
  
  

//   // Get prescription columns that have data
//   const getPrescriptionColumns = () => {
//     const columns = [
//       { id: 'medicine', label: 'Medicine' },
//       { id: 'strength', label: 'Strength' },
//       { id: 'dosage', label: 'Dosage' },
//       { id: 'timing', label: 'Timing' },
//       { id: 'frequency', label: 'Frequency' },
//       { id: 'duration', label: 'Duration' }
//     ];
    
//     return columns.filter(column => hasPrescriptionData(column.id));
//   };

//   const observationFields = getObservationFields();
//   const prescriptionColumns = getPrescriptionColumns();
//   const ayurvedicExamination = getAyurvedicObservationFields();





  


//   return (
//     <CCard className="mb-4">
      
//       <CCardBody>
//         <CContainer className="container-md invoice-content">
//           {/* Clinic Header */}
//           <div className="row align-items-center text-center text-md-start mb-4">
//             <div className="col-12 col-md-3 text-center">
//               <img src={clinicData?.logo} className="img-fluid" alt="Logo" style={{ maxWidth: '120px', height: 'auto' }} />
//             </div>
//             <div className="col-12 d-md-none"><hr /></div> {/* Break line for small screens */}

//             <div className="col-12 col-md-6 text-center">
//               <h1 className="h1">{clinicData?.clinic_name}</h1>
//             </div>
//             <div className="col-12 d-md-none"><hr /></div> {/* Break line for small screens */}

//             <div className="col-12 col-md-3 text-md-end">
//               <h6 className="fw-bold">Clinic Registration No.: {clinicData?.clinic_registration_no}</h6>
//               <p className="fw-bold">Clinic Address: {clinicData?.clinic_address}</p>
//               <p className="fw-bold">Clinic Contact No: {clinicData?.clinic_mobile}</p>
//             </div>
//           </div>
//           <hr />
  
//           {/* Patient & Doctor Details */}
//           <div className="row mt-3">
//             <div className="col-12 col-md-5">
//               <h6 className="fw-bold">Bills To:</h6>
//               <p><strong>Name:</strong> {formData.patient_name}</p>
//               <p><strong>Address:</strong> {formData.patient_address}</p>
//               <p><strong>Number:</strong> {formData.patient_contact}</p>
//               <p><strong>Email Id:</strong> {formData.patient_email || 'N/A'}</p>
//             </div>
//             <div className="col-12 d-md-none"><hr /></div> {/* Break line for small screens */}
            
//             {/* Center Divider (hidden on small screens) */}
//             <div className="col-12 col-md-1 d-none d-md-flex justify-content-center">
//               <div className="border-end border-2 h-100"></div>
//             </div>
//             <div className="col-12 d-md-none"><hr /></div> {/* Break line for small screens */}
            
//             <div className="col-12 col-md-5">
//               <h6 className="fw-bold">Doctor Details:</h6>
//               <p><strong>Name: </strong> {doctorData.name}</p>
//               <p><strong>Education: </strong>{doctorData.education}</p>
//               <p><strong>Registration No.: </strong> {doctorData.registration_number}</p>
//               <p><strong>Specialty: </strong> {doctorData.speciality}</p>
//             </div>
//           </div>
//           <hr />
  
//           {/* Invoice Details */}
//           <div className="row mt-3 text-center text-md-start">
//             <div className="col-12 col-md-6">
//               <h6 className="fw-bold">Bill NO.: {billId || billIds}</h6>
//               <p className="fw-bold"><strong>Date:</strong> {formData.visit_date}</p>
//               {formData.InvoiceType === 2 && <p className="fw-bold"><strong>Delivery Date:</strong> {formData.DeliveryDate}</p>}
//               {/* <h6 className="fw-bold">Follow-Up Date: {formData.followup_date}</h6> */}
//               {formData.followup_date && (
//   <h6 className="fw-bold">Follow-Up Date: {formData.followup_date}</h6>
// )}

//             </div>
//           </div>
//           <hr />
  
//           {/* Patient Examination - Only Show if There's Data */}
//           {observationFields.length > 0 && (
//             <div className="row mt-3">
//               <div className="col-12">
//                 <h6 className="fw-bold">Medical Observation:</h6>
//                 <div className="table-responsive">
//                   <table className="table table-bordered text-center table-responsive-md">
//                     <tbody>
//                       {/* Create rows with exactly 2 fields (4 cells) per row for proper alignment */}
//                       {Array(Math.ceil(observationFields.length / 2)).fill().map((_, rowIndex) => {
//                         const rowFields = observationFields.slice(rowIndex * 2, rowIndex * 2 + 2);
//                         // Fill remaining cells if we have an odd number of fields
//                         while (rowFields.length < 2) {
//                           rowFields.push({ name: "", value: "" });
//                         }
                        
//                         return (
//                           <tr key={rowIndex}>
//                             <td width="20%"><strong>{rowFields[0].name}</strong></td>
//                             <td width="30%">{rowFields[0].value}</td>
//                             <td width="20%"><strong>{rowFields[1].name}</strong></td>
//                             <td width="30%">{rowFields[1].value}</td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                   <hr />
//                 </div>
//               </div>
//             </div>
//           )}


//  {/* Ayurvedic Examination - Only Show if There's Data */}
//        {getAyurvedicObservationFields().length > 0 && (
//   <div className="row mt-3">
//     <div className="col-12">
//       <h6 className="fw-bold">Ayurvedic Observation:</h6>
//       <div className="table-responsive">
//         <table className="table table-bordered text-center table-responsive-md">
//           <tbody>
//             {Array(Math.ceil(getAyurvedicObservationFields().length / 2)).fill().map((_, rowIndex) => {
//               const ayurFields = getAyurvedicObservationFields();
//               const rowFields = ayurFields.slice(rowIndex * 2, rowIndex * 2 + 2);

//               // Fill remaining cells if odd count
//               while (rowFields.length < 2) {
//                 rowFields.push({ name: "", value: "" });
//               }

//               return (
//                 <tr key={rowIndex}>
//                   <td width="20%"><strong>{rowFields[0].name}</strong></td>
//                   <td width="30%">{rowFields[0].value}</td>
//                   <td width="20%"><strong>{rowFields[1].name}</strong></td>
//                   <td width="30%">{rowFields[1].value}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//         <hr />
//       </div>
//     </div>
//   </div>
// )}


  
//           {/* Prescription Section - Only Show if There's Data */}
//           {healthDirectives.length > 0 && prescriptionColumns.length > 0 && (
//             <div className="row">
//               <div className="col-12">
//                 <h6 className="fw-bold">Prescription:</h6>
//                 <div className="table-responsive">
//                   <table className="table table-bordered border-black table-responsive-md">
//                     <thead className="table-success">
//                       <tr>
//                         <th>Sr No</th>
//                         {prescriptionColumns.map((column, index) => (
//                           <th key={index}>{column.label}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {healthDirectives.map((item, index) => (
//                         <tr key={index}>
//                           <td>{index + 1}</td>
//                           {prescriptionColumns.map((column, colIndex) => (
//                             <td key={colIndex}>{item[column.id] || "N/A"}</td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}
//           {(healthDirectives.length > 0 || observationFields.length > 0) && <hr />}

//           {/* Billing Section */}
//           <div className="row mt-3">
//             <div className="col-12">
//               <h6 className="fw-bold">Bill:</h6>
//               <div className="table-responsive">
//                 <table className="table table-bordered border-black text-center">
//                   <thead className="table-success border-black">
//                     <tr>
//                       <th>Sr No</th>
//                       <th>Description</th>
//                       <th>Quantity</th>
//                       <th>Price</th>
//                       <th>GST</th>
//                       <th>Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {descriptions.map((product, index) => (
//                       <tr key={index}>
//                         <td>{index + 1}</td>
//                         <td>{product.description}</td>
//                         <td>{product.quantity}</td>
//                         <td>{product.price}</td>
//                         <td>{product.gst}</td>
//                         <td>{product.total}</td>
//                       </tr>
//                     ))}
//                     {/* Grand Total Row */}
//                     <tr className="fw-bold table-warning">
//                       <td colSpan="2" className="text-end"><strong>Grand Total:</strong></td>
//                       <td>{descriptions.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0)}</td>
//                       <td>{descriptions.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0).toFixed(2)}</td>
//                       <td>{descriptions.reduce((sum, item) => sum + (parseFloat(item.gst) || 0), 0).toFixed(2)}</td>
//                       <td>{descriptions.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0).toFixed(2)}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//           <hr />
  
//           {/* Footer */}
//           {/* Updated Footer Section with improved buttons */}
// <div className="d-flex justify-content-center flex-wrap gap-2">
//   <CButton color="success" onClick={handleDownload} className="me-2">
//     Download PDF
//   </CButton>
  
//   {/* Primary WhatsApp Share Button */}
//   <CButton 
//     color="success" 
//     style={{ backgroundColor: '#25D366', color: 'white', borderColor: '#25D366' }} 
//     onClick={handleShareWhatsApp}
//     className="me-2"
//   >
//     📱 Share on WhatsApp
//   </CButton>
  
//   {/* Alternative WhatsApp Share (via Backend)
//   <CButton 
//     color="info" 
//     variant="outline"
//     onClick={handleShareWhatsAppAlternative}
//     className="me-2"
//   >
//     📤 Send via WhatsApp API
//   </CButton> */}
  
//   {/* Hidden file input - keep for backward compatibility if needed */}
//   <input
//     type="file"
//     ref={fileInputRef}
//     style={{ display: 'none' }}
//     onChange={handleFileChange}
//   />
// </div>
//         </CContainer>
//       </CCardBody>
//     </CCard>
//   );
// };  

// export default inv;


// import React, { useState, useEffect, useRef } from 'react';
// import { CButton, CCard, CCardBody, CCardHeader, CContainer } from '@coreui/react';
// import { generatePDF, generatePDFBlob } from './invoicePDF';
// import { getAPICall, post, postFormData } from '../../../util/api';
// import { useParams, useLocation } from 'react-router-dom';
// import { useToast } from '../../common/toast/ToastContext';

// const inv = () => {
//   const location = useLocation();
//   const { billId , billIds} = location.state || {};
//   const param = useParams();
//   const { showToast } = useToast();
//   console.log(billIds);
  
//   const [remainingAmount, setRemainingAmount] = useState(0);
//   const [totalAmountWords, setTotalAmountWords] = useState('');
//   const [grandTotal, setGrandTotal] = useState(0);
//   const [formData, setFormData] = useState({});
//   const [descriptions, setDescriptions] = useState([]);
//   const [doctorData, setDoctorData] = useState({});
//   const [file, setFile] = useState(null); // State to hold the file
//   const fileInputRef = useRef(null); // Ref for triggering file input programmatically
//   const [clinicData, setClinicData] = useState(null);
//   const [healthDirectives, setHealthDirectives] = useState([]);
//   const [PatientExaminations, setpatientexaminations] = useState([]);
//   console.log("Patientexaminations", PatientExaminations);
//   const [AyurvedicExaminations, setayurvedicExaminations] = useState([]);
//   console.log("AyurvedicExaminations", AyurvedicExaminations);
  
//   // Trigger file input dialog
//   // const handleFileInputClick = () => {
//   //   handleDownload();
//   //   fileInputRef.current.click(); // Triggers the file input click
//   // };

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0]; // Get selected file
//     if (selectedFile) {
//      // handleDownload(); // Download the bill after file selection
//       setFile(selectedFile); // Set selected file to state
//       handleSendWhatsApp(selectedFile); // Immediately send the bill to WhatsApp after file selection
//     }
//   };

//   const fetchProduct = async () => {
//     try {
//       const response = await getAPICall(`/api/bill/${billId ?? billIds}`);
//       setFormData(response);
//       const finalAmount = Math.round(response.finalAmount);
//       const remaining = finalAmount - response.paidAmount;
//       setRemainingAmount(Math.max(0, remaining));

//       const doctorResponse = await getAPICall(`/api/users/${response.doctor_id}`);
//       setDoctorData(doctorResponse);
//       console.log("doctorResponse",doctorResponse.sign);

//       if (doctorResponse && doctorResponse.clinic_id) {
//         const clinicResponse = await getAPICall(`/api/clinic/${doctorResponse.clinic_id}`);
//         setClinicData(clinicResponse);
//         // console.log(clinicResponse.sign);
//       }
      
//       setGrandTotal(finalAmount);
//       setTotalAmountWords(numberToWords(finalAmount));
//     } catch (error) {
//       console.error('Error fetching product data:', error);
//     }
//   };

//   const fetchDescriptions = async () => {
//     try {
//       const response = await getAPICall(`/api/descriptions/${billId ?? billIds}`);
//       setDescriptions(response);
//     } catch (error) {
//       console.error('Error fetching description data:', error);
//     }
//   };

//   // Fetch Health Directives
//   const fetchHealthDirectives = async () => {
//     try {
//       const response = await getAPICall(`/api/healthdirectivesData/${billId ?? billIds}`);
//       setHealthDirectives(Array.isArray(response) ? response : []); // Ensure it's an array
//     } catch (error) {
//       console.error("Error fetching prescription data:", error);
//       setHealthDirectives([]); // Prevent undefined errors
//     }
//   };

//   // Fetch Patient Examinations
//   const fetchPatientExaminations = async () => {
//     try {
//       const response = await getAPICall(`/api/patientexaminationsData/${billId ?? billIds}`);
//       console.log(response);
      
//       setpatientexaminations(Array.isArray(response) ? response : []);
//     } catch (error) {
//       console.error('Error fetching patientexaminationsData data:', error);
//       setpatientexaminations([]);
//     }
//   }; 


//    // Fetch Ayurvedic Examinations
//   const fetchAyurvedicExaminations = async () => {
//     try {
//       const response = await getAPICall(`/api/ayurvedicexaminationsData/${billId ?? billIds}`);
//       console.log(response);
      
//       setayurvedicExaminations(Array.isArray(response) ? response : []);
//     } catch (error) {
//       console.error('Error fetching ayurvedicexaminationsData data:', error);
//      setayurvedicExaminations([]);
//     }
//   };

//   useEffect(() => {
//     let count = 0; // Counter to track iterations

//     const interval = setInterval(() => {
//       if (count >= 2) {
//         clearInterval(interval);
//         console.log("Completed 2 iterations, stopping updates.");
//         return;
//       }

//       fetchProduct();
//       fetchDescriptions();
//       fetchHealthDirectives();
//       fetchPatientExaminations();
//      fetchAyurvedicExaminations();
//       count++; // Increment counter
//     }, 100);

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, [billId]);

//   const numberToWords = (number) => {
//     const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//     const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

//     if (number === 0) {
//       return 'Zero';
//     }

//     let words = '';
//     if (number >= 100000) {
//       words += numberToWords(Math.floor(number / 1000)) + ' Lakh ';
//       number %= 100000;
//     }

//     if (number >= 1000) {
//       words += numberToWords(Math.floor(number / 1000)) + ' Thousand ';
//       number %= 1000;
//     }

//     if (number >= 100) {
//       words += units[Math.floor(number / 100)] + ' Hundred ';
//       number %= 100;
//     }

//     if (number >= 20) {
//       words += tens[Math.floor(number / 10)] + ' ';
//       number %= 10;
//     }

//     if (number >= 10) {
//       words += teens[number - 10] + ' ';
//       number = 0;
//     }

//     if (number > 0) {
//       words += units[number] + ' ';
//     }

//     return words.trim();
//   };

//   const handleDownload = () => {
//     const totalAmount = descriptions.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    
//     generatePDF(
//       grandTotal || 0, 
//       formData.id || "N/A", 
//       formData.patient_name || "N/A", 
//       formData || {}, 
//       remainingAmount || 0, 
//       totalAmountWords || "Zero", 
//       descriptions || [], 
//       doctorData || {}, 
//       clinicData || {}, 
//       healthDirectives || [],   
//       PatientExaminations || [],
//       AyurvedicExaminations || [],
//       billId,
//       billIds,
//       formData.DeliveryDate ||{},
//       totalAmount
//     );
//   };

// const handleShareWhatsApp =  async() => {
//   const billNumber = formData.id || billId;
//   const totalAmount = descriptions.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);

//   // Get the patient's phone number
//   const patientPhone = formData.patient_contact;
//   if (!patientPhone) {
//     showToast('warning', 'Patient contact number is not available');
//     return;
//   }
  
//   // Remove any non-numeric characters from phone number
//   const formattedPhone = patientPhone.replace(/\D/g, '');

//   try {
//     console.log('Starting PDF generation for WhatsApp sharing...');
    
//     // Validate required data before PDF generation
//     if (!formData || !descriptions || descriptions.length === 0) {
//       throw new Error('Missing required data for PDF generation');
//     }

//     // Generate PDF blob (in memory only)
//     const pdfBlob = generatePDFBlob(
//       grandTotal || totalAmount || 0, 
//       billNumber || "N/A", 
//       formData?.patient_name || "N/A", 
//       formData, 
//       remainingAmount || 0, 
//       totalAmountWords || "Zero", 
//       descriptions, 
//       doctorData || {}, 
//       clinicData || {}, 
//       healthDirectives || [],   
//       PatientExaminations || [],
//       AyurvedicExaminations || [],
//       billId || billNumber,
//       formData?.visit_date || new Date().toISOString().split('T')[0],
//       totalAmount
//     );

//     // Check if PDF was generated successfully
//     if (!pdfBlob || !(pdfBlob instanceof Blob)) {
//       throw new Error('PDF generation failed - invalid blob returned');
//     }

//     // Verify blob has content
//     if (pdfBlob.size === 0) {
//       throw new Error('PDF generation failed - empty file generated');
//     }

//     console.log('PDF generated successfully, size:', pdfBlob.size, 'bytes');

//     const fileName = `Bill-${billNumber}-${formData.patient_name?.replace(/[^a-zA-Z0-9]/g, '') || 'Patient'}.pdf`;
    
//     // Method 1: Try Web Share API first (works best on mobile devices)
//     if (navigator.share) {
//       try {
//         const file = new File([pdfBlob], fileName, { 
//           type: 'application/pdf',
//           lastModified: Date.now()
//         });
        
//         const shareData = {
//           title: `Medical Bill - ${formData.patient_name}`,
//           text: `Medical Bill #${billNumber} for ${formData.patient_name}. Total Amount: Rs. ${totalAmount}`,
//           files: [file]
//         };

//         // Check if sharing files is supported
//         if (navigator.canShare && navigator.canShare(shareData)) {
//           console.log('Using Web Share API...');
//           await navigator.share(shareData);
//           showToast('success', 'Bill shared successfully!');
//           return;
//         } else {
//           console.log('Web Share API does not support file sharing on this device');
//         }
//       } catch (shareError) {
//         console.log('Web Share API failed:', shareError);
//         // Continue to fallback method
//       }
//     }

//     // Method 2: Create temporary object URL and share via WhatsApp (NO DOWNLOAD)
//     console.log('Using fallback method - temporary URL for WhatsApp sharing...');
    
//     // Create temporary URL for the PDF (in memory only)
//     const tempUrl = URL.createObjectURL(pdfBlob);
    
//     // Create WhatsApp message
//     const message = encodeURIComponent(
//       `Hello ${formData.patient_name}!\n\n` +
//       `Here is your medical bill:\n` +
//       `📄 Bill Number: ${billNumber}\n` +
//       `💰 Total Amount: Rs. ${totalAmount}\n` +
//       `📅 Date: ${formData.visit_date}\n\n` +
//       `PDF file is ready for sharing.\n\n` +
//       `Thank you!`
//     );

//     // Try to share directly via WhatsApp Web API
//     const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
//     console.log('Opening WhatsApp:', whatsappUrl);
//     window.open(whatsappUrl, '_blank');
    
//     // For mobile WhatsApp app (alternative approach)
//     // You can also try: whatsapp://send?phone=${formattedPhone}&text=${message}
    
//     // Show user instructions for sharing the PDF
//     showToast('info', 'WhatsApp opened! You can manually attach the PDF file if needed.');
    
//     // Clean up the temporary URL after some time
//     setTimeout(() => {
//       URL.revokeObjectURL(tempUrl);
//       console.log('Temporary URL cleaned up');
//     }, 30000); // Clean up after 30 seconds
    
//   } catch (error) {
//     console.error('Error in WhatsApp sharing:', error);
//     showToast('danger', 'Error generating PDF for WhatsApp sharing: ' + error.message);
    
//     // Fallback to text-only sharing if PDF generation fails
//     try {
//       console.log('Attempting fallback to text-only WhatsApp sharing...');
      
//       const whatsappMessage = encodeURIComponent(
//         `Hello ${formData.patient_name}!\n\n` +
//         `Your medical bill details:\n` +
//         `📄 Bill Number: ${billNumber}\n` +
//         `💰 Total Amount: Rs. ${totalAmount}\n` +
//         `📅 Date: ${formData.visit_date}\n\n` +
//         `Please contact us to get your detailed bill copy.\n\n` +
//         `Thank you!`
//       );
      
//       const whatsappUrl = `https://wa.me/${formattedPhone}?text=${whatsappMessage}`;
//       window.open(whatsappUrl, '_blank');
//       showToast('info', 'WhatsApp opened with bill details. PDF sharing not available.');
      
//     } catch (fallbackError) {
//       console.error('All WhatsApp sharing methods failed:', fallbackError);
//       showToast('danger', 'Unable to share via WhatsApp. Please try the download option instead.');
//     }
//   }
// };


// // Alternative method: Direct WhatsApp sharing with Base64 (for better compatibility)
// const handleShareWhatsAppBase64 = async () => {
//   const billNumber = formData.id || billId;
//   const totalAmount = descriptions.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
//   const patientPhone = formData.patient_contact?.replace(/\D/g, '');

//   if (!patientPhone) {
//     showToast('warning', 'Patient contact number is not available');
//     return;
//   }

//   try {
//     // Generate PDF blob
//     const pdfBlob = await generatePDFBlob(
//       grandTotal || totalAmount || 0, 
//       billNumber || "N/A", 
//       formData.patient_name || "N/A", 
//       formData, 
//       remainingAmount || 0, 
//       totalAmountWords || "Zero", 
//       descriptions, 
//       doctorData || {}, 
//       clinicData || {}, 
//       healthDirectives || [],   
//       PatientExaminations || [],
//       AyurvedicExaminations || [],
//       billId || billNumber,
//       formData.visit_date || new Date().toISOString().split('T')[0],
//       totalAmount
//     );

//     // Convert blob to base64 for sharing
//     const reader = new FileReader();
//     reader.onload = function() {
//       const base64Data = reader.result;
      
//       const message = encodeURIComponent(
//         `Hello ${formData.patient_name}!\n\n` +
//         `Your medical bill is ready:\n` +
//         `📄 Bill Number: ${billNumber}\n` +
//         `💰 Total Amount: Rs. ${totalAmount}\n` +
//         `📅 Date: ${formData.visit_date}\n\n` +
//         `PDF Data: ${base64Data.substring(0, 100)}...\n\n` +
//         `Thank you!`
//       );
      
//       const whatsappUrl = `https://wa.me/${patientPhone}?text=${message}`;
//       window.open(whatsappUrl, '_blank');
//       showToast('success', 'WhatsApp opened with bill data!');
//     };
    
//     reader.readAsDataURL(pdfBlob);
    
//   } catch (error) {
//     console.error('Error in Base64 WhatsApp sharing:', error);
//     showToast('danger', 'Error sharing via WhatsApp: ' + error.message);
//   }
// };

// // BONUS: Simple download handler
// const handleDownloadPDF = () => {
//   try {
//     const billNumber = formData.id || billId;
//     const totalAmount = descriptions.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);

//     downloadPDF(
//       grandTotal || totalAmount || 0,
//       billNumber || "N/A",
//       formData.patient_name || "N/A",
//       formData,
//       remainingAmount || 0,
//       totalAmountWords || "Zero",
//       descriptions,
//       doctorData || {},
//       clinicData || {},
//       healthDirectives || [],
//       PatientExaminations || [],
//       AyurvedicExaminations || [],
//       billId || billNumber,
//       formData.visit_date || new Date().toISOString().split('T')[0],
//       totalAmount
//     );

//     showToast('success', 'PDF downloaded successfully!');

//   } catch (error) {
//     console.error('Error downloading PDF:', error);
//     showToast('danger', 'Error downloading PDF: ' + error.message);
//   }
// };





// // Also, remove the handleDownload call from handleFileInputClick
// const handleFileInputClick = () => {
//   // Removed handleDownload() call - no need to download when just opening file picker
//   fileInputRef.current.click(); // Triggers the file input click
// };

//   const handleSendWhatsApp = async (selectedFile) => {
//     if (!selectedFile) {
//       alert("Please upload the bill file!");
//       return;
//     }

//     const formDataToSend = new FormData();
    
//     // Append the phone number and the selected file
//     formDataToSend.append("phone_number", formData.patient_contact); 
//     formDataToSend.append("bill_file", selectedFile); // Attach the PDF file
    
//     try {
//       const response = await postFormData("/api/sendBill", formDataToSend);
//       console.log("WhatsApp message sent successfully!", response.data);
//       showToast('success', 'Bill sent via WhatsApp successfully!');
//     } catch (error) {
//       if (error.response) {
//         console.error("Server Error Response:", error.response.data); // Backend error
//         showToast('danger', 'Error sending WhatsApp: ' + error.response.data.message);
//       } else {
//         console.error("Error sending WhatsApp:", error.message); // Network or client error
//         showToast('danger', 'Error sending WhatsApp: ' + error.message);
//       }
//     }
//   };

//   // Function to check if the field has data
//   const hasData = (field) => field && field !== "N/A" && field !== "";

//   // Get the observation fields that have data
//   const getObservationFields = () => {
//     if (!PatientExaminations || PatientExaminations.length === 0) return [];
    
//     const observation = PatientExaminations[0];
//     const fields = [];
    
//     if (hasData(observation?.bp)) fields.push({ name: "BP", value: observation.bp });
//     if (hasData(observation?.pulse)) fields.push({ name: "Pulse", value: observation.pulse });
//     if (hasData(observation?.height)) fields.push({ name: "Height (cm)", value: observation.height });
//     if (hasData(observation?.weight)) fields.push({ name: "Weight (Kg)", value: observation.weight });
//     if (hasData(observation?.past_history)) fields.push({ name: "Past History", value: observation.past_history });
//     if (hasData(observation?.complaints)) fields.push({ name: "Complaints", value: observation.complaints });
//     if (hasData(observation?.systemic_exam_general)) fields.push({ name: "Systemic Examination", value: observation.systemic_exam_general });
//     if (hasData(observation?.systemic_exam_pa)) fields.push({ name: "Diagnosis", value: observation.systemic_exam_pa });
    
//     return fields;
//   };


//   // Utility function to check if a field has valid data
// // const hasData1 = (field) => {
// //   // return field && field.trim().toUpperCase() !== "NA";
// //   return typeof field === 'string' && field.trim() !== '';
// // };
// const hasData1 = (field) => {
//   if (typeof field === 'string') {
//     return field.trim() !== '';
//   }
//   if (typeof field === 'object' && field !== null) {
//     return Object.values(field).some(
//       (v) => typeof v === 'string' && v.trim() !== ''
//     );
//   }
//   return false;
// };


// // Get valid Ayurvedic observation fields
// const getAyurvedicObservationFields = () => {
//   if (!AyurvedicExaminations || AyurvedicExaminations.length === 0) return [];

//   const observation = AyurvedicExaminations[0]; // assuming only one record or we show the first
//   const fields = [];

//   if (hasData1(observation?.occupation)) fields.push({ name: "Occupation", value: observation.occupation });
//   if (hasData1(observation?.pincode)) fields.push({ name: "Pincode", value: observation.pincode });
//   if (hasData1(observation?.email)) fields.push({ name: "Email", value: observation.email });
//   if (hasData1(observation?.ayurPastHistory)) fields.push({ name: "Past History", value: observation.ayurPastHistory });
//   // if (hasData1(observation?.prasavvedan_parikshayein)) fields.push({ name: "Prasavvedan Parikshayein", value: observation.prasavvedan_parikshayein });




//   //  if (hasData1(observation?.habits)) fields.push({ name: "Habits", value: observation.habits });


//   if (hasData1(observation?.lab_investigation)) fields.push({ name: "Investigation", value: observation.lab_investigation });
//   // if (hasData1(observation?.personal_history)) fields.push({ name: "Personal History", value: observation.personal_history });

//   if (hasData1(observation?.food_and_drug_allergy)) fields.push({ name: "Food Allergy", value: observation.food_and_drug_allergy });
//    if (hasData1(observation?.drug_allery)) fields.push({ name: "Drug Allergy", value: observation.drug_allery });
//   if (hasData1(observation?.lmp)) fields.push({ name: "LMP", value: observation.lmp });
//   if (hasData1(observation?.edd)) fields.push({ name: "EDD", value: observation.edd });  

// // --------------------------------- 
//   if (
//   observation?.prasavvedan_parikshayein &&
//   typeof observation.prasavvedan_parikshayein === 'object'
// ) {
//   const prasavData = observation.prasavvedan_parikshayein;

//   const formatted = Object.entries(prasavData)
//     .filter(([_, value]) => Array.isArray(value) && value.length > 0)
//     .map(([key, value]) => (
//       <div key={key} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
//         <strong style={{ width: '120px' }}>
//           {key.charAt(0).toUpperCase() + key.slice(1)}:
//         </strong>
//         <span>{value.join(', ')}</span>
//       </div>
//     ));

//   if (formatted.length > 0) {
//     fields.push({
//       name: "Ashtvidh Parikshayein",
//       value: formatted,
//     });
//   }
// }

// // ------------------------- 
// if (hasData1(observation?.habits)) {
//   const personalData = observation.habits;
//   const entries = Object.entries(personalData)
//     .filter(([_, v]) => typeof v === 'string' && v.trim() !== '');

//   const formatted = entries.map(([key, value], index) => (
//     <div key={key} style={{ display: 'flex', gap: '6px' }}>
//       <strong style={{ width: '120px' }}>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
//       <span>{value}{index < entries.length - 1 && ','}</span>
//     </div>
//   ));

//   fields.push({ name: "Habits", value: formatted });
// }
  
// // --------------- 
// if (hasData1(observation?.personal_history)) {
//   const personalData = observation.personal_history;
//   const entries = Object.entries(personalData)
//     .filter(([_, v]) => typeof v === 'string' && v.trim() !== '');

//   const formatted = entries.map(([key, value], index) => (
//     <div key={key} style={{ display: 'flex', gap: '6px' }}>
//       <strong style={{ width: '120px' }}>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
//       <span>{value}{index < entries.length - 1 && ','}</span>
//     </div>
//   ));

//   fields.push({ name: "Personal History", value: formatted });
// }



//   return fields;
// };



//   // Check if prescriptions have data for specific columns
//   const hasPrescriptionData = (column) => {
//     return healthDirectives.some(item => hasData(item[column]));
//   };
  
  

//   // Get prescription columns that have data
//   const getPrescriptionColumns = () => {
//     const columns = [
//       { id: 'medicine', label: 'Medicine' },
//       { id: 'strength', label: 'Strength' },
//       { id: 'dosage', label: 'Dosage' },
//       { id: 'timing', label: 'Timing' },
//       { id: 'frequency', label: 'Frequency' },
//       { id: 'duration', label: 'Duration' },
//       { id: 'price', label: 'Price' }
//     ];
    
//     return columns.filter(column => hasPrescriptionData(column.id));
//   };

//   const observationFields = getObservationFields();
//   const prescriptionColumns = getPrescriptionColumns();
//   const ayurvedicExamination = getAyurvedicObservationFields();





  


//   return (
//     <CCard className="mb-4">
      
//       <CCardBody>
//         <CContainer className="container-md invoice-content">
//           {/* Clinic Header */}
//           <div className="row align-items-center text-center text-md-start mb-4">
//             <div className="col-12 col-md-3 text-center">
//               <img src={clinicData?.logo} className="img-fluid" alt="Logo" style={{ maxWidth: '120px', height: 'auto' }} />
//             </div>
//             <div className="col-12 d-md-none"><hr /></div> {/* Break line for small screens */}

//             <div className="col-12 col-md-6 text-center">
//               <h1 className="h1">{clinicData?.clinic_name}</h1>
//             </div>
//             <div className="col-12 d-md-none"><hr /></div> {/* Break line for small screens */}

//             <div className="col-12 col-md-3 text-md-end">
//               <h6 className="fw-bold">Clinic Registration No.: {clinicData?.clinic_registration_no}</h6>
//               <p className="fw-bold">Clinic Address: {clinicData?.clinic_address}</p>
//               <p className="fw-bold">Clinic Contact No: {clinicData?.clinic_mobile}</p>
//             </div>
//           </div>
//           <hr />
  
//           {/* Patient & Doctor Details */}
//           <div className="row mt-3">
//             <div className="col-12 col-md-5">
//               <h6 className="fw-bold">Bills To:</h6>
//               <p><strong>Name:</strong> {formData.patient_name}</p>
//               <p><strong>Address:</strong> {formData.patient_address}</p>
//               <p><strong>Number:</strong> {formData.patient_contact}</p>
//               <p><strong>Email Id:</strong> {formData.patient_email || 'N/A'}</p>
//             </div>
//             <div className="col-12 d-md-none"><hr /></div> {/* Break line for small screens */}
            
//             {/* Center Divider (hidden on small screens) */}
//             <div className="col-12 col-md-1 d-none d-md-flex justify-content-center">
//               <div className="border-end border-2 h-100"></div>
//             </div>
//             <div className="col-12 d-md-none"><hr /></div> {/* Break line for small screens */}
            
//             <div className="col-12 col-md-5">
//               <h6 className="fw-bold">Doctor Details:</h6>
//               <p><strong>Name: </strong> {doctorData.name}</p>
//               <p><strong>Education: </strong>{doctorData.education}</p>
//               <p><strong>Registration No.: </strong> {doctorData.registration_number}</p>
//               <p><strong>Specialty: </strong> {doctorData.speciality}</p>
//             </div>
//           </div>
//           <hr />
  
//           {/* Invoice Details */}
//           <div className="row mt-3 text-center text-md-start">
//             <div className="col-12 col-md-6">
//               <h6 className="fw-bold">Bill NO.: {billId || billIds}</h6>
//               <p className="fw-bold"><strong>Date:</strong> {formData.visit_date}</p>
//               {formData.InvoiceType === 2 && <p className="fw-bold"><strong>Delivery Date:</strong> {formData.DeliveryDate}</p>}
//               {/* <h6 className="fw-bold">Follow-Up Date: {formData.followup_date}</h6> */}
//               {formData.followup_date && (
//   <h6 className="fw-bold">Follow-Up Date: {formData.followup_date}</h6>
// )}

//             </div>
//           </div>
//           <hr />
  
//           {/* Patient Examination - Only Show if There's Data */}
//           {observationFields.length > 0 && (
//             <div className="row mt-3">
//               <div className="col-12">
//                 <h6 className="fw-bold">Medical Observation:</h6>
//                 <div className="table-responsive">
//                   <table className="table table-bordered text-center table-responsive-md">
//                     <tbody>
//                       {/* Create rows with exactly 2 fields (4 cells) per row for proper alignment */}
//                       {Array(Math.ceil(observationFields.length / 2)).fill().map((_, rowIndex) => {
//                         const rowFields = observationFields.slice(rowIndex * 2, rowIndex * 2 + 2);
//                         // Fill remaining cells if we have an odd number of fields
//                         while (rowFields.length < 2) {
//                           rowFields.push({ name: "", value: "" });
//                         }
                        
//                         return (
//                           <tr key={rowIndex}>
//                             <td width="20%"><strong>{rowFields[0].name}</strong></td>
//                             <td width="30%">{rowFields[0].value}</td>
//                             <td width="20%"><strong>{rowFields[1].name}</strong></td>
//                             <td width="30%">{rowFields[1].value}</td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                   <hr />
//                 </div>
//               </div>
//             </div>
//           )}


//  {/* Ayurvedic Examination - Only Show if There's Data */}
//        {getAyurvedicObservationFields().length > 0 && (
//   <div className="row mt-3">
//     <div className="col-12">
//       <h6 className="fw-bold">Ayurvedic Observation:</h6>
//       <div className="table-responsive">
//         <table className="table table-bordered text-center table-responsive-md">
//           <tbody>
//             {Array(Math.ceil(getAyurvedicObservationFields().length / 2)).fill().map((_, rowIndex) => {
//               const ayurFields = getAyurvedicObservationFields();
//               const rowFields = ayurFields.slice(rowIndex * 2, rowIndex * 2 + 2);

//               // Fill remaining cells if odd count
//               while (rowFields.length < 2) {
//                 rowFields.push({ name: "", value: "" });
//               }

//               return (
//                 <tr key={rowIndex}>
//                   <td width="20%"><strong>{rowFields[0].name}</strong></td>
//                   <td width="30%">{rowFields[0].value}</td>
//                   <td width="20%"><strong>{rowFields[1].name}</strong></td>
//                   <td width="30%">{rowFields[1].value}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//         <hr />
//       </div>
//     </div>
//   </div>
// )}


  
//           {/* Prescription Section - Only Show if There's Data */}
//           {healthDirectives.length > 0 && prescriptionColumns.length > 0 && (
//             <div className="row">
//               <div className="col-12">
//                 <h6 className="fw-bold">Prescription:</h6>
//                 <div className="table-responsive">
//                   <table className="table table-bordered border-black table-responsive-md">
//                     <thead className="table-success">
//                       <tr>
//                         <th>Sr No</th>
//                         {prescriptionColumns.map((column, index) => (
//                           <th key={index}>{column.label}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {healthDirectives.map((item, index) => (
//                         <tr key={index}>
//                           <td>{index + 1}</td>
//                           {prescriptionColumns.map((column, colIndex) => (
//                             <td key={colIndex}>{item[column.id] || "N/A"}</td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}
//           {(healthDirectives.length > 0 || observationFields.length > 0) && <hr />}

//           {/* Billing Section */}
//           <div className="row mt-3">
//             <div className="col-12">
//               <h6 className="fw-bold">Bill:</h6>
//               <div className="table-responsive">
//                 <table className="table table-bordered border-black text-center">
//                   <thead className="table-success border-black">
//                     <tr>
//                       <th>Sr No</th>
//                       <th>Description</th>
//                       <th>Quantity</th>
//                       <th>Price</th>
//                       <th>GST</th>
//                       <th>Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {descriptions.map((product, index) => (
//                       <tr key={index}>
//                         <td>{index + 1}</td>
//                         <td>{product.description}</td>
//                         <td>{product.quantity}</td>
//                         <td>{product.price}</td>
//                         <td>{product.gst}</td>
//                         <td>{product.total}</td>
//                       </tr>
//                     ))}
//                     {/* Grand Total Row */}
//                     <tr className="fw-bold table-warning">
//                       <td colSpan="2" className="text-end"><strong>Grand Total:</strong></td>
//                       <td>{descriptions.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0)}</td>
//                       <td>{descriptions.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0).toFixed(2)}</td>
//                       <td>{descriptions.reduce((sum, item) => sum + (parseFloat(item.gst) || 0), 0).toFixed(2)}</td>
//                       <td>{descriptions.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0).toFixed(2)}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//           <hr />
  
//           {/* Footer */}
//           {/* Updated Footer Section with improved buttons */}
// <div className="d-flex justify-content-center flex-wrap gap-2">
//   <CButton color="success" onClick={handleDownload} className="me-2">
//     Download PDF
//   </CButton>
  
//   {/* Primary WhatsApp Share Button */}
//   <CButton 
//     color="success" 
//     style={{ backgroundColor: '#25D366', color: 'white', borderColor: '#25D366' }} 
//     onClick={handleShareWhatsApp}
//     className="me-2"
//   >
//     📱 Share on WhatsApp
//   </CButton>
  
//   {/* Alternative WhatsApp Share (via Backend)
//   <CButton 
//     color="info" 
//     variant="outline"
//     onClick={handleShareWhatsAppAlternative}
//     className="me-2"
//   >
//     📤 Send via WhatsApp API
//   </CButton> */}
  
//   {/* Hidden file input - keep for backward compatibility if needed */}
//   <input
//     type="file"
//     ref={fileInputRef}
//     style={{ display: 'none' }}
//     onChange={handleFileChange}
//   />
// </div>
//         </CContainer>
//       </CCardBody>
//     </CCard>
//   );
// };  

// export default inv;







import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCard, CCardBody, CContainer } from '@coreui/react';
import { generatePDF, generatePDFBlob, sharePDFOnWhatsApp } from './invoicePDF';
import { getAPICall, postFormData } from '../../../util/api';
import { useParams, useLocation } from 'react-router-dom';
import { useToast } from '../../common/toast/ToastContext';

const Invoice = () => {
  const location = useLocation();
  const { billId, billIds } = location.state || {};
  const { showToast } = useToast();

  const [remainingAmount, setRemainingAmount] = useState(0);
  const [totalAmountWords, setTotalAmountWords] = useState('');
  const [grandTotal, setGrandTotal] = useState(0);
  const [formData, setFormData] = useState({});
  const [descriptions, setDescriptions] = useState([]);
  const [doctorData, setDoctorData] = useState({});
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [clinicData, setClinicData] = useState(null);
  const [healthDirectives, setHealthDirectives] = useState([]);
  const [patientExaminations, setPatientExaminations] = useState([]);
  const [ayurvedicExaminations, setAyurvedicExaminations] = useState([]);
  const [babyPadiatricExamination, setbabyPadiatricExamination] = useState([]);
  

  const fetchProduct = async () => {
    try {
      const response = await getAPICall(`/api/bill/${billId ?? billIds}`);
      setFormData(response);
      const finalAmount = Math.round(response.finalAmount || 0);
      const remaining = finalAmount - (response.paidAmount || 0);
      setRemainingAmount(Math.max(0, remaining));

      const doctorResponse = await getAPICall(`/api/users/${response.doctor_id}`);
      setDoctorData(doctorResponse);

      if (doctorResponse?.clinic_id) {
        const clinicResponse = await getAPICall(`/api/clinic/${doctorResponse.clinic_id}`);
        setClinicData(clinicResponse);
      }

      setGrandTotal(finalAmount);
      setTotalAmountWords(numberToWords(finalAmount));
    } catch (error) {
      console.error('Error fetching product data:', error);
      showToast('danger', 'Failed to fetch bill data');
    }
  };

  const fetchDescriptions = async () => {
    try {
      const response = await getAPICall(`/api/descriptions/${billId ?? billIds}`);
      setDescriptions(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching description data:', error);
      showToast('danger', 'Failed to fetch descriptions');
    }
  };

  const fetchHealthDirectives = async () => {
    try {
      const response = await getAPICall(`/api/healthdirectivesData/${billId ?? billIds}`);
      setHealthDirectives(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching health directives:', error);
      setHealthDirectives([]);
    }
  };

  const fetchPatientExaminations = async () => {
    try {
      const response = await getAPICall(`/api/patientexaminationsData/${billId ?? billIds}`);
      setPatientExaminations(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching patient examinations:', error);
      setPatientExaminations([]);
    }
  };

  const fetchAyurvedicExaminations = async () => {
    try {
      const response = await getAPICall(`/api/ayurvedicexaminationsData/${billId ?? billIds}`);
      setAyurvedicExaminations(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching ayurvedic examinations:', error);
      setAyurvedicExaminations([]);
    }
  };

   const fetchBabyPadiatricExamination = async () => {
    try {
      const response = await getAPICall(`/api/baby-observations/getByPpiId/${billId ?? billIds}`);
      setbabyPadiatricExamination(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching Baby Pediatric examinations:', error);
      setbabyPadiatricExamination([]);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchDescriptions();
    fetchHealthDirectives();
    fetchPatientExaminations();
    fetchAyurvedicExaminations();
    fetchBabyPadiatricExamination();
  }, [billId, billIds]);

  const numberToWords = (number) => {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (number === 0) return 'Zero';

    let words = '';
    if (number >= 100000) {
      words += numberToWords(Math.floor(number / 100000)) + ' Lakh ';
      number %= 100000;
    }
    if (number >= 1000) {
      words += numberToWords(Math.floor(number / 1000)) + ' Thousand ';
      number %= 1000;
    }
    if (number >= 100) {
      words += units[Math.floor(number / 100)] + ' Hundred ';
      number %= 100;
    }
    if (number >= 20) {
      words += tens[Math.floor(number / 10)] + ' ';
      number %= 10;
    }
    if (number >= 10) {
      words += teens[number - 10] + ' ';
      number = 0;
    }
    if (number > 0) {
      words += units[number] + ' ';
    }
    return words.trim();
  };

  const handleDownload = async () => {
    try {
      const totalAmount = descriptions.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
      await generatePDF(
        grandTotal || 0,
        formData.id || billId || 'N/A',
        formData.patient_name || 'N/A',
        formData || {},
        remainingAmount || 0,
        totalAmountWords || 'Zero',
        descriptions || [],
        doctorData || {},
        clinicData || {},
        healthDirectives || [],
        patientExaminations || [],
        ayurvedicExaminations || [],
        babyPadiatricExamination || [],
        billId,
        billIds,
        formData.visit_date || new Date().toISOString().split('T')[0],
        formData.DeliveryDate || null,
        totalAmount
      );
      showToast('success', 'PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      showToast('danger', 'Error downloading PDF: ' + error.message);
    }
  };

  const handleShareWhatsApp = async () => {
    try {
      const billNumber = formData.id || billId || 'N/A';
      const totalAmount = descriptions.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
      const patientPhone = formData.patient_contact?.replace(/\D/g, '');

      if (!patientPhone) {
        showToast('warning', 'Patient contact number is not available');
        return;
      }

      if (!formData || !descriptions || descriptions.length === 0) {
        showToast('warning', 'Missing required data for PDF generation');
        return;
      }

      const result = await sharePDFOnWhatsApp(
        patientPhone,
        grandTotal || totalAmount || 0,
        billNumber,
        formData.patient_name || 'N/A',
        formData,
        remainingAmount || 0,
        totalAmountWords || 'Zero',
        descriptions,
        doctorData || {},
        clinicData || {},
        healthDirectives || [],
        patientExaminations || [],
        ayurvedicExaminations || [],
        babyPadiatricExamination || [],
        billId || billNumber,
        billIds,
        formData.visit_date || new Date().toISOString().split('T')[0],
        formData.DeliveryDate || null,
        totalAmount
      );

      if (result.success) {
        showToast('success', 'Bill shared successfully via WhatsApp!');
      } else {
        showToast('danger', 'Failed to share via WhatsApp: ' + result.message);
      }
    } catch (error) {
      console.error('Error in WhatsApp sharing:', error);
      showToast('danger', 'Error sharing via WhatsApp: ' + error.message);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      await handleSendWhatsApp(selectedFile);
    }
  };

  const handleSendWhatsApp = async (selectedFile) => {
    if (!selectedFile) {
      showToast('warning', 'Please upload a bill file!');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('phone_number', formData.patient_contact);
    formDataToSend.append('bill_file', selectedFile);

    try {
      const response = await postFormData('/api/sendBill', formDataToSend);
      showToast('success', 'Bill sent via WhatsApp successfully!');
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      showToast('danger', 'Error sending WhatsApp: ' + (error.response?.data?.message || error.message));
    }
  };

  const hasData = (field) => field && field !== 'N/A' && field !== '';

  const getObservationFields = () => {
    if (!patientExaminations || patientExaminations.length === 0) return [];
    const observation = patientExaminations[0];
    const fields = [];
    if (hasData(observation?.bp)) fields.push({ name: 'BP', value: observation.bp });
    if (hasData(observation?.pulse)) fields.push({ name: 'Pulse', value: observation.pulse });
    if (hasData(observation?.height)) fields.push({ name: 'Height (cm)', value: observation.height });
    if (hasData(observation?.weight)) fields.push({ name: 'Weight (Kg)', value: observation.weight });
    if (hasData(observation?.past_history)) fields.push({ name: 'Past History', value: observation.past_history });
    if (hasData(observation?.complaints)) fields.push({ name: 'Complaints', value: observation.complaints });
    if (hasData(observation?.systemic_exam_general)) fields.push({ name: 'Systemic Examination', value: observation.systemic_exam_general });
    if (hasData(observation?.systemic_exam_pa)) fields.push({ name: 'Diagnosis', value: observation.systemic_exam_pa });
    return fields;
  };

  const hasData1 = (field) => {
    if (typeof field === 'string') return field.trim() !== '';
    if (typeof field === 'object' && field !== null) {
      return Object.values(field).some(v => typeof v === 'string' && v.trim() !== '');
    }
    return false;
  };

  const getAyurvedicObservationFields = () => {
    if (!ayurvedicExaminations || ayurvedicExaminations.length === 0) return [];
    const observation = ayurvedicExaminations[0];
    const fields = [];

    if (hasData1(observation?.occupation)) fields.push({ name: 'Occupation', value: observation.occupation });
    if (hasData1(observation?.pincode)) fields.push({ name: 'Pincode', value: observation.pincode });
    if (hasData1(observation?.email)) fields.push({ name: 'Email', value: observation.email });
    if (hasData1(observation?.ayurPastHistory)) fields.push({ name: 'Past History', value: observation.ayurPastHistory });
    if (hasData1(observation?.lab_investigation)) fields.push({ name: 'Investigation', value: observation.lab_investigation });
    if (hasData1(observation?.food_and_drug_allergy)) fields.push({ name: 'Food Allergy', value: observation.food_and_drug_allergy });
    if (hasData1(observation?.drug_allery)) fields.push({ name: 'Drug Allergy', value: observation.drug_allery });
    if (hasData1(observation?.lmp)) fields.push({ name: 'LMP', value: observation.lmp });
    if (hasData1(observation?.edd)) fields.push({ name: 'EDD', value: observation.edd });

    // if (hasData1(observation?.prasavvedan_parikshayein)) {
    //   const formatted = Object.entries(observation?.prasavvedan_parikshayein)
    //     .filter(([_, value]) => Array.isArray(value) && value.length > 0)
    //     .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value.join(', ')}`)
    //     .join(' | ');
    //   if (formatted) fields.push({ name: 'Ashtvidh Parikshayein', value: formatted });
    // }


      if (
  observation?.prasavvedan_parikshayein &&
  typeof observation.prasavvedan_parikshayein === 'object'
) {
  const prasavData = observation.prasavvedan_parikshayein;

  const formatted = Object.entries(prasavData)
    .filter(([_, value]) => Array.isArray(value) && value.length > 0)
    .map(([key, value]) => (
      <div key={key} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
        <strong style={{ width: '120px' }}>
          {key.charAt(0).toUpperCase() + key.slice(1)}:
        </strong>
        <span>{value.join(', ')}</span>
      </div>
    ));

  if (formatted.length > 0) {
    fields.push({
      name: "Ashtvidh Parikshayein",
      value: formatted,
    });
  }
}

    if (hasData1(observation?.habits)) {
      const formatted = Object.entries(observation.habits)
        .filter(([_, v]) => typeof v === 'string' && v.trim() !== '')
        .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
        .join(' | ');
      if (formatted) fields.push({ name: 'Habits', value: formatted });
    }

    if (hasData1(observation?.personal_history)) {
      const formatted = Object.entries(observation.personal_history)
        .filter(([_, v]) => typeof v === 'string' && v.trim() !== '')
        .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
        .join(' | ');
      if (formatted) fields.push({ name: 'Personal History', value: formatted });
    }

    return fields;
  };


const hasData2 = (field) => {
  if (typeof field === 'string') return field.trim() !== '';
  if (typeof field === 'object' && field !== null) {
    return Object.values(field).some(v => typeof v === 'string' && v.trim() !== '');
  }
  if (typeof field === 'number') return !isNaN(field); // Handle numeric values
  return false;
};

const getBabyPediatricObservationFields = () => {
  if (!babyPadiatricExamination || babyPadiatricExamination.length === 0) return [];
  
  const observation = babyPadiatricExamination[0];
  const fields = [];

  if (hasData2(observation?.weightBaby)) fields.push({ name: 'Weight', value: observation.weightBaby });
  if (hasData2(observation?.heightBaby)) fields.push({ name: 'Height', value: observation.heightBaby });
  if (hasData2(observation?.headCircumference)) fields.push({ name: 'Head Circumference', value: observation.headCircumference });
  if (hasData2(observation?.temperature)) fields.push({ name: 'Temperature', value: observation.temperature });
  if (hasData2(observation?.heartRate)) fields.push({ name: 'Heart Rate', value: observation.heartRate });
  if (hasData2(observation?.respiratoryRate)) fields.push({ name: 'Respiratory Rate', value: observation.respiratoryRate });
  if (hasData2(observation?.vaccinationsGiven)) fields.push({ name: 'Vaccinations Given', value: observation.vaccinationsGiven });
  if (hasData2(observation?.milestonesAchieved)) fields.push({ name: 'Milestones Achieved', value: observation.milestonesAchieved });
  if (hasData2(observation?.remarks)) fields.push({ name: 'Remarks', value: observation.remarks });

  return fields; // ✅ Return the array, not false
};



  const hasPrescriptionData = (column) => healthDirectives.some(item => hasData(item[column]));

  const getPrescriptionColumns = () => {
    const columns = [
      { id: 'medicine', label: 'Medicine' },
      { id: 'strength', label: 'Strength' },
      { id: 'dosage', label: 'Dosage' },
      { id: 'timing', label: 'Timing' },
      { id: 'frequency', label: 'Frequency' },
      { id: 'duration', label: 'Duration' },
      { id: 'price', label: 'Price' },
    ];
    return columns.filter(column => hasPrescriptionData(column.id));
  };

  const observationFields = getObservationFields();
  const prescriptionColumns = getPrescriptionColumns();
  const ayurvedicExamination = getAyurvedicObservationFields();
  const babyPadiatric = getBabyPediatricObservationFields();

  return (
    <CCard className="mb-4">
      <CCardBody>
        <CContainer className="container-md invoice-content">
          {/* Clinic Header */}
          <div className="row align-items-center text-center text-md-start mb-4">
            <div className="col-12 col-md-3 text-center">
              <img src={clinicData?.logo} className="img-fluid" alt="Logo" style={{ maxWidth: '120px', height: 'auto' }} />
            </div>
            <div className="col-12 d-md-none"><hr /></div>
            <div className="col-12 col-md-6 text-center">
              <h1 className="h1">{clinicData?.clinic_name}</h1>
            </div>
            <div className="col-12 d-md-none"><hr /></div>
            <div className="col-12 col-md-3 text-md-end">
              <h6 className="fw-bold">Clinic Registration No.: {clinicData?.clinic_registration_no}</h6>
              <p className="fw-bold">Clinic Address: {clinicData?.clinic_address}</p>
              <p className="fw-bold">Clinic Contact No: {clinicData?.clinic_mobile}</p>
            </div>
          </div>
          <hr />

          {/* Patient & Doctor Details */}
          <div className="row mt-3">
            <div className="col-12 col-md-5">
              <h6 className="fw-bold">Bills To:</h6>
              <p><strong>Name:</strong> {formData.patient_name || 'N/A'}</p>
              <p><strong>Address:</strong> {formData.patient_address || 'N/A'}</p>
              <p><strong>Number:</strong> {formData.patient_contact || 'N/A'}</p>
              <p><strong>Email Id:</strong> {formData.patient_email || 'N/A'}</p>
            </div>
            <div className="col-12 d-md-none"><hr /></div>
            <div className="col-12 col-md-1 d-none d-md-flex justify-content-center">
              <div className="border-end border-2 h-100"></div>
            </div>
            <div className="col-12 d-md-none"><hr /></div>
            <div className="col-12 col-md-5">
              <h6 className="fw-bold">Doctor Details:</h6>
              <p><strong>Name:</strong> {doctorData.name || 'N/A'}</p>
              <p><strong>Education:</strong> {doctorData.education || 'N/A'}</p>
              <p><strong>Registration No.:</strong> {doctorData.registration_number || 'N/A'}</p>
              <p><strong>Specialty:</strong> {doctorData.speciality || 'N/A'}</p>
            </div>
          </div>
          <hr />

          {/* Invoice Details */}
          <div className="row mt-3 text-center text-md-start">
            <div className="col-12 col-md-6">
              <h6 className="fw-bold">Bill NO.: {billId || billIds || 'N/A'}</h6>
              <p className="fw-bold"><strong>Date:</strong> {formData.visit_date || 'N/A'}</p>
              {formData.InvoiceType === 2 && <p className="fw-bold"><strong>Delivery Date:</strong> {formData.DeliveryDate || 'N/A'}</p>}
              {formData.followup_date && <h6 className="fw-bold">Follow-Up Date: {formData.followup_date}</h6>}
            </div>
          </div>
          <hr />

          {/* Patient Examination */}
          {observationFields.length > 0 && (
            <div className="row mt-3">
              <div className="col-12">
                <h6 className="fw-bold">Medical Observation:</h6>
                <div className="table-responsive">
                  <table className="table table-bordered text-center table-responsive-md">
                    <tbody>
                      {Array(Math.ceil(observationFields.length / 2))
                        .fill()
                        .map((_, rowIndex) => {
                          const rowFields = observationFields.slice(rowIndex * 2, rowIndex * 2 + 2);
                          while (rowFields.length < 2) {
                            rowFields.push({ name: '', value: '' });
                          }
                          return (
                            <tr key={rowIndex}>
                              <td width="20%"><strong>{rowFields[0].name}</strong></td>
                              <td width="30%">{rowFields[0].value}</td>
                              <td width="20%"><strong>{rowFields[1].name}</strong></td>
                              <td width="30%">{rowFields[1].value}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  <hr />
                </div>
              </div>
            </div>
          )}

          {/* Ayurvedic Examination */}
          {ayurvedicExamination.length > 0 && (
            <div className="row mt-3">
              <div className="col-12">
                <h6 className="fw-bold">Ayurvedic Observation:</h6>
                <div className="table-responsive">
                  <table className="table table-bordered text-center table-responsive-md">
                    <tbody>
                      {Array(Math.ceil(ayurvedicExamination.length / 2))
                        .fill()
                        .map((_, rowIndex) => {
                          const rowFields = ayurvedicExamination.slice(rowIndex * 2, rowIndex * 2 + 2);
                          while (rowFields.length < 2) {
                            rowFields.push({ name: '', value: '' });
                          }
                          return (
                            <tr key={rowIndex}>
                              <td width="20%"><strong>{rowFields[0].name}</strong></td>
                              <td width="30%">{rowFields[0].value}</td>
                              <td width="20%"><strong>{rowFields[1].name}</strong></td>
                              <td width="30%">{rowFields[1].value}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  <hr />
                </div>
              </div>
            </div>
          )}

          {/* Baby Pediatric Section  */}
          {babyPadiatric.length > 0 && (
            <div className="row mt-3">
              <div className="col-12">
                <h6 className="fw-bold">Baby Pediatric Observation:</h6>
                <div className="table-responsive">
                  <table className="table table-bordered text-center table-responsive-md">
                    <tbody>
                      {Array(Math.ceil(babyPadiatric.length / 2))
                        .fill()
                        .map((_, rowIndex) => {
                          const rowFields = babyPadiatric.slice(rowIndex * 2, rowIndex * 2 + 2);
                          while (rowFields.length < 2) {
                            rowFields.push({ name: '', value: '' });
                          }
                          return (
                            <tr key={rowIndex}>
                              <td width="20%"><strong>{rowFields[0].name}</strong></td>
                              <td width="30%">{rowFields[0].value}</td>
                              <td width="20%"><strong>{rowFields[1].name}</strong></td>
                              <td width="30%">{rowFields[1].value}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  <hr />
                </div>
              </div>
            </div>
          )}

          {/* Prescription Section */}
          {healthDirectives.length > 0 && prescriptionColumns.length > 0 && (
            <div className="row">
              <div className="col-12">
                <h6 className="fw-bold">Prescription:</h6>
                <div className="table-responsive">
                  <table className="table table-bordered border-black table-responsive-md">
                    <thead className="table-success">
                      <tr>
                        <th>Sr No</th>
                        {prescriptionColumns.map((column, index) => (
                          <th key={index}>{column.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {healthDirectives.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          {prescriptionColumns.map((column, colIndex) => (
                            <td key={colIndex}>{item[column.id] || 'N/A'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {(healthDirectives.length > 0 || observationFields.length > 0) && <hr />}

          {/* Billing Section */}
          <div className="row mt-3">
            <div className="col-12">
              <h6 className="fw-bold">Bill:</h6>
              <div className="table-responsive">
                <table className="table table-bordered border-black text-center">
                  <thead className="table-success border-black">
                    <tr>
                      <th>Sr No</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>GST</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {descriptions.map((product, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{product.description || 'N/A'}</td>
                        <td>{product.quantity || 'N/A'}</td>
                        <td>{product.price || 'N/A'}</td>
                        <td>{product.gst || 'N/A'}</td>
                        <td>{product.total || 'N/A'}</td>
                      </tr>
                    ))}
                    <tr className="fw-bold table-warning">
                      <td colSpan="2" className="text-end"><strong>Grand Total:</strong></td>
                      <td>{descriptions.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0)}</td>
                      <td>{descriptions.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0).toFixed(2)}</td>
                      <td>{descriptions.reduce((sum, item) => sum + (parseFloat(item.gst) || 0), 0).toFixed(2)}</td>
                      <td>{descriptions.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <hr />

          {/* Footer */}
          <div className="d-flex justify-content-center flex-wrap gap-2">
            <CButton color="success" onClick={handleDownload} className="me-2">
              Download PDF
            </CButton>
            <CButton
              color="success"
              style={{ backgroundColor: '#25D366', color: 'white', borderColor: '#25D366' }}
              onClick={handleShareWhatsApp}
              className="me-2"
            >
              📱 Share on WhatsApp
            </CButton>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </CContainer>
      </CCardBody>
    </CCard>
  );
};

export default Invoice;