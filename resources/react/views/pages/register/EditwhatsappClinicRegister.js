// import React, { useEffect, useMemo, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { getAPICall, put } from '../../../util/api';
// import { Loader } from '@mantine/core';
// import { MantineReactTable } from 'mantine-react-table';
// import { CButton ,  CCard, CCardBody, CCardLink, CCardSubtitle, CCardText, CCardTitle, CCol, CForm, CFormInput, CImage, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/react';
// import { Alert, Button } from '@coreui/coreui';

// function EditwhatsappClinicRegister() {
//   const { id } = useParams(); // Get ID from URL
//     const [storeid, setStoreId] = useState(id);
    
// const navigate = useNavigate(); // Navigation hook
//     const [doctorData , setDoctorData] = useState([])
//    const [data, setData] = useState([]); // State to hold clinic data
//     const [loading, setLoading] = useState(true); // State to handle loading
//     const [error, setError] = useState(''); // State to handle errors
//     const [userLoading,setUserLoading]=useState(false);

//     // console.log("dhjshbdjsh",doctorData);

//     const [visible, setVisible] = useState(false);
// const [editData, setEditData] = useState({
//   id: '',
//   name: '',
//   email: '',
//   mobile: '',
//   address: '',
//   registration_number: '',
//   speciality: '',
//   education: '',
//   consulting_fee:''
// });

    

//  const columns = useMemo(
//     () => [
//       { accessorKey: 'id', header: 'ID' },
//       { accessorKey: 'registration_number', header: 'Registration Number' },
//       { accessorKey: 'name', header: 'Doctor Name' },
//       { accessorKey: 'email', header: 'Email ID' },
//       { accessorKey: 'speciality', header: 'Speciality' },
//       { accessorKey: 'education', header: 'Education' },
//       { accessorKey: 'consulting_fee', header: 'Consulting Fees' },
//      {
//              header: 'Action',
//              accessorKey: 'action',
//              Cell: ({ row }) => (
//                <>
                 
//                    <CButton className='bg-warning' 
//                    // onClick={() => setVisible(!visible)} 
//                    onClick={() => handleEdit(row.original)}
//                   >
//                      Edit
//                    </CButton>
              
//                </>
//              ),
//            },
//     ],
//     []
//   );

//   const handleEdit = (doctor) => {
//     console.log(doctor);
    
//     setEditData({
//       id: doctor.id,
//       name: doctor.name || '',
//       email: doctor.email|| '',
//       mobile: doctor.mobile || '',
//       address: doctor.address || '',
//       registration_number: doctor.registration_number || '',
//       speciality:doctor.speciality || '',
//       education: doctor.education || '',
//       consulting_fee: doctor.consulting_fee || '',
    
//     });
//     setVisible(true);
//   };
  
  

//   const handleUpdate = async () => {
    

//  try {
//     const response = await put(`/api/appUsers/${editData.id}`, {
//       name: editData.name || '',
//       email: editData.email|| '',
//       mobile: editData.mobile || '',
//       address: editData.address || '',
//       registration_number: editData.registration_number || '',
//       speciality:editData.speciality || '',
//       education: editData.education || '',
//       consulting_fee: editData.consulting_fee || '',
//     });

//     console.log('Doctor updated:', response.data);
//     setVisible(false);
//     fetchPatients();
//     // Optionally refresh table or show success toast
//   } catch (error) {
//     console.error('Update failed:', error);
//     // Optionally show error toast
//   }

//   };
  


//   // Fetch data when the component mounts
//   useEffect(() => {
//     const fetchClinics = async () => {
//       try {
//         const response = await getAPICall(`/api/clinic/${id}`);
//         console.log('Fetched Clinic Data:', response);
//         setData(response); // Set data
//         const response1 = await getAPICall(`/api/showdoctordatabyclinicid/${id}`);
//         console.log("gdhshdshgvh",response1);
//         if(response1.error){
//             setUserLoading(true);
//         }
//         else{
//             setUserLoading(false);
//             setDoctorData(response1)
    
//         }
        
        
    
//       } catch (error) {
//         if (error.response) {
//           setError(`Error: ${error.response.statusText}`);
//         } else if (error.request) {
//           setError('No response from server.');
//         } else {
//           setError('Error: ' + error.message);
//         }
//       } finally {
//         setLoading(false); // Stop loading
//       }
//     };
//     fetchClinics();
//   }, []);


//   const handleRegister = () =>{

//     navigate(`/register/Register/${storeid}`);
//   }

//   const handleEditInfo = () =>{

//     navigate(`/register/EditWhatsappClinicInfo/${storeid}`);

//   }


//   return (
//     <>
//     {/* <div>
//       <h1 className='text-center'>{data.clinic_name}</h1>
//       <p>Editing Clinic ID: {id}</p>
   
