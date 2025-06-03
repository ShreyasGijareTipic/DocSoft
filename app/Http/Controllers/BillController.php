<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bill;
use App\Models\Description;
use App\Models\PatientExamination;
use App\Models\HealthDirective;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;



class BillController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'doctor_id' => 'string',
            'patient_id' => 'nullable|exists:patients,id', // <- NEW
            'patient_name' => 'required|string',
            'address' => 'required|string',
            'email' => 'nullable|email', // Make email optional
            'contact' => 'required|string|max:12',
            'dob' => 'date',
            'doctor_name' => 'string',
            'registration_number' => 'string',
            'visit_date' => 'required|date',
            'followup_date'=>'date|nullable',
            'grand_total' => 'string',
        ]);
    
        $doctorId = Auth::id();
       
    
        // Create a new Bill record
        $bill = Bill::create([
            'doctor_id' => $doctorId,
            'patient_id' => $request->patient_id, // <- NEW
            'patient_name' => $request->patient_name,
            'patient_address' => $request->address,
            'patient_email' => $request->email ?? null, // Set to null if not provided
            'patient_contact' => $request->contact,
            'patient_dob' => $request->dob,
            'doctor_name' => $request->doctor_name,
            'registration_number' => $request->registration_number,
            'visit_date' => $request->visit_date,
            'followup_date' => $request->followup_date,
            'grand_total' => $request->grand_total,
        ]);
    
        // Process descriptions if provided
        if ($request->has('descriptions') && is_array($request->descriptions)) {
            foreach ($request->descriptions as $descriptionData) {
                $descriptionData['bill_id'] = (string)$bill->id; // Store bill ID as a string
                Description::create($descriptionData);
            }
        }
    
        return response()->json([
            'id' => (string)$bill->id,
            'message' => 'Bill and descriptions created successfully',
        ], 201);
    }

//     public function store(Request $request)
// {
//     // Validate the request
//     $request->validate([
//         'doctor_id' => 'string',
//         'patient_id' => 'nullable|exists:patients,id', // Optional but validated if present
//         'name' => 'required|string',  //patient_name
//         'address' => 'required|string',
//         'email' => 'nullable|email',
//         'phone' => 'required|string|max:12',  //contact
//         'dob' => 'nullable|date',
//         'doctor_name' => 'string',
//         'registration_number' => 'string',
//         'visit_date' => 'nullable|date',
//         'grand_total' => 'string',
//     ]);

    
//     $doctorId = Auth::id();
//     $clinicId = Auth::user()->clinic_id;
//     $patientId = $request->patient_id;

//     // If no patient_id provided, create a new patient
//     if (!$patientId) {
//         $newPatient = \App\Models\Patient::create([
//             'clinic_id'=>$clinicId,
//             'doctor_id' => $doctorId,
//             'name' => $request->patient_name,
//             'phone' => $request->contact,
//             'email' => $request->email,
//             'address' => $request->address,
//             'dob' => $request->dob,
//         ]);

//         $patientId = $newPatient->id;
//     }

//     // Now create the bill with the patient_id
//     $bill = \App\Models\Bill::create([
//         'doctor_id' => $doctorId,
//         'patient_id' => $patientId,
//         'patient_name' => $request->patient_name,
//         'patient_address' => $request->address,
//         'patient_email' => $request->email ?? null,
//         'patient_contact' => $request->contact,
//         'patient_dob' => $request->dob,
//         'doctor_name' => $request->doctor_name,
//         'registration_number' => $request->registration_number,
//         'visit_date' => $request->visit_date,
//         'grand_total' => $request->grand_total,
//     ]);

//     // Save descriptions (bill details)
//     if ($request->has('descriptions') && is_array($request->descriptions)) {
//         foreach ($request->descriptions as $descriptionData) {
//             $descriptionData['bill_id'] = $bill->id;
//             \App\Models\Description::create($descriptionData);
//         }
//     }

