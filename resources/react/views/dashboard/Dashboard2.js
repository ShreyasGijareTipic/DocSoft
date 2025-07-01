// import React, { useEffect, useState } from 'react';
// import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CCard, CAlert, CCol, CRow, CButton } from '@coreui/react';
// import { getAPICall, post} from '../../util/api';
// import CIcon from '@coreui/icons-react';
// import { cilChatBubble, cilPhone } from '@coreui/icons';
// import { getUser } from '../../util/session';

// const Dashboard = () => {
//   const [tokens, setTokens] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const [selectedToken, setSelectedToken] = useState(null);
//   const [selectedTokens, setSelectedTokens] = useState([]);
//   const company = getUser()?.company_info?.company_name || 'Clinic';

//   useEffect(() => {
//     const loadTokens = async () => {
//       try {
//         const response = await getAPICall('/api/todays-tokans');
//         console.log("Tokens API Response:", response);
  
//         if (response.success && Array.isArray(response.data)) {
//           const tokensData = response.data;
  
//           const enrichedTokens = await Promise.all(
//             tokensData.map(async (token) => {
//               try {
//                 const patientResponse = await getAPICall(`/api/patients/${token.patient_id}`); 
//                 // patientResponse = await getAPICall(`/api/loggedDrPatient`);
//                 const doctorResponse = await getAPICall(`/api/users/${token.doctor_id}`);
//                 console.log("patientResponse",patientResponse);
                
  
//                 return {
//                   ...token,
//                   patient_name: patientResponse?.name || 'Unknown',
//                   patient_phone: patientResponse?.phone || patientResponse?.mobile || '',
//                   doctor_name: doctorResponse?.name || 'Unknown',
//                 };
//               } catch (error) {
//                 console.error(`Error fetching details for token ${token.id}:`, error);
//                 return { 
//                   ...token, 
//                   patient_name: 'Unknown', 
//                   doctor_name: 'Unknown',
//                   patient_phone: ''
//                 };
//               }
//             })
//           );
  
//           setTokens(enrichedTokens);
//         } else {
//           console.error('Failed to fetch tokens:', response.message);
//         }
//       } catch (error) {
//         console.error('Error fetching tokens:', error);
//       }
//     };
  
//     loadTokens();
//   }, []);

// // -----------------------------------------------------
//   // Search Box 
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchText(value);
  
//     if (value.trim() === '') {
//       setSelectedTokens([]);
//       return;
//     }
  
//     const filteredTokens = tokens.filter((token) =>
//       token.patient_name.toLowerCase().includes(value.toLowerCase())
//     );
  
//     setSelectedTokens(filteredTokens); // Store all matches
//   };
  
// // ----------------------------------------------------

//   const updateStatus = async (tokanNumber, newStatus) => {
//     try {
//       const response = await post('/api/update-token-status', {
//         tokan_number: tokanNumber, // Send tokan_number instead of tokan_id
//         status: newStatus,
//       });
//       console.log(response);
      
      
//       if (response.success) {
//         setTokens(tokens.map(token => 
//           token.tokan_number === tokanNumber ? { ...token, status: newStatus } : token
//         ));
//       }
//     } catch (error) {
//       console.error('Error updating status:', error);
//     }
//   };

//   // Generate message based on token status
//   const generateMessage = (token) => {
//     const patientName = token.patient_name;
//     const doctorName = token.doctor_name;
    
//     if (token.status === 'pending') {
//       return `Dear ${patientName}, you have missed your today's appointment with Dr. ${doctorName}. Please schedule your appointment for tomorrow. - ${company}`;
//     } else if (token.status === 'Completed') {
//       return `Dear ${patientName}, thank you for visiting Dr. ${doctorName} today. Take care and follow the prescribed medication. - ${company}`;
//     } else {
//       return `Dear ${patientName}, your appointment with Dr. ${doctorName} is in progress. Please wait for your turn. - ${company}`;
//     }
//   };
  
