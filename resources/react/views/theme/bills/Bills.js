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

  const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");


  
  const [billId, setBillId] = useState('');
  const [visitDate, setVisitDate] = useState(formDataa?.visit_date || today);
  const [patientAge, setPatientAge] = useState('');
  const [doctor_name, setDoctorName] = useState('');
  const [registration_number, setRegistration] = useState('');
  const [suggestionFlags, setSuggestionFlags] = useState({});
  
  const toggleSuggestion = (index, type, value) => {
    setSuggestionFlags((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [type]: value,
      },
    }));
  };
  

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
    const usedDescriptions = rows.map((row) => row.description);
    const allDescriptions = ['Consulting', 'Medicine', 'OPD'];
  

    const nextDescription = allDescriptions.find(
      (desc) => !usedDescriptions.includes(desc)
    );
  
  
    if (!nextDescription) return;
  
    setRows((prevRows) => [
      ...prevRows,
      { description: nextDescription, quantity: 0, price: 0, gst: 0, total: 0 }
    ]);
  };
  
  




  const [grandTotal, setGrandTotal] = useState(0); // State for grand total

 
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
  
    // Validate Patient Name (Mandatory)
    if (!data?.patient?.name && !patientName.trim()) {
      formErrors["patientName"] = "Patient name is required";
      isValid = false;
    }
  
    // Validate Patient Address (Mandatory)
    if (!data?.patient?.address && !patientAddress.trim()) {
      formErrors["patientAddress"] = "Patient address is required";
      isValid = false;
    }
  
    // Validate Phone Number (Mandatory)
//     const phoneRegex = /^\d{10}$/; // Ensures exactly 10 digits

// if (!data?.patient?.phone && !phone.trim()) {
//   formErrors["phone"] = "Contact number is required";
//   isValid = false;
// } else if (!phoneRegex.test(String(phone).trim())) {  // Convert phone to string explicitly
//   formErrors["phone"] = "Phone number must have exactly 10 digits";
//   isValid = false;
// }


    
  
    // Validate Email (Optional but properly formatted)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() && !emailRegex.test(email.trim())) {
      formErrors["email"] = "Enter a valid email address";
      isValid = false;
    }
  
    // Validate DOB (Mandatory & Not a Future Date)
    if (!data?.patient?.dob && !dob) {
      formErrors["dob"] = "Date of birth is required";
      isValid = false;
    } else if (new Date(dob) >= new Date()) {
      formErrors["dob"] = "Date of birth cannot be in the future";
      isValid = false;
    }
  
    // Validate Visit Date (Mandatory & Not a Future Date)
    if (!visitDate) {
      formErrors.visitDate = "Visit date is required";
      isValid = false;
    } else if (new Date(visitDate) > new Date()) {
      formErrors.visitDate = "Visit date cannot be in the future";
      isValid = false;
    }
  
    setErrors(formErrors); // Store validation errors in state
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
    systemic_exam_general: sysExGeneral,  // Change to match Laravel
    systemic_exam_pa: sysExPA,
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
  const [medicineSearch, setMedicineSearch] = useState({});
  const [medicineOptions, setMedicineOptions] = useState({});

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

  const handleMedicineSearch = (index, searchText) => {
    setMedicineSearch((prev) => ({ ...prev, [index]: searchText }));
  
    if (searchText.length < 2) {
      // Don't show suggestions for less than 2 characters
      setMedicineOptions((prev) => ({ ...prev, [index]: [] }));
      return;
    }
  
    const filtered = medicines?.filter((med) =>
      med.drug_name.toLowerCase().includes(searchText.toLowerCase())
    ) || [];
  
    setMedicineOptions((prev) => ({ ...prev, [index]: filtered }));
  };
  
  
  
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
        <h3>Select Visit Type</h3>
      </CCardHeader>
      <CCardBody>
        <CForm>
          <div className="mb-4">
            <CFormSelect
              value={selectedOption}
              onChange={(e) => handleDropdownSelect(e.target.value)}
            >
              <option value="">Select an option</option>
              {/* <option value="Appointment">Appointment</option> */}
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
                    <CCol xs={12} sm={6} lg={3}>
  <CCol>
    <CFormInput
      label="Patient DOB"
      type="date"
      value={
        data?.patient?.dob
          ? new Date(data.patient.dob).toISOString().split("T")[0]
          : dob || ""
      }
      onChange={(e) => {
        const input = e.target.value;
        const selectedDate = new Date(input);
        const currentDate = new Date();
        const year = selectedDate.getFullYear();

        // Validate: Year should be between 1900 and current year, and date should not be in the future
        if (year >= 1900 && selectedDate <= currentDate) {
          setDob(input);
          if (errors.dob) {
            setErrors((prev) => ({ ...prev, dob: "" })); // Clear errors if valid
          }
        } else {
          setDob(""); // Clear invalid value
          setErrors((prev) => ({
            ...prev,
            dob: "Please enter a valid DOB (not in the future & after 1900).",
          }));
        }
      }}
      max={new Date().toISOString().split("T")[0]} // Prevent future dates
      placeholder="Enter patient DOB"
      required
    />
    {errors.dob && <div style={{ color: "red" }}>{errors.dob}</div>}
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
    value={userData?.user?.name || ""}
    readOnly
  />
