// import React, { useEffect } from 'react';
// import {
//   CCard, CRow, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
//   CFormSelect, CFormInput, CButton
// } from '@coreui/react';
// import { cilDelete, cilPlus } from '@coreui/icons';

// const BillingDetails = ({ rows, setRows, rowErrors, setRowErrors, showGST, setShowGST, rowss, totalPrice }) => {
//   // Fallback to empty array if rows is undefined
//   const safeRows = Array.isArray(rows) ? rows : [];

//   // Handle adding a new row
//   const handleAddRow = () => {
//     const usedDescriptions = safeRows.map((row) => row.description);
//     const allDescriptions = ['Consulting', 'Medicine', 'OPD'];
//     const nextDescription = allDescriptions.find(
//       (desc) => !usedDescriptions.includes(desc)
//     );
//     if (!nextDescription) return;
//     setRows((prevRows) => [
//       ...(Array.isArray(prevRows) ? prevRows : []),
//       { description: nextDescription, quantity: 0, price: 0, gst: 0, total: 0 }
//     ]);
//   };

//   // Handle removing a row
//   const handleRemoveRow = (index) => {
//     if (index === 0) return; // Prevent removing the first row
//     setRows(safeRows.filter((_, i) => i !== index));
//     setRowErrors((prev) => {
//       const updated = [...(Array.isArray(prev) ? prev : [])];
//       updated.splice(index, 1);
//       return updated;
//     });
//   };

//   // Handle row changes
//   const handleRowChange = (index, field, value) => {
//     const updatedRows = [...safeRows];

//     // Forcing correct value types
//     if (field === 'quantity') {
//       if (!Number.isInteger(Number(value)) || isNaN(value)) {
//         value = 0;
//       }
//     } else if ((field === 'price' || field === 'gst') && isNaN(value)) {
//       value = 0;
//     }

//     updatedRows[index] = updatedRows[index] || { description: 'Consulting', quantity: 0, price: 0, gst: 0, total: 0 };
//     updatedRows[index][field] = value;

//     const description = updatedRows[index].description;
//     const quantity = description === 'Medicine' ? (rowss?.length || 0) : parseFloat(updatedRows[index].quantity) || 0;
//     const price = description === 'Medicine' ? (totalPrice || 0) : parseFloat(updatedRows[index].price) || 0;
//     const gst = parseFloat(updatedRows[index].gst) || 0;

//     let subtotal = 0;
//     if (description === 'Medicine') {
//       subtotal = totalPrice || 0;
//     } else {
//       subtotal = quantity * price;
//       if (showGST) {
//         subtotal += subtotal * (gst / 100);
//       }
//     }

//     updatedRows[index].quantity = quantity;
//     updatedRows[index].price = price;
//     updatedRows[index].total = subtotal;

//     setRows(updatedRows);

//     // Error handling
//     const errors = Array.isArray(rowErrors) ? [...rowErrors] : [];
//     if (!errors[index]) errors[index] = {};

//     if (field === 'quantity') {
//       errors[index].quantity = !Number.isInteger(Number(value)) ? 'Only integers allowed' : '';
//     }
//     if (field === 'price') {
//       errors[index].price = isNaN(value) || value < 0 ? 'Invalid price' : '';
//     }
//     if (field === 'gst') {
//       errors[index].gst = isNaN(value) || value < 0 ? 'Invalid GST' : '';
//     }

//     setRowErrors(errors);
//   };

//   // Update Medicine row when rowss or totalPrice changes
//   useEffect(() => {
//     const updatedRows = safeRows.map((row) => {
//       if (row.description === 'Medicine') {
//         const quantity = rowss?.length || 0;
//         const price = totalPrice || 0;
//         let subtotal = price;

//         if (showGST) {
//           const gst = parseFloat(row.gst) || 0;
//           subtotal += subtotal * (gst / 100);
//         }

//         return {
//           ...row,
//           quantity,
//           price,
//           total: subtotal,
//         };
//       }
//       return row;
//     });

//     setRows(updatedRows);
//   }, [rowss, totalPrice, showGST, setRows, safeRows]);

//   // Calculate grand total with fallback
//   const grandTotal = safeRows.length > 0
//     ? safeRows.reduce((acc, row) => acc + parseFloat(row.total || 0), 0).toFixed(2)
//     : '0.00';

