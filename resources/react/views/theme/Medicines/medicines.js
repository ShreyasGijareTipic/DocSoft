import React, { useState } from 'react';
import {
  CCard, CCardHeader, CCardBody, CFormInput, CButton, CRow, CTable,
  CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormSelect,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CCol,
  CAlert,
  CFormLabel
} from '@coreui/react';
import { post, postFormData } from '../../../util/api'; // Replace with your actual API utility
import { showToast } from '../toastContainer/toastContainer'; 
import CIcon from '@coreui/icons-react';
import { cilDelete, cilPlus } from '@coreui/icons';

const DrugForm = () => {
  const [drugData, setDrugData] = useState({
    drug_name: '',
    // generic_name: '',
    category: '',
    manufacturer: '',
  });
  const SampleMedicineTemplate = "/SampleMedicineTemplate/SampleMedicineTemplate.csv";

  const [errors, setErrors] = useState({});
  const [rowErrors, setRowErrors] = useState({});
  const [rows, setRows] = useState([
    {
      drug_id: '',
      // dosage_form: '',
      strength: '',
      price: '',
      stock_quantity: '',
      expiration_date: '',
      // side_effects: '',
      // usage_instructions: '',
      // storage_conditions: '',
      total: 0,
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDrugData({ ...drugData, [name]: value });
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    // Validate `drugData`
    if (!drugData.drug_name) {
      formErrors.drug_name = 'Drug name is required.';
      isValid = false;
    }
    // if (!drugData.generic_name) {
    //   formErrors.generic_name = 'Generic name is required.';
    //   isValid = false;
    // }
    if (!drugData.category) {
      formErrors.category = 'Category is required.';
      isValid = false;
    }
    if (!drugData.manufacturer) {
      formErrors.manufacturer = 'Manufacturer is required.';
      isValid = false;
    }

    setErrors(formErrors);

    // Validate `rows`
    const rowErrorsTemp = {};
    rows.forEach((row, index) => {
      const rowError = {};
      // if (!row.dosage_form) {
      //   rowError.dosage_form = 'Dosage form is required.';
      //   isValid = false;
      // }
      if (!row.strength) {
        rowError.strength = 'Strength is required.';
        isValid = false;
      }
      if (!row.price) {
        rowError.price = 'Price is required.';
        isValid = false;
      }
      if (!row.stock_quantity) {
        rowError.stock_quantity = 'Stock quantity is required.';
        isValid = false;
      }
      if (!row.expiration_date) {
        rowError.expiration_date = 'Expiration date is required.';
        isValid = false;
      }
      rowErrorsTemp[index] = rowError;
    });

    setRowErrors(rowErrorsTemp);

    return isValid;
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        drug_id: '',
        // dosage_form: '',
        strength: '',
        price: '',
        stock_quantity: '',
        expiration_date: '',
        // side_effects: '',
        // usage_instructions: '',
        // storage_conditions: '',
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    if (index === 0) {
      
      return;
      
    }
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // if (!validateForm()) {
    //   alert('Please fill all required fields.');
    //   return;
    // }

    try {
      const response = await post('/api/drugs', drugData);
      // alert('Drug added successfully!');
      showToast('Drug added successfully!', 'Successfully Uploaded', '#198754');
      const drugId = response.id;

      const drugdetailsdata = rows.map((row) => ({
        drug_id: drugId,
        // dosage_form: row.dosage_form,
        strength: row.strength,
        price: row.price,
        stock_quantity: row.stock_quantity,
        expiration_date: row.expiration_date,
        // side_effects: row.side_effects,
        // usage_instructions: row.usage_instructions,
        // storage_conditions: row.storage_conditions,
      }));

      await post('/api/drugdetails', { drugs_details: drugdetailsdata });
      

      // Clear the form
      setDrugData({
        drug_name: '',
        // generic_name: '',
        category: '',
        manufacturer: '',
      });
      setRows([
        {
          drug_id: '',
          // dosage_form: '',
          strength: '',
          price: '',
          stock_quantity: '',
          expiration_date: '',
          // side_effects: '',
          // usage_instructions: '',
          // storage_conditions: '',
          total: 0,
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
      // alert('Failed to add drug or details. Please try again.');
      showToast('Failed to add drug or details. Please try again.', 'Validation Error', '#d9534f');
    }
  };




const [file, setFile] = useState(null);
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('');

// Handle file selection
const handleFileChange = (e) => {
  console.log('Selected file:', e.target.files[0]); 
    setFile(e.target.files[0]);
};

// Handle file upload
const handleUpload = async () => {
  if (!file) {
    setMessage('Please select a file to upload.');
    return;
  }
  
  console.log('Selected file:', file);

  const formData = new FormData();
  formData.append('csv_file', file);

  // Log the FormData content
  console.log("FormData content:");
  for (let pair of formData.entries()) {
    // console.log("tttttttt",pair[0] + ': ' + pair[1]);
  }

  setLoading(true);

  try {
    // Send the file as form data to the backend
    const response = await postFormData('/api/uploadDrugs', formData);

    // Check if the response status is 200 (success)
    if (response.status === 201) {
      // setMessage('File uploaded successfully!');
       showToast('File uploaded successfully!', 'Successfully Uploaded', '#198754');
    } else {
      setMessage('File uploaded successfully!');
      showToast('File uploaded successfully!', 'Successfully Uploaded', '#198754');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    setMessage('Error uploading file.');
    showToast('Error uploading file.', 'Validation Error', '#d9534f');
  } finally {
    setLoading(false);
  }
};

return (
  <>
    <div style={{ padding: '10px' }}>

<CRow>
  <CCol xs={12} sm={6} lg={4} className="">

<CFormInput
        type="file"
        onChange={handleFileChange}
        accept=".csv"
      /> <br/>
  </CCol>
 
  <CCol xs={12} sm={6} lg={4} className="">

<CButton color="success" style={{ marginLeft: '10px' }} 
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload File'} <span></span>
      </CButton>
      </CCol>

      <CCol xs={12} sm={6} lg={4} className="">
      <div>
      {message && (
        <CAlert  color="primary" onClose={() => setMessage('')} className='justify-center'>
          {message}
        </CAlert>
      )}
      </div>
  </CCol>
</CRow>
</div>

{/* <CButton color="info" variant="outline" onClick={() => {
  const link = document.createElement("a");
  link.href = SampleMedicineTemplate;
  link.download = "SampleMedicineTemplate.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}}>
  📥 Download Template
</CButton> */}

<CRow className="mb-3 align-items-center"  >
  <CCol xs="auto" className="d-flex align-items-center">
    <strong className="me-1" style={{ marginLeft: '10px' }}>Sample CSV template for Medicines</strong>
    <CButton
      color="success"
      variant="outline"
      title="Download Sample Template"
      style={{ padding: '6px 10px' }}
      onClick={() => {
        const link = document.createElement("a");
  link.href = SampleMedicineTemplate;
  link.download = "SampleMedicineTemplate.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
      }}
    >
      📥
    </CButton>
  </CCol>
</CRow>




<div className="row g-3 mb-3">
  {/* Drug Name */}
  <div className="col-12 col-md-6 col-lg-4">
    <div className="d-flex align-items-center">
      <CFormLabel
        htmlFor="drug_name"
        className="me-2 mb-0"
        style={{ fontWeight: 'bold', whiteSpace: 'nowrap', minWidth: '100px' }}
      >
        Drug Name
      </CFormLabel>
      <CFormInput
        id="drug_name"
        name="drug_name"
        value={drugData.drug_name}
        onChange={handleChange}
        placeholder="Enter drug name"
      />
    </div>
    {errors.drug_name && <div style={{ color: 'red' }}>{errors.drug_name}</div>}
  </div>

  {/* Category */}
  <div className="col-12 col-md-6 col-lg-4">
    <div className="d-flex align-items-center">
      <CFormLabel
        htmlFor="category"
        className="me-2 mb-0"
        style={{ fontWeight: 'bold', whiteSpace: 'nowrap', minWidth: '100px' }}
      >
        Category
      </CFormLabel>
      <CFormInput
        id="category"
        name="category"
        value={drugData.category}
        onChange={handleChange}
        placeholder="Enter category"
      />
    </div>
    {errors.category && <div style={{ color: 'red' }}>{errors.category}</div>}
  </div>

  {/* Manufacturer */}
  <div className="col-12 col-md-6 col-lg-4">
    <div className="d-flex align-items-center">
      <CFormLabel
        htmlFor="manufacturer"
        className="me-2 mb-0"
        style={{ fontWeight: 'bold', whiteSpace: 'nowrap', minWidth: '100px' }}
      >
        Manufacturer
      </CFormLabel>
      <CFormInput
        id="manufacturer"
        name="manufacturer"
        value={drugData.manufacturer}
        onChange={handleChange}
        placeholder="Enter manufacturer"
      />
    </div>
    {errors.manufacturer && <div style={{ color: 'red' }}>{errors.manufacturer}</div>}
  </div>
</div>





<CCardBody>
  <CRow>
    <CTable striped bordered-none hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell className="text-center" style={{ width: '20%' }}>Strength</CTableHeaderCell>
          <CTableHeaderCell className="text-center" style={{ width: '20%' }}>Price</CTableHeaderCell>
          <CTableHeaderCell className="text-center" style={{ width: '20%' }}>Stock Quantity</CTableHeaderCell>
          <CTableHeaderCell className="text-center" style={{ width: '20%' }}>Expiration Date</CTableHeaderCell>
          <CTableHeaderCell className="text-center" style={{ width: '20%' }}>Actions</CTableHeaderCell>
        </CTableRow>
      </CTableHead>

      <CTableBody>
        {rows.map((row, index) => (
          <CTableRow key={index}>
            {/* Strength */}
            <CTableDataCell>
              <CFormInput
                type="text"
                value={row.strength}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0 || value === '') {
                    handleRowChange(index, 'strength', value);
                  }
                }}
              />
              {rowErrors[index]?.strength && (
                <div style={{ color: 'red', fontSize: '0.8rem' }}>{rowErrors[index].strength}</div>
              )}
            </CTableDataCell>

            {/* Price */}
            <CTableDataCell>
  <CFormInput
    type="number"
    value={row.price}
    onChange={(e) => {
      const value = Number(e.target.value);
      if (value >= 0 || e.target.value === '') {
        handleRowChange(index, 'price', e.target.value);
      }
    }}
    min="0"
  />
  {rowErrors[index]?.price && (
    <div style={{ color: 'red', fontSize: '0.8rem' }}>{rowErrors[index].price}</div>
  )}
</CTableDataCell>

            {/* Stock Quantity */}
            <CTableDataCell>
              <CFormInput
                type="text"
                value={row.stock_quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0 || value === '') {
                    handleRowChange(index, 'stock_quantity', value);
                  }
                }}
              />
              {rowErrors[index]?.stock_quantity && (
                <div style={{ color: 'red', fontSize: '0.8rem' }}>{rowErrors[index].stock_quantity}</div>
              )}
            </CTableDataCell>

            {/* Expiration Date */}
            <CTableDataCell>
              <CFormInput
                type="date"
                value={row.expiration_date}
                onChange={(e) => handleRowChange(index, 'expiration_date', e.target.value)}
              />
              {rowErrors[index]?.expiration_date && (
                <div style={{ color: 'red', fontSize: '0.8rem' }}>{rowErrors[index].expiration_date}</div>
              )}
            </CTableDataCell>

            {/* Actions */}
            <CTableDataCell>
              <div className="d-flex justify-content-center gap-3">
                <CButton color="danger" size="sm" ><CIcon  onClick={() => handleRemoveRow(index)} icon={cilDelete} className="text-white "  /></CButton> 
                {/* <CButton
                  color="danger"
                  onClick={() => handleRemoveRow(index)}
                  disabled={index === 0}
                >
                  Remove
                </CButton> */}

                 <CButton color="success" size="sm" > <CIcon  onClick={handleAddRow} icon={cilPlus} className="text-white " /></CButton>
                {/* <CButton
                  color="success"
                  onClick={handleAddRow}
                >
                  Add Row
                </CButton> */}
              </div>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  </CRow>
</CCardBody>




<CButton color="primary" onClick={handleSubmit}>
          Submit
        </CButton>

</>
  );
};

export default DrugForm;