//     return response()->json([
//         'id' => (string)$bill->id,
//         'message' => 'Bill and patient created successfully',
//     ], 201);
// }







    

    public function index($id)
    {
        try {
            // Retrieve the bill from the database based on the provided ID
            $bill = DB::select('SELECT * FROM bills WHERE id = ?', [$id]);
    
            // Check if a bill was found
            if (count($bill) > 0) {
                return response()->json($bill[0], 200); // Return the first bill object
            } else {
                return response()->json(['error' => 'Bill not found'], 404); // Return a 404 if no bill found
            }
        } catch (\Exception $e) {
            // Return a JSON response with the error message and a 500 status code
            return response()->json([
                'error' => 'Failed to retrieve bill: ' . $e->getMessage()
            ], 500);
        }
    }
    


//     public function show($id)
// {
//     try {
//         // Retrieve the bill by its ID
//         $bill = Bill::findOrFail($id); // This will throw a ModelNotFoundException if the bill doesn't exist

//         return response()->json($bill, 200);
//     } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
//         // Return a JSON response if the bill is not found
//         return response()->json([
//             'error' => 'Bill not found'
//         ], 404);
//     } catch (\Exception $e) {
//         // Return a JSON response with the error message and a 500 status code
//         return response()->json([
//             'error' => 'Failed to retrieve bill: ' . $e->getMessage()
//         ], 500);
//     }
// }

    
// public function show($id) {
//     // Using a raw SQL query to fetch descriptions
//     $descriptions = DB::select('SELECT * FROM bills WHERE id = ?', $id);

//     if (empty($descriptions)) {
//         return response()->json(['message' => 'Descriptions not found'], 404);
//     }
    
//     return response()->json($descriptions, 200);
// }





public function getBillWithDoctor($id)
    {
        // Fetch the bill by ID along with the doctor details
        $bill = Bill::with('doctor')->find($id);

        if (!$bill) {
            return response()->json(['error' => 'Bill not found'], 404);
        }

        return response()->json($bill);
    }

    // public function getPatientsForLoggedInDoctor()
    // {
    //     // Get the authenticated user's ID (doctor's ID)
    //     $doctorId = auth()->id();

    //     // Retrieve all bills for the logged-in doctor
    //     $patients = Bill::where('doctor_id', $doctorId)->get();

    //     return response()->json($patients);
    // }

//     public function getPatientsByDoctorId($doctorId)
// {
//     \Log::info("Fetching patients for doctor ID: $doctorId");

//     // Validate the doctorId
//     if (!is_numeric($doctorId)) {
//         return response()->json(['error' => 'Invalid doctor ID'], 400);
//     }

//     // Attempt to retrieve patients
//     try {
//         $patients = Bill::where('doctor_id', $doctorId)->get();
//     } catch (\Exception $e) {
//         \Log::error("Error fetching patients: " . $e->getMessage());
//         return response()->json(['error' => 'An error occurred while fetching patients.'], 500);
//     }

//     if ($patients->isEmpty()) {
//         return response()->json(['message' => 'No patients found for this doctor.'], 404);
//     }

//     return response()->json($patients);
// }
    
    





public function getBillsByDoctorId()
{
    // Validate the doctor ID (optional, but good practice)
  
   $id=Auth::user()->id;
    // Fetch bills where doctor_id matches the provided doctorId
    $bills = Bill::where('doctor_id', $id)->orderBy('created_at', 'desc')->get();

    // Check if bills were found
    if ($bills->isEmpty()) {
        return response()->json(['error' => 'No bills found for this doctor.'], 404);
    }

    return response()->json($bills); // Return bills as JSON
}




public function showPreviousFunction($billId)
{
    $doctorId = Auth::user()->id;

    // Verify the bill belongs to the logged-in doctor
    $bill = Bill::where('id', $billId)
                ->where('doctor_id', $doctorId)
                ->first();

    if (!$bill) {
        return response()->json(['message' => 'Bill not found or unauthorized'], 404);
    }

    // Fetch related data for this specific bill ID
    $descriptions = Description::where('bill_id', $billId)->get();
    $PatientExamination = PatientExamination::where('p_p_i_id', $billId)->get();
    $HealthDirective = HealthDirective::where('p_p_i_id', $billId)->get();

    return response()->json([
        'bill' => $bill,
        'descriptions' => $descriptions,
        'patient_examinations' => $PatientExamination,
        'health_directives' => $HealthDirective,
    ]);
}

