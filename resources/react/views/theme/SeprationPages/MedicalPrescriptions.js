// import React, { useState, useEffect } from 'react';
// import {
//   CCardBody, CRow, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormInput, CFormSelect, CButton, CIcon
// } from '@coreui/react';
// import { cilMedicalCross, cilDelete, cilPlus } from '@coreui/icons';
// import { getAPICall } from '../../../util/api';

// const MedicalPrescriptions = ({ rowss, setRowss, rowErrors, setRowErrors }) => {
//   const [showTable, setShowTable] = useState(false);
//   const [medicines, setMedicines] = useState(null);
//   const [medicineSearch, setMedicineSearch] = useState({});
//   const [medicineOptions, setMedicineOptions] = useState({});
//   const [suggestionFlags, setSuggestionFlags] = useState({});
//   const [activeEditableRowIndex, setActiveEditableRowIndex] = useState(null);

//   useEffect(() => {
//     const fetchMedicines = async () => {
//       try {
//         const response = await getAPICall('/api/drugs');
//         if (response) {
//           setMedicines(response);
//         } else {
//           console.warn('Unexpected response structure:', response);
//         }
//       } catch (error) {
//         console.error('Error fetching medicines:', error);
//       }
//     };
//     fetchMedicines();
//   }, []);

//   const handleAddRoww = () => {
//     setRowss([
//       ...rowss,
//       {
//         description: "", strength: "", dosage: "", timing: "", frequency: "", duration: "", isCustom: false, price: "", drugDetails: [],
//       },
//     ]);
//   };

//   const handleRemoveRoww = (index) => {
//     const updatedRows = rowss.filter((_, i) => i !== index);
//     setRowss(updatedRows);
//   };

//   const handleRowChangee = (index, field, value) => {
//     const updatedRows = [...rowss];
//     updatedRows[index][field] = value;
//     setRowss(updatedRows);
//   };

//   const handleMedicineSearch = (index, searchText) => {
//     setMedicineSearch((prev) => ({ ...prev, [index]: searchText }));
//     if (searchText.length < 2) {
//       setMedicineOptions((prev) => ({ ...prev, [index]: [] }));
//       return;
//     }
//     const filtered = medicines?.filter((med) => med.drug_name.toLowerCase().includes(searchText.toLowerCase())) || [];
//     setMedicineOptions((prev) => ({ ...prev, [index]: filtered }));
//   };

//   const handleMedicineChange = async (index, drugId) => {
//     try {
//       const responsee = await getAPICall(`/api/drugdetails/drug_id/${drugId}`);
//       setRowss((prevRows) => {
//         const updatedRows = [...prevRows];
//         updatedRows[index].drugDetails = responsee;
//         return updatedRows;
//       });
//     } catch (error) {
//       console.error('Error fetching drug details:', error);
//     }
//   };

//   const toggleSuggestion = (index, type, value) => {
//     setSuggestionFlags((prev) => ({
//       ...prev,
//       [index]: { ...prev[index], [type]: value },
//     }));
//   };

//   const validateField = (index, fieldName) => {
//     const row = rowss[index];
//     const errors = { ...rowErrors };
//     if (!errors[index]) errors[index] = {};

//     switch (fieldName) {
//       case 'strength':
//         if (!row.strength) {
//           errors[index].strength = 'Strength is required';
//         } else {
//           delete errors[index].strength;
//         }
//         break;
//       case 'dosage':
//         const trimmedDosage = String(row.dosage).trim();
//         if (!trimmedDosage) {
//           errors[index].dosage = 'Dosage is required';
//         } else if (!/^[01]-[01]-[01]$/.test(trimmedDosage)) {
//           errors[index].dosage = 'Invalid dosage format. Use format like 1-0-1';
//         } else {
//           delete errors[index].dosage;
//         }
//         break;
//       case 'timing':
//         if (!row.timing) {
//           errors[index].timing = 'Timing is required';
//         } else {
//           delete errors[index].timing;
//         }
//         break;
//       case 'frequency':
//         if (!row.frequency) {
//           errors[index].frequency = 'Frequency is required';
//         } else {
//           delete errors[index].frequency;
//         }
//         break;
//       case 'duration':
//         if (!row.duration) {
//           errors[index].duration = 'Duration is required';
//         } else {
//           delete errors[index].duration;
//         }
//         break;
//       case 'price':
//         if (!row.price && !row.drugDetails?.[0]?.price) {
//           errors[index].price = 'Price is required';
//         } else {
//           delete errors[index].price;
//         }
//         break;
//     }

