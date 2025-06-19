// // Patient.js
// import React, { useEffect, useMemo, useState } from 'react';
// import { MantineReactTable } from 'mantine-react-table';
// import { Loader, Alert } from '@mantine/core';
// import { getAPICall, put } from '../../../util/api';
// import { CButton,CBadge, CForm, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';

// const BasicMantineTable = () => {
//   const [data, setData] = useState([]); // State to hold patient data
//   const [loading, setLoading] = useState(true); // State to handle loading state
//   const [error, setError] = useState(''); // State to hold error messages

//   const [visible, setVisible] = useState(false);
// const [editData, setEditData] = useState({
//   id: '',
//   name: '',
//   address: '',
//   phone: '',
//   dob: '',
//   email: '',
// });
// console.log("editData",editData);



//   // Define the columns for the table
//   const columns = useMemo(
//     () => [
//       // { accessorKey: 'id', header: 'ID' },
  
//       { accessorKey: 'name', header: 'Name' },
//       { accessorKey: 'address', header: 'Address' },
//       { accessorKey: 'email', header: 'Email' },
//       { accessorKey: 'phone', header: 'Contact No.  ' },
//       { accessorKey: 'dob', header: 'Date of Birth' },
//        {
//                    header: 'Action',
//                    accessorKey: 'action',
//                    Cell: ({ row }) => (
//                      <>
                       
//                          <CBadge className='bg-warning' 
//                          shape='rounded-pill'
//                           style={{ cursor: 'pointer' }} 
//                          // onClick={() => setVisible(!visible)} 
//                          onClick={() => handleEdit(row.original)}
//                         >
//                           Update 
//                          </CBadge>
                    
//                      </>
//                    ),
//                  },
//     ],
//     []
//   );

// // Patient Edit
// const handleEdit = (patient) => {
//   console.log(patient);
  
//   setEditData({
//     id: patient.id,
//     name: patient.name || '',
//     address: patient.address || '',
//     phone: patient.phone || '',
//     dob: patient.dob? patient.dob.split("T")[0] : '',
//     email: patient.email|| '',
//   });
//   setVisible(true);
// };

// // const handleUpdatePatient = async () => {
// //   try {
// //     const response = await put(`/api/patients/${editData.id}`, {
// //       name: editData.name,
// //       address: editData.address,
// //       phone: editData.phone,
// //       dob: editData.dob,
// //       email: editData.email,
// //     });

// //     console.log('Patient updated:', response.data);
// //     setVisible(false);
// //     fetchPatients();
// //     // Optionally refresh table or show success toast
// //   } catch (error) {
// //     console.error('Update failed:', error);
// //     // Optionally show error toast
// //   }
// // };





//   // Fetch data when the component mounts
//   // useEffect(() => {
//   //   const fetchPatients = async () => {
//   //     const token = localStorage.getItem('token'); // Retrieve the token
//   //     const doctorId = localStorage.getItem('doctorId'); // Get doctor ID from local storage

//   //     console.log('Doctor ID:', doctorId); // Debug log to check if doctorId is fetched
//   //     console.log('tokan:', token); // Debug log to check if doctorId is fetched

//   //     if (!token || !doctorId) {
//   //       setError('Token or Doctor ID not found. Please log in again.');
//   //       setLoading(false); // Stop loading
//   //       return; // Exit if token or doctor ID is not available
//   //     }

//   //     try {
//   //       // const response = await getAPICall(`/api/bills/doctor`)
//   //       // const response = await getAPICall(`/api/patientDisplyed`) loggedDrsPatient
//   //       const response = await getAPICall(`/api/loggedDrsPatient`) 
//   //       // Log the response for debugging
//   //       console.log("Fetched Patients Data:", response);

//   //       setData(response); // Set the fetched data

//   //     } catch (error) {
//   //       if (error.response) {
//   //         if (error.response.status === 401) {
//   //           setError('Unauthorized: Invalid token or session expired.');
//   //         } else {
//   //           setError(`Error fetching data: ${error.response.statusText}`);
//   //         }
//   //       } else if (error.request) {
//   //         setError('No response received from the server.');
//   //       } else {
//   //         setError('Error fetching patient data: ' + error.message);
//   //       }
//   //       console.error("Error fetching patients:", error); // Log the error for debugging
//   //     } finally {
//   //       setLoading(false); // Stop loading in both success and error cases
//   //     }
//   //   };

//   //   fetchPatients(); // Call the fetch function
//   // }, []); // Run once on mount

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

