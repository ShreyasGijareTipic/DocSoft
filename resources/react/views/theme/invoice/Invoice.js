import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CContainer } from '@coreui/react';
import { generatePDF } from './invoicePDF';
import { getAPICall, post, postFormData } from '../../../util/api';
import { useParams, useLocation } from 'react-router-dom';

const inv = () => {
  const location = useLocation();
  const { billId } = location.state || {};
  const param = useParams();

  const [remainingAmount, setRemainingAmount] = useState(0);
  const [totalAmountWords, setTotalAmountWords] = useState('');
  const [grandTotal, setGrandTotal] = useState(0);
  const [formData, setFormData] = useState({});
  const [descriptions, setDescriptions] = useState([]);
  const [doctorData, setDoctorData] = useState({});
  const [file, setFile] = useState(null); // State to hold the file
  const fileInputRef = useRef(null); // Ref for triggering file input programmatically
  const [clinicData, setClinicData] = useState(null);
  const [healthDirectives, setHealthDirectives] = useState({})
  const [PatientExaminations, setpatientexaminations] = useState({}); 
  console.log("Patientexaminations",PatientExaminations)
  

  // Trigger file input dialog
  const handleFileInputClick = () => {
    handleDownload();
    fileInputRef.current.click(); // Triggers the file input click
  };

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
      const response = await getAPICall(`/api/bill/${billId}`);
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
      const response = await getAPICall(`/api/descriptions/${billId}`);
      setDescriptions(response);
    } catch (error) {
      console.error('Error fetching description data:', error);
    }
  };

  // ------------------------------------------------------------------------------------------------- 

  // Fetch Health Directives

  const fetchHealthDirectives = async () => {
    try {
        const response = await getAPICall(`/api/healthdirectivesData/${billId}`);
        setHealthDirectives(Array.isArray(response) ? response : []); // ✅ Ensure it's an array
    } catch (error) {
        console.error("Error fetching prescription data:", error);
        setHealthDirectives([]); // ✅ Prevent undefined errors
    }
};


  // Fetch Patient Examinations 

  const fetchPatientExaminations = async () => {
    try {
      const response = await getAPICall(`/api/patientexaminationsData/${billId}`);
      setpatientexaminations(response);
    } catch (error) {
      console.error('Error fetching patientexaminationsData data:', error);
    }
  };


 // --------------------------------------------------------------------------------------------------- 

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
    } catch (error) {
      if (error.response) {
        console.error("Server Error Response:", error.response.data); // Backend error
      } else {
        console.error("Error sending WhatsApp:", error.message); // Network or client error
      }
    }
  };

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
            
            <div className="col-12 col-md-5 text-md-end">
              <h6 className="fw-bold">Doctor Details:</h6>
              <p><strong>Name:</strong> {doctorData.name}</p>
              <p><strong>Education:</strong>{doctorData.education}</p>
              <p><strong>Registration No.:</strong> {doctorData.registration_number}</p>
              <p><strong>Specialty:</strong> {doctorData.speciality}</p>
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
  
          {/* Patient Examination */}
          <div className="row mt-3">
            <div className="col-12">
            {PatientExaminations.length > 0 ? (
  <>
    <h6 className="fw-bold">Medical Observation:</h6>
    <div className="table-responsive">
      <table className="table table-bordered text-center table-responsive-md">
        <tbody>
          <tr>
            <td><strong>BP</strong></td>
            <td>{PatientExaminations[0]?.bp || "N/A"}</td>
            <td><strong>Pulse</strong></td>
            <td>{PatientExaminations[0]?.pulse || "N/A"}</td>
          </tr>
          <tr>
            <td><strong>Past History</strong></td>
            <td>{PatientExaminations[0]?.past_history || "N/A"}</td>
            <td><strong>Complaints</strong></td>
            <td>{PatientExaminations[0]?.complaints || "N/A"}</td>
          </tr>

          <tr>
                        <td><strong>Systemic Examination</strong></td>
                        <td>{PatientExaminations[0].systemic_exam_general || "N/A"}</td>
                        <td><strong>Diagnosis</strong></td>
                        <td>{PatientExaminations[0].systemic_exam_pa || "N/A"}</td>
                      </tr>
        </tbody>
      </table>
    </div>
  </>
) : (
  <p className="text-center">No patient examination data available</p>
)}

            </div>
          </div>
          <hr />
  
          {/* Prescription Section */}
          <div className="row">
            <div className="col-12">
              <h6 className="fw-bold">Prescription :</h6>
              <div className="table-responsive">
                <table className="table table-bordered border-black table-responsive-md">
                  <thead className="table-success">
                    <tr>
                      <th>Sr No</th>
                      <th>Medicine</th>
                      <th>Strength</th>
                      <th>Dosage</th>
                      <th>Timing</th>
                      <th>Frequency</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {healthDirectives.length > 0 ? (
                      healthDirectives.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.medicine}</td>
                          <td>{item.strength}</td>
                          <td>{item.dosage}</td>
                          <td>{item.timing}</td>
                          <td>{item.frequency}</td>
                          <td>{item.duration}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="7" className="text-center">No prescriptions available.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <hr />

          {/* Billing Section */}
<div className="row mt-3">
  <div className="col-12">
    <h6 className="fw-bold">Bill :</h6>
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
          <div className="d-flex justify-content-center">
            <CButton color="success" onClick={handleDownload}>Download</CButton>&nbsp;&nbsp;
            {/* <CButton color="success" onClick={handleFileInputClick}>Send Bill on WhatsApp</CButton> */}
          </div>
        </CContainer>
      </CCardBody>
    </CCard>
  );
};  

export default inv;
