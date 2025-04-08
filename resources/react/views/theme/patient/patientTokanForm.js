import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CInputGroup,
  CFormInput,
  CRow,
  CCol,
  CFormSelect,
} from '@coreui/react';
import { getAPICall, post } from '../../../util/api';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../../util/session';


function PatientTokanForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patientData, setPatientData] = useState([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    dob: '',
    doctorId:'', 
    slot:''
  });
  const [doctorList, setDoctorList] = useState([]); // State to hold the list of doctors
  const [errors, setErrors] = useState({});
  const [clinicId, setClinicId] = useState('');
  const [isExistingPatient, setIsExistingPatient] = useState(false); // New state to track if the patient is existing
  const [selectedSlot, setSelectedSlot] = useState("");
console.log("selectedSlot",selectedSlot);

const user = getUser();
console.log("user",user.id);

  // Fetch the list of doctors when the component mounts

  // useEffect(() => {
  //   // Fetch clinic ID from session storage or user data
  //   const storedClinicId = sessionStorage.getItem('clinic_id'); // Modify based on where you store it
  //   if (storedClinicId) {
  //     setClinicId(storedClinicId);
  //   }
  // }, []);
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getAPICall('/api/getDoctorsByLoggedInClinic'); // API to get doctors for the clinic
        setDoctorList(response); // Populate doctor list from API
      } catch (error) {
        console.error('Error fetching doctor list:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
    const clinicId = userData?.user?.clinic_id; // Extract only the clinic_id
  
    console.log("Searching with:", { phone: searchQuery, clinicId });
  
    if (!searchQuery || !clinicId) {
      alert("Please enter a phone number and ensure clinic ID is available.");
      return;
    }
  
    try {
      const response = await getAPICall(`/api/patients?phone=${searchQuery}&clinic_id=${clinicId}`);
      console.log("API Response:", response);
  
      if (response && response.length > 0) {
        setPatientData(response);
        setIsNotFound(false);
        setIsExistingPatient(true);
      } else {
        setPatientData([]);
        setIsNotFound(true);
        setIsExistingPatient(false);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setPatientData([]);
      setIsNotFound(true);
      setIsExistingPatient(false);
    }
  };
  
  
console.log("patientData.patient",patientData.patient);


  const validateForm = () => {
    const errors = {};
    if (!newPatient.name) errors.name = 'Name is required';
    if (!newPatient.phone || !/^\d{10}$/.test(newPatient.phone))
      errors.phone = 'Valid 10-digit phone number is required';
    if (!newPatient.address) errors.address = 'Address is required';
    if (newPatient.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newPatient.email))
      errors.email = 'Valid email is required';
    if (!newPatient.dob) errors.dob = 'Date of Birth is required';
    if (!newPatient.doctorId && user.id==0) errors.doctorId = 'Doctor selection is required';
    return errors;
  };

  const checkIfPhoneExists = async (phone) => {
    try {
      const response = await getAPICall(`/api/patients?phone=${phone}`);
      if (response && response.length > 0) {
        // If a patient exists with this phone number, return true
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking if phone exists:', error);
      return false; // Default to false if there is an error
    }
  }; 

  const navigate = useNavigate();

  // const handleAddPatient = async () => {
  //   const formErrors = validateForm();
  //   if (Object.keys(formErrors).length > 0) {
  //     setErrors(formErrors);
  //     return;
  //   }
  
  //   const phoneExists = await checkIfPhoneExists(newPatient.phone);
  //   if (phoneExists) {
  //     setErrors({ ...formErrors, phone: 'This phone number is already associated with an existing patient.' });
  //     return;
  //   }
  // let doctorId=null;
  //   const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
  //   const clinicId = userData?.user?.clinic_id?.toString(); // Ensure clinic_id is a string
  //   if(user.type=== 1){
  //   doctorId =user?.id.toString() ;
  //   }
  //   if(user.type=== 0 ){
  //     doctorId = newPatient.doctorId==="" ? newPatient.doctorId.toString() : null; // Ensure doctorId is a string
  //   }
     
  
  //   if (!clinicId) {
  //     alert("Clinic ID is missing. Please log in again.");
  //     return;
  //   }
  
  //   // Log values before making API call
  //   console.log("Clinic ID:", clinicId);
  //   console.log("Doctor ID (Before Sending):", doctorId);
  
  //   // Assign clinicId and doctorId properly
  //   const patientDataToSend = {
  //     ...newPatient,
  //     clinic_id: clinicId, 
  //     doctor_id: doctorId, // Ensure field name matches Laravel API expectations
  //   };
  //   //  console.log("patientDataToSend",patientDataToSend);
    
  
  //   console.log("Patient Data Being Sent:", patientDataToSend);
  
  //   try {
  //     const response = await post('/api/patients', patientDataToSend);
      
  //     console.log("Response from API:", response);
  
  //     alert('Patient added successfully!');
  //     setPatientData([response.patient]);
  
  //     setNewPatient({
  //       name: '',
  //       phone: '',
  //       address: '',
  //       email: '',
  //       dob: '',
  //       doctorId: '',
  //       // date:'',
  //       // slot:''
  //     });
  
  //     setIsNotFound(false);
  //     setIsExistingPatient(false);
  //     setErrors({});
  //      // Navigate to dashboard2 after success
  //       navigate('/Dashboard2');
  //   } catch (error) {
  //     console.error('Error adding new patient:', error);
  //     if (error.response?.data?.errors) {
  //       setErrors(error.response.data.errors);
  //     } else {
  //       alert('Failed to add patient due to email. Please try again.');
  //     }
  //   }
  // };
  
  // ____________________________________________________________________________________________ 


  const handleAddPatient = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
  
    const phoneExists = await checkIfPhoneExists(newPatient.phone);
    if (phoneExists) {
      setErrors({ ...formErrors, phone: 'This phone number is already associated with an existing patient.' });
      return;
    }
  
    let doctorId = null;
    const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
    const user = userData?.user || {}; // Ensure user object exists
    const clinicId = user?.clinic_id?.toString(); // Ensure clinic_id is a string
  
    // **Doctor ID Logic**
    if (user?.type === 1) {
      doctorId = user?.id?.toString(); // If user is a doctor, assign their ID
    } else if (user?.type === 0 || user?.type === 2) {
      // If user is Admin (0) or Receptionist (2), get doctorId from dropdown selection
      doctorId = newPatient?.doctorId && newPatient.doctorId !== "" ? newPatient.doctorId.toString() : null;
    }
  
    // Debugging logs
    console.log("Logged-in User Type:", user?.type);
    console.log("Clinic ID:", clinicId);
    console.log("Doctor ID (Before Sending):", doctorId);
    console.log("Selected Doctor ID from Dropdown:", newPatient.doctorId);
  
    if (!clinicId) {
      alert("Clinic ID is missing. Please log in again.");
      return;
    }
  
    if (!doctorId) {
      alert("Please select a doctor from the dropdown.");
      return;
    }
  
    // Prepare the patient data payload
    const patientDataToSend = {
      ...newPatient,
      clinic_id: clinicId,
      doctor_id: doctorId, // Ensure field name matches Laravel API expectations
    };
  
    console.log("Patient Data Being Sent:", patientDataToSend);
  
    try {
      const response = await post('/api/patients', patientDataToSend);
      console.log("Response from API:", response);
  
      alert('Patient added successfully!');
      setPatientData([response.patient]);
  
      // Reset form fields
      setNewPatient({
        name: '',
        phone: '',
        address: '',
        email: '',
        dob: '',
        doctorId: '', // Reset doctorId
      });
  
      setIsNotFound(false);
      setIsExistingPatient(false);
      setErrors({});
  
      // Navigate to dashboard2 after success
      navigate('/Dashboard2');
  
    } catch (error) {
      console.error('Error adding new patient:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert('Failed to add patient. Please try again.');
      }
    }
  };
  


// ____________________________________________________________________________________________________________ 








  

  const handleGenerateToken = async (patientId, clinicId, selectedSlot) => {
    if (!newPatient.doctorId) {
      alert('Please select a doctor before generating the token.');
      return;
    }
  
    try {
      const response = await post('/api/TokanCreate', {
        patient_id: patientId,
        clinic_id: clinicId,
        doctor_id: parseInt(newPatient.doctorId, 10) , // Convert doctor_id to an integer
        // doctor_id:newPatient.doctorId.toString(),
        date: new Date().toISOString().split('T')[0],
        slot: selectedSlot,
        status: "pending",
      });
  
      alert(`Token generated successfully! Token ID: ${response.tokan.tokan_number}`);
      navigate('/Dashboard2');

    } catch (error) {
      console.error('Error generating token:', error);
      alert('Failed to generate token. Please try again.');
    }
  };


  useEffect(() => {
    if (user?.type === 1 && user?.doctorId) {
      setNewPatient((prev) => ({ ...prev, doctorId: user.doctorId }));
    }
  }, [user, setNewPatient]); 

  useEffect(() => {
    if (user?.type === 1) {
      setNewPatient((prev) => ({ ...prev, doctorId: user.id.toString() }));
    }
  }, [user?.type, user?.id]);
  

  return (
    <div>
      <h1>Patient Token Form</h1>
      {/* Search Bar */}
      <CInputGroup className="mb-3">
        <CFormInput
          type="text"
          placeholder="Search by Mobile Number"
          value={searchQuery || ""} // Ensures it's always controlled
          maxLength={10} // Restricts input length
          onChange={(e) => {
            const onlyNumbers = e.target.value.replace(/\D/g, ""); // Removes non-numeric characters
            setSearchQuery(onlyNumbers);
          }}
        />
        <CButton color="primary" onClick={handleSearch}>
          Search
        </CButton>
      </CInputGroup>


      {/* Display Patient Data */}
      {/* {patientData.length > 0 && (
        <div>
          {patientData.map((patient) => (
            <CCard className="mb-3" key={patient.id}>
              <CCardHeader>
                <h5>Patient Details</h5>
              </CCardHeader>
              <CCardBody>
                <p>
                  <strong>Name:</strong> {patient.name}
                </p>
                <p>
                  <strong>Mobile:</strong> {patient.phone}
                </p>
                <p>
                  <strong>Address:</strong> {patient.address}
                </p>
                <p>
                  <strong>Email:</strong> {patient.email}
                </p>
                <p>
                  <strong>DOB:</strong> {patient.dob}
                </p> */}

                {/* <CButton
                  color="success"
                  className="mt-2"
                  onClick={() => handleGenerateToken(patient.id, patient.clinic_id)}
                >
                  Generate Token
                </CButton> */}


                {/* Display Doctor dropdown if patient is existing */}
                {/* {isExistingPatient && (
                  <CFormSelect
                    value={newPatient.doctorId}
                    onChange={(e) => setNewPatient({ ...newPatient, doctorId: e.target.value })}
                  >
                    <option value="">Select Doctor</option>


                    {doctorList.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </option>
                    ))}
                  </CFormSelect>
                )}


         {isExistingPatient && (
  <CFormSelect
    label="Slots"
    value={newPatient.slot}
    onChange={(e) => {
      const selectedValue = e.target.value;
      setNewPatient({ ...newPatient, slot: selectedValue });
      setSelectedSlot(selectedValue);
    }}
  >
    <option value="">Select Slot</option>
    <option value="morning">Morning</option>
    <option value="afternoon">Afternoon</option>
    <option value="evening">Evening</option>
  </CFormSelect>
)}

                <CButton color="primary" className="mt-2"  onClick={() => handleGenerateToken(patient.id, patient.clinic_id, selectedSlot )}>
                  Submit
                </CButton>
              </CCardBody>
            </CCard>
          ))}
        </div>
      )} */}



{/* __________________________________________________________________________________________________  */}

{patientData.length > 0 && (
    <div>
      {patientData.map((patient) => (
        <CCard className="mb-3" key={patient.id}>
          <CCardHeader>
            <h5>Patient Details</h5>
          </CCardHeader>
          <CCardBody>
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Mobile:</strong> {patient.phone}</p>
            <p><strong>Address:</strong> {patient.address}</p>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>DOB:</strong> {patient.dob}</p>

            {/* Hide doctor selection for user.type === 1 */}
            {user?.type === 1 ? (
              <input type="hidden" value={newPatient.doctorId} readOnly />
            ) : user?.type === 2 ? (
              <CFormSelect
                value={newPatient.doctorId}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, doctorId: e.target.value })
                }
              >
                <option value="">Select Doctor</option>
                {doctorList.map((doctor) => (
                  <option key={doctor.id} value={doctor.id.toString()}>
                    {doctor.name}
                  </option>
                ))}
              </CFormSelect>
            ) : null}

            {/* Slot Selection */}
            {isExistingPatient && (
              <CFormSelect
                label="Slots"
                value={newPatient.slot}
                onChange={(e) => setNewPatient({ ...newPatient, slot: e.target.value })}
              >
                <option value="">Select Slot</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </CFormSelect>
            )}

            {/* Submit Button */}
            <CButton 
              color="primary" 
              className="mt-2"  
              onClick={() => handleGenerateToken(patient.id, patient.clinic_id, newPatient.slot)}
            >
              Submit
            </CButton>
          </CCardBody>
        </CCard>
      ))}
    </div>
  )}