</CCol>

<CCol className="pt-4">
  <CFormInput
    type="text"
    label="Registration Number"
    value={userData?.user?.registration_number || ""}
    readOnly
  />
</CCol>


                <CCol className='pt-4'>
                  <CFormInput
                    type="date"
                    label="Visit Date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]} // Restrict future dates
                  />
                  {errors.visitDate && <div style={{ color: 'red' }}>{errors.visitDate}</div>}
                </CCol>

              </CCol>
            </div>
          </CRow>
        {/* </CCard> */}
       </CCard>

      {/* Medical Observations Section */}
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
            <CFormInput label="BP" value={bp} onChange={(e) => setBp(e.target.value)} />
          </CCol>
          <CCol>
            <CFormInput label="Pulse" value={pulse} onChange={(e) => setPulse(e.target.value)} />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol>
            <CFormInput label="Past History" value={pastHistory} onChange={(e) => setPastHistory(e.target.value)} />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol>
            <CFormInput label="Complaints" value={complaints} onChange={(e) => setComplaints(e.target.value)} />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol xs={12} sm={6}>
            <CFormInput label="Systemic Examination - General" value={sysExGeneral} onChange={(e) => setSysExGeneral(e.target.value)} />
          </CCol>
          <CCol xs={12} sm={6}>
            <CFormInput label="Diagnosis" value={sysExPA} onChange={(e) => setSysExPA(e.target.value)} />
          </CCol>
        </CRow>
      </CCardBody>
    )}
  </CCard>


       <div>
  

  {/* Prescriptions Section */}
  {!showTable && (
    <CButton color="primary" className="mt-4 mb-2" onClick={() => setShowTable(true)}>
      Add Prescriptions
    </CButton>
  )}

  {showTable && (
    <CCardBody>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px",}}>
        <CButton color="danger" onClick={() => setShowTable(false)}>
          Remove
        </CButton>
      </div>

      <CRow >
        <CTable hover responsive style={{ height:"128px" }}>
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
                {/* <CTableDataCell>
                  <CFormSelect
                    value={row.description}
                    onChange={(e) => {
                      handleRowChangee(index, 'description', e.target.value);
                      handleMedicineChange(index, e.target.value);
                    }}
                  >
                    <option value="">Select Medicine</option>
                    {medicines.length > 0 ? (
                      medicines.map((medicine) => (
                        <option key={medicine.id} value={medicine.id}>
                          {medicine.drug_name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No medicines available</option>
                    )}
                  </CFormSelect>
                  {rowErrors[index]?.description && <div className="text-danger">{rowErrors[index].description}</div>}
                </CTableDataCell> */}

                <CTableDataCell>
  <div style={{ position: 'relative' }}>
    <CFormInput
      type="text"
      value={medicineSearch[index] || ''}
      onChange={(e) => handleMedicineSearch(index, e.target.value)}
      placeholder="Search medicine..."
      autoComplete="off"
    />
    
    {/* Dropdown suggestions */}
    {medicineOptions[index]?.length > 0 && (
      <div style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        zIndex: 2000,
        width: '150px',
        border: '1px solid #ccc',
        borderTop: 'none',
        borderRadius: '0 0 6px 6px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        maxHeight: '50px',
        overflowY: 'auto',
        marginTop: '-1px',
      }}>
        {medicineOptions[index].map((medicine) => (
          <div
            key={medicine.id}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              borderBottom: '1px solid #f1f1f1',
              transition: 'background 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            onClick={() => {
              handleRowChangee(index, 'description', medicine.id); // store ID or drug name here
              handleMedicineChange(index, medicine.id); // update related logic
              setMedicineSearch((prev) => ({ ...prev, [index]: medicine.drug_name }));
              setMedicineOptions((prev) => ({ ...prev, [index]: [] })); // close dropdown
            }}
          >
            {medicine.drug_name}
          </div>
        ))}
      </div>
    )}

    {/* Field error display */}
    {rowErrors[index]?.description && (
      <div className="text-danger">{rowErrors[index].description}</div>
    )}
  </div>
