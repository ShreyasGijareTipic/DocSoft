import React, { useState } from 'react';
import { CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput, CRow } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import { post } from '../../../util/api';

const Register = () => {
  const [formData, setFormData] = useState({
    clinic_name: '',
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
      const response = await post('/api/register', formData);
      if (response.status === 201) {
        alert('Doctor registered successfully');
        navigate('/login');
      }
    } catch (error) {
      if (error.response?.data?.message === 'The mobile has already been taken.') {
        setErrors((prevErrors) => ({
          ...prevErrors,
          mobile: 'Mobile number is already registered. Please use a different number.',
        }));
      } else {
        console.error('Registration error:', error);
        alert('Error occurred during registration');
      }
    }
  };

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={9} lg={7} xl={8}>
          <CCard className="mx-4">
            <CCardBody className="p-4">
              <CForm onSubmit={handleSubmit}>
                <h1>Register</h1>
                <p>Create your account</p>

                <CFormInput
                  className="mb-3"
                  placeholder="Clinic Name"
                  name="clinic_name"
                  onChange={handleChange}
               
                />
                {errors.clinic_name && <div className="text-danger">{errors.clinic_name}</div>}

                <CFormInput
                  className="mb-3"
                  placeholder="Name"
                  name="name"
                  onChange={handleChange}
                 
                />
                {errors.name && <div className="text-danger">{errors.name}</div>}

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
                  className="mb-3"
                  placeholder="Mobile"
                  name="mobile"
                  onChange={handleChange}
                  
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

                <CFormInput
                  className="mb-3"
                  type="file"
                  name="logo"
                  onChange={handleImageUpload}
                  
                />

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
