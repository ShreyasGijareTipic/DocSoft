// import React from 'react'
import {
    CCard,
    CCardHeader,
    CCardBody,
    CCardTitle,
    CCardText,
    CRow,
    CCol,
    CFormInput,
    CButton,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CFormSelect,
    CFormTextarea,
    CListGroup, CListGroupItem,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CBadge,
    CForm,
    CFormLabel
  } from '@coreui/react';
  import React, { useMemo, useState, useEffect } from 'react';
import { MantineReactTable } from 'mantine-react-table';
import { getAPICall, post, put } from '../../../util/api';

export default function docdashboard() {
    console.log('pankaj');

    const [data, setData] = useState([]); // State to hold patient data
    const [loading, setLoading] = useState(true); // State to handle loading state
    const [error, setError] = useState(''); // State to hold error messages
    const [visible, setVisible] = useState(false);
    const [currentAppointment, setAppointment] = useState({});
    const [selectedSlot, setSelectedSlot] = useState({
      'time':null,
      'date':null
    });


    

    const columns = useMemo(
      () => [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'patient_name', header: 'Patient Name' },
        { accessorKey: 'patient_contact', header: 'Contact Number' },
        { accessorKey: 'appointment_date', header: 'Date' },
        { accessorKey: 'appointment_time', header: 'Time' },
    
        {
          header: 'Action',
          accessorKey: 'actions', // Add a key for actions
          Cell: ({ row }) => (
            <>
            {row.original.status === 0 && ( // Show only if status is 2
                <CButton 
                  color='success'
                  onClick={() => handleEdit(row.original)}
                >
                 Accept
                </CButton>
              )}
              {row.original.status === 2 && ( // Show only if status is 2
                <CButton 
                  color='warning'
                  onClick={() => handleEdit(row.original)}
                >
                  Pending
                </CButton>
              )}
              &nbsp;
              {row.original.status !==1 &&(
              <CButton 
                color='danger'
                onClick={() => handleEdit(row.original)}
              >
                Reject
              </CButton>)}
            </>
          ),
        },
      ],
      []
    );
    

      const handleEdit = (row) => {
        console.log('Edit button clicked for:', row); // Debugging
        setVisible(true); // Open 
        setAppointment(row);
        setSelectedSlot({'date':row.appointment_date,
          'time':row.appointment_time
        })
      };

      useEffect(() => {
        const fetchPatients = async () => {
         
    
          
    
          try {
            const response = await getAPICall(`/api/test`)
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
      }, []); 

    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedSlot({ ...selectedSlot, [name]: value });

      };

    
     async function handleSchedule(id,status,data){
        const formData= {
           date: selectedSlot.date || '',
           time: selectedSlot.time|| '',
             }
      try{
        const responce= await put(`/api/appointments/${id}/${status}`,formData);
       if(responce.data.status==='1'){
        handleAcceptMsg(responce.data);
       }
       else if(responce.data.status==='2'){
        handleRescheduleMsg(responce.data);
       }

       
        
      }
       catch(error){
        alert("try again later" ,error);
        
       }

      };


      async function handleAcceptMsg(data){
       
        
        const msgData=  {
          "phone_number": `+91${data.patient_contact}`,
          "new_date": `${data.appointment_date} at ${data.appointment_time}`
        }
     try{
       const responce= await post(`/api/accept-appointment`,msgData)
     }
      catch(error){
       alert("try again later" ,error);
       
      }
      }
    
      const handleAccept = () => {
        console.log('Accepted:', formData);
      };



      async function handleRescheduleMsg(data){
       
        
        const msgData=  {
          "phone_number": `+91${data.patient_contact}`,
          "new_date": `${data.appointment_date} at ${data.appointment_time}`
        }
     try{
       const responce= await post(`/api/reschedule-appointment`,msgData)
     }
      catch(error){
       alert("try again later" ,error);
       
      }
      }
    
  return (
   
<>
<div style={{
  display: 'flex',
  flexWrap: 'wrap', // Ensures wrapping on smaller screens
  gap: '1rem', // Adds spacing between cards
  justifyContent: 'center',
}}>
  {/* Card 1 */}
  {[
    { color: 'success', textColor: 'white' },
  ].map((item, index) => (
    <CCard
      color={item.color}
      textColor={item.textColor}
    //   className="mb-0"
      style={{
        maxWidth: '25rem',
        flex: '1 1 calc(100% - 2rem)', // Cards take full width on mobile
      }}
      key={index}
    >
    <CCardTitle className='ps-3 pt-3'>Appointments</CCardTitle>

      <CCardBody>
        {/* <CCardTitle>{item.color} card title</CCardTitle> */}
        <CCardText style={{fontSize: '50px'}}>
         10
        </CCardText>
      </CCardBody>
    </CCard>
  ))}

  {/* Card 2 */}
  {[
    { color: 'danger', textColor: 'white' },
  ].map((item, index) => (
    <CCard
      color={item.color}
      textColor={item.textColor}
    //   className="mb-3"
      style={{
        maxWidth: '25rem',
        flex: '1 1 calc(100% - 2rem)', // Cards take full width on mobile
      }}
      key={index}
    >
    <CCardTitle className='ps-3 pt-3'>Pending Appointments</CCardTitle>

      <CCardBody>
        {/* <CCardTitle>{item.color} card title</CCardTitle> */}
        <CCardText style={{fontSize: '50px'}}>
          5
        </CCardText>
      </CCardBody>
    </CCard>
  ))}

  {/* Card 3 */}
  {[
    { color: 'info', textColor: 'white' },
  ].map((item, index) => (
    <CCard
      color={item.color}
      textColor={item.textColor}
    //   className="mb-3"
      style={{
        maxWidth: '25rem',
        flex: '1 1 calc(100% - 2rem)', // Cards take full width on mobile
      }}
      key={index}
    >
      <CCardTitle className='ps-3 pt-3'>Completed Appointments</CCardTitle>
      <CCardBody>
        {/* <CCardTitle>{item.color} card title</CCardTitle> */}
        <CCardText style={{fontSize: '50px'}}>
          5
        </CCardText>
      </CCardBody>
    </CCard>
  ))}
</div>

<div style={{ padding: '1rem', paddingTop: '50px' }}>
      <MantineReactTable
        columns={columns}
        data={data}
        initialState={{ density: 'compact' }}
        enableFullScreenToggle={false}
        enableDensityToggle={true}
      />
    </div>



   
    <CModal visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>Appointment Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormLabel>Patient Name</CFormLabel>
          <CFormInput name="patient_name" value={currentAppointment.patient_name} onChange={handleChange} disabled />

          <CFormLabel>Address</CFormLabel>
          <CFormInput name="patient_address" value={currentAppointment.patient_address} onChange={handleChange} disabled/>

          <CFormLabel>Contact</CFormLabel>
          <CFormInput name="patient_contact" value={currentAppointment.patient_contact} onChange={handleChange} disabled/>

          <CFormLabel>Appointment Date</CFormLabel>
          <CFormInput type="date" name="date" value={selectedSlot.date} onChange={handleChange} />

          <CFormLabel>Appointment Time</CFormLabel>
          <CFormInput type="time" name="time" value={selectedSlot.time} onChange={handleChange} />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Close
        </CButton>
        <CButton color="success"  onClick={() => handleSchedule(currentAppointment.id, 2,currentAppointment)}>Schedule</CButton>
        <CButton color="primary"  onClick={() => handleSchedule(currentAppointment.id, 1,currentAppointment)}>Accept</CButton>
      </CModalFooter>
    </CModal>





</>



 
  )
}
 