//     // Update local state without refetching everything
//     setData(prevData =>
//       prevData.map((item) =>
//         item.id === editData.id ? { ...item, ...editData } : item
//       )
//     );

//     setVisible(false); // Close modal

//   } catch (error) {
//     console.error('Update failed:', error);
//   }
// };



//   const fetchPatients = async () => {
//   const token = localStorage.getItem('token');
//   const doctorId = localStorage.getItem('doctorId');

//   if (!token || !doctorId) {
//     setError('Token or Doctor ID not found. Please log in again.');
//     setLoading(false);
//     return;
//   }

//   try {
//     const response = await getAPICall(`/api/loggedDrsPatient`);
//     setData(response);
//   } catch (error) {
//     if (error.response) {
//       if (error.response.status === 401) {
//         setError('Unauthorized: Invalid token or session expired.');
//       } else {
//         setError(`Error fetching data: ${error.response.statusText}`);
//       }
//     } else if (error.request) {
//       setError('No response received from the server.');
//     } else {
//       setError('Error fetching patient data: ' + error.message);
//     }
//     console.error("Error fetching patients:", error);
//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   fetchPatients(); // Reused here
// }, []);


// const [phoneError, setPhoneError] = useState('');


//   return (
//     <>
//   <>
//   {loading && <Loader />} {/* Loading Spinner */}
//   {error && <Alert color="red">{error}</Alert>} {/* Error Message */}

//   {!loading && !error && (
//     <MantineReactTable
//       columns={[
//          {
//     header: 'Sr No',
//     accessorFn: (row, index) => index + 1,
//     id: 'serialNumber', // Add unique ID for the column
//     size: 80,
//     minSize: 60,
//     maxSize: 100,
//     enableSorting: false,
//     enableColumnFilter: false,
//     enableResizing: false,
//     cell: ({ row }) => {
//       return (
//         <div className="text-center font-medium">
//           {row.index + 1}
//         </div>
//       );
//     },
//   },
//         ...columns, // your existing columns
//       ]}
//       data={data}
//       initialState={{
//         density: 'comfortable',
//         pagination: { pageSize: 10 },
//         showColumnFilters: true,
//       }}
//       enableFullScreenToggle={false}
//       enableDensityToggle={true}
//       enableColumnResizing
//       enableColumnActions
//       enableStickyHeader
//       enableSorting
//       enableGlobalFilter
//       enableColumnFilters
//       enableHiding
//       positionToolbarAlertBanner="bottom"
//       muiTableBodyRowProps={{
//         sx: {
//           '&:hover': {
//             backgroundColor: '#f9f9f9',
//             cursor: 'pointer',
//             transition: 'all 0.2s ease-in-out',
//           },
//         },
//       }}
//       muiTableHeadCellProps={{
//         sx: {
//           backgroundColor: '#f1f5f9',
//           fontWeight: '600',
//           color: '#1f2937',
//         },
//       }}
//       muiTablePaperProps={{
//         sx: {
//           borderRadius: '10px',
//           boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
//           overflow: 'hidden',
//         },
//       }}
//       muiTableContainerProps={{
//         sx: {
//           maxHeight: '600px',
//         },
//       }}
//       enableRowNumbers={false} // Disable default row number
//       enableRowSelection={false} // ✅ REMOVE checkboxes
//     />
//   )}
// </>




//       {/* Patient Update Modal */}
//       {/* <CModal visible={visible} onClose={() => setVisible(false)}>
//   <CModalHeader>
//     <CModalTitle>Edit Patient</CModalTitle>
//   </CModalHeader>
//   <CModalBody>
//     <CForm>
//       <CFormInput
//         label="Name"
//         value={editData.name}
//         onChange={(e) => setEditData({ ...editData, name: e.target.value })}
//         className="mb-3"
//       />
//       <CFormInput
//         label="Address"
//         value={editData.address}
//         onChange={(e) => setEditData({ ...editData, address: e.target.value })}
//         className="mb-3"
//       />
//       <CFormInput
//         label="Contact Number"
//         value={editData.phone}
//         onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
//         className="mb-3"
//       />
//       <CFormInput
//         label="DOB"
//         type="date"
//         value={editData.dob}
//         onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
//         className="mb-3"
//       />
//       <CFormInput
//         label="Email"
//         value={editData.email}
//         onChange={(e) => setEditData({ ...editData, email: e.target.value })}
//         className="mb-3"
//       />
//     </CForm>
//   </CModalBody>
//   <CModalFooter>
//     <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
//     <CButton color="primary" onClick={handleUpdatePatient}>Update</CButton>
//   </CModalFooter>
// </CModal> */}


