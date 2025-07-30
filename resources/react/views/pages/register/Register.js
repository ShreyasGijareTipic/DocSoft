import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput, CFormSelect, CRow, CFormCheck, CCardHeader, CSpinner } from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAPICall, post, postFormData } from '../../../util/api';

const Register = () => {
  const { storeid } = useParams();
  const navigate = useNavigate();
  // const logoInputRef = useRef(null);

  const [formData, setFormData] = useState({
    sign:'',
    clinic_id: storeid,
    name: '',
    registration_number: '',
    speciality: '',
    education: '',
    consulting_fee: '',
    mobile: '',
    address: '',
    email: '',
    password: '',
    password_confirmation: '',
    // logo: '',
    type: ''
  });

  // Medical observations state
  const [medicalObservations, setMedicalObservations] = useState({
    bp: false,
    pulse: false,
    weight: false,
    height: false,
    systemic_examination: false,
    diagnosis: false,
    past_history: false,
    complaint: false
  });

  const [ayurvedicObservations, setAyurvedicObservations] = useState({
 
  occupation: false,
  pincode: false,
  email: false,
  past_history: false,
  prasavvedan_parikshayein: false,
  habits: false,
  lab_investigation: false,
  personal_history: false,
  food_and_drug_allergy: false,
  lmp: false,
  edd: false,
});

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

// Updated handleImageUpload function
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  const validTypes = ['image/jpeg', 'image/png'];
  const maxSize = 300 * 1024; // 300 KB

  if (!file) {
    return;
  }

  if (!validTypes.includes(file.type)) {
    alert('Only JPG and PNG images are allowed.');
    e.target.value = ""; // Reset input
    setFormData({ ...formData, sign: '' }); // Reset to empty string
    return;
  }

  if (file.size > maxSize) {
    alert('File size must be under 300 KB.');
    e.target.value = ""; // Reset input
    setFormData({ ...formData, sign: '' }); // Reset to empty string
    return;
  }

  // Convert file to base64
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64String = e.target.result; // This includes the data:image/jpeg;base64, prefix
    
    // Store the complete base64 string (with prefix) or just the base64 part
    // If your backend expects just the base64 data without prefix:
    // const base64Data = base64String.split(',')[1];
    // setFormData({ ...formData, sign: base64Data });
    
    // If your backend expects the complete data URL:
    setFormData({ ...formData, sign: base64String });
  };

  reader.onerror = () => {
    alert('Error reading file');
    e.target.value = "";
    setFormData({ ...formData, sign: '' });
  };

  reader.readAsDataURL(file);

  // Clear error message if any
  setErrors((prev) => ({ ...prev, sign: '' }));
};

  

  // Clear autofill values on component mount
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      email: '',
      password: '',
    }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleObservationChange = (e) => {
    setMedicalObservations({ 
      ...medicalObservations, 
      [e.target.name]: e.target.checked 
    });
  };

  const handleAyurvedicObservationChange = (e) => {
  setAyurvedicObservations({
    ...ayurvedicObservations,
    [e.target.name]: e.target.checked,
  });
};

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== 'sign') {
        newErrors[key] = `${key.replace('_', ' ')} is required.`;
      }
    });

    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile must be a 10-digit number.';
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match.';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (formData.consulting_fee && !/^\d+(\.\d{1,2})?$/.test(formData.consulting_fee)) {
      newErrors.consulting_fee = 'Enter a valid number (up to 2 decimal places).';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       setIsLoading(true);
      
//       // Convert checkbox boolean values to 1/0 for backend
//       const medicalObsForSubmit = {};
//       Object.keys(medicalObservations).forEach(key => {
//         medicalObsForSubmit[key] = medicalObservations[key] ? 1 : 0;
//       });

//       const ayurvedicObsForSubmit = {};
// Object.keys(ayurvedicObservations).forEach(key => {
//   ayurvedicObsForSubmit[key] = ayurvedicObservations[key] ? 1 : 0;
// });

//       // Prepare data for submission with medical observations
//       const dataToSubmit = {
//         ...formData,
//         medical_observations: medicalObsForSubmit,
//          ayurvedic_observations: ayurvedicObsForSubmit,
//       };

//       const response = await post('/api/register', dataToSubmit);
      
