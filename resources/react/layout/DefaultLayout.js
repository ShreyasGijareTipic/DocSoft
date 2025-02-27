


import React, { useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from 'resources/react/components/index'
import { Router, useNavigate } from 'react-router-dom'
// import { isLogIn } from '../../util/session'
import { isLogIn } from '../../react/util/session'
import AppBreadcrumb from '../components/AppBreadcrumb'


const DefaultLayout = () => {

  useEffect(() => {
    if (!isLogIn()) {
      navigate('/login')
    }
  }, [])

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        
        <div className="body flex-grow-1">
          <div className='ps-5 text-text-decoration-none'>
         <AppBreadcrumb /><br/>
         </div>
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