// <CModal visible={visible} onClose={() => setVisible(false)}  backdrop="static"
//   keyboard={false}>
//   <CModalHeader>
//     <CModalTitle>Edit Patient</CModalTitle>
//   </CModalHeader>
//   <CModalBody>
//     <CForm>
//       {/* Name (Only letters and spaces) */}
//       <CFormInput
//         label="Name"
//         value={editData.name}
//         onChange={(e) => {
//           const name = e.target.value;
//           if (/^[A-Za-z\s]*$/.test(name)) {
//             setEditData({ ...editData, name });
//           }
//         }}
//         className="mb-3"
//         placeholder="Enter Name"
//       />

//       {/* Address */}
//       <CFormInput
//         label="Address"
//         value={editData.address}
//         onChange={(e) => setEditData({ ...editData, address: e.target.value })}
//         className="mb-3"
//       />

//       {/* Contact Number (Only numeric, exactly 10 digits) */}
//       {/* <CFormInput
//         label="Contact Number"
//         value={editData.phone}
//         onChange={(e) => {
//           const input = e.target.value;
//           if (/^\d{0,10}$/.test(input)) {
//             setEditData({ ...editData, phone: input });
//           }
//         }}
//         className="mb-3"
//         placeholder="10-digit mobile number"
//       /> */}
//       <CFormInput
//   label="Contact Number"
//   value={editData.phone}
//   onChange={(e) => {
//     const input = e.target.value;
//     if (/^\d{0,10}$/.test(input)) {
//       setEditData({ ...editData, phone: input });

//       // Clear error if 10 digits
//       if (input.length === 10) {
//         setPhoneError('');
//       }
//     }
//   }}
//   onBlur={() => {
//     if (editData.phone.length !== 10) {
//       setPhoneError('Mobile number must be exactly 10 digits');
//     } else {
//       setPhoneError('');
//     }
//   }}
//   className="mb-1"
//   placeholder="10-digit mobile number"
// />
// {phoneError && (
//   <div style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem' }}>
//     {phoneError}
//   </div>
// )}

//       {/* DOB */}
//       <CFormInput
//         label="DOB"
//         type="date"
//         value={editData.dob}
//         onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
//         className="mb-3"
//       />

//       {/* Email */}
//       <CFormInput
//         label="Email"
//         value={editData.email}
//         onChange={(e) => setEditData({ ...editData, email: e.target.value })}
//         className="mb-3"
//       />
//     </CForm>
//   </CModalBody>
//   <CModalFooter>
//     <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
//     <CButton
//       color="primary"
//       onClick={handleUpdatePatient}
//       disabled={
//         editData.name.trim() === '' ||
//         editData.phone.length !== 10
//       }
//     >
//       Update
//     </CButton>
//   </CModalFooter>
// </CModal>







//     </>
//   );
// };

// export default BasicMantineTable;







import React, { useEffect, useState } from 'react';
import {
  CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTableDataCell,
  CBadge, CButton, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,
  CForm, CPagination, CPaginationItem,
  CFormSelect
} from '@coreui/react';
import { Alert } from '@mantine/core';
import { getAPICall, put } from '../../../util/api';

