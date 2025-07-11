<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; 
// use App\Http\Controllers\StatusController; 

use App\Http\Controllers\ProductController; 
use App\Http\Controllers\CategoryController; 
use App\Http\Controllers\SubCategoryController; 
use App\Http\Controllers\SubSubCategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ExpenseTypeController;
use App\Http\Controllers\ExpenseController;
use App\Http\Middleware\Authorization;
use App\Http\Controllers\FileUpload;
use App\Http\Controllers\ContactUsController;
use App\Http\Controllers\InquiryController;
use App\Models\Inquiry;
// use App\Http\Controllers\CatalogController;
// use App\Http\Controllers\AdminController; 
use App\Http\Controllers\CsvUploadController;
use App\Http\Controllers\DoctorMedicalObservationController;

use App\Http\Controllers\BillController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\WhatsAppController;

//Whatsapp controller 
use App\Http\Controllers\OnlineAppointmentsController;
use App\Http\Controllers\WhatsAppWebhookController;

use App\Http\Controllers\DrugController;
use App\Http\Controllers\DrugDetailController;

use App\Http\Controllers\PatientExaminationController;

use App\Http\Controllers\HealthDirectiveController;
use App\Http\Controllers\TimeslotController;
use App\Http\Controllers\ClinicController;
use App\Http\Controllers\DescriptionController;
use App\Http\Controllers\AppointmetWhatsappController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\PrescriptionPatientInfoController;
use App\Http\Controllers\DrugUploadController;
use App\Http\Controllers\TokanController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\RazorpayController;

use App\Http\Controllers\MailController;


Route::post('/reset-password-link', [MailController::class, 'sendEmail']);
Route::post('/newPassword',[MailController::class, 'resetPassword']);

Route::get('/doctor-medical-observations/{doctorId}', [DoctorMedicalObservationController::class, 'getByDoctor']);
Route::post('/save-doctor-medical-observations', [DoctorMedicalObservationController::class, 'save']);