// public function showPreviousFunction($billId)
// {
//     // Get the current doctor's ID
//     $doctorId = Auth::user()->id;

//     // Find the selected bill
//     $bill = Bill::find($billId);

//     // If bill doesn't exist or doctor is not authorized
//     if (!$bill || $bill->doctor_id !== $doctorId) {
//         return response()->json(['message' => 'Bill not found or unauthorized'], 404);
//     }

//     // Get the patient_id from that bill
//     $patientId = $bill->patient_id;

//     // 🔥 Get all bills of the same patient (across all doctors if needed)
//     $patientBillIds = Bill::where('patient_id', $patientId)->pluck('id');

//     // ✅ Get ALL records for this patient_id — regardless of bill
//     // $healthDirectives = HealthDirective::where('patient_id', $patientBillIds)->get();
//     $patientExaminations = PatientExamination::where('patient_id', $patientId)->get();

//     // Still get the description by all bill ids
//     $descriptions = Description::whereIn('bill_id', $patientBillIds)->get();

//     return response()->json([
//         'current_bill_id' => $billId,
//         'patient_id' => $patientId,
//         'related_bill_ids' => $patientBillIds,
//         'health_directives' => $healthDirectives,
//         'patient_examinations' => $patientExaminations,
//         'descriptions' => $descriptions,
//     ]);
// }

// Add this method to your BillController class

/**
 * Get followup appointments for the logged-in doctor
 * Only shows today and future dates
 */
public function getFollowupAppointments(Request $request)
{
    try {
        $doctorId = Auth::user()->id;
        $selectedDate = $request->query('date'); // Optional date filter
        
        // Build the query
        $query = Bill::where('doctor_id', $doctorId)
                    ->whereNotNull('followup_date')
                    ->where('followup_date', '>=', now()->toDateString()) // Only today and future dates
                    ->orderBy('followup_date', 'asc')
                    ->orderBy('created_at', 'desc');
        
        // If a specific date is requested, filter by that date
        if ($selectedDate) {
            // Validate date format
            if (!strtotime($selectedDate)) {
                return response()->json(['error' => 'Invalid date format'], 400);
            }
            
            $query->whereDate('followup_date', $selectedDate);
        }
        
        $followupBills = $query->get();
        
        // Group by date for better organization
        $groupedFollowups = $followupBills->groupBy(function($bill) {
            return Carbon::parse($bill->followup_date)->format('Y-m-d');
        });
        
        return response()->json([
            'success' => true,
            'data' => $followupBills,
            'grouped_data' => $groupedFollowups,
            'total_count' => $followupBills->count()
        ], 200);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'Failed to retrieve followup appointments: ' . $e->getMessage()
        ], 500);
    }
}

/**
 * Get followup appointments for a specific date
 */
public function getFollowupByDate($date)
{
    try {
        $doctorId = Auth::user()->id;
        
        // Validate date
        if (!strtotime($date)) {
            return response()->json(['error' => 'Invalid date format'], 400);
        }
        
        // Don't allow past dates
        if (Carbon::parse($date)->isPast() && !Carbon::parse($date)->isToday()) {
            return response()->json(['error' => 'Cannot fetch past date appointments'], 400);
        }
        
        $followupBills = Bill::where('doctor_id', $doctorId)
                            ->whereNotNull('followup_date')
                            ->whereDate('followup_date', $date)
                            ->orderBy('created_at', 'desc')
                            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $followupBills,
            'date' => $date,
            'count' => $followupBills->count()
        ], 200);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'Failed to retrieve followup appointments: ' . $e->getMessage()
        ], 500);
    }
}









}

