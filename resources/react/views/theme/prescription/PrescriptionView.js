import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CContainer } from '@coreui/react';
import { generatePDF } from '../invoice/prescriptionPDF';
import { getAPICall, postFormData } from '../../../util/api';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const inv = () => {
  const location = useLocation();
  const { billId } = location.state || {};
  const param = useParams();

  const [remainingAmount, setRemainingAmount] = useState(0);
  const [totalAmountWords, setTotalAmountWords] = useState('');
  const [grandTotal, setGrandTotal] = useState(0);
  const [formDataa, setFormData] = useState({});
  const [descriptions, setDescriptions] = useState([]);
  const [doctorData, setDoctorData] = useState({});
  const [file, setFile] = useState(null); // State to hold the file
  const fileInputRef = useRef(null); // Ref for triggering file input programmatically
    const [clinicData, setClinicData] = useState(null);
  

  const [patientExaminations , setPatientExaminations] = useState({});
console.log("vfsfsfsf",patientExaminations);


const navigate = useNavigate();

  // Trigger file input dialog
  const handleFileInputClick = () => {
    handleDownload();
    fileInputRef.current.click(); // Triggers the file input click
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // Get selected file
    if (selectedFile) {
      handleDownload(); // Download the bill after file selection
      setFile(selectedFile); // Set selected file to state
      handleSendWhatsApp(selectedFile); // Immediately send the bill to WhatsApp after file selection
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await getAPICall(`/api/PrescriptionPatientInfo/${billId}`);
      setFormData(response);
      const finalAmount = Math.round(response.finalAmount);
      const remaining = finalAmount - response.paidAmount;
      setRemainingAmount(Math.max(0, remaining));

      const doctorResponse = await getAPICall(`/api/users/${response.doctor_id}`);
      setDoctorData(doctorResponse);

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
      const response = await getAPICall(`/api/healthdirectives/p_p_i_id/${billId}`);
      setDescriptions(response);
      console.log("setDescriptions",response);
      
    } catch (error) {
      console.error('Error fetching description data:', error);
    }
  };



  const fetchpatientexaminations = async () => {
    try {
      const patient = await getAPICall(`/api/patientexaminations/p_p_i_id/${billId}`);
      setPatientExaminations(patient);
      console.log("Patient Examination data 1",patient);
      
    } catch (error) {
      console.error('Error fetching description data:', error);
    }
  };

  // console.log("Patient Examination data 2",patientExaminations);
  



  useEffect(() => {
    fetchProduct();
    fetchDescriptions();
    fetchpatientexaminations();
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
    generatePDF(grandTotal, formDataa.id, formDataa.patient_name, formDataa, remainingAmount, totalAmountWords, formDataa.bills, descriptions, doctorData, patientExaminations, clinicData);
    navigate('/Bills' , { state: { formDataa} });
  };

  const handleDownloadPDF = () =>{
    generatePDF(grandTotal, formDataa.id, formDataa.patient_name, formDataa, remainingAmount, totalAmountWords, formDataa.bills, descriptions, doctorData, patientExaminations, clinicData);

  }

  

  const handleSendWhatsApp = async (selectedFile) => {
    if (!selectedFile) {
      alert("Please upload the bill file!");
      return;
    }

    const formDataa = new FormData();
    formDataa.append("phone_number", `+91${formDataa.patient_contact}`); // Ensure correct format `+91${formData.patient_contact}`
    formDataa.append("bill_file", selectedFile); // Ensure `file` is a valid file object
    // formDataa.append("bill_file", file);
    formDataa.append("messaging_product", "whatsapp");

    try {
      const response = await postFormData("/api/sendBill", formDataa);
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
          <div className="row">
            <div className="col-4"></div>
            <div className="col-4"></div>
          </div>
          <div className="d-flex flex-row mb-3">
            <div className="flex-fill col-4">
              <img src={clinicData?.logo} width="150" height="150" alt="Logo" />
            </div>
            <div className="flex-fill col-5 mt-5">
              <h1>{clinicData?.clinic_name}</h1>
            </div>
            <div className="ml-3 pt-5 col-3">
              <h6 style={{ fontWeight: 'bold' }}>Doctor Details:</h6>
              <p style={{ fontWeight: 'bold' }}>Name: {doctorData.name} ({doctorData.education})</p>
              <p style={{ fontWeight: 'bold' }}>Registration No.: {doctorData.registration_number}</p>
              <p style={{ fontWeight: 'bold' }}>Specialty: {doctorData.speciality}</p>
              <p style={{ fontWeight: 'bold' }}>Address: {doctorData.address}</p>
              <p style={{ fontWeight: 'bold' }}>Contact No.: {doctorData.mobile}</p>
            </div>
          </div>





          <div className="row mt-10">
            <div className="flex-fill col-6">
              <div className="col-md-12">
                <h6 style={{ fontWeight: 'bold' }}>Prescription To:</h6>
                <p style={{ fontWeight: 'bold' }}>Name: {formDataa.patient_name}</p>
                <p style={{ fontWeight: 'bold' }}>Address: {formDataa.patient_address}</p>
                <p style={{ fontWeight: 'bold' }}>Number: {formDataa.patient_contact}</p>
                <p style={{ fontWeight: 'bold' }}>Email Id: {formDataa.patient_email}</p>
              </div>
            </div>
            <div className='col-2'></div>
            <div className='col-4'>
              <div className="flex-fill col-md-8">
                <h6 style={{ fontWeight: 'bold' }}>Prescription No.: {billId}</h6>
                <p style={{ fontWeight: 'bold' }}> Date: {formDataa.visit_date}</p>
                {formDataa.InvoiceType === 2 && <p style={{ fontWeight: 'bold' }}>Delivery Date: {formDataa.DeliveryDate}</p>}
              </div>
            </div>
          </div>
<hr></hr>


<div className="row mt-10">
  <div className="col-md-12">
    <div>
      {patientExaminations.length > 0 ? (
        <div>
          <h6 style={{ fontWeight: 'bold' }}>Medical Observation:</h6>
          <p><strong>BP:</strong> {patientExaminations[0].bp || "N/A"}</p>
          <p><strong>Pulse:</strong> {patientExaminations[0].pulse || "N/A"}</p>
          <p><strong>Past History:</strong> {patientExaminations[0].past_history || "N/A"}</p>
          <p><strong>Complaints:</strong> {patientExaminations[0].complaints || "N/A"}</p>
          
            
          <p><strong>Systemic Examination:</strong> {patientExaminations[0].systemic_exam_general || "N/A"}</p>
           <p><strong> Diagnosis:</strong> {patientExaminations[0].systemic_exam_pa || "N/A"}</p>
        
        </div>
      ) : (
        <p>No patient examination data available</p>
      )}
    </div>
  </div>
</div>



          <div className="row section">
            <div className="col-md-12">
              <table className="table table-bordered border-black">
                <thead className='table-success border-black'>
                  <tr>
                    <th className=' text-center'>Sr No</th>
                    <th className='text-center'>Medicine</th>
                    <th className='text-center'>Strength</th>
                    <th className='text-center'>Dosage</th>
                    <th className='text-center'>Timing</th>
                    <th className='text-center'>Frequency</th>
                    <th className='text-center'>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {descriptions.map((product, index) => (
                    <tr key={index}>
                      <td className='text-center'>{index + 1}</td>
                      <td  className='text-center'>{product.drug_name}</td>
                      <td className='text-center'>{product.strength}</td>
                      <td className='text-center'>{product.dosage}</td>
                      <td className='text-center'>{product.timing}</td>
                      <td className='text-center'>{product.frequency}</td>
                      <td className='text-center'>{product.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* <div className="row">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-6"></div>
                    <div className="col-md-3">
                      <h5>Total: {grandTotal}</h5>
                    </div>
                    <div className="col-md-3">
                      <h5>Total Words: {totalAmountWords}</h5>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <CButton color="success" onClick={handleDownloadPDF}>Download</CButton>&nbsp;&nbsp;
            {/* <CButton color="success" onClick={handleFileInputClick}>Send Bill on WhatsApp</CButton> */}
            <CButton color="success" onClick={handleDownload}>Save and Generate Bill</CButton>&nbsp;&nbsp;
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {/* <CButton color="primary" onClick={handleSendWhatsApp}>Send</CButton> */}
          </div>
        </CContainer>
      </CCardBody>
    </CCard>
  );
};  

export default inv;
