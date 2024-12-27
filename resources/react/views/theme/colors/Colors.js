import React, { useState } from 'react';
import { CForm, CFormInput, CFormLabel, CButton } from '@coreui/react';
// import axios from 'axios';

const PatientForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    gender: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post data to Laravel API
      // const response = await axios.post('http://127.0.0.1:8000/api/patients', formData);
      console.log('Patient added:', response.data);
      alert('Patient added successfully!');
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <CForm onSubmit={handleSubmit}>
      <div>
        <CFormLabel htmlFor="name">Name</CFormLabel>
        <CFormInput 
          type="text" 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div>
        <CFormLabel htmlFor="email">Email</CFormLabel>
        <CFormInput 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div>
        <CFormLabel htmlFor="phone">Phone</CFormLabel>
        <CFormInput 
          type="text" 
          id="phone" 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div>
        <CFormLabel htmlFor="address">Address</CFormLabel>
        <CFormInput 
          type="text" 
          id="address" 
          name="address" 
          value={formData.address} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div>
        <CFormLabel htmlFor="dob">Date of Birth</CFormLabel>
        <CFormInput 
          type="date" 
          id="dob" 
          name="dob" 
          value={formData.dob} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div>
        <CFormLabel htmlFor="gender">Gender</CFormLabel>
        <CFormInput 
          type="text" 
          id="gender" 
          name="gender" 
          value={formData.gender} 
          onChange={handleChange} 
          required 
        />
      </div>

      <CButton type="submit" color="primary">Submit</CButton>
    </CForm>
  );
};

export default PatientForm;