//   const renderTokens = (slot) => {
//     const filteredTokens = tokens.filter(token => token.slot === slot);
//     return (
//       <CTable striped hover responsive>
//         <CTableHead>
//           <CTableRow>
//             <CTableHeaderCell>Sr.</CTableHeaderCell>
//             <CTableHeaderCell>Token No</CTableHeaderCell>
//             <CTableHeaderCell>Patient</CTableHeaderCell>
//             <CTableHeaderCell>Doctor</CTableHeaderCell>
//             <CTableHeaderCell>Date</CTableHeaderCell>
//             <CTableHeaderCell>Status</CTableHeaderCell>
//             <CTableHeaderCell>Contact</CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {filteredTokens.length > 0 ? (
//             filteredTokens.map((token, index) => (
//               <CTableRow key={index}>
//                 <CTableDataCell>{index + 1}</CTableDataCell>
//                 <CTableDataCell>{token.tokan_number}</CTableDataCell>
//                 <CTableDataCell>{token.patient_name}</CTableDataCell>
//                 <CTableDataCell>{token.doctor_name}</CTableDataCell>
//                 <CTableDataCell>{token.date}</CTableDataCell>
//                 <CTableDataCell>
//                   <CBadge 
//                     color={token.status === "Completed" ? "success" : token.status === "In Progress" ? "info" : "warning"}
//                     style={{ cursor: 'pointer' }}
//                     onClick={() => {
//                     if (token.status === "pending") {
//                       updateStatus(token.tokan_number, "In Progress");
//                     } else if (token.status === "In Progress") {
//                       updateStatus(token.tokan_number, "Completed");
//                     }
//                   }}
//                   >
//                     {token.status}
//                   </CBadge>
//                 </CTableDataCell>
//                 <CTableDataCell>
//                   {token.patient_phone && (
//                     <>
//                       <a
//                         className="btn btn-outline-primary btn-sm"
//                         href={`tel:${token.patient_phone.replace(/^(\+)?/, '')}`}
//                         title="Call Patient"
//                       >
//                         <CIcon icon={cilPhone} />
//                       </a>
//                       &nbsp;
//                       <a
//                         className="btn btn-outline-success btn-sm"
//                         href={`sms:${token.patient_phone.replace(/^(\+)?/, '')}?body=${encodeURIComponent(generateMessage(token))}`}
//                         title="Send Message"
//                       >
//                         <CIcon icon={cilChatBubble} />
//                       </a>
//                     </>
//                   )}
//                   {!token.patient_phone && (
//                     <span className="text-muted">No contact</span>
//                   )}
//                 </CTableDataCell>
//               </CTableRow>
//             ))
//           ) : (
//             <CTableRow>
//               <CTableDataCell colSpan="7" className="text-center">No tokens available.</CTableDataCell>
//             </CTableRow>
//           )}
//         </CTableBody>
//       </CTable>
//     );
//   };

//   return (
//     <>
//       {/* Header Card */}
//       <CCard className="p-4 shadow-smrounded-2xl mb-4 bg-gradient-to-r from-white to-blue-50 border border-blue-100">
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <CRow>
//             <CCol>
//               <h4 className="text-2xl font-bold text-blue-800 tracking-wide">
//                 🗓️ Today's Tokens
//               </h4>
//             </CCol>
//             <CCol className=''>
//               <input
//                 type="text"
//                 className="w-full sm:w-72 px-4 py-2 text-sm border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
//                 placeholder="🔍 Search patient name..."
//                 value={searchText}
//                 onChange={handleSearchChange}
//               />
//             </CCol>
//           </CRow>
//         </div>
//       </CCard>