{/* _________________________________________________________________________________________________________________________  */}














      {/* Add New Patient Form */}
      {isNotFound && (
        <CCard>
          <CCardHeader>
            <h5>Add New Patient</h5>
          </CCardHeader>
          <CCardBody>
            <CFormInput
              label="Patient Name"
              className="mb-1" 
              value={newPatient.name}
              onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
              placeholder="Enter patient name"
            />
            {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}

            <CFormInput
              label="Mobile Number"
              type="text"
              className="mb-1" 
              value={newPatient.phone}
              onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
              placeholder="Enter mobile number"
              onInput={(e) => {
                if (e.target.value.length > 10) {
                  e.target.value = e.target.value.slice(0, 10); // Limit to 10 digits
                }
              }}
            />
            {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}

            <CFormInput
              label="Address"
              className="mb-1" 
              value={newPatient.address}
              onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
              placeholder="Enter address"
            />
            {errors.address && <div style={{ color: 'red' }}>{errors.address}</div>}

            <CFormInput
              label="Email"
              type="email"
              className="mb-1" 
              value={newPatient.email}
              onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
              placeholder="Enter email address"
            />
            {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}

            <CFormInput
              label="Date of Birth"
              type="date"
              className="mb-1" 
              value={newPatient.dob}
              max={new Date().toISOString().split("T")[0]} // Restrict future dates
              onChange={(e) => setNewPatient({ ...newPatient, dob: e.target.value })}
            />
            {errors.dob && <div style={{ color: 'red' }}>{errors.dob}</div>}

            {/* Do not display doctor dropdown for new patients */}
            {/* {!isExistingPatient && (
              <CFormSelect
                label="Select Doctor"
                value={newPatient.doctorId}
                onChange={(e) => setNewPatient({ ...newPatient, doctorId: e.target.value })}
              >
               <option value="">Select Doctor</option>

                {doctorList.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </CFormSelect>
            )}
            {errors.doctorId && <div style={{ color: 'red' }}>{errors.doctorId}</div>} */}

{user?.type === 2 ? (
  // Show doctor selection dropdown when userType is 2
  <CFormSelect
    label="Select Doctor"
    value={newPatient.doctorId}
    onChange={(e) => setNewPatient({ ...newPatient, doctorId: e.target.value })}
  >
    <option value="">Select Doctor</option>
    {doctorList.map((doctor) => (
      <option key={doctor.id} value={doctor.id}>
        {doctor.name}
      </option>
    ))}
  </CFormSelect>
) : user?.type === 1 ? (
  // Hide dropdown and set doctorId automatically for userType 1
  <input  
  type="hidden"  
  value={user.id}
  readOnly  
/>  
) : null}

{/* Display error message if doctorId is missing */}
{errors.doctorId && <div style={{ color: 'red' }}>{errors.doctorId}</div>}






            {/* <CFormInput
              label="Appointment Date"
              type="date"
              value={newPatient.date}
              onChange={(e) => setNewPatient({ ...newPatient, dob: e.target.value })}
            />
            */}
           <CFormSelect
              label="Slots"
              value={newPatient.slot}
  onChange={(e) => setNewPatient({ ...newPatient, slot: e.target.value })}
            >
            <option value="">Select Slot</option>
            <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            </CFormSelect>
 





            <CButton color="success" className="mt-3" onClick={handleAddPatient}>
              Add Patient
            </CButton>
          </CCardBody>
        </CCard>
      )}
    </div>
  );
}

