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
  CListGroup, CListGroupItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CInputGroup,
  CForm,
  CCardText
} from '@coreui/react';
// import axios from 'axios'; // Make sure to import axios
import { getAPICall, post, postFormData } from '../../../util/api';
import { getUser } from '../../../util/session';

const Typography = () => {

const today = new Date().toISOString().split('T')[0];
  


  const location = useLocation();
  const { formDataa } = location.state || {};
// console.log("gya data",formDataa);



  const navigate = useNavigate(); // Initialize useNavigate
  const [rows, setRows] = useState([
    { description: 'Consulting', quantity: 0, price: 100, gst: 5, total: 105 }
  ]);
  
  const [patientName, setPatientName] = useState(formDataa?.patient_name || '');
  const [patientAddress, setPatientAddress] = useState(formDataa?.patient_address || '');
  const [email, setEmail] = useState(formDataa?.patient_email || '');
  const [phone, setContactNumber] = useState((formDataa?.patient_contact || ''));
  const [dob, setDob] = useState(formDataa?.patient_dob || '');


  
  const [billId, setBillId] = useState('');
  const [visitDate, setVisitDate] = useState(formDataa?.visit_date || today);
  const [patientAge, setPatientAge] = useState('');
  const [doctor_name, setDoctorName] = useState('');
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
      { description: 'Consulting', quantity: 0, price: 0, gst: 0, total: 0 }
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

  //Fetch patient suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      // Only fetch suggestions if patientName has at least 2 characters
      if (patientName.length >= 2) {
        try {
          const response = await getAPICall(`/api/patients/search?name=${patientName}`);  //${patientName}
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

    if (field === 'quantity' || field === 'price' || field === 'gst') {
      // Check if the value is a valid number and integer
      if (!Number.isInteger(Number(value)) || isNaN(value)) {
        value = 0; // Reset to 0 if not a valid integer
      }
    }

    updatedRows[index][field] = value;

    const quantity = Number(updatedRows[index].quantity || 0);
    const price = Number(updatedRows[index].price || 0);
    const gst = Number(updatedRows[index].gst || 0);
    updatedRows[index].total = (quantity * price) + ((quantity * price * gst) / 100);
    setRows(updatedRows);


    const errors = [...rowErrors];
    if (field === 'quantity' || field === 'price' || field === 'gst') {
      errors[index] = {
        quantity: field === 'quantity' && !Number.isInteger(Number(value)) ? 'Only integers allowed' : '',
        price: field === 'price' && !Number.isInteger(Number(value)) ? 'Only integers allowed' : '',
        gst: field === 'gst' && !Number.isInteger(Number(value)) ? 'Only integers allowed' : ''
      };
    }
    setRowErrors(errors);

  };

  const handleRemoveRow = (index) => {
    if (index === 0) {
      
      return;
      
    }
    setRows(rows.filter((_, i) => i !== index));
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
    if (!data?.patient?.name && !patientName) {
      formErrors["patientName"] = "Patient name is required";
      isValid = false;
    }
    
    if (!data?.patient?.address && !patientAddress) {
      formErrors["patientAddress"] = "Patient address is required";
      isValid = false;
    }
    
    if (!data?.patient?.phone && !phone) {
      formErrors["phone"] = "Contact number is required";
      isValid = false;
    }
    
    if (!data?.patient?.email && !email) {
      formErrors["email"] = "Email is required";
      isValid = false;
    }
    
    if (!data?.patient?.dob && !dob) {
      formErrors["dob"] = "Date of birth is required";
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
      quantity: !row.quantity || row.quantity <= 0 ? 'Quantity is required and must be positive' : '',
      price: !row.price || row.price <= 0 ? 'Price is required and must be positive' : '',
     
    }));

    setRowErrors(errors); // Update row errors
    return !errors.some((error) => Object.values(error).some((err) => err));
  };