//     if (Object.keys(errors[index]).length === 0) {
//       delete errors[index];
//     }
//     setRowErrors(errors);
//   };

//   const clearFieldError = (index, fieldName) => {
//     setRowErrors(prev => {
//       const updated = { ...prev };
//       if (updated[index]) {
//         delete updated[index][fieldName];
//         if (Object.keys(updated[index]).length === 0) {
//           delete updated[index];
//         }
//       }
//       return updated;
//     });
//   };

//   const totalPrice = rowss.reduce((acc, row) => {
//     let value = row.price || row.drugDetails?.[0]?.price;
//     if (!value || isNaN(parseFloat(value))) {
//       value = row.drugDetails?.[0]?.price;
//     }
//     const price = parseFloat(value);
//     return acc + (isNaN(price) ? 0 : price);
//   }, 0);

//   return (
//     <div>
//       {!showTable && (
//         <div className="d-flex flex-column flex-md-row justify-content-start align-items-start align-items-md-center gap-0 mb-2">
//           <div className="d-flex align-items-center me-md-3 mb-2 mb-md-0" style={{ width: '200px' }}>
//             <div className="d-flex align-items-center justify-content-center bg-white border border-primary me-2" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
//               <CIcon icon={cilMedicalCross} size="lg" className="text-primary" />
//             </div>
//             <h6 className="mb-0 fw-semibold">Medical Prescriptions</h6>
//           </div>
//           <div className="w-md-auto" style={{ width: '260px' }}>
//             <CButton
//               color="light"
//               className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-4 w-100 w-md-auto"
//               onClick={() => setShowTable(true)}
//               style={{ border: '2px solid #4B0082', backgroundColor: 'white', transition: 'background-color 0.3s' }}
//               onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E6DEFA'}
//               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
//             >
//               <span style={{ color: '#4B0082' }}>
//                 💊 {showTable ? 'Close' : 'Add Prescriptions'}
//               </span>
//             </CButton>
//           </div>
//         </div>
//       )}
//       {showTable && (
//         <>
//           <div className="ms-auto">
//             <CButton
//               color="light"
//               className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded rounded-4"
//               onClick={() => {
//                 if (showTable) {
//                   setShowTable(false);
//                   setRowss([{ description: '', strength: '', dosage: '', timing: '', frequency: '', duration: '', price: '', isCustom: false, drugDetails: [] }]);
//                   setRowErrors([]);
//                   setMedicineSearch({});
//                   setMedicineOptions({});
//                   setSuggestionFlags({});
//                   setActiveEditableRowIndex(null);
//                 } else {
//                   setShowTable(true);
//                 }
//               }}
//               style={{ border: '2px solid #4B0082', backgroundColor: 'white', transition: 'background-color 0.3s' }}
//               onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E6DEFA'}
//               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
//             >
//               <span style={{ color: '#4B0082' }}>
//                 💊 {showTable ? 'Close Prescriptions' : 'Add Prescriptions'}
//               </span>
//             </CButton>
//           </div>
//           <CCardBody className="rounded shadow-sm bg-white p-2 mt-2 border border-gray-200">
//             <div className="d-none d-lg-block">
//               <CTable responsive className="table-borderless align-middle" style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
//                 <CTableHead className="bg-light text-center text-nowrap text-dark fw-semibold">
//                   <CTableRow>
//                     {['Medicine', 'Strength', 'Dosage', 'Timing', 'Frequency', 'Duration', 'Price (₹)', 'Actions'].map((header) => (
//                       <CTableHeaderCell key={header} style={{ width: `${100 / 8}%` }}>{header}</CTableHeaderCell>
//                     ))}
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {rowss.map((row, index) => (
//                     <CTableRow key={index} className="bg-white rounded">
//                       <CTableDataCell className="px-2 py-2 position-relative">
//                         <CFormInput
//                           type="text"
//                           value={medicineSearch[index] || ''}
//                           onChange={(e) => handleMedicineSearch(index, e.target.value)}
//                           onBlur={() => validateField(index, 'description')}
//                           placeholder="Search medicine..."
//                           autoComplete="off"
//                         />
//                         {medicineOptions[index]?.length > 0 && (
//                           <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', zIndex: 2000, width: '100%', border: '1px solid #ccc', borderTop: 'none', borderRadius: '0 0 6px 6px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', overflowY: 'auto' }}>
//                             {medicineOptions[index].map((medicine) => (
//                               <div
//                                 key={medicine.id}
//                                 className="d-flex justify-content-center align-items-center"
//                                 style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #f1f1f1', transition: 'background 0.2s ease', textAlign: 'center', fontSize: '0.95rem', fontWeight: 500 }}
//                                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
//                                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
//                                 onClick={() => {
//                                   handleRowChangee(index, 'description', medicine.id);
//                                   handleMedicineChange(index, medicine.id);
//                                   setMedicineSearch((prev) => ({ ...prev, [index]: medicine.drug_name }));
//                                   setMedicineOptions((prev) => ({ ...prev, [index]: [] }));
//                                   clearFieldError(index, 'description');
//                                 }}
//                               >
//                                 {medicine.drug_name}
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                         {rowErrors[index]?.description && <div className="text-danger small mt-1">{rowErrors[index].description}</div>}
//                       </CTableDataCell>
//                       <CTableDataCell className="px-2 py-3 position-relative">
//                         <CFormInput
//                           value={row.strength}
//                           onChange={(e) => {
//                             const value = e.target.value;
//                             handleRowChangee(index, 'strength', value);
//                             toggleSuggestion(index, 'showStrength', false);
//                           }}
//                           onFocus={() => {
//                             if (!row.strength) {
//                               toggleSuggestion(index, 'showStrength', true);
//                             }
//                           }}
//                           onBlur={() => validateField(index, 'strength')}
//                           placeholder="Strength"
//                           disabled={!row.description}
//                         />
//                         {suggestionFlags[index]?.showStrength &&
//                           row.drugDetails?.filter((d) => d.drug_id === parseInt(row.description, 10))?.slice(0, 5).map((drug, i) => (
//                             <div
//                               key={i}
//                               className="position-absolute w-100 bg-white border shadow-sm mt-1 px-2 py-1 rounded cursor-pointer"
//                               style={{ zIndex: 2000 }}
//                               onClick={() => {
//                                 handleRowChangee(index, 'strength', drug.strength);
//                                 toggleSuggestion(index, 'showStrength', false);
//                                 clearFieldError(index, 'strength');
//                               }}
//                             >
//                               {drug.strength}
//                             </div>
//                           ))}
//                         {rowErrors[index]?.strength && <div className="text-danger small mt-1">{rowErrors[index].strength}</div>}
//                       </CTableDataCell>
//                       )}
//                       export Deafualt MedicalPrescriptions;


// At the top: all imports as you already wrote
import React, { useState, useEffect } from 'react';
import {
  CCardBody, CRow, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormInput, CButton
} from '@coreui/react';
import { cilMedicalCross, cilDelete } from '@coreui/icons';
import { getAPICall } from '../../../util/api';

const MedicalPrescriptions = ({ rowss, setRowss, rowErrors, setRowErrors }) => {
    const [showTable, setShowTable] = useState(false);
  const [medicines, setMedicines] = useState(null);
  const [medicineSearch, setMedicineSearch] = useState({});
  const [medicineOptions, setMedicineOptions] = useState({});
  const [suggestionFlags, setSuggestionFlags] = useState({});
  const [activeEditableRowIndex, setActiveEditableRowIndex] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await getAPICall('/api/drugs');
        if (response) {
          setMedicines(response);
        } else {
          console.warn('Unexpected response structure:', response);
        }
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };
    fetchMedicines();
  }, []);

  const handleAddRoww = () => {
    setRowss([
      ...rowss,
      {
        description: "", strength: "", dosage: "", timing: "", frequency: "", duration: "", isCustom: false, price: "", drugDetails: [],
      },
    ]);
  };

  const handleRemoveRoww = (index) => {
    const updatedRows = rowss.filter((_, i) => i !== index);
    setRowss(updatedRows);
  };

  const handleRowChangee = (index, field, value) => {
    const updatedRows = [...rowss];
    updatedRows[index][field] = value;
    setRowss(updatedRows);
  };

  const handleMedicineSearch = (index, searchText) => {
    setMedicineSearch((prev) => ({ ...prev, [index]: searchText }));
    if (searchText.length < 2) {
      setMedicineOptions((prev) => ({ ...prev, [index]: [] }));
      return;
    }
    const filtered = medicines?.filter((med) => med.drug_name.toLowerCase().includes(searchText.toLowerCase())) || [];
    setMedicineOptions((prev) => ({ ...prev, [index]: filtered }));
  };

  const handleMedicineChange = async (index, drugId) => {
    try {
      const responsee = await getAPICall(`/api/drugdetails/drug_id/${drugId}`);
      setRowss((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[index].drugDetails = responsee;
        return updatedRows;
      });
    } catch (error) {
      console.error('Error fetching drug details:', error);
    }
  };

  const toggleSuggestion = (index, type, value) => {
    setSuggestionFlags((prev) => ({
      ...prev,
      [index]: { ...prev[index], [type]: value },
    }));
  };

  const validateField = (index, fieldName) => {
    const row = rowss[index];
    const errors = { ...rowErrors };
    if (!errors[index]) errors[index] = {};

    switch (fieldName) {
      case 'strength':
        if (!row.strength) {
          errors[index].strength = 'Strength is required';
        } else {
          delete errors[index].strength;
        }
        break;
      case 'dosage':
        const trimmedDosage = String(row.dosage).trim();
        if (!trimmedDosage) {
          errors[index].dosage = 'Dosage is required';
        } else if (!/^[01]-[01]-[01]$/.test(trimmedDosage)) {
          errors[index].dosage = 'Invalid dosage format. Use format like 1-0-1';
        } else {
          delete errors[index].dosage;
        }
        break;
      case 'timing':
        if (!row.timing) {
          errors[index].timing = 'Timing is required';
        } else {
          delete errors[index].timing;
        }
        break;
      case 'frequency':
        if (!row.frequency) {
          errors[index].frequency = 'Frequency is required';
        } else {
          delete errors[index].frequency;
        }
        break;
      case 'duration':
        if (!row.duration) {
          errors[index].duration = 'Duration is required';
        } else {
          delete errors[index].duration;
        }
        break;
      case 'price':
        if (!row.price && !row.drugDetails?.[0]?.price) {
          errors[index].price = 'Price is required';
        } else {
          delete errors[index].price;
        }
        break;
    }

    if (Object.keys(errors[index]).length === 0) {
      delete errors[index];
    }
    setRowErrors(errors);
  };

  const clearFieldError = (index, fieldName) => {
    setRowErrors(prev => {
      const updated = { ...prev };
      if (updated[index]) {
        delete updated[index][fieldName];
        if (Object.keys(updated[index]).length === 0) {
          delete updated[index];
        }
      }
      return updated;
    });
  };

  const totalPrice = rowss.reduce((acc, row) => {
    let value = row.price || row.drugDetails?.[0]?.price;
    if (!value || isNaN(parseFloat(value))) {
      value = row.drugDetails?.[0]?.price;
    }
    const price = parseFloat(value);
    return acc + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <div>
      {!showTable && (
        <div className="d-flex flex-column flex-md-row justify-content-start align-items-start align-items-md-center gap-0 mb-2">
          <div className="d-flex align-items-center me-md-3 mb-2 mb-md-0" style={{ width: '200px' }}>
            <div className="d-flex align-items-center justify-content-center bg-white border border-primary me-2" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
              {/* <CIcon icon={cilMedicalCross} size="lg" className="text-primary" /> */}
            </div>
            <h6 className="mb-0 fw-semibold">Medical Prescriptions</h6>
          </div>
          <div className="w-md-auto" style={{ width: '260px' }}>
            <CButton
              color="light"
              className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-4 w-100 w-md-auto"
              onClick={() => setShowTable(true)}
              style={{ border: '2px solid #4B0082', backgroundColor: 'white', transition: 'background-color 0.3s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E6DEFA'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <span style={{ color: '#4B0082' }}>💊 Add Prescriptions</span>
            </CButton>
          </div>
        </div>
      )}

      {showTable && (
        <>
          <div className="ms-auto">
            <CButton
              color="light"
              className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded rounded-4"
              onClick={() => {
                setShowTable(false);
                setRowss([{ description: '', strength: '', dosage: '', timing: '', frequency: '', duration: '', price: '', isCustom: false, drugDetails: [] }]);
                setRowErrors([]);
                setMedicineSearch({});
                setMedicineOptions({});
                setSuggestionFlags({});
                setActiveEditableRowIndex(null);
              }}
              style={{ border: '2px solid #4B0082', backgroundColor: 'white', transition: 'background-color 0.3s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E6DEFA'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <span style={{ color: '#4B0082' }}>💊 Close Prescriptions</span>
            </CButton>
          </div>

          <CCardBody className="rounded shadow-sm bg-white p-2 mt-2 border border-gray-200">
            <CTable responsive className="table-borderless align-middle" style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
              <CTableHead className="bg-light text-center text-nowrap text-dark fw-semibold">
                <CTableRow>
                  {['Medicine', 'Strength', 'Dosage', 'Timing', 'Frequency', 'Duration', 'Price (₹)', 'Actions'].map((header) => (
                    <CTableHeaderCell key={header}>{header}</CTableHeaderCell>
                  ))}
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {rowss.map((row, index) => (
                  <CTableRow key={index}>
                    {/* Medicine Input */}
                    <CTableDataCell>
                      <CFormInput
                        type="text"
                        value={medicineSearch[index] || ''}
                        onChange={(e) => handleMedicineSearch(index, e.target.value)}
                        onBlur={() => validateField(index, 'description')}
                        placeholder="Search medicine..."
                      />
                      {/* Medicine suggestions dropdown */}
                      {medicineOptions[index]?.length > 0 && (
                        <div style={{ position: 'absolute', backgroundColor: 'white', zIndex: 10, border: '1px solid #ccc', width: '100%' }}>
                          {medicineOptions[index].map((med) => (
                            <div
                              key={med.id}
                              onClick={() => {
                                handleRowChangee(index, 'description', med.id);
                                handleMedicineChange(index, med.id);
                                setMedicineSearch((prev) => ({ ...prev, [index]: med.drug_name }));
                                setMedicineOptions((prev) => ({ ...prev, [index]: [] }));
                                clearFieldError(index, 'description');
                              }}
                              style={{ padding: '5px', cursor: 'pointer' }}
                            >
                              {med.drug_name}
                            </div>
                          ))}
                        </div>
                      )}
                      {rowErrors[index]?.description && <div className="text-danger small mt-1">{rowErrors[index].description}</div>}
                    </CTableDataCell>

                    {/* Strength */}
                    <CTableDataCell>
                      <CFormInput
                        value={row.strength}
                        onChange={(e) => {
                          handleRowChangee(index, 'strength', e.target.value);
                          toggleSuggestion(index, 'showStrength', false);
                        }}
                        onBlur={() => validateField(index, 'strength')}
                        placeholder="Strength"
                      />
                      {rowErrors[index]?.strength && <div className="text-danger small mt-1">{rowErrors[index].strength}</div>}
                    </CTableDataCell>

                    {/* Add other cells here: dosage, timing, frequency, duration, price */}
                    {/* Example: Price */}
                    <CTableDataCell>
                      <CFormInput
                        value={row.price}
                        onChange={(e) => handleRowChangee(index, 'price', e.target.value)}
                        onBlur={() => validateField(index, 'price')}
                        placeholder="₹"
                      />
                      {rowErrors[index]?.price && <div className="text-danger small mt-1">{rowErrors[index].price}</div>}
                    </CTableDataCell>

                    {/* Actions */}
                    <CTableDataCell>
                      <CButton color="danger" size="sm" onClick={() => handleRemoveRoww(index)}>
                        {/* <CIcon icon={cilDelete} /> */}
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            {/* Add New Row Button */}
            <div className="mt-3">
              <CButton color="primary" onClick={handleAddRoww}>
                {/* <CIcon icon={cilMedicalCross} className="me-2" /> Add Row */}
              </CButton>
            </div>

            {/* Show total */}
            <div className="text-end mt-4">
              <h6>Total Price: ₹ {totalPrice.toFixed(2)}</h6>
            </div>
          </CCardBody>
        </>
      )}
    </div>
  );
};

export default MedicalPrescriptions;
