import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilUser,
  cilLockLocked,
  cilSettings,
  cilApplications,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import avatar8 from '../../assets/images/avatars/profile.jpg'
import { getAPICall, post } from '../../../react/util/api'
// import { deleteUserData } from '../../../util/session'
import { deleteUserData, getUser } from '../../../react/util/session'
import { Link } from 'react-router-dom'


const AppHeaderDropdown = () => {

  const user = getUser();
  // console.log(user);
  

  const logout = async () => {
    try {
      // Call the logout API
      const token = localStorage.getItem('token');
      console.log(token);
      
  
      if (token) {
        await post('/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
  
      // Clear token and redirect to login page
      localStorage.removeItem('token');
      deleteUserData();
      window.location.href = '/#/login';  // Ensure redirect goes to login page
  
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

   
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem> */}
        {user && (
        <CDropdownItem disabled>
          <div className="fw-bold">{user.name}</div>
          <div className="text-muted small">{user.email}</div>
        </CDropdownItem>
      )}
        <CDropdownDivider />
        <CDropdownItem onClick={logout} href="#">
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Password</CDropdownHeader>
       
        <Link to="/resetPassword" style={{ textDecoration: 'none', color: 'inherit' }}>
          <CDropdownItem>
            <CIcon icon={cilSettings} className="me-2" />
            Password
          </CDropdownItem>
        </Link>
        <Link to="/sendEmailForResetLink" style={{ textDecoration: 'none', color: 'inherit' }}>
          <CDropdownItem>
            <CIcon icon={cilApplications} className="me-2" />
            Forgot Password
          </CDropdownItem>
        </Link>
        <CDropdownDivider />
     

      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown;
