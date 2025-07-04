import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate, BrowserRouter  } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import AppBreadcrumb from './components/AppBreadcrumb'
import ToastContainer from './views/theme/toastContainer/toastContainer'
// import EditWhatsappClinicRegister from './views/pages/register/EditwhatsappClinicRegister'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const ClinicRegister = React.lazy(() => import('./views/pages/register/ClinicRegister'))
const WhatsappClinicRegister = React.lazy(() => import('./views/pages/register/WhatsappClinicRegister'))
const EditWhatsappClinicRegister = React.lazy(() => import('./views/pages/register/EditwhatsappClinicRegister'))

// const ToastContainer = React.lazy(() => import('./views/theme/toastContainer/toastContainer'))
const SendResetLink = React.lazy(() => import('./views/pages/password/ResetLink'))
const Updatepassword = React.lazy(() => import('./views/pages/password/Updatepassword'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <HashRouter>


      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        {/* <AppBreadcrumb /> */}
        <Routes>
          {/* Redirect from root to login */}
          <Route exact path="/" element={<Navigate to="/login" />} /> 

          {/* Login and Register Routes */}
          <Route exact path="/login" name="Login Page" element={<Login />} /> 
          {/* <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/clinicRegister" name="Clinic Register Page" element={<ClinicRegister />} />
          <Route exact path="/whatsappClinicRegister" name="Whatsapp Clinic Register Page" element={<WhatsappClinicRegister />} /> */}
          
          {/* Error Pages */}
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          
          {/* Fallback to Default Layout */}
          <Route path="*" name="Home" element={<DefaultLayout />} />

              {/* Forget Password  */}
            <Route exact path="/updatepassword" name="Update password" element={<Updatepassword/>} />
          <Route exact path="/sendEmailForResetLink" name="Send Reset Link" element={<SendResetLink />} />  
        
        </Routes>
        <ToastContainer/>
      </Suspense>
    </HashRouter>
  )
}

export default App
