import { CButton, CForm, CFormInput, CFormLabel, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/react'

import { useState } from 'react'
import { post } from '../../../util/api';
import { useToast } from '../../notifications/toasts/ToastContext';

export default function NewPlanModal({ visible, setVisible, onSuccess }) {
  const { showToast } = useToast();
  
  
  const [state, setState] = useState({
    name: '',
    description: '',
    price: 0,
    userLimit: 0,
    accessLevel: 1,
    isActive: true
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    if (!form.checkValidity()) {
      form.classList.add('was-validated')
      return
    }

    let data = { ...state }
    try {
      const resp = await post('/api/plan', data)
      if (resp?.id) {
        showToast('success',"Data Saved Successfully");
        onSuccess(resp)
        setVisible(false)
        handleClear()
      } else {
        showToast('danger', "Failed to crate");
      }
    } catch (error) {
      showToast('danger', 'Error occured ' + error);
    }
  }

  const handleClear = () => {
    setState({
      name: '',
      description: '',
      price: 0,
      userLimit: 0,
      accessLevel: 1,
      isActive: true
    })
  }
  
  return (
    <>
      <CModal
        backdrop="static"
        visible={visible}
        onClose={() => {handleClear();setVisible(false);}}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">New Plan</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="needs-validation" noValidate onSubmit={handleSubmit}>
                <div className="mb-3">
                  <CFormLabel htmlFor="pname">Plan Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="pname"
                    placeholder="Plan name"
                    name="name"
                    value={state.name}
                    onChange={handleChange}
                    required
                    feedbackInvalid="Please Provide Plan Name"
                    feedbackValid="Look Good!"
                  />
                  <div className="invalid-feedback">Name is Required</div>
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="plmobile">Plan Description</CFormLabel>
                  <CFormInput
                    type="text"
                    id="description"
                    placeholder="Enter Plan Description"
                    name="description"
                    value={state.description}
                    onChange={handleChange}
                    required
                    feedbackInvalid="Please provide plan description"
                    feedbackValid="Looking Good!"
                  />
                  <div className="invalid-feedback">Description is Required</div>
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="price">Price</CFormLabel>
                  <CFormInput
                    type="number"
                    id="price"
                    placeholder=""
                    name="price"
                    value={state.price}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="userLimit">User Limit</CFormLabel>
                  <CFormInput
                    type="number"
                    id="userLimit"
                    placeholder=""
                    name="userLimit"
                    value={state.userLimit}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                <CButton color="success" type="submit">
                Submit
                </CButton>
                &nbsp;
                <CButton color="danger" onClick={() => {handleClear();setVisible(false);}}>
                Close
                </CButton>
              </div>
            </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}
