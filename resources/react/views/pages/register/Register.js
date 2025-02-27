import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput, CFormSelect, CRow } from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAPICall, post } from '../../../util/api';

const Register = () => {

 const { storeid } = useParams();
 
 

  const [formData, setFormData] = useState({
    clinic_id:storeid, // Clinic ID should be part of the form data
    name: '',
    registration_number: '',
    speciality: '',
    education: '',
    mobile: '',
    address: '',
    email: '',
    password: '',
    password_confirmation: '',
    logo: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
console.log(errors);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 300 * 1024; // 300 KB

    if (file) {
      if (!validTypes.includes(file.type)) {
        alert('Only JPG and PNG images are allowed.');
        return;
      }

      if (file.size > maxSize) {
        alert('File size must be under 300 KB.');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          logo: reader.result,
        }));
      };
    }
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== 'logo') {
        newErrors[key] = `${key.replace('_', ' ')} is required.`;
      }
    });

    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile must be a 10-digit number.';
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const  response = await post('/api/register', formData); // Send clinic_id with the form data
      if (response && !response?.errors) {
        alert('Doctor registered successfully');
        navigate(`/register/EditwhatsappClinicRegister/${storeid}`);
      }
      else if ( response?.errors) {
        console.log(response?.errors);
        
        setErrors((prevErrors) => ({
          ...prevErrors, 
          mobile: response?.errors?.mobile ? 'Mobile number has already been taken.' : null,
          email: response?.errors?.email ? 'Email has already been taken.' : null,
        }));
        }
    }
        catch (error ) {
          console.log(response);
        console.error('Registration error:', error);
        alert('Error occurred during registration');
      }
    
  };

  const [clinics, setClinics] = useState([]);

  // useEffect(() => {
  //   // Fetch the list of clinics from the server
  //   getAPICall('/api/clinic')
  //     .then((response) => {
  //       setClinics(response);
  //     })
  //     .catch((error) => {
  //       console.error('There was an error fetching clinics!', error);
  //     });
  // }, []);

  return (


    <CContainer className="mt-2">

      {/* <h1>clinic Id:{ storeid }</h1> */}

      <CRow className="mt-2">
        <CCol md={12} lg={12} xl={12}>
          <CCard className="mx-4">
            <CCardBody className="p-4">
              <CForm onSubmit={handleSubmit}>
                <h3 className='text-center'>Register</h3><br/>
                {/* <p>Create your account</p> */}

                {/* Clinic dropdown */}
                {/* <div>
  
  <CFormSelect
    name="clinic_id" // Set name to clinic_id to bind the dropdown value to formData
    value={formData.clinic_id}
    onChange={handleChange} // Bind handleChange to update clinic_id
  >
    <option value="">Select Clinic</option>
    {clinics.map((clinic) => (
      <option key={clinic.id} value={clinic.id}>
        {clinic.clinic_name}
      </option>
    ))}
  </CFormSelect>
</div>
{errors.clinic_id && <div className="text-danger">{errors.clinic_id}</div>}<br/> */}

              
                <CFormInput
                  className="mb-3"
                  placeholder="Doctor Name"
                  name="name"
                  onChange={handleChange}
                  /> 
                  {errors.name && <div className="text-danger mt-0">{errors.name}</div>}
                  
                 
                <CFormInput
                  className="mb-3"
                  placeholder="Registration Number"
                  name="registration_number"
                  onChange={handleChange}
                />
                {errors.registration_number && (
                  <div className="text-danger">{errors.registration_number}</div>
                )} 

                <CFormInput
                  className="mb-3"
                  placeholder="Speciality"
                  name="speciality"
                  onChange={handleChange}
                />
                {errors.speciality && <div className="text-danger">{errors.speciality}</div>}

                <CFormInput
                  className="mb-3"
                  placeholder="Education"
                  name="education"
                  onChange={handleChange}
                />
                {errors.education && <div className="text-danger">{errors.education}</div>}

                <CFormInput
                  className="mb-3"
                  placeholder="Address"
                  name="address"
                  onChange={handleChange}
                />
                {errors.address && <div className="text-danger">{errors.address}</div>}

                <CFormInput
                type='number'
                  className="mb-3"
                  placeholder="Mobile"
                  name="mobile"
                  onChange={handleChange}
                  onInput={(e) => {
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.slice(0, 10); // Limit to 10 digits
                    }
                  }}
                />
                {errors.mobile && <div className="text-danger">{errors.mobile}</div>}

                <CFormInput
                  className="mb-3"
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={handleChange}
                />
                {errors.email && <div className="text-danger">{errors.email}</div>}

                <CFormInput
                  className="mb-3"
                  type="password"
                  placeholder="Password must be at least 8 characters long"
                  name="password"
                  onChange={handleChange}
                />
                {errors.password && <div className="text-danger">{errors.password}</div>}

                <CFormInput
                  className="mb-3"
                  type="password"
                  placeholder="Confirm Password"
                  name="password_confirmation"
                  onChange={handleChange}
                />
                {errors.password_confirmation && (
                  <div className="text-danger">{errors.password_confirmation}</div>
                )}

                {/* <CFormInput
                  className="mb-3"
                  type="file"
                  name="logo"
                  onChange={handleImageUpload}
                /> */}

                <CButton color="success" type="submit">
                  Create Account
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