// Public APIs
Route::post('/register', [AuthController::class, 'registers']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/saveMultiEnquiry', [InquiryController::class, 'saveMultiEnquiry']);

// Route::post('/registerAppointment/{doctor_id}', [AppointmentController::class, 'xyz']);
Route::get('/allSlots/{doctor_id}', [TimeslotController::class, 'show']);


Route::get('/clinic', [ClinicController::class, 'index']);
Route::post('/clinic', [ClinicController::class, 'store']);
Route::get('/clinics', [ClinicController::class, 'show']);
Route::put('/clinic/{clinicId}', [ClinicController::class, 'update']);
Route::delete('/clinics/{clinic}', [ClinicController::class, 'destroy']);
Route::get('/clinic/{id}', [ClinicController::class, 'showdatabyid']);

Route::get('/showdoctordatabyclinicid/{id}', [AuthController::class, 'showdoctordatabyclinicid']);


//whatsApp Business API
Route::get('/webhook', [WhatsAppWebhookController::class, 'verifyToken']);
// Route::post('/webhook', [WhatsappWebhookController::class, 'receiveMessage']);
Route::post('/webhook', [WhatsAppWebhookController::class, 'webhook']);
Route::post('/appointments', [OnlineAppointmentsController::class, 'store']);
// Route::get('/getAppointments', [OnlineAppointmentsController::class, 'getAppointments']);
Route::middleware('auth:sanctum')->get('/getAppointments', [OnlineAppointmentsController::class, 'getAppointments']);

Route::get('/export', [OnlineAppointmentsController::class, 'export']);
// Route::get('/getAppointmentByToken/{id}', [OnlineAppointmentsController::class, 'getAppointmentByToken']);
Route::post('/cancel-appointment', [WhatsAppWebhookController::class, 'cancelAppointment']);





// Secured APIs
Route::group(['middleware' => ['auth:sanctum']], function() {

    //Razorpay and Plans
    Route::resource('plan', PlanController::class);
    Route::post('/create-order', [RazorpayController::class, 'createOrder']);
    Route::post('/verify-payment', [RazorpayController::class, 'verifyPayment']);

  

    Route::post('/clinic-receipt', [App\Http\Controllers\ClinicReceiptController::class, 'store']);
    Route::get('/clinic-receipts/{clinicId}', [App\Http\Controllers\ClinicReceiptController::class, 'getClinicReceipts']);
    Route::get('/detailsForClinic', [App\Http\Controllers\ClinicReceiptController::class, 'getDetailsForClinic']);


    Route::post('/changePassword', [AuthController::class, 'changePassword']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/registerUser', [AuthController::class, 'registerUser']);
    // Route::put('/appUsers', [AuthController::class, 'update']);
    Route::put('/appUsers/{id}', [AuthController::class, 'update']); 
    Route::put('/blockedUser/{id}', [AuthController::class, 'blockedUser']);
    Route::get('/appUsers', [AuthController::class, 'allUsers']);

    Route::post('/sendBill', [WhatsAppController::class, 'sendBill']);

    
    Route::post('/fileUpload', [FileUpload::class, 'fileUpload']);
    

    Route::post('/bills', [BillController::class, 'store']);
    Route::get('/bill/{id} ', [BillController::class, 'index']);
    Route::get('/bills', [BillController::class, 'show']);
     Route::get('/followup-appointments', [BillController::class, 'getFollowupAppointments']);
    Route::get('/followup-appointments/{date}', [BillController::class, 'getFollowupByDate']);

    // Route::get('/patients/search', [BillController::class, 'search']); 

    Route::get('/priviousBill/{id}', [BillController::class, 'showPreviousFunction']);

// use App\Http\Controllers\PrescriptionPatientInfoController;

    Route::post('/PrescriptionPatientInfo', [PrescriptionPatientInfoController::class, 'store']);
    Route::get('/PrescriptionPatientInfo/{id} ', [PrescriptionPatientInfoController::class, 'index']);
    Route::get('/PrescriptionPatientInfo', [PrescriptionPatientInfoController::class, 'show']);


Route::get('/users/{id}', [AuthController::class, 'show']);


Route::get('/patients/search', [PatientController::class, 'searchPatientByName']);


Route::get('/drugs', [DrugController::class, 'index']);
Route::get('/drugs/{id}', [DrugController::class, 'show']);
Route::post('/drugs', [DrugController::class, 'store']); 
Route::put('/drugs/{id}', [DrugController::class, 'update']);
Route::delete('/drugs/{id}', [DrugController::class, 'destroy']);
Route::get('/medicines/{doctor_id}', [DrugController::class, 'getMedicinesByDoctor']);


Route::get('/drugdetails', [DrugDetailController::class, 'index']);
Route::get('/drugdetails/{id}', [DrugDetailController::class, 'show']);
Route::post('/drugdetails', [DrugDetailController::class, 'store']);
Route::put('/drugdetails/{id}', [DrugDetailController::class, 'update']);
Route::delete('/drugdetails/{id}', [DrugDetailController::class, 'destroy']);
Route::get('/drugdetails/drug_id/{id}', [DrugDetailController::class, 'showdetails']);



Route::post('/patientexaminations', [PatientExaminationController::class, 'store']);
Route::get('/patientexaminations/{id}', [PatientExaminationController::class, 'show']);
Route::get('/patientexaminations/p_p_i_id/{p_p_i_id}', [PatientExaminationController::class, 'showByBillId']);
Route::get('/patientexaminationsData/{p_p_i_id}', [PatientExaminationController::class, 'getPatientExaminationsByBillId']);
Route::get('/ayurvedicexaminationsData/{p_p_i_id}', [PatientExaminationController::class, 'getAyurvedictExaminationsByBillId']);


Route::get('/healthdirectives', [HealthDirectiveController::class, 'index']);
Route::post('/healthdirectives', [HealthDirectiveController::class, 'store']);
Route::get('/healthdirectives/{id}', [HealthDirectiveController::class, 'show']);
Route::put('/healthdirectives/{id}', [HealthDirectiveController::class, 'update']);
Route::delete('/healthdirectives/{id}', [HealthDirectiveController::class, 'destroy']);
Route::get('/healthdirectives/p_p_i_id/{p_p_i_id}', [HealthDirectiveController::class, 'getByBillId']);
Route::get('/healthdirectivesData/{p_p_i_id}', [HealthDirectiveController::class, 'getPrescriptionsByBillId']);
    

Route::get('/patients', [PatientController::class, 'index']);
Route::post('/patients', [PatientController::class, 'store']);
Route::get('/patients/{patient}', [PatientController::class, 'show']);
Route::get('/loggedDrsPatient', [PatientController::class, 'patientDataShowLoggedDoctor']);

// Route::put('/patients/{patient}', [PatientController::class, 'update']);
Route::post('/manuallyAddPatient', [PatientController::class, 'manuallyAddPatient']);
Route::put('/patients/{id}', [PatientController::class, 'update']);
Route::delete('/patients/{patient}', [PatientController::class, 'destroy']);
Route::get('/patients/search', [PatientController::class, 'search']);
Route::get('/patients', [PatientController::class, 'searchPatientByMobile']);
Route::get('/getDoctorsByLoggedInClinic', [PatientController::class, 'getDoctorsByLoggedInClinic']);
Route::post('/getPatientInfo', [PatientController::class, 'getPatientInfoForBill']);
Route::post('/checkPatient', [PatientController::class, 'checkPatient']);
Route::get('/patients', [PatientController::class, 'getPatients']);
Route::get('/todays-tokans', [TokanController::class, 'getTodaysTokans']);
Route::post('/update-token-status', [TokanController::class, 'updateStatus']);
Route::get('/patientDisplyed', [TokanController::class, 'displyed']);
Route::post('/checkToken', [TokanController::class, 'checkToken']);   // new
Route::get('/suggestionPatient', [PatientController::class, 'suggestionPatient']); // new
// routes/api.php
Route::get('/patient-details/{id}', [PatientController::class, 'getPatientDetails']); 
Route::get('/findByPhone/{phone}', [PatientController::class, 'findByPhone']);


// Route::put('/appointments/{id}/{status}', [AppointmentController::class, 'updateAppointment']);
// Route::get('/test', [AppointmentController::class, 'index']);


Route::post('/timeslotadd', [TimeslotController::class, 'store']);
Route::get('/tiemslot/{doctor_id}', [TimeslotController::class, 'show']);
Route::put('/timeslotUpdate/{id}', [TimeslotController::class, 'update']);
Route::delete('/timeslotDestroy/{id}', [TimeslotController::class, 'destroy']);
Route::get('/doctorTiemslot', [TimeslotController::class, 'forDoctorSlot']);
Route::get('/allDataTimeSlot', [TimeslotController::class, 'allData']);


Route::post('/prescriptions', [PrescriptionController::class, 'store']);
Route::get('/prescriptions/{id}', [PrescriptionController::class, 'show']);
Route::get('/prescription/{billId}', [PrescriptionController::class, 'getPrescriptionByBillId']);
Route::get('/prescriptions/doctor/{doctorRegistrationNumber}', [PrescriptionController::class, 'getPrescriptions']);



Route::post('/descriptions', [DescriptionController::class, 'store']);
Route::get('/descriptions/{bill_id}', [DescriptionController::class, 'getDescriptionsByBillId']);
Route::get('/drugsDetails/{bill_id}', [DrugDetailController::class, 'getDrugDetailsByDrugId']);
Route::get('/bill-with-doctor/{id}', [BillController::class, 'getBillWithDoctor']);

Route::post('/uploadDrugs', [CsvUploadController::class, 'uploadDrugs']);

Route::post('/TokanCreate', [TokanController::class, 'store']);
Route::get('/TokanGet/{id}', [TokanController::class, 'show']); 
// Route::get('/suggestionPatient', [TokanController::class, 'suggestionPatient']);

Route::get('/getAppointmentsAllList', [OnlineAppointmentsController::class, 'getAppointmentsAllList']);
Route::get('/getAppointmentByToken/{id}', [OnlineAppointmentsController::class, 'getAppointmentByToken']);



});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
   // Route::get('/admin/dashboard', [AdminController::class, 'dashboard']); // Correctly specify the controller method
    Route::get('/monthlyReport', [OrderController::class, 'getMonthlyReport']);

    
});

