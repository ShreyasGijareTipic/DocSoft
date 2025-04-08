import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
// import { login } from '../../../util/api';
import { getUser, isLogIn, storeUserData } from '../../../util/session';
import { login } from '../../../util/api';
// import { isLogIn, storeUserData } from '../../../util/session';
import symbol from '../../../../react/assets/images/logo.png'
import bg from '../../../../react/assets/images/bg.jpeg'



const Login = () => {
  const [errorMessage, setErrorMessage] = useState();
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const userNameRef = useRef();
  const userPwdRef = useRef();

  useEffect(() => {
    if (isLogIn()) {
      navigate('/Bills');
    }
  }, [navigate]);




//   const handleLogin = async (event) => {
//     const form = event.currentTarget;
//     event.preventDefault();
//     event.stopPropagation();
//     if (form.checkValidity() !== true) {
//         console.log('Invalid');
//         setValidated(true);
//         return;
//     }
//     setValidated(true);
//     const email = userNameRef.current?.value;
//     const password = userPwdRef.current?.value;
//     console.log(userPwdRef.current?.value);
//     try {
//         const resp = await login({ email, password });
//         setErrorMessage(resp.message);
//         console.log(resp.message);
//         if(resp.message!=='User not allowed. Kindly contact admin.')
//         {navigate('/invoice');}
//     } catch (error) {
//         console.log(error.status);
//         setErrorMessage('Please Provide Valid Credentials');
//     }
// };

// const user = getUser();


// const handleLogin = async (event) => {
//   const form = event.currentTarget;
//   event.preventDefault();
//   event.stopPropagation();

//   // Validate the form
//   if (form.checkValidity() !== true) {
//     console.log('Invalid');
//     setValidated(true);
//     return;
//   }

//   setValidated(true);
//   const email = userNameRef.current?.value;
//   const password = userPwdRef.current?.value;

//   try {
//     // Call login function, which returns the response with the token
//     const resp = await login({ email, password });
//     console.log('XYZ',resp);
    
    
//     // Check if user is blocked
//     if (resp.blocked) {
//       setErrorMessage(resp.message);
//     } else {
//       // Store token in local storage
//       if (resp.token) {
//         localStorage.setItem('token', resp.token);
//         console.log("Token stored:", resp.token); // Store the token
//       }

//       // Store doctorId in localStorage if it's part of the response
//       // if (resp.user && resp.user.id) {
//       //   localStorage.setItem('doctorId', resp.user.id); // Store the doctor's ID
//       //   console.log('d id stored',resp.user.id);
//       //   console.log('doctor id stored',resp.user.id);
//       // }


//       if (resp && resp.doctorId) {
//         localStorage.setItem('doctorId', resp.doctorId); // Store doctorId in localStorage
//         console.log('Doctor ID stored in localStorage:', resp.doctorId);
//     } else {
//         console.log('Doctor ID not found in response:', resp);
//     }
    






//       // Store any additional user data if needed
//       storeUserData(resp); // Assume storeUserData handles any user data

//       // Navigate to the next page (e.g., /theme/bills)
//       navigate('/Bills');
//     }
//   } catch (error) {
//     // Set error message if login fails
//     setErrorMessage('Please provide valid email and password');
//   }
 
// };



const handleLogin = async (event) => {
  const form = event.currentTarget;
  event.preventDefault();
  event.stopPropagation();

  // Validate the form
  if (form.checkValidity() !== true) {
    console.log('Invalid');
    setValidated(true);
    return;
  }

  setValidated(true);
  const email = userNameRef.current?.value;
  const password = userPwdRef.current?.value;

  try {
    // Call login function, which returns the response with the token
    const resp = await login({ email, password });
    console.log('Login Response:', resp);

    // Check if user is blocked
    if (resp.blocked) {
      setErrorMessage(resp.message);
      return;
    }

    // Store token in local storage
    if (resp.token) {
      localStorage.setItem('token', resp.token);
      console.log("Token stored:", resp.token);
    }

    // Store doctorId in localStorage if it's part of the response
    if (resp.doctorId) {
      localStorage.setItem('doctorId', resp.doctorId);
      console.log('Doctor ID stored:', resp.doctorId);
    } else {
      console.log('Doctor ID not found in response:', resp);
    }

    // Store additional user data
    storeUserData(resp); 

    // Navigation based on user type
    if (resp?.user?.type === 0) {
      navigate('/register/WhatsappClinicRegister');  // Navigate to Dashboard if userType = 0
    } else if (resp?.user?.type === 1) {
      navigate('/Bills');      // Navigate to Bills if userType = 1
    }
    else if (resp?.user?.type === 2) {
      navigate('/PatientTokanForm');      // Navigate to Bills if userType = 1
    } else {
      setErrorMessage("Invalid user type. Please contact support.");
    }

  } catch (error) {
    // Set error message if login fails
    setErrorMessage('Please provide valid email and password');
  }
};


  



  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center"
  style={{
    backgroundImage: `url(${bg})`,
    backgroundSize: 'cover',  // Ensures the image covers the entire screen
    backgroundPosition: 'center center',  // Ensures the image is centered
    backgroundAttachment: 'fixed',  // Keeps the background fixed when scrolling
    height: '100vh'  // Ensures full viewport height
  }}>
      <CContainer >
        <CRow className="justify-content-center"  >
          <CCol md={6}>
            <CCardGroup  >
              <CCard className="p-4 " style={{background:'transparent', border: 'none'}}>
                <CCardBody className="pt-0">
                  <CForm className=" border-collapse" noValidate={true} validated={validated} onSubmit={handleLogin}>
                    <CRow >
                    <CCol xs={8} style={{paddingTop:'45px'}}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    </CCol>
                    <CCol xs={4} >
                    <img src={symbol} alt="Description of image" className='mb-0' style={{ width: '100%', height: '100%',  }} />
                    </CCol>
                    </CRow>
                    
                    <CInputGroup className="mb-5">
                      {/* <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText> */}
                      <CFormInput 
                      style={{
                        background: 'transparent', 
                        color: 'black', 
                        border: '1px solid black', // Adds a border around the input
                        borderRadius: '4px', // Optional: makes the border slightly rounded
                        padding: '10px',
                        // Optional: adds padding inside the input field
                      }}
                        ref={userNameRef}
                        id="username"
                        placeholder="Username"
                        autoComplete="username"
                        feedbackInvalid="Please provide username."
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-5">
                      {/* <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText> */}
                      <CFormInput
                       style={{
                        background: 'transparent', 
                        color: 'black', 
                        border: '1px solid black', // Adds a border around the input
                        borderRadius: '4px', // Optional: makes the border slightly rounded
                        padding: '10px',
                        // Optional: adds padding inside the input field
                      }}
                        ref={userPwdRef}
                        id="password"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        feedbackInvalid="Please provide password."
                        required
                      />
                    </CInputGroup>

                    {errorMessage && (
                      <CRow className="mb-1 mt-1">
                        <CAlert color="danger">{errorMessage}</CAlert>
                      </CRow>
                    )}
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" type="submit" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
