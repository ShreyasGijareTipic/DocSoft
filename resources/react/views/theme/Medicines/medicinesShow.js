import React, { useEffect, useMemo, useState } from 'react'
import { MantineReactTable } from 'mantine-react-table';
import { getAPICall } from '../../../util/api';


function medicinesShow() {

const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

 const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'drug_name', header: 'Drug Name' },
      { accessorKey: 'generic_name', header: 'Generic Name' },
      { accessorKey: 'category', header: 'Category' },
      { accessorKey: 'manufacturer', header: 'Manufacturer' },
     
    ],
    []
  );


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
     <div style={{ padding: '1rem', paddingTop: '50px' }}>
        <MantineReactTable
          columns={columns}
          data={data}
          initialState={{ density: 'compact' }}
          enableFullScreenToggle={false}
          enableDensityToggle={true}
        />
      </div>
    </div>
  )
}

export default medicinesShow
