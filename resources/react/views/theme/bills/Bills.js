import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useLocation } from 'react-router-dom';
import Select from 'react-select'
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
  CAlert,
  CFormCheck,
  CInputGroupText
} from '@coreui/react';
// import axios from 'axios'; // Make sure to import axios
import { getAPICall, post, postFormData } from '../../../util/api';
import { getUser } from '../../../util/session';
import { showToast } from '../toastContainer/toastContainer'; 
import { cilFile, cilMedicalCross, cilDelete, cilPlus, cilMinus, cilClock, cilCalendar, cilSettings, cilInfo, cilSearch, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { FaMinus, FaPlus } from 'react-icons/fa';


const Typography = () => {

const today = new Date().toISOString().split('T')[0];
  
const user = getUser();
console.log("user",user.consulting_fee);


  const location = useLocation();
  const { formDataa } = location.state || {};
  // console.log("data",formDataa?.occupation);



  const navigate = useNavigate(); // Initialize useNavigate
  const [rows, setRows] = useState([
    { description: 'Consulting', quantity: 0, price: user?.consulting_fee || 0, gst: 0, total: 0 }
  ]);
  
  const [patientName, setPatientName] = useState(formDataa?.patient_name || '');
  const [patientAddress, setPatientAddress] = useState(formDataa?.patient_address || '');
  const [email, setEmail] = useState(formDataa?.patient_email || '');
  const [phone, setContactNumber] = useState((formDataa?.patient_contact || ''));
  const [dob, setDob] = useState(formDataa?.patient_dob || '');

  //Occupation and Pincode
  const [Occupation, setoccupation] = useState(formDataa?.occupation || '');
  const [Pincode, setpincode] = useState(formDataa?.pincode || '');



  const [patientSuggestionId, setPatientSuggestionId] = useState(null);
  const [lastBill , setLastBill] = useState([{}]);
// console.log("lastBill",lastBill);
const [healthdirectives , sethealthdirectives ] = useState([{}]);
// console.log("lastBill",healthdirectives);

const [showPatientCard, setShowPatientCard] = useState(false);

const [patientExaminations , setpatientExaminations ] = useState([{}]);

const [AyurvedicExaminations , setayurvedicExaminations ] = useState([{}]);

  const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");

  let manualPatientID = null;

  
  const [billId, setBillId] = useState('');
  const [visitDate, setVisitDate] = useState(formDataa?.visit_date || today);
  const [patientAge, setPatientAge] = useState('');
  const [doctor_name, setDoctorName] = useState('');
  const [registration_number, setRegistration] = useState('');
  const [suggestionFlags, setSuggestionFlags] = useState({});
  
  const [followupdate, setfollowupdate] = useState();
  
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
    setoccupation(patient.occupation);
    setpincode(patient.pincode);
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
      setayurvedicExaminations(res?.ayurvedic_examintion|| []);
      setShowPatientCard(true);

    } catch (err) {
      console.error("❌ Error fetching patient full details", err);
      setShowPatientCard(false);
    }


  };



// ------------------------------------------------------------------------------------------------------------------



 
  // console.log(user);

  // const handleRowChange = (index, field, value) => {
  //   const updatedRows = [...rows];

  //   if (field === 'quantity' || field === 'price' || field === 'gst') {
  //     // Check if the value is a valid number and integer
  //     if (!Number.isInteger(Number(value)) || isNaN(value)) {
  //       value = 0; // Reset to 0 if not a valid integer
  //     }
  //   }

  //   updatedRows[index][field] = value;

  //   const quantity = Number(updatedRows[index].quantity || 0);
  //   const price = Number(updatedRows[index].price || 0);
  //   const gst = Number(updatedRows[index].gst || 0);
  //   updatedRows[index].total = (quantity * price) + ((quantity * price * gst) / 100);


 


  //   setRows(updatedRows);


  //   const errors = [...rowErrors];
  //   if (field === 'quantity' || field === 'price' || field === 'gst') {
  //     errors[index] = {
  //       quantity: field === 'quantity' && !Number.isInteger(Number(value)) ? 'Only integers allowed' : '',
  //       price: field === 'price' && !Number.isInteger(Number(value)) ? 'Only integers allowed' : '',
  //       gst: field === 'gst' && !Number.isInteger(Number(value)) ? 'Only integers allowed' : ''
  //     };
  //   }
  //   setRowErrors(errors);

  // };

  const [selectedMedicine , setSelectedMedicine] = useState()
  console.log(selectedMedicine);
  

const handleRowChange = (index, field, value) => {
  const updatedRows = [...rows];


    if (field === 'description' && value === 'Medicine') {
    // Assuming you store selected medicine data in `selectedMedicine`
    if (selectedMedicine && selectedMedicine.price) {
      updatedRows[index].price = parseFloat(selectedMedicine.price);
    }
  }


  if (field === 'quantity' || field === 'price' || field === 'gst') {
    // Validate number
    if (!Number.isInteger(Number(value)) || isNaN(value)) {
      value = 0;
    }
  }

 

  // Always update the field (even if it will be overridden below)
  updatedRows[index][field] = value;

  const description = updatedRows[index].description;
  const quantity = description === 'Medicine' ? rowss.length : parseFloat(updatedRows[index].quantity) || 0;
  const price = description === 'Medicine' ? totalPrice : parseFloat(updatedRows[index].price) || 0;
  const gst = parseFloat(updatedRows[index].gst) || 0;

  // Calculate total
  let subtotal = 0;
  if (description === 'Medicine') {
    subtotal = totalPrice;
  } else {
    subtotal = quantity * price;
    if (showGST) {
      subtotal += subtotal * (gst / 100);
    }
  }

  // Set corrected values
  updatedRows[index].quantity = quantity;
  updatedRows[index].price = price;
  updatedRows[index].total = subtotal;

  setRows(updatedRows);

  // Error handling
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


const handleMedicineSelect = (medicine, index) => {
  const updatedRows = [...rowss];
  updatedRows[index].description = 'Medicine';
  updatedRows[index].price = parseFloat(medicine.price); // Set price
  updatedRows[index].medicine = medicine; // Optional, store full object
  updatedRows[index].quantity = 1; // Optional default

  updatedRows[index].total = parseFloat(medicine.price); // Total equals price for medicine

  setRowss(updatedRows);
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
    if (!data?.patient?.name && !data?.appointment?.name && !patientName.trim()) {
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
      price: "",
      drugDetails: [],
    },
  ]);
console.log(rowss);



const totalPrice = rowss.reduce((acc, row) => {

  // let value = row.drugDetails?.[0]?.price;
   let value = row.price || row.drugDetails?.[0]?.price;
  console.log(value);
  

  // If empty or invalid, fallback to drugDetails[0]?.price
  if (!value || isNaN(parseFloat(value))) {
    value = row.drugDetails?.[0]?.price;
    
  }
  console.log(value);
  

  const price = parseFloat(value);
  return acc + (isNaN(price) ? 0 : price);
}, 0);






