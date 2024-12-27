import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useLocation } from 'react-router-dom';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect,
  CFormTextarea,
  CListGroup, CListGroupItem
} from '@coreui/react';
// import axios from 'axios'; // Make sure to import axios
import { getAPICall, post, postFormData } from '../../../util/api';
import { getUser } from '../../../util/session';

const Typography = () => {


  const location = useLocation();
  const { formDataa } = location.state || {};
console.log("gya data",formDataa);



  const navigate = useNavigate(); // Initialize useNavigate
  const [rows, setRows] = useState([
    { description: 'Consulting', quantity: 1, price: 100, gst: 5, total: 105 }
  ]);
  const [patientName, setPatientName] = useState(formDataa?.patient_name || '');
  const [doctor_name, setDoctorName] = useState('');
  const [visitDate, setVisitDate] = useState(formDataa?.visit_date || '');
  const [patientAge, setPatientAge] = useState('');
  const [patientAddress, setPatientAddress] = useState(formDataa?.patient_address || '');
  const [email, setEmail] = useState(formDataa?.patient_email || '');
  const [phone, setContactNumber] = useState((formDataa?.patient_contact || ''));
  const [dob, setDob] = useState(formDataa?.patient_dob || '');
  const [billId, setBillId] = useState('');

  const [registration_number, setRegistration] = useState('');

  const [suggestions, setSuggestions] = useState([]);



  const [errors, setErrors] = useState({
    patientName: '',
    patientAddress: '',
    phone: '',
    email: '',
    dob: '',
   
    visitDate: '',
  });



  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      { description: 'Consulting', quantity: 1, price: 0, gst: 0, total: 0 }
    ]);
  };




  const [grandTotal, setGrandTotal] = useState(0); // State for grand total

  // Function to calculate the grand total
  const calculateGrandTotal = () => {
    const total = rows.reduce((acc, row) => acc + parseFloat(row.total || 0), 0);
    setGrandTotal(total.toFixed(2));
  };

  // Recalculate grand total whenever rows change
  useEffect(() => {
    calculateGrandTotal();
  }, [rows]);


  const user = getUser();

  // ------------------------------------------------------------------------------------------------------------------------

  // Fetch patient suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      // Only fetch suggestions if patientName has at least 2 characters
      if (patientName.length >= 2) {
        try {
          const response = await getAPICall(`/api/patients/search?name=${patientName}`);
          setSuggestions(response);
          console.log('p name', response);
        } catch (error) {
          console.error('Error fetching patient suggestions:', error);
        }
      } else {
        // Clear suggestions if patientName is empty or too short
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [patientName]);

  // Handle patient name suggestion click
  const handleSuggestionClick = (patient) => {
    setPatientName(patient.name);
    setPatientAddress(patient.address);
    setContactNumber(patient.phone);
    setEmail(patient.email);
    setDob(patient.dob);
    setSuggestions([]);
  };



// ------------------------------------------------------------------------------------------------------------------




 
  // console.log(user);

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];

    if (field === 'quantity') {
      value = value < 1 ? 1 : value;  // If quantity is less than 1, set it to 1
    }

    updatedRows[index][field] = value;

    const quantity = Number(updatedRows[index].quantity || 0);
    const price = Number(updatedRows[index].price || 0);
    const gst = Number(updatedRows[index].gst || 0);
    updatedRows[index].total = (quantity * price) + ((quantity * price * gst) / 100);
    setRows(updatedRows);
  };

  const handleRemoveRow = (index) => {
    setRows((prevRows) => prevRows.filter((_, rowIndex) => rowIndex !== index));
  };

  // Handle patient form submission
  
  

  let r_num='';
  if(registration_number==''){
    r_num=user.registration_number;
  }
  else{
    r_num=registration_number;
  }

  let d_name='';
  if(doctor_name==''){
    d_name=user.name;
  }
  else{
    d_name=doctor_name;
  }

  

  // console.log(r_num);
  // console.log(d_name);

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Validate each field
    if (!patientName) {
      formErrors.patientName = 'Patient name is required';
      isValid = false;
    }

    if (!patientAddress) {
      formErrors.patientAddress = 'Patient address is required';
      isValid = false;
    }

    if (!phone) {
      formErrors.phone = 'Contact number is required';
      isValid = false;
    }

    if (!email) {
      formErrors.email = 'Email is required';
      isValid = false;
    }

    if (!dob) {
      formErrors.dob = 'Date of birth is required';
      isValid = false;
    }

    // if (!doctor_name) {
    //   formErrors.doctorName = 'Doctor name is required';
    //   isValid = false;
    // }

    // if (!registration_number) {
    //   formErrors.registrationNumber = 'Registration number is required';
    //   isValid = false;
    // }

    if (!visitDate) {
      formErrors.visitDate = 'Visit date is required';
      isValid = false;
    }

    setErrors(formErrors); // Set errors in the state
    return isValid;
  };






