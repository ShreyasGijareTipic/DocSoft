import React, { useEffect, useMemo, useState } from 'react';
import { MantineReactTable } from 'mantine-react-table';
import { Button } from '@mantine/core';
import { CButton, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { deleteAPICall, getAPICall, post, put } from '../../../util/api';

function Timeslots() {

    const [visible, setVisible] = useState(false) 
    const [visible2, setVisible2] = useState(false)

    const [dropdown1, setDropdown1] = useState('');
    const [dropdown2, setDropdown2] = useState('');
  
    const handleDropdown1Change = (e) => setDropdown1(e.target.value);
    // const handleDropdown2Change = (e) => setDropdown2(e.target.value);
    const [timeSlots, setTimeSlots] = useState([]);

    const [selectedRow, setSelectedRow] = useState(null);
  
    const handleSubmit = () => {
      alert(`Dropdown 1: ${dropdown1}\nDropdown 2: ${dropdown2}`);
    };

  // Demo Data
  const [data, setData] = useState([]);


  // Table Columns
  const columns = useMemo(
    () => [
      // { accessorKey: 'id', header: '' },
    
      { accessorKey: 'time', header: 'Time' },
      // { accessorKey: 'slot', header: 'Slots' },
      {
        accessorKey: 'slot',
        header: 'Slots',
        Cell: ({ row }) => {
         
          let slotName = handleSlotName(row.original.slot);
          console.log(slotName);
          
          
          return <span>{slotName}</span>;
    },
      },
      {
        header: 'Action',
        accessorKey: 'actions',
        Cell: ({ row }) => (
          <>
            
              <Button color="yellow" 
              // onClick={() => setVisible(!visible)} 
              onClick={() => handleEdit(row.original)}>
                Edit
              </Button>
          &nbsp;
          &nbsp;
        
              <Button color="red"
              //  onClick={() => setVisible(!visible)}
               onClick={() => handleDelete(row.original)}
               >
                Reject
              </Button>
          
          </>
        ),
      },
    ],
    [data]
  );


  const handleEdit = (rowData) => {
    console.log('Edit clicked:', rowData); // Logs full row data
    setDropdown1(rowData.slot); // Example: Set dropdown1 to slot value
    setDropdown2(rowData.time); // Example: Set dropdown2 to time value
    setSelectedRow(rowData); // Save row data in state for editing
    setVisible(true); // Open modal
  };



  const fetchData = async () => {
    try {
      const response = await getAPICall('/api/allDataTimeSlot');
      console.log("All Data",response);
     
      setData(response); // Update state with fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data when the component loads
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means it runs only once when component loads

  // Delete Function
  const handleDelete = async (rowData) => {
    console.log('Delete clicked:', rowData); // Logs full row data
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the timeslot for ${rowData.time}?`
    );
    if (confirmDelete) {
      try {
        // Make DELETE API call
        const response = await deleteAPICall(`/api/timeslotDestroy/${rowData.id}`);

        // if (!response.ok) {
          // throw new Error('Failed to delete timeslot.');
        // } 

        alert('Timeslot deleted successfully!');
        fetchData(); // Re-fetch data after successful deletion
      } catch (error) {
        console.error('Error deleting timeslot:', error);
        alert('Failed to delete timeslot.');
      }
    }
  };

 

  // Fetch timeslots from API
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await getAPICall('/api/doctorTiemslot');
       
      
        setTimeSlots(response); // Set available time slots
      } catch (error) {
        console.error('Error fetching time slots:', error);
      }
    };

    if (7) {
      fetchTimeSlots(); // Fetch only if doctorId is present
    }
  }, []); // Dependency array to re-fetch data when doctorId changes

console.log("babababab",timeSlots);


  // Handle dropdown change
  const handleDropdown2Change = (e) => {
    setDropdown2(e.target.value);
  };


  



  const handleSubmitData = () => {
    const requestData = {
      // doctor_id: 7, // Example doctor ID, replace dynamically as needed
      time: dropdown2,
      slot: dropdown1,
    };

    post('/api/timeslotadd', requestData)
      .then(response => {
        console.log('Success:', response.data);
        alert('Timeslot added successfully!');
        setVisible2(false);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to add timeslot.');
      });
  };



  // Update timeslot
  
  const [refreshData, setRefreshData] = useState(false); // State to trigger re-fetch

const handleUpdate = async (id) => {
  const requestData = {
    time: dropdown2,
    slot: dropdown1,
  };

  try {
    const response = await put(`/api/timeslotUpdate/${id}`, requestData);

    alert('Timeslot updated successfully!');
    setVisible(false);

    // Trigger data re-fetch
    setRefreshData((prev) => !prev);
  } catch (error) {
    console.error('Error updating timeslot:', error);
    alert('Failed to update timeslot.');
  }
};

// Fetch data whenever `refreshData` changes
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await getAPICall('/api/allDataTimeSlot');
      setData(response); // Update the table data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, [refreshData]);


  const handleSlotName = (slots) => {
    let slotName = '';
    switch(slots){
      case 1: 
      slotName = 'Morning';
      break;
      case 2: 
      slotName = 'Afternoon';
      break;
      case 3: 
      slotName = 'Evening';
      break;
      default:
      slotName = 'Undefined';

    }
    return slotName;

  };


  return (
    <>

<CButton color="primary" onClick={() => setVisible2(!visible2)}>
       Create New Slots
      </CButton>



    <div style={{ padding: '1rem', paddingTop: '50px' }}>
      <MantineReactTable
        columns={columns}
        data={data} // Use state data
        initialState={{ density: 'compact' }}
        enableFullScreenToggle={false}
        enableDensityToggle={true}
      />
    </div>

{/* update  */}
    
    <CModal
  alignment="center"
  visible={visible}
  onClose={() => setVisible(false)}
>
  <CModalHeader>
    <CModalTitle>Edit Timeslot</CModalTitle>
  </CModalHeader>
  <CModalBody>
    <div className="mb-3">
      <label className="form-label">Select Option</label>
      <CFormSelect
        value={dropdown1}
        onChange={(e) => setDropdown1(e.target.value)}
      >
        <option value="">Choose an option</option>
        <option value="1">Morning</option>
        <option value="2">Afternoon</option>
        <option value="3">Evening</option>
      </CFormSelect>
    </div>

    <div className="mb-3">
      <label className="form-label">Select Time Slot</label>
      <CFormSelect
        value={dropdown2}
        onChange={(e) => setDropdown2(e.target.value)}
      >
        <option value="">Choose a Time Slot</option>
        {timeSlots.map((slot, index) => (
          <option key={index} value={slot}>
            {slot}
          </option>
        ))}
      </CFormSelect>
    </div>
  </CModalBody>
  <CModalFooter>
    <CButton color="secondary" onClick={() => setVisible(false)}>
      Close
    </CButton>
    <CButton
      color="primary"
      onClick={() => handleUpdate(selectedRow.id)} // Update API call
    >
      Save changes
    </CButton>
  </CModalFooter>
</CModal>




{/* post  */}

      <CModal
      alignment="center"
      visible={visible2}
      onClose={() => setVisible2(false)}
      aria-labelledby="VerticallyCenteredExample"
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">Create New Timeslot</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {/* Dropdown 1 */}
        <div className="mb-3">
          <label className="form-label">Select Option</label>
          <CFormSelect value={dropdown1} onChange={handleDropdown1Change}>
            <option value="">Choose an option</option>
            <option value="1">Morning</option>
            <option value="2">Afternoon</option>
            <option value="3">Evening</option>
          </CFormSelect>
        </div>

        {/* Dropdown 2 */}
        <div className="mb-3">
          <label className="form-label">Select Time Slot</label>
          <CFormSelect value={dropdown2} onChange={handleDropdown2Change}>
            <option value="">Choose a Time Slot</option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </CFormSelect>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible2(false)}>
          Close
        </CButton>
        <CButton color="primary" onClick={handleSubmitData}>
          Submit
        </CButton>
      </CModalFooter>
    </CModal>








    </>
  );
}

export default Timeslots;
