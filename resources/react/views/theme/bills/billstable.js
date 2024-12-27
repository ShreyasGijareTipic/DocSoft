// Patient.js
import React, { useEffect, useMemo, useState } from 'react';
import { MantineReactTable } from 'mantine-react-table';
import { Loader, Alert } from '@mantine/core';
import { getAPICall } from '../../../util/api';

const BasicMantineTable = () => {
  const [data, setData] = useState([]); // State to hold patient data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(''); // State to hold error messages

  // Define the columns for the table
  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'patient_name', header: 'Patient Name' },
      { accessorKey: 'doctor_name', header: 'Doctor Name' },
      { accessorKey: 'registration_number', header: 'Registration Number' },
      { accessorKey: 'visit_date', header: 'Visit Date' },
      { accessorKey: 'grand_total', header: 'Amount' },
    ],
    []
  );

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

  return (
    <>
      {loading && <Loader />} {/* Show loader while fetching data */}
      {error && <Alert color="red">{error}</Alert>} {/* Display error message */}
      {!loading && !error && (
        <MantineReactTable
          columns={columns} // Pass the defined columns
          data={data} // Pass the fetched data
          initialState={{ density: 'compact' }} // Initial state settings
          enableFullScreenToggle={false} // Disable fullscreen toggle
          enableDensityToggle={true} // Enable density toggle
        />
      )}
    </>
  );
};

export default BasicMantineTable;