//       {/* Search Results */}
//       {selectedTokens.map((token, index) => (
//         <CAlert color="success" key={index}>
//           <div className="">
//             <p className="font-semibold text-base mb-1">
//               <span className="font-bold" style={{fontWeight: "bold" }}>Token Number:</span>
//               <span style={{ fontSize: "20px", fontWeight: "bold" }}>{token.tokan_number}</span>&nbsp;&nbsp;&nbsp;
//               <span className="font-bold gap-6" style={{fontWeight: "bold" }}>Name:</span>
//               <span style={{ fontSize: "20px", fontWeight: "bold" }}>{token.patient_name}</span>&nbsp;&nbsp;&nbsp;
//               <span className="font-bold" style={{fontWeight: "bold" }}>Slot:</span> 
//               <span style={{ fontSize: "20px", fontWeight: "bold" }}>{token.slot}</span>
//             </p>
//           </div>
//         </CAlert>
//       ))}

//       {/* Morning Card */}
//       <CCard className="p-4 shadow-md rounded-2xl mb-2">
//         <div className="flex items-center justify-between mb-3">
//           <h5 className="text-xl font-semibold text-blue-700">🌅 Morning</h5>
//           <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
//             6:00 AM - 12:00 PM
//           </span>
//         </div>
//         <div>{renderTokens("morning")}</div>
//       </CCard>

//       {/* Afternoon Card */}
//       <CCard className="p-4 shadow-md rounded-2xl mb-2">
//         <div className="flex items-center justify-between mb-3">
//           <h5 className="text-xl font-semibold text-yellow-600">🌞 Afternoon</h5>
//           <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-1 rounded-full">
//             12:00 PM - 4:00 PM
//           </span>
//         </div>
//         <div>{renderTokens("afternoon")}</div>
//       </CCard>

//       {/* Evening Card */}
//       <CCard className="p-4 shadow-md rounded-2xl mb-2">
//         <div className="flex items-center justify-between mb-3">
//           <h5 className="text-xl font-semibold text-purple-700">🌇 Evening</h5>
//           <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">
//             4:00 PM - 8:00 PM
//           </span>
//         </div>
//         <div>{renderTokens("evening")}</div>
//       </CCard>
//     </>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from 'react';
import {
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CBadge, CCard, CAlert, CCol, CRow, CButton
} from '@coreui/react';
import { getAPICall, post } from '../../util/api';
import CIcon from '@coreui/icons-react';
import { cilChatBubble, cilPhone } from '@coreui/icons';
import { getUser } from '../../util/session';