const handleSubmit = async () => {


  if (!validateForm()) return; 


  const billData = {
      patient_name: patientName,
      address: patientAddress,
      email: email,
      contact: phone,
      dob: dob,
      doctor_name: d_name,
      registration_number: r_num,
      visit_date: visitDate,
      grand_total:grandTotal,
  };

  try {
      // First API call: Create Bill
      const billResponse = await post('/api/bills', billData);
      console.log('Bill Response:', billResponse); // Log the entire response


      const dcid = billResponse.doctor_id;
      console.log('for doctor id',dcid);

      const billno = billResponse.id; // Get the bill ID
      setBillId(billno);

      // Prepare description data with the bill ID
      const descriptionData = rows.map(row => ({
          bill_id: `${billno}` || '',
          description: `${row.description}` || '',
          quantity: `${row.quantity}` || '',
          price: `${row.price}` || '',
          gst: `${row.gst}` || '',
          total: `${row.total}` || ''
      }));

      // Log description data before sending
      console.log('Description Data:', descriptionData);

      // Second API call: Submit Descriptions
      const descriptionResponse = await post('/api/descriptions', { descriptions: descriptionData });

      navigate('/theme/invoice', { state: { billId: billno } });
      


    
    
    alert('Bill and descriptions created successfully');
      
  } catch (error) {
      console.error('Error creating bill or descriptions:', error);

     
  }





  const patientExists = suggestions.some((patient) => patient.name === patientName);

  // If patient does not exist in suggestions, add them as a new patient
  if (!patientExists) {
    const newPatientData = {
      name: patientName,
      address: patientAddress,
      email: email,
      phone: phone,
      dob: dob,
    };

    try {
      const patientResponse = await post('/api/patients', newPatientData);
      console.log('New Patient added:', patientResponse);
      alert('New patient added successfully!');
    } catch (error) {
      console.error('Error adding new patient:', error);
      alert('Failed to add new patient');
      return;
    }
  }



 




    // const patientData = {
    //   name: patientName,
    //   age: patientAge,
    //   address: patientAddress,
    //   email: email,
    //   phone: phone,
    //   dob: dob,
    // };

    // try {
    //   // Post patient data to Laravel API
    //   const response = await post('/api/patients', patientData);
    //   console.log('Patient added:', response.data);
    //   alert('Patient added successfully!');
      
    // } catch (error) {
    //   // Improved error logging
    //   if (error.response) {
    //     // The request was made and the server responded with a status code
    //     console.error('Error Response:', error.response.data);
    //     console.error('Error Status:', error.response.status);
    //     console.error('Error Headers:', error.response.headers);
    //     alert(`Error: ${error.response.data.message || 'An error occurred while adding the patient.'}`);
    //   } else if (error.request) {
    //     // The request was made but no response was received
    //     console.error('Error Request:', error.request);
    //     alert('No response received from the server.');
    //   } else {
    //     // Something happened in setting up the request that triggered an Error
    //     console.error('Error Message:', error.message);
    //     alert('An error occurred: ' + error.message);
    //   }
    // }



  // navigate('/theme/invoice', { state: { billId } });



};

  
const handleCreatePrescription = async () =>{


  navigate('/theme/prescriptionForm');

}

