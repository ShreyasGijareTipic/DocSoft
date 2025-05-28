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
  CCardText,
  CFormLabel,
  CAlert
} from '@coreui/react';
// import axios from 'axios'; // Make sure to import axios
import { getAPICall, post, postFormData } from '../../../util/api';
import { getUser } from '../../../util/session';
import { showToast } from '../toastContainer/toastContainer'; 
import { cilFile, cilMedicalCross, cilDelete, cilPlus, cilMinus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';


const Typography = () => {

const today = new Date().toISOString().split('T')[0];
  
const user = getUser();
console.log("user",user.consulting_fee);


  const location = useLocation();
  const { formDataa } = location.state || {};
// console.log("gya data",formDataa);



  const navigate = useNavigate(); // Initialize useNavigate
  const [rows, setRows] = useState([
    { description: 'Consulting', quantity: 0, price: user?.consulting_fee || 0, gst: 0, total: 0 }
  ]);
  
  const [patientName, setPatientName] = useState(formDataa?.patient_name || '');
  const [patientAddress, setPatientAddress] = useState(formDataa?.patient_address || '');
  const [email, setEmail] = useState(formDataa?.patient_email || '');
  const [phone, setContactNumber] = useState((formDataa?.patient_contact || ''));
  const [dob, setDob] = useState(formDataa?.patient_dob || '');
  const [patientSuggestionId, setPatientSuggestionId] = useState(null);
  const [lastBill , setLastBill] = useState([{}]);
console.log("lastBill",lastBill);
const [healthdirectives , sethealthdirectives ] = useState([{}]);
console.log("lastBill",healthdirectives);

const [showPatientCard, setShowPatientCard] = useState(false);

const [patientExaminations , setpatientExaminations ] = useState([{}]);

  const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");

  let manualPatientID = null;

  
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


  
 //Fetch patient suggestions
  // ------------------------------------------------------------------------------------------------------------------------
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  console.log("Suggestion IDs:", suggestions.map(p => p.id));
  const [isSuggestionClicked, setIsSuggestionClicked] = useState(false);
 
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (patientName.length >= 2 && !isSuggestionClicked) {
        try {
          const response = await getAPICall(`/api/suggestionPatient?query=${patientName}`);
          // Optional: remove selected patient from suggestions
       
          const filtered = response.filter(p => p.id !== selectedPatient?.id);
          console.log("filtered",filtered);
          
          setSuggestions(filtered);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
      setIsSuggestionClicked(false);
    };
  
    fetchSuggestions();
  }, [patientName]);
  

  // Handle patient name suggestion click
  const handleSuggestionClick = async(patient) => {
    console.log("Selected Patient ID:", patient.id); 
    setPatientSuggestionId(patient.id)
    setPatientName(patient.name);
    setPatientAddress(patient.address);
    setContactNumber(patient.phone);
    setEmail(patient.email);
    setDob(patient.dob);
    setIsSuggestionClicked(true); 
    setSuggestions([]);


    try {

      const res = await getAPICall(`/api/patient-details/${patient.id}`);
      console.log("res",res);
      
      console.log("✅ Selected Patient Full Details:", res.data);
      // setSelectedPatient(res.data.patient);
      setLastBill(res?.last_bill || []);
      sethealthdirectives(res?.health_directives|| []);
      setpatientExaminations(res?.patient_examinations|| []);
      setShowPatientCard(true);

    } catch (err) {
      console.error("❌ Error fetching patient full details", err);
      setShowPatientCard(false);
    }


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




const handleSubmit = async () => {
  if (!validateForm()) return;
  if (!validateRows(rows)) return;

  const today = new Date();
  const dobDate = new Date(dob);
  if (dobDate >= today) {
    alert('Date of birth cannot be in the future.');
    return;
  }

  

  try {
    const patientId = data?.patient?.id;

    console.log("patientId",patientId);
    let skipAddPatient = false;

    // if (patientId , patientSuggestionId) {
    //   console.log("patientSuggestionId",patientSuggestionId);
      
    //   // 🔍 Check in both patient and token tables
    //   const patientRes = await post('/api/checkPatient', { id: patientId ?? patientSuggestionId });  // { id: patientId ?? patientId }
    //   console.log("patientRes",patientRes);
      
    //   const tokenRes = await post('/api/checkToken', { patient_id: patientSuggestionId });
    //   console.log("tokenRes",tokenRes);

    //   if (patientRes.exists || tokenRes.exists) {
    //     console.log('✅ Patient already exists (patients or token).');
    //     skipAddPatient = true;
    //   }
    // }
    if (patientSuggestionId) {
      // 👇 Check suggestion-based patient in both tables
      console.log("🔍 Checking patientSuggestionId:", patientSuggestionId);
    
      const patientRes = await post('/api/checkPatient', { id: patientSuggestionId });
      const tokenRes = await post('/api/checkToken', { patient_id: patientSuggestionId });
    
      console.log("patientRes:", patientRes);
      console.log("tokenRes:", tokenRes);
    
      if (patientRes.exists || tokenRes.exists) {
        console.log("✅ Suggestion patient already exists — skipping add.");
        skipAddPatient = true;
      }
    } else if (patientId) {
      // 👇 Check token-based patient ID
      console.log("🔍 Checking token-based patientId:", patientId);
    
      const tokenRes = await post('/api/checkToken', { patient_id: patientId });
    
      console.log("tokenRes:", tokenRes);
    
      if (tokenRes.exists) {
        console.log("✅ Token patient already exists — skipping add.");
        skipAddPatient = true;
      }
    }

    // ➕ Add patient only if ID doesn't exist in both tables
    if (!skipAddPatient && (!patientId || (patientId && (!data?.patient?.fromSuggestion)))) {
      const newPatientData = {

        clinic_id: "CLINIC123", // Replace with dynamic clinic_id
        doctor_id: userData.id || "1",
        name: patientName,
        email,
        phone,
        address: patientAddress,
        dob,
      };

      try {
        const added = await post('/api/manuallyAddPatient', newPatientData);    // /api/manuallyAddPatient
        console.log("✅ Patient added:", added?.patient?.id);
          manualPatientID = added?.patient?.id;
       

      } catch (e) {
        console.error("❌ Failed to add patient:", e);
        alert("Error adding patient.");
        return;
      }
    }

    const billData = {
      patient_id: patientSuggestionId || data?.patient?.id  || manualPatientID ||'not get tokan',
      patient_name: data?.patient?.name || patientName,
      address: data?.patient?.address || patientAddress,
      email: data?.patient?.email || email,
      contact: data?.patient?.phone || `91${phone}`,
      dob: data?.patient?.dob || dob,
      doctor_name: d_name,
      registration_number: r_num,
      visit_date: visitDate,
      grand_total: grandTotal,
    };

    // 💳 Continue with bill creation...
    const billResponse = await post('/api/bills', billData);
    const billno = billResponse.id;
    setBillId(billno);

    const descriptionData = rows.map(row => ({
      bill_id: `${billno}`,
      description: `${row.description}`,
      quantity: `${row.quantity}`,
      price: `${row.price}`,
      gst: `${row.gst}`,
      total: `${row.total}`
    }));
    await post('/api/descriptions', { descriptions: descriptionData });

    // 💊 Prescriptions
    if (validateRowss()) {
      const prescriptionPromises = rowss.map((row) => {
        const prescriptionData = {
          p_p_i_id: `${billno}`,
          patient_id: patientSuggestionId || data?.patient?.id  || manualPatientID ||'not get Patien ID',
          medicine: medicines.find(med => med.id === parseInt(row.description, 10))?.drug_name || "",
          strength: row.strength,
          dosage: row.dosage,
          timing: row.timing,
          frequency: row.frequency,
          duration: row.duration,
        };
        return post("/api/healthdirectives", prescriptionData);
      });

      await Promise.all(prescriptionPromises);
    }

    // 🧪 Examinations
    if (bp || pulse || pastHistory || complaints || sysExGeneral || sysExPA || weight || height) {
      const patientExaminationData = {
        p_p_i_id: `${billno}`,
        patient_id: patientSuggestionId || data?.patient?.id  || manualPatientID ||'not get patient ID',
        bp,
        pulse,
        weight,
        height,
        past_history: pastHistory,
        complaints,
        systemic_exam_general: sysExGeneral,
        systemic_exam_pa: sysExPA,
      };
      await post('/api/patientexaminations', patientExaminationData);
    }

    // alert('Bill and descriptions created successfully!');
    showToast('Bill and descriptions created successfully!', 'Successfully Submitted', '#198754');
    navigate('/Invoice', { state: { billId: billno } });

  } catch (error) {
    console.error('Error in handleSubmit:', error);
    // alert('An error occurred while submitting data.');
    showToast('An error occurred while submitting data.', 'Validation Error', '#d9534f');
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
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [pulse, setPulse] = useState("");
  const [pastHistory, setPastHistory] = useState("");
  const [complaints, setComplaints] = useState("");
  const [sysExGeneral, setSysExGeneral] = useState("");
  const [sysExPA, setSysExPA] = useState("");
  

  const [doctorObservationSettings, setDoctorObservationSettings] = useState(null);

  

  // useEffect(() => {
  //   const fetchObservationSettings = async () => {
  //     try {
  //       const doctorId = userData.user.id;
  //       const res = await getAPICall(`/api/doctor-medical-observations/${doctorId}`);
  //       console.log("✅ Observation settings fetched:", res);
  
  //       const normalized = Object.fromEntries(
  //         Object.entries(res).map(([key, val]) => [key, Boolean(Number(val))])
  //       );
  
  //       setDoctorObservationSettings(normalized);
  //     } catch (error) {
  //       console.error("❌ Error fetching observation settings:", error);
  //     }
  //   };
  
  //   fetchObservationSettings();
  // }, [userData]);
useEffect(() => {
  if (!userData?.user?.id) return;

  const fetchObservationSettings = async () => {
    try {
      const doctorId = userData.user.id;
      const res = await getAPICall(`/api/doctor-medical-observations/${doctorId}`);
      console.log("✅ Observation settings fetched:", res);

      const normalized = Object.fromEntries(
        Object.entries(res).map(([key, val]) => [key, Boolean(Number(val))])
      );

      setDoctorObservationSettings(normalized);
    } catch (error) {
      console.error("❌ Error fetching observation settings:", error);
    }
  };

  fetchObservationSettings();
}, [userData?.user?.id]); // 👈 Run only when doctorId is available

  
  
  

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

const[TokanPatientID,setTokanPatientID] = useState();
console.log(TokanPatientID);


  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Fetch data based on ID and selected option
  // const handleFetchData = async () => {
  //   if (!inputValue) {
  //     alert('Please enter an ID!');
  //     return;
  //   }

  //   try {
  //     // Determine endpoint based on dropdown option
  //     const endpoint =
  //       selectedOption === 'Appointment'
  //         ? `/api/appointments/${inputValue}` // Replace with your real Appointment API endpoint
  //         : `/api/getPatientInfo`;

  //     // Make API call
  //     const response = await post(endpoint, { tokan_number: inputValue });
  //      console.log("ggfff",response.patient.id);

  //     // Set the fetched data
  //     setData(response);
  //     setTokanPatientID(response.patient.id)
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     alert('Failed to fetch data. Please check the ID and try again.');
  //     setData(null); // Clear data on error
  //   }


  //   try {
  //     const res = await getAPICall(`/api/patient-details/${TokanPatientID}`); // Use selected patient's ID
  //     console.log("✅ Selected Patient Full Details:", res.data);
  
  //     setLastBill(res?.last_bill);
  //     sethealthdirectives(res?.health_directives || []);
  //     setpatientExaminations(res?.patient_examinations || []);
  
  //   } catch (err) {
  //     console.error("❌ Error fetching patient full details", err);
  //   }


  // };
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
      const patientId = response?.patient?.id;
  
      if (!patientId) {
        throw new Error("Patient ID not found in response.");
      }
  
      console.log("✅ Patient ID:", patientId);
  
      // Set the fetched data
      setData(response);
      setTokanPatientID(patientId); // still store it if you want elsewhere
  
      // 🔥 Use the ID directly here
      const res = await getAPICall(`/api/patient-details/${patientId}`);
      console.log("✅ Selected Patient :", res);
  
      setLastBill(res?.last_bill);
      sethealthdirectives(res?.health_directives || []);
      setpatientExaminations(res?.patient_examinations || []);

      setShowPatientCard(true);

    } catch (error) {
      console.error('❌ Error fetching patient full details', error);
      alert('Failed to fetch data. Please check the ID and try again.');
      setData(null); // Clear data on error
      setShowPatientCard(false); // Hide on error
    }
  };
  
  





// ----------------------------------------------------------------------------------------------------- 



const [selectedOption, setSelectedOption] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState(null);
  console.log("data",data);
  

  // Handle dropdown selection
  const handleDropdownSelect = async (option) => {

    setSelectedOption(option);
    setInputValue(''); // Reset input field
    setData(null);     // Clear previous data
  // console.log("option",option.id);
  
  };
  










  return (
    <>


  
{/* <CCard className="mb-3  shadow-md rounded-2xl border border-gray-200"> */}
 

  {/* <CCardBody className="bg-white"> */}
    <CForm> 
      <div className="flex flex-wrap gap-3 items-center mb-3">
        {/* Visit Type Buttons */}
        <CButton
          color={selectedOption === "Token" ? "primary" : "light"}
          shape="rounded-pill"
          onClick={() => handleDropdownSelect("Token")}
          className="border border-blue-500 text-blue-700 hover:bg-blue-50 shadow-sm"
        >
          Token
        </CButton>&nbsp;&nbsp;

        <CButton
          color={selectedOption === "Appointment" ? "primary" : "light"}
          shape="rounded-pill"
          onClick={() => handleDropdownSelect("Appointment")}
          className="border border-green-500 text-green-700 hover:bg-green-50 shadow-sm"
        >
          Appointment
        </CButton> &nbsp;&nbsp;

        <CButton
          color={selectedOption === "Default" ? "primary" : "light"}
          shape="rounded-pill"
          // onClick={() => handleDropdownSelect("Default")}
          className="border border-green-500 text-green-700 hover:bg-green-50 shadow-sm"
        >
     Default
        </CButton> &nbsp;&nbsp;



        {selectedOption && (
    <CButton
      onClick={() => {
        setSelectedOption("");
        setInputValue("");
      }}
      color="danger"
      variant="ghost"
      shape="rounded-pill"
      size="sm"
      className="text-lg font-bold px-2"
      title="Clear"
    >
      ✕
    </CButton>
  )}




        {/* Input + Submit */}
        {selectedOption && (
  <CRow className="mt-3">
    <CCol sm={12} md={6} lg={4}>
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full">
        <CFormInput
          type="text"
          placeholder={`Enter ${selectedOption} ID`}
          value={inputValue}
          onChange={handleInputChange}
          className="flex-1 min-w-[200px] border-gray-300 shadow-sm"
        />
      </div>
    </CCol>
    <CCol sm={12} md={6} lg={4}>
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full">
        <CButton color="success" className="whitespace-nowrap text-white" onClick={handleFetchData}>
          Submit
        </CButton>
      </div>
    </CCol>
  </CRow>
)}

      </div>
    </CForm>
  {/* </CCardBody> */}
{/* </CCard> */}







  <CRow className="p-3">
    {/* Row 1: Patient Name & Address */}
    <CCol xs={12} md={6}  className="d-flex align-items-start mb-3" style={{ position: 'relative' }}>
  <CFormLabel className="me-2 mb-0" style={{ fontWeight: 'bold', minWidth: '120px' }}>
    Patient Name
  </CFormLabel>

  {/* Wrapper around input + suggestion */}
  <div style={{ width: '100%', position: 'relative' }}>
    <CFormInput
      value={patientName || data?.patient?.name || ''}
      onChange={(e) => setPatientName(e.target.value)}
      placeholder="Enter patient name"
      required
    />

    {/* Suggestions dropdown */}
    {Array.isArray(suggestions) && suggestions.length > 0 && !selectedPatient && (
      <CListGroup
        className="shadow"
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 9999,
          maxHeight: '200px',
          overflowY: 'auto',
          backgroundColor: '#fff',
        }}
      >
        {suggestions.map((patient) => (
          <CListGroupItem
            key={patient.id}
            onClick={() => handleSuggestionClick(patient)}
            style={{ cursor: 'pointer' }}
          >
            {patient.name}
          </CListGroupItem>
        ))}
      </CListGroup>
    )}

    {/* Validation Error */}
    {errors.patientName && <div style={{ color: 'red' }}>{errors.patientName}</div>}
  </div>
</CCol>


    <CCol xs={12} md={6} className="d-flex align-items-center mb-3">
      <CFormLabel className="me-2 mb-0" style={{fontWeight:'bold', minWidth: '120px' }}>Patient Address</CFormLabel>
      <CFormInput
        value={patientAddress || data?.patient?.address || ''}
        // value={data?.patient?.address}
        onChange={(e) => setPatientAddress(e.target.value)}
        placeholder="Full Address / Pincode"
        required
      />
      {errors.patientAddress && <div style={{ color: 'red' }}>{errors.patientAddress}</div>}
    </CCol>

    {/* <h1>Grand Total: {lastBill?.grand_total}</h1> */}


    {/* Row 2: Contact | Email | DOB | Visit Date */}
    
    <CRow className="">
      
  <CCol xs={12} md={6} lg={3}>
    <CFormLabel htmlFor="phone" className="fw-bold">Mobile Number</CFormLabel>
    <CFormInput
      id="phone"
      type="tel"
      value={phone || data?.patient?.phone || ''}
      onChange={(e) => setContactNumber(e.target.value)}
      onInput={(e) => {
        if (e.target.value.length > 10) {
          e.target.value = e.target.value.slice(0, 10);
        }
      }}
      placeholder="Enter contact number"
      required
    />
    {errors.phone && <div className="text-danger">{errors.phone}</div>}
  </CCol>

  <CCol xs={12} md={6} lg={3}>
    <CFormLabel htmlFor="email" className="fw-bold">Email</CFormLabel>
    <CFormInput
      id="email"
      type="email"
      value={email || data?.patient?.email || ''}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter email address"
      required
    />
    {errors.email && <div className="text-danger">{errors.email}</div>}
  </CCol>




  <CCol xs={12} md={6} lg={3}  className='ms-3'>
    <CFormLabel htmlFor="dob" className="fw-bold">Patient DOB</CFormLabel>
    <CFormInput
      id="dob"
     
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

        if (year >= 1900 && selectedDate <= currentDate) {
          setDob(input);
          if (errors.dob) {
            setErrors((prev) => ({ ...prev, dob: "" }));
          }
        } else {
          setDob("");
          setErrors((prev) => ({
            ...prev,
            dob: "Please enter a valid DOB (not in the future & after 1900).",
          }));
        }
      }}
      max={new Date().toISOString().split("T")[0]}
      placeholder="Enter patient DOB"
      required
    />
    {errors.dob && <div className="text-danger">{errors.dob}</div>}
  </CCol>

  <CCol xs={12} md={6} lg={2} className='ms-3'>
    <CFormLabel htmlFor="visitDate" className="fw-bold">Visit Date</CFormLabel>
    <CFormInput
      id="visitDate"
      type="date"
      value={visitDate}
      onChange={(e) => setVisitDate(e.target.value)}
      max={new Date().toISOString().split("T")[0]}
      required
    />
    {errors.visitDate && <div className="text-danger">{errors.visitDate}</div>}
  </CCol>

