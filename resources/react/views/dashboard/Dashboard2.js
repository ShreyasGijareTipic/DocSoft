import React, { useEffect, useState } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CCard, CAlert, CCol, CRow } from '@coreui/react';
import { getAPICall, post} from '../../util/api';

const Dashboard = () => {
  const [tokens, setTokens] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedTokens, setSelectedTokens] = useState([]);



  useEffect(() => {
    const loadTokens = async () => {
      try {
        const response = await getAPICall('/api/todays-tokans');
        console.log("Tokens API Response:", response);
  
        if (response.success && Array.isArray(response.data)) {
          const tokensData = response.data;
  
          const enrichedTokens = await Promise.all(
            tokensData.map(async (token) => {
              try {
                const patientResponse = await getAPICall(`/api/patients/${token.patient_id}`); 
                // patientResponse = await getAPICall(`/api/loggedDrPatient`);
                const doctorResponse = await getAPICall(`/api/users/${token.doctor_id}`);
                console.log("patientResponse",patientResponse);
                
  
                return {
                  ...token,
                  patient_name: patientResponse?.name || 'Unknown',
                  doctor_name: doctorResponse?.name || 'Unknown',
                };
              } catch (error) {
                console.error(`Error fetching details for token ${token.id}:`, error);
                return { ...token, patient_name: 'Unknown', doctor_name: 'Unknown' };
              }
            })
          );
  
          setTokens(enrichedTokens);
        } else {
          console.error('Failed to fetch tokens:', response.message);
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };
  
    loadTokens();
  }, []);

// -----------------------------------------------------
  // Search Box 
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
  
    setSelectedTokens(filteredTokens); // Store all matches
  };
  
  
// ----------------------------------------------------



  const updateStatus = async (tokanNumber, newStatus) => {
    try {
      const response = await post('/api/update-token-status', {
        tokan_number: tokanNumber, // Send tokan_number instead of tokan_id
        status: newStatus,
      });
      console.log(response);
      
      
      if (response.success) {
        setTokens(tokens.map(token => 
          token.tokan_number === tokanNumber ? { ...token, status: newStatus } : token
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  const renderTokens = (slot) => {
    const filteredTokens = tokens.filter(token => token.slot === slot);
    return (
      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Sr.</CTableHeaderCell>
            <CTableHeaderCell>Token No</CTableHeaderCell>
            <CTableHeaderCell>Patient</CTableHeaderCell>
            <CTableHeaderCell>Doctor</CTableHeaderCell>
            <CTableHeaderCell>Date</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredTokens.length > 0 ? (
            filteredTokens.map((token, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{token.tokan_number}</CTableDataCell>
                <CTableDataCell>{token.patient_name}</CTableDataCell>
                <CTableDataCell>{token.doctor_name}</CTableDataCell>
                <CTableDataCell>{token.date}</CTableDataCell>
                <CTableDataCell>
                  <CBadge 
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
                  </CBadge>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="6" className="text-center">No tokens available.</CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    );
  };

  return (

    <>

    {/* // <div className="p-1">
    //   <h1 className="text-1 font-bold mb-4">Today's Tokens</h1>
    //   <h2 className="text-xl font-semibold mt-4 mb-2">Morning</h2>
    //   {renderTokens("morning")}
    //   <h2 className="text-xl font-semibold mt-4 mb-2">Afternoon</h2>
    //   {renderTokens("afternoon")}
    //   <h2 className="text-xl font-semibold mt-4 mb-2">Evening</h2>
    //   {renderTokens("evening")}
    // </div> */}


  {/* Header Card */}
  {/* <CCard className="p-2 shadow-md rounded-2xl mb-2">
    <div className="flex items-center gap-2">
      <h4 className="text-1xl font-bold text-gray-800">Today's Tokens</h4>
    </div>
  </CCard> */}
  <CCard className="p-4 shadow-smrounded-2xl mb-4 bg-gradient-to-r from-white to-blue-50 border border-blue-100">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <CRow>
      <CCol>
    <h4 className="text-2xl font-bold text-blue-800 tracking-wide">
      🗓️ Today's Tokens
    </h4>
    </CCol>
    <CCol className=''>
    <input
      type="text"
      className="w-full sm:w-72 px-4 py-2 text-sm border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      placeholder="🔍 Search patient name..."
      value={searchText}
      onChange={handleSearchChange}
    />
    </CCol>
    </CRow>
  </div>
</CCard>


{/* ----------------------------------  */}

{/* {selectedTokens.length > 0 && (
  
<CAlert color="success">
  <div className="">
    <div className="">
      <button
        onClick={() => setSelectedToken([])}
        className="bg-none"
      >
        ✕
      </button>

      {selectedTokens.map((token, index) => (
        <div key={index} className="border-b border-green-300 pb-2">
          <p className="font-semibold text-base">
            <span className="font-bold">Name:</span> {token.patient_name} ({token.phone})
          </p>
          <p><span className="font-bold">Token Number:</span> {token.token_number}</p>
          <p><span className="font-bold">Slot:</span> {token.slot}</p>
          <p>
            <span className="font-bold">Status:</span>{" "}
            <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-sm">
              Active
            </span>
          </p>
        </div>
      ))}
    </div>
  </div>
  </CAlert>
)} */}


{selectedTokens.map((token, index) => (
  <CAlert color="success">
  <div
    key={index}
    className=""
  >
    <p className="font-semibold text-base mb-1">
      <span className="font-bold" style={{fontWeight: "bold" }}>Token Number:</span><sapn style={{ fontSize: "20px", fontWeight: "bold" }}>{token.tokan_number}</sapn>&nbsp;&nbsp;&nbsp;
      <span className="font-bold gap-6" style={{fontWeight: "bold" }}>Name:</span><span style={{ fontSize: "20px", fontWeight: "bold" }}>{token.patient_name}</span>&nbsp;&nbsp;&nbsp;   {/*({token.phone}) */}
     <span className="font-bold" style={{fontWeight: "bold" }}>Slot:</span> <span style={{ fontSize: "20px", fontWeight: "bold" }}>{token.slot}</span>
    
    </p>
  </div>
  </CAlert>
))}


{/* -------------------------------------- */}


  {/* Morning Card */}
  <CCard className="p-4 shadow-md rounded-2xl mb-2">
    <div className="flex items-center justify-between mb-3">
      <h5 className="text-xl font-semibold text-blue-700">🌅 Morning</h5>
      <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
        6:00 AM - 12:00 PM
      </span>
    </div>
    <div>{renderTokens("morning")}</div>
  </CCard>

  {/* Afternoon Card */}
  <CCard className="p-4 shadow-md rounded-2xl mb-2">
    <div className="flex items-center justify-between mb-3">
      <h5 className="text-xl font-semibold text-yellow-600">🌞 Afternoon</h5>
      <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-1 rounded-full">
        12:00 PM - 4:00 PM
      </span>
    </div>
    <div>{renderTokens("afternoon")}</div>
  </CCard>

  {/* Evening Card */}
  <CCard className="p-4 shadow-md rounded-2xl mb-2">
    <div className="flex items-center justify-between mb-3">
      <h5 className="text-xl font-semibold text-purple-700">🌇 Evening</h5>
      <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">
        4:00 PM - 8:00 PM
      </span>
    </div>
    <div>{renderTokens("evening")}</div>
  </CCard>




</>
  );
};

export default Dashboard;