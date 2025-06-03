// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   CButton, 
//   CCard, 
//   CCardBody, 
//   CCol, 
//   CContainer, 
//   CForm, 
//   CFormInput, 
//   CFormLabel, 
//   CFormSelect, 
//   CRow,
//   CAlert
// } from '@coreui/react';
// import { post, getAPICall, postFormData } from '../../../util/api';
// import { useToast } from '../../notifications/toasts/ToastContext';
// import { getUser } from '../../../util/session';
// import { generateClinicReceiptPDF } from './ClinicPdf';

// function ClinicRegister() {
//   const today = new Date();
//   const { showToast } = useToast();
//   const user = getUser();
//   const userType = user.type;
//   const logedInUserId = user.id;
//   const [preparedData, setPreparedData] = useState(null);
  
//   const [formData, setFormData] = useState({
//     clinic_name: '',
//     logo: '',
//     clinic_registration_no: '',
//     clinic_mobile: '',
//     clinic_address: '',
//     subscribed_plan: 1,
//     subscription_validity: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString().split('T')[0],
//     refer_by_id: logedInUserId,
//   });

//   const [refData, setRefData] = useState({
//     plans: [],
//     users: []
//   });

//   const [errors, setErrors] = useState({});
//   const [validated, setValidated] = useState(false);
//   const logoInputRef = useRef(null);

//   const durationOptions = [
//     { label: 'Yearly', value: 12 },
//     { label: 'Half Yearly', value: 6 }
//   ];

//   // Load Razorpay script
//   useEffect(() => {
//     if (!window.Razorpay) {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => console.log("Razorpay script loaded");
//       document.body.appendChild(script);
//     }
//   }, []);

//   // Fetch reference data (plans, users)
//   useEffect(() => {
//     const fetchRefData = async () => {
//       try {
//         const response = await getAPICall('/api/detailsForClinic');
//         if (response) {
//           setRefData(response);
//         } else {
//           console.error('Failed to fetch reference data');
//           showToast('danger', 'Failed to load clinic details');
//         }
//       } catch (error) {
//         console.error('Error fetching reference data:', error);
//         showToast('danger', 'Error loading clinic details');
//       }
//     };
//     fetchRefData();
//   }, []);

//   const getAmount = (subscribed_plan) => {
//     return refData.plans.find(p => p.id == subscribed_plan)?.price || 0;
//   };

//   const getGSTAmount = () => {
//     // Calculate 18% of total
//     return Math.ceil(totalAmount() * 0.18);
//   };

//   const totalAmount = () => {
//     return getAmount(formData.subscribed_plan) * getNumberOfMonths();
//   };

//   const getNumberOfMonths = () => {
//     // Calculate number of months from today till validity date
//     const validityDate = new Date(formData.subscription_validity);
//     const todayDate = new Date();
//     const diffTime = Math.abs(validityDate - todayDate);
//     const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
//     return diffMonths - 1;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleDurationChange = (event) => {
//     const { value } = event.target;
//     event.preventDefault();
//     event.stopPropagation();

//     const newDate = new Date();
//     const months = parseInt(value);
//     newDate.setMonth(newDate.getMonth() + months);
//     const formattedDate = newDate.toISOString().split('T')[0];
//     setFormData({ 
//       ...formData,
//       subscription_validity: formattedDate
//     });
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     const validTypes = ['image/jpeg', 'image/png'];
//     const maxSize = 300 * 1024; // 300 KB

//     if (file) {
//       if (!validTypes.includes(file.type)) {
//         showToast('danger', 'Only JPG and PNG images are allowed.');
//         e.target.value = ""; // Reset the file input
//         return;
//       }

//       if (file.size > maxSize) {
//         showToast('danger', 'File size must be under 300 KB.');
//         e.target.value = ""; // Reset the file input
//         return;
//       }

