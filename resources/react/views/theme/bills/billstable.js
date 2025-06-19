
// import React, { useEffect, useMemo, useState } from 'react';
// import { MantineReactTable } from 'mantine-react-table';
// import { Loader, Alert } from '@mantine/core';
// import { getAPICall } from '../../../util/api';
// import { CButton, CBadge } from '@coreui/react';
// import { useNavigate } from 'react-router-dom';

// const BasicMantineTable = () => {
//   const [data, setData] = useState([]); // State to hold patient data
//   const [loading, setLoading] = useState(true); // State to handle loading state
//   const [error, setError] = useState(''); // State to hold error messages
  

//   const navigate = useNavigate();

//   // Define the columns for the table
//   const columns = useMemo(
//     () => [
//       // { accessorKey: 'id', header: 'ID' },
//       { accessorKey: 'patient_name', header: 'Patient Name' },
//       { accessorKey: 'doctor_name', header: 'Doctor Name' },
//       { accessorKey: 'registration_number', header: 'Registration Number' },
//       { accessorKey: 'visit_date', header: 'Visit Date' },
//         { accessorKey: 'followup_date', header: 'Follow-Up Date' },
//       { accessorKey: 'grand_total', header: 'Amount' },
//          {
//                          header: 'Action',
//                          accessorKey: 'action',
//                          Cell: ({ row }) => (
//                            <>
                             
//                                <CBadge className='bg-info' 
//                                shape='rounded-pill'
//                                // onClick={() => setVisible(!visible)} 
//                                 style={{ cursor: 'pointer' }} 
//                                onClick={() => handleEdit(row.original.id)}
//                               >
//                                Previous Bill
//                                </CBadge>
                          
//                            </>
//                          ),
//                        },
//     ],
//     []
//   );




//   const handleEdit = async (billIds) => {
//     console.log("Fetching previous data for bill:", billIds);
  
//     try {
//       const response = await getAPICall(`/api/priviousBill/${billIds}`);
//       console.log("response",response?.bill?.id);
      
//       // const data = await response.json();
  
//       console.log("Fetched Data:", data);
  
//       // Now you can show this data in modal or save it in state:
//       // setModalData(data); or setSelectedPatientDetails(data);
//       // setVisible(true);

//       navigate('/Invoice', {
//         state: {
//           billIds:response?.bill?.id
//         }
//       });
  
//     } catch (error) {
//       console.error("Failed to fetch previous bill data:", error);
//     }
//   };
  



//   // Fetch data when the component mounts
//   useEffect(() => {
//     const fetchPatients = async () => {
//       const token = localStorage.getItem('token'); // Retrieve the token
//       const doctorId = localStorage.getItem('doctorId'); // Get doctor ID from local storage

//       console.log('Doctor ID:', doctorId); // Debug log to check if doctorId is fetched

//       if (!token || !doctorId) {
//         setError('Token or Doctor ID not found. Please log in again.');
//         setLoading(false); // Stop loading
//         return; // Exit if token or doctor ID is not available
//       }

//       try {
//         const response = await getAPICall(`/api/bills/doctor`)
//         // Log the response for debugging
//         console.log("Fetched Patients Data:", response);

//         setData(response); // Set the fetched data

//       } catch (error) {
//         if (error.response) {
//           if (error.response.status === 401) {
//             setError('Unauthorized: Invalid token or session expired.');
//           } else {
//             setError(`Error fetching data: ${error.response.statusText}`);
//           }
//         } else if (error.request) {
//           setError('No response received from the server.');
//         } else {
//           setError('Error fetching patient data: ' + error.message);
//         }
//         console.error("Error fetching patients:", error); // Log the error for debugging
//       } finally {
//         setLoading(false); // Stop loading in both success and error cases
//       }
//     };

//     fetchPatients(); // Call the fetch function
//   }, []); // Run once on mount

//   const totalAmount = data.reduce((sum, row) => sum + (Number(row.grand_total) || 0), 0);


//   return (
//     <>
      


//       <>


//   {/* ✅ Outside the table - Total Display Below */}
//   <div
//     style={{
//       marginTop: '2px',
//       display: 'flex',
//       justifyContent: 'flex-start', // 👈 left aligned
//       padding: '0.75rem 1rem',
//     }}
//   >
//     <div
//       style={{
//         fontSize: '1.1rem',
//         fontWeight: 'bold',
//         color: '#212529',
//         backgroundColor: '#e9ecef',
//         padding: '0.5rem 1rem',
//         borderRadius: '8px',
//         boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//       }}
//     >
//       🧾 Total Amount: ₹
//       {data.reduce((sum, row) => sum + (Number(row.grand_total) || 0), 0).toFixed(2)}
//     </div>
//   </div>

