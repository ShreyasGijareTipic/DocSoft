import React, { useState, useEffect } from 'react';
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
  CListGroup,
  CListGroupItem,
} from '@coreui/react';
import { getUser } from '../../../util/session';
import { getAPICall, post } from '../../../util/api';
import { useNavigate } from 'react-router-dom';

const PrescriptionForm = () => {

  const today = new Date().toISOString().split('T')[0];


  // State for patient and doctor details
  const [patientName, setPatientName] = useState('');
  const [doctor_name, setDoctorName] = useState('');
  const [visitDate, setVisitDate] = useState(today);
  const [patientAddress, setPatientAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setContactNumber] = useState('');
  const [dob, setDob] = useState('');
  const [registration_number, setRegistrationNumber] = useState('');
  const [billId, setBillId] = useState('');

  // State for medical observations
  const [bp, setBp] = useState('');
  const [pulse, setPulse] = useState('');
  const [pastHistory, setPastHistory] = useState('');
  const [complaints, setComplaints] = useState('');
  const [sysExGeneral, setSysExGeneral] = useState('');
  const [sysExPA, setSysExPA] = useState('');

 
  const [rows, setRows] = useState([
    { description: "", dosage: "", strength: "", timing: "", frequency: "", duration: "" }
  ]);

  const user = getUser();
  const navigate = useNavigate();

  // Add a new row
  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      { description: '', dosage: '', strength: '', timing: '', frequency: '', duration: '', drugDetails: [] }
    ]);
  };
  
  // Remove a row
  const handleRemoveRow = (index) => {
    if (index === 0) {
      
      return;
      
    }
    setRows(rows.filter((_, i) => i !== index));
  };


  useEffect(() => {
    calculateGrandTotal();
  }, [rows]);


  const [errors, setErrors] = useState({
    patientName: '',
    patientAddress: '',
    phone: '',
    email: '',
    dob: '',
    visitDate: '',
    
  });


  const validateForm = () => {
    let formErrors = {};
    let isValid = true;
  
    // Validate patient details
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
  
    if (!visitDate) {
      formErrors.visitDate = 'Visit date is required';
      isValid = false;
    }
  
    
  
    setErrors(formErrors); // Set errors in the state
    return isValid;
  };



  const [rowErrors, setRowErrors] = useState([]);

 

  const validateRows = (rows) => {
    let errors = rows.map((row) => ({
      description: !row.description ? 'Description is required' : '',
      strength: !row.strength ? 'Strength is required' : '',
      dosage: !row.dosage ? 'Dosage is required' : '',
      timing: !row.timing ? 'Timing is required' : '',
      frequency: !row.frequency ? 'Frequency' : '',
      duration: !row.duration ? 'Duration ' : '',
    }));
  
    // Check if there are any errors
    const hasErrors = errors.some((error) =>
      Object.values(error).some((err) => err)
    );
  
    setRowErrors(errors); // Update the errors in state
  
    return !hasErrors; // Return true if no errors
  };


  const [suggestions, setSuggestions] = useState([]);


    //Fetch patient suggestions
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
  
  

  




  const handleSubmit = async () => {


    if (!validateForm()) return; 
    if (validateRows(rows)) {

    // Field-specific validation
    const phoneRegex = /^[0-9]{10}$/; // Adjust regex based on phone number format requirements
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!patientName || !patientAddress || !phone || !email || !dob || !visitDate) {
      alert('Please fill in all mandatory patient information fields.');
      return;
    }
  
    if (!phoneRegex.test(phone)) {
      alert('Please enter a valid 10-digit contact number.');
      return;
    }
  
    
  
    const today = new Date();
    const dobDate = new Date(dob);
    // const visitDateObj = new Date(visitDate);
  
    if (dobDate >= today) {
      alert('Date of birth cannot be in the future.');
      return;
    }
  
   
  
    if (!doctor_name && !user.name) {
      alert('Doctor Name is required.');
      return;
    }
  
    if (!registration_number && !user.registration_number) {
      alert('Registration Number is required.');
      return;
    }
  
    // Prescription details validation
    if (
      rows.length === 0 ||
      rows.some(
        (row) =>
          !row.description || 
          !row.strength || 
          !row.dosage || 
          !row.timing || 
          !row.frequency || 
          !row.duration
      )
    ) {
      alert('Please fill in all required prescription details.');
      return;
    }
  
    // Continue with the existing bill creation logic
    const r_num = registration_number || user.registration_number;
    const d_name = doctor_name || user.name;
  
    const grandTotal = calculateGrandTotal();
    const grandTotalString = grandTotal ? String(grandTotal) : "0";
  
    const billData = {
      patient_name: patientName,
      address: patientAddress,
      email: email,
      contact: phone,
      dob: dob,
      doctor_name: d_name,
      registration_number: r_num,
      visit_date: visitDate,
      grand_total: grandTotalString,
    };
  
    try {
      // API calls (unchanged from your existing logic)
      const billResponse = await post('/api/PrescriptionPatientInfo', billData);
      console.log('Bill Response:', billResponse);
  
      const billno = billResponse.id;
      setBillId(billno);
  
      if (bp || pulse || pastHistory || complaints || sysExGeneral || sysExPA) {
        const patientExaminationData = {
          p_p_i_id: billno,
          bp,
          pulse,
          past_history: pastHistory,
          complaints,
          systemic_examination_general: sysExGeneral,
          systemic_examination_pa: sysExPA,
        };
  
        const examinationResponse = await post('/api/patientexaminations', patientExaminationData);
        console.log('Examination Response:', examinationResponse);
      }
  
      const prescriptionPromises = rows.map((row) => {
        const prescriptionData = {
        p_p_i_id: billno,
          medicine: row.description,
          strength: row.strength,
          dosage: row.dosage,
          timing: row.timing,
          frequency: row.frequency,
          duration: row.duration,
        };

        console.log(prescriptionData);
        
        return post('/api/healthdirectives', prescriptionData);
      });
  
      const prescriptionResponses = await Promise.all(prescriptionPromises);
      console.log('Prescription Responses:', prescriptionResponses);
  
      navigate('/theme/PrescriptionView', { state: { billId: billno } });
  
      alert('Bill, examination, and prescription details created successfully');




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



    } catch (error) {
      console.error('Error creating bill, examination, or prescriptions:', error);
      alert('There was an error processing the data. Please check your input and try again.');
    }
    }
  };
  
  



  const calculateGrandTotal = () => {
    return 100; 
  };




  const [medicines, setMedicines] = useState(null);
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await getAPICall('/api/drugs');
        console.log("Drugs fetched data:", response);
        
        // Ensure response is valid and contains the expected data
        if (response) {
          console.log("setMedicines",response) ;
         setMedicines(response);
          
        } else {
          console.warn('Unexpected response structure:', response);
        }
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };

    fetchMedicines();
  }, []); // Dependency array ensures this runs only once

  useEffect(() => {
    console.log("Medicines state updated:", medicines);
  }, [medicines]);


  


  const [drugDetails, setDrugDetails] = useState([]); // State to store drugs

   // Fetch drug details based on selected drug
   const handleMedicineChange = async (index, drugId) => {
    try {
      const responsee = await getAPICall(`/api/drugdetails/drug_id/${drugId}`);
      setDrugDetails(responsee);
      // console.log(,responsee.strength);
      
      setRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[index].drugDetails = responsee; // Store drug details in the row
        return updatedRows;
        
      });
      console.log("details",responsee);

    } catch (error) {
      console.error('Error fetching drug details:', error);
    }
  
  };
  console.log("drugDetails",drugDetails);
  



    // Handle row changes
    const handleRowChange = (index, field, value) => {
      setRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[index][field] = value;
        return updatedRows;
      });
    };



    const handlebillpage = () =>{
      navigate('/Bills');
    }


    
      const [isExpanded, setIsExpanded] = useState(false); // State to toggle form visibility
     
    
      const toggleForm = () => setIsExpanded(!isExpanded); // Toggle form state
    

  

      


      

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader>Patient Information</CCardHeader>
        <CCardBody>
          <CRow className="mb-4">
            <CCol xs={12} md={8}>
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



              <CCol  className="pt-3">
              <CFormInput
                className=""
                label="Patient Address"
                value={patientAddress}
                onChange={(e) => setPatientAddress(e.target.value)}
                placeholder="Full Address / Pincode"
                required
              />
                   {errors.patientAddress && <div style={{ color: 'red' }}>{errors.patientAddress}</div>}
             </CCol>   


              <CRow className="mt-3">
                <CCol xs={12} md={4} className="mb-3">
                  <CFormInput
                    label="Contact Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setContactNumber(e.target.value)}
                    onInput={(e) => {
                      if (e.target.value.length > 10) {
                        e.target.value = e.target.value.slice(0, 10); // Limit to 10 digits
                      }
                    }}
                    placeholder="Enter contact number"
                    required
                  />
                {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}

                </CCol>
                <CCol xs={12} md={4} className="mb-3">
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

                <CCol xs={12} sm={6} lg={3} className="">
                  <CCol>
                    <CFormInput
                      label="Patient DOB"
                      type="date" // Keep the date input
                      value={dob}
                      onChange={(e) => {
                        const input = e.target.value;
                        const year = new Date(input).getFullYear();
                        
                        // Ensure the year is a valid 4-digit number
                        if (/^\d{4}$/.test(year) && year >= 1900 && year <= new Date().getFullYear()) {
                          setDob(input);
                          if (errors.dob) {
                            setErrors((prev) => ({ ...prev, dob: "" })); // Clear any previous errors
                          }
                        } else {
                          setDob(""); // Clear invalid value
                          setErrors((prev) => ({ ...prev, dob: "Please enter a valid year (YYYY format)." }));
                        }
                      }}
                      placeholder="Enter patient DOB"
                      required
                    />
                    {errors.dob && <div style={{ color: 'red' }}>{errors.dob}</div>}
                  </CCol>
                </CCol>
                
              </CRow>
            </CCol>

            <CCol xs={12} md={4}>
              <CFormInput
                label="Doctor Name"
                // value={doctor_name}  
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder={`${user.name}`}
                required
              />

                
                <CCol  className="mt-3" >
              <CFormInput
                className=""
                label="Registration Number"
                // value={registration_number}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder={`${user.registration_number}`}
                required
              />
              </CCol>

              <CCol  className="mt-3" >
              <CFormInput
                className=""
                label="Visit Date"
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
              />
             </CCol>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <span>Medical Observations</span>
        <CButton
          color="link"
          className="p-0 text-decoration-none"
          onClick={toggleForm}
        >
          {isExpanded ? '-' : '+'}
        </CButton>
      </CCardHeader>
      {isExpanded && ( // Show form only if expanded
        <CCardBody>
          <CRow className="mb-3">
            <CCol>
              <CFormInput
                label="BP"
                value={bp}
                onChange={(e) => setBp(e.target.value)}
              />
            </CCol>
            <CCol>
              <CFormInput
                label="Pulse"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CFormInput
                label="Past History"
                value={pastHistory}
                onChange={(e) => setPastHistory(e.target.value)}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CFormInput
                label="Complaints"
                value={complaints}
                onChange={(e) => setComplaints(e.target.value)}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
  <CCol xs={12} sm={6}>
    <CFormInput
      label="Systemic Examination - General"
      value={sysExGeneral}
      onChange={(e) => setSysExGeneral(e.target.value)}
    />
  </CCol>
  <CCol xs={12} sm={6}>
    <CFormInput
      label="Diagnosis"
      value={sysExPA}
      onChange={(e) => setSysExPA(e.target.value)}
    />
  </CCol>
</CRow>

        </CCardBody>
      )}
    </CCard>







      <CCardBody>
        <CRow>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell style={{ width: '10%' }}>Medicine</CTableHeaderCell>
                <CTableHeaderCell style={{ width: '10%' }}>Strength</CTableHeaderCell>
                <CTableHeaderCell style={{ width: '10%' }}>Dosage</CTableHeaderCell>
                <CTableHeaderCell style={{ width: '10%' }}>Timing</CTableHeaderCell>
                <CTableHeaderCell style={{ width: '10%' }}>Frequency</CTableHeaderCell>
                <CTableHeaderCell style={{ width: '10%' }}>Duration</CTableHeaderCell>
                <CTableHeaderCell style={{ width: '10%' }}>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {rows.map((row, index) => (
                <CTableRow key={index}>

                  
                  <CTableDataCell>
                    <CFormSelect
                      value={row.description}
                      onChange={(e) => {
                       
                        handleRowChange(index, 'description', e.target.value);
                        handleMedicineChange(index, e.target.value);
                       // Fetch drug details
                      }}
                    >
                      <option value="">Select Medicine</option>
                      {medicines && medicines.length > 0 ? (
                        medicines.map((medicine) => (
                          <option key={medicine.id} value={medicine.id}>
                            {medicine.drug_name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No medicines available</option>
                      )}
                    </CFormSelect>
                    {rowErrors[index]?.description && (
          <div className="text-danger">{rowErrors[index].description}</div>
        )}

                  </CTableDataCell>




                  <CTableDataCell>
  <CFormSelect
    value={row.strength}
    
    onChange={(e) => handleRowChange(index, 'strength', e.target.value)}
    disabled={!row.description} // Disable if no medicine is selected
  >
    <option value="">Select Strength</option>
    {Array.isArray(row.drugDetails) && row.drugDetails
      .filter((drugs) => drugs.drug_id === parseInt(row.description, 10)) // Filter by selected medicine
      .map((drugdetails) => (
        <option key={drugdetails.id} value={drugdetails.strength}>
          {drugdetails.strength}
        </option>
      ))}
      {/* <option>{drugDetails.strength}</option> */}
  </CFormSelect>
  {rowErrors[index]?.strength && (
          <div className="text-danger">{rowErrors[index].strength}</div>
        )}
</CTableDataCell>

<CTableDataCell>
  <CFormSelect
    // value={row.dosage || '1-0-1'} // Set default value to "1-0-1" if row.dosage is undefined or null
    onChange={(e) => handleRowChange(index, 'dosage', e.target.value)}
  >
    <option value="">Select</option>
  <option value="1-0-1">1-0-1</option>
    <option value="0-1-0">0-1-0</option>
    <option value="1-1-1">1-1-1</option>
  </CFormSelect>
  {rowErrors[index]?.dosage && (
          <div className="text-danger">{rowErrors[index].dosage}</div>
        )}
</CTableDataCell>

<CTableDataCell>
  <CFormSelect
    // value={row.timing || 'After Food'} // Default value is "After Food" if row.timing is undefined or null
    onChange={(e) => handleRowChange(index, 'timing', e.target.value)}
  >
    <option value="">Select</option>

    <option value="After Food">After Food</option>
    <option value="Before Food">Before Food</option>
  </CFormSelect>
  {rowErrors[index]?.timing && (
          <div className="text-danger">{rowErrors[index].timing}</div>
        )}
</CTableDataCell>


                  <CTableDataCell>
                    <CFormSelect
                      type="text"
                      value={row.frequency}
                      onChange={(e) => handleRowChange(index, 'frequency', e.target.value)}
                    >
                     <option value="">Select Frequency</option>
                      <option value="Daily">Daily</option>
                      <option value="SOS">SOS</option>
                      </CFormSelect>
                      {rowErrors[index]?.frequency && (
          <div className="text-danger">{rowErrors[index].frequency}</div>
        )}

                  </CTableDataCell>
                  
                  <CTableDataCell>
  {row.isCustom ? (
    <CFormInput
      type="text"
      value={row.duration || ''}
      onChange={(e) => handleRowChange(index, 'duration', e.target.value)}
      placeholder="Enter custom duration"
    />
  ) : (
    <CFormSelect
      value={row.duration}
      onChange={(e) => {
        const selectedValue = e.target.value;
        if (selectedValue === "SOS") {
          // Switch to custom input mode
          handleRowChange(index, 'isCustom', true);
          handleRowChange(index, 'duration', ''); // Clear duration for custom input
        } else {
          // Save the selected predefined value
          handleRowChange(index, 'isCustom', false);
          handleRowChange(index, 'duration', selectedValue);
        }
      }}
    >
      <option value="">Select Duration</option>
      <option value="3 Days">3 Days</option>
      <option value="5 Days">5 Days</option>
      <option value="7 Days">7 Days</option>
      <option value="15 Days">15 Days</option>
      <option value="30 Days">30 Days</option>
      <option value="SOS">Custom</option>
    </CFormSelect>
  )}
 

 {rowErrors[index]?.frequency && (
          <div className="text-danger">{rowErrors[index].frequency}</div>
        )}
</CTableDataCell>



                  <CTableDataCell>
                    <div className="d-flex">
                      <CButton
                        color="danger"
                        className="me-2"
                        onClick={() => handleRemoveRow(index)}
                        disabled={index === 0}

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







      <div className="mt-1 mb-1">
        {/* <CButton color="primary" onClick={handlebillpage}>Generate Bill</CButton> */}
        <CButton color="success" style={{ marginLeft: '5px' }} onClick={handleSubmit}>
          Submit Prescription
        </CButton>
      </div>
    </div>
  );
};

export default PrescriptionForm;
