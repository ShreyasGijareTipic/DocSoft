// Patient.js
import React, { useEffect, useMemo, useState } from 'react';
import { MantineReactTable } from 'mantine-react-table';
import { Loader, Alert } from '@mantine/core';
import { getAPICall } from '../../../util/api';
import { CButton, CBadge } from '@coreui/react';
import { useNavigate } from 'react-router-dom';

const BasicMantineTable = () => {
  const [data, setData] = useState([]); // State to hold patient data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(''); // State to hold error messages
  

  const navigate = useNavigate();

  // Define the columns for the table
  const columns = useMemo(
    () => [
      // { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'patient_name', header: 'Patient Name' },
      { accessorKey: 'doctor_name', header: 'Doctor Name' },
      { accessorKey: 'registration_number', header: 'Registration Number' },
      { accessorKey: 'visit_date', header: 'Visit Date' },
        { accessorKey: 'followup_date', header: 'Follow-Up Date' },
      { accessorKey: 'grand_total', header: 'Amount' },
         {
                         header: 'Action',
                         accessorKey: 'action',
                         Cell: ({ row }) => (
                           <>
                             
                               <CBadge className='bg-info' 
                               shape='rounded-pill'
                               // onClick={() => setVisible(!visible)} 
                               onClick={() => handleEdit(row.original.id)}
                              >
                               Previous Bill
                               </CBadge>
                          
                           </>
                         ),
                       },
    ],
    []
  );




  const handleEdit = async (billIds) => {
    console.log("Fetching previous data for bill:", billIds);
  
    try {
      const response = await getAPICall(`/api/priviousBill/${billIds}`);
      console.log("response",response?.bill?.id);
      
      // const data = await response.json();
  
      console.log("Fetched Data:", data);
  
      // Now you can show this data in modal or save it in state:
      // setModalData(data); or setSelectedPatientDetails(data);
      // setVisible(true);

      navigate('/Invoice', {
        state: {
          billIds:response?.bill?.id
        }
      });
  
    } catch (error) {
      console.error("Failed to fetch previous bill data:", error);
    }
  };
  



  // Fetch data when the component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token
      const doctorId = localStorage.getItem('doctorId'); // Get doctor ID from local storage

      console.log('Doctor ID:', doctorId); // Debug log to check if doctorId is fetched

      if (!token || !doctorId) {
        setError('Token or Doctor ID not found. Please log in again.');
        setLoading(false); // Stop loading
        return; // Exit if token or doctor ID is not available
      }

      try {
        const response = await getAPICall(`/api/bills/doctor`)
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

  const totalAmount = data.reduce((sum, row) => sum + (Number(row.grand_total) || 0), 0);


  return (
    <>
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
   


      <>
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

  {/* ✅ Outside the table - Total Display Below */}
  <div
    style={{
      marginTop: '2px',
      display: 'flex',
      justifyContent: 'flex-start', // 👈 left aligned
      padding: '0.75rem 1rem',
    }}
  >
    <div
      style={{
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#212529',
        backgroundColor: '#e9ecef',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      🧾 Total Amount: ₹
      {data.reduce((sum, row) => sum + (Number(row.grand_total) || 0), 0).toFixed(2)}
    </div>
  </div>

        {!loading && !error && (
  data.length > 0 ? (
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
  ) : (
    <Alert color="yellow" style={{ marginTop: '1rem' }}>
      No data available.
    </Alert>
  )
)}

      </>

      </>
  );
};

export default BasicMantineTable;