const handleSubmit = async () => {
  if (!validateForm()) return;
  if (!validateRows(rows)) return;
 
   // Only validate prescription fields if the section is open
  if (showTable && !validateAllFields()) {
    return; // Stop submission if prescription validation fails
  }
  

  const today = new Date();
  const dobDate = new Date(dob);
  if (dobDate >= today) {
    alert('Date of birth cannot be in the future.');
    return;
  }

  

  try {
    const patientId = data?.patient?.id;
      const tokenNumber = data?.tokan; // this is only present when selectedOption === 'Appointment'


    console.log("patientId",patientId);
    let skipAddPatient = false;

  
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
    } 
    else if (selectedOption === 'Appointment' && tokenNumber) {
    // 🆕 Handle appointment-based token number → check patient by phone from token
    console.log("🔍 Checking via tokan:", tokenNumber);

    const tokenRes = await post('/api/checkToken', { tokan: tokenNumber });
    console.log("tokenRes (via token):", tokenRes);
    const appointmentPatientId = tokenRes.patient_id;

    if (tokenRes.exists) {
      console.log("✅ Token patient already exists — skipping add.");
      skipAddPatient = true;
    }
  }
    else if (patientId) {
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
        name: patientName || data?.appointment?.name,
        email,
        phone:data?.appointment?.phone,
        address: patientAddress,
        dob,
       occupation :  Occupation,
        pincode:Pincode
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
      patient_id: patientSuggestionId || data?.patient?.id  || manualPatientID || appointmentPatientId ||'not get tokan',
      patient_name: data?.patient?.name || patientName || data?.appointment?.name,
      address: data?.patient?.address || patientAddress,
      email: data?.patient?.email || email,
      contact: data?.patient?.phone || data?.appointment?.phone ||`91${phone}`,
      dob: data?.patient?.dob || dob,
      occupation: data?.patient?.occupation || Occupation,
      pincode: data?.patient?.pincode || Pincode,
      doctor_name: d_name,
      registration_number: r_num,
      visit_date: visitDate,
      followup_date: followupdate,
      grand_total: grandTotal,
    };

    // 💳 Continue with bill creation...
    const billResponse = await post('/api/bills', billData);
    const billno = billResponse.id;
    setBillId(billno);

    // const descriptionData = rows.map(row => ({
    //   bill_id: `${billno}`,
    //   description: `${row.description}`,
    //   quantity: `${row.quantity}`,
    //   price:  `${row.price}`,        //`${row.price}` , 
    //   gst: `${row.gst}`,
    //   total: `${row.total}`
    // }));
    // await post('/api/descriptions', { descriptions: descriptionData });

    const descriptionData = rows.map((row) => ({
  bill_id: `${billno}`,
  description: row.description,
  quantity: row.quantity,
  price: row.price,
  gst: row.gst,
  total: row.total,
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


    const hasPatientExamData = bp || pulse || pastHistory || complaints || sysExGeneral || sysExPA || weight || height;

    const hasAyurvedicDiagnosisData =  emaill || ayurPastHistory || prasavvedanParikshayein ||
  habits || labInvestigation || personalHistory || foodAndDrugAllergy || lmp || edd;

  

//     if (bp || pulse || pastHistory || complaints || sysExGeneral || sysExPA || weight || height) {
//       const patientExaminationData = {
//         p_p_i_id: `${billno}`,
//         patient_id: patientSuggestionId || data?.patient?.id  || manualPatientID ||'not get patient ID',
//         bp,
//         pulse,
//         weight,
//         height,
//         past_history: pastHistory,
//         complaints,
//         systemic_exam_general: sysExGeneral,
//         systemic_exam_pa: sysExPA,
//       };


//         const ayurvedicDiagnosisData = {
//   p_p_i_id: `${billno}`,
//   patient_id: patientSuggestionId || data?.patient?.id || manualPatientID || 'not get Patient ID',
//   occupation: occupation || "",
//   pincode: pincode || "",
//   email: emaill || "", // corrected: match state variable `emaill`
//   past_history: ayurPastHistory || "",
//   prasavvedan_parikshayein: prasavvedanParikshayein || "",
//   habits: habits || "",
//   lab_investigation: labInvestigation || "",
//   personal_history: personalHistory || "",
//   food_and_drug_allergy: foodAndDrugAllergy || "",
//   lmp: lmp || "",
//   edd: edd || ""
// };


// const payload = {
//   ...patientExaminationData,
//   ...ayurvedicDiagnosisData,
// };

//       await post('/api/patientexaminations',payload );
//     }

if (hasPatientExamData || hasAyurvedicDiagnosisData) {
  const patientExaminationData = hasPatientExamData
    ? {
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
      }
    : {};

  const ayurvedicDiagnosisData = hasAyurvedicDiagnosisData
    ? {
        p_p_i_id: `${billno}`,
        patient_id: patientSuggestionId || data?.patient?.id  || manualPatientID ||'not get patient ID',
        // occupation: occupation || "",
        // pincode: pincode || "",
        email: emaill || "",
        ayurPastHistory: ayurPastHistory || "",
        prasavvedan_parikshayein: JSON.stringify(ashtvidhData) || "",
        habits: JSON.stringify(habits) || "",
        lab_investigation: labInvestigation || "",
        personal_history: JSON.stringify(personalHistory) || "",
        food_and_drug_allergy: foodAndDrugAllergy || "",
        drug_allery:drugAllergy|| "",
        lmp: lmp || "",
        edd: edd || ""
      }
    : {};

  const payload = {
    ...patientExaminationData,
    ...ayurvedicDiagnosisData,
  };

  await post('/api/patientexaminations', payload);
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



console.log(totalPrice);
console.log("Rows", rows);
console.log("Total Price", totalPrice);





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
        price:"",
        drugDetails: [],
      },
    ]);
  };



  // Handle removing a row
  const handleRemoveRoww = (index) => {
    // Prevent removing the first row
  // if (index === 1) {
  //   return;
  // }

  // Use the correct state variable 'rowss' for filtering
  const updatedRows = rowss.filter((_, i) => i !== index);
  setRowss(updatedRows);
  };



  // Handle row change
  const [activeEditableRowIndex, setActiveEditableRowIndex] = useState(null);
  const handleRowChangee = (index, field, value) => {
    const updatedRows = [...rowss];
    updatedRows[index][field] = value;
    setRowss(updatedRows);

  };
 


  // State for medical observations
  // const [isExpanded, setIsExpanded] = useState(false);
  // const toggleForm = () => setIsExpanded(!isExpanded);

  const [isMedicalExpanded, setIsMedicalExpanded] = useState(false);
const [isAyurvedicExpanded, setIsAyurvedicExpanded] = useState(false);

const toggleMedicalForm = () => setIsMedicalExpanded(!isMedicalExpanded);
const toggleAyurvedicForm = () => setIsAyurvedicExpanded(!isAyurvedicExpanded);


  const [bp, setBp] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [pulse, setPulse] = useState("");
  const [pastHistory, setPastHistory] = useState("");
  const [complaints, setComplaints] = useState("");
  const [sysExGeneral, setSysExGeneral] = useState("");
  const [sysExPA, setSysExPA] = useState("");

  // Ayurvedic Observation
//   const [occupation, setOccupation] = useState('');
// const [pincode, setPincode] = useState('');
const [emaill, setEmaill] = useState('');
const [ayurPastHistory, setAyurPastHistory] = useState('');
const [prasavvedanParikshayein, setPrasavvedanParikshayein] = useState('');

const [labInvestigation, setLabInvestigation] = useState('');
// const [personalHistory, setPersonalHistory] = useState('');
const [foodAndDrugAllergy, setFoodAndDrugAllergy] = useState('');
  const [drugAllergy, setDrugAllergy] = useState('')

const [lmp, setLmp] = useState('');
const [edd, setEdd] = useState('');

  

  const [doctorObservationSettings, setDoctorObservationSettings] = useState(null);
  const [doctorAyurvedicObservationSettings, setDoctorAyurvedicObservationSettings] = useState(null);

  

 
// useEffect(() => {
//   if (!userData?.user?.id) return;

//   const fetchObservationSettings = async () => {
//     try {
//       const doctorId = userData.user.id;
//       const res = await getAPICall(`/api/doctor-medical-observations/${doctorId}`);         //  ${doctorId}
//       console.log("✅ Observation settings fetched:", res);

//       const normalized = Object.fromEntries(
//         Object.entries(res).map(([key, val]) => [key, Boolean(Number(val))])
//       );

//       setDoctorObservationSettings(normalized);
//       setDoctorAyurvedicObservationSettings(normalized)
//     } catch (error) {
//       console.error("❌ Error fetching observation settings:", error);
//     }
//   };

//   fetchObservationSettings();
// }, [userData?.user?.id]); // 👈 Run only when doctorId is available
useEffect(() => {
  if (!userData?.user?.id) return;

  const fetchObservationSettings = async () => {
    try {
      const doctorId = userData.user.id;
      const res = await getAPICall(`/api/doctor-medical-observations/${doctorId}`);
      console.log("✅ Observation settings fetched:", res);

      // Normalize each group separately
      const normalizedMedical = Object.fromEntries(
        Object.entries(res.medical_observations || {}).map(
          ([key, val]) => [key, Boolean(Number(val))]
        )
      );

      const normalizedAyurvedic = Object.fromEntries(
        Object.entries(res.ayurvedic_observations || {}).map(
          ([key, val]) => [key, Boolean(Number(val))]
        )
      );

      setDoctorObservationSettings(normalizedMedical);
      setDoctorAyurvedicObservationSettings(normalizedAyurvedic);
    } catch (error) {
      console.error("❌ Error fetching observation settings:", error);
    }
  };

  fetchObservationSettings();
}, [userData?.user?.id]);

  
  
  

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
  console.log(drugDetails);
  

   // Fetch drug details based on selected drug
   const handleMedicineChange = async (index, drugId) => {
    try {
      const responsee = await getAPICall(`/api/drugdetails/drug_id/${drugId}`);
      setDrugDetails(responsee);
      console.log(responsee);
      
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
const [appointment, setAppointment] = useState()


  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  
  const handleFetchData = async () => {
    if (!inputValue) {
      alert('Please enter an ID!');
      return;
    }
  
//   try {
//   let response, patientId;

//   if (selectedOption === 'Appointment') {
//     const endpoint = `/api/getAppointmentByToken/${inputValue}`;
//     response = await getAPICall(endpoint); // use GET
//     console.log(response.name);
//     setAppointment

//     console.log("📩 Appointment API Response:", response);

//     // If patient_id exists => it's a registered patient
//     patientId = response?.patient_id;

//     setData(response);
//     setTokanPatientID(patientId || null);

//     if (patientId) {
//       // ✅ Registered patient — fetch full details
//       const res = await getAPICall(`/api/patient-details/${patientId}`);
//       console.log("✅ Selected Patient:", res);

//       setLastBill(res?.last_bill);
//       sethealthdirectives(res?.health_directives || []);
//       setpatientExaminations(res?.patient_examinations || []);
//       setayurvedicExaminations(res?.ayurvedic_examintion || []);
//     } else {
//       // 🆕 New patient from appointment — just show basic info
//       setLastBill(null);
//       sethealthdirectives([]);
//       setpatientExaminations([]);
//       setayurvedicExaminations([]);
//     }

//     setShowPatientCard(true);

//   } else {
//     // Handle token patient (token flow remains the same)
//     const endpoint = `/api/getPatientInfo`;
//     response = await post(endpoint, { tokan_number: inputValue });

//     patientId = response?.patient?.id;

//     if (!patientId) {
//       throw new Error("❌ Patient ID not found in token response.");
//     }

//     setData(response);
//     setTokanPatientID(patientId);

//     const res = await getAPICall(`/api/patient-details/${patientId}`);
//     console.log("✅ Selected Token Patient:", res);

//     setLastBill(res?.last_bill);
//     sethealthdirectives(res?.health_directives || []);
//     setpatientExaminations(res?.patient_examinations || []);
//     setayurvedicExaminations(res?.ayurvedic_examintion || []);

//     setShowPatientCard(true);
//   }

// } catch (error) {
//   console.error('❌ Error fetching patient full details', error);
//   showToast('Failed to fetch data. Please check the ID and try again.', 'Validation Error', '#d9534f');
//   setData(null);
//   setShowPatientCard(false);
// }


try {
  let response, patientId;
    let skipAddPatient = false;

  if (selectedOption === 'Appointment') {
    const endpoint = `/api/getAppointmentByToken/${inputValue}`;
    response = await getAPICall(endpoint); // use GET
    console.log("📩 Appointment API Response:", response);

    // ✅ Step 1: Check if patient already exists via checkToken
    const tokenRes = await post('/api/checkToken', { tokan: inputValue });
    console.log("tokenRes (via token):", tokenRes);
    const appointmentPatientId = tokenRes.patient_id;
    console.log(appointmentPatientId);
    

    if (tokenRes.exists) {
      console.log("✅ Token patient already exists — skipping add.");
      skipAddPatient = true;
    }

    // ✅ Step 2: Use existing patient ID if found
    patientId = appointmentPatientId || response?.patient_id;

    // ✅ Step 3: If no patient_id and we have phone, fallback to phone match
    if (!patientId && response?.phone) {
      const phoneOnly10Digits = response.phone.slice(-10);

      try {
        const matchResponse = await getAPICall(`/api/findByPhone/${phoneOnly10Digits}`);
        if (matchResponse?.patient?.id) {
          patientId = matchResponse.patient.id;

          setLastBill(matchResponse?.last_bill || []);
          sethealthdirectives(matchResponse?.health_directives || []);
          setpatientExaminations(matchResponse?.patient_examinations || []);
          setayurvedicExaminations(matchResponse?.ayurvedic_examintion || []);
        }
      } catch (error) {
        console.warn("ℹ️ No patient match found by phone.");
      }
    }

    // ✅ Step 4: Save data and patient ID
    setData(response);
    setTokanPatientID(patientId || null);

    // ✅ Step 5: Fetch full patient details if patientId exists
    if (patientId) {
      const res = await getAPICall(`/api/patient-details/${patientId}`);
      console.log("✅ Selected Patient:", res);

      setLastBill(res?.last_bill || []);
      sethealthdirectives(res?.health_directives || []);
      setpatientExaminations(res?.patient_examinations || []);
      setayurvedicExaminations(res?.ayurvedic_examintion || []);
    } else {
      setLastBill([]);
      sethealthdirectives([]);
      setpatientExaminations([]);
      setayurvedicExaminations([]);
    }

    setShowPatientCard(true);
  } else {
    // ✅ Token flow or other option remains unchanged
    const endpoint = `/api/getPatientInfo`;
    response = await post(endpoint, { tokan_number: inputValue });

    patientId = response?.patient?.id;

    if (!patientId) {
      throw new Error("❌ Patient ID not found in token response.");
    }

    setData(response);
    setTokanPatientID(patientId);

    const res = await getAPICall(`/api/patient-details/${patientId}`);
    console.log("✅ Selected Token Patient:", res);

    setLastBill(res?.last_bill || []);
    sethealthdirectives(res?.health_directives || []);
    setpatientExaminations(res?.patient_examinations || []);
    setayurvedicExaminations(res?.ayurvedic_examintion || []);
    setShowPatientCard(true);
  }
} catch (error) {
  console.error("❌ Error fetching patient full details", error);
  showToast('Failed to fetch data. Please check the ID and try again.', 'Validation Error', '#d9534f');
  setData(null);
  setShowPatientCard(false);
}






  };
  
  





// ----------------------------------------------------------------------------------------------------- 



const [selectedOption, setSelectedOption] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState(null);
  console.log("data",data?.name);
  

  // Handle dropdown selection
  const handleDropdownSelect = async (option) => {

    setSelectedOption(option);
    setInputValue(''); // Reset input field
    setData(null);     // Clear previous data
  // console.log("option",option.id);
  
  };
  




const [showAllHistory, setShowAllHistory] = useState(false);



const [showGST, setShowGST] = useState(true); 


useEffect(() => {
  const updatedRows = rows.map((row) => {
    if (row.description === 'Medicine') {
      const quantity = rowss.length;
      const price = totalPrice;
      let subtotal = totalPrice;

      if (showGST) {
        const gst = parseFloat(row.gst) || 0;
        subtotal += subtotal * (gst / 100);
      }

      return {
        ...row,
        quantity,
        price,
        total: subtotal
      };
    }
    return row;
  });

  setRows(updatedRows);
}, [rowss, totalPrice, showGST]);


const [expandedVisits, setExpandedVisits] = useState({}); // { [visitId]: true/false }
const [searchTerm, setSearchTerm] = useState('');
const toggleVisitExpansion = (visitId) => {
  setExpandedVisits(prev => ({ ...prev, [visitId]: !prev[visitId] }));
};

const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearchTerm(value);
  setShowAllHistory(!!value); // Show history only if search is not empty
  setExpandedVisits({}); // Collapse all visit data when input changes
};


// just checkin for demo perpose value

const [personalHistory, setPersonalHistory] = useState({
    diet: '',
    appetite: '',
    sleep: '',
    thirst: '',
    bowel: '',
    micturition: '',
  });

  const handleChange = (field, value) => {
    setPersonalHistory((prev) => ({ ...prev, [field]: value }));
  };
  const [showPersonalHistory, setShowPersonalHistory] = useState(false);

  const [showAshtvidh, setShowAshtvidh] = useState(false);
  // const [ashtvidhData, setAshtvidhData] = useState({
  //   nadi: '',
  //   jihva: '',
  //   mala: '',
  //   mutra: '',
  //   netra: '',
  //   aakruti: '',
  //   shabda: '',
  //   sparsha: '',
  // });
  const [ashtvidhData, setAshtvidhData] = useState({
  nadi: [],
  jihva: [],
  mala: [],
  mutra: [],
  netra: [],
  aakruti: [],
  shabda: [],
  sparsha: [],
});

  //  const handleAshtvidhChange = (field, value) => {
  //   setAshtvidhData((prev) => ({ ...prev, [field]: value }));
  // };
const handleAshtvidhChange = (key, value) => {
  setAshtvidhData((prev) => {
    const currentValues = prev[key] || [];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    return {
      ...prev,
      [key]: updatedValues,
    };
  });
};

const [showAllergyFields, setShowAllergyFields] = useState(false)
  

  const toggleFields = () => setShowAllergyFields(!showAllergyFields)
  

   const [showHabits, setShowHabits] = useState(false)
  const [habits, setHabits] = useState({
    alcohol: '',
    cold_drink: '',
    fast_food: '',
    salty_food: '',
    tobbacco: '',
    
    chocolate:'',
    drug_addict:'',
    late_night_sleep:'',
    smoking:'',
    coffee:'',
    eating_habits:'',
    pan_masala:'',
    tea:''
  });

  const handleHabitChange = (habitKey, value) => {
  setHabits((prevHabits) => {
    const currentValues = prevHabits[habitKey]
      ? prevHabits[habitKey].split(',').map((v) => v.trim())
      : []

    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]

    return {
      ...prevHabits,
      [habitKey]: updatedValues.join(', ')
    }
  })
}



// for Prescription shortout
const validateField = (index, fieldName) => {
  const row = rowss[index];
  const errors = { ...rowErrors };
  
  if (!errors[index]) errors[index] = {};
  
  switch (fieldName) {
    case 'description':
      // if (!row.description || !medicineSearch[index]) {
      //   errors[index].description = 'Medicine selection is required';
      // } else {
      //   delete errors[index].description;
      // }
      break;
      
    case 'strength':
      if (!row.strength) {
        errors[index].strength = 'Strength is required';
      } else {
        delete errors[index].strength;
      }
      break;
      
    case 'dosage':
     const trimmedDosage = String(row.dosage).trim();

if (!trimmedDosage) {
  errors[index].dosage = 'Dosage is required';
} else if (!/^[01]-[01]-[01]$/.test(trimmedDosage)) {
  errors[index].dosage = 'Invalid dosage format. Use format like 1-0-1';
} else {
  delete errors[index].dosage;
}
      break;
      
    case 'timing':
      if (!row.timing) {
        errors[index].timing = 'Timing is required';
      } else {
        delete errors[index].timing;
      }
      break;
      
    case 'frequency':
      if (!row.frequency) {
        errors[index].frequency = 'Frequency is required';
      } else {
        delete errors[index].frequency;
      }
      break;
      
    case 'duration':
      if (!row.duration) {
        errors[index].duration = 'Duration is required';
      } else {
        delete errors[index].duration;
      }
      break;
      
    case 'price':
      if (!row.price && !row.drugDetails?.[0]?.price) {
        errors[index].price = 'Price is required';
      } else {
        delete errors[index].price;
      }
      break;
  }
  
  // Clean up empty error objects
  if (Object.keys(errors[index]).length === 0) {
    delete errors[index];
  }
  
  setRowErrors(errors);
};

const clearFieldError = (index, fieldName) => {
  setRowErrors(prev => {
    const updated = { ...prev };
    if (updated[index]) {
      delete updated[index][fieldName];
      if (Object.keys(updated[index]).length === 0) {
        delete updated[index];
      }
    }
    return updated;
  });
};

// Call this function before form submission to validate all fields
const validateAllFields = () => {
  let hasErrors = false;
  const errors = {};
  
  rowss.forEach((row, index) => {
    const rowErrors = {};
    
    // if (!row.description || !medicineSearch[index]) {
    //   rowErrors.description = 'Medicine selection is required';
    //   hasErrors = true;
    // }
    
    if (!row.strength) {
      rowErrors.strength = 'Strength is required';
      hasErrors = true;
    }
    
   if (!row.dosage) {
  rowErrors.dosage = 'Dosage is required';
  hasErrors = true;
} else if (row.dosage.length !== 5 || !row.dosage.includes('-')) {
  rowErrors.dosage = 'Invalid dosage format. Use format like 1-0-1';
  hasErrors = true;
}

    
    if (!row.timing) {
      rowErrors.timing = 'Timing is required';
      hasErrors = true;
    }
    
    if (!row.frequency) {
      rowErrors.frequency = 'Frequency is required';
      hasErrors = true;
    }
    
    if (!row.duration) {
      rowErrors.duration = 'Duration is required';
      hasErrors = true;
    }
    
    if (!row.price && !row.drugDetails?.[0]?.price) {
      rowErrors.price = 'Price is required';
      hasErrors = true;
    }
    
    if (Object.keys(rowErrors).length > 0) {
      errors[index] = rowErrors;
    }
  });
  
  setRowErrors(errors);
  return !hasErrors;
};



const investigationOptions = [
  "Complete Haemogram", "CBC", "Hb", "WBC", "Platelet count", "Rh Type", "BT CT", "Mantour Test",
  "D Dimer", "ESR", "UPT", "Urine Routine", "PAP smear", "Sputum", "LFT", "KFT", "Urea", "Uric Acid",
  "Creatinine", "Total Cholesterol", "SGPT", "SGOT", "Blood Cuture", "Urine Culture", "Stool Culture",
  "HIV", "T3", "T4", "TSH", "Blood Glucose", "BSL Random", "BSL Fasting & PP", "HBA1C", "LH", "FSH",
  "Progesterone", "Estrogen", "Testosterone", "HSG", "HCG", "CRP", "HBSAG", "VDRL", "ASO", "RA",
  "ECG", "Urine Sugar", "Cancer Marker Test", "Blood Sugar"
].map(item => ({ label: item, value: item }));


const isActive = selectedOption === 'Appointment'
const isActive1 = selectedOption === 'Default'

  return (
    <>


  
{/* <CCard className="mb-3  shadow-md rounded-2xl border border-gray-200 p-4"> */}
 

  <CCardBody className="bg-grey border  rounded-4 p-4" 
  style={{
    background: 'linear-gradient(135deg, #e0f7fa, #f0fdf4)', // light cyan to light green
  }}
  >
    <CForm> 
      <div className="flex flex-wrap gap-3 items-center mb-2">
        {/* Visit Type Buttons */}
      <CRow className="mb-1">
  {/* 🔵 Token Card */}
  <CCol xs={12} sm={6} md={4}>
    <CCard
      onClick={() => handleDropdownSelect('Token')}
      className={`mb-2 shadow-sm border-2 ${selectedOption === 'Token' ? 'border-primary' : 'border-primary'}`}
      style={{
        borderRadius: '1rem',
        backgroundColor: selectedOption === 'Token' ? '#eaf3ff' : '#f8f9fa',
        transition: '0.3s ease',
        cursor: 'pointer',
      }}
    >
      <CCardBody className="d-flex align-items-center gap-3 py-2">
        <div
          className="d-flex align-items-center justify-content-center bg-white border border-primary"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
          }}
        >
          <CIcon icon={cilClock} size="lg" className="text-primary" />
        </div>
        <div>
          <div className="fw-semibold text-primary small">Token</div>
          <div className="text-medium-emphasis" style={{ fontSize: '0.75rem' }}>Quick token-based visit</div>
        </div>
      </CCardBody>
    </CCard>
  </CCol>

  {/* 🟢 Appointment Card */}
  <CCol xs={12} sm={6} md={4}>
    <CCard
      onClick={() => handleDropdownSelect('Appointment')}
      className={`mb-2 shadow-sm border-2 ${isActive ? 'border-success' : 'border-success'}`}
      style={{
        borderRadius: '1rem',
        backgroundColor: isActive ? '#d4f7e4' : '#f8f9fa',
        transition: '0.3s ease',
        cursor: 'pointer',
      }}
    >
      <CCardBody className="d-flex align-items-center gap-3 py-2">
        <div
          className="d-flex align-items-center justify-content-center bg-white border border-success"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
          }}
        >
          <CIcon icon={cilCalendar} size="lg" className="text-success" />
        </div>
        <div>
          <div className="fw-semibold text-success small">Appointment</div>
          <div className="text-medium-emphasis" style={{ fontSize: '0.75rem' }}>Scheduled appointment</div>
        </div>
      </CCardBody>
    </CCard>
  </CCol>

  {/* 🟣 Default Card */}
  <CCol xs={12} sm={6} md={4}>
    <CCard
      // onClick={() => handleDropdownSelect('Default')}
      className={`mb-2 shadow-sm border-2 ${isActive1 ? 'border-primary' : 'border-primary'}`}
      style={{
        borderRadius: '1rem',
        backgroundColor: isActive1 ? '#f6efff' : '#f8f9fa',
        transition: '0.3s ease',
        cursor: 'pointer',
      }}
    >
      <CCardBody className="d-flex align-items-center gap-3 py-2">
        <div
          className="d-flex align-items-center justify-content-center bg-white border border-primary"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
          }}
        >
          <CIcon icon={cilSettings} size="lg" style={{ color: '#8000ff' }} />
        </div>
        <div>
          <div className="fw-semibold" style={{ color: '#8000ff', fontSize: '0.95rem' }}>Default</div>
          <div className="text-medium-emphasis" style={{ fontSize: '0.75rem' }}>Default configuration</div>
        </div>
      </CCardBody>
    </CCard>
  </CCol>
