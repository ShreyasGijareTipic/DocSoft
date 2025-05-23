// Patient.js
import React, { useEffect, useMemo, useState } from 'react';
import { MantineReactTable } from 'mantine-react-table';
import { Loader, Alert } from '@mantine/core';
import { getAPICall, put } from '../../../util/api';
import { CButton, CForm, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';

const BasicMantineTable = () => {
  const [data, setData] = useState([]); // State to hold patient data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(''); // State to hold error messages

  const [visible, setVisible] = useState(false);
const [editData, setEditData] = useState({
  id: '',
  name: '',
  address: '',
  phone: '',
  dob: '',
  email: '',
});
console.log("editData",editData);



  // Define the columns for the table
  const columns = useMemo(
    () => [
      // { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'address', header: 'Address' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'phone', header: 'Contact No.  ' },
      { accessorKey: 'dob', header: 'Date of Birth' },
       {
                   header: 'Action',
                   accessorKey: 'action',
                   Cell: ({ row }) => (
                     <>
                       
                         <CButton className='bg-warning' 
                         shape='rounded-pill'
                         // onClick={() => setVisible(!visible)} 
                         onClick={() => handleEdit(row.original)}
                        >
                          Update 
                         </CButton>
                    
                     </>
                   ),
                 },
    ],
    []
  );

// Patient Edit
const handleEdit = (patient) => {
  console.log(patient);
  
  setEditData({
    id: patient.id,
    name: patient.name || '',
    address: patient.address || '',
    phone: patient.phone || '',
    dob: patient.dob? patient.dob.split("T")[0] : '',
    email: patient.email|| '',
  });
  setVisible(true);
};

const handleUpdatePatient = async () => {
  try {
    const response = await put(`/api/patients/${editData.id}`, {
      name: editData.name,
      address: editData.address,
      phone: editData.phone,
      dob: editData.dob,
      email: editData.email,
    });

    console.log('Patient updated:', response.data);
    setVisible(false);
    fetchPatients();
    // Optionally refresh table or show success toast
  } catch (error) {
    console.error('Update failed:', error);
    // Optionally show error toast
  }
};





  // Fetch data when the component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token
      const doctorId = localStorage.getItem('doctorId'); // Get doctor ID from local storage

      console.log('Doctor ID:', doctorId); // Debug log to check if doctorId is fetched
      console.log('tokan:', token); // Debug log to check if doctorId is fetched

      if (!token || !doctorId) {
        setError('Token or Doctor ID not found. Please log in again.');
        setLoading(false); // Stop loading
        return; // Exit if token or doctor ID is not available
      }

      try {
        // const response = await getAPICall(`/api/bills/doctor`)
        // const response = await getAPICall(`/api/patientDisplyed`) loggedDrsPatient
        const response = await getAPICall(`/api/loggedDrsPatient`) 
        // Log the response for debugging
        console.log("Fetched Patients Data:", response);

        setData(response); // Set the fetched data

      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            setError('Unauthorized: Invalid token or session expired.');
          } else {
            setError(`Error fetching data: ${error.response.statusText}`);
          }
        } else if (error.request) {
          setError('No response received from the server.');
        } else {
          setError('Error fetching patient data: ' + error.message);
        }
        console.error("Error fetching patients:", error); // Log the error for debugging
      } finally {
        setLoading(false); // Stop loading in both success and error cases
      }
    };

    fetchPatients(); // Call the fetch function
  }, []); // Run once on mount

  return (
    <>
    <>
  {loading && <Loader />} {/* Loading Spinner */}
  {error && <Alert color="red">{error}</Alert>} {/* Error Message */}

  {!loading && !error && (
    <MantineReactTable
      columns={columns}
      data={data}
      initialState={{
        density: 'comfortable',
        pagination: { pageSize: 10 },
        showColumnFilters: true,
      }}
      enableFullScreenToggle={false}
      enableDensityToggle={true}
      enableColumnResizing
      enableColumnActions
      enableRowNumbers
      enableStickyHeader
      enableSorting
      enableGlobalFilter
      enableColumnFilters
      enableHiding
      enableRowSelection
      positionToolbarAlertBanner="bottom"
      muiTableBodyRowProps={{
        sx: {
          '&:hover': {
            backgroundColor: '#f9f9f9',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
          },
        },
      }}
      muiTableHeadCellProps={{
        sx: {
          backgroundColor: '#f1f5f9',
          fontWeight: '600',
          color: '#1f2937',
        },
      }}
      muiTablePaperProps={{
        sx: {
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        },
      }}
      muiTableContainerProps={{
        sx: {
          maxHeight: '600px',
        },
      }}
    />
  )}
</>



      {/* Patient Update Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
  <CModalHeader>
    <CModalTitle>Edit Patient</CModalTitle>
  </CModalHeader>
  <CModalBody>
    <CForm>
      <CFormInput
        label="Name"
        value={editData.name}
        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
        className="mb-3"
      />
      <CFormInput
        label="Address"
        value={editData.address}
        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
        className="mb-3"
      />
      <CFormInput
        label="Contact Number"
        value={editData.phone}
        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
        className="mb-3"
      />
      <CFormInput
        label="DOB"
        type="date"
        value={editData.dob}
        onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
        className="mb-3"
      />
      <CFormInput
        label="Email"
        value={editData.email}
        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
        className="mb-3"
      />
    </CForm>
  </CModalBody>
  <CModalFooter>
    <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
    <CButton color="primary" onClick={handleUpdatePatient}>Update</CButton>
  </CModalFooter>
</CModal>


    </>
  );
};

export default BasicMantineTable;