</CTableDataCell>
<CTableDataCell style={{ position: "relative" }}>
  <CFormInput
    value={row.strength}
    onChange={(e) => {
      handleRowChangee(index, "strength", e.target.value);
      toggleSuggestion(index, "showStrength", true);
    }}
    onFocus={() => toggleSuggestion(index, "showStrength", true)}
    placeholder="Enter strength"
    disabled={!row.description}
    autoComplete="off"
  />
  {suggestionFlags[index]?.showStrength &&
    Array.isArray(row.drugDetails) &&
    row.drugDetails
      .filter(
        (drug) =>
          drug.drug_id === parseInt(row.description, 10) &&
          (row.strength.trim() === "" ||
            drug.strength.toLowerCase().includes(row.strength.toLowerCase()))
      )
      .slice(0, 5)
      .map((drug, i) => (
        <div
          key={i}
          onClick={() => {
            handleRowChangee(index, "strength", drug.strength);
            toggleSuggestion(index, "showStrength", false);
          }}
          style={{
            position: "relative",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            zIndex: 2000,
            width: "150px",
            border: "1px solid #ccc",
            borderTop: "none",
            borderRadius: "0 0 6px 6px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            maxHeight: "50px",
            overflowY: "auto",
            marginTop: "-1px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          {drug.strength}
        </div>
      ))}
  {rowErrors[index]?.strength && (
    <div className="text-danger">{rowErrors[index].strength}</div>
  )}
</CTableDataCell>

<CTableDataCell>
  <CFormInput
    value={row.dosage}
    onChange={(e) => {
      const rawInput = e.target.value.replace(/-/g, '').trim(); // remove hyphens
      const validInput = rawInput.replace(/[^01]/g, ''); // allow only 0 or 1
      const trimmed = validInput.slice(0, 3); // only first 3 digits

      let formatted = trimmed;
      if (trimmed.length === 3) {
        formatted = `${trimmed[0]}-${trimmed[1]}-${trimmed[2]}`;
      }

      handleRowChangee(index, 'dosage', formatted);
    }}
    placeholder="Enter dosage (e.g. 1-0-1)"
    autoComplete="off"
    maxLength={5} // 3 digits + 2 hyphens
  />
  {rowErrors[index]?.dosage && (
    <div className="text-danger">{rowErrors[index].dosage}</div>
  )}
</CTableDataCell>

                <CTableDataCell>
                  <CFormSelect onChange={(e) => handleRowChangee(index, 'timing', e.target.value)}>
                    <option value="">Select</option>
                    <option value="After Food">After Food</option>
                    <option value="Before Food">Before Food</option>
                  </CFormSelect>
                  {rowErrors[index]?.timing && <div className="text-danger">{rowErrors[index].timing}</div>}
                </CTableDataCell>

                <CTableDataCell>
                  <CFormSelect onChange={(e) => handleRowChangee(index, 'frequency', e.target.value)}>
                    <option value="">Select Frequency</option>
                    <option value="Daily">Daily</option>
                    <option value="SOS">SOS</option>
                  </CFormSelect>
                  {rowErrors[index]?.frequency && <div className="text-danger">{rowErrors[index].frequency}</div>}
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
                        handleRowChangee(index, 'isCustom', selectedValue === "SOS");
                        handleRowChangee(index, 'duration', selectedValue === "SOS" ? '' : selectedValue);
                      }}
                    >
                      <option value="">Select Duration</option>
                      <option value="3 Days">3 Days</option>
                      <option value="5 Days">5 Days</option>
                      <option value="7 Days">7 Days</option>
                      <option value="15 Days">15 Days</option>
                      <option value="30 Days">30 Days</option>
                    </CFormSelect>
                  )}
                </CTableDataCell>

                <CTableDataCell>
                  <div className="d-flex">
                    <CButton color="danger" className="me-2" onClick={() => handleRemoveRoww(index)} disabled={index === 0}>
                      -
                    </CButton>
                    <CButton color="success" onClick={handleAddRoww}>
                      +
                    </CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CRow>
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
    onChange={(e) =>
      handleRowChange(index, 'quantity', Math.max(0, Number(e.target.value)))
    }
    onFocus={() => handleRowChange(index, 'quantity', '')}
  />
  {rowErrors[index]?.quantity && (
    <div style={{ color: 'red' }}>{rowErrors[index]?.quantity}</div>
  )}
</CTableDataCell>

<CTableDataCell>
  <CFormInput
    type="number"
    value={row.price}
    onChange={(e) =>
      handleRowChange(index, 'price', Number(e.target.value))
    }
    onFocus={() => handleRowChange(index, 'price', '')}
  />
  {rowErrors[index]?.price && (
    <div style={{ color: 'red' }}>{rowErrors[index]?.price}</div>
  )}
</CTableDataCell>

<CTableDataCell>
  <CFormInput
    type="text"
    value={row.gst}
    onChange={(e) =>
      handleRowChange(index, 'gst', Number(e.target.value))
    }
    onFocus={() => handleRowChange(index, 'gst', '')}
  />
</CTableDataCell>

                    {/* <CTableDataCell>
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
                    </CTableDataCell> */}

                    <CTableDataCell>{row.total.toFixed(2)}</CTableDataCell>

                    <CTableDataCell>
                      <div className="d-flex">
                        <CButton
                          color="danger"
                          className="me-2"
                          onClick={() => handleRemoveRow(index)}
                          disabled={index === 0}

                        >
                          -
                        </CButton>

                        <CButton
                          color="success"
                          onClick={handleAddRow}
                        >
                          +
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
