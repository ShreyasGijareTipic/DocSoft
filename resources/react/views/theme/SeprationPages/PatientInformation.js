import React, { useEffect, useState } from 'react';
import { CRow, CCol, CFormLabel, CFormInput, CListGroup, CListGroupItem } from '@coreui/react';
import { getAPICall } from '../../../util/api';

const PatientInformation = ({
  patientName, setPatientName, patientAddress, setPatientAddress, email, setEmail,
  phone, setContactNumber, dob, setDob, occupation, setOccupation, pincode, setPincode,
  visitDate, setVisitDate, patientSuggestionId, setPatientSuggestionId, data, errors
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSuggestionClicked, setIsSuggestionClicked] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (patientName.length >= 2 && !isSuggestionClicked) {
        try {
          const response = await getAPICall(`/api/suggestionPatient?query=${patientName}`);
          const filtered = response.filter(p => p.id !== selectedPatient?.id);
          setSuggestions(filtered);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
      setIsSuggestionClicked(false);
    };

    fetchSuggestions();
  }, [patientName, isSuggestionClicked, selectedPatient]);

  const handleSuggestionClick = async (patient) => {
    setPatientSuggestionId(patient.id);
    setPatientName(patient.name);
    setPatientAddress(patient.address);
    setContactNumber(patient.phone);
    setEmail(patient.email);
    setOccupation(patient.occupation);
    setPincode(patient.pincode);
    setDob(patient.dob);
    setIsSuggestionClicked(true);
    setSuggestions([]);
  };

  return (
    <div className="mb-2 mt-2" style={{ backgroundColor: 'light' }}>
      <CRow className="p-3 space-y-3 md:space-y-0">
        <CCol xs={12} md={6}>
          <div className="flex flex-col md:flex-row items-start gap-2 relative">
            <CFormLabel className="fw-semibold min-w-[120px]">👤 Patient Name</CFormLabel>
            <div className="w-full relative">
              <CFormInput
                value={patientName || data?.patient?.name || data?.appointment?.name || ''}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name"
                required
              />
              {Array.isArray(suggestions) && suggestions.length > 0 && !selectedPatient && (
                <CListGroup className="absolute top-full left-0 right-0 z-50 shadow bg-white rounded mt-1 max-h-48 overflow-y-auto">
                  {suggestions.map((patient) => (
                    <CListGroupItem
                      key={patient.id}
                      onClick={() => handleSuggestionClick(patient)}
                      className="cursor-pointer text-sm py-2 border-0 border-b hover:bg-gray-100"
                    >
                      {patient.name}
                    </CListGroupItem>
                  ))}
                </CListGroup>
              )}
              {errors.patientName && (
                <div className="text-danger mt-1 text-sm">{errors.patientName}</div>
              )}
            </div>
          </div>
        </CCol>
        <CCol xs={12} md={6}>
          <div className="flex flex-col md:flex-row items-start gap-2">
            <CFormLabel className="fw-semibold min-w-[120px]">💼 Occupation</CFormLabel>
            <div className="w-full">
              <CFormInput
                value={occupation || data?.patient?.occupation || ''}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="Occupation"
                required
              />
              {errors.occupation && (
                <div className="text-danger mt-1 text-sm">{errors.occupation}</div>
              )}
            </div>
          </div>
        </CCol>
        <CCol xs={12} md={6} lg={3}>
          <CFormLabel className="fw-semibold">📱 Mobile Number</CFormLabel>
          <CFormInput
            type="tel"
            value={phone || data?.patient?.phone || data?.appointment?.phone || ''}
            onChange={(e) => setContactNumber(e.target.value)}
            onInput={(e) => {
              if (e.target.value.length > 10) {
                e.target.value = e.target.value.slice(0, 10);
              }
            }}
            placeholder="Enter contact number"
            required
          />
          {errors.phone && <div className="text-danger mt-1 text-sm">{errors.phone}</div>}
        </CCol>
        <CCol xs={12} md={6} lg={3}>
          <CFormLabel className="fw-semibold">📧 Email</CFormLabel>
          <CFormInput
            type="email"
            value={email || data?.patient?.email || ''}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            required
          />
          {errors.email && <div className="text-danger mt-1 text-sm">{errors.email}</div>}
        </CCol>
        <CCol xs={12} md={6} lg={3}>
          <CFormLabel className="fw-semibold">🎂 Patient DOB</CFormLabel>
          <CFormInput
            type="date"
            value={data?.patient?.dob ? new Date(data.patient.dob).toISOString().split('T')[0] : dob || ''}
            onChange={(e) => {
              const input = e.target.value;
              const selectedDate = new Date(input);
              const currentDate = new Date();
              const year = selectedDate.getFullYear();
              if (year >= 1900 && selectedDate <= currentDate) {
                setDob(input);
                if (errors.dob) {
                  setErrors((prev) => ({ ...prev, dob: '' }));
                }
              } else {
                setDob('');
                setErrors((prev) => ({ ...prev, dob: 'Please enter a valid DOB (not in the future & after 1900).' }));
              }
            }}
            max={new Date().toISOString().split('T')[0]}
            required
          />
          {errors.dob && <div className="text-danger mt-1 text-sm">{errors.dob}</div>}
        </CCol>
        <CCol xs={12} md={6} lg={3}>
          <CFormLabel className="fw-semibold">📅 Visit Date</CFormLabel>
          <CFormInput
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            required
          />
          {errors.visitDate && <div className="text-danger mt-1 text-sm">{errors.visitDate}</div>}
        </CCol>
        <CCol xs={12} md={6}>
          <div className="flex flex-col md:flex-row items-start gap-2">
            <CFormLabel className="fw-semibold min-w-[120px]">🏠 Patient Address</CFormLabel>
            <div className="w-full">
              <CFormInput
                value={patientAddress || data?.patient?.address || ''}
                onChange={(e) => setPatientAddress(e.target.value)}
                placeholder="Full Address / Pincode"
                required
              />
              {errors.patientAddress && (
                <div className="text-danger mt-1 text-sm">{errors.patientAddress}</div>
              )}
            </div>
          </div>
        </CCol>
        <CCol xs={12} md={6}>
          <div className="flex flex-col md:flex-row items-start gap-2">
            <CFormLabel className="fw-semibold min-w-[120px]">📮 Pincode</CFormLabel>
            <div className="w-full">
              <CFormInput
                value={pincode || data?.patient?.pincode || ''}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode"
                required
              />
              {errors.pincode && (
                <div className="text-danger mt-1 text-sm">{errors.pincode}</div>
              )}
            </div>
          </div>
        </CCol>
      </CRow>
    </div>
  );
};

export default PatientInformation;