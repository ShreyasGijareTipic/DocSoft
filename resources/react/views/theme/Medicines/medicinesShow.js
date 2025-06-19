// import React, { useEffect, useMemo, useState } from 'react'
// import { MantineReactTable } from 'mantine-react-table';
// import { getAPICall, put } from '../../../util/api';
// import { CButton,CBadge, CFormInput, CFormLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
// import { Loader } from '@mantine/core';
// import { Alert } from '@coreui/coreui';


// function medicinesShow() {

// const [data, setData] = useState([]);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState('');
// const [visible, setVisible] = useState(false);
// const [editData, setEditData] = useState({
//   id: '',
//   drug_name: '',
//   // generic_name: '',
//   category: '',
//   manufacturer: '',
  
// });

//  const columns = useMemo(
//     () => [
//       // { accessorKey: 'id', header: 'ID' },
      
//       { accessorKey: 'drug_name', header: 'Drug Name' },
//       // { accessorKey: 'generic_name', header: 'Generic Name' },
//       { accessorKey: 'category', header: 'Category' },
//       { accessorKey: 'manufacturer', header: 'Manufacturer' },
//       {
//                               header: 'Action',
//                               accessorKey: 'action',
//                               Cell: ({ row }) => (
//                                 <>
                                  
//                                     <CBadge className='bg-info'
//                                     shape='rounded-pill' 
//                                      style={{ cursor: 'pointer' }} 
//                                     // onClick={() => setVisible(!visible)} 
//                                     onClick={() => handleEdit(row.original)}
//                                    >
//                                      Update Medicine
//                                     </CBadge>
                               
//                                 </>
//                               ),
//                             },
//     ],
//     []
//   );

// // edit medcine 
// const handleEdit = (drugs) => {
//   console.log(drugs);

//   setEditData({
//     id: drugs.id,
//     drug_name: drugs.drug_name || '',
//     // generic_name: drugs.generic_name || '',
//     category: drugs.category || '',
//     manufacturer: drugs.manufacturer || '',
//   });

//   setVisible(true); // open modal/dialog/form
// };

  
// const handleUpdateMedicine = async () => {
//   try {
//     const response = await put(`/api/drugs/${editData.id}`, {
//       drug_name: editData.drug_name,
//       // generic_name: editData.generic_name,
//       category: editData.category,
//       manufacturer: editData.manufacturer,
//     });

//     console.log('Medicine updated:', response.data);
//     setVisible(false);
//     fetchMedicines(); // call to refresh table data
//     // Show success toast if needed
//   } catch (error) {
//     console.error('Update failed:', error);
//     // Show error toast if needed
//   }
// };




//   const fetchMedicines = async () => {
//     const token = localStorage.getItem('token'); // Retrieve the token
//     const doctorId = localStorage.getItem('doctorId'); // Get doctor ID from local storage
  
//     console.log('Doctor ID:', doctorId); // Debug log to check if doctorId is fetched
//     console.log('Token:', token); // Debug log to check if token is fetched
  
//     if (!token || !doctorId) {
//       setError('Token or Doctor ID not found. Please log in again.');
//       setLoading(false); // Stop loading
//       return; // Exit if token or doctor ID is not available
//     }
  
//     try {
//       // Dynamically include the doctorId in the API endpoint
//       const response = await getAPICall(`/api/medicines/${doctorId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`, // Include token for authentication
//         },
//       });
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
//         setError('Error fetching medicines data: ' + error.message);
//       }
//     } finally {
//       setLoading(false); // Stop loading in both success and error cases
//     }
//   };
  
//   useEffect(() => {
//     fetchMedicines();
//   }, []);



//   return (
//     <div>
//      {/* Table Section */}
//       <>
//              {loading && <Loader />} {/* Loading Spinner */}
//              {error && <Alert color="red">{error}</Alert>} {/* Error Message */}
           
//              {!loading && !error && (
//                <MantineReactTable
//   columns={[
//      {
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
//     ...columns,
//   ]}
//   data={data}
//   initialState={{
//     density: 'comfortable',
//     pagination: { pageSize: 10 },
//     showColumnFilters: true,
//   }}
//   enableFullScreenToggle={false}
//   enableDensityToggle={true}
//   enableColumnResizing
//   enableColumnActions
//   enableStickyHeader
//   enableSorting
//   enableGlobalFilter
//   enableColumnFilters
//   enableHiding
//   // ❌ REMOVE: enableRowNumbers
//   positionToolbarAlertBanner="bottom"
//   muiTableBodyRowProps={{
//     sx: {
//       '&:hover': {
//         backgroundColor: '#f9f9f9',
//         cursor: 'pointer',
//         transition: 'all 0.2s ease-in-out',
//       },
//     },
//   }}
//   muiTableHeadCellProps={{
//     sx: {
//       backgroundColor: '#f1f5f9',
//       fontWeight: '600',
//       color: '#1f2937',
//     },
//   }}
//   muiTablePaperProps={{
//     sx: {
//       borderRadius: '10px',
//       boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
//       overflow: 'hidden',
//     },
//   }}
//   muiTableContainerProps={{
//     sx: {
//       maxHeight: '600px',
//     },
//   }}
// />

//              )}
//            </>


