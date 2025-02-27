import React, { useState } from 'react';
import {
  CCard, CCardHeader, CCardBody, CFormInput, CButton, CRow, CTable,
  CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormSelect,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CCol,
  CAlert
} from '@coreui/react';
import { post, postFormData } from '../../../util/api'; // Replace with your actual API utility

const DrugForm = () => {
  const [drugData, setDrugData] = useState({
    drug_name: '',
    generic_name: '',
    category: '',
    manufacturer: '',
  });

  const [errors, setErrors] = useState({});
  const [rowErrors, setRowErrors] = useState({});
  const [rows, setRows] = useState([
    {
      drug_id: '',
      dosage_form: '',
      strength: '',
      price: '',
      stock_quantity: '',
      expiration_date: '',
      side_effects: '',
      usage_instructions: '',
      storage_conditions: '',
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
    if (!drugData.generic_name) {
      formErrors.generic_name = 'Generic name is required.';
      isValid = false;
    }
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
      if (!row.dosage_form) {
        rowError.dosage_form = 'Dosage form is required.';
        isValid = false;
      }
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
        dosage_form: '',
        strength: '',
        price: '',
        stock_quantity: '',
        expiration_date: '',
        side_effects: '',
        usage_instructions: '',
        storage_conditions: '',
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
    if (!validateForm()) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      const response = await post('/api/drugs', drugData);
      alert('Drug added successfully!');
      const drugId = response.id;

      const drugdetailsdata = rows.map((row) => ({
        drug_id: drugId,
        dosage_form: row.dosage_form,
        strength: row.strength,
        price: row.price,
        stock_quantity: row.stock_quantity,
        expiration_date: row.expiration_date,
        side_effects: row.side_effects,
        usage_instructions: row.usage_instructions,
        storage_conditions: row.storage_conditions,
      }));

      await post('/api/drugdetails', { drugs_details: drugdetailsdata });
      alert('Drug details added successfully!');

      // Clear the form
      setDrugData({
        drug_name: '',
        generic_name: '',
        category: '',
        manufacturer: '',
      });
      setRows([
        {
          drug_id: '',
          dosage_form: '',
          strength: '',
          price: '',
          stock_quantity: '',
          expiration_date: '',
          side_effects: '',
          usage_instructions: '',
          storage_conditions: '',
          total: 0,
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add drug or details. Please try again.');
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
      setMessage('File uploaded successfully!');
    } else {
      setMessage('File uploaded successfully!');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    setMessage('Error uploading file.');
  } finally {
    setLoading(false);
  }
};

return (
  <>
    <div style={{ padding: '20px' }}>

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


      
   
  



    <CCard className="mb-4">
      <CCardHeader>Add New Drug</CCardHeader>
      <CCardBody>
        <CFormInput
          label="Drug Name"
          name="drug_name"
          value={drugData.drug_name}
          onChange={handleChange}
          placeholder="Enter drug name"
        />
        {errors.drug_name && <div style={{ color: 'red' }}>{errors.drug_name}</div>}

        <CFormInput
          label="Generic Name"
          name="generic_name"
          value={drugData.generic_name}
          onChange={handleChange}
          placeholder="Enter generic name"
        />
        {errors.generic_name && <div style={{ color: 'red' }}>{errors.generic_name}</div>}

        <CFormInput
          label="Category"
          name="category"
          value={drugData.category}
          onChange={handleChange}
          placeholder="Enter category"
        />
        {errors.category && <div style={{ color: 'red' }}>{errors.category}</div>}

        <CFormInput
          label="Manufacturer"
          name="manufacturer"
          value={drugData.manufacturer}
          onChange={handleChange}
          placeholder="Enter manufacturer"
        />
        {errors.manufacturer && <div style={{ color: 'red' }}>{errors.manufacturer}</div>}

        

       

       
      </CCardBody>
    </CCard>




<CCardBody>
<CRow>
  <CTable hover responsive>
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell style={{ width: '20%' }}>Dosage form</CTableHeaderCell>
        <CTableHeaderCell style={{ width: '15%' }}>Strength</CTableHeaderCell>
        <CTableHeaderCell style={{ width: '15%' }}>Price</CTableHeaderCell>
        <CTableHeaderCell style={{ width: '15%' }}>Stock Quantity</CTableHeaderCell>
        <CTableHeaderCell style={{ width: '10%' }}>Expiration Date</CTableHeaderCell>
        <CTableHeaderCell style={{ width: '30%' }}>Side Effects</CTableHeaderCell>
        <CTableHeaderCell style={{ width: '30%' }}>Usage Insrtuctions</CTableHeaderCell>
        <CTableHeaderCell style={{ width: '30%' }}>Storage Condition</CTableHeaderCell>
        <CTableHeaderCell style={{ width: '30%' }}>Actions</CTableHeaderCell>

      </CTableRow>
    </CTableHead> 
    <CTableBody>
      {rows.map((row, index) => (
        <CTableRow key={index}>
          <CTableDataCell>
            <CFormInput
            type='text'
              value={row.dosage_form}
              onChange={(e) => handleRowChange(index, 'dosage_form', e.target.value)}
            />
             {rowErrors[index]?.dosage_form && (
                      <div style={{ color: 'red' }}>{rowErrors[index].dosage_form}</div>
                    )}
             
          </CTableDataCell>

          <CTableDataCell>
            <CFormInput
              type="text"
              value={row.strength}
              min="1"
              onChange={(e) => {
                const value = e.target.value;
                // Ensure that only positive numbers or empty strings are entered
                if (value >= 0) {
                  handleRowChange(index, 'strength', value);
                }
              }}
            //   disabled={index === rows.length - 1}
            />
             {rowErrors[index]?.strength && (
                      <div style={{ color: 'red' }}>{rowErrors[index].strength}</div>
                    )}
          </CTableDataCell>

          <CTableDataCell>
            <CFormInput
              type="text"
              value={row.price}
              onChange={(e) => handleRowChange(index, 'price', Number(e.target.value))}
            />
            {rowErrors[index]?.price && (
                      <div style={{ color: 'red' }}>{rowErrors[index].price}</div>
                    )}
          </CTableDataCell>

          <CTableDataCell>
            <CFormInput
              type="text"
              value={row.stock_quantity}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow positive numbers (including 0)
                if (value >= 0) {
                  handleRowChange(index, 'stock_quantity', value);
                }
              }}
            />
            {rowErrors[index]?.stock_quantity && (
                      <div style={{ color: 'red' }}>{rowErrors[index].stock_quantity}</div>
                    )}
          </CTableDataCell>

          <CTableDataCell>
            <CFormInput
              type="date"
              value={row.expiration_date}
              onChange={(e) => handleRowChange(index, 'expiration_date', e.target.value)}
            />
            {rowErrors[index]?.expiration_date && (
                      <div style={{ color: 'red' }}>{rowErrors[index].expiration_date}</div>
                    )}
          </CTableDataCell>



          <CTableDataCell>
            <CFormInput
              type="text"
              value={row.side_effects}
              onChange={(e) => handleRowChange(index, 'side_effects', e.target.value)}
            />
          </CTableDataCell>


          <CTableDataCell>
            <CFormInput
              type="text"
              value={row.usage_instructions}
              onChange={(e) => handleRowChange(index, 'usage_instructions', e.target.value)}
            />
          </CTableDataCell>
         

          <CTableDataCell>
            <CFormInput
              type="text"
              value={row.storage_conditions}
              onChange={(e) => handleRowChange(index, 'storage_conditions', e.target.value)}
            />
          </CTableDataCell>


          <CTableDataCell>
            <div className="d-flex">
              <CButton
                color="danger"
                className="me-2"
                onClick={() => handleRemoveRow(index)}
                disabled={index === 0}

              >
                Remove
              </CButton>

              <CButton
                color="success"
                onClick={handleAddRow}
              >
                Add Row
              </CButton>
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
