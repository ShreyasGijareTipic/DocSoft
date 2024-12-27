import React, { useEffect, useMemo, useState } from 'react';
import { MantineReactTable } from 'mantine-react-table';
import { Loader, Alert } from '@mantine/core';
import { getAPICall } from '../../../util/api';

const PrescriptionTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Define the columns for the prescription table
  const columns = useMemo(() => [
    { accessorKey: 'registration_number', header: 'Registration Number' }, // Column for doctor's registration number
    { accessorKey: 'doctor_name', header: 'Doctor Name' }, // Column for doctor's name
    { accessorKey: 'patient_name', header: 'Patient Name' }, // Column for patient's name
    { accessorKey: 'visit_date', header: 'Visit Date' }, // Column for visit date
    {
      accessorKey: 'medicines', 
      header: 'Medicine',
      Cell: ({ row }) => row.original.medicines.map((medicine, index) => (
        <div key={index}>
          <strong>{medicine.name}</strong><br />
          Dosage: {medicine.dosage}<br />
          Timing: {medicine.timing}<br />
          Frequency: {medicine.frequency}<br />
          Duration: {medicine.duration}
        </div>
      )),
    },
  ], []);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      const token = localStorage.getItem('token');
      const userRegistrationNumber = localStorage.getItem('userRegistrationNumber'); // Get the logged-in user's registration number

      if (!token || !userRegistrationNumber) {
        setError('Token or User Registration Number not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        // Fetch prescriptions using the logged-in user's registration number
        const response = await getAPICall(`/api/prescriptions/user/${userRegistrationNumber}`);
        const prescriptions = response.data.map(prescription => ({
          ...prescription,
          medicines: JSON.parse(prescription.medicines), // Ensure medicines are parsed from JSON
        }));
        setData(prescriptions);
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
          setError('Error fetching prescription data: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  return (
    <>
      {loading && <Loader />} 
      {error && <Alert color="red">{error}</Alert>}
      {!loading && !error && data.length > 0 && (
        <MantineReactTable
          columns={columns} // Use the columns defined above
          data={data} // Use the fetched data
          initialState={{
            density: 'compact',
          }}
          enableFullScreenToggle={false}
          enableDensityToggle={true}
        />
      )}
      {!loading && !error && data.length === 0 && (
        <div>No prescriptions available</div>
      )}
    </>
  );
};

export default PrescriptionTable;
