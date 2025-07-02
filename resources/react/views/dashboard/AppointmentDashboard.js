import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CButton,
  CFormInput,
  CFormSelect,
  CSpinner,
  CPagination,
  CPaginationItem,
  CRow,
  CCol,
  CContainer,
  CButtonGroup,
  CInputGroup,
  CInputGroupText,
  CModal, 
  CModalHeader, 
  CModalBody, 
  CModalFooter
} from '@coreui/react';
import { Eye, Edit, Trash2, Search, Filter, Calendar, Clock, Phone, User, Activity, CheckCircle, AlertCircle, XCircle, Download, FileText } from 'lucide-react';
import { getAPICall, post } from '../../util/api';

function AppointmentsTable() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // New state for date filter
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportData, setExportData] = useState([]);
  // Fetch data with delay
  const tableRef = useRef(null);

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Helper function to get tomorrow's date in YYYY-MM-DD format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const fetchExportData = async () => {
    const url = `/api/export?start_date=${startDate}&end_date=${endDate}`;
    const response = await fetch(url);
    const json = await response.json();
    setExportData(json);
  };

  const fetchExportData1 = async () => {
  const res = await fetch(`/api/export?start_date=${startDate}&end_date=${endDate}`); // example
  const data = await res.json();
  setExportData(data); // still update state if needed
  return data; // return directly for immediate use
};

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
    XLSX.writeFile(workbook, "appointments.xlsx");
  };

  const exportToPDF = (data) => {
  if (!data || data.length === 0) {
    alert("No data to export.");
    return;
  }

  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Appointments Report", 14, 15);

  const tableData = data.map((item, index) => [
    index + 1,
    item.name,
    item.phone,
    item.date,
    item.time,
    item.status === '0' ? 'Active' : item.status === '1' ? 'Cancelled' : item.status,
  ]);

  doc.autoTable({
    head: [["#", "Name", "Phone", "Date", "Time", "Status"]],
    body: tableData,
    startY: 25,
    theme: "grid",
    headStyles: { fillColor: [100, 100, 255] },
  });

  doc.save("appointments.pdf");
};

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollbottom = tableRef.current.scrollHeight;
    }
  }, [filteredData]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAppointments();
    }, 1000); // 1 second delay

    return () => clearTimeout(timeout);
  }, []);

  // Updated filter logic to include date filtering
  useEffect(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone?.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Date filtering logic
    if (dateFilter === 'today') {
      const today = getTodayDate();
      filtered = filtered.filter(item => item.date === today);
    } else if (dateFilter === 'tomorrow') {
      const tomorrow = getTomorrowDate();
      filtered = filtered.filter(item => item.date === tomorrow);
    }
    // 'all' doesn't need additional filtering

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, data]); // Added dateFilter to dependencies

  const getStatusBadge2 = (status) => {
    if (status === 0 || status === '0') {
      return <CBadge color="success">Active</CBadge>;
    } else if (status === 1 || status === '1') {
      return <CBadge color="danger">Cancelled</CBadge>;
    } else {
      return <CBadge color="secondary"></CBadge>;
    }
  };

  // const fetchAppointments = () => {
  //   setLoading(true);
  //   getAPICall('/api/getAppointments')
  //     .then((response) => response.json())
  //     .then((json) => {
  //       setData(json);
  //       setFilteredData(json);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching appointments:', error);
  //       setLoading(false);
  //     });
  // };
  const fetchAppointments = () => {
  setLoading(true);
  getAPICall('/api/getAppointments')
    
    .then((json) => {
      // Extract appointments array from response
      if (json.appointments) {
        setData(json.appointments);
        setFilteredData(json.appointments);
      } else {
        console.error("Invalid response format: ", json);
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    });
};


  const cancelAppointment = async (phone) => {
    try {
      const response = await post('/api/cancel-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json();

      if (response.ok) {
        // alert('Appointment cancelled successfully.');
        // Refresh data immediately after successful cancellation
        fetchAppointments();
      } else {
        alert(result.message || 'Failed to cancel appointment.');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('An error occurred while cancelling the appointment.');
    }
  };

  const currentItems = filteredData;

  const total = data.length;
  const confirmed = data.filter(item => item.status === '0').length;
  const cancelled = data.filter(item => item.status === '1').length;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '0rem 0'
    }}>

      <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <CModalHeader onClose={() => setShowConfirmModal(false)}>
          Confirm Cancellation
        </CModalHeader>
        <CModalBody>
          Are you sure you want to cancel this appointment?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowConfirmModal(false)}>
            No
          </CButton>
          <CButton
            color="danger"
            className="text-white"
            onClick={() => {
              cancelAppointment(selectedPhone);
              setShowConfirmModal(false);
            }}
          >
            Yes, Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      <CContainer fluid className="sm:px-4">
        {/* Header */}
        <CRow className="mb-4">
          <CCol>
            <CCard className="border-0 shadow-lg" style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <CCardBody className="py-4">
                <div className="d-flex align-items-center">
                  <div className="me-3 p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h2 className="mb-1 fw-bold">Appointments Dashboard</h2>
                    <p className="mb-0 opacity-75">Manage and track all patient appointments</p>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Stats Cards */}
        <CRow className="mb-4 g-4">
          <CCol xs={12} sm={6} lg={3}>
            <CCard className="border-0 shadow-sm h-100" style={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white'
            }}>
              <CCardBody className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="fs-6 opacity-75 mb-1">Total Appointments</div>
                  <div className="fs-2 fw-bold">{total}</div>
                </div>
                <div className="p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <Activity size={32} />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          
          <CCol xs={12} sm={6} lg={3}>
            <CCard className="border-0 shadow-sm h-100" style={{ 
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white'
            }}>
              <CCardBody className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="fs-6 opacity-75 mb-1">Active</div>
                  <div className="fs-2 fw-bold">{confirmed}</div>
                </div>
                <div className="p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <CheckCircle size={32} />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          
          <CCol xs={12} sm={6} lg={3}>
            <CCard className="border-0 shadow-sm h-100" style={{ 
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white'
            }}>
              <CCardBody className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="fs-6 opacity-75 mb-1">Cancelled</div>
                  <div className="fs-2 fw-bold">{cancelled}</div>
                </div>
                <div className="p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <AlertCircle size={32} />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          
          <CCol xs={12} sm={6} lg={3}>
            <CCard className="border-0 shadow-sm h-100" style={{ 
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              color: '#333'
            }}>
              <CCardBody className="p-1">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <div>
                    <div className="fs-6 opacity-75 mb-1">Export Reports</div>
                   
                  </div>
                  {/* <div className="p-0 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.4)' }}> */}
                    <Download size={18} />
                  {/* </div> */}
                </div>
                
                <div className="mb-1">
                  <div className=" mb-1">
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                      className="form-control form-control-sm"
                      style={{ fontSize: '0.75rem' }}
                    />
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                      className="form-control form-control-sm"
                      style={{ fontSize: '0.75rem' }}
                    />
                  </div>
                  
                  <div className="d-flex gap-1">
                    <CButton 
                      size="sm" 
                      color="success"
                      className="text-white flex-fill"
                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                      onClick={() => {
                        fetchExportData().then(() => {
                          exportToExcel();
                        });
                      }}
                    >
                      <FileText size={12} className="me-1" />
                      Excel
                    </CButton>
                    <CButton 
                      size="sm" 
                      color="danger"
                      className="text-white flex-fill"
                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                     onClick={() => {
  fetchExportData1().then((data) => {
    exportToPDF(data); // pass fresh data directly
  });
}}
                    >
                      <FileText size={12} className="me-1" />
                      PDF
                    </CButton>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Search and Filter */}
        <CRow className="mb-4">
          <CCol>
            <CCard className="border-0 shadow-sm">
              <CCardBody>
                <CRow className="g-3">
                  <CCol md={8}>
                    <CInputGroup>
                      <CInputGroupText>
                        <Search size={16} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Search by name, service, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md={4}>
                    <CInputGroup>
                      <CInputGroupText>
                        <Filter size={16} />
                      </CInputGroupText>
                      <CFormSelect
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="0">Active</option>
                        <option value="1">Cancelled</option>
                      </CFormSelect>
                    </CInputGroup>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Main Table */}
        <CCard className="border-0 shadow-lg ">
          <CCardHeader className="bg-white border-bottom-0 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <CCardTitle className="mb-0 d-flex align-items-center">
                  <Calendar className="me-2" size={20} />
                  Appointments List 
                </CCardTitle>
                <div className="mt-2" style={{ height: '2px', backgroundColor: '#e2e8f0', width: '100%' }}></div>
              </div>
              
              {/* Date Filter Buttons */}
              <CButtonGroup>
                <CButton
                  color={dateFilter === 'today' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setDateFilter('today')}
                  className={dateFilter === 'today' ? 'text-white' : ''}
                >
                  Today
                </CButton>
                <CButton
                  color={dateFilter === 'tomorrow' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setDateFilter('tomorrow')}
                  className={dateFilter === 'tomorrow' ? 'text-white' : ''}
                >
                  Tomorrow
                </CButton>
                <CButton
                  color={dateFilter === 'all' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setDateFilter('all')}
                  className={dateFilter === 'all' ? 'text-white' : ''}
                >
                  All
                </CButton>
              </CButtonGroup>
            </div>
          </CCardHeader>
          <CCardBody className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <CSpinner color="primary" className="mb-3" />
                <div className="text-muted">Loading appointments...</div>
              </div>
            ) : (
              <>
               <div  ref={tableRef}
               style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  <CTable hover className="mb-0">
                  <CTableHead style={{ 
  backgroundColor: '#f8f9fa',
  position: 'sticky',
  top: 0,
  zIndex: 2 
}}>
                      <CTableRow>
                        <CTableHeaderCell className="fw-semibold">SR</CTableHeaderCell>
                        <CTableHeaderCell className="fw-semibold">
                          <User size={16} className="me-1" />
                          Patient
                        </CTableHeaderCell>
                        <CTableHeaderCell className="fw-semibold">
                          <Calendar size={16} className="me-1" />
                          Date
                        </CTableHeaderCell>
                        <CTableHeaderCell className="fw-semibold">
                          <Clock size={16} className="me-1" />
                          Time
                        </CTableHeaderCell>
                        <CTableHeaderCell className="fw-semibold">
                          <Phone size={16} className="me-1" />
                          Phone
                        </CTableHeaderCell>
                        <CTableHeaderCell className="fw-semibold">Status</CTableHeaderCell>
                        <CTableHeaderCell className="fw-semibold">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {currentItems.length === 0 ? (
                        <CTableRow>
                          <CTableDataCell colSpan={7} className="text-center py-5">
                            <div className="text-muted">
                              <Calendar size={48} className="mb-3 opacity-25" />
                              <div className="fs-5 fw-medium mb-2">No appointments found</div>
                              <div className="small">Try adjusting your search criteria</div>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ) : (
                        (() => {
                          // Group appointments by time period
                          const groupedAppointments = {
                            morning: [],
                            afternoon: [],
                            night: [],
                            canceled: []
                          };

                          currentItems.forEach(item => {
                            const time = item.time;
                            const hour = parseInt(time.split(':')[0]);
                            const isPM = time.toLowerCase().includes('pm');
                            const hour24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);

                              // Check for 0:00 (or midnight-style) time
  if (item.status === '1') {
    groupedAppointments.canceled.push(item);
    return;
  }

                            if (hour24 >= 6 && hour24 < 12) {
                              groupedAppointments.morning.push(item);
                            } else if (hour24 >= 12 && hour24 < 18) {
                              groupedAppointments.afternoon.push(item);
                            } else {
                              groupedAppointments.night.push(item);
                            }
                          });

                          const renderAppointmentRows = (appointments) => {
                            return appointments.map((item) => (
                              <CTableRow key={item.id} className="align-middle">
                                <CTableDataCell>
                                  <CBadge color="light" className="text-dark px-2 py-1">
                                    #{item.id}
                                  </CBadge>
                                </CTableDataCell>
                                <CTableDataCell>
                                  <div className="d-flex align-items-center">
                                    <div 
                                      className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                                      style={{ 
                                        width: '40px', 
                                        height: '40px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white'
                                      }}
                                    >
                                      <User size={20} />
                                    </div>
                                    <div>
                                      <div className="fw-medium">{item.name}</div>
                                    </div>
                                  </div>
                                </CTableDataCell>
                                <CTableDataCell>{new Date(item.date).toLocaleDateString()}</CTableDataCell>
                                <CTableDataCell>{item.time}</CTableDataCell>
                                <CTableDataCell>
                                  <span className="text-muted small">{item.phone}</span>
                                </CTableDataCell>
                                <CTableDataCell>{getStatusBadge2(item.status)}</CTableDataCell>
                                <CTableDataCell>
                                  <CButtonGroup size="sm">
                                    <CTableDataCell>
                                      <CButton
                                        color="danger"
                                        size="sm"
                                         className="text-white"
                                        onClick={() => {  setSelectedPhone(item.phone);setShowConfirmModal(true)
                                        }}
                                        
                                      >
                                        Cancel
                                      </CButton>
                                    </CTableDataCell>
                                  </CButtonGroup>
                                </CTableDataCell>
                              </CTableRow>
                            ));
                          };

                          const renderTimeSection = (title, appointments, bgColor, textColor, icon) => {
                            if (appointments.length === 0) return null;
                            
                            return (
                              <>
                                <CTableRow>
                                  <CTableDataCell 
                                    colSpan={7} 
                                    className={`text-center fw-bold py-3 ${bgColor} ${textColor}`}
                                    style={{ fontSize: '1.1rem' }}
                                  >
                                    {icon} {title} ({appointments.length} appointments)
                                  </CTableDataCell>
                                </CTableRow>
                                {renderAppointmentRows(appointments)}
                              </>
                            );
                          };

                          return (
                            <>
                              {renderTimeSection(
                                "Morning Appointments", 
                                groupedAppointments.morning,
                                "bg-warning bg-opacity-10",
                                "text-warning-emphasis",
                                "🌅"
                              )}
                              {renderTimeSection(
                                "Afternoon Appointments", 
                                groupedAppointments.afternoon,
                                "bg-info bg-opacity-10",
                                "text-info-emphasis",
                                "☀️"
                              )}
                              {renderTimeSection(
                                "Night Appointments", 
                                groupedAppointments.night,
                                "bg-primary bg-opacity-10",
                                "text-primary-emphasis",
                                "🌙"
                              )}
                              {renderTimeSection(
      "Canceled Appointments",
      groupedAppointments.canceled,
      "bg-danger bg-opacity-10",
      "text-danger-emphasis",
      "🚫"
    )}
                            </>
                          );
                        })()
                      )}
                    </CTableBody>
                  </CTable>
                </div>
              </>
            )}
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  );
}

export default AppointmentsTable;