</CRow>



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
      className=" fw-semibold text-lg font-bold px-0 p-2 ps-2 pe-2"
      title="Clear"
    >
      ✕ Clear Section
    </CButton>
  )}




        {/* Input + Submit */}
        {/* {selectedOption && (
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
)} */}
{selectedOption && (
  <>
    {/* 🔷 Token Input and Submit Button on same row */}
    <CRow className="mb-3 align-items-end">
      {/* Input Field */}
      <CCol md={6} lg={8}>
        <CFormLabel className="fw-semibold mb-1">{selectedOption} ID</CFormLabel>
        <CInputGroup>
          <CInputGroupText>
            <CIcon icon={cilUser} />
          </CInputGroupText>
          <CFormInput
            type="text"
            placeholder={`Enter ${selectedOption} ID`}
            value={inputValue}
            onChange={handleInputChange}
          />

        </CInputGroup>
        {/* <small className="text-muted ms-1">Enter the unique {selectedOption.toLowerCase()} identifier</small> */}
      </CCol>

      {/* Search Button */}
      <CCol md={6} lg={4}>
        <CButton
          color="success"
          className="w-100 py-2 d-flex align-items-center justify-content-center"
          style={{ borderRadius: '10px', fontWeight: 'bold' }}
          onClick={handleFetchData}
        >
          <CIcon icon={cilSearch} className="me-2" />
          Search Patient
        </CButton>
      </CCol>
    </CRow>

    {/* ℹ️ Info Alert Box */}
    {selectedOption === 'Token' && (
      <CCard
        className="border-0 shadow-sm"
        style={{ backgroundColor: '#e9f2ff', borderLeft: '5px solid #3182ce' }}
      >
        <CCardBody className="d-flex">
          <CIcon icon={cilInfo} className="text-primary me-3 mt-1" size="lg" />
          <div>
            <div className="fw-semibold text-primary mb-1">Token Information</div>
            <div className="text-muted">
              Token-based visits are processed in order of arrival. Please ensure the token number is valid.
            </div>
          </div>
        </CCardBody>
      </CCard>
    )}
  </>
)}


      </div>
    </CForm>
  </CCardBody>
{/* </CCard> */}






<div className="mb-2 mt-2   " 
style={{ backgroundColor: 'light' }}
>
<CRow className="p-3 space-y-3 md:space-y-0">
  {/* Patient Name */}
  <CCol xs={12} md={6}>
    <div className="flex flex-col md:flex-row items-start gap-2 relative">
      <CFormLabel className="fw-semibold min-w-[120px]">👤  Patient Name</CFormLabel>
      <div className="w-full relative">
        <CFormInput
          value={patientName || data?.patient?.name || data?.appointment?.name ||''}
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="Enter patient name"
          required
        />
        {/* Suggestions */}
        {Array.isArray(suggestions) && suggestions.length > 0 && !selectedPatient && (
          <CListGroup className="absolute top-full left-0 right-0 z-50 shadow bg-white rounded mt-1 max-h-48 overflow-y-auto">
            {suggestions.map((patient) => (
              <CListGroupItem
                key={patient.id}
                onClick={() => handleSuggestionClick(patient)}
                className="cursor-pointer text-sm py-2 border-0 border-b hover:bg-gray-100"
              >
                {patient.name}
              </CListGroupItem>
            ))}
          </CListGroup>
        )}
        {errors.patientName && (
          <div className="text-danger mt-1 text-sm">{errors.patientName}</div>
        )}
      </div>
    </div>
  </CCol>

  {/* Occupation */}
  <CCol xs={12} md={6}>
    <div className="flex flex-col md:flex-row items-start gap-2">
      <CFormLabel className="fw-semibold min-w-[120px]">💼 Occupation</CFormLabel>
      <div className="w-full">
        <CFormInput
          value={Occupation || data?.patient?.occupation || ''}
          onChange={(e) => setoccupation(e.target.value)}
          placeholder="Occupation"
          required
        />
        {errors.occupation && (
          <div className="text-danger mt-1 text-sm">{errors.occupation}</div>
        )}
      </div>
    </div>
  </CCol>

  {/* Contact Details */}
  <CCol xs={12} md={6} lg={3}>
    <CFormLabel className="fw-semibold">📱 Mobile Number</CFormLabel>
    <CFormInput
      type="tel"
      value={phone || data?.patient?.phone || data?.appointment?.phone || ''}          // (data?.phone ? data.phone.toString().substring(2) : '') 
      onChange={(e) => setContactNumber(e.target.value)}
      onInput={(e) => {
        if (e.target.value.length > 10) {
          e.target.value = e.target.value.slice(0, 10);
        }
      }}
      placeholder="Enter contact number"
      required
    />
    {errors.phone && <div className="text-danger mt-1 text-sm">{errors.phone}</div>}
  </CCol>

  <CCol xs={12} md={6} lg={3}>
    <CFormLabel className="fw-semibold">📧 Email</CFormLabel>
    <CFormInput
      type="email"
      value={email || data?.patient?.email || ''}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter email address"
      required
    />
    {errors.email && <div className="text-danger mt-1 text-sm">{errors.email}</div>}
  </CCol>

  <CCol xs={12} md={6} lg={3}>
    <CFormLabel className="fw-semibold">🎂 Patient DOB</CFormLabel>
    <CFormInput
      type="date"
      value={
        data?.patient?.dob
          ? new Date(data.patient.dob).toISOString().split('T')[0]
          : dob || ''
      }
      onChange={(e) => {
        const input = e.target.value;
        const selectedDate = new Date(input);
        const currentDate = new Date();
        const year = selectedDate.getFullYear();

        if (year >= 1900 && selectedDate <= currentDate) {
          setDob(input);
          if (errors.dob) {
            setErrors((prev) => ({ ...prev, dob: '' }));
          }
        } else {
          setDob('');
          setErrors((prev) => ({
            ...prev,
            dob: 'Please enter a valid DOB (not in the future & after 1900).',
          }));
        }
      }}
      max={new Date().toISOString().split('T')[0]}
      required
    />
    {errors.dob && <div className="text-danger mt-1 text-sm">{errors.dob}</div>}
  </CCol>

  <CCol xs={12} md={6} lg={3}>
    <CFormLabel className="fw-semibold">📅 Visit Date</CFormLabel>
    <CFormInput
      type="date"
      value={visitDate}
      onChange={(e) => setVisitDate(e.target.value)}
      max={new Date().toISOString().split('T')[0]}
      required
    />
    {errors.visitDate && <div className="text-danger mt-1 text-sm">{errors.visitDate}</div>}
  </CCol>

  {/* Patient Address */}
  <CCol xs={12} md={6}>
    <div className="flex flex-col md:flex-row items-start gap-2">
      <CFormLabel className="fw-semibold min-w-[120px]">🏠 Patient Address</CFormLabel>
      <div className="w-full">
        <CFormInput
          value={patientAddress || data?.patient?.address || ''}
          onChange={(e) => setPatientAddress(e.target.value)}
          placeholder="Full Address / Pincode"
          required
        />
        {errors.patientAddress && (
          <div className="text-danger mt-1 text-sm">{errors.patientAddress}</div>
        )}
      </div>
    </div>
  </CCol>

  {/* Pincode */}
  <CCol xs={12} md={6}>
    <div className="flex flex-col md:flex-row items-start gap-2">
      <CFormLabel className="fw-semibold min-w-[120px]">📮 Pincode</CFormLabel>
      <div className="w-full">
        <CFormInput
          value={Pincode || data?.patient?.pincode || ''}
          onChange={(e) => setpincode(e.target.value)}
          placeholder="Pincode"
          required
        />
        {errors.pincode && (
          <div className="text-danger mt-1 text-sm">{errors.pincode}</div>
        )}
      </div>
    </div>
  </CCol>
