import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput, CFormSelect, CRow } from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAPICall, post } from '../../../util/api';

const Register = () => {
  const { storeid } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
    logo: '',
    type:''
  });

  const [errors, setErrors] = useState({});

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

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (formData.consulting_fee && !/^\d+(\.\d{1,2})?$/.test(formData.consulting_fee)) {
      newErrors.consulting_fee = 'Enter a valid number (up to 2 decimal places).';
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
      if (response && !response?.errors) {
        alert('Doctor registered successfully');
        navigate(`/register/EditwhatsappClinicRegister/${storeid}`);
      } else if (response?.errors) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          mobile: response?.errors?.mobile ? 'Mobile number has already been taken.' : null,
          email: response?.errors?.email ? 'Email has already been taken.' : null,
        }));
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error occurred during registration');
    }
  };

  return (
    <CContainer className="mt-2">
      <CRow className="mt-2">
        <CCol md={12} lg={12} xl={12}>
          <CCard className="mx-4">
            <CCardBody className="p-4">
              <CForm onSubmit={handleSubmit} autoComplete="off">
                <h3 className="text-center">Register</h3>
                <br />

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
                {errors.registration_number && <div className="text-danger">{errors.registration_number}</div>}

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
                  placeholder="Consulting Fee"
                  name="consulting_fee"
                  onChange={handleChange}
                />
                {errors.consulting_fee && <div className="text-danger">{errors.consulting_fee}</div>}


                <CFormInput
                  className="mb-3"
                  placeholder="Address"
                  name="address"
                  onChange={handleChange}
                />
                {errors.address && <div className="text-danger">{errors.address}</div>}

                <CFormInput
                  type="number"
                  className="mb-3"
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
  name="type"
  value={formData.type}
  onChange={handleChange}
>
<option value="1">Select</option>
  <option value="1">Doctor</option>
  <option value="2">Receptionist</option>
</CFormSelect>
{errors.type && <div className="text-danger">{errors.type}</div>}




                <CFormInput
                  className="mb-3"
                  type="email"
                  placeholder="Email"
                  name="email_input"
                  autoComplete="new-email"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <div className="text-danger">{errors.email}</div>}

                <CFormInput
                  className="mb-3"
                  type="password"
                  placeholder="Password"
                  name="password_input"
                  autoComplete="new-password"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                {errors.password && <div className="text-danger">{errors.password}</div>}

                <CFormInput
                  className="mb-3"
                  type="password"
                  placeholder="Confirm Password"
                  name="password_confirmation"
                  onChange={handleChange}
                />
                {errors.password_confirmation && <div className="text-danger">{errors.password_confirmation}</div>}

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