//       <CModal visible={visible} onClose={() => setVisible(false)}  backdrop="static"
//   keyboard={false}>
//       <CModalHeader>
//         <CModalTitle>Edit Medicine</CModalTitle>
//       </CModalHeader>
//       <CModalBody>
//         <div className="mb-3">
//           <CFormLabel style={{fontWeight:'bold'}}>Drug Name</CFormLabel>
//           <CFormInput
//             value={editData.drug_name}
//             onChange={(e) => setEditData({ ...editData, drug_name: e.target.value })}
//             placeholder="Enter drug name"
//           />
//         </div>

//         {/* <div className="mb-3">
//           <CFormLabel>Generic Name</CFormLabel>
//           <CFormInput
//             value={editData.generic_name}
//             onChange={(e) => setEditData({ ...editData, generic_name: e.target.value })}
//             placeholder="Enter generic name"
//           />
//         </div> */}

//         <div className="mb-3">
//           <CFormLabel style={{fontWeight:'bold'}}>Category</CFormLabel>
//           <CFormInput
//             value={editData.category}
//             onChange={(e) => setEditData({ ...editData, category: e.target.value })}
//             placeholder="Enter category"
//           />
//         </div>

//         <div className="mb-3">
//           <CFormLabel style={{fontWeight:'bold'}}>Manufacturer</CFormLabel>
//           <CFormInput
//             value={editData.manufacturer}
//             onChange={(e) => setEditData({ ...editData, manufacturer: e.target.value })}
//             placeholder="Enter manufacturer"
//           />
//         </div>
//       </CModalBody>
//       <CModalFooter>
//         <CButton color="secondary" onClick={() => setVisible(false)}>
//           Cancel
//         </CButton>
//         <CButton color="primary" onClick={handleUpdateMedicine}>
//           Update
//         </CButton>
//       </CModalFooter>
//     </CModal>




//     </div>
//   )
// }

// export default medicinesShow




import React, { useEffect, useState } from 'react';
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CFormInput,
  CFormSelect,
  CButton,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel
} from '@coreui/react';
import { Loader } from '@mantine/core';
import { getAPICall, put } from '../../../util/api';

const MedicinesShow = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [editData, setEditData] = useState({ id: '', drug_name: '', category: '', manufacturer: '' });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    setFilteredData(
      data.filter((med) =>
        med.drug_name.toLowerCase().includes(lowerSearch)
      )
    );
    setCurrentPage(1);
  }, [searchTerm, data]);

  const fetchMedicines = async () => {
    const token = localStorage.getItem('token');
    const doctorId = localStorage.getItem('doctorId');

    if (!token || !doctorId) return;

    try {
      const response = await getAPICall(`/api/medicines/${doctorId}`);
      setData(response);
      setFilteredData(response);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (medicine) => {
    setEditData({
      id: medicine.id,
      drug_name: medicine.drug_name || '',
      category: medicine.category || '',
      manufacturer: medicine.manufacturer || '',
    });
    setVisible(true);
  };

  const handleUpdateMedicine = async () => {
    try {
      await put(`/api/drugs/${editData.id}`, editData);
      setVisible(false);
      fetchMedicines();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 mt-2">
        <CFormInput
          type="text"
          placeholder="Search drug name..."
          value={searchTerm}
           style={{ maxWidth: '300px' }}
          onChange={(e) => setSearchTerm(e.target.value)}
        
        />
        <CFormSelect
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          style={{ maxWidth: '150px' }}
        >
          {[10, 15, 20, 30, 50].map(size => (
            <option key={size} value={size}>{size} rows</option>
          ))}
        </CFormSelect>
      </div>

      {loading ? (
        <Loader />
      ) : (

        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>

        <CTable bordered hover striped className="shadow-sm mb-0 border" responsive={false}>
          <CTableHead  style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: '#f8f9fa',
      }}
      color="light">
            <CTableRow>
              <CTableHeaderCell>Sr No</CTableHeaderCell>
              <CTableHeaderCell>Drug Name</CTableHeaderCell>
              <CTableHeaderCell>Category</CTableHeaderCell>
              <CTableHeaderCell>Manufacturer</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((med, index) => (
              <CTableRow key={med.id}>
                <CTableDataCell>{indexOfFirst + index + 1}</CTableDataCell>
                <CTableDataCell>{med.drug_name}</CTableDataCell>
                <CTableDataCell>{med.category}</CTableDataCell>
                <CTableDataCell>{med.manufacturer}</CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    color="info"
                    shape="rounded-pill"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleEdit(med)}
                  >
                    Update Medicine
                  </CBadge>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        </div>
      )}


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



      {/* Edit Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)} backdrop="static" keyboard={false}>
        <CModalHeader>
          <CModalTitle>Edit Medicine</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Drug Name</CFormLabel>
            <CFormInput
              value={editData.drug_name}
              onChange={(e) => setEditData({ ...editData, drug_name: e.target.value })}
              placeholder="Enter drug name"
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Category</CFormLabel>
            <CFormInput
              value={editData.category}
              onChange={(e) => setEditData({ ...editData, category: e.target.value })}
              placeholder="Enter category"
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Manufacturer</CFormLabel>
            <CFormInput
              value={editData.manufacturer}
              onChange={(e) => setEditData({ ...editData, manufacturer: e.target.value })}
              placeholder="Enter manufacturer"
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleUpdateMedicine}>Update</CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default MedicinesShow;