//   return (
//     <div className="d-none d-lg-block mt-2">
//       <CCard className="mb-3 px-3 py-3 rounded-4" style={{ backgroundColor: '#FFF9DB' }}>
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <span className="fw-semibold fs-5" style={{ color: '#944C1F' }}>
//             💰 Billing Information
//           </span>
//           <div className="d-flex gap-2">
//             <CButton
//               color="warning"
//               variant={showGST ? 'solid' : 'outline'}
//               className="fw-semibold"
//               onClick={() => setShowGST(true)}
//               style={{ borderRadius: '10px', minWidth: '120px' }}
//             >
//               With Tax
//             </CButton>
//             <CButton
//               color="warning"
//               variant={!showGST ? 'solid' : 'outline'}
//               className="fw-semibold"
//               onClick={() => setShowGST(false)}
//               style={{ borderRadius: '10px', minWidth: '120px' }}
//             >
//               Without Tax
//             </CButton>
//           </div>
//         </div>
//         <CRow>
//           <CTable hover responsive className="table-borderless" style={{ backgroundColor: 'transparent' }}>
//             <CTableHead className="text-center text-sm font-semibold">
//               <CTableRow>
//                 <CTableHeaderCell className="px-2 py-2 fw-semibold">Description</CTableHeaderCell>
//                 <CTableHeaderCell className="px-2 py-2 fw-semibold">Quantity</CTableHeaderCell>
//                 <CTableHeaderCell className="px-2 py-2 fw-semibold">Fees</CTableHeaderCell>
//                 {showGST && (
//                   <CTableHeaderCell className="px-2 py-2 fw-semibold">GST (%)</CTableHeaderCell>
//                 )}
//                 <CTableHeaderCell className="px-2 py-2 fw-semibold">Total</CTableHeaderCell>
//                 <CTableHeaderCell className="px-2 py-2 fw-semibold">Actions</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody className="rounded-4 no-bg" style={{ border: '2px solid #944C1F' }}>
//               {safeRows.map((row, index) => (
//                 <CTableRow key={index} className="align-middle text-center">
//                   <CTableDataCell style={{ width: '16.66%' }}>
//                     <CFormSelect
//                       className="text-center"
//                       value={row.description}
//                       onChange={(e) => handleRowChange(index, 'description', e.target.value)}
//                     >
//                       <option value="Consulting">Consulting</option>
//                       <option value="Medicine">Medicine</option>
//                       <option value="OPD">OPD</option>
//                     </CFormSelect>
//                   </CTableDataCell>
//                   <CTableDataCell style={{ width: '16.66%' }}>
//                     <CFormInput
//                       type="number"
//                       className="text-center"
//                       placeholder="Add Quantity Here"
//                       value={
//                         row.description === 'Medicine'
//                           ? rowss?.length || 0
//                           : row.quantity === 0
//                           ? ''
//                           : row.quantity
//                       }
//                       onChange={(e) => handleRowChange(index, 'quantity', Number(e.target.value))}
//                       onFocus={(e) => {
//                         if (row.description !== 'Medicine' && (row.quantity === 0 || row.quantity === null)) {
//                           handleRowChange(index, 'quantity', '');
//                         }
//                       }}
//                       readOnly={row.description === 'Medicine'}
//                     />
//                     {rowErrors[index]?.quantity && (
//                       <div className="text-danger small">{rowErrors[index].quantity}</div>
//                     )}
//                   </CTableDataCell>
//                   <CTableDataCell style={{ width: '16.66%' }}>
//                     {row.description === 'Medicine' ? (
//                       <CFormInput
//                         type="number"
//                         className="text-center"
//                         value={(totalPrice || 0) === 0 ? '' : (totalPrice || 0).toFixed(2)}
//                         readOnly
//                       />
//                     ) : (
//                       <>
//                         <CFormInput
//                           type="number"
//                           className="text-center"
//                           value={row.price === 0 ? '' : row.price}
//                           onChange={(e) => {
//                             const value = Number(e.target.value);
//                             if (value >= 0) {
//                               handleRowChange(index, 'price', value);
//                             }
//                           }}
//                           onFocus={(e) => {
//                             if (row.price === 0) {
//                               e.target.value = '';
//                               handleRowChange(index, 'price', '');
//                             }
//                           }}
//                           onKeyDown={(e) => {
//                             if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
//                               e.preventDefault();
//                             }
//                           }}
//                           onBlur={(e) => {
//                             const value = Number(e.target.value);
//                             if (value < 0) {
//                               handleRowChange(index, 'price', 0);
//                             }
//                           }}
//                         />
//                         {rowErrors[index]?.price && (
//                           <div className="text-danger small">{rowErrors[index].price}</div>
//                         )}
//                       </>
//                     )}
//                   </CTableDataCell>
//                   {showGST && (
//                     <CTableDataCell style={{ width: '16.66%' }}>
//                       <CFormInput
//                         type="text"
//                         className="text-center"
//                         value={(row.gst === 0 || row.gst === '') ? '' : row.gst}
//                         onChange={(e) => handleRowChange(index, 'gst', e.target.value)}
//                         onFocus={(e) => {
//                           if (row.gst === 0 || row.gst === '') {
//                             e.target.value = '';
//                             handleRowChange(index, 'gst', '');
//                           }
//                         }}
//                         onBlur={(e) => {
//                           if (e.target.value === '') {
//                             handleRowChange(index, 'gst', 0);
//                           } else {
//                             handleRowChange(index, 'gst', Number(e.target.value));
//                           }
//                         }}
//                         placeholder="0"
//                         disabled={row.description === 'Medicine'}
//                       />
//                     </CTableDataCell>
//                   )}
//                   <CTableDataCell className="fw-semibold text-success" style={{ width: '16.66%' }}>
//                     ₹ {(Number(row.total) || 0).toFixed(2)}
//                   </CTableDataCell>
//                   <CTableDataCell style={{ width: '16.66%' }}>
//                     <div className="d-flex justify-content-center gap-2">
//                       <CButton color="danger" size="sm" onClick={() => handleRemoveRow(index)} disabled={index === 0}>
//                         {/* <CIcon icon={cilDelete} /> */}
//                       </CButton>
//                       <CButton color="success" size="sm" onClick={handleAddRow}>
//                         {/* <CIcon icon={cilPlus} /> */}
//                       </CButton>
//                     </div>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))}
//             </CTableBody>
//           </CTable>
//         </CRow>
//         <div className="fw-bold text-end mt-3">
//           Grand Total: ₹{grandTotal}
//         </div>
//       </CCard>
//     </div>
//   );
// };