</CRow>

</div>


{/* Old Bill Displyed POP up */}


{showPatientCard && (
  <>
    {/* Past History Card with Toggle */}
    <CAlert color="info" className="p-3 rounded shadow-sm mb-3 border border-secondary">
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0 text-dark">Past History</h5>
        <CButton
          color="light"
          size="sm"
          onClick={() => setShowAllHistory(!showAllHistory)}
        >
          {showAllHistory ? '▲' : '▼'}
        </CButton>
      </div>
    </CAlert>

    {/* Expanded Visit History */}
   {showAllHistory && lastBill && (
  <div>
    {lastBill.map((bill, index) => {
      const directivesForBill = healthdirectives.filter(d => d.p_p_i_id == bill.id);
      const examsForBill = patientExaminations.filter(e => e.p_p_i_id == bill.id);
      const ayurvedicExamination = AyurvedicExaminations.filter(e => e.p_p_i_id == bill.id);
      const isExpanded = expandedVisits[bill.id];

      return (
        <CAlert key={index} color="success" className="p-2 rounded shadow-sm mb-3 border border-black">
          <div
            className="d-flex justify-content-between align-items-center "
            onClick={() => toggleVisitExpansion(bill.id)}
             style={{ cursor: 'pointer' }}
          >
            <strong className="text-dark">Visit Date: {bill.visit_date}</strong>
            <span>{isExpanded ? '▲' : '▼'}</span>
          </div>

          {isExpanded && (
            <>
              {/* Health Directives */}
              {directivesForBill.length > 0 && (
                <>
                  <div className="mt-2 text-dark"><strong>Health Directives</strong></div>
                  {directivesForBill.map((directive, dIndex) => (
                    <div key={dIndex} className="border-bottom pb-2 mb-2">
                      <div className="d-flex flex-wrap gap-4 text-dark">
                        <div><strong>Medicine:</strong> {directive.medicine}</div>
                        <div><strong>Frequency:</strong> {directive.frequency}</div>
                        <div><strong>Duration:</strong> {directive.duration}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Examinations */}
              {examsForBill.length > 0 && (
                <div className="mt-2">
                  <div className="mb-2 text-dark"><strong>Examination</strong></div>
                  {examsForBill.map((exam, eIndex) => (
                    <div key={eIndex} className="d-flex flex-wrap gap-3 text-dark">
                      <div><strong>Blood Pressure:</strong> {exam.bp}</div>
                      <div><strong>Pulse:</strong> {exam.pulse}</div>
                      <div><strong>Past History:</strong> {exam.past_history}</div>
                      <div><strong>Complaints:</strong> {exam.complaints}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Ayurvedic Examinations */}
              {ayurvedicExamination.length > 0 && (
                <div className="mt-2">
                  <div className="mb-2 text-dark"><strong>Ayurvedic Examination</strong></div>
                  {ayurvedicExamination.map((exam, eIndex) => (
                    <div key={eIndex} className="d-flex flex-wrap gap-3 text-dark">
                      <div><strong>Occupation:</strong> {exam.occupation}</div>
                      <div><strong>Pincode:</strong> {exam.pincode}</div>
                      <div><strong>Past History:</strong> {exam.ayurPastHistory}</div>
                      {/* <div><strong>Habits:</strong> {exam.habits}</div> */}
                     {exam?.habits && Object.values(exam.habits).some(val => val && val !== '') && (
  <div>
    <strong>Habits:</strong>
    <ul style={{ marginLeft: '1rem', listStyleType: 'disc' }}>
      {Object.entries(exam.habits)
        .filter(([_, val]) => val && val !== '')
        .map(([key, val]) => (
          <li key={key}>
            {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}: {val}
          </li> 
        ))}
    </ul>  
  </div>
)}
                      <div><strong>Lab Investigation:</strong> {exam.lab_investigation}</div>
                      <div><strong>LMP:</strong> {exam.lmp}</div>
                      <div><strong>EDD:</strong> {exam.edd}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CAlert>
      );
    })}
  </div>
)}

  </>
)}







<CCard className="mb-2 mt-2 p-3  rounded-4 border border-gray-200" 
style={{ backgroundColor: '	#F0F8FF' }}
>

    
 <div className="d-flex justify-content-start lign-items-center mb-2">
  <div className="d-flex align-items-center gap-2">
    {/* <CIcon icon={cilFile} className="text-primary" size="lg" /> &nbsp; */}
     <div
          className="d-flex align-items-center justify-content-center bg-white border border-primary ms-2"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
          }}
        >
          <CIcon icon={cilFile} size="lg" className="text-primary" />
        </div>
    <h6 className="mb-0 fw-semibold">Medical Observations</h6>&nbsp;&nbsp;
  </div>

 <div className="d-flex flex-column flex-md-row gap-2">
  <CButton
  color="light"
  className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded rounded-4"
  onClick={toggleMedicalForm}
  style={{
   // borderColor: '#8000ff', // Bootstrap Primary Blue
    border: '2px solid #1B9C8F',
    backgroundColor: 'white',
    transition: 'background-color 0.3s',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = '#D5ECE9'; // light blue on hover
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = 'white'; // reset on leave
  }}
>
  {/* <span className="" style={{ color: '#1B9C8F'}}> Add Medical Observation</span> */}
   <span style={{ color: '#1B9C8F' }}>
    🩺 {isMedicalExpanded ? 'Close' : 'Add Medical Observation'}
  </span>
</CButton>



 <CButton
  color="light"
  className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded rounded-4"
  onClick={toggleAyurvedicForm}
  style={{
    border: '2px solid #8B3E2F', // Green border
    backgroundColor: 'white',
    transition: 'background-color 0.3s',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = '#EED7D3'; // light green on hover
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = 'white';
  }}
>
  <span style={{ color: '	#8B3E2F' }}>
    🌿 {isAyurvedicExpanded ? 'Close' : 'Add Ayurvedic Observation'}
  </span>
</CButton>

</div>



</div>



{isMedicalExpanded && doctorObservationSettings && (
  <div className="p-2">
    <CRow className="mb-2">
      {doctorObservationSettings.bp && (
        <CCol xs={12} sm={6}>
          <CFormLabel className="fw-bold">BP</CFormLabel>
          <CFormInput value={bp} type='number' onChange={(e) => setBp(e.target.value)}
            onKeyDown={(e) => {
    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === "E") {
      e.preventDefault();
    }
  }}
  min="0"
          />
        </CCol>
      )}

      {doctorObservationSettings.weight && (
        <CCol xs={12} sm={6}>
          <CFormLabel className="fw-bold">Weight (Kg)</CFormLabel>
          <CFormInput value={weight} type='number' onChange={(e) => setWeight(e.target.value)} 
                onKeyDown={(e) => {
    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === "E") {
      e.preventDefault();
    }
  }}
  min="0"
          />
        </CCol>
      )}
      {doctorObservationSettings.height && (
        <CCol xs={12} sm={6}>
          <CFormLabel className="fw-bold">Height (CM)</CFormLabel>
          <CFormInput value={height} type='number' onChange={(e) => setHeight(e.target.value)}
                onKeyDown={(e) => {
    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === "E") {
      e.preventDefault();
    }
  }}
  min="0"
          />
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
          <CFormLabel className="fw-bold">Known History</CFormLabel>
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



{isAyurvedicExpanded && doctorAyurvedicObservationSettings && (
  <div className="p-2">
    <CRow className="mb-2">
     

      {doctorAyurvedicObservationSettings.past_history && (
        <CCol xs={12} sm={6} >
          <CFormLabel className="fw-bold">Past History</CFormLabel>
          <CFormInput value={ayurPastHistory} onChange={(e) => {
             const onlyText = e.target.value.replace(/[^a-zA-Z\s]/g, '');
            setAyurPastHistory(e.target.value)}} />
        </CCol> 
      )}

       {doctorAyurvedicObservationSettings.lab_investigation && (
        // <CCol xs={12} sm={6}>
        //   <CFormLabel className="fw-bold">Investigation</CFormLabel>
        //   <CFormInput value={labInvestigation} onChange={(e) => setLabInvestigation(e.target.value)} />
        // </CCol>
        <CCol xs={12} sm={6}>
  <CFormLabel className="fw-bold">Investigation</CFormLabel>
  <Select
    options={investigationOptions}
    isSearchable
    value={investigationOptions.find(opt => opt.value === labInvestigation) || null}
    onChange={(selectedOption) => setLabInvestigation(selectedOption?.value || "")}
    placeholder="Select or search investigation..."
  />
</CCol>
      )}

    </CRow>

     <CRow className="mb-2">
      
      {doctorAyurvedicObservationSettings.lmp && (
        <CCol xs={12} sm={6}>
          <CFormLabel  className="fw-bold" >LMP</CFormLabel>
          <CFormInput type='date' value={lmp} onChange={(e) => setLmp(e.target.value)} />
        </CCol>
      )}
      {doctorAyurvedicObservationSettings.edd && (
        <CCol xs={12} sm={6}>
          <CFormLabel className="fw-bold">EDD</CFormLabel>
          <CFormInput type='date' value={edd} onChange={(e) => setEdd(e.target.value)} />
        </CCol>
      )}
    </CRow>


<CRow>
    {(doctorAyurvedicObservationSettings.food_and_drug_allergy ||  doctorAyurvedicObservationSettings.habits) && ( 

      <CRow className=' align-items-center mb-2 mt-3'>
{doctorAyurvedicObservationSettings.food_and_drug_allergy && (
      <CCol xs={12} md={6} className="d-flex justify-content-between align-items-center mb-2">
        
          <h6 className="fw-bold mb-0">Allergy</h6>
          <CButton
            // color={showAllergyFields ? 'danger' : 'primary'}
            // size="sm"
             type="button"
            onClick={toggleFields}
            // style={{ padding: '2px 8px' }}
              className="btn btn-sm btn-outline-primary"
          >
            {showAllergyFields ? '-' : '+'}
          </CButton>
      
        </CCol> 
      )}

{doctorAyurvedicObservationSettings.habits && (
      <CCol xs={12} md={6} className="d-flex justify-content-between align-items-center">
     
        <h6 className="fw-bold mb-0">Habits</h6>
        <CButton
          size="sm"
          // color={showHabits ? 'danger' : 'primary'}
          onClick={() => setShowHabits(!showHabits)}
          className="btn btn-sm btn-outline-primary"
        >
          {showHabits ? '-' : '+'}
        </CButton>
    
</CCol> 
)}


  </CRow>


     )}
  

    {/* Allergy with Toggle */}
    {showAllergyFields && (
      
      <CRow>
      {showAllergyFields && (
          <CCol xs={12} >
          <div className="d-flex flex-column gap-2">
            <CFormInput
              placeholder="Food Allergy"
              value={foodAndDrugAllergy}
              onChange={(e) => setFoodAndDrugAllergy(e.target.value)}
            />
            <CFormInput
              placeholder="Drug Allergy"
              value={drugAllergy}
              onChange={(e) => setDrugAllergy(e.target.value)}
            />
          </div>
          </CCol>
        )}
</CRow>
        
     )}  


{/* Habits toggle */}

 {doctorAyurvedicObservationSettings.habits && (
        // <CCol xs={12} sm={6}>
        //   <CFormLabel className="fw-bold">Habits</CFormLabel>
        //   <CFormInput value={habits} onChange={(e) => setHabits(e.target.value)} />
        // </CCol>
         <CCol xs={12} >
      

      {showHabits && (
        <>
<CRow className="mb-3">
  {/* === Section 1 === */}
  <CCol xs={12} md={4}>
    <CCol xs={12} className="mb-3">
      <CFormLabel className="fw-bold">Alcohol</CFormLabel>
      <div className="d-flex flex-wrap gap-3 mt-1">
        {["Normal", "Moderate", "Heavy"].map((option) => (
          <CFormCheck
            key={option}
            type="checkbox"
            label={option}
            checked={habits.alcohol === option}
            onChange={() => handleHabitChange("alcohol", option)}
          />
        ))}
      </div>
    </CCol>

    <CCol xs={12} className="mb-3">
      <CFormLabel className="fw-bold">Cold Drink</CFormLabel>
      <div className="d-flex flex-wrap gap-3 mt-1">
        {["Normal", "Moderate", "Heavy"].map((option) => (
          <CFormCheck
            key={option}
            type="checkbox"
            label={option}
            checked={habits.cold_drink === option}
            onChange={() => handleHabitChange("cold_drink", option)}
          />
        ))}
      </div>
    </CCol>

    <CCol xs={12} className="mb-3">
      <CFormLabel className="fw-bold">Fast Food</CFormLabel>
      <div className="d-flex flex-wrap gap-3 mt-1">
        {["Sometimes", "Twice In week", "Once In Week"].map((option) => (
          <CFormCheck
            key={option}
            type="checkbox"
            label={option}
            checked={habits.fast_food === option}
            onChange={() => handleHabitChange("fast_food", option)}
          />
        ))}
      </div>
    </CCol>

    <CCol xs={12} className="mb-3">
      <CFormLabel className="fw-bold">Salty Food</CFormLabel>
      <div className="d-flex flex-wrap gap-3 mt-1">
        {["Normal", "Moderate", "Heavy"].map((option) => (
          <CFormCheck
            key={option}
            type="checkbox"
            label={option}
            checked={habits.salty_food === option}
            onChange={() => handleHabitChange("salty_food", option)}
          />
        ))}
      </div>
    </CCol>
  </CCol>

  {/* === Section 2 === */}
  <CCol xs={12} md={4}>
    <CCol xs={12} className="mb-3">
      <CFormLabel className="fw-bold">Chocolate</CFormLabel>
      <div className="d-flex flex-wrap gap-3 mt-1">
        {["Normal", "Moderate", "Heavy"].map((option) => (
          <CFormCheck
            key={option}
            type="checkbox"
            label={option}
            checked={habits.chocolate === option}
            onChange={() => handleHabitChange("chocolate", option)}
          />
        ))}
      </div>
    </CCol>

 <CCol xs={12} className="mb-3">
      <CFormLabel className="fw-bold">Drug Addict</CFormLabel>
      <div className="d-flex flex-wrap gap-3 mt-1">
        {["Normal", "Moderate", "Heavy"].map((option) => (
          <CFormCheck
            key={option}
            type="checkbox"
            label={option}
            checked={habits.drug_addict === option}
            onChange={() => handleHabitChange("drug_addict", option)}
          />
        ))}
      </div>
    </CCol>

     <CCol xs={12} className="mb-3">
      <CFormLabel className="fw-bold">Late Night Sleep</CFormLabel>
      <div className="d-flex flex-wrap gap-3 mt-1">
        {["Sometimes", "Not Regular", "Regular"].map((option) => (
          <CFormCheck
            key={option}
            type="checkbox"
            label={option}
            checked={habits.late_night_sleep === option}
            onChange={() => handleHabitChange("late_night_sleep", option)}
          />
        ))}
      </div>
    </CCol>

     <CCol xs={12} className="mb-3">
      <CFormLabel className="fw-bold">Smoking</CFormLabel>
      <div className="d-flex flex-wrap gap-3 mt-1">
        {["Normal", "Moderate", "Heavy"].map((option) => (
          <CFormCheck
            key={option}
            type="checkbox"
            label={option}
            checked={habits.smoking === option}
            onChange={() => handleHabitChange("smoking", option)}
          />
        ))}
      </div>
    </CCol>

  </CCol>

  

  {/* === Section 3 === */}
  <CCol xs={12} md={4}>
    <CCol xs={12} className="mb-3">
      <CFormLabel className="fw-bold">Tobbacco</CFormLabel>
      <div className="d-flex flex-wrap gap-3 mt-1">
        {["Normal", "Moderate", "Heavy"].map((option) => (
          <CFormCheck
            key={option}
            type="checkbox"
            label={option}
            checked={habits.tobbacco === option}
            onChange={() => handleHabitChange("tobbacco", option)}
          />
        ))}
      </div>
    </CCol>

          <CCol xs={12} className="mb-3">
      <CFormLabel className="fw-bold">Coffee</CFormLabel>
      <div className="d-flex flex-wrap gap-3 mt-1">
        {["Normal", "Moderate", "Heavy"].map((option) => (
          <CFormCheck
            key={option}
            type="checkbox"
            label={option}
            checked={habits.coffee === option}
            onChange={() => handleHabitChange("coffee", option)}
          />
        ))}
      </div>
    </CCol>

      <CCol xs={12} className="mb-3">
      <CFormLabel className="fw-bold">Eating Habits</CFormLabel>
      <div className="d-flex flex-wrap gap-3 mt-1">
        {["Normal", "Moderate", "Heavy"].map((option) => (
          <CFormCheck
            key={option}
            type="checkbox"
            label={option}
            checked={habits.eating_habits === option}
            onChange={() => handleHabitChange("eating_habits", option)}
          />
        ))}
      </div>
    </CCol>

      <CCol xs={12} className="mb-3">
      <CFormLabel className="fw-bold">Pan Masala</CFormLabel>
      <div className="d-flex flex-wrap gap-3 mt-1">
        {["Normal", "Moderate", "Heavy"].map((option) => (
          <CFormCheck
            key={option}
            type="checkbox"
            label={option}
            checked={habits.pan_masala === option}
            onChange={() => handleHabitChange("pan_masala", option)}
          />
        ))}
      </div>
    </CCol>

      <CCol xs={12} className="mb-3">
      <CFormLabel className="fw-bold">Tea</CFormLabel>
      <div className="d-flex flex-wrap gap-3 mt-1">
        {["Normal", "Moderate", "Heavy"].map((option) => (
          <CFormCheck
            key={option}
            type="checkbox"
            label={option}
            checked={habits.tea === option}
            onChange={() => handleHabitChange("tea", option)}
          />
        ))}
      </div>
    </CCol>

  </CCol>
</CRow> 


</>


      )}
    </CCol>
      )}
</CRow>



    <CRow className="mb-2">
    
{/* gird for Ashtvidh and Personal history */}
{(doctorAyurvedicObservationSettings.personal_history || doctorAyurvedicObservationSettings.prasavvedan_parikshayein) && (
  <CRow className="align-items-center mb-2 mt-3">
    {doctorAyurvedicObservationSettings.personal_history && (
      <CCol xs={12} md={6} className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold mb-0">Personal History</h6>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => setShowPersonalHistory(!showPersonalHistory)}
        >
          {showPersonalHistory ? '-' : '+'}
        </button>
      </CCol>
    )}

    {doctorAyurvedicObservationSettings.prasavvedan_parikshayein && (
      <CCol xs={12} md={6} className="d-flex justify-content-between align-items-center">
        <h6 className="fw-bold mb-0">Ashtvidh Parikshayein</h6>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => setShowAshtvidh(!showAshtvidh)}
        >
          {showAshtvidh ? '-' : '+'}
        </button>
      </CCol>
    )}
  </CRow>
)}

{showPersonalHistory && (
 <CRow>
      {/* <CCol xs={12} className="d-flex justify-content-between align-items-center">
  <h5 className="fw-bold mb-0">Personal History</h5>
  <button
    type="button"
    className="btn btn-sm btn-outline-primary"
    onClick={() => setShowPersonalHistory(!showPersonalHistory)}
  >
    {showPersonalHistory ? '-' : '+'}
  </button>
</CCol> */}

      {showPersonalHistory && (
<>
  {/* Diet */}
  <CCol xs={12} sm={6} className="mb-3">
    <CFormLabel className="fw-bold">Diet </CFormLabel>
    <div className="d-flex flex-wrap gap-3 mt-1">
      {["Vegetarian", "Non-Vegetarian", "Mixed"].map((option) => (
        <CFormCheck
          key={option}
          type="checkbox"
          label={option}
          checked={personalHistory.diet === option}
          onChange={() => handleChange("diet", option)}
        />
      ))}
    </div>
  </CCol>

  {/* Appetite */}
  <CCol xs={12} sm={6} className="mb-3">
    <CFormLabel className="fw-bold">Appetite</CFormLabel>
    <div className="d-flex flex-wrap gap-3 mt-1">
      {["Good", "Normal", "Poor"].map((option) => (
        <CFormCheck
          key={option}
          type="checkbox"
          label={option}
          checked={personalHistory.appetite === option}
          onChange={() => handleChange("appetite", option)}
        />
      ))}
    </div>
  </CCol>

  {/* Sleep */}
  <CCol xs={12} sm={6} className="mb-3">
    <CFormLabel className="fw-bold">Sleep</CFormLabel>
    <div className="d-flex flex-wrap gap-3 mt-1">
      {["Sound", "Interrupted", "Insomnia"].map((option) => (
        <CFormCheck
          key={option}
          type="checkbox"
          label={option}
          checked={personalHistory.sleep === option}
          onChange={() => handleChange("sleep", option)}
        />
      ))}
    </div>
  </CCol>

  {/* Thirst */}
  <CCol xs={12} sm={6} className="mb-3">
    <CFormLabel className="fw-bold">Thirst</CFormLabel>
    <div className="d-flex flex-wrap gap-3 mt-1">
      {["Normal", "Medium", "Heavy", "Poor"].map((option) => (
        <CFormCheck
          key={option}
          type="checkbox"
          label={option}
          checked={personalHistory.thirst === option}
          onChange={() => handleChange("thirst", option)}
        />
      ))}
    </div>
  </CCol>

  {/* Bowel */}
  <CCol xs={12} sm={6} className="mb-3">
    <CFormLabel className="fw-bold">Bowel</CFormLabel>
    <div className="d-flex flex-wrap gap-3 mt-1">
      {["Regular", "Irregular", "Constipated"].map((option) => (
        <CFormCheck
          key={option}
          type="checkbox"
          label={option}
          checked={personalHistory.bowel === option}
          onChange={() => handleChange("bowel", option)}
        />
      ))}
    </div>
  </CCol>

  {/* Micturition */}
  <CCol xs={12} sm={6} className="mb-3">
    <CFormLabel className="fw-bold">Micturition</CFormLabel>
    <div className="d-flex flex-wrap gap-3 mt-1">
      {["Normal", "Poor", "Painful", "Burning", "Frequent"].map((option) => (
        <CFormCheck
          key={option}
          type="checkbox"
          label={option}
          checked={personalHistory.micturition === option}
          onChange={() => handleChange("micturition", option)}
        />
      ))}
    </div>
  </CCol>
</>

)}
    </CRow>
)}

{showAshtvidh && (
  <CRow>
      {/* <CCol xs={12} className="d-flex justify-content-between align-items-center">
        <h5 className="fw-bold mb-0">Ashtvidh Parikshayein</h5>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => setShowAshtvidh(!showAshtvidh)}
        >
          {showAshtvidh ? '-' : '+'}
        </button>
      </CCol> */}

      {showAshtvidh && (
      <>
  {/* नाड़ी */}
  <CCol xs={12} className="mb-3">
  <CFormLabel className="fw-bold">नाड़ी</CFormLabel>
  <div className="d-flex flex-wrap gap-3 mt-1">
    {[
      "साम", "निराम", "क्षीण", "द्रूत", "गुरु", "वात", "पित", "कफ",
      "वातपित", "पितकफ", "कफवात", "त्रिदोष", "सर्पवत्", "मन्चुकवत्", "हंसवत्"
    ].map((option) => (
      <CFormCheck
        key={option}
        type="checkbox"
        label={option}
        checked={ashtvidhData.nadi.includes(option)}
        onChange={() => handleAshtvidhChange('nadi', option)}
      />
    ))}
  </div>
</CCol>


  {/* जिव्हा */}
  <CCol xs={12} className="mb-3">
    <CFormLabel className="fw-bold">जिव्हा</CFormLabel>
    <div className="d-flex flex-wrap gap-3 mt-1">
      {["साम" , "निराम" , "दारुण" , "पिच्छिल" , "स्फुटित"  ,"श्याम" , "निलवर्ण" , "शुष्क" , "वर्ण" , "मुरवपाक" , "सम्यक्" , "निल" , "श्वेत " ," रक्तवर्ण"].map((option) => (
        <CFormCheck
          key={option}
          type="checkbox"
          label={option}
          checked={ashtvidhData.jihva.includes(option)}
          onChange={() => handleAshtvidhChange('jihva', option)}
        />
      ))}
    </div>
  </CCol>

  {/* मल */}
  <CCol xs={12} className="mb-3">
    <CFormLabel className="fw-bold">मल</CFormLabel>
    <div className="d-flex flex-wrap gap-3 mt-1">
      {["सविबन्ध" , "मुह मुह" , "द्रव" , "बध्ध्" , "सरकत" , "भोजनोतर" , "सपूय" , "पिच्छिल" , "सम्यक्" , "वेदनायुक्त" , "Daily" , "Alternate day" , "शुष्क" ,"पिताभवर्ण " ," श्वेतवर्ण"
].map((option) => (
        <CFormCheck
          key={option}
          type="checkbox"
          label={option}
          checked={ashtvidhData.mala.includes(option)}
          onChange={() => handleAshtvidhChange('mala', option)}
        />
      ))}
    </div>
  </CCol>

  {/* मूत्र */}
  <CCol xs={12} className="mb-3">
    <CFormLabel className="fw-bold">मूत्र</CFormLabel>
    <div className="d-flex flex-wrap gap-3 mt-1">
      {["सदाह" , "अल्पमुत्रता" , "बहुमुत्रता" , "सशुल" , "रात्रिकालिनबहुमुत्रता" , "शैयामूत्रता" , "मेयुकत" , "अवरोधित" , "अनियत्रित" , "दीर्घकालीन स तैलसम" ," श्वेत वर्ण"
].map((option) => (
        <CFormCheck
          key={option}
          type="checkbox"
          label={option}
          checked={ashtvidhData.mutra.includes(option)}
          onChange={() => handleAshtvidhChange('mutra', option)}
        />
      ))}
    </div>
  </CCol>

  {/* नेत्र */}
  <CCol xs={12} className="mb-3">
    <CFormLabel className="fw-bold">नेत्र</CFormLabel>
    <div className="d-flex flex-wrap gap-3 mt-1">
      {["कंड" , "पिच्छिल" , "मलिन पित्" , "निल", "स्ताव" , "श्पाव" , "शुष्क" , "प्रकाश अराहत्व" , "सशुल" , "दाद् श्रीण" ,"नेत्रविकार" , "सम्यक्" , "संकुचित" , "विस्फारित" , "क्षेत"," अरुण " ," पित"
].map((option) => (
        <CFormCheck
          key={option}
          type="checkbox"
          label={option}
          checked={ashtvidhData.netra.includes(option)}
          onChange={() => handleAshtvidhChange('netra', option)}
        />
      ))}
    </div>
  </CCol>

  {/* आकृति */}
  <CCol xs={12} className="mb-3">
    <CFormLabel className="fw-bold">आकृति</CFormLabel>
    <div className="d-flex flex-wrap gap-3 mt-1">
      {["कृश", "स्थूल", "मध्यम"].map((option) => (
        <CFormCheck
          key={option}
          type="checkbox"
          label={option}
          checked={ashtvidhData.aakruti.includes(option)}
          onChange={() => handleAshtvidhChange('aakruti', option)}
        />
      ))}
    </div>
  </CCol>

  {/* शब्द */}
  <CCol xs={12} className="mb-3">
    <CFormLabel className="fw-bold">शब्द</CFormLabel>
    <div className="d-flex flex-wrap gap-3 mt-1">
      {["गम्भीर" , "खिग्ध" , "गदगद" , "रुक्ष" ," मिमिन"
].map((option) => (
        <CFormCheck
          key={option}
          type="checkbox"
          label={option}
          checked={ashtvidhData.shabda.includes(option)}
          onChange={() => handleAshtvidhChange('shabda', option)}
        />
      ))}
    </div>
  </CCol>

  {/* स्पर्श */}
  <CCol xs={12} className="mb-3">
    <CFormLabel className="fw-bold">स्पर्श</CFormLabel>
    <div className="d-flex flex-wrap gap-3 mt-1">
      {["सिाध" , "शीत" , "अनष्णाशीत", "रुक्ष"  ,"उषा" ," प्रशष्"
].map((option) => (
        <CFormCheck
          key={option}
          type="checkbox"
          label={option}
          checked={ashtvidhData.sparsha.includes(option)}
          onChange={() => handleAshtvidhChange('sparsha', option)}
        />
      ))}
    </div>
  </CCol>
</>

      )}
    </CRow>
)}


    </CRow>

   
  </div>
)}





<div>
  {/* Prescriptions Section */}
  {!showTable && (
    <>
      <div className="d-flex justify-content-start align-items-center mb-2">
        <div className="d-flex align-items-center gap-2">
          {/* <CIcon icon={cilMedicalCross} className="text-primary" size="lg" /> &nbsp; */}
          <div
          className="d-flex align-items-center justify-content-center bg-white border border-primary ms-2"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
          }}
        >
          <CIcon icon={cilMedicalCross} size="lg" className="text-primary" />
        </div>
          <h6 className="mb-0 fw-semibold">Medical Prescriptions</h6>&nbsp;&nbsp;
        </div>
        <CButton
  color="light"
  className="d-flex align-items-center gap-2 px-4 py-2  fw-semibold rounded rounded-4"
  onClick={() => setShowTable(true)}
  style={{
    border: '2px solid #4B0082', // Deep indigo or prescription theme
    backgroundColor: 'white',
    transition: 'background-color 0.3s',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = '#E6DEFA'; // light lavender on hover
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = 'white';
  }}
>
  <span style={{ color: '#4B0082' }}>
    💊 &nbsp;&nbsp;{showTable ? 'Close' : 'Add Prescriptions'}
  </span>
</CButton>

      </div>
    </>
  )}

  {showTable && (
    <>
   <div className="ms-auto">
      <CButton
        color="light"
        className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded rounded-4"
        onClick={() => {
          if (showTable) {
            // Reset everything when closing
            setShowTable(false);
            setRowss([{
              description: '',
              strength: '',
              dosage: '',
              timing: '',
              frequency: '',
              duration: '',
              price: '',
              isCustom: false,
              drugDetails: []
            }]);
            setRowErrors([]);
            setMedicineSearch({});
            setMedicineOptions({});
            setSuggestionFlags({});
            setActiveEditableRowIndex(null);
          } else {
            setShowTable(true);
          }
        }}
        style={{
          border: '2px solid #4B0082',
          backgroundColor: 'white',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#E6DEFA';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
        }}
      >
        <span style={{ color: '#4B0082' }}>
          💊 {showTable ? 'Close Prescriptions' : 'Add Prescriptions'}
        </span>
      </CButton>
    </div>
      
      <CCardBody className="rounded shadow-sm bg-white p-2 mt-2 border border-gray-200">
        {/* Desktop View */}
        <div className="d-none d-lg-block">
          <CTable
            responsive
            className="table-borderless align-middle"
            style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}
          >
            <CTableHead className="bg-light text-center text-nowrap text-dark fw-semibold">
              <CTableRow>
                {['Medicine', 'Strength', 'Dosage', 'Timing', 'Frequency', 'Duration','Price (₹)', 'Actions'].map((header) => (
                  <CTableHeaderCell key={header} className="" style={{ width: `${100 / 8}%` }}>
                    {header}
                  </CTableHeaderCell>
                ))}
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {rowss.map((row, index) => (
                <CTableRow key={index} className="bg-white rounded">
                  {/* Medicine */}
                  <CTableDataCell className="px-2 py-2 position-relative">
                    <CFormInput
                      type="text"
                      value={medicineSearch[index] || ''}
                      onChange={(e) => handleMedicineSearch(index, e.target.value)}
                      onBlur={() => validateField(index, 'description')}
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
                        width: '100%',
                        border: '1px solid #ccc',
                        borderTop: 'none',
                        borderRadius: '0 0 6px 6px',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        overflowY: 'auto',
                      }}>
                        {medicineOptions[index].map((medicine) => (
                          <div
                            key={medicine.id}
                            className="d-flex justify-content-center align-items-center"
                            style={{
                              padding: '8px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #f1f1f1',
                              transition: 'background 0.2s ease',
                              textAlign: 'center',
                              fontSize: '0.95rem',
                              fontWeight: 500
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                            onClick={() => {
                              handleRowChangee(index, 'description', medicine.id);
                              handleMedicineChange(index, medicine.id);
                              setMedicineSearch((prev) => ({ ...prev, [index]: medicine.drug_name }));
                              setMedicineOptions((prev) => ({ ...prev, [index]: [] }));
                              // Clear error when medicine is selected
                              clearFieldError(index, 'description');
                            }}
                          >
                            {medicine.drug_name}
                          </div>
                        ))}
                      </div>
                    )}
                    {rowErrors[index]?.description && <div className="text-danger small mt-1">{rowErrors[index].description}</div>}
                  </CTableDataCell>

                  {/* Strength */}
                  <CTableDataCell className="px-2 py-3 position-relative">
                    <CFormInput
                      value={row.strength}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleRowChangee(index, 'strength', value);
                        toggleSuggestion(index, 'showStrength', false);
                      }}
                      onFocus={() => {
                        if (!row.strength) {
                          toggleSuggestion(index, 'showStrength', true);
                        }
                      }}
                      onBlur={() => validateField(index, 'strength')}
                      placeholder="Strength"
                      disabled={!row.description}
                    />

                    {suggestionFlags[index]?.showStrength &&
                      row.drugDetails?.filter((d) => d.drug_id === parseInt(row.description, 10))?.slice(0, 5).map((drug, i) => (
                        <div
                          key={i}
                          className="position-absolute w-100 bg-white border shadow-sm mt-1 px-2 py-1 rounded cursor-pointer"
                          style={{ zIndex: 2000 }}
                          onClick={() => {
                            handleRowChangee(index, 'strength', drug.strength);
                            toggleSuggestion(index, 'showStrength', false);
                            clearFieldError(index, 'strength');
                          }}
                        >
                          {drug.strength}
                        </div>
                      ))}
                    {rowErrors[index]?.strength && <div className="text-danger small mt-1">{rowErrors[index].strength}</div>}
                  </CTableDataCell>

                  {/* Dosage */}
                 
                  <CTableDataCell className="px-2 py-3">
  <CFormInput
    type="text"
    value={row.dosage}
    onChange={(e) => {
      const raw = e.target.value.replace(/-/g, '').trim();
      const only01 = raw.replace(/[^01]/g, '');

      if (only01.length > 3) return;

      // Auto-format to 1-0-1 style
      const formatted = only01.length === 3
        ? `${only01[0]}-${only01[1]}-${only01[2]}`
        : only01;

      handleRowChangee(index, 'dosage', formatted);

      // Clear error if fully valid
      if (/^[01]-[01]-[01]$/.test(formatted)) {
        clearFieldError(index, 'dosage');
      }
    }}
    onBlur={() => validateField(index, 'dosage')}
    placeholder="e.g. 1-0-1"
    maxLength={5}
  />
  {rowErrors[index]?.dosage && (
    <div className="text-danger small mt-1">{rowErrors[index].dosage}</div>
  )}
</CTableDataCell>



                  {/* Timing */}
                  <CTableDataCell className="px-2 py-3">
                    <CFormSelect 
                      value={row.timing} 
                      onChange={(e) => {
                        handleRowChangee(index, 'timing', e.target.value);
                        if (e.target.value) clearFieldError(index, 'timing');
                      }}
                      onBlur={() => validateField(index, 'timing')}
                    >
                      <option value="">Select</option>
                      <option value="After Food">After Food</option>
                      <option value="Before Food">Before Food</option>
                    </CFormSelect>
                    {rowErrors[index]?.timing && <div className="text-danger small mt-1">{rowErrors[index].timing}</div>}
                  </CTableDataCell>

                  {/* Frequency */}
                  <CTableDataCell className="px-2 py-3">
                    <CFormSelect 
                      value={row.frequency} 
                      onChange={(e) => {
                        handleRowChangee(index, 'frequency', e.target.value);
                        if (e.target.value) clearFieldError(index, 'frequency');
                      }}
                      onBlur={() => validateField(index, 'frequency')}
                    >
                      <option value="">Select</option>
                      <option value="Daily">Daily</option>
                      <option value="SOS">SOS</option>
                    </CFormSelect>
                    {rowErrors[index]?.frequency && <div className="text-danger small mt-1">{rowErrors[index].frequency}</div>}
                  </CTableDataCell>

                  {/* Duration */}
                  <CTableDataCell className="px-2 py-3">
                    {row.isCustom ? (
                      <CFormInput
                        value={row.duration}
                        placeholder="Custom"
                        onChange={(e) => {
                          handleRowChangee(index, 'duration', e.target.value);
                          if (e.target.value) clearFieldError(index, 'duration');
                        }}
                        onBlur={() => validateField(index, 'duration')}
                      />
                    ) : (
                      <CFormSelect
                        value={row.duration}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleRowChangee(index, 'isCustom', val === 'SOS');
                          handleRowChangee(index, 'duration', val === 'SOS' ? '' : val);
                          if (val) clearFieldError(index, 'duration');
                        }}
                        onBlur={() => validateField(index, 'duration')}
                      >
                        <option value="">Select</option>
                        {['3 Days', '5 Days', '7 Days', '15 Days', '30 Days', 'SOS'].map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </CFormSelect>
                    )}
                    {rowErrors[index]?.duration && <div className="text-danger small mt-1">{rowErrors[index].duration}</div>}
                  </CTableDataCell>

                  {/* Price */}
                  <CTableDataCell style={{ width: '16.66%' }}>
                    <CFormInput
                      type="number"
                      min="0"
                      className="text-center"
                      value={
                        activeEditableRowIndex === index
                          ? row.price ?? ''
                          : row.price || row.drugDetails?.[0]?.price || ''
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          handleRowChangee(index, 'price', '');
                          return;
                        }
                        const numberValue = Number(val);
                        if (numberValue >= 0) {
                          handleRowChangee(index, 'price', numberValue);
                          clearFieldError(index, 'price');
                        }
                      }}
                      onFocus={() => {
                        setActiveEditableRowIndex(index);
                        handleRowChangee(index, 'price', '');
                      }}
                      onBlur={() => {
                        if (row.price === '' || row.price === null || row.price === undefined) {
                          handleRowChangee(index, 'price', row.drugDetails?.[0]?.price ?? '');
                        }
                        setActiveEditableRowIndex(null);
                        validateField(index, 'price');
                      }}
                    />
                    {rowErrors[index]?.price && (
                      <div className="text-danger small mt-1">{rowErrors[index].price}</div>
                    )}
                  </CTableDataCell>

                  {/* Actions */}
                  <CTableDataCell className="px-2 py-2">
                    <div className="d-flex justify-content-center gap-3">
                      <CButton color="danger" size="sm" onClick={() => handleRemoveRoww(index)} disabled={index === 0 && rowss.length === 1}>
                        <CIcon icon={cilDelete} className="text-white" />
                      </CButton>
                      <CButton color="success" size="sm" onClick={handleAddRoww}>
                        <CIcon icon={cilPlus} className="text-white" />
                      </CButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>

            <div className="fw-bold text-end mt-3">
              Total Price: ₹{totalPrice.toFixed(2)}
            </div>
          </CTable>
        </div>

        {/* Mobile View */}
        <div className="d-lg-none mb-4">
          {rowss.map((row, index) => (
            <div key={index} className=" rounded p-3 mb-3">
              {/* Medicine */}
              <div className="mb-2 position-relative">
                <strong>Medicine:</strong>
                <CFormInput
                  type="text"
                  value={medicineSearch[index] || ''}
                  onChange={(e) => handleMedicineSearch(index, e.target.value)}
                  onBlur={() => validateField(index, 'description')}
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
                    width: '100%',
                    border: '1px solid #ccc',
                    borderTop: 'none',
                    borderRadius: '0 0 6px 6px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    overflowY: 'auto'
                  }}>
                    {medicineOptions[index].map((medicine) => (
                      <div
                        key={medicine.id}
                        className="d-flex justify-content-center align-items-center"
                        style={{
                          padding: '8px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f1f1f1',
                          transition: 'background 0.2s ease',
                          textAlign: 'center',
                          fontSize: '0.95rem',
                          fontWeight: 500
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                        onClick={() => {
                          handleRowChangee(index, 'description', medicine.id);
                          handleMedicineChange(index, medicine.id);
                          setMedicineSearch((prev) => ({ ...prev, [index]: medicine.drug_name }));
                          setMedicineOptions((prev) => ({ ...prev, [index]: [] }));
                          clearFieldError(index, 'description');
                        }}
                      >
                        {medicine.drug_name}
                      </div>
                    ))}
                  </div>
                )}
                {rowErrors[index]?.description && <div className="text-danger small mt-1">{rowErrors[index].description}</div>}
              </div>

              <div className="d-flex gap-2 mb-2">
                <div className="w-50 position-relative">
                  <strong>Strength:</strong>
                  <CFormInput
                    value={row.strength}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleRowChangee(index, 'strength', value);
                        toggleSuggestion(index, 'showStrength', false);
                      }}
                      onFocus={() => {
                        if (!row.strength) {
                          toggleSuggestion(index, 'showStrength', true);
                        }
                      }}
                      onBlur={() => validateField(index, 'strength')}
                      placeholder="Strength"
                      disabled={!row.description}
                  />
                  {suggestionFlags[index]?.showStrength &&
                      row.drugDetails?.filter((d) => d.drug_id === parseInt(row.description, 10))?.slice(0, 5).map((drug, i) => (
                        <div
                          key={i}
                          className="position-absolute w-100 bg-white border shadow-sm mt-1 px-2 py-1 rounded cursor-pointer"
                          style={{ zIndex: 2000 }}
                          onClick={() => {
                            handleRowChangee(index, 'strength', drug.strength);
                            toggleSuggestion(index, 'showStrength', false);
                            clearFieldError(index, 'strength');
                          }}
                        >
                          {drug.strength}
                        </div>
                      ))}
                  {rowErrors[index]?.strength && <div className="text-danger small mt-1">{rowErrors[index].strength}</div>}
                </div>

                <div className="w-50">
                  <strong>Dosage:</strong>
                  <CFormInput
                  type="text"
    value={row.dosage}
    onChange={(e) => {
      const raw = e.target.value.replace(/-/g, '').trim();
      const only01 = raw.replace(/[^01]/g, '');

      if (only01.length > 3) return;

      // Auto-format to 1-0-1 style
      const formatted = only01.length === 3
        ? `${only01[0]}-${only01[1]}-${only01[2]}`
        : only01;

      handleRowChangee(index, 'dosage', formatted);

      // Clear error if fully valid
      if (/^[01]-[01]-[01]$/.test(formatted)) {
        clearFieldError(index, 'dosage');
      }
    }}
    onBlur={() => validateField(index, 'dosage')}
    placeholder="e.g. 1-0-1"
    maxLength={5}
                  />
                  {rowErrors[index]?.dosage && <div className="text-danger small mt-1">{rowErrors[index].dosage}</div>}
                </div>
              </div>

              <div className="d-flex gap-2 mb-2">
                <div className="w-50">
                  <strong>Timing:</strong>
                  <CFormSelect 
                    value={row.timing} 
                    onChange={(e) => {
                      handleRowChangee(index, 'timing', e.target.value);
                      if (e.target.value) clearFieldError(index, 'timing');
                    }}
                    onBlur={() => validateField(index, 'timing')}
                  >
                    <option value="">Select</option>
                    <option value="After Food">After Food</option>
                    <option value="Before Food">Before Food</option>
                  </CFormSelect>
                  {rowErrors[index]?.timing && <div className="text-danger small mt-1">{rowErrors[index].timing}</div>}
                </div>

                <div className="w-50">
                  <strong>Frequency:</strong>
                  <CFormSelect 
                    value={row.frequency} 
                    onChange={(e) => {
                      handleRowChangee(index, 'frequency', e.target.value);
                      if (e.target.value) clearFieldError(index, 'frequency');
                    }}
                    onBlur={() => validateField(index, 'frequency')}
                  >
                    <option value="">Select</option>
                    <option value="Daily">Daily</option>
                    <option value="SOS">SOS</option>
                  </CFormSelect>
                  {rowErrors[index]?.frequency && <div className="text-danger small mt-1">{rowErrors[index].frequency}</div>}
                </div>
              </div>

              <div className="d-flex gap-2 mb-3 w-100">
                <div className="w-75">
                  <strong>Duration:</strong>
                  {row.isCustom ? (
                    <CFormInput
                      value={row.duration}
                      placeholder="Custom"
                      onChange={(e) => {
                        handleRowChangee(index, 'duration', e.target.value);
                        if (e.target.value) clearFieldError(index, 'duration');
                      }}
                      onBlur={() => validateField(index, 'duration')}
                    />
                  ) : (
                    <CFormSelect
                      value={row.duration}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleRowChangee(index, 'isCustom', val === 'SOS');
                        handleRowChangee(index, 'duration', val === 'SOS' ? '' : val);
                        if (val) clearFieldError(index, 'duration');
                      }}
                      onBlur={() => validateField(index, 'duration')}
                    >
                      <option value="">Select</option>
                      {['3 Days', '5 Days', '7 Days', '15 Days', '30 Days', 'SOS'].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </CFormSelect>
                  )}
                  {rowErrors[index]?.duration && <div className="text-danger small mt-1">{rowErrors[index].duration}</div>}
                </div>

                <div className="w-75">
                  <strong>Price (₹):</strong>
                  <CFormInput
                    type="number"
                    min="0"
                    className="text-center"
                    value={
                      activeEditableRowIndex === index
                        ? row.price ?? ''
                        : row.price || row.drugDetails?.[0]?.price || ''
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        handleRowChangee(index, 'price', '');
                        return;
                      }
                      const numberValue = Number(val);
                      if (numberValue >= 0) {
                        handleRowChangee(index, 'price', numberValue);
                        clearFieldError(index, 'price');
                      }
                    }}
                    onFocus={() => {
                      setActiveEditableRowIndex(index);
                      handleRowChangee(index, 'price', '');
                    }}
                    onBlur={() => {
                      if (row.price === '' || row.price === null || row.price === undefined) {
                        handleRowChangee(index, 'price', row.drugDetails?.[0]?.price ?? '');
                      }
                      setActiveEditableRowIndex(null);
                      validateField(index, 'price');
                    }}
                  />
                  {rowErrors[index]?.price && (
                    <div className="text-danger small mt-1">{rowErrors[index].price}</div>
                  )}
                </div>
              </div>

              <div className="d-flex align-items-end justify-content-center gap-2 w-50">
                <CButton color="danger" size="sm" onClick={() => handleRemoveRoww(index)} disabled={index === 0}>
                  <CIcon icon={cilDelete} />
                </CButton>
                <CButton color="success" size="sm" onClick={handleAddRoww}>
                  <CIcon icon={cilPlus} />
                </CButton>
              </div>
            </div>
          ))}
        </div>
      </CCardBody>
    </>
  )}