//       if (response && response.user && !response?.errors) {
//         alert('Doctor registered successfully');
//         navigate(`/register/EditwhatsappClinicRegister/${storeid}`);
//       } else if (response?.errors) {
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           mobile: response?.errors?.mobile ? 'Mobile number has already been taken.' : null,
//           email: response?.errors?.email ? 'Email has already been taken.' : null,
//         }));
//       }
//     } catch (error) {
//       console.error('Registration error:', error);
//       alert('Error occurred during registration');
//     } finally {
//       setIsLoading(false);
//     }
//   };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  try {
    setIsLoading(true);

    const medicalObsForSubmit = {};
    Object.keys(medicalObservations).forEach(key => {
      medicalObsForSubmit[key] = medicalObservations[key] ? 1 : 0;
    });

    const ayurvedicObsForSubmit = {};
    Object.keys(ayurvedicObservations).forEach(key => {
      ayurvedicObsForSubmit[key] = ayurvedicObservations[key] ? 1 : 0;
    });

    // Since we're now storing base64 string, use regular POST
    const dataToSubmit = {
      ...formData,
      medical_observations: medicalObsForSubmit,
      ayurvedic_observations: ayurvedicObsForSubmit,
    };

    // Use regular post instead of postFormData
    const response = await post('/api/register', dataToSubmit);

    if (response && response.user && !response?.errors) {
      alert('Doctor registered successfully');
      navigate(`/register/EditwhatsappClinicRegister/${storeid}`);
    } else if (response?.errors) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: response?.errors?.mobile ? 'Mobile number has already been taken.' : null,
        email: response?.errors?.email ? 'Email has already been taken.' : null,
        sign: response?.errors?.sign ? response?.errors?.sign[0] : null,
      }));
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Error occurred during registration');
  } finally {
    setIsLoading(false);
  }
};



  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] =  useState(false);

  return (
    <CContainer className="mt-2">
      <CRow className="mt-2">
        <CCol md={12} lg={12} xl={12}>
          <CCard className="">
            <CCardBody className="">
              <CForm onSubmit={handleSubmit} autoComplete="off">
                <h3 className="text-center">Doctor Registration</h3>
                <br />

                <CFormInput
                  className="mb-3"
                  label={<strong>Doctor Name</strong>}
                  placeholder="Doctor Name"
                  name="name"
                  onChange={handleChange}
                />
                {errors.name && <div className="text-danger mt-0">{errors.name}</div>}

                <CFormInput
                  className="mb-3"
                  label={<strong>Registration Number</strong>}
                  placeholder="Registration Number"
                  name="registration_number"
                  onChange={handleChange}
                />
                {errors.registration_number && <div className="text-danger">{errors.registration_number}</div>}

                <CFormInput
                  className="mb-3"
                  label={<strong>Speciality</strong>}
                  placeholder="Speciality"
                  name="speciality"
                  onChange={handleChange}
                />
                {errors.speciality && <div className="text-danger">{errors.speciality}</div>}

                <CFormInput
                  className="mb-3"
                  label={<strong>Education</strong>}
                  placeholder="Education"
                  name="education"
                  onChange={handleChange}
                />
                {errors.education && <div className="text-danger">{errors.education}</div>}

                <CFormInput
                  className="mb-3"
                  label={<strong>Consulting Fee</strong>}
                  placeholder="Consulting Fee"
                  name="consulting_fee"
                  onChange={handleChange}
                />
                {errors.consulting_fee && <div className="text-danger">{errors.consulting_fee}</div>}

                <CFormInput
                  className="mb-3"
                  label={<strong>Address</strong>}
                  placeholder="Address"
                  name="address"
                  onChange={handleChange}
                />
                {errors.address && <div className="text-danger">{errors.address}</div>}

                <CFormInput
                  type="number"
                  className="mb-3"
                  label={<strong>Mobile</strong>}
                  placeholder="Mobile"
                  name="mobile"
                  onChange={handleChange}
                  onInput={(e) => {
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.slice(0, 10);
                    }
                  }}
                />
                {errors.mobile && <div className="text-danger">{errors.mobile}</div>}

                <CFormSelect
                  className="mb-3"
                  label={<strong>User Type</strong>}
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="1">Doctor</option>
                  <option value="2">Receptionist</option>
                </CFormSelect>
                {errors.type && <div className="text-danger">{errors.type}</div>}

                           {/* sign Upload */}
                               
                               {/* <CFormLabel htmlFor="sign"><strong>Upload Doctor Sign</strong></CFormLabel> */}
