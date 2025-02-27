import React, { useState } from 'react'
import { CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react'
import { post } from '../../../util/api'

function ClinicRegister() {
  const [formData, setFormData] = useState({
    clinic_name: '',
    logo: '',
    clinic_registration_no: '',
    clinic_mobile: '',
    clinic_address: '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

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
    const newErrors = {}
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== 'logo') {
        newErrors[key] = `${key.replace('_', ' ')} is required.`
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }



  const handleSubmit = async(e) => {
    e.preventDefault()
    if (!validateForm()) return
    
try{

  const response = await post('/api/clinic',formData);
  console.log("jdkjskjdhskj",response);
  alert("Clinic Registered Successfully..!");
  setFormData({
  clinic_name: '',
  logo: '',
  clinic_registration_no: '',
  clinic_mobile: '',
  clinic_address: '',
})

}
catch{
    alert("not clinic registered")
}
 
  }

  return (
    <CContainer>
      <CRow className=" mt-2">
        <CCol md={12} lg={12} xl={12}>
          <CCard className="mx-4">
            <CCardBody className="p-4">
              <CForm onSubmit={handleSubmit}>
                <h3 className='text-center'>Clinic Registration</h3><br/>
                {/* <p>Create your clinic profile</p> */}

                {/* Clinic Name */}
                <CFormLabel htmlFor="clinic_name">Clinic Name</CFormLabel>
                <CFormInput
                  id="clinic_name"
                  name="clinic_name"
                  placeholder="Enter Clinic Name"
                  value={formData.clinic_name}
                  onChange={handleChange}
                  className="mb-3"
                />
                {errors.clinic_name && <div className="text-danger">{errors.clinic_name}</div>}

                {/* Clinic Registration No */}
                <CFormLabel htmlFor="clinic_registration_no">Clinic Registration No</CFormLabel>
                <CFormInput
                  id="clinic_registration_no"
                  name="clinic_registration_no"
                  placeholder="Enter Registration Number"
                  value={formData.clinic_registration_no}
                  onChange={handleChange}
                  className="mb-3"
                />
                {errors.clinic_registration_no && <div className="text-danger">{errors.clinic_registration_no}</div>}

                {/* Clinic Mobile */}
                <CFormLabel htmlFor="clinic_mobile">Clinic Mobile</CFormLabel>
                <CFormInput
                type='number'
                  id="clinic_mobile"
                  name="clinic_mobile"
                  placeholder="Enter Clinic Mobile"
                  value={formData.clinic_mobile}
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
                  placeholder="Enter Clinic Address"
                  value={formData.clinic_address}
                  onChange={handleChange}
                  className="mb-3"
                />
                {errors.clinic_address && <div className="text-danger">{errors.clinic_address}</div>}

                {/* Logo Upload */}
                <CFormLabel htmlFor="logo">Upload Clinic Logo</CFormLabel>
                <CFormInput
                  type="file"
                  id="logo"
                  name="logo"
                  onChange={handleImageUpload}
                  className="mb-3"
                />
                {errors.logo && <div className="text-danger">{errors.logo}</div>}

                {/* Submit Button */}
                <CButton color="primary" type="submit">
                  Register Clinic
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ClinicRegister
