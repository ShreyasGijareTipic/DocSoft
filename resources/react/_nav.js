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
import { getUser } from './util/session';





// const _nav = [


//   {
//     component: CNavItem,
//     name: 'Dashboard',
//     to: '/Dashboard2',
//     icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    
//   },
//   {
//     component: CNavItem,
//     name: 'Create Bill',
//     to: '/Bills',
//     icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    
//   },
//   // {
//   //   component: CNavItem,
//   //   name: 'Create Prescription',
//   //   to: '/Prescription',
//   //   icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    
//   // },
//   {
//     component: CNavItem,
//     name: 'Patients',
//     to: '/Patient',
//     icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
//   }, 
//   {
//     component: CNavItem,
//     name: 'Bills',
//     to: '/Billstable',
//     icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
//   },
//   {
//     component: CNavItem,
//     name: 'Add Medicines',
//     to: '/Medicines',
//     icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
//   },
//   {
//     component: CNavItem,
//     name: 'Medicines',
//     to: '/MedicinesShow',
//     icon: <CIcon icon={cilPlaylistAdd} customClassName="nav-icon" />,
//   },
//   {
//     component: CNavItem,
//     name: 'Time Slots',
//     to: '/Timeslots',
//     icon: <CIcon icon={cilAvTimer} customClassName="nav-icon" />,
//   },
//   {
//     component: CNavItem,
//     name: 'Clinic Register',
//     to: '/register/ClinicRegister',
//     icon: <CIcon icon={cilHospital} customClassName="nav-icon" />,
    
//   },
//   // {
//   //   component: CNavItem,
//   //   name: 'User Register',
//   //   to: '/register/Register',
//   //   icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    
//   // },
//   {
//     component: CNavItem,
//     name: 'Clinics',
//     to: '/register/WhatsappClinicRegister',
//     icon: <CIcon icon={cilHospital} customClassName="nav-icon" />,
    
//   },
//   {
//     component: CNavItem,
//     name: 'Token',
//     to: '/PatientTokanForm',
//     icon: <CIcon icon={cilHospital} customClassName="nav-icon" />,
    
//   },
  
  
 
 
// ]

// export default _nav



const getNavigation = () => {
  const user = getUser();
  
  console.log("User data in getNavigation:", user); // Debugging log
 
   if (!user) {
     console.warn("User is not defined. Returning default navigation.");
     return [];
   }
 
   let navigation=[];
   if(user?.type===0){
     navigation=[
      { 
            component: CNavItem,
            name: 'Clinics',
            to: '/register/WhatsappClinicRegister',
            icon: <CIcon icon={cilHospital} customClassName="nav-icon" />,
            
          },
          
          {
                component: CNavItem,
                name: 'Clinic Register',
                to: '/register/ClinicRegister',
                icon: <CIcon icon={cilHospital} customClassName="nav-icon" />,
                
           },

           {
            component: CNavItem,
            name: 'Plans',
            to: '/plans',
            icon: <CIcon icon={cilHospital} customClassName="nav-icon" />,
          },

     ]
   }
   else if(user?.type===1){
    navigation=[

      {
            component: CNavItem,
            name: 'Dashboard',
            to: '/Dashboard2',
            icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
            
          },
          {
            component: CNavItem,
            name: 'Create Bill',
            to: '/Bills',
            icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
            
          },
          // {
          //   component: CNavItem,
          //   name: 'Create Prescription',
          //   to: '/Prescription',
          //   icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
            
          // },
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
                name: 'Token',
                to: '/PatientTokanForm',
                icon: <CIcon icon={cilHospital} customClassName="nav-icon" />,
                
              },

    ]
   }
   else if(user?.type===2){
    navigation=[
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/Dashboard2',
        icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
        
      },
      {
        component: CNavItem,
        name: 'Token',
        to: '/PatientTokanForm',
        icon: <CIcon icon={cilHospital} customClassName="nav-icon" />,
        
      },

    ]
   }

   else{
    alert("You are not aloowed")
  }
   return navigation;
  };
  export default getNavigation;