<CFormInput
  type="file"
  id="sign"
  name="sign"
   label={<strong>Upload Doctor Sign</strong>}
  accept=".png, .jpg, .jpeg"
  onChange={handleImageUpload}
  className="mb-2"
/>
{errors.sign && <div className="text-danger">{errors.sign}</div>}

{/* Optional: show uploaded file name */}
{formData.sign && typeof formData.sign === 'object' && (
  <div className="text-success mt-1">Selected: {formData.sign.name}</div>
)}


                <CFormInput
                  className="mb-3"
                  type="email"
                  label={<strong>Email</strong>}
                  placeholder="Email"
                  name="email_input"
                  autoComplete="new-email"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <div className="text-danger">{errors.email}</div>}

                {/* <CFormInput
                  className="mb-3"
                  
                  // type="password"
                   type={showPassword ? 'text' : 'password'}
                  label={<strong>Password</strong>}
                  placeholder="Password"
                  name="password_input"
                  autoComplete="new-password"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                 <span
                        onClick={() => setShowPassword((prev) => !prev)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          color: 'black',
                          fontSize: '18px'
                        }}
                      >
                        {showPassword ? '🔒' : '👁️'}
                      </span> */}
                      <div style={{ position: 'relative' }}>
  <CFormInput
    className="mb-3"
    type={showPassword ? 'text' : 'password'}
    label={<strong>Password</strong>}
    placeholder="Password"
    name="password_input"
    autoComplete="new-password"
    value={formData.password || ''}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
  />

  <span
    onClick={() => setShowPassword((prev) => !prev)}
    style={{
      position: 'absolute',
      right: '16px',
      top: '71%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      color: '#000',
      fontSize: '18px',
      zIndex: 10,
     
    }}
  >
    {showPassword ? '👁️' : '🔒'}
  </span>

  {errors.password && <div className="text-danger mt-1">{errors.password}</div>}
</div>

                {/* {errors.password && <div className="text-danger">{errors.password}</div>} */}
 <div style={{ position: 'relative' }}>
                <CFormInput
                  className="mb-3"
                  // type="password"
                   type={showPasswordConfirm ? 'text' : 'password'}
                  label={<strong>Confirm Password</strong>}
                  placeholder="Confirm Password"
                  name="password_confirmation"
                  onChange={handleChange}
                />
                <span
    onClick={() => setShowPasswordConfirm((prev) => !prev)}
    style={{
      position: 'absolute',
      right: '16px',
      top: '71%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      color: '#000',
      fontSize: '18px',
      zIndex: 10,
     
    }}
  >
    {showPasswordConfirm ? '👁️' : '🔒'}
  </span>
                {errors.password_confirmation && <div className="text-danger">{errors.password_confirmation}</div>}
