import React, { useEffect, useState } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge } from '@coreui/react';
import { getAPICall, post} from '../../util/api';

const Dashboard = () => {
  const [tokens, setTokens] = useState([]);

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
                const doctorResponse = await getAPICall(`/api/users/${token.doctor_id}`);
  
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

  const updateStatus = async (tokanNumber, newStatus) => {
    try {
      const response = await post('/api/update-token-status', {
        tokan_number: tokanNumber, // Send tokan_number instead of tokan_id
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
                      const newStatus = token.status === "Pending" 
                        ? "In Progress" 
                        : token.status === "In Progress" 
                          ? "Completed" 
                          : "Completed"; // Ensures it doesn't go back to Pending
                      updateStatus(token.tokan_number, newStatus);
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Today's Tokens</h1>
      <h2 className="text-xl font-semibold mt-4 mb-2">Morning</h2>
      {renderTokens("morning")}
      <h2 className="text-xl font-semibold mt-4 mb-2">Afternoon</h2>
      {renderTokens("afternoon")}
      <h2 className="text-xl font-semibold mt-4 mb-2">Evening</h2>
      {renderTokens("evening")}
    </div>
  );
};

export default Dashboard;