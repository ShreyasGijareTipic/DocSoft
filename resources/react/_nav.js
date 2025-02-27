import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUserPlus,
  cilStorage,
  cilHome,
  cilHospital,
  cilMedicalCross,
  cilAvTimer,
  cilPlaylistAdd,
  cilListRich,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle,  } from '@coreui/react'

const _nav = [


  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/Dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    
  },
  {
    component: CNavItem,
    name: 'Create Bill',
    to: '/Bills',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    
  },
  {
    component: CNavItem,
    name: 'Create Prescription',
    to: '/Prescription',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    
  },
  {
    component: CNavItem,
    name: 'Patients',
    to: '/Patient',
    icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
  }, 
  {
    component: CNavItem,
    name: 'Bills',
    to: '/Billstable',
    icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Add Medicines',
    to: '/Medicines',
    icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Medicines',
    to: '/MedicinesShow',
    icon: <CIcon icon={cilPlaylistAdd} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Time Slots',
    to: '/Timeslots',
    icon: <CIcon icon={cilAvTimer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Clinic Register',
    to: '/register/ClinicRegister',
    icon: <CIcon icon={cilHospital} customClassName="nav-icon" />,
    
  },
  // {
  //   component: CNavItem,
  //   name: 'User Register',
  //   to: '/register/Register',
  //   icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    
  // },
  {
    component: CNavItem,
    name: 'Clinics',
    to: '/register/WhatsappClinicRegister',
    icon: <CIcon icon={cilHospital} customClassName="nav-icon" />,
    
  },
  {
    component: CNavItem,
    name: 'Tokan',
    to: '/PatientTokanForm',
    icon: <CIcon icon={cilHospital} customClassName="nav-icon" />,
    
  },
  
  
 
 
]

export default _nav
