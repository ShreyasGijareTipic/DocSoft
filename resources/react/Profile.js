import React from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from "@coreui/react";

const Profile = () => {
  // Sample data for patients waiting for appointments
  const patientsWaiting = [
    { id: 1, name: "XYZ", age: 30, contact: "1234567898" },
    { id: 2, name: "ABC", age: 25, contact: "1234567898" },
    { id: 3, name: "PQR", age: 40, contact: "1234567898" },
  ];

  // Function to handle patient name click
  const handlePatientClick = (patient) => {
    alert(`Action for ${patient.name}`); // Here, you can replace this with your action
    // For example, navigate to a detailed view or open a modal
  };

  return (
    <>
      <CCard>
        <CCardHeader>
          <h4>Patients Waiting for Appointment</h4>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Patient Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Age</CTableHeaderCell>
                <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {patientsWaiting.map((patient, index) => (
                <CTableRow key={patient.id}>
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell>
                    <CButton color="link" onClick={() => handlePatientClick(patient)}>
                      {patient.name}
                    </CButton>
                  </CTableDataCell>
                  <CTableDataCell>{patient.age}</CTableDataCell>
                  <CTableDataCell>{patient.contact}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" onClick={() => handlePatientClick(patient)}>
                      Take Action
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  );
};

export default Profile;
