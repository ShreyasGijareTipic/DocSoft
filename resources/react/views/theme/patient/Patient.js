// Patient.js
import React, { useEffect, useMemo, useState } from 'react';
import { MantineReactTable } from 'mantine-react-table';
import { Loader, Alert } from '@mantine/core';
import { getAPICall, put } from '../../../util/api';
import { CButton,CBadge, CForm, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';

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
                       
                         <CBadge className='bg-warning' 
                         shape='rounded-pill'
                          style={{ cursor: 'pointer' }} 
                         // onClick={() => setVisible(!visible)} 
                         onClick={() => handleEdit(row.original)}
                        >
                          Update 
                         </CBadge>
                    
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

// const handleUpdatePatient = async () => {
//   try {
//     const response = await put(`/api/patients/${editData.id}`, {
//       name: editData.name,
//       address: editData.address,
//       phone: editData.phone,
//       dob: editData.dob,
//       email: editData.email,
//     });

//     console.log('Patient updated:', response.data);
//     setVisible(false);
//     fetchPatients();
//     // Optionally refresh table or show success toast
//   } catch (error) {
//     console.error('Update failed:', error);
//     // Optionally show error toast
//   }
// };





  // Fetch data when the component mounts
  // useEffect(() => {
  //   const fetchPatients = async () => {
  //     const token = localStorage.getItem('token'); // Retrieve the token
  //     const doctorId = localStorage.getItem('doctorId'); // Get doctor ID from local storage

  //     console.log('Doctor ID:', doctorId); // Debug log to check if doctorId is fetched
  //     console.log('tokan:', token); // Debug log to check if doctorId is fetched

  //     if (!token || !doctorId) {
  //       setError('Token or Doctor ID not found. Please log in again.');
  //       setLoading(false); // Stop loading
  //       return; // Exit if token or doctor ID is not available
  //     }

  //     try {
  //       // const response = await getAPICall(`/api/bills/doctor`)
  //       // const response = await getAPICall(`/api/patientDisplyed`) loggedDrsPatient
  //       const response = await getAPICall(`/api/loggedDrsPatient`) 
  //       // Log the response for debugging
  //       console.log("Fetched Patients Data:", response);

  //       setData(response); // Set the fetched data

  //     } catch (error) {
  //       if (error.response) {
  //         if (error.response.status === 401) {
  //           setError('Unauthorized: Invalid token or session expired.');
  //         } else {
  //           setError(`Error fetching data: ${error.response.statusText}`);
  //         }
  //       } else if (error.request) {
  //         setError('No response received from the server.');
  //       } else {
  //         setError('Error fetching patient data: ' + error.message);
  //       }
  //       console.error("Error fetching patients:", error); // Log the error for debugging
  //     } finally {
  //       setLoading(false); // Stop loading in both success and error cases
  //     }
  //   };

  //   fetchPatients(); // Call the fetch function
  // }, []); // Run once on mount

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

    // Update local state without refetching everything
    setData(prevData =>
      prevData.map((item) =>
        item.id === editData.id ? { ...item, ...editData } : item
      )
    );

    setVisible(false); // Close modal

  } catch (error) {
    console.error('Update failed:', error);
  }
};



  const fetchPatients = async () => {
  const token = localStorage.getItem('token');
  const doctorId = localStorage.getItem('doctorId');

  if (!token || !doctorId) {
    setError('Token or Doctor ID not found. Please log in again.');
    setLoading(false);
    return;
  }

  try {
    const response = await getAPICall(`/api/loggedDrsPatient`);
    setData(response);
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
    console.error("Error fetching patients:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchPatients(); // Reused here
}, []);


const [phoneError, setPhoneError] = useState('');


  return (
    <>
  <>
  {loading && <Loader />} {/* Loading Spinner */}
  {error && <Alert color="red">{error}</Alert>} {/* Error Message */}

  {!loading && !error && (
    <MantineReactTable
      columns={[
        {
          header: 'Sr No',
          accessorFn: (_, index) => index + 1,
          size: 60,
          enableSorting: false,
          enableColumnFilter: false,
        },
        ...columns, // your existing columns
      ]}
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
      enableStickyHeader
      enableSorting
      enableGlobalFilter
      enableColumnFilters
      enableHiding
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
      enableRowNumbers={false} // Disable default row number
      enableRowSelection={false} // ✅ REMOVE checkboxes
    />
  )}
</>




      {/* Patient Update Modal */}
      {/* <CModal visible={visible} onClose={() => setVisible(false)}>
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
</CModal> */}


<CModal visible={visible} onClose={() => setVisible(false)}  backdrop="static"
  keyboard={false}>
  <CModalHeader>
    <CModalTitle>Edit Patient</CModalTitle>
  </CModalHeader>
  <CModalBody>
    <CForm>
      {/* Name (Only letters and spaces) */}
      <CFormInput
        label="Name"
        value={editData.name}
        onChange={(e) => {
          const name = e.target.value;
          if (/^[A-Za-z\s]*$/.test(name)) {
            setEditData({ ...editData, name });
          }
        }}
        className="mb-3"
        placeholder="Enter Name"
      />

      {/* Address */}
      <CFormInput
        label="Address"
        value={editData.address}
        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
        className="mb-3"
      />

      {/* Contact Number (Only numeric, exactly 10 digits) */}
      {/* <CFormInput
        label="Contact Number"
        value={editData.phone}
        onChange={(e) => {
          const input = e.target.value;
          if (/^\d{0,10}$/.test(input)) {
            setEditData({ ...editData, phone: input });
          }
        }}
        className="mb-3"
        placeholder="10-digit mobile number"
      /> */}
      <CFormInput
  label="Contact Number"
  value={editData.phone}
  onChange={(e) => {
    const input = e.target.value;
    if (/^\d{0,10}$/.test(input)) {
      setEditData({ ...editData, phone: input });

      // Clear error if 10 digits
      if (input.length === 10) {
        setPhoneError('');
      }
    }
  }}
  onBlur={() => {
    if (editData.phone.length !== 10) {
      setPhoneError('Mobile number must be exactly 10 digits');
    } else {
      setPhoneError('');
    }
  }}
  className="mb-1"
  placeholder="10-digit mobile number"
/>
{phoneError && (
  <div style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem' }}>
    {phoneError}
  </div>
)}

      {/* DOB */}
      <CFormInput
        label="DOB"
        type="date"
        value={editData.dob}
        onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
        className="mb-3"
      />

      {/* Email */}
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
    <CButton
      color="primary"
      onClick={handleUpdatePatient}
      disabled={
        editData.name.trim() === '' ||
        editData.phone.length !== 10
      }
    >
      Update
    </CButton>
  </CModalFooter>
</CModal>







    </>
  );
};

export default BasicMantineTable;
