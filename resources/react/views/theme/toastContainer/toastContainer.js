// // ToastContainer.jsx
// import React, { useRef, useState } from 'react'
// import { CToast, CToastBody, CToaster, CToastHeader } from '@coreui/react'

// const ToastContainer = ({ position = 'top-end' }) => {
//   const [toast, addToast] = useState()
//   const toaster = useRef()

//   // Show toast from anywhere
//   ToastContainer.show = (message, title = 'Notification', color = '#007aff') => {
//     addToast(
//       <CToast>
//         <CToastHeader closeButton>
//           <svg className="rounded me-2" width="20" height="20">
//             <rect width="100%" height="100%" fill={color}></rect>
//           </svg>
//           <div className="fw-bold me-auto">{title}</div>
//         </CToastHeader>
//         <CToastBody>{message}</CToastBody>
//       </CToast>
//     )
//   }

//   return (
//     <CToaster className="p-3" placement={position} push={toast} ref={toaster} />
//   )
// }
// export const showToast = (...args) => {
//     if (showToastFunction) showToastFunction(...args)
//   }

// export default ToastContainer

// views/theme/toastContainer/toastContainer.js
import React, { useRef, useState } from 'react'
import { CToast, CToastBody, CToaster, CToastHeader } from '@coreui/react'

let showToastFunction = () => {}

const ToastContainer = ({ position = 'top-end' }) => {
  const [toast, setToast] = useState()
  const toaster = useRef()

  showToastFunction = (message, title = 'Notification', color = '#007aff') => {
    setToast(
      <CToast>
        <CToastHeader closeButton>
          <svg className="rounded me-2" width="20" height="20">
            <rect width="100%" height="100%" fill={color}></rect>
          </svg>
          <div className="fw-bold me-auto">{title}</div>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>
    )
  }

  return (
    <CToaster className="p-3" placement={position} push={toast} ref={toaster} />
  )
}

export const showToast = (...args) => {
  if (showToastFunction) showToastFunction(...args)
}

export default ToastContainer
