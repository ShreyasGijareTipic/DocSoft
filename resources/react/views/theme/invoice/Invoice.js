import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CContainer } from '@coreui/react';
import { generatePDF } from './invoicePDF';
import { getAPICall, post, postFormData } from '../../../util/api';
import { useParams, useLocation } from 'react-router-dom';
import { useToast } from '../../common/toast/ToastContext';

const inv = () => {
  const location = useLocation();
  const { billId , billIds} = location.state || {};
  const param = useParams();
  const { showToast } = useToast();
  console.log(billIds);
  
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [totalAmountWords, setTotalAmountWords] = useState('');
  const [grandTotal, setGrandTotal] = useState(0);
  const [formData, setFormData] = useState({});
  const [descriptions, setDescriptions] = useState([]);
  const [doctorData, setDoctorData] = useState({});
  const [file, setFile] = useState(null); // State to hold the file
  const fileInputRef = useRef(null); // Ref for triggering file input programmatically
  const [clinicData, setClinicData] = useState(null);
  const [healthDirectives, setHealthDirectives] = useState([]);
  const [PatientExaminations, setpatientexaminations] = useState([]);
  console.log("Patientexaminations", PatientExaminations);
  
  // Trigger file input dialog
  // const handleFileInputClick = () => {
  //   handleDownload();
  //   fileInputRef.current.click(); // Triggers the file input click
  // };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // Get selected file
    if (selectedFile) {
     // handleDownload(); // Download the bill after file selection
      setFile(selectedFile); // Set selected file to state
      handleSendWhatsApp(selectedFile); // Immediately send the bill to WhatsApp after file selection
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await getAPICall(`/api/bill/${billId ?? billIds}`);
      setFormData(response);
      const finalAmount = Math.round(response.finalAmount);
      const remaining = finalAmount - response.paidAmount;
      setRemainingAmount(Math.max(0, remaining));

      const doctorResponse = await getAPICall(`/api/users/${response.doctor_id}`);
      setDoctorData(doctorResponse);
      console.log("doctorResponse",doctorResponse.clinic_id);

      if (doctorResponse && doctorResponse.clinic_id) {
        const clinicResponse = await getAPICall(`/api/clinic/${doctorResponse.clinic_id}`);
        setClinicData(clinicResponse);
        // console.log(clinicResponse.logo);
      }
      
      setGrandTotal(finalAmount);
      setTotalAmountWords(numberToWords(finalAmount));
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  const fetchDescriptions = async () => {
    try {
      const response = await getAPICall(`/api/descriptions/${billId ?? billIds}`);
      setDescriptions(response);
    } catch (error) {
      console.error('Error fetching description data:', error);
    }
  };

  // Fetch Health Directives
  const fetchHealthDirectives = async () => {
    try {
      const response = await getAPICall(`/api/healthdirectivesData/${billId ?? billIds}`);
      setHealthDirectives(Array.isArray(response) ? response : []); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching prescription data:", error);
      setHealthDirectives([]); // Prevent undefined errors
    }
  };

  // Fetch Patient Examinations
  const fetchPatientExaminations = async () => {
    try {
      const response = await getAPICall(`/api/patientexaminationsData/${billId ?? billIds}`);
      setpatientexaminations(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching patientexaminationsData data:', error);
      setpatientexaminations([]);
    }
  };

  useEffect(() => {
    let count = 0; // Counter to track iterations

    const interval = setInterval(() => {
      if (count >= 2) {
        clearInterval(interval);
        console.log("Completed 2 iterations, stopping updates.");
        return;
      }

      fetchProduct();
      fetchDescriptions();
      fetchHealthDirectives();
      fetchPatientExaminations();

      count++; // Increment counter
    }, 100);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [billId]);

  const numberToWords = (number) => {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (number === 0) {
      return 'Zero';
    }

    let words = '';
    if (number >= 100000) {
      words += numberToWords(Math.floor(number / 1000)) + ' Lakh ';
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

  const handleDownload = () => {
    const totalAmount = descriptions.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    
    generatePDF(
      grandTotal || 0, 
      formData.id || "N/A", 
      formData.patient_name || "N/A", 
      formData || {}, 
      remainingAmount || 0, 
      totalAmountWords || "Zero", 
      descriptions || [], 
      doctorData || {}, 
      clinicData || {}, 
      healthDirectives || [],   
      PatientExaminations || [],
      billId,
      formData.DeliveryDate ||{},
      totalAmount
    );
  };

const handleShareWhatsApp = async () => {
  const billNumber = formData.id || billId;
  const totalAmount = descriptions.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);

  // Get the patient's phone number
  const patientPhone = formData.patient_contact;
  if (!patientPhone) {
    showToast('warning', 'Patient contact number is not available');
    return;
  }
  
  // Remove any non-numeric characters from phone number
  const formattedPhone = patientPhone.replace(/\D/g, '');

  try {
    console.log('Starting PDF generation for WhatsApp sharing...');
    
    // Validate required data before PDF generation
    if (!formData || !descriptions || descriptions.length === 0) {
      throw new Error('Missing required data for PDF generation');
    }

    // Generate PDF - Note: Pass all parameters properly
    const pdfResult = generatePDF(
      grandTotal || totalAmount || 0, 
      billNumber || "N/A", 
      formData.patient_name || "N/A", 
      formData, 
      remainingAmount || 0, 
      totalAmountWords || "Zero", 
      descriptions, 
      doctorData || {}, 
      clinicData || {}, 
      healthDirectives || [],   
      PatientExaminations || [],
      billId || billNumber,
      formData.visit_date || new Date().toISOString().split('T')[0], // Use visit_date instead of DeliveryDate
      totalAmount,
      true // isWhatsAppShare = true
    );

    // Check if PDF was generated successfully
    if (!pdfResult || !(pdfResult instanceof Blob)) {
      throw new Error('PDF generation failed - invalid blob returned');
    }

    // Verify blob has content
    if (pdfResult.size === 0) {
      throw new Error('PDF generation failed - empty file generated');
    }

    console.log('PDF generated successfully, size:', pdfResult.size, 'bytes');

    const fileName = `Bill-${billNumber}-${formData.patient_name?.replace(/[^a-zA-Z0-9]/g, '') || 'Patient'}.pdf`;
    
    // Method 1: Try Web Share API first (works best on mobile devices)
    if (navigator.share) {
      try {
        const file = new File([pdfResult], fileName, { 
          type: 'application/pdf',
          lastModified: Date.now()
        });
        
        const shareData = {
          title: `Medical Bill - ${formData.patient_name}`,
          text: `Medical Bill #${billNumber} for ${formData.patient_name}. Total Amount: Rs. ${totalAmount}`,
          files: [file]
        };

        // Check if sharing files is supported
        if (navigator.canShare && navigator.canShare(shareData)) {
          console.log('Using Web Share API...');
          await navigator.share(shareData);
          showToast('success', 'Bill shared successfully!');
          return;
        } else {
          console.log('Web Share API does not support file sharing on this device');
        }
      } catch (shareError) {
        console.log('Web Share API failed:', shareError);
        // Continue to fallback method
      }
    }

    // Method 2: Fallback - Create temporary download and open WhatsApp
    console.log('Using fallback method - temporary download and WhatsApp...');
    
    const url = URL.createObjectURL(pdfResult);
    
    // Create WhatsApp message
    const message = encodeURIComponent(
      `Hello ${formData.patient_name}!\n\n` +
      `Here is your medical bill:\n` +
      `📄 Bill Number: ${billNumber}\n` +
      `💰 Total Amount: Rs. ${totalAmount}\n` +
      `📅 Date: ${formData.visit_date}\n\n` +
      `Please find the attached PDF file.\n\n` +
      `Thank you!`
    );

    // Create a temporary download link (won't trigger download in most browsers unless clicked by user)
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.style.display = 'none';
    
    // Only append to DOM temporarily for WhatsApp sharing context
    document.body.appendChild(downloadLink);
    
    // Open WhatsApp directly without forcing download
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
    console.log('Opening WhatsApp:', whatsappUrl);
    window.open(whatsappUrl, '_blank');
    
    // Clean up immediately since we're not downloading
    setTimeout(() => {
      if (document.body.contains(downloadLink)) {
        document.body.removeChild(downloadLink);
      }
      URL.revokeObjectURL(url);
      console.log('Cleanup completed');
    }, 1000);
    
    showToast('success', 'WhatsApp opened! You can share the bill directly from the chat.');
    
  } catch (error) {
    console.error('Error in WhatsApp sharing:', error);
    showToast('danger', 'Error generating PDF for WhatsApp sharing: ' + error.message);
    
    // Fallback to alternative method if main method fails
    try {
      console.log('Attempting fallback to alternative WhatsApp method...');
      await handleShareWhatsAppAlternative();
    } catch (fallbackError) {
      console.error('All WhatsApp sharing methods failed:', fallbackError);
      showToast('danger', 'Unable to share via WhatsApp. Please try the download option instead.');
    }
  }
};

// Also, remove the handleDownload call from handleFileInputClick
const handleFileInputClick = () => {
  // Removed handleDownload() call - no need to download when just opening file picker
  fileInputRef.current.click(); // Triggers the file input click
};

  const handleSendWhatsApp = async (selectedFile) => {
    if (!selectedFile) {
      alert("Please upload the bill file!");
      return;
    }

    const formDataToSend = new FormData();
    
    // Append the phone number and the selected file
    formDataToSend.append("phone_number", formData.patient_contact); 
    formDataToSend.append("bill_file", selectedFile); // Attach the PDF file
    
    try {
      const response = await postFormData("/api/sendBill", formDataToSend);
      console.log("WhatsApp message sent successfully!", response.data);
      showToast('success', 'Bill sent via WhatsApp successfully!');
    } catch (error) {
      if (error.response) {
        console.error("Server Error Response:", error.response.data); // Backend error
        showToast('danger', 'Error sending WhatsApp: ' + error.response.data.message);
      } else {
        console.error("Error sending WhatsApp:", error.message); // Network or client error
        showToast('danger', 'Error sending WhatsApp: ' + error.message);
      }
    }
  };

  // Function to check if the field has data
  const hasData = (field) => field && field !== "N/A" && field !== "";

  // Get the observation fields that have data
  const getObservationFields = () => {
    if (!PatientExaminations || PatientExaminations.length === 0) return [];
    
    const observation = PatientExaminations[0];
    const fields = [];
    
    if (hasData(observation?.bp)) fields.push({ name: "BP", value: observation.bp });
    if (hasData(observation?.pulse)) fields.push({ name: "Pulse", value: observation.pulse });
    if (hasData(observation?.height)) fields.push({ name: "Height", value: observation.height });
    if (hasData(observation?.weight)) fields.push({ name: "Weight", value: observation.weight });
    if (hasData(observation?.past_history)) fields.push({ name: "Past History", value: observation.past_history });
    if (hasData(observation?.complaints)) fields.push({ name: "Complaints", value: observation.complaints });
    if (hasData(observation?.systemic_exam_general)) fields.push({ name: "Systemic Examination", value: observation.systemic_exam_general });
    if (hasData(observation?.systemic_exam_pa)) fields.push({ name: "Diagnosis", value: observation.systemic_exam_pa });
    
    return fields;
  };

  // Check if prescriptions have data for specific columns
  const hasPrescriptionData = (column) => {
    return healthDirectives.some(item => hasData(item[column]));
  };

  // Get prescription columns that have data
  const getPrescriptionColumns = () => {
    const columns = [
      { id: 'medicine', label: 'Medicine' },
      { id: 'strength', label: 'Strength' },
      { id: 'dosage', label: 'Dosage' },
      { id: 'timing', label: 'Timing' },
      { id: 'frequency', label: 'Frequency' },
      { id: 'duration', label: 'Duration' }
    ];
    
    return columns.filter(column => hasPrescriptionData(column.id));
  };

  const observationFields = getObservationFields();
  const prescriptionColumns = getPrescriptionColumns();

  return (
    <CCard className="mb-4">
      <CCardBody>
        <CContainer className="container-md invoice-content">
          {/* Clinic Header */}
          <div className="row align-items-center text-center text-md-start mb-4">
            <div className="col-12 col-md-3 text-center">
              <img src={clinicData?.logo} className="img-fluid" alt="Logo" style={{ maxWidth: '120px', height: 'auto' }} />
            </div>
            <div className="col-12 d-md-none"><hr /></div> {/* Break line for small screens */}

            <div className="col-12 col-md-6 text-center">
              <h1 className="h1">{clinicData?.clinic_name}</h1>
            </div>
            <div className="col-12 d-md-none"><hr /></div> {/* Break line for small screens */}

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
              <p><strong>Name:</strong> {formData.patient_name}</p>
              <p><strong>Address:</strong> {formData.patient_address}</p>
              <p><strong>Number:</strong> {formData.patient_contact}</p>
              <p><strong>Email Id:</strong> {formData.patient_email || 'N/A'}</p>
            </div>
            <div className="col-12 d-md-none"><hr /></div> {/* Break line for small screens */}
            
            {/* Center Divider (hidden on small screens) */}
            <div className="col-12 col-md-1 d-none d-md-flex justify-content-center">
              <div className="border-end border-2 h-100"></div>
            </div>
            <div className="col-12 d-md-none"><hr /></div> {/* Break line for small screens */}
            
            <div className="col-12 col-md-5">
              <h6 className="fw-bold">Doctor Details:</h6>
              <p><strong>Name: </strong> {doctorData.name}</p>
              <p><strong>Education: </strong>{doctorData.education}</p>
              <p><strong>Registration No.: </strong> {doctorData.registration_number}</p>
              <p><strong>Specialty: </strong> {doctorData.speciality}</p>
            </div>
          </div>
          <hr />
  
          {/* Invoice Details */}
          <div className="row mt-3 text-center text-md-start">
            <div className="col-12 col-md-6">
              <h6 className="fw-bold">Bill NO.: {billId}</h6>
              <p className="fw-bold"><strong>Date:</strong> {formData.visit_date}</p>
              {formData.InvoiceType === 2 && <p className="fw-bold"><strong>Delivery Date:</strong> {formData.DeliveryDate}</p>}
            </div>
          </div>
          <hr />
  
          {/* Patient Examination - Only Show if There's Data */}
          {observationFields.length > 0 && (
            <div className="row mt-3">
              <div className="col-12">
                <h6 className="fw-bold">Medical Observation:</h6>
                <div className="table-responsive">
                  <table className="table table-bordered text-center table-responsive-md">
                    <tbody>
                      {/* Create rows with exactly 2 fields (4 cells) per row for proper alignment */}
                      {Array(Math.ceil(observationFields.length / 2)).fill().map((_, rowIndex) => {
                        const rowFields = observationFields.slice(rowIndex * 2, rowIndex * 2 + 2);
                        // Fill remaining cells if we have an odd number of fields
                        while (rowFields.length < 2) {
                          rowFields.push({ name: "", value: "" });
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
  
          {/* Prescription Section - Only Show if There's Data */}
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
                            <td key={colIndex}>{item[column.id] || "N/A"}</td>
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
                        <td>{product.description}</td>
                        <td>{product.quantity}</td>
                        <td>{product.price}</td>
                        <td>{product.gst}</td>
                        <td>{product.total}</td>
                      </tr>
                    ))}
                    {/* Grand Total Row */}
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
          {/* Updated Footer Section with improved buttons */}
<div className="d-flex justify-content-center flex-wrap gap-2">
  <CButton color="success" onClick={handleDownload} className="me-2">
    Download PDF
  </CButton>
  
  {/* Primary WhatsApp Share Button */}
  <CButton 
    color="success" 
    style={{ backgroundColor: '#25D366', color: 'white', borderColor: '#25D366' }} 
    onClick={handleShareWhatsApp}
    className="me-2"
  >
    📱 Share on WhatsApp
  </CButton>
  
  {/* Alternative WhatsApp Share (via Backend)
  <CButton 
    color="info" 
    variant="outline"
    onClick={handleShareWhatsAppAlternative}
    className="me-2"
  >
    📤 Send via WhatsApp API
  </CButton> */}
  
  {/* Hidden file input - keep for backward compatibility if needed */}
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

export default inv;