</div>


</CCard>


     
{/* Descriptions */}
   

  {/* Desktop View */}
<div className="d-none d-lg-block mt-2"  >
  <CCard className="mb-3  px-3 py-3 rounded-4" style={{ backgroundColor: '#FFF9DB' }}>
<sapn className='fw-semibold mb-2 fs-5' style={{ color: '#944C1F' }}>💰 Billing Information</sapn>
<div className="mb-2 d-flex gap-3 align-items-center">
  {/* <strong className='fw-semibold'>GST:</strong> */}
  <CFormCheck
    type="radio"
    className='fw-semibold'
    label="With GST"
    name="gstToggle"
    checked={showGST}
    onChange={() => setShowGST(true)}
  />
  <CFormCheck
    type="radio"
    className='fw-semibold'
    label="Without GST"
    name="gstToggle"
    checked={!showGST}
    onChange={() => setShowGST(false)}
  />
</div>



    <CRow>
      <CTable hover responsive className='table-borderless' style={{ backgroundColor: 'transparent' }}>
        <CTableHead className="text-center text-sm font-semibold ">
          {/* <CTableRow>
            {['Description', 'Quantity', 'Fees', 'GST (%)', 'Total', 'Actions'].map((header, idx) => (
              <CTableHeaderCell key={idx} className="px-2 py-2">{header}</CTableHeaderCell>
            ))}
          </CTableRow> */}

