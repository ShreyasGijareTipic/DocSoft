import React, { useMemo, useState, useEffect } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardTitle,
  CCardText,
  CBadge,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CRow,
  CCol,
} from '@coreui/react';
import { MantineReactTable } from 'mantine-react-table';
import { getAPICall, post, put } from '../../../util/api';
 
export default function DocDashboard() {
  const [data, setData] = useState([]); // State to hold patient data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(''); // State to hold error messages
  const [visible, setVisible] = useState(false);
  const [currentAppointment, setAppointment] = useState({});
  const [selectedSlot, setSelectedSlot] = useState({
    time: null,
    date: null,
  });
  console.log(selectedSlot);
 
  const [isButtonAvailable, setIsButtonAvailable] = useState(false);
  const [availableSlot, setAvailableSlot] = useState([]);
  const [timeSlot, setTimeSlot] = useState(null);
  const [dateSlot, setDateSlot] = useState('');
 
 
  function convertTo24HourFormat(time12Hour) {
    const [time, meridian] = time12Hour.split(' '); // Split time and AM/PM
    let [hours, minutes] = time.split(':').map(Number); // Split hours and minutes
   
    if (meridian === 'PM' && hours !== 12) {
      hours += 12; // Add 12 to convert PM times
    } else if (meridian === 'AM' && hours === 12) {
      hours = 0; // Convert 12 AM to 00
    }
  //console.log(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
 
    // Return in 24-hour format
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  }
  console.log(availableSlot);
  let isAvailable=false;
 
 
  useEffect(()=>{
  if(selectedSlot.date!==null){
    const dateString = convertDateToISO(selectedSlot.date) ;
    setDateSlot(dateString); // Update state
  }
   
  },[selectedSlot]);
 
 
  useEffect(()=>{
    const availability = availableSlot.some(item => item === timeSlot);
    setIsButtonAvailable(availability); // Update state
  }, [timeSlot, availableSlot]);
  console.log(isAvailable);
  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'patient_name', header: 'Patient Name' },
      { accessorKey: 'patient_contact', header: 'Contact Number' },
      { accessorKey: 'appointment_date', header: 'Date' },
      { accessorKey: 'appointment_time', header: 'Time' },
      {
        header: 'Status',
        accessorKey: 'status',
        Cell: ({ row }) => (
          // const isAvailable = !dataArray.includes(givenData);
          <>
            {row.original.status === 0 && <CBadge color="primary">New</CBadge>}
            {row.original.status === 2 && <CBadge color="warning">Pending</CBadge>}
          </>
        ),
      },
      {
        header: 'Action',
        accessorKey: 'actions',
        Cell: ({ row }) => (
          <>
            {row.original.status === 0 && (
              <CButton color="success" onClick={() => {
                handleAvailbleAppointment(row.original.doctor_id,row.original.appointment_date);
                let time =convertTo24HourFormat(row.original.appointment_time)
                setTimeSlot(time);
                handleEdit(row.original);
              }
 
              }>
                Accept
              </CButton>
            )}
            &nbsp;
            {row.original.status !== 1 && (
              <CButton color="danger" onClick={() => handleEdit(row.original)}>
                Reject
              </CButton>
            )}
          </>
        ),
      },
    ],
    []
  );
 
  const handleEdit = (row) => {
    setVisible(true);
    setAppointment(row);
    setSelectedSlot({
      date: row.appointment_date,
      time: row.appointment_time,
    });
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedSlot({ ...selectedSlot, [name]: value });
  };
 
  const fetchPatients = async () => {
    try {
      const response = await getAPICall(`/api/test`);
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
    } finally {
      setLoading(false); // Stop loading in both success and error cases
    }
  };
 
  useEffect(() => {
    fetchPatients();
  }, []);
 
  const handleAvailbleAppointment = async (doctor_id, appointment_date) => {
    try {
      const response = await getAPICall(`/api/slotsAvailable/${doctor_id}/${appointment_date}`)
      setAvailableSlot(response);}
      catch(error){
        console.log(error);
        setAvailableSlot([]);
      }
  }
 
  const handleSchedule = async (id, status) => {
    const formData = {
      date: selectedSlot.date || '',
      time: selectedSlot.time || '',
    };
    try {
      const response = await put(`/api/appointments/${id}/${status}`, formData);
      if (response.data.status === '1') {
        handleAcceptMsg(response.data);
      } else if (response.data.status === '2') {
        handleRescheduleMsg(response.data.appointment_date,response.data.patient_contact);
      }
      else if (response.data.status === '1') {
        handleAcceptMsg(response.data.id);
      }
    } catch (error) {
      alert('Try again later', error);
    }
  };
 
  const handleAcceptMsg = async (appointmentId) => {
    // const msgData = {
    //   phone_number: `+91${data.patient_contact}`,
    //   new_date: `${data.appointment_date} at ${data.appointment_time}`,
    // };
    // try {
    //   await post(`/api/accept-appointment`, msgData);
    // } catch (error) {
    //   alert('Try again later', error);
    // }
    const msgData = {
      appointment_id:appointmentId,
    };
    try {
      await post(`/api/accept-appointment`, msgData);
    } catch (error) {
      alert('Try again later', error);
    }
 
  };
 
  const convertDateToISO = (dateString) => {
    // Split the input date string (dd-MM-yyyy)
    const [day, month, year] = dateString.split('-');
   
    // Return in yyyy-MM-dd format
    return `${year}-${month}-${day}`;
  };
 
  const handleRescheduleMsg = async (date,mobile) => {
   
    const msgData = {
      phone_number: mobile,
      appointment_date: date,
    };
    try {
      await post(`/api/reschedule-appointment`, msgData);
    } catch (error) {
      alert('Try again later', error);
    }
  };
 
  return (
    <>
      {/* Cards Section */}
      <div style={{ padding: '20px' }}>
      <CRow>
        {/* Card 1 */}
        <CCol xs="12" sm="4">
          <CCard className="card-equal-height" color="primary">
            <CCardBody>
              <CCardTitle>Appointments</CCardTitle>
              <CCardText style={{ fontSize: '50px' }}>10</CCardText>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Card 2 */}
        <CCol xs="12" sm="4">
          <CCard className="card-equal-height" color="warning">
            <CCardBody>
              <CCardTitle>Pending Appointments</CCardTitle>
              <CCardText style={{ fontSize: '50px' }}>5</CCardText>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Card 3 */}
        <CCol xs="12" sm="4">
          <CCard className="card-equal-height" color="success">
            <CCardBody>
              <CCardTitle>Completed Appointments</CCardTitle>
              <CCardText style={{ fontSize: '50px' }}>5</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
 
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
 
      {/* Modal Section */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Appointment Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Patient Name</CFormLabel>
            <CFormInput name="patient_name" value={currentAppointment.patient_name} disabled />
 
            <CFormLabel>Address</CFormLabel>
            <CFormInput name="patient_address" value={currentAppointment.patient_address} disabled />
 
            <CFormLabel>Contact</CFormLabel>
            <CFormInput name="patient_contact" value={currentAppointment.patient_contact} disabled />
 
            <CFormLabel>Appointment Date</CFormLabel>
            <CFormInput type="date" name="date" value={selectedSlot.date} onChange={handleChange} disabled/>
 
            <CFormLabel>Appointment Time</CFormLabel>
            <CFormInput type="time" name="time" value={selectedSlot.time} onChange={handleChange} disabled/>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={() => {
            handleSchedule(currentAppointment.id, 2);
          }}>
           Re-Schedule
          </CButton>
          {isButtonAvailable && (
  <CButton color="primary" onClick={() => handleSchedule(currentAppointment.id, 1)}>
    Accept
  </CButton>
)}
        </CModalFooter>
      </CModal>
    </>
  );
}
 
 