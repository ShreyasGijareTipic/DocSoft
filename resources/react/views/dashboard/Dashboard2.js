import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCardHeader, CBadge, CRow, CCol } from '@coreui/react';
import { getAPICall } from '../../util/api'; // Adjust the import path if needed

const Dashboard = () => {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const response = await getAPICall('/api/todays-tokans');
        console.log("Tokens API Response:", response);
  
        if (response.success && Array.isArray(response.data)) {
          const tokensData = response.data;
  
          // Fetch patient and doctor details for each token
          const enrichedTokens = await Promise.all(
            tokensData.map(async (token) => {
              try {
                const patientResponse = await getAPICall(`/api/patients/${token.patient_id}`);
                const doctorResponse = await getAPICall(`/api/users/${token.doctor_id}`);
  
                console.log(`Fetched patient for token ${token.id}:`, patientResponse);
                console.log(`Fetched doctor for token ${token.id}:`, doctorResponse);
  
                return {
                  ...token,
                  patient_name: patientResponse?.name || 'Unknown',  // Directly access `.name`
                  doctor_name: doctorResponse?.name || 'Unknown',    // Directly access `.name`
                };
              } catch (error) {
                console.error(`Error fetching details for token ${token.id}:`, error);
                return { ...token, patient_name: 'Unknown', doctor_name: 'Unknown' };
              }
            })
          );
  
          console.log("Enriched Tokens Data:", enrichedTokens);
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
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Today's Tokens</h1>
      <CRow>
        {tokens.length > 0 ? (
          tokens.map((token, index) => (
            <CCol md="4" key={index} className="mb-4">
              <CCard>
                <CCardHeader>
                  <h5>Token No: {token.tokan_number}</h5>
                </CCardHeader>
                <CCardBody>
                  <p><strong>Patient:</strong> {token.patient_name}</p>
                  <p><strong>Doctor:</strong> {token.doctor_name}</p>
                  <p><strong>Date:</strong> {token.date}</p>
                  <CBadge color={token.status === "1" ? "success" : "warning"}>
                    {token.status === "1" ? "Completed" : "Pending"}
                  </CBadge>
                </CCardBody>
              </CCard>
            </CCol>
          ))
        ) : (
          <p>No tokens for today.</p>
        )}
      </CRow>
    </div>
  );
};

export default Dashboard;