//     </div> */}


//     <CCard style={{ width: '100%' }} className='justify-between'>
//     <CCardBody>
//     <CRow className="align-items-center"> {/* Flex container */}
//       {/* Left side - Logo */}
//       <CCol md={2}> {/* Adjust size as needed */}
//         <CImage
//           src={data.logo}
//           alt="Clinic Logo"
//           width={100}
//           height={100}
//           style={{ objectFit: 'contain', borderRadius: '5px' }}
//           className=""
//         />
//       </CCol>

//       {/* Middle side - Information */}
//       <CCol md={3}> {/* Adjust size as needed */}
//         <CCardTitle>Clinic Name: {data.clinic_name}</CCardTitle>
//         <CCardSubtitle className="mb-2 text-body-secondary">
//           Registration No.: {data.clinic_registration_no}
//         </CCardSubtitle>
//         <CCardText>
//           <CCardSubtitle className="mb-2 text-body-secondary">
//             Address: {data.clinic_address}
//           </CCardSubtitle>
//           <CCardSubtitle className="mb-2 text-body-secondary">
//             Contact No.: {data.clinic_mobile}
//           </CCardSubtitle>
//         </CCardText>
//       </CCol>

//     {/* Right side - Information */}
//       <CCol md={7}> {/* Adjust size as needed */}
        
//         <CCardSubtitle className="mb-2 text-body-secondary">
//           Whatsapp No. : {data.clinic_whatsapp_mobile}
//         </CCardSubtitle>
//         <CCardText>
//           <CCardSubtitle className="mb-2 text-body-secondary">
//             Whatsapp API url : {data.clinic_whatsapp_url}
//           </CCardSubtitle>
//           <CCardSubtitle className="mb-2 text-body-secondary">
//           webhook Tokan : {data.clinic_webhook_tokan}
//           </CCardSubtitle>
//         </CCardText>
//       </CCol>
//     </CRow>
//   </CCardBody>

//     </CCard><br/>



//     <div>
//     <CButton color="primary" onClick={handleRegister}>Create New Doctor</CButton>&nbsp;&nbsp;
//     <CButton color="secondary" onClick={handleEditInfo}>Edit Clinic Info</CButton>
//     </div><br/>



// {loading && <Loader />} {/* Show loader */}
// {/* {error && <Alert color="red">{error}</Alert>} Show error */}
// {!userLoading && (
//   <MantineReactTable
//     columns={columns}
//     data={doctorData}
//     initialState={{ density: 'compact' }}
//     enableFullScreenToggle={false}
//     enableDensityToggle={true}
//   />
// )
// }




// <CModal visible={visible} onClose={() => setVisible(false)}>
//   <CModalHeader>
//     <CModalTitle>Edit Doctor</CModalTitle>
//   </CModalHeader>
//   <CModalBody>
//     <CForm>
//       <CFormInput
//         label="Name"
//         value={editData.name}
//         onChange={(e) => setEditData({ ...editData, name: e.target.value })}
//       />
//       <CFormInput
//         label="Email"
//         type="email"
//         value={editData.email}
//         onChange={(e) => setEditData({ ...editData, email: e.target.value })}
//       />
//       <CFormInput
//         label="Mobile"
//         value={editData.mobile}
//         onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
//       />
//       <CFormInput
//         label="Address"
//         value={editData.address}
//         onChange={(e) => setEditData({ ...editData, address: e.target.value })}
//       />
//       <CFormInput
//         label="Registration Number"
//         value={editData.registration_number}
//         onChange={(e) => setEditData({ ...editData, registration_number: e.target.value })}
//       />
//       <CFormInput
//         label="Speciality"
//         value={editData.speciality}
//         onChange={(e) => setEditData({ ...editData, speciality: e.target.value })}
//       />
//       <CFormInput
//         label="Education"
//         value={editData.education}
//         onChange={(e) => setEditData({ ...editData, education: e.target.value })}
//       />
//         <CFormInput
//         label="Consulting Fee"
//         value={editData.consulting_fee}
//         onChange={(e) => setEditData({ ...editData, consulting_fee: e.target.value })}
//       />
//     </CForm>
//   </CModalBody>
//   <CModalFooter>
//     <CButton color="secondary" onClick={() => setVisible(false)}>
//       Cancel
//     </CButton>
//     <CButton color="primary" onClick={handleUpdate}>
//       Save Changes
//     </CButton>
//   </CModalFooter>
// </CModal>




// </>
//   );
// }

// export default EditwhatsappClinicRegister;