<>
  <CTableHeaderCell className="px-2 py-2 fw-semibold">Description</CTableHeaderCell>
  <CTableHeaderCell className="px-2 py-2 fw-semibold">Quantity</CTableHeaderCell>
  <CTableHeaderCell className="px-2 py-2 fw-semibold">Fees</CTableHeaderCell>
  {showGST && (
    <CTableHeaderCell className="px-2 py-2 fw-semibold">GST (%)</CTableHeaderCell>
  )}
  <CTableHeaderCell className="px-2 py-2 fw-semibold">Total</CTableHeaderCell>
  <CTableHeaderCell className="px-2 py-2 fw-semibold">Actions</CTableHeaderCell>
</>



        </CTableHead>
        <CTableBody className=' border border-grey rounded-4 no-bg' style={{ backgroundColor: 'transparent' }}>
          {rows.map((row, index) => (
            <CTableRow key={index} className="align-middle text-center ">
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


              <CTableDataCell style={{ width: '16.66%' }}>
                {/* <CFormInput
                  type="text"
                  className="text-center"
                  value={row.description === 'Medicine' ? rowss.length : row.quantity}
                 
                  onChange={(e) => handleRowChange(index, 'quantity', Math.max(0, Number(e.target.value)))}
                  onFocus={() => handleRowChange(index, 'quantity', '')}
                /> */}



                {/* <CFormInput
  type="number"
  className="text-center"
  value={row.description === 'Medicine' ? rowss.length : row.quantity}
  onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
  readOnly={row.description === 'Medicine'}
/>

                {rowErrors[index]?.quantity && (
                  <div className="text-danger small">{rowErrors[index].quantity}</div>
                )} */}

<CFormInput
  type="number"
  className="text-center"
  placeholder='Add Quantity Here'
  value={
    row.description === 'Medicine'
      ? rowss.length
      : row.quantity === 0
      ? ''
      : row.quantity
  }
  onChange={(e) => handleRowChange(index, 'quantity', Number(e.target.value))}
  onFocus={(e) => {
    if (row.description !== 'Medicine' && (row.quantity === 0 || row.quantity === null)) {
      handleRowChange(index, 'quantity', '');
    }
  }}
  readOnly={row.description === 'Medicine'}
/>

{rowErrors[index]?.quantity && (
  <div className="text-danger small">{rowErrors[index].quantity}</div>
)}


              </CTableDataCell>


              {/* <CTableDataCell style={{ width: '16.66%' }}>
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
              </CTableDataCell> */}

              {/* <CTableDataCell style={{ width: '16.66%' }}>
  {row.description === 'Medicine' ? (
    <CFormInput
      type="number"
      className="text-center"
      value={totalPrice || 0}
   
      plaintext
       onChange={(e) => handleRowChange(index, 'price', Number(e.target.value))}
                  onFocus={() => handleRowChange(index, 'price', '')}
    />
  ) : (
    <>
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
    </>
  )}
</CTableDataCell> */}
<CTableDataCell style={{ width: '16.66%' }}>
  {row.description === 'Medicine' ? (
  <CFormInput
    type="number"
    className="text-center"
    value={row.price === 0 ? '' : row.price} // Display empty string when price is 0
    onChange={(e) => {
      const value = Number(e.target.value);
      if (value >= 0) {
        handleRowChange(index, 'price', value);
      }
    }}
    onFocus={(e) => {
      if (row.price === 0) {
        e.target.value = ''; // Clear the input on focus if the value is 0
        handleRowChange(index, 'price', ''); // Also update the state to empty string
      }
    }}
    onKeyDown={(e) => {
      // Prevent minus key, 'e', 'E', '+' keys
      if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
        e.preventDefault();
      }
    }}
  />
) : (
  <>
    <CFormInput
      type="number"
      className="text-center"
      value={row.price === 0 ? '' : row.price} // Display empty string when price is 0
      onChange={(e) => {
        const value = Number(e.target.value);
        if (value >= 0) {
          handleRowChange(index, 'price', value);
        }
      }}
      onFocus={(e) => {
        if (row.price === 0) {
          e.target.value = ''; // Clear the input on focus if the value is 0
          handleRowChange(index, 'price', ''); // Also update the state to empty string
        }
      }}
      onKeyDown={(e) => {
        // Prevent minus key, 'e', 'E', '+' keys
        if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
          e.preventDefault();
        }
      }}
      onBlur={(e) => {
        // Double check on blur - if somehow negative value got through
        const value = Number(e.target.value);
        if (value < 0) {
          handleRowChange(index, 'price', 0);
        }
      }}
    />
    {rowErrors[index]?.price && (
      <div className="error">{rowErrors[index].price}</div>
    )}
  </>
)}

</CTableDataCell>

              
              {/* <CTableDataCell style={{ width: '16.66%' }}>
                <CFormInput
                  type="text"
                  className="text-center"
                  value={row.gst}
                  onChange={(e) => handleRowChange(index, 'gst', Number(e.target.value))}
                  onFocus={() => handleRowChange(index, 'gst', '')}
                />
              </CTableDataCell> */}

              {/* {showGST && (
  <CTableDataCell style={{ width: '16.66%' }}>
    <CFormInput
      type="text"
      className="text-center"
      value={row.gst}
      onChange={(e) => handleRowChange(index, 'gst', Number(e.target.value))}
      onFocus={() => handleRowChange(index, 'gst', '')}
    />
  </CTableDataCell>
)} */}

{/* {showGST && (
  <CTableDataCell style={{ width: '16.66%' }}>
    <CFormInput
      type="text"
      className="text-center"
      value={row.gst}
      onChange={(e) => handleRowChange(index, 'gst', Number(e.target.value))}
      onFocus={() => handleRowChange(index, 'gst', '')}
      disabled={row.description === 'Medicine'} // Disable if description is Medicine
    />
  </CTableDataCell>
)} */}
{showGST && (
  <CTableDataCell style={{ width: '16.66%' }}>
    <CFormInput
      type="text"
      className="text-center"
      value={(row.gst === 0 || row.gst === '') ? '' : row.gst} // Display empty string when gst is 0 or ''
      onChange={(e) => handleRowChange(index, 'gst', e.target.value)} // Store as string
      onFocus={(e) => {
        if (row.gst === 0 || row.gst === '') {
          e.target.value = ''; // Clear the input on focus if the value is 0 or ''
          handleRowChange(index, 'gst', ''); // Update state to empty string
        }
      }}
      onBlur={(e) => {
        if (e.target.value === '') {
          handleRowChange(index, 'gst', 0); // Set to 0 if input is empty
        } else {
          handleRowChange(index, 'gst', Number(e.target.value)); // Convert to number if not empty
        }
      }}
      placeholder="0" // Add a placeholder
      disabled={row.description === 'Medicine'} // Disable if description is Medicine
    />
  </CTableDataCell>
)}




              {/* <CTableDataCell className="fw-bold" style={{ width: '16.66%' }}>₹ {row.total.toFixed(2)} </CTableDataCell>      */}
{/* <CTableDataCell className="fw-bold" style={{ width: '16.66%' }}>
  {row.description === 'Medicine'
    ? `₹ ${totalPrice.toFixed(2)}`
    : `₹ ${row.total.toFixed(2)}`}
</CTableDataCell> */}
<CTableDataCell className="fw-bold" style={{ width: '16.66%' }}>
  ₹ {row.total.toFixed(2)}
</CTableDataCell>



              <CTableDataCell style={{ width: '16.66%' }}>
                <div className="d-flex justify-content-center gap-2">
                  <CButton color="danger" size="sm" onClick={() => handleRemoveRow(index)} disabled={index === 0}>
                    <CIcon icon={cilDelete} />
                  </CButton>
                  <CButton color="success" size="sm" onClick={handleAddRow}>
                    <CIcon icon={cilPlus} />
                  </CButton>
                </div>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </CRow>
  </CCard>
</div>

{/* Mobile View */}

<div className="d-block d-lg-none mt-2">

  {rows.map((row, index) => (
    <CCard className="mb-2 px-2 py-2" key={index}>


<div className="d-block d-lg-none px-3 py-2">
  
  <div className="mb-3 d-flex gap-3 align-items-center">
    <strong>GST:</strong>
    <CFormCheck
      type="radio"
      label="With GST"
      name="gstToggleMobile"
      checked={showGST}
      onChange={() => setShowGST(true)}
    />
    <CFormCheck
      type="radio"
      label="Without GST"
      name="gstToggleMobile"
      checked={!showGST}
      onChange={() => setShowGST(false)}
    />
  </div>
</div>


      <CRow className="mb-2">
        <CCol xs="12">
          <strong>Description</strong>
          <CFormSelect
            value={row.description}
            onChange={(e) => handleRowChange(index, 'description', e.target.value)}
          >
            <option value="Consulting">Consulting</option>
            <option value="Medicine">Medicine</option>
            <option value="OPD">OPD</option>
          </CFormSelect>
        </CCol>
      </CRow>

      <CRow className="mb-2">
        <CCol xs="12">
          <strong>Quantity</strong>
          <CFormInput
  type="number"
  className="text-center"
  placeholder='Add Quantity Here'
  value={
    row.description === 'Medicine'
      ? rowss.length
      : row.quantity === 0
      ? ''
      : row.quantity
  }
  onChange={(e) => handleRowChange(index, 'quantity', Number(e.target.value))}
  onFocus={(e) => {
    if (row.description !== 'Medicine' && (row.quantity === 0 || row.quantity === null)) {
      handleRowChange(index, 'quantity', '');
    }
  }}
  readOnly={row.description === 'Medicine'}
/>
          {rowErrors[index]?.quantity && (
            <div className="text-danger small">{rowErrors[index].quantity}</div>
          )}
        </CCol>
      </CRow>



      <CRow className="mb-2">
        <CCol xs="12">
          <strong>Fees</strong>
           {row.description === 'Medicine' ? (
  <CFormInput
    type="number"
    className="text-center"
    value={row.price === 0 ? '' : row.price} // Display empty string when price is 0
    onChange={(e) => {
      const value = Number(e.target.value);
      if (value >= 0) {
        handleRowChange(index, 'price', value);
      }
    }}
    onFocus={(e) => {
      if (row.price === 0) {
        e.target.value = ''; // Clear the input on focus if the value is 0
        handleRowChange(index, 'price', ''); // Also update the state to empty string
      }
    }}
    onKeyDown={(e) => {
      // Prevent minus key, 'e', 'E', '+' keys
      if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
        e.preventDefault();
      }
    }}
  />
) : (
  <>
    <CFormInput
      type="number"
      className="text-center"
      value={row.price === 0 ? '' : row.price} // Display empty string when price is 0
      onChange={(e) => {
        const value = Number(e.target.value);
        if (value >= 0) {
          handleRowChange(index, 'price', value);
        }
      }}
      onFocus={(e) => {
        if (row.price === 0) {
          e.target.value = ''; // Clear the input on focus if the value is 0
          handleRowChange(index, 'price', ''); // Also update the state to empty string
        }
      }}
      onKeyDown={(e) => {
        // Prevent minus key, 'e', 'E', '+' keys
        if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
          e.preventDefault();
        }
      }}
      onBlur={(e) => {
        // Double check on blur - if somehow negative value got through
        const value = Number(e.target.value);
        if (value < 0) {
          handleRowChange(index, 'price', 0);
        }
      }}
    />
    {rowErrors[index]?.price && (
      <div className="error">{rowErrors[index].price}</div>
    )}
  </>
)}

        </CCol>
      </CRow>

      {showGST && (
        <CRow className="mb-2">
          <CCol xs="12">
            <strong>GST (%)</strong>
            <CFormInput
      type="text"
      className="text-center"
      value={(row.gst === 0 || row.gst === '') ? '' : row.gst} // Display empty string when gst is 0 or ''
      onChange={(e) => handleRowChange(index, 'gst', e.target.value)} // Store as string
      onFocus={(e) => {
        if (row.gst === 0 || row.gst === '') {
          e.target.value = ''; // Clear the input on focus if the value is 0 or ''
          handleRowChange(index, 'gst', ''); // Update state to empty string
        }
      }}
      onBlur={(e) => {
        if (e.target.value === '') {
          handleRowChange(index, 'gst', 0); // Set to 0 if input is empty
        } else {
          handleRowChange(index, 'gst', Number(e.target.value)); // Convert to number if not empty
        }
      }}
      placeholder="0" // Add a placeholder
      disabled={row.description === 'Medicine'} // Disable if description is Medicine
    />
          </CCol>
        </CRow>
      )}

      <CRow className="mb-2">
        <CCol xs="12">
          <strong>Total</strong>
          <div className="fw-bold">₹ {row.total.toFixed(2)}</div>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs="12" className="d-flex justify-content-center gap-2">
          <CButton
            color="danger"
            size="sm"
            onClick={() => handleRemoveRow(index)}
            disabled={index === 0}
          >
            <CIcon icon={cilDelete} />
          </CButton>
          <CButton color="success" size="sm" onClick={handleAddRow}>
            <CIcon icon={cilPlus} />
          </CButton>
        </CCol>
      </CRow>
    </CCard>
  ))}
