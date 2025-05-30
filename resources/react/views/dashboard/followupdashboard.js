import React, { useEffect, useState } from 'react';
import { 
  CTable, 
  CTableHead, 
  CTableRow, 
  CTableHeaderCell, 
  CTableBody, 
  CTableDataCell, 
  CBadge, 
  CCard, 
  CAlert, 
  CCol, 
  CRow,
  CFormInput,
  CButton,
  CSpinner
} from '@coreui/react';
import { getAPICall } from '../../util/api';
import CIcon from '@coreui/icons-react';
import { cilChatBubble, cilPhone, cilCalendar } from '@coreui/icons';
import { getUser } from '../../util/session';

const FollowupDashboard = () => {
  const [followups, setFollowups] = useState([]);
  const [filteredFollowups, setFilteredFollowups] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFollowups, setSelectedFollowups] = useState([]);
  const [followupDates, setFollowupDates] = useState(new Set()); // Store dates that have followups
  const company = getUser()?.company_info?.company_name || 'Clinic';

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  useEffect(() => {
    // Set default date to today
    const today = getTodayDate();
    setSelectedDate(today);
    fetchFollowups(today);
    fetchAllFollowupDates(); // Fetch all dates with followups for highlighting
  }, []);

  // Fetch all followup dates for highlighting
  const fetchAllFollowupDates = async () => {
    try {
      const response = await getAPICall('/api/followup-appointments/dates');
      if (response.success && Array.isArray(response.data)) {
        const dates = new Set(response.data.map(item => item.followup_date.split('T')[0]));
        setFollowupDates(dates);
      }
    } catch (error) {
      console.error('Error fetching followup dates:', error);
    }
  };

  const fetchFollowups = async (date = null) => {
    setLoading(true);
    try {
      const endpoint = date 
        ? `/api/followup-appointments?date=${date}`
        : '/api/followup-appointments';
      
      const response = await getAPICall(endpoint);
      console.log("Followup API Response:", response);

      if (response.success && Array.isArray(response.data)) {
        setFollowups(response.data);
        setFilteredFollowups(response.data);
      } else {
        console.error('Failed to fetch followups:', response.message);
        setFollowups([]);
        setFilteredFollowups([]);
      }
    } catch (error) {
      console.error('Error fetching followups:', error);
      setFollowups([]);
      setFilteredFollowups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    const today = getTodayDate();
    
    // Prevent selecting past dates
    if (newDate < today) {
      alert('Cannot select past dates');
      return;
    }
    
    setSelectedDate(newDate);
    setSearchText(''); // Clear search when date changes
    setSelectedFollowups([]); // Clear selected items
    fetchFollowups(newDate);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.trim() === '') {
      setFilteredFollowups(followups);
      setSelectedFollowups([]);
      return;
    }

    const filtered = followups.filter((followup) =>
      followup.patient_name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredFollowups(filtered);
    setSelectedFollowups(filtered); // Show matches in alert
  };

  // Generate message for followup
  const generateFollowupMessage = (followup) => {
    const patientName = followup.patient_name;
    const doctorName = followup.doctor_name;
    const followupDate = new Date(followup.followup_date);
    const formattedDate = `${followupDate.getDate().toString().padStart(2, '0')}/${(followupDate.getMonth() + 1).toString().padStart(2, '0')}/${followupDate.getFullYear()}`;

    return `Dear ${patientName}, this is a reminder for your followup appointment with Dr. ${doctorName} scheduled for ${formattedDate}. Please confirm your visit. - ${company}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status badge color based on date
  const getStatusColor = (followupDate) => {
    const today = new Date().toDateString();
    const fDate = new Date(followupDate).toDateString();
    
    if (fDate === today) return 'success'; // Today
    if (new Date(followupDate) > new Date()) return 'info'; // Future
    return 'warning'; // Should not happen as we filter past dates
  };

  // Get date input styling based on followup availability and today's date
  const getDateInputStyle = () => {
    const today = getTodayDate();
    const hasFollowups = followupDates.has(selectedDate);
    
    let style = {
      border: '2px solid',
      borderRadius: '8px',
      padding: '8px 12px',
      fontWeight: 'bold'
    };

    if (selectedDate === today) {
      // Today's date - blue
      style.borderColor = '#0066cc';
      style.backgroundColor = '#e6f3ff';
      style.color = '#0066cc';
    } else if (hasFollowups) {
      // Date with followups - green
      style.borderColor = '#28a745';
      style.backgroundColor = '#e8f5e9';
      style.color = '#28a745';
    } else {
      // Regular date - default
      style.borderColor = '#ced4da';
      style.backgroundColor = '#ffffff';
      style.color = '#495057';
    }

    return style;
  };

  return (
    <>
      {/* Header Card */}
      <CCard className="p-4 shadow-sm rounded-2xl mb-4 bg-gradient-to-r from-white to-green-50 border border-green-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CRow className="w-100">
            <CCol md={6}>
              <h4 className="text-2xl font-bold text-green-800 tracking-wide">
                📅 Followup Appointments
              </h4>
            </CCol>
            <CCol md={3}>
              <div className="d-flex align-items-center gap-2">
                <CIcon icon={cilCalendar} className="text-green-600" />
                <CFormInput
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  min={getTodayDate()}
                  style={getDateInputStyle()}
                />
              </div>
              <div className="mt-2">
                <small className="text-muted">
                  <span style={{color: '#0066cc'}}>🔵 Today</span> | 
                  <span style={{color: '#28a745'}}> 🟢 Has Followups</span>
                </small>
              </div>
            </CCol>
            <CCol md={3}>
              <CFormInput
                type="text"
                className="form-control-sm"
                placeholder="🔍 Search patient name..."
                value={searchText}
                onChange={handleSearchChange}
              />
            </CCol>
          </CRow>
        </div>
      </CCard>

      {/* Search Results Alert */}
      {selectedFollowups.length > 0 && searchText && (
        <CAlert color="info" className="mb-3">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <strong>Search Results ({selectedFollowups.length} found):</strong>
              {selectedFollowups.slice(0, 3).map((followup, index) => (
                <div key={index} className="mt-2">
                  <span className="fw-bold">Patient:</span> {followup.patient_name} | 
                  <span className="fw-bold"> Date:</span> {formatDate(followup.followup_date)} |
                  <span className="fw-bold"> Contact:</span> {followup.patient_contact}
                </div>
              ))}
              {selectedFollowups.length > 3 && (
                <div className="text-muted mt-1">...and {selectedFollowups.length - 3} more</div>
              )}
            </div>
            <CButton 
              size="sm" 
              color="light" 
              onClick={() => {setSearchText(''); setSelectedFollowups([]);}}
            >
              ✕
            </CButton>
          </div>
        </CAlert>
      )}

      {/* Followup Appointments Table */}
      <CCard className="p-4 shadow-md rounded-2xl mb-2">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-xl font-semibold text-green-700">
            🩺 Followup for {selectedDate ? formatDate(selectedDate) : 'Selected Date'}
          </h5>
          <CBadge color="info" className="px-3 py-2">
            Total: {filteredFollowups.length} appointments
          </CBadge>
        </div>
        
        {loading ? (
          <div className="text-center p-5">
            <CSpinner color="primary" size="lg" />
            <div className="mt-3 text-muted">Loading followup appointments...</div>
          </div>
        ) : (
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Sr.</CTableHeaderCell>
                <CTableHeaderCell>Patient Name</CTableHeaderCell>
                <CTableHeaderCell>Contact</CTableHeaderCell>
                <CTableHeaderCell>Original Visit</CTableHeaderCell>
                <CTableHeaderCell>Followup Date</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredFollowups.length > 0 ? (
                filteredFollowups.map((followup, index) => (
                  <CTableRow key={followup.id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <strong>{followup.patient_name}</strong>
                        {followup.patient_email && (
                          <div className="text-muted small">{followup.patient_email}</div>
                        )}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>{followup.patient_contact}</CTableDataCell>
                    <CTableDataCell>{formatDate(followup.visit_date)}</CTableDataCell>
                    <CTableDataCell>{formatDate(followup.followup_date)}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getStatusColor(followup.followup_date)}>
                        {new Date(followup.followup_date).toDateString() === new Date().toDateString() 
                          ? 'Today' 
                          : 'Scheduled'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      {followup.patient_contact && (
                        <div className="d-flex gap-1">
                          <a
                            className="btn btn-outline-primary btn-sm"
                            href={`tel:+${followup.patient_contact.replace(/^(\+)?/, '')}`}
                            title="Call Patient"
                          >
                            <CIcon icon={cilPhone} />
                          </a>
                          <a
                            className="btn btn-outline-success btn-sm"
                            href={`sms:+${followup.patient_contact.replace(/^(\+)?/, '')}?body=${encodeURIComponent(generateFollowupMessage(followup))}`}
                            title="Send Reminder"
                          >
                            <CIcon icon={cilChatBubble} />
                          </a>
                        </div>
                      )}
                      {!followup.patient_contact && (
                        <span className="text-muted small">No contact</span>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="7" className="text-center py-4">
                    No followup appointments found for the selected date.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        )}
      </CCard>

      {/* Summary Card */}
      {filteredFollowups.length > 0 && (
        <CCard className="p-3 shadow-sm rounded-2xl bg-light">
          <CRow>
            <CCol md={4}>
              <div className="text-center">
                <h6 className="text-success">Total Appointments</h6>
                <h4 className="text-success">{filteredFollowups.length}</h4>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="text-center">
                <h6 className="text-info">Today's Followups</h6>
                <h4 className="text-info">
                  {filteredFollowups.filter(f => 
                    new Date(f.followup_date).toDateString() === new Date().toDateString()
                  ).length}
                </h4>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="text-center">
                <h6 className="text-warning">Upcoming</h6>
                <h4 className="text-warning">
                  {filteredFollowups.filter(f => 
                    new Date(f.followup_date) > new Date()
                  ).length}
                </h4>
              </div>
            </CCol>
          </CRow>
        </CCard>
      )}
    </>
  );
};

export default FollowupDashboard;