export default PatientTokanForm;






// import React, { useState, useEffect } from "react";
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CButton,
//   CInputGroup,
//   CFormInput,
//   CRow,
//   CCol,
//   CFormSelect,
// } from "@coreui/react";
// import { getAPICall, post } from "../../../util/api";
// import { useNavigate } from "react-router-dom";
// import { getUser } from "../../../util/session";

// function PatientTokanForm() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [patientData, setPatientData] = useState([]);
//   const [isNotFound, setIsNotFound] = useState(false);
//   const [doctorList, setDoctorList] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [isExistingPatient, setIsExistingPatient] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState("");
//   const [newPatient, setNewPatient] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     email: "",
//     dob: "",
//     doctorId: "",
//   });

//   const navigate = useNavigate();
//   const user = getUser(); // Get logged-in user data

//   console.log("Logged-in User:", user);

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const response = await getAPICall("/api/getDoctorsByLoggedInClinic");
//         setDoctorList(response); // Populate doctor list from API
//       } catch (error) {
//         console.error("Error fetching doctor list:", error);
//       }
//     };

//     fetchDoctors();
//   }, []);

//   // Set doctor ID automatically if user type = 1 (Doctor)
//   useEffect(() => {
//     if (user?.type === 1) {
//       setNewPatient((prev) => ({ ...prev, doctorId: user.id.toString() }));
//     }
//   }, [user]);