//         {!loading && !error && (
//   data.length > 0 ? (
//     <MantineReactTable
//     columns={[
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
//       // enableRowNumbers
//       enableStickyHeader
//       enableSorting
//       enableGlobalFilter
//       enableColumnFilters
//       enableHiding
//       // enableRowSelection
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

      
      

//     />
//   ) : (
//     <Alert color="yellow" style={{ marginTop: '1rem' }}>
//       No data available.
//     </Alert>
//   )
// )}

//       </>

//       </>
//   );
// };

// export default BasicMantineTable;




import React, { useEffect, useState } from 'react';
import {
  CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTableDataCell,
  CBadge, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,
  CForm, CButton, CPagination, CPaginationItem, CFormSelect
} from '@coreui/react';
import { Alert } from '@mantine/core';
import { getAPICall } from '../../../util/api';
import { useNavigate } from 'react-router-dom';

const CoreUIPatientTable = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const response = await getAPICall(`/api/bills/doctor`);
      setData(response);
    } catch (error) {
      setError('Error fetching data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredData = data.filter(patient =>
    patient.patient_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleEdit = async (billId) => {
    try {
      const response = await getAPICall(`/api/priviousBill/${billId}`);
      navigate('/Invoice', { state: { billIds: response?.bill?.id } });
    } catch (error) {
      console.error("Failed to fetch previous bill data:", error);
    }
  };

  return (
    <>
      {error && <Alert color="red">{error}</Alert>}

      {/* Search & Controls */}
      <div className="d-flex justify-content-between align-items-center mb-3 mt-2">
        <CFormInput
          type="text"
          placeholder="Search by patient name..."
          style={{ maxWidth: '300px' }}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
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

      {/* Total Amount */}
      <div className="mb-2 fw-bold bg-light p-2 rounded ">
        🧾 Total Amount: ₹{filteredData.reduce((sum, row) => sum + (Number(row.grand_total) || 0), 0).toFixed(2)}
      </div>

      {/* Patient Table */}
     <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
  <CTable bordered hover striped className="shadow-sm mb-0 border" responsive={false}>
    <CTableHead
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: '#f8f9fa',
      }}
      color="light"
    >
      <CTableRow>
        <CTableHeaderCell>Sr No</CTableHeaderCell>
        <CTableHeaderCell>Patient Name</CTableHeaderCell>
        <CTableHeaderCell>Doctor Name</CTableHeaderCell>
        <CTableHeaderCell>Reg No</CTableHeaderCell>
        <CTableHeaderCell>Visit Date</CTableHeaderCell>
        <CTableHeaderCell>Follow-up Date</CTableHeaderCell>
        <CTableHeaderCell>Amount</CTableHeaderCell>
        <CTableHeaderCell>Action</CTableHeaderCell>
      </CTableRow>
    </CTableHead>

    <CTableBody>
      {currentData.length > 0 ? (
        currentData.map((patient, index) => (
          <CTableRow key={index}>
            <CTableDataCell>{indexOfFirst + index + 1}</CTableDataCell>
            <CTableDataCell>{patient.patient_name}</CTableDataCell>
            <CTableDataCell>{patient.doctor_name}</CTableDataCell>
            <CTableDataCell>{patient.registration_number}</CTableDataCell>
            <CTableDataCell>{patient.visit_date}</CTableDataCell>
            <CTableDataCell>{patient.followup_date}</CTableDataCell>
            <CTableDataCell>₹{Number(patient.grand_total).toFixed(2)}</CTableDataCell>
            <CTableDataCell>
              <CBadge
                color="info"
                shape="rounded-pill"
                style={{ cursor: 'pointer' }}
                onClick={() => handleEdit(patient.id)}
              >
                Previous Bill
              </CBadge>
            </CTableDataCell>
          </CTableRow>
        ))
      ) : (
        <CTableRow>
          <CTableDataCell colSpan="8" className="text-center text-danger">
            No patients found.
          </CTableDataCell>
        </CTableRow>
      )}
    </CTableBody>
  </CTable>
</div>


      {/* Pagination */}
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

    </>
  );
};

export default CoreUIPatientTable;





























{/* {loading && <Loader />}
      {error && <Alert color="red">{error}</Alert>} 
      {!loading && !error && (
        <MantineReactTable
          columns={columns} // Pass the defined columns
          data={data} // Pass the fetched data
          initialState={{ density: 'compact' }} // Initial state settings
          enableFullScreenToggle={false} // Disable fullscreen toggle
          enableDensityToggle={true} // Enable density toggle
        />
      )} */}
   
              {/* {loading && <Loader />} 
        {error && <Alert color="red">{error}</Alert>} 
      
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
        )} */}