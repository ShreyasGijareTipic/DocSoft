import React, { useEffect, useMemo, useState } from 'react';
import { MantineReactTable } from 'mantine-react-table';
import { Loader, Alert } from '@mantine/core';
import { getAPICall } from '../../../util/api';
import { CButton, CBadge } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilCog } from '@coreui/icons';

function WhatsappClinicRegister() {
  const [data, setData] = useState([]); // State to hold clinic data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(''); // State to handle errors
  const navigate = useNavigate(); // Navigation hook

  // Define columns for the table
  const columns = useMemo(
    () => [
    //   { accessorKey: 'id', header: 'ID' },
      {
        header: 'Action',
        accessorKey: 'actions',
        Cell: ({ row }) => (
          // <CButton
          //   color="secondary"
          //   onClick={() => handleEdit(row.original.id)} // Pass the ID dynamically
          // >
          //   Setting  &nbsp;
          //   <CIcon icon={cilCog}
          //    onClick={() => handleEdit(row.original.id)}
          //   />
          // </CButton>
          <CBadge 
  color="secondary" 
  className="px-2 py-1 d-inline-flex align-items-center cursor-pointer"
  onClick={() => handleEdit(row.original.id)}
  style={{ cursor: 'pointer' }}
>Add Details &nbsp;
  {/* <CIcon icon={cilCog} /> */}
</CBadge>
        ),
      },
      { accessorKey: 'clinic_name', header: 'Clinic Name' },
      { accessorKey: 'clinic_address', header: 'Address' },
      { accessorKey: 'clinic_registration_no', header: 'Registration Number' },
      { accessorKey: 'clinic_mobile', header: 'Contact Number' },
      
    ],
    []
  );

  // Handle Edit button click
  const handleEdit = (id) => {
    navigate(`/register/EditwhatsappClinicRegister/${id}`); // Redirect to edit page with ID
  };

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await getAPICall(`/api/clinic`);
        console.log('Fetched Clinic Data:', response);
        setData(response); // Set data
      } catch (error) {
        if (error.response) {
          setError(`Error: ${error.response.statusText}`);
        } else if (error.request) {
          setError('No response from server.');
        } else {
          setError('Error: ' + error.message);
        }
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchClinics();
  }, []);

  return (
    <>
      {/* {loading && <Loader />} 
      {error && <Alert color="red">{error}</Alert>} 
      {!loading && !error && (
        <MantineReactTable
          columns={columns}
          data={data}
          initialState={{ density: 'compact' }}
          enableFullScreenToggle={false}
          enableDensityToggle={true}
        />
      )} */}


  <MantineReactTable
    columns={columns}
    data={data}
    initialState={{ density: 'density' }}
    enableFullScreenToggle={false}
    enableDensityToggle={true}
    mantineTableBodyCellProps={{
      style: {
        padding: '20px 20px',
        fontSize: '14px',
      },
    }}
    mantineTableHeadCellProps={{
      style: {
        padding: '20px 20px',
        backgroundColor: '#f8f9fa',
        fontWeight: 600,
      },
    }}
    mantineTableContainerProps={{
      style: {
        width: '100%',
        margin: '0 auto', // center horizontally
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        padding: 0, // Ensure inner container has no padding
      },
    }}
  />




    </>
  );
}

export default WhatsappClinicRegister;