//   const handleInputChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleSearch = async () => {
//     const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
//     const clinicId = userData?.user?.clinic_id;

//     if (!searchQuery || !clinicId) {
//       alert("Please enter a phone number and ensure clinic ID is available.");
//       return;
//     }

//     try {
//       const response = await getAPICall(
//         `/api/patients?phone=${searchQuery}&clinic_id=${clinicId}`
//       );

//       if (response && response.length > 0) {
//         setPatientData(response);
//         setIsNotFound(false);
//         setIsExistingPatient(true);
//       } else {
//         setPatientData([]);
//         setIsNotFound(true);
//         setIsExistingPatient(false);
//       }
//     } catch (error) {
//       console.error("Error fetching patient data:", error);
//       setPatientData([]);
//       setIsNotFound(true);
//       setIsExistingPatient(false);
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!newPatient.name) errors.name = "Name is required";
//     if (!newPatient.phone || !/^\d{10}$/.test(newPatient.phone))
//       errors.phone = "Valid 10-digit phone number is required";
//     if (!newPatient.address) errors.address = "Address is required";
//     if (
//       newPatient.email &&
//       !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newPatient.email)
//     )
//       errors.email = "Valid email is required";
//     if (!newPatient.dob) errors.dob = "Date of Birth is required";

//     if (user.type === 2 && !newPatient.doctorId)
//       errors.doctorId = "Doctor selection is required";
//     return errors;
//   };