</div>



       

        <CCardBody>

<CRow className="g-3 align-items-center">
  {/* Label + Input + Button Grouped */}
  <CCol xs={12} md={8} lg={7}>
    <div className="d-flex flex-column flex-md-row align-items-md-center">
      <CFormLabel
        htmlFor="followupdate"
        className="fw-semibold mb-2 mb-md-0 me-md-2 "
        style={{ minWidth: '150px' }}
      >
       📅 Followup Date
      </CFormLabel>
      <CFormInput
        type="date"
        id="followupdate"
        value={followupdate}
        onChange={(e) => setfollowupdate(e.target.value)}
        required
        className="me-md-2 border border-2 border-black"
      />
    
      <CButton color="primary" onClick={handleSubmit} className="mt-2 mt-md-0 fw-semibold w-75">
         Submit
      </CButton>
    </div>
  </CCol>
</CRow>




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






    //    {/* <CButton
    //       color={selectedOption === "Token" ? "primary" : "light"}
    //       shape="rounded-pill"
    //       onClick={() => handleDropdownSelect("Token")}
    //       className="border border-blue-500 text-blue-700 hover:bg-blue-50 shadow-sm"
    //     >
    //       Token
    //     </CButton>&nbsp;&nbsp; */}
    //      <CCard
    //   className={`mb-3 shadow-sm border-2 cursor-pointer ${
    //     selectedOption === 'Token' ? 'border-primary' : 'border-primary'
    //   }`}
    //   style={{
    //     borderRadius: '1rem',
    //     backgroundColor: selectedOption === 'Token' ? '#eaf3ff' : '#f8f9fa',
    //     transition: '0.3s ease',
    //     maxWidth: '300px',
    //     cursor: 'pointer',
    //   }}
    //   onClick={() => handleDropdownSelect('Token')}
    // >
    //   <CCardBody className="d-flex align-items-center gap-3">
    //     <div
    //       className="d-flex align-items-center justify-content-center bg-white border border-primary"
    //       style={{
    //         width: '48px',
    //         height: '48px',
    //         borderRadius: '12px',
    //       }}
    //     >
    //       <CIcon icon={cilClock} size="xl" className="text-primary" />
    //     </div>
    //     <div>
    //       <div className="fw-semibold text-primary fs-5">Token</div>
    //       <div className="text-medium-emphasis small">Quick token-based visit</div>
    //     </div>
    //   </CCardBody>
    // </CCard>

    //     {/* <CButton
    //       color={selectedOption === "Appointment" ? "primary" : "light"}
    //       shape="rounded-pill"
    //       onClick={() => handleDropdownSelect("Appointment")}
    //       className="border border-green-500 text-green-700 hover:bg-green-50 shadow-sm"
    //     >
    //       Appointment
    //     </CButton> &nbsp;&nbsp; */}
    //         <CCard
    //   onClick={() => handleDropdownSelect('Appointment')}
    //   className={`mb-3 shadow-sm border-2 cursor-pointer ${
    //     isActive ? 'border-success' : 'border-success'
    //   }`}
    //   style={{
    //     borderRadius: '1rem',
    //     backgroundColor: isActive ? '#d4f7e4' : '#f8f9fa',
    //     transition: '0.3s ease',
    //     maxWidth: '300px',
    //     cursor: 'pointer',
    //   }}
    // >
    //   <CCardBody className="d-flex align-items-center gap-3">
    //     <div
    //       className="d-flex align-items-center justify-content-center bg-white border border-success"
    //       style={{
    //         width: '48px',
    //         height: '48px',
    //         borderRadius: '12px',
    //       }}
    //     >
    //       <CIcon icon={cilCalendar} size="xl" className="text-success" />
    //     </div>
    //     <div>
    //       <div className="fw-semibold text-success fs-5">Appointment</div>
    //       <div className="text-medium-emphasis small">Scheduled appointment</div>
    //     </div>
    //   </CCardBody>
    // </CCard>

    //     {/* <CButton
    //       color={selectedOption === "Default" ? "primary" : "light"}
    //       shape="rounded-pill"
    //       // onClick={() => handleDropdownSelect("Default")}
    //       className="border border-green-500 text-green-700 hover:bg-green-50 shadow-sm"
    //     >
    //  Default
    //     </CButton> &nbsp;&nbsp; */}
    //         <CCard
    //   onClick={() => handleDropdownSelect('Default')}
    //   className={`mb-3 shadow-sm border-2 cursor-pointer ${
    //     isActive1 ? 'border-primary' : 'border-primary'
    //   }`}
    //   style={{
    //     borderRadius: '1rem',
    //     backgroundColor: isActive1 ? '#f6efff' : '#f8f9fa', // light violet background
    //     transition: '0.3s ease',
    //     maxWidth: '300px',
    //     cursor: 'pointer',
    //   }}
    // >
    //   <CCardBody className="d-flex align-items-center gap-3">
    //     <div
    //       className="d-flex align-items-center justify-content-center bg-white border border-primary"
    //       style={{
    //         width: '48px',
    //         height: '48px',
    //         borderRadius: '12px',
            
    //       }}
    //     >
    //       <CIcon icon={cilSettings} size="xl" style={{ color: '#8000ff' }} />
    //     </div>
    //     <div>
    //       <div className="fw-semibold" style={{ color: '#8000ff', fontSize: '1.1rem' }}>
    //         Default
    //       </div>
    //       <div className="text-medium-emphasis small">Default configuration</div>
    //     </div>
    //   </CCardBody>
    // </CCard>



    // tokan
    //     try {
    //   // Determine endpoint based on dropdown option
    //   const endpoint =
    //     selectedOption === 'Appointment'
    //       ? `/api/getAppointmentByToken/2` // ${inputValue} Replace with your real Appointment API endpoint
    //       : `/api/getPatientInfo`;
  
    //   // Make API call
    //   const response = await post(endpoint, { tokan_number: inputValue });
    //   const patientId = response?.patient?.id;

    //   console.log(endpoint);
      

    //   if (!patientId) {
    //     throw new Error("Patient ID not found in response.");
    //   }
  
    //   console.log("✅ Patient ID:", patientId);
  
    //   // Set the fetched data
    //   setData(response);
    //   setTokanPatientID(patientId); // still store it if you want elsewhere
  
    //   // 🔥 Use the ID directly here
    //   const res = await getAPICall(`/api/patient-details/${patientId}`);
    //   console.log("✅ Selected Patient :", res);
  
    //   setLastBill(res?.last_bill);
    //   sethealthdirectives(res?.health_directives || []);
    //   setpatientExaminations(res?.patient_examinations || []);
    //   setayurvedicExaminations(res?.ayurvedic_examintion|| []);

    //   setShowPatientCard(true);

    // } catch (error) {
    //   console.error('❌ Error fetching patient full details', error);
    //   showToast('Failed to fetch data. Please check the ID and try again.', 'Validation Error', '#d9534f');
    //   // alert('Failed to fetch data. Please check the ID and try again.');
    //   setData(null); // Clear data on error
    //   setShowPatientCard(false); // Hide on error
    // }