Route::middleware(['auth:sanctum', 'role:user'])->group(function () {
    // User-specific routes can be added here
});

Route::middleware(['auth:sanctum', 'role:compounder'])->group(function () {
    // User-specific routes can be added here
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
   
Route::middleware('auth:sanctum')->get('/bills/doctor', [BillController::class, 'getBillsByDoctorId']);
Route::middleware('auth:sanctum')->get('/drugs/doctor', [DrugController::class, 'getDrugsByDoctorId']);


// Route::post('/whatsapp/receiveMessage', [WhatsAppController::class, 'receiveMessage']);
// Route::post('/whatsapp/incomingMessage', [WhatsAppController::class, 'incomingMessage']);


// Route::post('/reschedule-appointment', [AppointmetWhatsappController::class, 'rescheduleAppointment']);
// Route::post('/accept-appointment', [AppointmetWhatsappController::class, 'acceptAppointment']);
// Route::post('/handleCustomDate', [AppointmetWhatsappController::class, 'handleCustomDate']);
// Route::get('/slotsAvailable/{doctor_id}/{selectedDate}', [AppointmentController::class, 'getAvailableTimeSlots']);

// ------------------------ 


// Route::post('/whatsapp/receiveMessage', [AppointmetWhatsappController::class, 'receiveMessage']);
// Route::post('/whatsapp/incomingMessage', [AppointmetWhatsappController::class, 'incomingMessage']);
// Route::post('/webhook', [AppointmetWhatsappController::class, 'webhook']);
// // Route::get('/webhook', [WhatsAppController::class, 'webhook']);
// Route::get('/webhook', [AppointmetWhatsappController::class, 'verifyToken']);
// Route::get('/sendurlbuttons/{phone}', [AppointmetWhatsappController::class, 'xyz']);











// ------------------------------ Unesessary APIs ----------------------------------------------------- 

Route::post('/mobileLogin', [AuthController::class, 'mobileLogin']);
Route::post('/scrapVehicle', [ContactUsController::class, 'store']);
// Route::post('/contactUs', [InquiryController::class, 'saveContact']);
// Route::get('/allCatalogs', [CatalogController::class, 'allCatalog']);
Route::post('/upload-csv', [CsvUploadController::class, 'uploadCsv']);
Route::get('/contactUs', [InquiryController::class, 'ContactUS']);
    Route::get('/buySparePart', [InquiryController::class, 'BuySparePart']);
    Route::get('/sellSparePart', [InquiryController::class, 'SellSparePart']);
    Route::get('/enquiry/{id}', [InquiryController::class, 'getEnquiryById']);
    Route::get('/scrapEnquiry/{id}', [ContactUsController::class, 'getEnquiryById']);
    Route::post('/scrapEnquiry', [ContactUsController::class, 'store']);
    Route::post('/updateMultiEnquiry', [InquiryController::class, 'updateSparePart']);


    // Route::post('/createCatalog', [CatalogController::class, 'store']);
    Route::get('/scrapEnquiry', [ContactUsController::class, 'ScrapVehicleData']);
    Route::get('/spareMultiEnquiry', [InquiryController::class, 'SparPartEnquiry']);

    
    // Route::post('/newRemark', [StatusController::class, 'newRemark']);
    // Route::get('/getStatusBy/{id}', [StatusController::class, 'statusByID']);

    Route::put('/scrapStausUpdate/{id}', [ContactUsController::class, 'updateStatus']);
    Route::put('/multiEnquiryStausUpdate/{id}', [InquiryController::class, 'updateStatus']);


    Route::get('/enquiries/{type}/{status}', [InquiryController::class, 'findByTypeAndStatus']);
    Route::get('/allEnquiries/{month}', [InquiryController::class, 'allEnquriesInMonth']);
    Route::get('/allScrapEnquriesInMonth/{month}', [ContactUsController::class, 'allScrapEnquriesInMonth']);
    Route::get('/allScrapEnquriesByStatus/{status}/{month}', [ContactUsController::class, 'allScrapEnquriesByStatus']);

// ---------------------------------------------------------------------------------------------------------





