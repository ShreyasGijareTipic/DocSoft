import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { getUser } from '../util/session'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)
  console.log("breadcrumbs",breadcrumbs);
  
const user = getUser();
console.log(user.type);


const navigate = useNavigate()

  const handleHomeClick = () => {
    if (user.type === 0) {
      navigate('/register/WhatsappClinicRegister')
    } else {
      navigate('/Dashboard2')
    }
  }


  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem  style={{ cursor: 'pointer' }}
 onClick={handleHomeClick} >Home</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
    // <></>
  )
}

export default React.memo(AppBreadcrumb)
