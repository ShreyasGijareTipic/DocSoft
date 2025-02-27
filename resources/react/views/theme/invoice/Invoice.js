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
      setHealthDirectives(response);
    } catch (error) {
      console.error('Error fetching description data:', error);
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
    fetchProduct();
    fetchDescriptions();
    fetchHealthDirectives();
    fetchPatientExaminations();
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
    generatePDF(grandTotal, formData.id, formData.patient_name, formData, remainingAmount, totalAmountWords, formData.bills, descriptions, doctorData, clinicData);
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <img src={clinicData?.logo} width="150" height="150" alt="Logo" />
            </div>
            <div className="text-center">
              <h1>{clinicData?.clinic_name}</h1>
            </div>
            <div className="text-right">
              <h6 style={{ fontWeight: 'bold' }}>Clinic Registration No.: {clinicData?.clinic_registration_no}</h6>
              <p style={{ fontWeight: 'bold' }}>Clinic Address: {clinicData?.clinic_address}</p>
              <p style={{ fontWeight: 'bold' }}>Clinic Contact No: {clinicData?.clinic_mobile}</p>
            </div>
          </div>
          <hr/>
  {/* Patient & Doctor Details */}
<div className="row mt-3">
  {/* Patient Details - Left */}
  <div className="col-md-5 text-md-start">
    <h6 className="fw-bold">Bills To:</h6>
    <p><strong>Name:</strong> {formData.patient_name}</p>
    <p><strong>Address:</strong> {formData.patient_address}</p>
    <p><strong>Number:</strong> {formData.patient_contact}</p>
    <p><strong>Email Id:</strong> {formData.patient_email}</p>
  </div>

  {/* Center Divider */}
  <div className="col-md-1 d-flex justify-content-center">
    <div className="border-end border-2 h-100"></div>
  </div>

  {/* Doctor Details - Right */}
  <div className="col-md-5 text-right">
    <h6 className="fw-bold">Doctor Details:</h6>
    <p><strong>Name:</strong> {doctorData.name} ({doctorData.education})</p>
    <p><strong>Registration No.:</strong> {doctorData.registration_number}</p>
    <p><strong>Specialty:</strong> {doctorData.speciality}</p>
  </div>
</div>
<hr/>

  
          {/* Invoice Details */}
          <div className="row mt-3">
            <div className="col-6">
              <h6 style={{ fontWeight: 'bold' }}>Bill NO.: {billId}</h6>
              <p style={{ fontWeight: 'bold' }}><strong style={{ fontWeight: 'bold' }}>Date:</strong> {formData.visit_date}</p>
              {formData.InvoiceType === 2 && <p><strong style={{ fontWeight: 'bold' }}>Delivery Date:</strong> {formData.DeliveryDate}</p>}
            </div>
          </div>
  
          <hr />
  
          {/* Patient Examination */}
          <div className="row mt-3">
            <div className="col-12">
              {PatientExaminations.length > 0 ? (
                <>
                  <h6><strong>Medical Observation:</strong></h6>
                  <table className="table table-bordered text-center">
                    <tbody>
                      <tr>
                        <td><strong>BP</strong></td>
                        <td>{PatientExaminations[0].bp || "N/A"}</td>
                        <td><strong>Pulse</strong></td>
                        <td>{PatientExaminations[0].pulse || "N/A"}</td>
                      </tr>
                      <tr>
                        <td><strong>Past History</strong></td>
                        <td>{PatientExaminations[0].past_history || "N/A"}</td>
                        <td><strong>Complaints</strong></td>
                        <td>{PatientExaminations[0].complaints || "N/A"}</td>
                      </tr>
                      <tr>
                        <td><strong>Systemic Examination</strong></td>
                        <td>{PatientExaminations[0].systemic_exam_general || "N/A"}</td>
                        <td><strong>Diagnosis</strong></td>
                        <td>{PatientExaminations[0].systemic_exam_pa || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              ) : (
                <p>No patient examination data available</p>
              )}
            </div>
          </div>
  
          <hr />
  
          {/* Prescription Section */}
          <div className="row">
            <div className="col-md-12">
              <h6><strong>Prescription :</strong></h6>
              <table className="table table-bordered border-black">
                <thead className='table-success border-black'>
                  <tr>
                    <th className='text-center'>Sr No</th>
                    <th className='text-center'>Medicine</th>
                    <th className='text-center'>Strength</th>
                    <th className='text-center'>Dosage</th>
                    <th className='text-center'>Timing</th>
                    <th className='text-center'>Frequency</th>
                    <th className='text-center'>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(healthDirectives) && healthDirectives.length > 0 ? (
                    healthDirectives.map((item, index) => (
                      <tr key={index}>
                        <td className='text-center'>{index + 1}</td>
                        <td className='text-center'>{item.medicine}</td>
                        <td className='text-center'>{item.strength}</td>
                        <td className='text-center'>{item.dosage}</td>
                        <td className='text-center'>{item.timing}</td>
                        <td className='text-center'>{item.frequency}</td>
                        <td className='text-center'>{item.duration}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="7" className="text-center">No prescriptions available.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
  
          <hr />
  
          {/* Billing Section */}
          <div className="row">
            <div className="col-md-12">
              <h6><strong>Bill :</strong></h6>
              <table className="table table-bordered border-black">
                <thead className='table-success border-black'>
                  <tr>
                    <th className='text-center'>Sr No</th>
                    <th className='text-center'>Description</th>
                    <th className='text-center'>Quantity</th>
                    <th className='text-center'>Price</th>
                    <th className='text-center'>GST</th>
                    <th className='text-center'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {descriptions.map((product, index) => (
                    <tr key={index}>
                      <td className='text-center'>{index + 1}</td>
                      <td className='text-center'>{product.description}</td>
                      <td className='text-center'>{product.quantity}</td>
                      <td className='text-center'>{product.price}</td>
                      <td className='text-center'>{product.gst}</td>
                      <td className='text-center'>{product.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
  
          <hr />
  
          {/* Footer */}
          <div className="d-flex justify-content-center">
            <CButton color="success" onClick={handleDownload}>Download</CButton>&nbsp;&nbsp;
            <CButton color="success" onClick={handleFileInputClick}>Send Bill on WhatsApp</CButton>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        </CContainer>
      </CCardBody>
    </CCard>
  );
  
};  

export default inv;
