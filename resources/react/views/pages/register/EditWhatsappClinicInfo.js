import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getAPICall, put } from '../../../util/api';
import { CCard, CCardBody, CCol, CContainer, CForm, CFormInput, CFormLabel, CRow, CButton, CFormTextarea } from '@coreui/react';

function EditWhatsappClinicInfo() {
  const { storeid } = useParams(); // Get clinic ID from URL
  const [error, setError] = useState(''); // State to handle errors
  const [clinicData, setClinicData] = useState(null);

  const [formData, setFormData] = useState(null);

  // Validation Errors State
  const [errors, setErrors] = useState({});


  function getUpdatedFields() {
    // Initialize an empty object to store updated fields
    const updatedFields = {};
  
    // Iterate through keys in formData
    for (const key in formData) {
      // Check if the value in formData is different from clinicData
      if (formData[key] !== clinicData[key]) {
        updatedFields[key] = formData[key]; // Add to updatedFields
      }
    }
    // Return the updated fields
    return updatedFields;
  }
  // Fetch Clinic Data
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await getAPICall(`/api/clinic/${storeid}`);
        console.log('Fetched Clinic Data:', response);
        setClinicData(response);
        setFormData(response);
      
      } catch (error) {
        console.error('Error fetching clinic data:', error);
        if (error.response) {
          setError(`Error: ${error.response.statusText}`);
        } else if (error.request) {
          setError('No response from server.');
        } else {
          setError('Error: ' + error.message);
        }
      }
    };

    fetchClinics();
  }, [storeid]); // Re-run when storeid changes

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // setFormData({ ...formData, [name]: value });
    setFormData({ ...formData,[name]: value });
  };
console.log(formData);

  // Handle File Upload
  const handleImageUpload = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  // Validate Form Fields
  const validateForm = () => {
    let tempErrors = {};
    if (!formData.clinic_name) tempErrors.clinic_name = 'Clinic Name is required';
    if (!formData.clinic_registration_no) tempErrors.clinic_registration_no = 'Registration No is required';
    if (!formData.clinic_mobile) tempErrors.clinic_mobile = 'Mobile number is required';
    if (!formData.clinic_address) tempErrors.clinic_address = 'Address is required';
    if (!formData.whatsapp_number) tempErrors.whatsapp_number = 'WhatsApp number is required';
    if (!formData.whatsapp_api_url) tempErrors.whatsapp_api_url = 'API URL is required';
    if (!formData.access_token) tempErrors.access_token = 'Access Token is required';
    if (!formData.webhook_token) tempErrors.webhook_token = 'Webhook Token is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Valid if no errors
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form Data:', formData);

      // Send updated data to API here
      // Example: await putAPICall(`/api/clinic/${storeid}`, formData);
      
    }
  };


  function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
  
 const navigate = useNavigate();
 
  

 async function handleUpdate(e) {
  e.preventDefault();

  const otp = generateOTP();
  console.log('Generated OTP:', otp);
  alert(`Your OTP is: ${otp}`);

  const userOtp = prompt('Enter the OTP to confirm changes:');

  if (userOtp === otp) {
      alert('OTP verified successfully! Changes saved.');

      const payload = getUpdatedFields();
      console.log("Payload:", payload);

      try {
          const response = await put(`/api/clinic/${storeid}`, payload);
          console.log("Updated:", response);
          navigate(`/register/EditwhatsappClinicRegister/${storeid}`);
      } catch (error) {
          console.error('Error updating clinic:', error);
          alert('Failed to update clinic information.');
      }
  } else {
      alert('OTP verification failed. Changes not saved.');
  }
}

  return (
    // <CContainer>
      <CRow className=" mt-2 mb-3">
        <CCol md={12} lg={12} xl={12}>
          <CCard className="mx-4">
            <CCardBody className="p-4">
              <CForm onSubmit={handleUpdate}>
                <h3 className='text-center'>Edit Clinic Information</h3><br/>
                {error && <div className="text-danger mb-3">{error}</div>}
                {/* <p>Update your clinic details below.</p> */}

                {/* Clinic Name */}
                <CFormLabel htmlFor="clinic_name">Clinic Name</CFormLabel>
                <CFormInput
                  id="clinic_name"
                  name="clinic_name"
                  value={formData?.clinic_name}
                  onChange={handleChange}
                  className="mb-3"
                  disabled
                />
                {errors.clinic_name && <div className="text-danger">{errors.clinic_name}</div>}

                {/* Clinic Registration No */}
                <CFormLabel htmlFor="clinic_registration_no">Clinic Registration No</CFormLabel>
                <CFormInput
                  id="clinic_registration_no"
                  name="clinic_registration_no"
                  value={formData?.clinic_registration_no}
                  onChange={handleChange}
                  className="mb-3"
                  disabled
                />
                {errors.clinic_registration_no && <div className="text-danger">{errors.clinic_registration_no}</div>}

                {/* Clinic Mobile */}
                <CFormLabel htmlFor="clinic_mobile">Clinic Mobile</CFormLabel>
                <CFormInput
                  id="clinic_mobile"
                  name="clinic_mobile"
                  value={formData?.clinic_mobile}
                  onChange={handleChange}
                  className="mb-3"
                  onInput={(e) => {
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.slice(0, 10); // Limit to 10 digits
                    }
                  }}
                />
                {errors.clinic_mobile && <div className="text-danger">{errors.clinic_mobile}</div>}

                {/* Clinic Address */}
                <CFormLabel htmlFor="clinic_address">Clinic Address</CFormLabel>
                <CFormInput
                  id="clinic_address"
                  name="clinic_address"
                  value={formData?.clinic_address}
                  onChange={handleChange}
                  className="mb-3"
                />
                {errors.clinic_address && <div className="text-danger">{errors.clinic_address}</div>}

                {/* WhatsApp Fields */}
                <CFormLabel htmlFor="whatsapp_number">WhatsApp Number</CFormLabel>
                <CFormInput
                  id="clinic_whatsapp_mobile"
                  type='number'
                  name="clinic_whatsapp_mobile"
                  value={formData?.clinic_whatsapp_mobile}
                  onChange={handleChange}
                  className="mb-3"
                />

                <CFormLabel htmlFor="whatsapp_api_url">WhatsApp API URL</CFormLabel>
                <CFormInput
                  id="clinic_whatsapp_url"
                  name="clinic_whatsapp_url"
                  value={formData?.clinic_whatsapp_url}
                  onChange={handleChange}
                  className="mb-3"
                />

                <CFormLabel htmlFor="access_token">Permanent Access Token</CFormLabel>
                <CFormTextarea
                  id="clinic_permanant_tokan"
                  name="clinic_permanant_tokan"
                  value={formData?.clinic_permanant_tokan}
                  onChange={handleChange}
                  className="mb-3"
                />

                <CFormLabel htmlFor="webhook_token">Webhook Token</CFormLabel>
                <CFormInput
                  id="clinic_webhook_tokan"
                  name="clinic_webhook_tokan"
                  value={formData?.clinic_webhook_tokan}
                  onChange={handleChange}
                  className="mb-3"
                />

                <CButton color="primary" type="submit" >
                  Update Clinic Info
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    // </CContainer>
  );
}

export default EditWhatsappClinicInfo;
