import React, { useState } from 'react';
import {
  CCard, CCardHeader, CCardBody, CFormInput, CButton, CRow, CTable,
  CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormSelect
} from '@coreui/react';
import { post } from '../../../util/api'; // Replace with your actual API utility

const DrugForm = () => {
  const [drugData, setDrugData] = useState({
    drug_name: '',
    generic_name: '',
    category: '',
    manufacturer: '',
  });

  const [errors, setErrors] = useState({});
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
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;  // Ensure the form is valid before proceeding
 
    try {
        // Create the drug first
        const response = await post('/api/drugs', drugData); 
        console.log('Drug added successfully:', response.id);
        alert('Drug added successfully!');
 
        const drugId = response.id; 
        console.log("Drug ID:", drugId);
 
        // Create drug details after drug is added
        const drugdetailsdata = rows.map(row => ({
           
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



        const dataToSend = {
          drugs_details: drugdetailsdata,
        };
 
        // Submit drug details
        const drugDetailsstore = await post('/api/drugdetails', dataToSend);
 
        console.log("Drug details added:", drugDetailsstore);
        alert("Drug details added successfully!");


          // Clear the form fields after successful submission
    setDrugData({
      drug_name: '',
      generic_name: '',
      category: '',
      manufacturer: '',
    });

    // Reset rows to empty or default values
    setRows([{
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
    }]);


    } catch (error) {
        console.error('Error adding drug or details:', error);
        alert('Failed to add drug or drug details. Please try again.');
    }
  }; 
  return (

    <>
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
        {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}

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
             
          </CTableDataCell>

          <CTableDataCell>
            <CFormInput
              type="text"
              value={row.strength}
              min="1"
              onChange={(e) => handleRowChange(index, 'strength', e.target.value)}
            //   disabled={index === rows.length - 1}
            />
          </CTableDataCell>

          <CTableDataCell>
            <CFormInput
              type="text"
              value={row.price}
              onChange={(e) => handleRowChange(index, 'price', Number(e.target.value))}
            />
          </CTableDataCell>

          <CTableDataCell>
            <CFormInput
              type="text"
              value={row.stock_quantity}
              onChange={(e) => handleRowChange(index, 'stock_quantity', e.target.value)}
            />
          </CTableDataCell>

          <CTableDataCell>
            <CFormInput
              type="date"
              value={row.expiration_date}
              onChange={(e) => handleRowChange(index, 'expiration_date', e.target.value)}
            />
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
