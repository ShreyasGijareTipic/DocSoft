import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAPICall } from '../../../util/api';
import { Loader } from '@mantine/core';
import { MantineReactTable } from 'mantine-react-table';
import { CButton ,  CCard, CCardBody, CCardLink, CCardSubtitle, CCardText, CCardTitle, CCol, CImage, CRow } from '@coreui/react';
import { Alert } from '@coreui/coreui';

function EditwhatsappClinicRegister() {
  const { id } = useParams(); // Get ID from URL
    const [storeid, setStoreId] = useState(id);
    
const navigate = useNavigate(); // Navigation hook
    const [doctorData , setDoctorData] = useState([])
   const [data, setData] = useState([]); // State to hold clinic data
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(''); // State to handle errors
    const [userLoading,setUserLoading]=useState(false);

    console.log("dhjshbdjsh",doctorData);
    

 const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'registration_number', header: 'Registration Number' },
      { accessorKey: 'name', header: 'Doctor Name' },
      { accessorKey: 'email', header: 'Email ID' },
      { accessorKey: 'speciality', header: 'Speciality' },
      { accessorKey: 'education', header: 'Education' },
      
    ],
    []
  );


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
    {/* <div>
      <h1 className='text-center'>{data.clinic_name}</h1>
      <p>Editing Clinic ID: {id}</p>
   
    </div> */}


    <CCard style={{ width: '100%' }} className='justify-between'>
    <CCardBody>
    <CRow className="align-items-center"> {/* Flex container */}
      {/* Left side - Logo */}
      <CCol md={2}> {/* Adjust size as needed */}
        <CImage
          src={data.logo}
          alt="Clinic Logo"
          width={100}
          height={100}
          style={{ objectFit: 'contain', borderRadius: '5px' }}
          className=""
        />
      </CCol>

      {/* Middle side - Information */}
      <CCol md={3}> {/* Adjust size as needed */}
        <CCardTitle>Clinic Name: {data.clinic_name}</CCardTitle>
        <CCardSubtitle className="mb-2 text-body-secondary">
          Registration No.: {data.clinic_registration_no}
        </CCardSubtitle>
        <CCardText>
          <CCardSubtitle className="mb-2 text-body-secondary">
            Address: {data.clinic_address}
          </CCardSubtitle>
          <CCardSubtitle className="mb-2 text-body-secondary">
            Contact No.: {data.clinic_mobile}
          </CCardSubtitle>
        </CCardText>
      </CCol>

    {/* Right side - Information */}
      <CCol md={7}> {/* Adjust size as needed */}
        
        <CCardSubtitle className="mb-2 text-body-secondary">
          Whatsapp No. : {data.clinic_whatsapp_mobile}
        </CCardSubtitle>
        <CCardText>
          <CCardSubtitle className="mb-2 text-body-secondary">
            Whatsapp API url : {data.clinic_whatsapp_url}
          </CCardSubtitle>
          <CCardSubtitle className="mb-2 text-body-secondary">
          webhook Tokan : {data.clinic_webhook_tokan}
          </CCardSubtitle>
        </CCardText>
      </CCol>
    </CRow>
  </CCardBody>

    </CCard><br/>



    <div>
    <CButton color="primary" onClick={handleRegister}>Create New Doctor</CButton>&nbsp;&nbsp;
    <CButton color="secondary" onClick={handleEditInfo}>Edit Clinic Info</CButton>
    </div><br/>



{loading && <Loader />} {/* Show loader */}
{/* {error && <Alert color="red">{error}</Alert>} Show error */}
{!userLoading && (
  <MantineReactTable
    columns={columns}
    data={doctorData}
    initialState={{ density: 'compact' }}
    enableFullScreenToggle={false}
    enableDensityToggle={true}
  />
)
}





</>
  );
}

export default EditwhatsappClinicRegister;