// export default BillingDetails;





import React, { useEffect } from 'react';
import {
  CCard, CRow, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CFormSelect, CFormInput, CButton
} from '@coreui/react';
import { cilDelete, cilPlus } from '@coreui/icons';

const BillingDetails = ({ rows, setRows, rowErrors, setRowErrors, showGST, setShowGST, rowss, totalPrice, setGrandTotal }) => {
  // Fallback to empty array if rows is undefined
  const safeRows = Array.isArray(rows) ? rows : [];

  // Handle adding a new row
  const handleAddRow = () => {
    const usedDescriptions = safeRows.map((row) => row.description);
    const allDescriptions = ['Consulting', 'Medicine', 'OPD'];
    const nextDescription = allDescriptions.find(
      (desc) => !usedDescriptions.includes(desc)
    );
    if (!nextDescription) return;
    setRows((prevRows) => [
      ...(Array.isArray(prevRows) ? prevRows : []),
      { description: nextDescription, quantity: 0, price: 0, gst: 0, total: 0 }
    ]);
  };

  // Handle removing a row
  const handleRemoveRow = (index) => {
    if (index === 0) return; // Prevent removing the first row
    setRows(safeRows.filter((_, i) => i !== index));
    setRowErrors((prev) => {
      const updated = [...(Array.isArray(prev) ? prev : [])];
      updated.splice(index, 1);
      return updated;
    });
  };

  // Handle row changes
  const handleRowChange = (index, field, value) => {
    const updatedRows = [...safeRows];

    // Forcing correct value types
    if (field === 'quantity') {
      if (!Number.isInteger(Number(value)) || isNaN(value)) {
        value = 0;
      }
    } else if ((field === 'price' || field === 'gst') && isNaN(value)) {
      value = 0;
    }

    updatedRows[index] = updatedRows[index] || { description: 'Consulting', quantity: 0, price: 0, gst: 0, total: 0 };
    updatedRows[index][field] = value;

    const description = updatedRows[index].description;
    const quantity = description === 'Medicine' ? (rowss?.length || 0) : parseFloat(updatedRows[index].quantity) || 0;
    const price = description === 'Medicine' ? (totalPrice || 0) : parseFloat(updatedRows[index].price) || 0;
    const gst = parseFloat(updatedRows[index].gst) || 0;

    let subtotal = 0;
    if (description === 'Medicine') {
      subtotal = totalPrice || 0;
    } else {
      subtotal = quantity * price;
      if (showGST) {
        subtotal += subtotal * (gst / 100);
      }
    }

    updatedRows[index].quantity = quantity;
    updatedRows[index].price = price;
    updatedRows[index].total = subtotal;

    setRows(updatedRows);

    // Error handling
    const errors = Array.isArray(rowErrors) ? [...rowErrors] : [];
    if (!errors[index]) errors[index] = {};

    if (field === 'quantity') {
      errors[index].quantity = !Number.isInteger(Number(value)) ? 'Only integers allowed' : '';
    }
    if (field === 'price') {
      errors[index].price = isNaN(value) || value < 0 ? 'Invalid price' : '';
    }
    if (field === 'gst') {
      errors[index].gst = isNaN(value) || value < 0 ? 'Invalid GST' : '';
    }

    setRowErrors(errors);
  };

  // Update Medicine row when rowss or totalPrice changes
  useEffect(() => {
    const updatedRows = safeRows.map((row) => {
      if (row.description === 'Medicine') {
        const quantity = rowss?.length || 0;
        const price = totalPrice || 0;
        let subtotal = price;

        if (showGST) {
          const gst = parseFloat(row.gst) || 0;
          subtotal += subtotal * (gst / 100);
        }

        return {
          ...row,
          quantity,
          price,
          total: subtotal,
        };
      }
      return row;
    });

    setRows(updatedRows);
  }, [rowss, totalPrice, showGST, setRows, safeRows]);
//   useEffect(() => {
//   const updatedRows = (Array.isArray(rows) ? rows : []).map((row) => {
//     if (row.description === 'Medicine') {
//       const quantity = rowss?.length || 0;
//       const price = totalPrice || 0;
//       let subtotal = price;

//       if (showGST) {
//         const gst = parseFloat(row.gst) || 0;
//         subtotal += subtotal * (gst / 100);
//       }

//       return {
//         ...row,
//         quantity,
//         price,
//         total: subtotal,
//       };
//     }
//     return row;
//   });

//   // Only update if values actually changed to avoid infinite loop
//   const hasChanged = JSON.stringify(rows) !== JSON.stringify(updatedRows);
//   if (hasChanged) {
//     setRows(updatedRows);
//   }
// }, [rowss, totalPrice, showGST]);


  // Calculate grand total with fallback and update parent
  useEffect(() => {
    const grandTotalValue = safeRows.length > 0
      ? safeRows.reduce((acc, row) => acc + parseFloat(row.total || 0), 0).toFixed(2)
      : '0.00';
    setGrandTotal(grandTotalValue);
  }, [safeRows, setGrandTotal]);

  // Calculate grand total for display
  const grandTotal = safeRows.length > 0
    ? safeRows.reduce((acc, row) => acc + parseFloat(row.total || 0), 0).toFixed(2)
    : '0.00';

  return (
    <>
    <div className="d-none d-lg-block mt-2">
      <CCard className="mb-3 px-3 py-3 rounded-4" style={{ backgroundColor: '#FFF9DB' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fw-semibold fs-5" style={{ color: '#944C1F' }}>
            💰 Billing Information
          </span>
          <div className="d-flex gap-2">
            <CButton
              color="warning"
              variant={showGST ? 'solid' : 'outline'}
              className="fw-semibold"
              onClick={() => setShowGST(true)}
              style={{ borderRadius: '10px', minWidth: '120px' }}
            >
              With Tax
            </CButton>
            <CButton
              color="warning"
              variant={!showGST ? 'solid' : 'outline'}
              className="fw-semibold"
              onClick={() => setShowGST(false)}
              style={{ borderRadius: '10px', minWidth: '120px' }}
            >
              Without Tax
            </CButton>
          </div>
        </div>
        <CRow>
          <CTable hover responsive className="table-borderless" style={{ backgroundColor: 'transparent' }}>
            <CTableHead className="text-center text-sm font-semibold">
              <CTableRow>
                <CTableHeaderCell className="px-2 py-2 fw-semibold">Description</CTableHeaderCell>
                <CTableHeaderCell className="px-2 py-2 fw-semibold">Quantity</CTableHeaderCell>
                <CTableHeaderCell className="px-2 py-2 fw-semibold">Fees</CTableHeaderCell>
                {showGST && (
                  <CTableHeaderCell className="px-2 py-2 fw-semibold">GST (%)</CTableHeaderCell>
                )}
                <CTableHeaderCell className="px-2 py-2 fw-semibold">Total</CTableHeaderCell>
                <CTableHeaderCell className="px-2 py-2 fw-semibold">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody className="rounded-4 no-bg" style={{ border: '2px solid #944C1F' }}>
              {safeRows.map((row, index) => (
                <CTableRow key={index} className="align-middle text-center">
                  <CTableDataCell style={{ width: '16.66%' }}>
                    <CFormSelect
                      className="text-center"
                      value={row.description}
                      onChange={(e) => handleRowChange(index, 'description', e.target.value)}
                    >
                      <option value="Consulting">Consulting</option>
                      <option value="Medicine">Medicine</option>
                      <option value="OPD">OPD</option>
                    </CFormSelect>
                  </CTableDataCell>
                  <CTableDataCell style={{ width: '16.66%' }}>
                    <CFormInput
                      type="number"
                      className="text-center"
                      placeholder="Add Quantity Here"
                      value={
                        row.description === 'Medicine'
                          ? rowss?.length || 0
                          : row.quantity === 0
                          ? ''
                          : row.quantity
                      }
                      onChange={(e) => handleRowChange(index, 'quantity', Number(e.target.value))}
                      onFocus={(e) => {
                        if (row.description !== 'Medicine' && (row.quantity === 0 || row.quantity === null)) {
                          handleRowChange(index, 'quantity', '');
                        }
                      }}
                      readOnly={row.description === 'Medicine'}
                    />
                    {rowErrors[index]?.quantity && (
                      <div className="text-danger small">{rowErrors[index].quantity}</div>
                    )}
                  </CTableDataCell>
                  <CTableDataCell style={{ width: '16.66%' }}>
                    {row.description === 'Medicine' ? (
                      <CFormInput
                        type="number"
                        className="text-center"
                        value={(totalPrice || 0) === 0 ? '' : (totalPrice || 0).toFixed(2)}
                        readOnly
                      />
                    ) : (
                      <>
                        <CFormInput
                          type="number"
                          className="text-center"
                          value={row.price === 0 ? '' : row.price}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0) {
                              handleRowChange(index, 'price', value);
                            }
                          }}
                          onFocus={(e) => {
                            if (row.price === 0) {
                              e.target.value = '';
                              handleRowChange(index, 'price', '');
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                              e.preventDefault();
                            }
                          }}
                          onBlur={(e) => {
                            const value = Number(e.target.value);
                            if (value < 0) {
                              handleRowChange(index, 'price', 0);
                            }
                          }}
                        />
                        {rowErrors[index]?.price && (
                          <div className="text-danger small">{rowErrors[index].price}</div>
                        )}
                      </>
                    )}
                  </CTableDataCell>
                  {showGST && (
                    <CTableDataCell style={{ width: '16.66%' }}>
                      <CFormInput
                        type="text"
                        className="text-center"
                        value={(row.gst === 0 || row.gst === '') ? '' : row.gst}
                        onChange={(e) => handleRowChange(index, 'gst', e.target.value)}
                        onFocus={(e) => {
                          if (row.gst === 0 || row.gst === '') {
                            e.target.value = '';
                            handleRowChange(index, 'gst', '');
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === '') {
                            handleRowChange(index, 'gst', 0);
                          } else {
                            handleRowChange(index, 'gst', Number(e.target.value));
                          }
                        }}
                        placeholder="0"
                        disabled={row.description === 'Medicine'}
                      />
                    </CTableDataCell>
                  )}
                  <CTableDataCell className="fw-semibold text-success" style={{ width: '16.66%' }}>
                    ₹ {(Number(row.total) || 0).toFixed(2)}
                  </CTableDataCell>
                  <CTableDataCell style={{ width: '16.66%' }}>
                    <div className="d-flex justify-content-center gap-2">
                      <CButton color="danger" size="sm" onClick={() => handleRemoveRow(index)} disabled={index === 0}>
                        {/* <CIcon icon={cilDelete} /> */}
                      </CButton>
                      <CButton color="success" size="sm" onClick={handleAddRow}>
                        {/* <CIcon icon={cilPlus} /> */}
                      </CButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CRow>
        <div className="fw-bold text-end mt-3">
          Grand Total: ₹{grandTotal}
        </div>
      </CCard>
    </div>

    <div className="d-block d-lg-none mt-2">
  <CCard className="mb-3 px-3 py-3 rounded-4" style={{ backgroundColor: '#FFF9DB' }}>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <span className="fw-semibold fs-5" style={{ color: '#944C1F' }}>
        💰 Billing Information
      </span>
      <div className="d-flex gap-2">
        <CButton
          color="warning"
          variant={showGST ? 'solid' : 'outline'}
          className="fw-semibold"
          onClick={() => setShowGST(true)}
          style={{ borderRadius: '10px', minWidth: '100px' }}
        >
          With Tax
        </CButton>
        <CButton
          color="warning"
          variant={!showGST ? 'solid' : 'outline'}
          className="fw-semibold"
          onClick={() => setShowGST(false)}
          style={{ borderRadius: '10px', minWidth: '100px' }}
        >
          Without Tax
        </CButton>
      </div>
    </div>

    {safeRows.map((row, index) => (
      <CCard key={index} className="mb-2 p-2 border rounded-3">
        {/* Description */}
        <div className="mb-2">
          <label className="fw-semibold">Description</label>
          <CFormSelect
            value={row.description}
            onChange={(e) => handleRowChange(index, 'description', e.target.value)}
          >
            <option value="Consulting">Consulting</option>
            <option value="Medicine">Medicine</option>
            <option value="OPD">OPD</option>
          </CFormSelect>
        </div>

        {/* Quantity */}
        <div className="mb-2">
          <label className="fw-semibold">Quantity</label>
          <CFormInput
            type="number"
            placeholder="Add Quantity Here"
            value={
              row.description === 'Medicine'
                ? rowss?.length || 0
                : row.quantity === 0
                ? ''
                : row.quantity
            }
            onChange={(e) => handleRowChange(index, 'quantity', Number(e.target.value))}
            readOnly={row.description === 'Medicine'}
          />
          {rowErrors[index]?.quantity && (
            <div className="text-danger small">{rowErrors[index].quantity}</div>
          )}
        </div>

        {/* Fees */}
        <div className="mb-2">
          <label className="fw-semibold">Fees</label>
          {row.description === 'Medicine' ? (
            <CFormInput
              type="number"
              value={(totalPrice || 0) === 0 ? '' : (totalPrice || 0).toFixed(2)}
              readOnly
            />
          ) : (
            <>
              <CFormInput
                type="number"
                value={row.price === 0 ? '' : row.price}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 0) {
                    handleRowChange(index, 'price', value);
                  }
                }}
              />
              {rowErrors[index]?.price && (
                <div className="text-danger small">{rowErrors[index].price}</div>
              )}
            </>
          )}
        </div>

        {/* GST */}
        {showGST && (
          <div className="mb-2">
            <label className="fw-semibold">GST (%)</label>
            <CFormInput
              type="text"
              value={(row.gst === 0 || row.gst === '') ? '' : row.gst}
              onChange={(e) => handleRowChange(index, 'gst', e.target.value)}
              disabled={row.description === 'Medicine'}
            />
          </div>
        )}

        {/* Total */}
        <div className="fw-semibold text-success mb-2">
          Total: ₹ {(Number(row.total) || 0).toFixed(2)}
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-end gap-2">
          <CButton color="danger" size="sm" onClick={() => handleRemoveRow(index)} disabled={index === 0}>
            Delete
          </CButton>
          <CButton color="success" size="sm" onClick={handleAddRow}>
            Add
          </CButton>
        </div>
      </CCard>
    ))}

    <div className="fw-bold text-end mt-3">
      Grand Total: ₹{grandTotal}
    </div>
  </CCard>
</div>
</>
  );
};

export default BillingDetails;