//       setFormData({
//         ...formData,
//         logo: file,
//       });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     Object.keys(formData).forEach((key) => {
//       if (!formData[key] && key !== 'logo') {
//         newErrors[key] = `${key.replace('_', ' ')} is required.`;
//       }
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const resetForm = () => {
//     setFormData({
//       clinic_name: '',
//       logo: '',
//       clinic_registration_no: '',
//       clinic_mobile: '',
//       clinic_address: '',
//       subscribed_plan: 1,
//       subscription_validity: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString().split('T')[0],
//       refer_by_id: logedInUserId,
//     });

//     if (logoInputRef.current) {
//       logoInputRef.current.value = '';
//     }
    
//     setPreparedData(null);
//   };

//   // Prepare form data by uploading files first
//   const prepareFormData = async () => {
//     try {
//       let finalData = {
//         ...formData,
//         logo: '', // Will be updated if a file is uploaded
//       };
    
//       // Handle logo upload if exists
//       if (formData.logo) {
//         try {
//           const logoData = new FormData();
//           logoData.append("file", formData.logo);
//           logoData.append("dest", "clinic");
//           const responseLogo = await postFormData('/api/fileUpload', logoData);
//           if (responseLogo && responseLogo.fileName) {
//             finalData.logo = responseLogo.fileName;
//           } else {
//             console.warn("Logo upload didn't return a filename");
//           }
//         } catch (logoError) {
//           console.error("Logo upload error:", logoError);
//           // Continue with clinic creation even if logo upload fails
//         }
//       }
      
//       return finalData;
//     } catch (error) {
//       showToast('danger', 'Error uploading files: ' + error);
//       console.error('Error uploading files:', error);
//       return null;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
    
//     try {
//       // Start payment process directly with form data
//       await handlePayment();
//     } catch (error) {
//       console.error('Error processing data:', error);
//       showToast('danger', 'Error occurred: ' + (error.message || 'Unknown error'));
//     }
//   };
  
//   const handlePayment = async () => {
//     try {
//       // First prepare data by uploading files
//       const preparedFormData = await prepareFormData();
//       if (!preparedFormData) {
//         showToast('danger', 'Failed to prepare form data');
//         return;
//       }
      
//       setPreparedData(preparedFormData);
      
//       const paymentData = {
//         amount: totalAmount(),
//       };

//       const data = await post("/api/create-order", paymentData);

//       if (data) {
//         const options = {
//           key: data.key,
//           amount: data.order.amount,
//           currency: data.order.currency,
//           order_id: data.order.id,
//           name: "ClinicApp",
//           handler: async (response) => {
//             try {
//               console.log("Payment Response:", response);
              
//               // Verify payment first
//               const verifyResponse = await post("/api/verify-payment", {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//               });
//               console.log("Verify Response:", verifyResponse);
      
//               if (verifyResponse?.success) {
//                 // Payment successful, now create the clinic
//                 try {
//                   const clinicResponse = await post('/api/clinic', preparedFormData);
//                   console.log("Clinic creation response:", clinicResponse);
                  
//                   if (clinicResponse?.success && clinicResponse?.details?.clinic_id) {
//                     showToast('success', 'Clinic Registration Successful!');
                  
//                     // Prepare receipt data with the newly created clinic ID
//                     const receiptData = {
//                       clinic_id: clinicResponse.details.clinic_id,
//                       plan_id: preparedFormData.subscribed_plan,
//                       user_id: logedInUserId,
//                       total_amount: totalAmount(),
//                       valid_till: preparedFormData.subscription_validity,
//                       transaction_id: response.razorpay_payment_id,
//                       transaction_status: 'success',
//                     };
                    
//                     console.log("Receipt data to be sent:", receiptData);
                    
//                     try {
//                       // Send receipt data to the backend
//                       const receiptResponse = await post('/api/clinic-receipt', receiptData);
//                       console.log("Receipt creation response:", receiptResponse);
                  
//                       if (receiptResponse?.success) {
//                         showToast('success', 'Payment Successful and Receipt Saved!');
                        
//                         // Prepare data for PDF
//                         let pdfData = receiptResponse.data[0];
//                         if (pdfData) {
//                           // Ensure all required fields are available for PDF generation
//                           const receiptPdfData = {
//                             receipt_id: pdfData.id || receiptResponse.id || 'N/A',
//                             payable_amount: totalAmount(),
//                             total_amount: totalAmount() - getGSTAmount(),
//                             gst: getGSTAmount(),
//                             clinic_name: preparedFormData.clinic_name,
//                             clinic_address: preparedFormData.clinic_address,
//                             clinic_mobile: preparedFormData.clinic_mobile,
//                             transaction_id: response.razorpay_payment_id,
//                             transaction_date: new Date().toISOString().split('T')[0],
//                             plan_name: refData.plans.find(p => p.id == preparedFormData.subscribed_plan)?.name || 'Standard Plan',
//                             valid_till: preparedFormData.subscription_validity,
//                             transaction_status: 'success'
//                           };
                          
//                           // Add a small delay to ensure receipt data is processed
//                           setTimeout(() => {
//                             try {
//                               // Call the PDF generation function with the prepared data
//                               const pdfResult = generateClinicReceiptPDF(receiptPdfData);
//                               if (pdfResult) {
//                                 console.log("Receipt PDF generated successfully");
//                               } else {
//                                 console.error("PDF generation returned false");
//                                 showToast('info', 'Could not download receipt PDF, but receipt data was saved.');
//                               }
//                             } catch (pdfError) {
//                               console.error("Error generating PDF:", pdfError);
//                               showToast('info', 'Could not download receipt PDF, but receipt data was saved.');
//                             }
//                           }, 500);
//                         } else {
//                           console.error("PDF data is missing in the response");
//                           showToast('info', 'Receipt data was saved, but PDF could not be generated due to missing data.');
//                         }
//                       } else {
//                         showToast('info', 'Clinic registered, payment successful, but there was an issue saving the receipt.');
//                       }
//                     } catch (receiptError) {
//                       console.error("Receipt creation error:", receiptError);
//                       showToast('info', 'Clinic registered, but there was an issue saving the receipt.');
//                     }
//                   } else {
//                     showToast('danger', 'Payment was successful but clinic registration failed.');
//                     // Record in clinic_receipt table with failure status - CLINIC_ID IS NOW OPTIONAL
//                     const receiptData = {
//                       // No clinic_id since registration failed
//                       plan_id: preparedFormData.subscribed_plan,
//                       user_id: logedInUserId,
//                       total_amount: totalAmount(),
//                       valid_till: preparedFormData.subscription_validity,
//                       transaction_id: response.razorpay_payment_id,
//                       transaction_status: 'payment_success_registration_failed',
//                     };
//                     await post('/api/clinic-receipt', receiptData);
//                   }
//                 } catch (clinicError) {
//                   console.error("Clinic creation error:", clinicError);
//                   showToast('danger', 'Payment was successful but clinic registration failed: ' + clinicError);
//                   // Log the error in clinic_receipt table - CLINIC_ID IS NOW OPTIONAL
//                   const receiptData = {
//                     // No clinic_id since registration failed
//                     plan_id: preparedFormData.subscribed_plan,
//                     user_id: logedInUserId,
//                     total_amount: totalAmount(),
//                     valid_till: preparedFormData.subscription_validity,
//                     transaction_id: response.razorpay_payment_id,
//                     transaction_status: 'payment_success_registration_error',
//                   };
//                   await post('/api/clinic-receipt', receiptData);
//                 }
//               } else {
//                 console.error("Payment verification failed:", verifyResponse);
//                 showToast('danger', 'Payment verification failed');
//                 // Record verification failure in clinic_receipt table - CLINIC_ID IS NOW OPTIONAL
//                 const receiptData = {
//                   // No clinic_id since verification failed
//                   plan_id: preparedFormData.subscribed_plan,
//                   user_id: logedInUserId,
//                   total_amount: totalAmount(),
//                   valid_till: preparedFormData.subscription_validity,
//                   transaction_id: response.razorpay_payment_id || 'NA',
//                   transaction_status: 'Payment gateway verification failed',
//                 };
//                 await post('/api/clinic-receipt', receiptData);
//               }
//             } catch (handlerError) {
//               console.error("Handler error:", handlerError);
//               showToast('danger', 'Error processing payment confirmation: ' + handlerError.message);
//             } finally {
//               resetForm();
//             }
//           },
//           prefill: {
//             name: preparedFormData.clinic_name,
//             contact: preparedFormData.clinic_mobile
//           },
//           theme: {
//             color: "#3399cc",
//           },
//         };

//         const razorpay = new window.Razorpay(options);
//         razorpay.open();

//         razorpay.on("payment.failed", async (response) => {
//           console.error("Payment Failed:", response.error);
//           // Record failed payment in clinic_receipt table - CLINIC_ID IS NOW OPTIONAL
//           const receiptData = {
//             // No clinic_id since payment failed
//             plan_id: preparedFormData.subscribed_plan,
//             user_id: logedInUserId,
//             total_amount: totalAmount(),
//             valid_till: preparedFormData.subscription_validity,
//             transaction_id: response.error?.metadata?.payment_id ?? 'txn_id_is_missing',
//             transaction_status: response.error?.description ?? 'Failed',
//           };
//           await post('/api/clinic-receipt', receiptData);
//           showToast('danger', 'Payment failed: ' + (response.error?.description || 'Unknown error'));
//         });
//       } else {
//         showToast('danger', 'Technical issue with payment gateway');
//         // Record error in clinic_receipt table - CLINIC_ID IS NOW OPTIONAL
//         const receiptData = {
//           // No clinic_id since order creation failed
//           plan_id: preparedFormData.subscribed_plan,
//           user_id: logedInUserId,
//           total_amount: totalAmount(),
//           valid_till: preparedFormData.subscription_validity,
//           transaction_id: 'NA',
//           transaction_status: 'Failed to create Razorpay order',
//         };
//         await post('/api/clinic-receipt', receiptData);
//         resetForm();
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       showToast('danger', 'Something went wrong with payment');
//       // Record error in clinic_receipt table - CLINIC_ID IS NOW OPTIONAL
//       try {
//         const receiptData = {
//           // No clinic_id since payment system error
//           plan_id: formData.subscribed_plan,
//           user_id: logedInUserId,
//           total_amount: totalAmount(),
//           valid_till: formData.subscription_validity,
//           transaction_id: 'NA',
//           transaction_status: 'Payment system error: ' + error.message,
//         };
//         await post('/api/clinic-receipt', receiptData);
//       } catch (e) {
//         console.error("Failed to record payment error:", e);
//       }
//     }
//   };

//   return (
//     <CContainer>
//       <CRow className="mt-2">
//         <CCol md={12} lg={12} xl={12}>
//           <CCard className="mx-4">
//             <CCardBody className="p-4">
//               <CForm onSubmit={handleSubmit} validated={validated}>
//                 <h3 className='text-center'>Clinic Registration</h3><br/>

//                 {/* Clinic Name */}
//                 <CFormLabel htmlFor="clinic_name">Clinic Name</CFormLabel>
//                 <CFormInput
//                   id="clinic_name"
//                   name="clinic_name"
//                   placeholder="Enter Clinic Name"
//                   value={formData.clinic_name}
//                   onChange={handleChange}
//                   className="mb-3"
//                   required
//                 />
//                 {errors.clinic_name && <div className="text-danger">{errors.clinic_name}</div>}

//                 {/* Clinic Registration No */}
//                 <CFormLabel htmlFor="clinic_registration_no">Clinic Registration No</CFormLabel>
//                 <CFormInput
//                   id="clinic_registration_no"
//                   name="clinic_registration_no"
//                   placeholder="Enter Registration Number"
//                   value={formData.clinic_registration_no}
//                   onChange={handleChange}
//                   className="mb-3"
//                   required
//                 />
//                 {errors.clinic_registration_no && <div className="text-danger">{errors.clinic_registration_no}</div>}

//                 {/* Clinic Mobile */}
//                 <CFormLabel htmlFor="clinic_mobile">Clinic Mobile</CFormLabel>
//                 <CFormInput
//                   type='number'
//                   id="clinic_mobile"
//                   name="clinic_mobile"
//                   placeholder="Enter Clinic Mobile"
//                   value={formData.clinic_mobile}
//                   onChange={handleChange}
//                   className="mb-3"
//                   required
//                   onInput={(e) => {
//                     if (e.target.value.length > 10) {
//                       e.target.value = e.target.value.slice(0, 10); // Limit to 10 digits
//                     }
//                   }}
//                 />
//                 {errors.clinic_mobile && <div className="text-danger">{errors.clinic_mobile}</div>}

//                 {/* Clinic Address */}
//                 <CFormLabel htmlFor="clinic_address">Clinic Address</CFormLabel>
//                 <CFormInput
//                   id="clinic_address"
//                   name="clinic_address"
//                   placeholder="Enter Clinic Address"
//                   value={formData.clinic_address}
//                   onChange={handleChange}
//                   className="mb-3"
//                   required
//                 />
//                 {errors.clinic_address && <div className="text-danger">{errors.clinic_address}</div>}

//                 {/* Logo Upload */}
//                 <CFormLabel htmlFor="logo">Upload Clinic Logo</CFormLabel>
//                 <CFormInput
//                   type="file"
//                   id="logo"
//                   name="logo"
//                   onChange={handleImageUpload}
//                   className="mb-3"
//                   ref={logoInputRef}
//                 />
//                 {errors.logo && <div className="text-danger">{errors.logo}</div>}

//                 {/* Subscription Plan */}
//                 <CFormLabel htmlFor="subscribed_plan">Subscription Plan</CFormLabel>
//                 <CFormSelect
//                   aria-label="Select Plan"
//                   value={formData.subscribed_plan}
//                   id="subscribed_plan"
//                   name="subscribed_plan"
//                   options={refData.plans.map(u => ({ value: u.id, label: u.name }))}
//                   onChange={handleChange}
//                   required
//                   className="mb-3"
//                 />
//                 {errors.subscribed_plan && <div className="text-danger">{errors.subscribed_plan}</div>}

//                 {/* Referred By */}
//                 {userType == 0 && (
//                   <>
//                     <CFormLabel htmlFor="refer_by_id">Referred By</CFormLabel>
//                     <CFormSelect
//                       aria-label="Select Referrer"
//                       value={formData.refer_by_id}
//                       id="refer_by_id"
//                       name="refer_by_id"
//                       options={
//                         user.type == 0 ? [
//                           {value: logedInUserId, label: 'Direct Onboarding'},
//                           ...refData.users.map(u => ({value: u.id, label: u.name}))
//                         ] : [
//                           ...refData.users.filter(r => r.id == logedInUserId).map(u => ({value: u.id, label: u.name}))
//                         ]
//                       }
//                       onChange={handleChange}
//                       required
//                       className="mb-3"
//                     />
//                     {errors.refer_by_id && <div className="text-danger">{errors.refer_by_id}</div>}
//                   </>
//                 )}

//                 {/* Plan Duration */}
//                 <CFormLabel htmlFor="duration">Plan Duration</CFormLabel>
//                 <CFormSelect
//                   aria-label="Select duration"
//                   options={durationOptions}
//                   onChange={handleDurationChange}
//                   required
//                   className="mb-3"
//                 />

//                 {/* Subscription Validity */}
//                 <CFormLabel htmlFor="subscription_validity">Subscription Validity</CFormLabel>
//                 <CFormInput
//                   type="date"
//                   id="subscription_validity"
//                   name="subscription_validity"
//                   value={formData.subscription_validity}
//                   onChange={handleChange}
//                   required
//                   readOnly
//                   className="mb-4"
//                 />

//                 {/* Payment Details */}
//                 <CAlert color="success" className="mb-4">
//                   <h4>Payment Details</h4>
//                   Amount (Per Month): {getAmount(formData.subscribed_plan)}<br/>
//                   Number of months: {getNumberOfMonths()}<br/>
//                   Total Amount: {totalAmount() - getGSTAmount()}<br/>
//                   GST (18%): {getGSTAmount()}<br/>
//                   <b>Final Payable Amount:</b> {totalAmount()}
//                 </CAlert>

//                 {/* Submit Button */}
//                 <CButton color="primary" type="submit">
//                   Register Clinic & Pay
//                 </CButton>
//               </CForm>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     </CContainer>
//   );
// }

// export default ClinicRegister;

import React, { useState, useEffect, useRef } from 'react';
import { 
  CButton, 
  CCard, 
  CCardBody, 
  CCol, 
  CContainer, 
  CForm, 
  CFormInput, 
  CFormLabel, 
  CFormSelect, 
  CRow,
  CAlert
} from '@coreui/react';
import { post, getAPICall, postFormData } from '../../../util/api';
import { useToast } from '../../notifications/toasts/ToastContext';
import { getUser } from '../../../util/session';
import { generateClinicReceiptPDF } from './ClinicPdf';

function ClinicRegister() {
  const today = new Date();
  const { showToast } = useToast();
  const user = getUser();
  const userType = user.type;
  const logedInUserId = user.id;
  const [preparedData, setPreparedData] = useState(null);
  
  const [formData, setFormData] = useState({
    clinic_name: '',
    logo: '',
    clinic_registration_no: '',
    clinic_mobile: '',
    clinic_address: '',
    subscribed_plan: 1,
    subscription_validity: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString().split('T')[0],
    refer_by_id: logedInUserId,
  });

  const [refData, setRefData] = useState({
    plans: [],
    users: []
  });

  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const logoInputRef = useRef(null);

  const durationOptions = [
    { label: 'Yearly', value: 12 },
    { label: 'Half Yearly', value: 6 }
  ];

  // Load Razorpay script
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => console.log("Razorpay script loaded");
      document.body.appendChild(script);
    }
  }, []);

  // Fetch reference data (plans, users)
  useEffect(() => {
    const fetchRefData = async () => {
      try {
        const response = await getAPICall('/api/detailsForClinic');
        if (response) {
          setRefData(response);
        } else {
          console.error('Failed to fetch reference data');
          showToast('danger', 'Failed to load clinic details');
        }
      } catch (error) {
        console.error('Error fetching reference data:', error);
        showToast('danger', 'Error loading clinic details');
      }
    };
    fetchRefData();
  }, []);

  const getAmount = (subscribed_plan) => {
    return refData.plans.find(p => p.id == subscribed_plan)?.price || 0;
  };

  const getGSTAmount = () => {
    // Calculate 18% of total
    return Math.ceil(totalAmount() * 0.18);
  };

  const totalAmount = () => {
    return getAmount(formData.subscribed_plan) * getNumberOfMonths();
  };

  const getNumberOfMonths = () => {
    // Calculate number of months from today till validity date
    const validityDate = new Date(formData.subscription_validity);
    const todayDate = new Date();
    const diffTime = Math.abs(validityDate - todayDate);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths - 1;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDurationChange = (event) => {
    const { value } = event.target;
    event.preventDefault();
    event.stopPropagation();

    const newDate = new Date();
    const months = parseInt(value);
    newDate.setMonth(newDate.getMonth() + months);
    const formattedDate = newDate.toISOString().split('T')[0];
    setFormData({ 
      ...formData,
      subscription_validity: formattedDate
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 300 * 1024; // 300 KB

    if (file) {
      if (!validTypes.includes(file.type)) {
        showToast('danger', 'Only JPG and PNG images are allowed.');
        e.target.value = ""; // Reset the file input
        return;
      }

      if (file.size > maxSize) {
        showToast('danger', 'File size must be under 300 KB.');
        e.target.value = ""; // Reset the file input
        return;
      }

      setFormData({
        ...formData,
        logo: file,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== 'logo') {
        newErrors[key] = `${key.replace('_', ' ')} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      clinic_name: '',
      logo: '',
      clinic_registration_no: '',
      clinic_mobile: '',
      clinic_address: '',
      subscribed_plan: 1,
      subscription_validity: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString().split('T')[0],
      refer_by_id: logedInUserId,
    });

    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
    
    setPreparedData(null);
  };

  // Prepare form data by uploading files first
  const prepareFormData = async () => {
    try {
      let finalData = {
        ...formData,
        logo: 'default-clinic-logo.png', // Set default logo filename
      };
    
      // Handle logo upload if exists
      if (formData.logo && typeof formData.logo === 'object') {
        try {
          const logoData = new FormData();
          logoData.append("file", formData.logo);
          logoData.append("dest", "clinic");
          const responseLogo = await postFormData('/api/fileUpload', logoData);
          if (responseLogo && responseLogo.fileName) {
            finalData.logo = responseLogo.fileName;
          } else {
            console.warn("Logo upload didn't return a filename, using default");
            finalData.logo = 'default-clinic-logo.png';
          }
        } catch (logoError) {
          console.error("Logo upload error:", logoError);
          // Continue with clinic creation with default logo
          finalData.logo = 'default-clinic-logo.png';
        }
      }
      
      return finalData;
    } catch (error) {
      showToast('danger', 'Error uploading files: ' + error);
      console.error('Error uploading files:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      // Start payment process directly with form data
      await handlePayment();
    } catch (error) {
      console.error('Error processing data:', error);
      showToast('danger', 'Error occurred: ' + (error.message || 'Unknown error'));
    }
  };
  
  const handlePayment = async () => {
    try {
      // First prepare data by uploading files
      const preparedFormData = await prepareFormData();
      if (!preparedFormData) {
        showToast('danger', 'Failed to prepare form data');
        return;
      }
      
      setPreparedData(preparedFormData);
      
      const paymentData = {
        amount: totalAmount(),
      };

      const data = await post("/api/create-order", paymentData);

      if (data) {
        const options = {
          key: data.key,
          amount: data.order.amount,
          currency: data.order.currency,
          order_id: data.order.id,
          name: "ClinicApp",
          handler: async (response) => {
            try {
              console.log("Payment Response:", response);
              
              // Verify payment first
              const verifyResponse = await post("/api/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              console.log("Verify Response:", verifyResponse);
      
              if (verifyResponse?.success) {
                // Payment successful, now create the clinic
                try {
                  console.log("Sending clinic data:", preparedFormData);
                  const clinicResponse = await post('/api/clinic', preparedFormData);
                  console.log("Clinic creation response:", clinicResponse);
                  
                  // FIXED: Check for clinic_id directly in the response
                  if (clinicResponse?.success && clinicResponse?.clinic_id) {
                    showToast('success', 'Clinic Registration Successful!');
                  
                    // Prepare receipt data with the newly created clinic ID
                    const receiptData = {
                      clinic_id: clinicResponse.clinic_id, // FIXED: Use clinic_id directly
                      plan_id: preparedFormData.subscribed_plan,
                      user_id: logedInUserId,
                      total_amount: totalAmount(),
                      valid_till: preparedFormData.subscription_validity,
                      transaction_id: response.razorpay_payment_id,
                      transaction_status: 'success',
                    };
                    
                    console.log("Receipt data to be sent:", receiptData);
                    
                    try {
                      // Send receipt data to the backend
                      const receiptResponse = await post('/api/clinic-receipt', receiptData);
                      console.log("Receipt creation response:", receiptResponse);
                  
                      if (receiptResponse?.success) {
                        showToast('success', 'Payment Successful and Receipt Saved!');
                        
                        // Prepare data for PDF
                        let pdfData = receiptResponse.data?.[0] || receiptResponse;
                        if (pdfData) {
                          // Ensure all required fields are available for PDF generation
                          const receiptPdfData = {
                            receipt_id: pdfData.id || receiptResponse.id || 'N/A',
                            payable_amount: totalAmount(),
                            total_amount: totalAmount() - getGSTAmount(),
                            gst: getGSTAmount(),
                            clinic_name: preparedFormData.clinic_name,
                            clinic_address: preparedFormData.clinic_address,
                            clinic_mobile: preparedFormData.clinic_mobile,
                            transaction_id: response.razorpay_payment_id,
                            transaction_date: new Date().toISOString().split('T')[0],
                            plan_name: refData.plans.find(p => p.id == preparedFormData.subscribed_plan)?.name || 'Standard Plan',
                            valid_till: preparedFormData.subscription_validity,
                            transaction_status: 'success'
                          };
                          
                          // Add a small delay to ensure receipt data is processed
                          setTimeout(() => {
                            try {
                              // Call the PDF generation function with the prepared data
                              const pdfResult = generateClinicReceiptPDF(receiptPdfData);
                              if (pdfResult) {
                                console.log("Receipt PDF generated successfully");
                              } else {
                                console.error("PDF generation returned false");
                                showToast('info', 'Could not download receipt PDF, but receipt data was saved.');
                              }
                            } catch (pdfError) {
                              console.error("Error generating PDF:", pdfError);
                              showToast('info', 'Could not download receipt PDF, but receipt data was saved.');
                            }
                          }, 500);
                        } else {
                          console.error("PDF data is missing in the response");
                          showToast('info', 'Receipt data was saved, but PDF could not be generated due to missing data.');
                        }
                      } else {
                        showToast('info', 'Clinic registered, payment successful, but there was an issue saving the receipt.');
                      }
                    } catch (receiptError) {
                      console.error("Receipt creation error:", receiptError);
                      showToast('info', 'Clinic registered, but there was an issue saving the receipt.');
                    }
                  } else {
                    // IMPROVED: Better error handling for clinic creation failure
                    console.error('Clinic creation failed:', clinicResponse);
                    const errorMessage = clinicResponse?.message || 'Unknown error occurred during clinic registration';
                    showToast('danger', `Payment was successful but clinic registration failed: ${errorMessage}`);
                    
                    // Record in clinic_receipt table with failure status
                    const receiptData = {
                      // No clinic_id since registration failed
                      plan_id: preparedFormData.subscribed_plan,
                      user_id: logedInUserId,
                      total_amount: totalAmount(),
                      valid_till: preparedFormData.subscription_validity,
                      transaction_id: response.razorpay_payment_id,
                      transaction_status: 'payment_success_registration_failed',
                    };
                    await post('/api/clinic-receipt', receiptData);
                  }
                } catch (clinicError) {
                  console.error("Clinic creation error:", clinicError);
                  showToast('danger', 'Payment was successful but clinic registration failed: ' + (clinicError.message || clinicError));
                  // Log the error in clinic_receipt table
                  const receiptData = {
                    // No clinic_id since registration failed
                    plan_id: preparedFormData.subscribed_plan,
                    user_id: logedInUserId,
                    total_amount: totalAmount(),
                    valid_till: preparedFormData.subscription_validity,
                    transaction_id: response.razorpay_payment_id,
                    transaction_status: 'payment_success_registration_error',
                  };
                  await post('/api/clinic-receipt', receiptData);
                }
              } else {
                console.error("Payment verification failed:", verifyResponse);
                showToast('danger', 'Payment verification failed');
                // Record verification failure in clinic_receipt table
                const receiptData = {
                  // No clinic_id since verification failed
                  plan_id: preparedFormData.subscribed_plan,
                  user_id: logedInUserId,
                  total_amount: totalAmount(),
                  valid_till: preparedFormData.subscription_validity,
                  transaction_id: response.razorpay_payment_id || 'NA',
                  transaction_status: 'Payment gateway verification failed',
                };
                await post('/api/clinic-receipt', receiptData);
              }
            } catch (handlerError) {
              console.error("Handler error:", handlerError);
              showToast('danger', 'Error processing payment confirmation: ' + handlerError.message);
            } finally {
              resetForm();
            }
          },
          prefill: {
            name: preparedFormData.clinic_name,
            contact: preparedFormData.clinic_mobile
          },
          theme: {
            color: "#3399cc",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

        razorpay.on("payment.failed", async (response) => {
          console.error("Payment Failed:", response.error);
          // Record failed payment in clinic_receipt table
          const receiptData = {
            // No clinic_id since payment failed
            plan_id: preparedFormData.subscribed_plan,
            user_id: logedInUserId,
            total_amount: totalAmount(),
            valid_till: preparedFormData.subscription_validity,
            transaction_id: response.error?.metadata?.payment_id ?? 'txn_id_is_missing',
            transaction_status: response.error?.description ?? 'Failed',
          };
          await post('/api/clinic-receipt', receiptData);
          showToast('danger', 'Payment failed: ' + (response.error?.description || 'Unknown error'));
        });
      } else {
        showToast('danger', 'Technical issue with payment gateway');
        // Record error in clinic_receipt table
        const receiptData = {
          // No clinic_id since order creation failed
          plan_id: preparedFormData.subscribed_plan,
          user_id: logedInUserId,
          total_amount: totalAmount(),
          valid_till: preparedFormData.subscription_validity,
          transaction_id: 'NA',
          transaction_status: 'Failed to create Razorpay order',
        };
        await post('/api/clinic-receipt', receiptData);
        resetForm();
      }
    } catch (error) {
      console.error("Error:", error);
      showToast('danger', 'Something went wrong with payment');
      // Record error in clinic_receipt table
      try {
        const receiptData = {
          // No clinic_id since payment system error
          plan_id: formData.subscribed_plan,
          user_id: logedInUserId,
          total_amount: totalAmount(),
          valid_till: formData.subscription_validity,
          transaction_id: 'NA',
          transaction_status: 'Payment system error: ' + (error.message || error),
        };
        await post('/api/clinic-receipt', receiptData);
      } catch (e) {
        console.error("Failed to record payment error:", e);
      }
    }
  };

  return (
    <CContainer>
      <CRow className="mt-2">
        <CCol md={12} lg={12} xl={12}>
          <CCard className="">
            <CCardBody className="">
              <CForm onSubmit={handleSubmit} validated={validated}>
                <h3 className='text-center'>Clinic Registration</h3><br/>

                {/* Clinic Name */}
                <CFormLabel htmlFor="clinic_name">Clinic Name</CFormLabel>
                <CFormInput
                  id="clinic_name"
                  name="clinic_name"
                  placeholder="Enter Clinic Name"
                  value={formData.clinic_name}
                  onChange={handleChange}
                  className="mb-3"
                  required
                />
                {errors.clinic_name && <div className="text-danger">{errors.clinic_name}</div>}

                {/* Clinic Registration No */}
                <CFormLabel htmlFor="clinic_registration_no">Clinic Registration No</CFormLabel>
                <CFormInput
                  id="clinic_registration_no"
                  name="clinic_registration_no"
                  placeholder="Enter Registration Number"
                  value={formData.clinic_registration_no}
                  onChange={handleChange}
                  className="mb-3"
                  required
                />
                {errors.clinic_registration_no && <div className="text-danger">{errors.clinic_registration_no}</div>}

                {/* Clinic Mobile */}
                <CFormLabel htmlFor="clinic_mobile">Clinic Mobile</CFormLabel>
                <CFormInput
                  type='number'
                  id="clinic_mobile"
                  name="clinic_mobile"
                  placeholder="Enter Clinic Mobile"
                  value={formData.clinic_mobile}
                  onChange={handleChange}
                  className="mb-3"
                  required
                  onInput={(e) => {
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.slice(0, 10); // Limit to 10 digits
                    }
                  }}
                />
                {errors.clinic_mobile && <div className="text-danger">{errors.clinic_mobile}</div>}

                {/* Clinic Address */}
                <CFormLabel htmlFor="clinic_address">Clinic Address</CFormLabel>
                <CFormInput
                  id="clinic_address"
                  name="clinic_address"
                  placeholder="Enter Clinic Address"
                  value={formData.clinic_address}
                  onChange={handleChange}
                  className="mb-3"
                  required
                />
                {errors.clinic_address && <div className="text-danger">{errors.clinic_address}</div>}

                {/* Logo Upload */}
                <CFormLabel htmlFor="logo">Upload Clinic Logo (Optional)</CFormLabel>
                <CFormInput
                  type="file"
                  id="logo"
                  name="logo"
                  onChange={handleImageUpload}
                  className="mb-3"
                  ref={logoInputRef}
                />
                {errors.logo && <div className="text-danger">{errors.logo}</div>}

                {/* Subscription Plan */}
                <CFormLabel htmlFor="subscribed_plan">Subscription Plan</CFormLabel>
                <CFormSelect
                  aria-label="Select Plan"
                  value={formData.subscribed_plan}
                  id="subscribed_plan"
                  name="subscribed_plan"
                  options={refData.plans.map(u => ({ value: u.id, label: u.name }))}
                  onChange={handleChange}
                  required
                  className="mb-3"
                />
                {errors.subscribed_plan && <div className="text-danger">{errors.subscribed_plan}</div>}

                {/* Referred By */}
                {userType == 0 && (
                  <>
                    <CFormLabel htmlFor="refer_by_id">Referred By</CFormLabel>
                    <CFormSelect
                      aria-label="Select Referrer"
                      value={formData.refer_by_id}
                      id="refer_by_id"
                      name="refer_by_id"
                      options={
                        user.type == 0 ? [
                          {value: logedInUserId, label: 'Direct Onboarding'},
                          ...refData.users.map(u => ({value: u.id, label: u.name}))
                        ] : [
                          ...refData.users.filter(r => r.id == logedInUserId).map(u => ({value: u.id, label: u.name}))
                        ]
                      }
                      onChange={handleChange}
                      required
                      className="mb-3"
                    />
                    {errors.refer_by_id && <div className="text-danger">{errors.refer_by_id}</div>}
                  </>
                )}

                {/* Plan Duration */}
                <CFormLabel htmlFor="duration">Plan Duration</CFormLabel>
                <CFormSelect
                  aria-label="Select duration"
                  options={durationOptions}
                  onChange={handleDurationChange}
                  required
                  className="mb-3"
                />

                {/* Subscription Validity */}
                <CFormLabel htmlFor="subscription_validity">Subscription Validity</CFormLabel>
                <CFormInput
                  type="date"
                  id="subscription_validity"
                  name="subscription_validity"
                  value={formData.subscription_validity}
                  onChange={handleChange}
                  required
                  readOnly
                  className="mb-4"
                />

                {/* Payment Details */}
                <CAlert color="success" className="mb-4">
                  <h4>Payment Details</h4>
                  Amount (Per Month): {getAmount(formData.subscribed_plan)}<br/>
                  Number of months: {getNumberOfMonths()}<br/>
                  Total Amount: {totalAmount() - getGSTAmount()}<br/>
                  GST (18%): {getGSTAmount()}<br/>
                  <b>Final Payable Amount:</b> {totalAmount()}
                </CAlert>

                {/* Submit Button */}
                <CButton color="primary" type="submit">
                  Register Clinic & Pay
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default ClinicRegister;