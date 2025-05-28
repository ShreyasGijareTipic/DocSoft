import React, { useEffect, useMemo, useState } from 'react'
import { MantineReactTable } from 'mantine-react-table';
import { getAPICall, put } from '../../../util/api';
import { CButton,CBadge, CFormInput, CFormLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { Loader } from '@mantine/core';
import { Alert } from '@coreui/coreui';


function medicinesShow() {

const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [visible, setVisible] = useState(false);
const [editData, setEditData] = useState({
  id: '',
  drug_name: '',
  // generic_name: '',
  category: '',
  manufacturer: '',
  
});

 const columns = useMemo(
    () => [
      // { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'drug_name', header: 'Drug Name' },
      // { accessorKey: 'generic_name', header: 'Generic Name' },
      { accessorKey: 'category', header: 'Category' },
      { accessorKey: 'manufacturer', header: 'Manufacturer' },
      {
                              header: 'Action',
                              accessorKey: 'action',
                              Cell: ({ row }) => (
                                <>
                                  
                                    <CBadge className='bg-info'
                                    shape='rounded-pill' 
                                    // onClick={() => setVisible(!visible)} 
                                    onClick={() => handleEdit(row.original)}
                                   >
                                     Update Medicine
                                    </CBadge>
                               
                                </>
                              ),
                            },
    ],
    []
  );

// edit medcine 
const handleEdit = (drugs) => {
  console.log(drugs);

  setEditData({
    id: drugs.id,
    drug_name: drugs.drug_name || '',
    // generic_name: drugs.generic_name || '',
    category: drugs.category || '',
    manufacturer: drugs.manufacturer || '',
  });

  setVisible(true); // open modal/dialog/form
};

  
const handleUpdateMedicine = async () => {
  try {
    const response = await put(`/api/drugs/${editData.id}`, {
      drug_name: editData.drug_name,
      // generic_name: editData.generic_name,
      category: editData.category,
      manufacturer: editData.manufacturer,
    });

    console.log('Medicine updated:', response.data);
    setVisible(false);
    fetchMedicines(); // call to refresh table data
    // Show success toast if needed
  } catch (error) {
    console.error('Update failed:', error);
    // Show error toast if needed
  }
};




  const fetchMedicines = async () => {
    const token = localStorage.getItem('token'); // Retrieve the token
    const doctorId = localStorage.getItem('doctorId'); // Get doctor ID from local storage
  
    console.log('Doctor ID:', doctorId); // Debug log to check if doctorId is fetched
    console.log('Token:', token); // Debug log to check if token is fetched
  
    if (!token || !doctorId) {
      setError('Token or Doctor ID not found. Please log in again.');
      setLoading(false); // Stop loading
      return; // Exit if token or doctor ID is not available
    }
  
    try {
      // Dynamically include the doctorId in the API endpoint
      const response = await getAPICall(`/api/medicines/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
      });
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
        setError('Error fetching medicines data: ' + error.message);
      }
    } finally {
      setLoading(false); // Stop loading in both success and error cases
    }
  };
  
  useEffect(() => {
    fetchMedicines();
  }, []);



  return (
    <div>
     {/* Table Section */}
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


      <CModal visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>Edit Medicine</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="mb-3">
          <CFormLabel style={{fontWeight:'bold'}}>Drug Name</CFormLabel>
          <CFormInput
            value={editData.drug_name}
            onChange={(e) => setEditData({ ...editData, drug_name: e.target.value })}
            placeholder="Enter drug name"
          />
        </div>

        {/* <div className="mb-3">
          <CFormLabel>Generic Name</CFormLabel>
          <CFormInput
            value={editData.generic_name}
            onChange={(e) => setEditData({ ...editData, generic_name: e.target.value })}
            placeholder="Enter generic name"
          />
        </div> */}

        <div className="mb-3">
          <CFormLabel style={{fontWeight:'bold'}}>Category</CFormLabel>
          <CFormInput
            value={editData.category}
            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
            placeholder="Enter category"
          />
        </div>

        <div className="mb-3">
          <CFormLabel style={{fontWeight:'bold'}}>Manufacturer</CFormLabel>
          <CFormInput
            value={editData.manufacturer}
            onChange={(e) => setEditData({ ...editData, manufacturer: e.target.value })}
            placeholder="Enter manufacturer"
          />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={handleUpdateMedicine}>
          Update
        </CButton>
      </CModalFooter>
    </CModal>




    </div>
  )
}

export default medicinesShow