// const suggestions = [];


  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>Patient Information</CCardHeader>
        <CCardBody>
          <CRow className="mb-4 ps-2">
            <div className="clinic-details row">
              {/* Left Side: Patient Information */}
              <CCol xs={8} lg={8} className="">
                <CCol>
                  <CFormInput
                    label="Patient Name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                    required
                  />
  {Array.isArray(suggestions) && suggestions.length > 0 && (
              <CListGroup style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '10px' }}>
                {suggestions.map((patient) => (
                  <CListGroupItem
                    key={patient.id}
                    onClick={() => handleSuggestionClick(patient)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: '#f8f9fa',
                    }}
                  >
                    {patient.name}
                  </CListGroupItem>
                ))}
              </CListGroup>
            )}
            {errors.patientName && <div style={{ color: 'red' }}>{errors.patientName}</div>}
                </CCol>

                <CCol className='pt-4'>
                  <CFormInput
                    label="Patient Address"
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    placeholder="Full Address / Pincode"
                    required
                  />
                   {errors.patientAddress && <div style={{ color: 'red' }}>{errors.patientAddress}</div>}
                </CCol>

                <CRow className="mb-4 ps-1 pt-4">
                  <div className="clinic-details row">
                    <CCol xs={4} lg={4} className="">
                     
                      <CCol>
                        <CFormInput
                          label="Contact Number"
                          type="tel"
                          value={phone}
                          onChange={(e) => setContactNumber(e.target.value)}
                          placeholder="Enter contact number"
                          required
                        />
                        {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}
                      </CCol>
                    </CCol>
                    <CCol xs={5} lg={5} className="">
                    <CCol>
                        <CFormInput
                          label="Email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter email address"
                          required
                        />
                        {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                      </CCol>
                    </CCol>
                    <CCol xs={3} lg={3} className="">
                      <CCol>
                        <CFormInput
                          label="Patient DOB"
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          placeholder="Enter patient DOB"
                          required
                        />
                        {errors.dob && <div style={{ color: 'red' }}>{errors.dob}</div>}
                      </CCol>
                    </CCol>
                  </div>
                </CRow>
              </CCol>

              <CCol xs={4} lg={4} className="">
                <CCol>
                  <CFormInput
                  type="text"
                    label="Doctor Name"
                    // value={doctor_name}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder={`${user.name}`}
                  />
                </CCol>

                <CCol className='pt-4'>
                  <CFormInput
                   type="text"
                    label="Registration Number"
                    //  value={registration_number}
                    onChange={(e) => setRegistration(e.target.value)}
                    placeholder={`${user.registration_number}`}
                  />
                </CCol>

                <CCol className='pt-4'>
                  <CFormInput
                    type="date"
                    label="Visit Date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                  />
                  {errors.visitDate && <div style={{ color: 'red' }}>{errors.visitDate}</div>}
                </CCol>
              </CCol>
            </div>
          </CRow>
        </CCardBody>
     

      {/* <CCard className="mb-4"> */}
        <CCardBody>
          <CRow>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell style={{ width: '20%' }}>Description</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: '15%' }}>Quantity</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: '15%' }}>Fees</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: '15%' }}>GST (%)</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: '10%' }}>Total</CTableHeaderCell>
                  <CTableHeaderCell style={{ width: '30%' }}>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead> 
              <CTableBody>
                {rows.map((row, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>
                      <CFormSelect
                        value={row.description}
                        onChange={(e) => handleRowChange(index, 'description', e.target.value)}
                      >
                        <option value="Consulting">Consulting</option>
                        <option value="Medicine">Medicine</option>
                        <option value="OPD">OPD</option>
                      </CFormSelect>
                    </CTableDataCell>

                    <CTableDataCell>
                      <CFormInput
                        type="text"
                        value={row.quantity}
                        min="1"
                        onChange={(e) => handleRowChange(index, 'quantity', Math.max(1, Number(e.target.value)))}
                        disabled={index === rows.length - 1}
                      />
                    </CTableDataCell>

                    <CTableDataCell>
                      <CFormInput
                        type="text"
                        value={row.price}
                        onChange={(e) => handleRowChange(index, 'price', Number(e.target.value))}
                      />
                    </CTableDataCell>

                    <CTableDataCell>
                      <CFormInput
                        type="text"
                        value={row.gst}
                        onChange={(e) => handleRowChange(index, 'gst', Number(e.target.value))}
                      />
                    </CTableDataCell>

                    <CTableDataCell>{row.total.toFixed(2)}</CTableDataCell>

                    <CTableDataCell>
                      <div className="d-flex">
                        <CButton
                          color="danger"
                          className="me-2"
                          onClick={() => handleRemoveRow(index)}
                        >
                          Remove
                        </CButton>

                        <CButton
                          color="success"
                          onClick={handleAddRow}
                        >
                          Add Row
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CRow>
        </CCardBody>


       

        <CCardBody>
          <CButton color="primary" className="mt-0" onClick={handleSubmit}>
            Submit
          </CButton> &nbsp;&nbsp;

          <CButton color="primary" className="mt-0" onClick={handleCreatePrescription}>
           Create Prescription
          </CButton>
        </CCardBody>

        {/* <CCardBody>
          <CButton color="primary" className="mt-0" onClick={handleCreatePrescription}>
           Create Prescription
          </CButton>
        </CCardBody> */}

        
    
        <CTableRow style={{display: 'none'}}>
          <CTableDataCell colSpan="4" className="text-end">
            <strong>Grand Total:</strong>
          </CTableDataCell>
          <CTableDataCell>
            <strong>{grandTotal}</strong>
          </CTableDataCell>
          <CTableDataCell />
        </CTableRow>

      </CCard>
    </>
  );
};

export default Typography;