</CRow>

  </CRow>
{/* </CCard> */}


{/* Old Bill Displyed POP up */}

{/* {showPatientCard && lastBill && (
  <>
    {healthdirectives.map((directive, index) => {
      const exam = patientExaminations[index];
      const bill = lastBill[index];
      return (
        <CAlert key={index} color="success" className="p-2 rounded-md shadow-md mb-2 border border-secondary">

        Bill Visit Date
        {bill && (
            <div className="mb-2 text-dark">
              <strong>Visit Date:</strong> {bill.visit_date}
            </div>
          )}

          Health Directive
          <div className="mb-2">
            <div className="d-flex flex-wrap gap-4 text-dark">
         
              <div><strong>Medicine:</strong> {directive.medicine}</div>
              <div><strong>Frequency:</strong> {directive.frequency}</div>
              <div><strong>Duration:</strong> {directive.duration}</div>
            </div>
          </div>

          {exam && (
            <div>
              <div className="d-flex flex-wrap gap-3 text-dark">
                <div><strong>Blood Pressure:</strong> {exam.bp}</div>
                <div><strong>Pulse:</strong> {exam.pulse}</div>
                <div><strong>Past History:</strong> {exam.past_history}</div>
                <div><strong>Complaints:</strong> {exam.complaints}</div>
              </div>
            </div>
          )}

          
        </CAlert>
      );
    })}
  </>
)} */}
{showPatientCard && lastBill && lastBill.map((bill, index) => {
  // Filter directives and examinations that match this bill's ID
  const directivesForBill = healthdirectives.filter(d => d.p_p_i_id == bill.id);
  const examsForBill = patientExaminations.filter(e => e.p_p_i_id == bill.id);

  return (
    <CAlert key={index} color="success" className="p-3 rounded-md shadow-md mb-3 border border-secondary">
      {/* Visit Date */}
      <div className="mb-2 text-dark">
        <strong>Visit Date:</strong> {bill.visit_date}
      </div>

      {/* Health Directives */}
      {directivesForBill.length > 0 && (
        <>
          <div className="mb-2 text-dark"><strong>Health Directives</strong></div>
          {directivesForBill.map((directive, dIndex) => (
            <div key={dIndex} className="border-bottom pb-2 mb-2">
              <div className="d-flex flex-wrap gap-4 text-dark">
                <div><strong>Medicine:</strong> {directive.medicine}</div>
                {/* <div><strong>Strength:</strong> {directive.strength}</div> */}
                {/* <div><strong>Dosage:</strong> {directive.dosage}</div>
                <div><strong>Timing:</strong> {directive.timing}</div> */}
                <div><strong>Frequency:</strong> {directive.frequency}</div>
                <div><strong>Duration:</strong> {directive.duration}</div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Patient Examination */}
      {examsForBill.length > 0 && examsForBill.map((exam, eIndex) => (
        <div key={eIndex} className="mt-2">
          <div className="mb-2 text-dark"><strong>Examination</strong></div>
          <div className="d-flex flex-wrap gap-3 text-dark">
            <div><strong>Blood Pressure:</strong> {exam.bp}</div>
            <div><strong>Pulse:</strong> {exam.pulse}</div>
            <div><strong>Past History:</strong> {exam.past_history}</div>
            <div><strong>Complaints:</strong> {exam.complaints}</div>
          </div>
        </div>
      ))}
    </CAlert>
  );
})}








      {/* Medical Observations Section */}
  {/* <CCard className="mb-1">
    <CCardHeader className="d-flex justify-content-between align-items-center" >
      <span > <h5>Medical Observations</h5></span>
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
        <CRow className="mb-1">
          <CCol>
          <CFormLabel style={{fontWeight:'bold'}}>BP</CFormLabel>
            <CFormInput  value={bp} onChange={(e) => setBp(e.target.value)} />
          </CCol>
          <CCol>
          <CFormLabel style={{fontWeight:'bold'}}>Pulse</CFormLabel>
            <CFormInput  value={pulse} onChange={(e) => setPulse(e.target.value)} />
          </CCol>
        </CRow>
        <CRow className="mb-1">
          <CCol xs={12} sm={6}>
          <CFormLabel style={{fontWeight:'bold'}}>Past History</CFormLabel>
            <CFormInput  value={pastHistory} onChange={(e) => setPastHistory(e.target.value)} />
          </CCol>
        
          <CCol xs={12} sm={6}>
          <CFormLabel style={{fontWeight:'bold'}}>Complaints</CFormLabel>
            <CFormInput value={complaints} onChange={(e) => setComplaints(e.target.value)} />
          </CCol>
        </CRow>
        <CRow className="mb-1">
          <CCol xs={12} sm={6}>
          <CFormLabel style={{fontWeight:'bold'}}>Systemic Examination - General</CFormLabel>
            <CFormInput  value={sysExGeneral} onChange={(e) => setSysExGeneral(e.target.value)} />
          </CCol>
          <CCol xs={12} sm={6}>
          <CFormLabel style={{fontWeight:'bold'}}>Diagnosis</CFormLabel>
            <CFormInput  value={sysExPA} onChange={(e) => setSysExPA(e.target.value)} />
          </CCol>
        </CRow>
      </CCardBody>
    )}
  </CCard> */}
 <div className="d-flex justify-content-start lign-items-center mb-3">
  <div className="d-flex align-items-center gap-2">
    <CIcon icon={cilFile} className="text-primary" size="lg" /> &nbsp;
    <h6 className="mb-0 fw-semibold">Medical Observations</h6>&nbsp;&nbsp;
  </div>
  <CButton
    color="success"
    variant="outline"
    shape="rounded-pill"
    className="d-flex align-items-center gap-1 px-3 py-1 border rounded shadow-sm"
    onClick={toggleForm}
  >
    <span className="fs-5 text-dark" >{isExpanded ? '−' : '+'}</span>
    <span className="fw-medium text-dark"  >
      {isExpanded ? 'Close' : 'Add Observation'}
    </span>
  </CButton>
</div>

{/* {isExpanded && (
  <div className="p-2">
    <CRow className="mb-2">
      <CCol xs={12} sm={6}>
        <div className="d-flex align-items-center">
          <CFormLabel className="fw-bold mb-0 me-2" style={{ width: '130px' }}>
            BP
          </CFormLabel>
          <CFormInput className="flex-grow-1" value={bp} onChange={(e) => setBp(e.target.value)} />
        </div>
      </CCol>
      <CCol xs={12} sm={6}>
        <div className="d-flex align-items-center">
          <CFormLabel className="fw-bold mb-0 me-2" style={{ width: '130px' }}>
            Pulse
          </CFormLabel>
          <CFormInput className="flex-grow-1" value={pulse} onChange={(e) => setPulse(e.target.value)} />
        </div>
      </CCol>
    </CRow>

    <CRow className="mb-2">
      <CCol xs={12} sm={6}>
        <div className="d-flex align-items-center">
          <CFormLabel className="fw-bold mb-0 me-2" style={{ width: '130px' }}>
            Past History
          </CFormLabel>
          <CFormInput className="flex-grow-1" value={pastHistory} onChange={(e) => setPastHistory(e.target.value)} />
        </div>
      </CCol>
      <CCol xs={12} sm={6}>
        <div className="d-flex align-items-center">
          <CFormLabel className="fw-bold mb-0 me-2" style={{ width: '130px' }}>
            Complaints
          </CFormLabel>
          <CFormInput className="flex-grow-1" value={complaints} onChange={(e) => setComplaints(e.target.value)} />
        </div>
      </CCol>
    </CRow>

    <CRow className="mb-2">
      <CCol xs={12} sm={6}>
        <div className="d-flex align-items-center">
          <CFormLabel className="fw-bold mb-0 me-2" style={{ width: '130px' }}>
            Systemic Examination 
          </CFormLabel>
          <CFormInput className="flex-grow-1" value={sysExGeneral} onChange={(e) => setSysExGeneral(e.target.value)} />
        </div>
      </CCol>
      <CCol xs={12} sm={6}>
        <div className="d-flex align-items-center">
          <CFormLabel className="fw-bold mb-0 me-2" style={{ width: '130px' }}>
            Diagnosis
          </CFormLabel>
          <CFormInput className="flex-grow-1" value={sysExPA} onChange={(e) => setSysExPA(e.target.value)} />
        </div>
      </CCol>
    </CRow>
  </div>
)} */}

{isExpanded && doctorObservationSettings && (
  <div className="p-2">
    <CRow className="mb-2">
      {doctorObservationSettings.bp && (
        <CCol xs={12} sm={6}>
          <CFormLabel className="fw-bold">BP</CFormLabel>
          <CFormInput value={bp} onChange={(e) => setBp(e.target.value)} />
        </CCol>
      )}

      {doctorObservationSettings.weight && (
        <CCol xs={12} sm={6}>
          <CFormLabel className="fw-bold">Weight</CFormLabel>
          <CFormInput value={weight} onChange={(e) => setWeight(e.target.value)} />
        </CCol>
      )}
      {doctorObservationSettings.height && (
        <CCol xs={12} sm={6}>
          <CFormLabel className="fw-bold">Height</CFormLabel>
          <CFormInput value={height} onChange={(e) => setHeight(e.target.value)} />
        </CCol>
      )}
      {doctorObservationSettings.pulse && (
        <CCol xs={12} sm={6}>
          <CFormLabel className="fw-bold">Pulse</CFormLabel>
          <CFormInput value={pulse} onChange={(e) => setPulse(e.target.value)} />
        </CCol>
      )}
    </CRow>

    <CRow className="mb-2">
      {doctorObservationSettings.past_history && (
        <CCol xs={12} sm={6}>
          <CFormLabel className="fw-bold">Past History</CFormLabel>
          <CFormInput value={pastHistory} onChange={(e) => setPastHistory(e.target.value)} />
        </CCol>
      )}
      {doctorObservationSettings.complaint && (
        <CCol xs={12} sm={6}>
          <CFormLabel className="fw-bold">Complaints</CFormLabel>
          <CFormInput value={complaints} onChange={(e) => setComplaints(e.target.value)} />
        </CCol>
      )}
    </CRow>

    <CRow className="mb-2">
      {doctorObservationSettings.systemic_examination && (
        <CCol xs={12} sm={6}>
          <CFormLabel className="fw-bold">Systemic Examination</CFormLabel>
          <CFormInput value={sysExGeneral} onChange={(e) => setSysExGeneral(e.target.value)} />
        </CCol>
      )}
      {doctorObservationSettings.diagnosis && (
        <CCol xs={12} sm={6}>
          <CFormLabel className="fw-bold">Diagnosis</CFormLabel>
          <CFormInput value={sysExPA} onChange={(e) => setSysExPA(e.target.value)} />
        </CCol>
      )}
    </CRow>
  </div>
)}



       <div>
  

  {/* Prescriptions Section */}
  {!showTable && (
<>
<div className="d-flex justify-content-start lign-items-center mb-3">
<div className="d-flex align-items-center gap-2">
  <CIcon icon={cilMedicalCross} className="text-primary" size="lg" /> &nbsp;
  <h6 className="mb-0 fw-semibold">Medical Prescriptions</h6>&nbsp;&nbsp;
</div>
<CButton
  color="success"
  variant="outline"
  shape="rounded-pill"
  className="d-flex align-items-center gap-1 px-3 py-1 border rounded shadow-sm"
  onClick={() => setShowTable(true)}
>
  <span className="fs-5 text-dark" >{showTable ? '−' : '+'}</span>
  <span className="fw-medium text-dark" >
    {showTable ? 'Close' : 'Add Prescriptions'}
  </span>
</CButton>
</div>


    {/* <CButton style={{ backgroundColor: '#89dee2' }} className="mt-2 mb-2" onClick={() => setShowTable(true)}>
     <h6>Add Prescriptions</h6> 
    </CButton> */}
    </>
  )}

{showTable && (
<>
<div className="d-flex justify-content-start mb-2">
<CButton   onClick={() => setShowTable(false)}  
   color="danger"
   variant="outline"
   shape="rounded-pill"
   className="d-flex align-items-center gap-1 px-3 py-1 border rounded shadow-sm text-white bg-danger"
  >
   Remove Section
</CButton>
</div>
  <CCardBody className="rounded shadow-sm bg-white p-2 mt-2 border border-gray-200">
    {/* Remove Button */}
    

    {/* Table */}
    <CTable
  responsive
  className="table-borderless align-middle"
  style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}
>
  <CTableHead className="bg-light text-center text-nowrap text-dark fw-semibold">
    <CTableRow>
      {['Medicine', 'Strength', 'Dosage', 'Timing', 'Frequency', 'Duration', 'Actions'].map((header) => (
        <CTableHeaderCell key={header} className="px-1 py-1" style={{ width: `${100 / 7}%` }}>
          {header}
        </CTableHeaderCell>
      ))}
    </CTableRow>
  </CTableHead>

  <CTableBody>
    {rowss.map((row, index) => (
      <CTableRow key={index} className="bg-white  rounded">
        {/* Medicine */}
        <CTableDataCell className="px-2 py-2">
          <div style={{ position: 'relative' }}>
            <CFormInput
              type="text"
              value={medicineSearch[index] || ''}
              onChange={(e) => handleMedicineSearch(index, e.target.value)}
              placeholder="Search medicine..."
              autoComplete="off"
            />
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
                      handleRowChangee(index, 'description', medicine.id);
                      handleMedicineChange(index, medicine.id);
                      setMedicineSearch((prev) => ({ ...prev, [index]: medicine.drug_name }));
                      setMedicineOptions((prev) => ({ ...prev, [index]: [] }));
                    }}
                  >
                    {medicine.drug_name}
                  </div>
                ))}
              </div>
            )}
            {rowErrors[index]?.description && <div className="text-danger">{rowErrors[index].description}</div>}
          </div>
        </CTableDataCell>

        {/* Strength */}
        <CTableDataCell className="px-2 py-3">
          <CFormInput
            value={row.strength}
            onChange={(e) => {
              handleRowChangee(index, "strength", e.target.value);
              toggleSuggestion(index, "showStrength", true);
            }}
            onFocus={() => toggleSuggestion(index, "showStrength", true)}
            placeholder="Strength"
            disabled={!row.description}
          />
          {suggestionFlags[index]?.showStrength &&
            row.drugDetails?.filter((d) => d.drug_id === parseInt(row.description, 10))?.slice(0, 5).map((drug, i) => (
              <div
                key={i}
                className="position-absolute w-10 bg-white border shadow-sm mt-1 px-2 py-1 rounded cursor-pointer"
                // style={{ zIndex: 2000 }}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f1f1f1',
                  transition: 'background 0.2s ease',
                }}
                onClick={() => {
                  handleRowChangee(index, "strength", drug.strength);
                  toggleSuggestion(index, "showStrength", false);
                }}
              >
                {drug.strength}
              </div>
            ))}
          {rowErrors[index]?.strength && <div className="text-danger">{rowErrors[index].strength}</div>}
        </CTableDataCell>

        {/* Dosage */}
        <CTableDataCell className="px-2 py-3">
          <CFormInput
            value={row.dosage}
            onChange={(e) => {
              const raw = e.target.value.replace(/-/g, '').trim();
              const only01 = raw.replace(/[^01]/g, '').slice(0, 3);
              const formatted = only01.length === 3 ? `${only01[0]}-${only01[1]}-${only01[2]}` : only01;
              handleRowChangee(index, 'dosage', formatted);
            }}
            placeholder="e.g. 1-0-1"
            maxLength={5}
          />
          {rowErrors[index]?.dosage && <div className="text-danger">{rowErrors[index].dosage}</div>}
        </CTableDataCell>

        {/* Timing */}
        <CTableDataCell className="px-2 py-3">
          <CFormSelect value={row.timing} onChange={(e) => handleRowChangee(index, 'timing', e.target.value)}>
            <option value="">Select</option>
            <option value="After Food">After Food</option>
            <option value="Before Food">Before Food</option>
          </CFormSelect>
          {rowErrors[index]?.timing && <div className="text-danger">{rowErrors[index].timing}</div>}
        </CTableDataCell>

        {/* Frequency */}
        <CTableDataCell className="px-2 py-3">
          <CFormSelect value={row.frequency} onChange={(e) => handleRowChangee(index, 'frequency', e.target.value)}>
            <option value="">Select</option>
            <option value="Daily">Daily</option>
            <option value="SOS">SOS</option>
          </CFormSelect>
          {rowErrors[index]?.frequency && <div className="text-danger">{rowErrors[index].frequency}</div>}
        </CTableDataCell>

        {/* Duration */}
        <CTableDataCell className="px-2 py-3">
          {row.isCustom ? (
            <CFormInput
              value={row.duration}
              placeholder="Custom"
              onChange={(e) => handleRowChangee(index, 'duration', e.target.value)}
            />
          ) : (
            <CFormSelect
              value={row.duration}
              onChange={(e) => {
                const val = e.target.value;
                handleRowChangee(index, 'isCustom', val === 'SOS');
                handleRowChangee(index, 'duration', val === 'SOS' ? '' : val);
              }}
            >
              <option value="">Select</option>
              {['3 Days', '5 Days', '7 Days', '15 Days', '30 Days', 'SOS'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </CFormSelect>
          )}
        </CTableDataCell>

        {/* Actions */}
        <CTableDataCell className="px-2 py-2">
          <div className="d-flex justify-content-center gap-3">
          <CButton color="danger" size="sm" ><CIcon onClick={() => handleRemoveRoww(index)} disabled={index === 0} icon={cilDelete} className="text-white "  /></CButton> 
            <CButton color="success" size="sm" > <CIcon onClick={handleAddRoww} icon={cilPlus} className="text-white " /></CButton>
          </div>
        </CTableDataCell>
      </CTableRow>
    ))}
  </CTableBody>
