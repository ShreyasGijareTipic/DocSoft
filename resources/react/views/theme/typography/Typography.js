import React, { useState } from 'react';
import { CCard, CCardHeader, CCardBody, CRow, CCol, CFormInput, CButton } from '@coreui/react';
import { DocsLink } from 'resources/react/components';

const Typography = () => {
  // State variables for doctor details
  const [doctorName, setDoctorName] = useState('');
  const [doctorSpecialty, setDoctorSpecialty] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorContact, setDoctorContact] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const doctorDetails = {
      name: doctorName,
      specialty: doctorSpecialty,
      email: doctorEmail,
      contact: doctorContact,
    };
    console.log("Doctor Details Submitted:", doctorDetails);
    // Reset the form fields
    setDoctorName('');
    setDoctorSpecialty('');
    setDoctorEmail('');
    setDoctorContact('');
  };

  return (
    <>
      {/* Other content goes here... */}
      
      {/* Add Doctor Form */}
      <CCard className="mb-4">
        <CCardHeader>
          Add New Doctor
        </CCardHeader>
        <CCardBody>
          <CRow>
            <form onSubmit={handleSubmit} className="mb-4">
              <CCol xs={12} className="mb-3">
                <CFormInput
                  type="text"
                  placeholder="Doctor Name"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  required
                />
              </CCol>
              <CCol xs={12} className="mb-3">
                <CFormInput
                  type="text"
                  placeholder="Specialty"
                  value={doctorSpecialty}
                  onChange={(e) => setDoctorSpecialty(e.target.value)}
                  required
                />
              </CCol>
              <CCol xs={12} className="mb-3">
                <CFormInput
                  type="text"
                  placeholder="Education"
                  value={doctorEmail}
                  onChange={(e) => setDoctorEmail(e.target.value)}
                  required
                />
              </CCol>
              <CCol xs={12} className="mb-3">
                <CFormInput
                  type="email"
                  placeholder="Email"
                  value={doctorContact}
                  onChange={(e) => setDoctorContact(e.target.value)}
                  required
                />
              </CCol>
              <CCol xs={12} className="mb-3">
                <CFormInput
                  type="tel"
                  placeholder="Contact Number"
                  value={doctorContact}
                  onChange={(e) => setDoctorContact(e.target.value)}
                  required
                />
              </CCol>
              <CCol xs={12}>
                <CButton type="submit" color="primary">Add Doctor</CButton>
              </CCol>
            </form>
          </CRow>
        </CCardBody>
      </CCard>
      
      {/* Other content goes here... */}
    </>
  );
};

export default Typography;
