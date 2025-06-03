import { element } from 'prop-types'
import React from 'react'


// Admin TIPIC Dashboard
const Register = React.lazy(() => import('./views/pages/register/Register'))
const ClinicRegister = React.lazy(() => import('./views/pages/register/ClinicRegister'))
const WhatsappClinicRegister = React.lazy(() => import('./views/pages/register/WhatsappClinicRegister'))
const EditwhatsappClinicRegister = React.lazy(() => import('./views/pages/register/EditwhatsappClinicRegister'))
const EditWhatsappClinicInfo = React.lazy(() => import('./views/pages/register/EditWhatsappClinicInfo'))

//plans
const Plans = React.lazy(() => import('./views/pages/plans/Plans'))


const FollowupDashboard = React.lazy(()=>import('./views/dashboard/followupdashboard'))
// const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))
const Patient = React.lazy(() => import('./views/theme/patient/Patient'))
const PatientTokanForm = React.lazy(() => import('./views/theme/patient/patientTokanForm'))
const Bills = React.lazy(() => import('./views/theme/bills/Bills'))
const Billstable = React.lazy(() => import('./views/theme/bills/billstable'))
const invoices = React.lazy(() => import('./views/theme/invoice/Invoice'))

const prescriptionForm = React.lazy(() => import('./views/theme/prescription/prescriptionForm'))
const PrescriptionView = React.lazy(() => import('./views/theme/prescription/PrescriptionView'))
const prescriptionTable = React.lazy(() => import('./views/theme/prescription/prescriptionTable'))
const prescriptiondata = React.lazy(() => import('./views/theme/prescription/prescriptiondata'))
const medicines = React.lazy(() => import('./views/theme/Medicines/medicines'))
const timeslots = React.lazy(() => import('./views/theme/timeslots/timeslots'))
const medicinesShow = React.lazy(() => import('./views/theme/Medicines/medicinesShow'))




// Profile
const Profile = React.lazy(() => import('./Profile'))
const Billing = React.lazy(() => import('./Billing'))
const docDashboard = React.lazy(()=>import('./views/theme/docDashboard/docDashboard'))
const Dashboard2 = React.lazy(()=>import('./views/dashboard/Dashboard2'))

// invoices


// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'home' },
  // { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/register/Register/:storeid', name: 'Register', element: Register},
  { path: '/register/ClinicRegister', name: 'Clinic Register', element: ClinicRegister },
  { path: '/register/WhatsappClinicRegister', name: 'Clinics', element: WhatsappClinicRegister },
  { path: '/register/EditwhatsappClinicRegister/:id', name: 'EditwhatsappClinicRegister', element: EditwhatsappClinicRegister },
  { path: '/register/EditwhatsappClinicRegister', name: 'Clinic Details', element: EditwhatsappClinicRegister },
  { path: '/register/EditWhatsappClinicInfo/:storeid', name: 'EditWhatsappClinicInfo', element: EditWhatsappClinicInfo },

  { path:'plans', name: 'Plans', element: Plans },
  // { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/Patient', name: 'Patient', element: Patient },
  { path: '/PatientTokanForm', name: 'PatientTokanForm', element: PatientTokanForm },
  { path: '/Bills', name: 'Create Bill', element: Bills },
  { path: '/Billstable', name: 'Bills', element: Billstable },
  { path: '/Invoice', name: 'Invoice', element: invoices },
  { path: '/Dashboard', name: 'Dashboard', element: docDashboard },
  { path: '/Dashboard2', name: 'Dashboard', element: Dashboard2 },

  { path: '/Prescription' , name  :'Prescription',element : prescriptionForm},
  { path: '/theme/PrescriptionView' , name : 'PrescriptionView' ,element :PrescriptionView},
  { path: '/theme/prescriptionTable' , name : 'presciptionTable' , element : prescriptionTable},
  { path: '/theme/prescriptiondata' , name : 'presciptiondata' , element : prescriptiondata},

  { path: '/Medicines' , name : 'Medicines' , element : medicines},
  { path: '/MedicinesShow' , name : 'MedicinesShow' , element : medicinesShow},


  { path: '/Timeslots' , name : 'Timeslots' , element : timeslots},


  {path: '/followupdashboard', name:'Follow Up Dashboard', element :FollowupDashboard},
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
  { path: '/Profile', name: 'Profile', element: Profile },
  { path: '/Billing', name: 'Billing', element: Billing },

]

export default routes