const Dashboard = () => {
  const [tokens, setTokens] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedTokens, setSelectedTokens] = useState([]);
  const company = getUser()?.company_info?.company_name || 'Clinic';
  console.log(tokens);
  const [xyz, setXyz] = useState({});

  // Helper function to determine slot based on time or date
  // const determineSlot = (appointmentData) => {
  //   // If slot is already defined, use it
  //   if (appointmentData.slot) {
  //     return appointmentData.slot;
  //   }
    
  //   // For online appointments, try to determine slot from time or date
  //   if (appointmentData.time) {
  //     const time = appointmentData.time.toLowerCase();
  //     if (time.includes('morning') || time.includes('am')) {
  //       return 'morning';
  //     } else if (time.includes('afternoon')) {
  //       return 'afternoon';
  //     } else if (time.includes('evening') || time.includes('pm')) {
  //       return 'evening';
  //     }
  //   }
    
  //   // Default to morning if no time info available
  //   return 'morning';
  // };
  const determineSlot = (appointmentData) => {
  const rawTime = appointmentData.time || '';
  const timeStr = rawTime.trim().toUpperCase();

  // Parse time (e.g., "2:00 PM")
  const timeParts = timeStr.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/);
  if (!timeParts) return 'morning'; // fallback

  let [_, hour, minutes, period] = timeParts;
  hour = parseInt(hour, 10);
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 16) return 'afternoon';
  if (hour >= 16 && hour < 20) return 'evening';

  return 'morning'; // fallback
};


  useEffect(() => {
    const loadData = async () => {
      try {
        // Load token data
        const tokenRes = await getAPICall('/api/todays-tokans');
        let enrichedTokens = [];

        if (tokenRes.success && Array.isArray(tokenRes.data)) {
          enrichedTokens = await Promise.all(tokenRes.data.map(async (token) => {
            try {
              const patientResponse = await getAPICall(`/api/patients/${token.patient_id}`);
              const doctorResponse = await getAPICall(`/api/users/${token.doctor_id}`);
              return {
                ...token,
                patient_name: patientResponse?.name || 'Unknown',
                patient_phone: patientResponse?.phone || patientResponse?.mobile || '',
                doctor_name: doctorResponse?.name || 'Unknown',
                source: 'Token',
                slot: token.slot || 'morning' // Ensure slot exists
              };
            } catch (err) {
              return { 
                ...token, 
                patient_name: 'Unknown', 
                doctor_name: 'Unknown', 
                patient_phone: '', 
                source: 'Token',
                slot: token.slot || 'morning'
              };
            }
          }));
        }

        // Load online appointments
       // Load online appointments
const onlineRes = await getAPICall('/api/getAppointments');
let enrichedOnline = [];

const todayDate = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

if (onlineRes && Array.isArray(onlineRes)) {
  enrichedOnline = onlineRes
    .filter(item => item?.date === todayDate) // ✅ Only today's appointments
    .map((item) => {
      return {
        ...item,
        patient_name: item?.name || 'Unknown',
        patient_phone: item?.phone || '',
        doctor_name: item?.doctor_name || item?.doctor || 'Unknown',
        tokan_number: item?.tokan || 'N/A',
        status: item?.status || 'pending',
        date: item?.date || todayDate,
        source: 'Online',
        slot: determineSlot(item),
      };
    });
}

        
        console.log('Online appointments:', enrichedOnline);

        const combined = [...enrichedTokens, ...enrichedOnline];
        setTokens(combined);

      } catch (error) {
        console.error("Error loading tokens and appointments:", error);
      }
    };

    loadData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value.trim() === '') {
      setSelectedTokens([]);
      return;
    }
    const filteredTokens = tokens.filter((token) =>
      token.patient_name.toLowerCase().includes(value.toLowerCase())
    );
    setSelectedTokens(filteredTokens);
  };

  const updateStatus = async (tokanNumber, newStatus) => {
    try {
      const response = await post('/api/update-token-status', {
        tokan_number: tokanNumber,
        status: newStatus,
      });
      if (response.success) {
        setTokens(tokens.map(token => 
          token.tokan_number === tokanNumber ? { ...token, status: newStatus } : token
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const generateMessage = (token) => {
    const patientName = token.patient_name;
    const doctorName = token.doctor_name;
    if (token.status === 'pending') {
      return `Dear ${patientName}, you have missed your today's appointment with Dr. ${doctorName}. Please schedule your appointment for tomorrow. - ${company}`;
    } else if (token.status === 'Completed') {
      return `Dear ${patientName}, thank you for visiting Dr. ${doctorName} today. Take care and follow the prescribed medication. - ${company}`;
    } else {
      return `Dear ${patientName}, your appointment with Dr. ${doctorName} is in progress. Please wait for your turn. - ${company}`;
    }
  };

  const renderTokens = (slot) => {
    const filteredTokens = tokens.filter(token => token.slot === slot);
    console.log(`Tokens for ${slot}:`, filteredTokens); // Debug log
    
    return (
      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Sr.</CTableHeaderCell>
            <CTableHeaderCell>Token No</CTableHeaderCell>
            <CTableHeaderCell>Patient</CTableHeaderCell>
            <CTableHeaderCell>Doctor</CTableHeaderCell>
            <CTableHeaderCell>Date</CTableHeaderCell>
            <CTableHeaderCell>Time</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Contact</CTableHeaderCell>
            <CTableHeaderCell>Source</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredTokens.length > 0 ? (
            filteredTokens.map((token, index) => (
              <CTableRow key={`${token.source}-${token.tokan_number}-${index}`}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{token.tokan_number}</CTableDataCell>
                <CTableDataCell>{token.patient_name}</CTableDataCell>
                {/* <CTableDataCell>{token.doctor_name}</CTableDataCell> */}
                <CTableDataCell>
  {token.source === 'Token' ? token.doctor_name : <span className="text-muted">—</span>}
</CTableDataCell>

                <CTableDataCell>{token.date}</CTableDataCell>
                 {/* <CTableDataCell>{token.time}</CTableDataCell> */}
                 <CTableDataCell>
  {token.source === 'Online' ? token.time : '-'}
</CTableDataCell>
                <CTableDataCell>
               
                  <CBadge
  color={
    (token.status === "Completed" || token.status === "completed") ? "success" :
    (token.status === "In Progress" || token.status === "in progress") ? "info" :
    (token.status === "Canceled" || token.status === "1") ? "danger" :
    "warning"
  }
  style={{ cursor: token.source === 'Token' ? 'pointer' : 'default' }}
  onClick={() => {
    // Only allow status update for Token-based entries
    if (token.source === 'Token') {
      if (token.status === "pending" || token.status === "0") {
        updateStatus(token.tokan_number, "In Progress");
      } else if (token.status === "In Progress") {
        updateStatus(token.tokan_number, "Completed");
      }
    }
  }}
>
  {
    (token.status === "Completed" || token.status === "completed") ? "Completed" :
    (token.status === "In Progress" || token.status === "in progress") ? "In Progress" :
    (token.status === "Canceled" || token.status === "1") ? "Canceled" :
    "Pending"
  }
</CBadge>

                </CTableDataCell>
                <CTableDataCell>
                  {token.patient_phone ? (
                    <>
                      <a className="btn btn-outline-primary btn-sm" href={`tel:${token.patient_phone}`}>
                        <CIcon icon={cilPhone} />
                      </a>
                      &nbsp;
                      <a className="btn btn-outline-success btn-sm" href={`sms:${token.patient_phone}?body=${encodeURIComponent(generateMessage(token))}`}>
                        <CIcon icon={cilChatBubble} />
                      </a>
                    </>
                  ) : (
                    <span className="text-muted">No contact</span>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge color={token.source === 'Online' ? 'info' : 'secondary'}>
                    {token.source}
                  </CBadge>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center">No appointments available for this time slot.</CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    );
  };

  return (
    <>
      <CCard className="p-4 shadow-sm mb-4">
        <CRow>
          <CCol>
            <h4 className="text-2xl font-bold text-blue-800">🗓️ Today's Appointments</h4>
            <small className="text-muted">Total appointments: {tokens.length}</small>
          </CCol>
          <CCol>
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search patient name..."
              value={searchText}
              onChange={handleSearchChange}
            />
          </CCol>
        </CRow>
      </CCard>

      {selectedTokens.map((token, index) => (
        <CAlert color="success" key={index}>
          <strong>Token No:</strong> {token.tokan_number} | <strong>Name:</strong> {token.patient_name} | <strong>Slot:</strong> {token.slot} | <strong>Source:</strong> {token.source}
        </CAlert>
      ))}

      <CCard className="p-4 shadow-md mb-2">
        <div className="mb-3">
          <h5 className="text-xl font-semibold text-blue-700">🌅 Morning (6 AM - 12 PM)</h5>
        </div>
        {renderTokens("morning")}
      </CCard>

      <CCard className="p-4 shadow-md mb-2">
        <div className="mb-3">
          <h5 className="text-xl font-semibold text-yellow-600">🌞 Afternoon (12 PM - 4 PM)</h5>
        </div>
        {renderTokens("afternoon")}
      </CCard>

      <CCard className="p-4 shadow-md mb-2">
        <div className="mb-3">
          <h5 className="text-xl font-semibold text-purple-700">🌇 Evening (4 PM - 8 PM)</h5>
        </div>
        {renderTokens("evening")}
      </CCard>
    </>
  );
};

export default Dashboard;




   {/* <CBadge 
                    color={token.status === "Completed" ? "success" : token.status === "In Progress" ? "info" : "warning"}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (token.status === "pending") {
                        updateStatus(token.tokan_number, "In Progress");
                      } else if (token.status === "In Progress") {
                        updateStatus(token.tokan_number, "Completed");
                      }
                    }}
                  >
                    {token.status}
                  </CBadge> */}