</div>


                {/* Medical Observations Section */}
                <CCard className="mb-4">
                  <CCardHeader>
                    <strong>Medical Observations</strong>
                    <small> (Select fields to display in Medical Bills)</small>
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      <CCol md={3}>
                        <CFormCheck 
                          id="bp-check"
                          label="Blood Pressure"
                          name="bp"
                          checked={medicalObservations.bp}
                          onChange={handleObservationChange}
                        />
                      </CCol>
                      <CCol md={3}>
                        <CFormCheck 
                          id="pulse-check"
                          label="Pulse"
                          name="pulse"
                          checked={medicalObservations.pulse}
                          onChange={handleObservationChange}
                        />
                      </CCol>
                      <CCol md={3}>
                        <CFormCheck 
                          id="weight-check"
                          label="Weight"
                          name="weight"
                          checked={medicalObservations.weight}
                          onChange={handleObservationChange}
                        />
                      </CCol>
                      <CCol md={3}>
                        <CFormCheck 
                          id="height-check"
                          label="Height"
                          name="height"
                          checked={medicalObservations.height}
                          onChange={handleObservationChange}
                        />
                      </CCol>
                    </CRow>

                    <CRow className="mt-3">
                      <CCol md={3}>
                        <CFormCheck 
                          id="systemic-check"
                          label="Systemic Examination"
                          name="systemic_examination"
                          checked={medicalObservations.systemic_examination}
                          onChange={handleObservationChange}
                        />
                      </CCol>
                      <CCol md={3}>
                        <CFormCheck 
                          id="diagnosis-check"
                          label="Diagnosis"
                          name="diagnosis"
                          checked={medicalObservations.diagnosis}
                          onChange={handleObservationChange}
                        />
                      </CCol>
                      <CCol md={3}>
                        <CFormCheck 
                          id="history-check"
                          label="Past History"
                          name="past_history"
                          checked={medicalObservations.past_history}
                          onChange={handleObservationChange}
                        />
                      </CCol>
                      <CCol md={3}>
                        <CFormCheck 
                          id="complaint-check"
                          label="Complaint"
                          name="complaint"
                          checked={medicalObservations.complaint}
                          onChange={handleObservationChange}
                        />
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>

                <CCard className="mb-4">
  <CCardHeader>
    <strong>Ayurvedic Diagnosis</strong>
    <small> (Select fields to display)</small>
  </CCardHeader>
  <CCardBody>
    <CRow>
      
      <CCol md={3}>
        <CFormCheck
          id="occupation-check"
          label="Occupation"
          name="occupation"
          checked={ayurvedicObservations.occupation}
          onChange={handleAyurvedicObservationChange}
        />
      </CCol>
      <CCol md={3}>
        <CFormCheck
          id="pincode-check"
          label="Pincode"
          name="pincode"
          checked={ayurvedicObservations.pincode}
          onChange={handleAyurvedicObservationChange}
        />
      </CCol>
      <CCol md={3}>
        <CFormCheck
          id="email-check"
          label="Email"
          name="email"
          checked={ayurvedicObservations.email}
          onChange={handleAyurvedicObservationChange}
        />
      </CCol>
    </CRow>

    <CRow className="mt-3">
      <CCol md={3}>
        <CFormCheck
          id="past_history-check"
          label="Past History"
          name="past_history"
          checked={ayurvedicObservations.past_history}
          onChange={handleAyurvedicObservationChange}
        />
      </CCol>
      <CCol md={3}>
        <CFormCheck
          id="prasavvedan_parikshayein-check"
          label="Prasavvedan Parikshayein"
          name="prasavvedan_parikshayein"
          checked={ayurvedicObservations.prasavvedan_parikshayein}
          onChange={handleAyurvedicObservationChange}
        />
      </CCol>
      <CCol md={3}>
        <CFormCheck
          id="habits-check"
          label="Habits"
          name="habits"
          checked={ayurvedicObservations.habits}
          onChange={handleAyurvedicObservationChange}
        />
      </CCol>
      <CCol md={3}>
        <CFormCheck
          id="lab_investigation-check"
          label="Lab Investigation"
          name="lab_investigation"
          checked={ayurvedicObservations.lab_investigation}
          onChange={handleAyurvedicObservationChange}
        />
      </CCol>
    </CRow>

    <CRow className="mt-3">
      <CCol md={3}>
        <CFormCheck
          id="personal_history-check"
          label="Personal History"
          name="personal_history"
          checked={ayurvedicObservations.personal_history}
          onChange={handleAyurvedicObservationChange}
        />
      </CCol>
      <CCol md={3}>
        <CFormCheck
          id="food_and_drug_allergy-check"
          label="Food and Drug Allergy"
          name="food_and_drug_allergy"
          checked={ayurvedicObservations.food_and_drug_allergy}
          onChange={handleAyurvedicObservationChange}
        />
      </CCol>
      <CCol md={3}>
        <CFormCheck
          id="lmp-check"
          label="LMP"
          name="lmp"
          checked={ayurvedicObservations.lmp}
          onChange={handleAyurvedicObservationChange}
        />
      </CCol>
      <CCol md={3}>
        <CFormCheck
          id="edd-check"
          label="EDD"
          name="edd"
          checked={ayurvedicObservations.edd}
          onChange={handleAyurvedicObservationChange}
        />
      </CCol>
    </CRow>
  </CCardBody>
</CCard>




                <CButton color="success" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <CSpinner size="sm" className="me-2" /> Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Register;