import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAPICall, put } from '../../../util/api';
import { Loader, Switch } from '@mantine/core';
import { MantineReactTable } from 'mantine-react-table';
import { CButton ,  CCard, CCardBody, CCardLink, CCardSubtitle, CCardText, CCardTitle, CCol, CForm, CFormInput, CImage, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow , CContainer} from '@coreui/react';
import { Alert, Button } from '@coreui/coreui';
import { FaUserMd, FaClinicMedical } from 'react-icons/fa';

function EditwhatsappClinicRegister() {
  const { id } = useParams(); // Get ID from URL
    const [storeid, setStoreId] = useState(id);

    useEffect(() => {
      if (location.state?.updated) {
        fetchClinics();
      }
    }, [location.state]);
    
const navigate = useNavigate(); // Navigation hook
    const [doctorData , setDoctorData] = useState([])
   const [data, setData] = useState([]); // State to hold clinic data
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(''); // State to handle errors
    const [userLoading,setUserLoading]=useState(false);

    // console.log("dhjshbdjsh",doctorData);

    const [visible, setVisible] = useState(false);
const [editData, setEditData] = useState({
  id: '',
  name: '',
  email: '',
  mobile: '',
  address: '',
  registration_number: '',
  speciality: '',
  education: '',
  consulting_fee:''
});

    

 const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'registration_number', header: 'Registration Number' },
      { accessorKey: 'name', header: 'Doctor Name' },
      { accessorKey: 'email', header: 'Email ID' },
      { accessorKey: 'speciality', header: 'Speciality' },
      { accessorKey: 'education', header: 'Education' },
      { accessorKey: 'consulting_fee', header: 'Consulting Fees' },
      { 
        accessorKey: 'type', 
        header: 'Role',
        Cell: ({ cell }) => {
          const type = cell.getValue();
          return type === 1 ? 'Doctor' : type === 2 ? 'Receptionist' : 'Unknown';
        }
      },
     {
             header: 'Action',
             accessorKey: 'action',
             Cell: ({ row }) => (
               <>
                 
                   <CButton className='bg-warning' 
                   // onClick={() => setVisible(!visible)} 
                   onClick={() => handleEdit(row.original)}
                  >
                     Edit
                   </CButton>
              
               </>
             ),
           },

           {
            header: 'Active',
            accessorKey: 'blocked',
            Cell: ({ row }) => {
              const isBlocked = row.original.blocked === 1;
        
              return (
                <Switch
                  size="sm"
                  color="green"
                  checked={!isBlocked}
                  onChange={() => handleToggleActive(row.original)}
                  label={!isBlocked ? 'Active' : 'Blocked'}
                />
              );
            },
          },
        
    ],
    []
  );

  const handleEdit = (doctor) => {
    console.log(doctor);
    
    setEditData({
      id: doctor.id,
      name: doctor.name || '',
      email: doctor.email|| '',
      mobile: doctor.mobile || '',
      address: doctor.address || '',
      registration_number: doctor.registration_number || '',
      speciality:doctor.speciality || '',
      education: doctor.education || '',
      consulting_fee: doctor.consulting_fee || '',
    
    });
    setVisible(true);
  };
  
  

  const handleUpdate = async () => {
    

 try {
    const response = await put(`/api/appUsers/${editData.id}`, {
      name: editData.name || '',
      email: editData.email|| '',
      mobile: editData.mobile || '',
      address: editData.address || '',
      registration_number: editData.registration_number || '',
      speciality:editData.speciality || '',
      education: editData.education || '',
      consulting_fee: editData.consulting_fee || '',
    });

    console.log('Doctor updated:', response.data);
    setVisible(false);
    fetchClinics();
    // Optionally refresh table or show success toast
  } catch (error) {
    console.error('Update failed:', error);
    // Optionally show error toast
  }

  };
  

  // Block and Unblock
  const handleToggleActive = async (doctor) => {
    const updatedDoctor = {
      ...doctor,
      blocked: doctor.blocked === 1 ? 0 : 1, // Toggle block status
    };
  
    console.log('Updated Doctor Block Status:', updatedDoctor);
  
    try {
      await put(`/api/blockedUser/${updatedDoctor.id}`, {
        blocked: updatedDoctor.blocked,
      });
  
      // Refresh data after update
      fetchClinics();
    } catch (error) {
      console.error('Failed to update doctor status:', error);
    }
  };
  
  


  // Fetch data when the component mounts
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await getAPICall(`/api/clinic/${id}`);
        console.log('Fetched Clinic Data:', response);
        setData(response); // Set data
        const response1 = await getAPICall(`/api/showdoctordatabyclinicid/${id}`);
        console.log("gdhshdshgvh",response1);
        if(response1.error){
            setUserLoading(true);
        }
        else{
            setUserLoading(false);
            setDoctorData(response1)
    
        }
        
        
    
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


  const handleRegister = () =>{

    navigate(`/register/Register/${storeid}`);
  }

  const handleEditInfo = () =>{

    navigate(`/register/EditWhatsappClinicInfo/${storeid}`);

  }

  return (

<>

    <CContainer fluid className="p-0 bg-light min-vh-100">
    

      <CCard className="shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
        <CCardBody>
          <CRow className="align-items-center g-4">
            <CCol xs={12} md={2} className="text-center">
              <CImage
                src={data?.logo}
                alt="Clinic Logo"
                width={100}
                height={100}
                className="rounded shadow-sm"
                style={{ objectFit: 'cover' }}
              />
            </CCol>
            <CCol xs={12} md={6}>
              <CCardTitle className="fw-bold fs-4 text-dark d-flex align-items-center gap-2">
                <FaClinicMedical className="text-info" /> Clinic Name: {data?.clinic_name}
              </CCardTitle>
              <CCardText className="text-muted small mt-2">
                <strong>Registration No.:</strong> {data?.clinic_registration_no} <br />
                <strong>Address:</strong> {data?.clinic_address} <br />
                <strong>Contact No.:</strong> {data?.clinic_mobile}
              </CCardText>
            </CCol>
            <CCol xs={12} md={4}>
              <CCardText className="text-muted small">
                <strong>Whatsapp No.:</strong> {data?.clinic_whatsapp_mobile || '-'} <br />
                <strong>Whatsapp API URL:</strong> {data?.clinic_whatsapp_url || '-'} <br />
                <strong>Webhook Token:</strong> {data?.clinic_webhook_tokan || '-'}
              </CCardText>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <CButton color="primary" onClick={handleRegister} className="px-4">
          <FaUserMd className="me-2" /> Create New Doctor
        </CButton>
        <CButton color="dark" variant="outline" onClick={handleEditInfo} className="px-4">
          ✏️ Edit Clinic Info
        </CButton>
      </div>

      <CCard className="shadow-sm border-0 rounded-4 p-3 bg-white">
        <CCardBody>
          {/* <MantineReactTable
            columns={columns || []}
            data={doctorData || []}
            initialState={{ density: 'compact' }}
            enableFullScreenToggle={false}
            enableDensityToggle={true}
            mantineTableBodyRowProps={{ striped: true, highlightOnHover: true }}
            mantineTableHeadCellProps={{ style: { backgroundColor: '#f8f9fa', fontWeight: 600 } }}
            mantinePaperProps={{ shadow: 'xs', radius: 'md' }}
          /> */}
          <MantineReactTable
  columns={columns || []}
  data={doctorData || []}
  initialState={{ density: 'compact' }}
  enableFullScreenToggle={false}
  enableDensityToggle={true}
  mantineTableBodyRowProps={{
    striped: true,
    highlightOnHover: true,
  }}
  mantineTableBodyCellProps={{
    style: { padding: '20px 8px' }, // Top/Bottom: 2px, Left/Right: 8px
  }}
  mantineTableHeadCellProps={{ style: { backgroundColor: '#f8f9fa', fontWeight: 600 } }}
  mantinePaperProps={{ shadow: 'xs', radius: 'md' }}
/>

        </CCardBody>
      </CCard>
    </CContainer>


  <CModal visible={visible} onClose={() => setVisible(false)}>
  <CModalHeader>
    <CModalTitle>Edit Doctor</CModalTitle>
  </CModalHeader>
  <CModalBody>
    <CForm>
      <CFormInput
        label="Name"
        value={editData.name}
        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
      />
      <CFormInput
        label="Email"
        type="email"
        value={editData.email}
        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
      />
      <CFormInput
        label="Mobile"
        value={editData.mobile}
        onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
      />
      <CFormInput
        label="Address"
        value={editData.address}
        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
      />
      <CFormInput
        label="Registration Number"
        value={editData.registration_number}
        onChange={(e) => setEditData({ ...editData, registration_number: e.target.value })}
      />
      <CFormInput
        label="Speciality"
        value={editData.speciality}
        onChange={(e) => setEditData({ ...editData, speciality: e.target.value })}
      />
      <CFormInput
        label="Education"
        value={editData.education}
        onChange={(e) => setEditData({ ...editData, education: e.target.value })}
      />
        <CFormInput
        label="Consulting Fee"
        value={editData.consulting_fee}
        onChange={(e) => setEditData({ ...editData, consulting_fee: e.target.value })}
      />
    </CForm>
  </CModalBody>
  <CModalFooter>
    <CButton color="secondary" onClick={() => setVisible(false)}>
      Cancel
    </CButton>
    <CButton color="primary" onClick={handleUpdate}>
      Save Changes
    </CButton>
  </CModalFooter>
</CModal>

</>


  );
};

export default EditwhatsappClinicRegister;