// ----------------- 
const validateRowss = () => {
  const errors = rowss.map((row) => ({
    description: row.description ? null : "Medicine is required.",
    strength: row.strength ? null : "Strength is required.",
    dosage: row.dosage ? null : "Dosage is required.",
    timing: row.timing ? null : "Timing is required.",
    frequency: row.frequency ? null : "Frequency is required.",
    duration: row.duration ? null : "Duration is required.",
  }));
  setRowErrors(errors);
  return errors.every((error) => Object.values(error).every((e) => e === null));
};

// --------------------- 




const handleSubmit = async () => {

 
  if (!validateForm()) return; 
  if (validateRows(rows)) {

    const today = new Date();
    const dobDate = new Date(dob);
    if (dobDate >= today) {
      alert('Date of birth cannot be in the future.');
      return;
    }

  const billData = {
      patient_name:  data?.patient?.name  ||  patientName,                //    data.patient.name
      address:  data?.patient?.address || patientAddress  ,                  //    data.patient.address
      email: data?.patient?.email ||  email ,                             //    data.patient.email
      contact: data?.patient?.phone || `91${phone}`,                    //    phone, data.patient.phone
      dob:     data?.patient?.dob ||  dob,                           //    data.patient.dob,
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

      navigate('/Invoice', { state: { billId: billno } });
      


    
    
    alert('Bill and descriptions created successfully');



// -------------------------------------------------------------------------------------------- 
// Post Data Into Health Directive Table


if (validateRowss()) {
  try {
    const prescriptionPromises = rowss.map((row) => {
      const prescriptionData = {
        p_p_i_id: `${billno}`, // Replace with dynamic bill number
        medicine: medicines.find(med => med.id === parseInt(row.description, 10))?.drug_name || "",
        strength: row.strength,
        dosage: row.dosage,
        timing: row.timing,
        frequency: row.frequency,
        duration: row.duration,
      };

      console.log("Prescription Data:", prescriptionData);
      return post("/api/healthdirectives", prescriptionData);
    });

    const prescriptionResponses = await Promise.all(prescriptionPromises);
    console.log("Prescription Responses:", prescriptionResponses);
  } catch (error) {
    console.error("Error submitting prescriptions:", error);
  }
} else {
  console.error("Validation errors:", rowErrors);
}




      if (bp || pulse || pastHistory || complaints || sysExGeneral || sysExPA) {
        const patientExaminationData = {
          p_p_i_id: `${billno}`,
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

// ----------------------------------------------------------------------------------------------------- 



const existingPatientResponse = await post('/api/checkPatient', {
  id: data.patient.id, // Replace with the unique field you're using
});
      

    const patientExists = existingPatientResponse.exists;

    // If patient does not exist in suggestions, add them as a new patient
    if (!patientExists) {
      const newPatientData = {
        name: patientName ,                   //data.patient.name,
        address: patientAddress,                  //data.patient.address,
        email:  email,                 // data.patient.email,
        phone:   phone,                // data.patient.phone,
        dob:    dob                 //data.patient.dob,
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
      console.error('Error creating bill or descriptions:', error);

  }
  }

};

  
const handleCreatePrescription = async () =>{


  navigate('/theme/prescriptionForm');

}

// const suggestions = [];




// ------------------------------------------------------------------------------------- 

const [showTable, setShowTable] = useState(false); 
  const [rowss, setRowss] = useState([
    {
      description: "",
      strength: "",
      dosage: "",
      timing: "",
      frequency: "",
      duration: "",
      isCustom: false,
      drugDetails: [],
    },
  ]);

  // Handle adding a new row
  const handleAddRoww = () => {
    setRowss([
      ...rowss,
      {
        description: "",
        strength: "",
        dosage: "",
        timing: "",
        frequency: "",
        duration: "",
        isCustom: false,
        drugDetails: [],
      },
    ]);
  };

  // Handle removing a row
  const handleRemoveRoww = (index) => {
    // Prevent removing the first row
  if (index === 0) {
    return;
  }

  // Use the correct state variable 'rowss' for filtering
  const updatedRows = rowss.filter((_, i) => i !== index);
  setRowss(updatedRows);
  };

  // Handle row change
  const handleRowChangee = (index, field, value) => {
    const updatedRows = [...rowss];
    updatedRows[index][field] = value;
    setRowss(updatedRows);
  };

  // State for medical observations
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleForm = () => setIsExpanded(!isExpanded);

  const [bp, setBp] = useState("");
  const [pulse, setPulse] = useState("");
  const [pastHistory, setPastHistory] = useState("");
  const [complaints, setComplaints] = useState("");
  const [sysExGeneral, setSysExGeneral] = useState("");
  const [sysExPA, setSysExPA] = useState("");


//get Medicine In Dropdown Code

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
      
      setRowss((prevRows) => {
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


  
  


// ------------------------------------------------------------------------------------- 



const [selectedOption, setSelectedOption] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState(null);
  console.log("data",data);
  

  // Handle dropdown selection
  const handleDropdownSelect = (option) => {
    setSelectedOption(option);
    setInputValue(''); // Reset input field
    setData(null); // Clear previous data
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Fetch data based on ID and selected option
  const handleFetchData = async () => {
    if (!inputValue) {
      alert('Please enter an ID!');
      return;
    }

    try {
      // Determine endpoint based on dropdown option
      const endpoint =
        selectedOption === 'Appointment'
          ? `/api/appointments/${inputValue}` // Replace with your real Appointment API endpoint
          : `/api/getPatientInfo`;

      // Make API call
      const response = await post(endpoint, { tokan_number: inputValue });
       console.log("ggfff",response.patient);

      // Set the fetched data
      setData(response);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please check the ID and try again.');
      setData(null); // Clear data on error
    }
  };





// ----------------------------------------------------------------------------------------------------- 













  return (
    <>


  
<CCard className='mb-4'>
      <CCardHeader>
        <h3>Select Data Type</h3>
      </CCardHeader>
      <CCardBody>
        <CForm>
          <div className="mb-4">
            <CFormSelect
              value={selectedOption}
              onChange={(e) => handleDropdownSelect(e.target.value)}
            >
              <option value="">Select an option</option>
              <option value="Appointment">Appointment</option>
              <option value="Tokan">Tokan</option>
            </CFormSelect>
          </div>

          {selectedOption && (
            <div className="mb-4">
              <h4>Enter ID</h4>
              <CFormInput
                type="text"
                placeholder={`Enter ${selectedOption} ID`}
                value={inputValue}
                onChange={handleInputChange}
              />
              <CButton color="primary" className="mt-3" onClick={handleFetchData}>
                Submit
              </CButton>
            </div>
          )}

          {/* {data && (
            <CCard className="mt-4">
              <CCardHeader>Fetched Data:</CCardHeader>
              <CCardBody>
                <CCardText>
                  <pre>{JSON.stringify(data.patient, null, 2)}</pre>
                </CCardText>
              </CCardBody>
            </CCard>
          )} */}
        </CForm>
      </CCardBody>
    </CCard>



      <CCard className="mb-4">
     
        <CCardHeader>Patient Information</CCardHeader>
        {/* <CCard> */}
          <CRow className="mb-4 ps-2">
            <div className="clinic-details row">
              {/* Left Side: Patient Information */}
              <CCol xs={12} lg={8} className="">
                <CCol>
                  <CFormInput
                    label="Patient Name"
                    value={data?.patient?.name}   //patientName
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
                    value={data?.patient?.address}  //patientAddress
                    onChange={(e) => setPatientAddress(e.target.value)}
                    placeholder="Full Address / Pincode"
                    required
                  />
                   {errors.patientAddress && <div style={{ color: 'red' }}>{errors.patientAddress}</div>}
                </CCol>

                <CRow className="mb-4 ps-1 pt-4">
                  <div className="clinic-details row">
                    <CCol xs={12} sm={6} lg={4} className="">
                     
                    <CCol>
  <CFormInput
    label="Contact Number"
    type="tel"
    value={data?.patient?.phone}  //phone
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

                    </CCol>
                    
                    <CCol xs={12} sm={6} lg={5} className="">
                    <CCol>
                        <CFormInput
                          label="Email"
                          type="email"
                          value={data?.patient?.email}   //email
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter email address"
                          required
                        />
                        {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                      </CCol>
                    </CCol>
                    <CCol xs={12} sm={6} lg={3} className="">
  <CCol>
    <CFormInput
      label="Patient DOB"
      type="date" // Keep the date input
      value={
        data?.patient?.dob
          ? new Date(data.patient.dob).toISOString().split("T")[0]
          : dob || "" // Format the DOB properly or use the state value
      } //dob
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
                  </div>
                </CRow>
              </CCol>

              <CCol xs={12} lg={4} className="">
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
        {/* </CCard> */}
       </CCard>



       <div>
  {/* Conditionally render the "Add Prescriptions" button */}
  {!showTable && (
    <CButton
      color="primary"
      className="mt-4 mb-2"
      onClick={() => setShowTable(true)} // Show the table on button click
    >
      Add Prescriptions
    </CButton>
  )}
 
  {/* Conditionally render the table */}
  {showTable && (
    <CCardBody>
      {/* Container for buttons to align them horizontally */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        {/* Close button at the top right corner */}
        <CButton
          color="danger"
          onClick={() => setShowTable(false)} // Close the table and show the Add button
        >
          Remove
        </CButton>
      </div>

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
                        {rowss.map((row, index) => (
                          <CTableRow key={index}>
          
                            
                            <CTableDataCell>
                              <CFormSelect
                                value={row.description}
                                onChange={(e) => {
                                 
                                  handleRowChangee(index, 'description', e.target.value);
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
              
              onChange={(e) => handleRowChangee(index, 'strength', e.target.value)}
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
              onChange={(e) => handleRowChangee(index, 'dosage', e.target.value)}
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
              onChange={(e) => handleRowChangee(index, 'timing', e.target.value)}
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
                                onChange={(e) => handleRowChangee(index, 'frequency', e.target.value)}
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
                onChange={(e) => handleRowChangee(index, 'duration', e.target.value)}
                placeholder="Enter custom duration"
              />
            ) : (
              <CFormSelect
                value={row.duration}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  if (selectedValue === "SOS") {
                    // Switch to custom input mode
                    handleRowChangee(index, 'isCustom', true);
                    handleRowChangee(index, 'duration', ''); // Clear duration for custom input
                  } else {
                    // Save the selected predefined value
                    handleRowChangee(index, 'isCustom', false);
                    handleRowChangee(index, 'duration', selectedValue);
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
                                  onClick={() => handleRemoveRoww(index)}
                                  disabled={index === 0}
          
                                >
                                  Remove
                                </CButton>
          
                                <CButton
                                  color="success"
                                  onClick={handleAddRoww}
                                >
                                  AddRow
                                </CButton>
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </CRow>

          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <span>Medical Observations</span>
              <CButton
                color="link"
                className="p-0 text-decoration-none"
                onClick={toggleForm}
              >
                {isExpanded ? "-" : "+"}
              </CButton>
            </CCardHeader>
            {isExpanded && (
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
        </CCardBody>
      )}
    </div>



     

      {/* <CCard className="mb-4"> */}
        <CCard className="mb-4 mt-2">
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
                        min=""
                        onChange={(e) => handleRowChange(index, 'quantity', Math.max(0, Number(e.target.value)))}
                        // disabled={index === rows.length - 0}
                      />
                      {rowErrors[index]?.quantity && <div style={{ color: 'red' }}>{rowErrors[index]?.quantity}</div>}
                    </CTableDataCell>

                    <CTableDataCell>
                      <CFormInput
                        type="number"
                        value={row.price}
                        onChange={(e) => handleRowChange(index, 'price', Number(e.target.value))}
                      />
                      {rowErrors[index]?.price && <div style={{ color: 'red' }}>{rowErrors[index]?.price}</div>}
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
        </CCard>


       

        <CCardBody>
          <CButton color="primary" className="mt-0" onClick={handleSubmit}>
            Submit
          </CButton> &nbsp;&nbsp;

          {/* <CButton color="primary" className="mt-0" onClick={handleCreatePrescription}>
           Create Prescription
          </CButton> */}
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

      {/* </CCard> */}
    </>
  );
};

export default Typography;