//   const handleAddPatient = async () => {
//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
//     const clinicId = userData?.user?.clinic_id?.toString();
//     if (!clinicId) {
//       alert("Clinic ID is missing. Please log in again.");
//       return;
//     }

//     // Assign the doctor ID properly based on user type
//     let doctorId = newPatient.doctorId;
//     if (user.type === 1) {
//       doctorId = user.id.toString(); // Automatically set logged-in doctor ID
//     }

//     const patientDataToSend = {
//       ...newPatient,
//       clinic_id: clinicId,
//       doctor_id: doctorId, // Ensure doctor_id is included
//     };

//     console.log("Sending Patient Data:", patientDataToSend);

//     try {
//       const response = await post("/api/patients", patientDataToSend);
//       alert("Patient added successfully!");

//       setPatientData([response.patient]);

//       setNewPatient({
//         name: "",
//         phone: "",
//         address: "",
//         email: "",
//         dob: "",
//         doctorId: "",
//       });

//       setIsNotFound(false);
//       setIsExistingPatient(false);
//       setErrors({});
//       navigate("/Dashboard2");
//     } catch (error) {
//       console.error("Error adding new patient:", error);
//       if (error.response?.data?.errors) {
//         setErrors(error.response.data.errors);
//       } else {
//         alert("Failed to add patient. Please try again.");
//       }
//     }
//   };

//   const handleGenerateToken = async (patientId, clinicId, selectedSlot) => {
//     if (!newPatient.doctorId) {
//       alert("Please select a doctor before generating the token.");
//       return;
//     }

//     try {
//       const response = await post("/api/TokanCreate", {
//         patient_id: patientId,
//         clinic_id: clinicId,
//         doctor_id: parseInt(newPatient.doctorId, 10),
//         date: new Date().toISOString().split("T")[0],
//         slot: selectedSlot,
//         status: "pending",
//       });

//       alert(`Token generated successfully! Token ID: ${response.tokan.tokan_number}`);
//       navigate("/Dashboard2");
//     } catch (error) {
//       console.error("Error generating token:", error);
//       alert("Failed to generate token. Please try again.");
//     }
//   };

//   return (
//     <CCard>
//       <CCardHeader>Patient Token Form</CCardHeader>
//       <CCardBody>
//         <CRow>
//           <CCol md="6">
//             <CInputGroup>
//               <CFormInput
//                 placeholder="Search by Phone Number"
//                 value={searchQuery}
//                 onChange={handleInputChange}
//               />
//               <CButton onClick={handleSearch}>Search</CButton>
//             </CInputGroup>
//           </CCol>
//         </CRow>

//         {/* Show doctor dropdown only if user type = 2 */}
//         {user.type === 2 && (
//           <CFormSelect
//             value={newPatient.doctorId}
//             onChange={(e) =>
//               setNewPatient({ ...newPatient, doctorId: e.target.value })
//             }
//           >
//             <option value="">Select Doctor</option>
//             {doctorList.map((doctor) => (
//               <option key={doctor.id} value={doctor.id}>
//                 {doctor.name}
//               </option>
//             ))}
//           </CFormSelect>
//         )}

//         <CButton onClick={handleAddPatient}>Add Patient</CButton>
//       </CCardBody>
//     </CCard>
//   );
// }

// export default PatientTokanForm;