</CTable>

  </CCardBody>
  </>
)}

</div>






     
{/* Descriptions */}
      {/* <CCard className="mb-4"> */}
      <CCard className="mb-3 mt-2 px-3 py-3">
  <CRow>
    <CTable hover responsive className='table-borderless'>
      <CTableHead className="text-center text-sm font-semibold bg-light">
        <CTableRow>
          {['Description', 'Quantity', 'Fees', 'GST (%)', 'Total', 'Actions'].map((header, idx) => (
            <CTableHeaderCell key={idx} style={{ width: '16.66%' }} className="px-2 py-2">
              {header}
            </CTableHeaderCell>
          ))}
        </CTableRow>
      </CTableHead>

      <CTableBody>
        {rows.map((row, index) => (
          <CTableRow key={index} className="align-middle text-center">
            {/* Description */}
            <CTableDataCell style={{ width: '16.66%' }}>
              <CFormSelect
                className="text-center"
                value={row.description}
                onChange={(e) => handleRowChange(index, 'description', e.target.value)}
              >
                <option value="Consulting">Consulting</option>
                <option value="Medicine">Medicine</option>
                <option value="OPD">OPD</option>
              </CFormSelect>
            </CTableDataCell>

            {/* Quantity */}
            <CTableDataCell style={{ width: '16.66%' }}>
              <CFormInput
                type="text"
                className="text-center"
                value={row.quantity}
                onChange={(e) => handleRowChange(index, 'quantity', Math.max(0, Number(e.target.value)))}
                onFocus={() => handleRowChange(index, 'quantity', '')}
              />
              {rowErrors[index]?.quantity && (
                <div className="text-danger small">{rowErrors[index].quantity}</div>
              )}
            </CTableDataCell>

            {/* Fees */}
            <CTableDataCell style={{ width: '16.66%' }}>
              <CFormInput
                type="number"
                className="text-center"
                value={row.price}
                onChange={(e) => handleRowChange(index, 'price', Number(e.target.value))}
                onFocus={() => handleRowChange(index, 'price', '')}
              />
              {rowErrors[index]?.price && (
                <div className="text-danger small">{rowErrors[index].price}</div>
              )}
            </CTableDataCell>

            {/* GST */}
            <CTableDataCell style={{ width: '16.66%' }}>
              <CFormInput
                type="text"
                className="text-center"
                value={row.gst}
                onChange={(e) => handleRowChange(index, 'gst', Number(e.target.value))}
                onFocus={() => handleRowChange(index, 'gst', '')}
              />
            </CTableDataCell>

            {/* Total */}
            <CTableDataCell style={{ width: '16.66%' }} className="fw-bold">
              ₹{row.total.toFixed(2)}
            </CTableDataCell>

            {/* Actions */}
            <CTableDataCell style={{ width: '16.66%' }}>
              <div className="d-flex justify-content-center gap-3">

              <CButton color="danger" size="sm" ><CIcon  onClick={() => handleRemoveRow(index)} icon={cilDelete} className="text-white "  /></CButton> 

                {/* <CButton
                  color="danger"
                  variant="ghost"
                  className="me-2 rounded-circle d-flex align-items-center justify-content-center"
                  onClick={() => handleRemoveRow(index)}
                  disabled={index === 0}
                  style={{ width: '36px', height: '36px' }}
                >
                  <CIcon icon={cilMinus} size="lg" />
                </CButton> */}

                <CButton color="success" size="sm" > <CIcon  onClick={handleAddRow} icon={cilPlus} className="text-white " /></CButton>

                {/* <CButton
                  color="success"
                  variant="ghost"
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  onClick={handleAddRow}
                  style={{ width: '36px', height: '36px' }}
                >
                  <CIcon icon={cilPlus} size="lg" />
                </CButton> */}
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


// --------------------- 




// const handleSubmit = async () => {

 
//   if (!validateForm()) return; 
//   if (validateRows(rows)) {

//     const today = new Date();
//     const dobDate = new Date(dob);
//     if (dobDate >= today) {
//       alert('Date of birth cannot be in the future.');
//       return;
//     }

//   const billData = {
//       patient_name:  data?.patient?.name  ||  patientName,                //    data.patient.name
//       address:  data?.patient?.address || patientAddress  ,                  //    data.patient.address
//       email: data?.patient?.email ||  email ,                             //    data.patient.email
//       contact: data?.patient?.phone || `91${phone}`,                    //    phone, data.patient.phone
//       dob:     data?.patient?.dob ||  dob,                           //    data.patient.dob,
//       doctor_name: d_name,
//       registration_number: r_num,
//       visit_date: visitDate,
//       grand_total:grandTotal,
//   };

//   try {
//       // First API call: Create Bill
//       const billResponse = await post('/api/bills', billData);
//       console.log('Bill Response:', billResponse); // Log the entire response


//       const dcid = billResponse.doctor_id;
//       console.log('for doctor id',dcid);

//       const billno = billResponse.id; // Get the bill ID
//       setBillId(billno);

//       // Prepare description data with the bill ID
//       const descriptionData = rows.map(row => ({
//           bill_id: `${billno}` || '',
//           description: `${row.description}` || '',
//           quantity: `${row.quantity}` || '',
//           price: `${row.price}` || '',
//           gst: `${row.gst}` || '',
//           total: `${row.total}` || ''
//       }));

//       // Log description data before sending
//       console.log('Description Data:', descriptionData);

//       // Second API call: Submit Descriptions
//       const descriptionResponse = await post('/api/descriptions', { descriptions: descriptionData });

//       navigate('/Invoice', { state: { billId: billno } });
      
      


    
    
//     alert('Bill and descriptions created successfully');



// // -------------------------------------------------------------------------------------------- 
// // Post Data Into Health Directive Table


// if (validateRowss()) {
//   try {
//     const prescriptionPromises = rowss.map((row) => {
//       const prescriptionData = {
//         p_p_i_id: `${billno}`, // Replace with dynamic bill number
//         medicine: medicines.find(med => med.id === parseInt(row.description, 10))?.drug_name || "",
//         strength: row.strength,
//         dosage: row.dosage,
//         timing: row.timing,
//         frequency: row.frequency,
//         duration: row.duration,
//       };

//       console.log("Prescription Data:", prescriptionData);
//       return post("/api/healthdirectives", prescriptionData);
//     });

//     const prescriptionResponses = await Promise.all(prescriptionPromises);
//     console.log("Prescription Responses:", prescriptionResponses);
//   } catch (error) {
//     console.error("Error submitting prescriptions:", error);
//   }
// } else {
//   console.error("Validation errors:", rowErrors);
// }




// if (bp || pulse || pastHistory || complaints || sysExGeneral || sysExPA) {
//   const patientExaminationData = {
//     p_p_i_id: `${billno}`,
//     bp,
//     pulse,
//     past_history: pastHistory,
//     complaints,
//     systemic_exam_general: sysExGeneral,  // Change to match Laravel
//     systemic_exam_pa: sysExPA,
//   };

//   const examinationResponse = await post('/api/patientexaminations', patientExaminationData);
//   console.log('Examination Response:', examinationResponse);
// }


// // ----------------------------------------------------------------------------------------------------- 



// const existingPatientResponse = await post('/api/checkPatient', {
//   id: data.patient.id, // Replace with the unique field you're using
// });
      

//     const patientExists = existingPatientResponse.exists;

//     // If patient does not exist in suggestions, add them as a new patient
//     if (!patientExists) {
//       const newPatientData = {
//         name: patientName ,                   //data.patient.name,
//         address: patientAddress,                  //data.patient.address,
//         email:  email,                 // data.patient.email,
//         phone:   phone,                // data.patient.phone,
//         dob:    dob                 //data.patient.dob,
//       };
  
//       try {
//         const patientResponse = await post('/api/patients', newPatientData);
//         console.log('New Patient added:', patientResponse);
//         alert('New patient added successfully!');
//       } catch (error) {
//         console.error('Error adding new patient:', error);
//         alert('Failed to add new patient');
//         return;
//       }
//     }
   
//   } catch (error) {
//       console.error('Error creating bill or descriptions:', error);

//   }
//   }

// };



// 5️⃣ Check and Create Patient if Not Exists
    // const patientId = data?.patient?.id || null;
    // console.log('Checking patient with ID:', patientId);

    // let patientExists = false;

    // if (patientId) {
    //   const existingPatientResponse = await post('/api/checkPatient', { id: patientId });
    //   console.log('Check Patient API Response:', existingPatientResponse);
    //   patientExists = existingPatientResponse.exists;
    // }

    // if (!patientExists) {
    //   const newPatientData = {

    //     name: patientName,
    //     address: patientAddress,
    //     email: email,
    //     phone: phone,
    //     dob: dob,
        
    //   };

    //   try {
    //     const patientResponse = await post('/api/patientsss', newPatientData);
    //     console.log('New Patient added:', patientResponse);
    //     alert('New patient added successfully!');
    //   } catch (error) {
    //     console.error('Error adding new patient:', error);
    //     alert('Failed to add new patient');
    //     return;
    //   }
    // }

    
// const handleSubmit = async () => {
//   if (!validateForm()) return;
//   if (!validateRows(rows)) return;

//   const today = new Date();
//   const dobDate = new Date(dob);
//   if (dobDate >= today) {
//     alert('Date of birth cannot be in the future.');
//     return;
//   }

//   const billData = {
//     patient_name: data?.patient?.name || patientName,
//     address: data?.patient?.address || patientAddress,
//     email: data?.patient?.email || email,
//     contact: data?.patient?.phone || `91${phone}`,
//     dob: data?.patient?.dob || dob,
//     doctor_name: d_name,
//     registration_number: r_num,
//     visit_date: visitDate,
//     grand_total: grandTotal,
//   };

//   try {
//     // 1️⃣ Create Bill
//     const billResponse = await post('/api/bills', billData);
//     console.log('Bill Response:', billResponse);

//     const billno = billResponse.id;
//     setBillId(billno);

//     // 2️⃣ Submit Descriptions
//     const descriptionData = rows.map(row => ({
//       bill_id: `${billno}`,
//       description: `${row.description}`,
//       quantity: `${row.quantity}`,
//       price: `${row.price}`,
//       gst: `${row.gst}`,
//       total: `${row.total}`
//     }));
//     console.log('Description Data:', descriptionData);

//     await post('/api/descriptions', { descriptions: descriptionData });

//     // 3️⃣ Submit Health Directives (Prescriptions)
//     if (validateRowss()) {
//       const prescriptionPromises = rowss.map((row) => {
//         const prescriptionData = {
//           p_p_i_id: `${billno}`,
//           medicine: medicines.find(med => med.id === parseInt(row.description, 10))?.drug_name || "",
//           strength: row.strength,
//           dosage: row.dosage,
//           timing: row.timing,
//           frequency: row.frequency,
//           duration: row.duration,
//         };
//         console.log("Prescription Data:", prescriptionData);
//         return post("/api/healthdirectives", prescriptionData);
//       });

//       const prescriptionResponses = await Promise.all(prescriptionPromises);
//       console.log("Prescription Responses:", prescriptionResponses);
//     } else {
//       console.error("Validation errors in prescriptions:", rowErrors);
//     }

//     // 4️⃣ Submit Patient Examination Data
//     if (bp || pulse || pastHistory || complaints || sysExGeneral || sysExPA) {
//       const patientExaminationData = {
//         p_p_i_id: `${billno}`,
//         bp,
//         pulse,
//         past_history: pastHistory,
//         complaints,
//         systemic_exam_general: sysExGeneral,
//         systemic_exam_pa: sysExPA,
//       };
//       const examinationResponse = await post('/api/patientexaminations', patientExaminationData);
//       console.log('Examination Response:', examinationResponse);
//     }




    

//     alert('Bill and descriptions created successfully!');
//     navigate('/Invoice', { state: { billId: billno } });

//   } catch (error) {
//     console.error('Error in handleSubmit:', error);
//     alert('An error occurred while submitting data.');
//   }
// };

{/* <CTableHead>
            <CTableRow>
              <CTableHeaderCell style={{ width: '10%' }}>Medicine</CTableHeaderCell>
              <CTableHeaderCell style={{ width: '10%' }}>Strength</CTableHeaderCell>
              <CTableHeaderCell style={{ width: '10%' }}>Dosage</CTableHeaderCell>
              <CTableHeaderCell style={{ width: '10%' }}>Timing</CTableHeaderCell>
              <CTableHeaderCell style={{ width: '10%' }}>Frequency</CTableHeaderCell>
              <CTableHeaderCell style={{ width: '10%' }}>Duration</CTableHeaderCell>
              <CTableHeaderCell style={{ width: '10%' }}>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead> */}

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



//                 {showPatientCard && (
//   <>
//     {lastBill?.[0] && (
//       <CAlert color="success" className="p-2 rounded-md shadow-md mb-2 border border-secondary">
//         <div className="mb-2 text-dark">
//           <strong>Visit Date:</strong> {lastBill[0].visit_date}
//         </div>
//       </CAlert>
//     )}

//     {healthdirectives.length > 0 && healthdirectives.map((directive, index) => (
//       <CAlert key={`directive-${index}`} color="success" className="p-2 rounded-md shadow-md mb-2 border border-secondary">
//         <div className="mb-2 text-dark">
//           <strong>Health Directive</strong>
//         </div>
//         <div className="d-flex flex-wrap gap-4 text-dark">
//           <div><strong>Medicine:</strong> {directive.medicine}</div>
//           <div><strong>Frequency:</strong> {directive.frequency}</div>
//           <div><strong>Duration:</strong> {directive.duration}</div>
//         </div>
//       </CAlert>
//     ))}

//     {patientExaminations.length > 0 && patientExaminations.map((exam, index) => (
//       <CAlert key={`exam-${index}`} color="success" className="p-2 rounded-md shadow-md mb-2 border border-secondary">
//         <div className="mb-2 text-dark">
//           <strong>Examination</strong>
//         </div>
//         <div className="d-flex flex-wrap gap-3 text-dark">
//           <div><strong>Blood Pressure:</strong> {exam.bp}</div>
//           <div><strong>Pulse:</strong> {exam.pulse}</div>
//           <div><strong>Past History:</strong> {exam.past_history}</div>
//           <div><strong>Complaints:</strong> {exam.complaints}</div>
//         </div>
//       </CAlert>
//     ))}
//   </>
// )}