const CoreUIPatientTable = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [editData, setEditData] = useState({ id: '', name: '', address: '', phone: '', dob: '', email: '' });
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  // const itemsPerPage = 10;
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = data.filter((patient) =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
    } catch (err) {
      setError(err?.response?.data?.message || 'Error fetching patient data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleEdit = (patient) => {
    setEditData({
      id: patient.id,
      name: patient.name || '',
      address: patient.address || '',
      phone: patient.phone || '',
      dob: patient.dob ? patient.dob.split('T')[0] : '',
      email: patient.email || '',
    });
    setVisible(true);
  };

  const handleUpdatePatient = async () => {
    try {
      await put(`/api/patients/${editData.id}`, editData);
      setData(prev => prev.map(item => item.id === editData.id ? { ...item, ...editData } : item));
      setVisible(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <>
      {error && <Alert color="red">{error}</Alert>}

      {/* 🔍 Search Bar */}
        <div className="d-flex justify-content-between align-items-center mb-3 mt-2">
        <CFormInput
          type="text"
          placeholder="Search patient by name..."
           style={{ maxWidth: '300px' }}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset to first page on search
          }}
        />

 <CFormSelect
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={{ maxWidth: '150px' }}
        >
          {[10, 15, 20, 30, 50].map(size => (
            <option key={size} value={size}>{size} rows</option>
          ))}
        </CFormSelect>

      </div>




      {/* 🧾 Patient Table */}
       <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
      <CTable  bordered hover striped className="shadow-sm mb-0 border" responsive={false}>
        <CTableHead  style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: '#f8f9fa',
      }}
      color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">Sr No</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Address</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Contact No.</CTableHeaderCell>
            <CTableHeaderCell>DOB</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentData.length > 0 ? (
            currentData.map((patient, index) => (
              <CTableRow key={patient.id}>
                <CTableDataCell>{indexOfFirst + index + 1}</CTableDataCell>
                <CTableDataCell>{patient.name}</CTableDataCell>
                <CTableDataCell>{patient.address}</CTableDataCell>
                <CTableDataCell>{patient.email}</CTableDataCell>
                <CTableDataCell>{patient.phone}</CTableDataCell>
                <CTableDataCell>{patient.dob?.split("T")[0]}</CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    color="warning"
                    shape="rounded-pill"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleEdit(patient)}
                  >
                    Update
                  </CBadge>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="7" className="text-center text-danger">
                No patients found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
</div>


    



      {/* 📄 Pagination */}
     {totalPages > 1 && (
       <CPagination align="center" className="mt-3">
         {/* First page */}
         <CPaginationItem
           active={currentPage === 1}
           onClick={() => setCurrentPage(1)}
           style={{
             margin: '0 4px',
             borderRadius: '8px',
             fontWeight: 'bold',
             backgroundColor: currentPage === 1 ? '#0d6efd' : 'white',
             color: currentPage === 1 ? 'white' : '#0d6efd',
             border: '1px solid #0d6efd',
           }}
         >
           1
         </CPaginationItem>
     
         {/* Ellipsis before current range */}
         {currentPage > 3 && (
           <CPaginationItem disabled style={{ pointerEvents: 'none' }}>
             ...
           </CPaginationItem>
         )}
     
         {/* Dynamic middle pages */}
         {Array.from({ length: totalPages }, (_, i) => i + 1)
           .filter(
             (page) =>
               page !== 1 &&
               page !== totalPages &&
               Math.abs(page - currentPage) <= 1
           )
           .map((page) => (
             <CPaginationItem
               key={page}
               active={currentPage === page}
               onClick={() => setCurrentPage(page)}
               style={{
                 margin: '0 4px',
                 borderRadius: '8px',
                 fontWeight: 'bold',
                 backgroundColor: currentPage === page ? '#0d6efd' : 'white',
                 color: currentPage === page ? 'white' : '#0d6efd',
                 border: '1px solid #0d6efd',
               }}
             >
               {page}
             </CPaginationItem>
           ))}
     
         {/* Ellipsis after current range */}
         {currentPage < totalPages - 2 && (
           <CPaginationItem disabled style={{ pointerEvents: 'none' }}>
             ...
           </CPaginationItem>
         )}
     
         {/* Last page */}
         {totalPages > 1 && (
           <CPaginationItem
             active={currentPage === totalPages}
             onClick={() => setCurrentPage(totalPages)}
             style={{
               margin: '0 4px',
               borderRadius: '8px',
               fontWeight: 'bold',
               backgroundColor: currentPage === totalPages ? '#0d6efd' : 'white',
               color: currentPage === totalPages ? 'white' : '#0d6efd',
               border: '1px solid #0d6efd',
             }}
           >
             {totalPages}
           </CPaginationItem>
         )}
       </CPagination>
     )}



 




      {/* ✏️ Edit Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)} backdrop="static" keyboard={false}>
        <CModalHeader>
          <CModalTitle>Edit Patient</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              label="Name"
              value={editData.name}
              onChange={(e) => /^[A-Za-z\s]*$/.test(e.target.value) && setEditData({ ...editData, name: e.target.value })}
              className="mb-3"
              placeholder="Enter Name"
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
              onChange={(e) => {
                const input = e.target.value;
                if (/^\d{0,10}$/.test(input)) {
                  setEditData({ ...editData, phone: input });
                  if (input.length === 10) setPhoneError('');
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
            {phoneError && <div style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem' }}>{phoneError}</div>}

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
          <CButton
            color="primary"
            onClick={handleUpdatePatient}
            disabled={editData.name.trim() === '' || editData.phone.length !== 10}
          >
            Update
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default CoreUIPatientTable;

