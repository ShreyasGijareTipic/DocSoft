<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\User;
use App\Models\Bill;
use App\Models\Tokan;
use App\Models\HealthDirective;
use App\Models\PatientExamination;
use Illuminate\Support\Facades\Auth;
use App\Models\AyurvedicDiagnosis;

use Illuminate\Support\Facades\Log;

use App\Http\Controllers\Controller;

class PatientController extends Controller
{
    // Get all patients
    // public function index()
    // {
    //     $patients = Patient::all();
    //     return response()->json($patients, 200);
        
    // }
    public function index(Request $request)
    {
        $name = $request->query('name');
        $patients = Patient::where('name', 'like', "%$name%")->get();
        
        return response()->json($patients);
    }



    // Store a new patient
    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'name' => 'require|min:1',
    //         'email' => 'required|email|unique:patients,email',
    //         'phone' => 'required',
    //         'address' => 'required',
    //         'dob' => 'required|date',
    //         // 'gender' => 'required'
    //     ]);

    //     $patient = Patient::create($request->all());

    //     return response()->json($patient, 201);
    // }

//     public function store(Request $request)
// {
//     // Validate the request data 
//     $request->validate([
//         'clinic_id' => 'string',
//         'name' => 'required|min:1',
//         'email' => 'required|email',  // |unique:patients,email'
//         'phone' => ['required', 'string', 'digits:10', 'regex:/^\d{10}$/','unique:patients,phone'],
//         'address' => 'required',
//         'dob' => 'required|date',
//     ]);

//     // Get the authenticated user's clinic_id
//     $clinicId = Auth::user()->clinic_id;

//     // Check if clinic_id is available
//     if (!$clinicId) {
//         return response()->json(['error' => 'Clinic ID not found'], 403);
//     }

//     // Create the patient, including clinic_id
//     $patient = Patient::create([
//         'clinic_id' => $clinicId,
//         'name' => $request->name,
//         'email' => $request->email,
//         'phone' => $request->phone,
//         'address' => $request->address,
//         'dob' => $request->dob,
//     ]);

//     return response()->json($patient, 201);
// }



// public function store(Request $request)
// {
//     try {
//         // Validate the request data
//         $request->validate([
//             'clinic_id' => 'string',
//             'name' => 'required|min:1',
//             'email' => 'required|email',  // |unique:patients,email'
//             'phone' => ['required', 'string', 'digits:10', 'regex:/^\d{10}$/'],
//             'address' => 'required',
//             'dob' => 'required|date',
//             'doctor_id' => 'string', // Ensure doctor_id is passed and valid
            
//         ]);

//         // Get the authenticated user's clinic_id and doctor_id
//         $clinicId = Auth::user()->clinic_id;
//         $doctorId = $request->doctor_id;

//         // Check if clinic_id is available
//         if (!$clinicId) {
//             return response()->json(['error' => 'Clinic ID not found'], 403);
//         }

//         // Create the patient, including clinic_id
//         $patient = Patient::create([
//             'clinic_id' => $clinicId,
//             'doctor_id' => $doctorId,
//             'name' => $request->name,
//             'email' => $request->email,
//             'phone' => $request->phone,
//             'address' => $request->address,
//             'dob' => $request->dob,
//         ]);

//         // Determine today's date
//         $today = now()->toDateString();

//         // Fetch the last token number for today
//         $lastToken = Tokan::whereDate('date', $today)
//             ->where('clinic_id', $clinicId)
//             ->where('doctor_id', $doctorId)
//             ->orderBy('id', 'desc')
//             ->first();

//         // Calculate the new token number
//         $newTokenNumber = $lastToken ? ((int) $lastToken->tokan_number + 1) : 1;

        

//         // Create a new token for the patient with the doctor and clinic association
//         $token = Tokan::create([
//             'clinic_id' => $clinicId,          // Clinic of the logged-in doctor
//             'doctor_id' => $doctorId,          // Allocated doctor for the patient
//             'patient_id' => $patient->id,      // Newly created patient ID
//             'tokan_number' => $newTokenNumber, // Incremental token number for today
//             'date' => $today, 
//             'slot' => $request->slot,                  // Current date   $slot
//             'status' => 'pending',             // Or any other status you define
//         ]);

//         // Return response if everything goes well
//         return response()->json(['patient' => $patient, 'token' => $token], 201);

//     } catch (\Exception $e) {
//         // Handle the error and log the exception
//         \Log::error('Error creating patient or token: ' . $e->getMessage());

//         // Return a generic error message
//         return response()->json([
//             'error' => 'An error occurred while processing your request.',
//             'message' => $e->getMessage(),
//         ], 500);
//     }
// }


// public function store(Request $request)
// {
//     try {
//         // Validate the request data (including slot)
//         $validatedData = $request->validate([
//             'clinic_id' => 'string',
//             'name' => 'required|min:1',
//             'email' => 'required|email',
//             'phone' => ['required', 'string', 'digits:10', 'regex:/^\d{10}$/'],
//             'address' => 'required',
//             'dob' => 'required|date',
//             'doctor_id' => 'string',
//             'slot' => 'required|string|in:morning,afternoon,evening',  // Ensure slot is required and valid
//         ]);

//         // Get the authenticated user's clinic_id
//         $clinicId = Auth::user()->clinic_id;
//         $doctorId = $request->doctor_id;
//         $slot = $request->slot;  // Capture the slot value

//         // Debug: Check if slot is being received properly
//         if (!$slot) {
//             return response()->json(['error' => 'Slot field is missing'], 422);
//         }

//         // Ensure clinic_id is available
//         if (!$clinicId) {
//             return response()->json(['error' => 'Clinic ID not found'], 403);
//         }

//         // Create the patient
//         $patient = Patient::create([
//             'clinic_id' => $clinicId,
//             'doctor_id' => $doctorId,
//             'name' => $request->name,
//             'email' => $request->email,
//             'phone' => $request->phone,
//             'address' => $request->address,
//             'dob' => $request->dob,
//         ]);

//         // Determine today's date
//         $today = now()->toDateString();

//         // Fetch the last token number for today
//         $lastToken = Tokan::whereDate('date', $today)
//             ->where('clinic_id', $clinicId)
//             ->where('doctor_id', $doctorId)
//             ->orderBy('id', 'desc')
//             ->first();

//         // Calculate the new token number
//         $newTokenNumber = $lastToken ? ((int) $lastToken->tokan_number + 1) : 1;

//         // Create the token with the slot
//         $token = Tokan::create([
//             'clinic_id' => $clinicId,
//             'doctor_id' => $doctorId,
//             'patient_id' => $patient->id,
//             'tokan_number' => $newTokenNumber,
//             'date' => $today,
//             'slot' => $slot,  // Ensure slot is stored
//             'status' => 'pending',
//         ]);

//         // Return response
//         return response()->json(['patient' => $patient, 'token' => $token], 201);

//     } catch (\Exception $e) {
//         // Log error
//         \Log::error('Error creating patient or token: ' . $e->getMessage());

//         return response()->json([
//             'error' => 'An error occurred while processing your request.',
//             'message' => $e->getMessage(),
//         ], 500);
//     }
// }
   

public function store(Request $request)
{
    try {
        // Validate the request data (including slot)
        $validatedData = $request->validate([
            'clinic_id' => 'string',
            'doctor_id' => 'string',
            'name' => 'required|min:1',
            'email' => 'required|email',
            'phone' => ['required', 'string', 'digits:10', 'regex:/^\d{10}$/'],
            'address' => 'required',
            'dob' => 'required|date',
            'doctor_id' => 'required|integer', // Allow integer doctor_id
            'slot' => 'required|string|in:morning,afternoon,evening' ?? 'morning',
            'pincode' => 'nullable|string',
            'occupation' => 'nullable|string'
        ]);

        // Get the authenticated user's clinic_id   
        $clinicId = Auth::user()->clinic_id;
        $doctorId = $request->doctor_id;
        // $doctorId = Auth::id();
        $slot = $request->slot;  // Capture the slot value

        // Debug: Check if slot is being received properly
        if (!$slot) {
            return response()->json(['error' => 'Slot field is missing'], 422);
        }

        if (!$doctorId) {
            return response()->json(['error' => 'doctor id field is missing'], 422);
        }
        

        // Ensure clinic_id is available
        if (!$clinicId) {
            return response()->json(['error' => 'Clinic ID not found'], 403);
        }

        // Create the patient
        $patient = Patient::create([
            'clinic_id' => $clinicId,
            'doctor_id' => $doctorId,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'dob' => $request->dob,
            'occupation'=> $request->occupation,
            'pincode'=> $request->pincode
        ]);

        // Determine today's date
        $today = now()->toDateString();

        // Fetch the last token number for today
        $lastToken = Tokan::whereDate('date', $today)
            ->where('clinic_id', $clinicId)
            ->where('doctor_id', $doctorId)
            ->orderBy('id', 'desc')
            ->first();

        // Calculate the new token number
        $newTokenNumber = $lastToken ? ((int) $lastToken->tokan_number + 1) : 1;

        // Create the token with the slot
        $token = Tokan::create([
            'clinic_id' => $clinicId,
            'doctor_id' => $doctorId,
            'patient_id' => $patient->id,
            'tokan_number' => $newTokenNumber,
            'date' => $today,
            'slot' => $slot,
            'status' => 'pending',
        ]);

        // Return response
        return response()->json(['patient' => $patient, 'token' => $token], 201);

    } catch (\Exception $e) {
        // Log error
        \Log::error('Error creating patient or token: ' . $e->getMessage());

        return response()->json([
            'error' => 'An error occurred while processing your request.',
            'message' => $e->getMessage(),
        ], 500);
    }
}


public function manuallyAddPatient(Request $request)
{
    // ✅ First, validate only the fields that come from the request
    $validatedData = $request->validate([
        'name'    => 'required|string|min:1',
        'email'   => 'required|email',
        'phone'   => ['required', 'string', 'digits:10', 'regex:/^\d{10}$/'],
        'address' => 'required|string',
        'dob'     => 'required|date',
        'occupation'  => 'nullable|string',
        'pincode' => 'nullable|string',
    ]);

    try {
        // ✅ Append the authenticated doctor's clinic_id and doctor_id
        $validatedData['clinic_id'] = Auth::user()->clinic_id ?? null;
        $validatedData['doctor_id'] = Auth::id();

        // ✅ Create the patient
        $patient = Patient::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Patient added successfully',
            'patient' => $patient
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'Failed to add patient',
            'details' => $e->getMessage()
        ], 500);
    }
    
   
}












    // Get a single patient
    // public function show(Patient $patient)
    // {
    //     return response()->json($patient, 200);
    // }

    // Update a patient
    // public function update(Request $request, Patient $patient)
    // {
    //     $request->validate([
    //         'name' => 'sometimes|required',
    //         'email' => 'sometimes|required|email|unique:patients,email,' . $patient->id,
    //         'phone' => 'sometimes|required',
    //         'address' => 'sometimes|required',
    //         'dob' => 'sometimes|required|date',
    //         // 'gender' => 'sometimes|required'
    //     ]);

    //     $patient->update($request->all());

    //     return response()->json($patient, 200);
    // }
    public function update(Request $request, $id)
{
    $patient = Patient::findOrFail($id); // Fetch patient by ID

    $request->validate([
        'name' => 'sometimes|required|string',
        'email' => 'sometimes|required|email',
        'phone' => 'sometimes|required|string',
        'address' => 'sometimes|required|string',
        'dob' => 'sometimes|required|date',
        // 'gender' => 'sometimes|required|string'
    ]);

    $patient->update($request->all());

    return response()->json([
        'message' => 'Patient updated successfully',
        'data' => $patient
    ], 200);
}


    // Delete a patient
    public function destroy(Patient $patient)
    {
        $patient->delete();
        return response()->json(null, 204);
    }


    public function suggestionPatient(Request $request)
{
    $doctorId = Auth::id(); // currently logged-in doctor's ID
    $search = $request->input('query');

    // Fetch patients directly assigned to this doctor from patients table
    $patients = Patient::where('doctor_id', $doctorId)
        ->where(function ($query) use ($search) {
            $query->where('name', 'like', '%' . $search . '%')
                  ->orWhere('phone', 'like', '%' . $search . '%');
        })
        ->limit(10)
        ->get();


    return response()->json($patients);
}

// YourController.php
// public function getPatientDetails($id)
// {
//     $doctorId = Auth::id(); // Ensure the doctor owns this patient

//     $patient = Patient::where('id', $id)
//                 ->where('doctor_id', $doctorId)
//                 ->first();

//     if (!$patient) {
//         return response()->json(['error' => 'Patient not found'], 404);
//     }

//     // Get the latest bill for the patient
//     $lastBill = Bill::where('patient_id', $id)
//                 ->latest('created_at')
//                 ->first();

//     // Initialize empty arrays for additional data
//     $healthDirectives = [];
//     $patientExaminations = [];

//     // If a bill exists, fetch additional data using its ID
//     if ($lastBill) {
//         $billId = $lastBill->id;


//         // Fetch health directives where p_p_i_id = bill ID
//         $healthDirectives = HealthDirective::where('p_p_i_id', $billId)->get();

//         // Fetch patient examinations where p_p_i_id = bill ID
//         $patientExaminations = PatientExamination::where('p_p_i_id', $billId)->get();
//     }

//     return response()->json([
//         'patient' => $patient,
//         'last_bill' => $lastBill,
//         'health_directives' => $healthDirectives,
//         'patient_examinations' => $patientExaminations,
//     ]);
// }

// ------------------ 
// public function getPatientDetails($id)
// {
//     $doctorId = Auth::id(); // Ensure the doctor owns this patient

//     $patient = Patient::where('id', $id)
//                 ->where('doctor_id', $doctorId)
//                 ->first();

//     if (!$patient) {
//         return response()->json(['error' => 'Patient not found'], 404);
//     }

//     // Get the latest bill for the patient
//     $lastBill = Bill::where('patient_id', $id)
//                 // ->latest('created_at')
//                 // ->first();
//                 ->orderBy('created_at', 'desc')
//                 ->take(3)
//                 ->get();


//     // Get latest 3 health directives
//     $healthDirectives = HealthDirective::where('patient_id', $id)
//                         ->orderBy('created_at', 'desc')
//                         ->take(3)
//                         ->get();

//     // Get latest 3 patient examinations
//     $patientExaminations = PatientExamination::where('patient_id', $id)
//                             ->orderBy('created_at', 'desc')
//                             ->take(3)
//                             ->get();

//     return response()->json([
//         'patient' => $patient,
//         'last_bill' => $lastBill,
//         'health_directives' => $healthDirectives,
//         'patient_examinations' => $patientExaminations,
//     ]);
// }

public function getPatientDetails($id)
{
    $clinicId = Auth::user()->clinic_id; // Get clinic ID of the logged-in user

    // Get the patient under the same clinic
    $patient = Patient::where('id', $id)
                ->where('clinic_id', $clinicId)
                ->first();

    if (!$patient) {
        return response()->json(['error' => 'Patient not found'], 404);
    }

    // Get the latest 3 bills for the patient
    $lastBill = Bill::where('patient_id', $id)
                ->orderBy('created_at', 'desc')
                ->take(3)
                ->get();

    // Get latest 3 health directives
    $healthDirectives = HealthDirective::where('patient_id', $id)
                        ->orderBy('created_at', 'desc')
                        ->take(3)
                        ->get();

    // Get latest 3 patient examinations
    $patientExaminations = PatientExamination::where('patient_id', $id)
                            ->orderBy('created_at', 'desc')
                            ->take(3)
                            ->get();

                              // Get latest 3 patient examinations 
    // $ayurvedicExaminations = AyurvedicDiagnosis::where('patient_id', $id)
    //                         ->orderBy('created_at', 'desc')
    //                         ->take(3)
    //                         ->get();
    $ayurvedicExaminations = AyurvedicDiagnosis::where('patient_id', $id)
    ->orderBy('created_at', 'desc')
    ->take(3)
    ->get()
    ->map(function ($item) {
        foreach (['prasavvedan_parikshayein', 'habits', 'personal_history'] as $field) {
            if (!empty($item[$field])) {
                $decoded = json_decode($item[$field], true); // true => associative array

                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    // Safely filter non-empty entries
                    $filtered = array_filter($decoded, function ($v) {
                        return is_array($v) ? count(array_filter($v)) > 0 : !empty($v);
                    });

                    $item[$field] = count($filtered) > 0 ? $filtered : null;
                } else {
                    $item[$field] = null;
                }
            } else {
                $item[$field] = null;
            }
        }

        return $item;
    });



    return response()->json([
        'patient' => $patient,
        'last_bill' => $lastBill,
        'health_directives' => $healthDirectives,
        'patient_examinations' => $patientExaminations,
        'ayurvedic_examintion' => $ayurvedicExaminations,
    ]);
}














    public function show($id)
    {
        // Fetch patient by ID or throw a 404 error if not found
        $patient = Patient::findOrFail($id);
        
        // Return the patient data as JSON response
        return response()->json($patient);
    }


    public function patientDataShowLoggedDoctor()
    {
        
        $doctorId = auth()->id(); // Get the currently logged-in doctor's ID

    // Fetch all patients for the logged-in doctor
    $patients = Patient::where('doctor_id', $doctorId)->get();

    return response()->json($patients);
    }

//     public function displyed()
// {
//     $doctorId = auth()->id();
//     $patients = Patient::where('doctor_id', $doctorId)->get();

//     return response()->json($patients);
// }


    // public function searchPatientByName(Request $request)
    // {
    //     $searchTerm = $request->input('name');
    //     $patients = Patient::where('name', 'LIKE', '%' . $searchTerm . '%')->get();
    //     return response()->json($patients);
    // }



    public function search(Request $request)
    {
        $query = $request->query('name');
        
        // Search for patients with a similar name
        $patients = Patient::where('name', 'like', "%{$query}%")->get(['id', 'name',  'address', 'email', 'phone', 'dob']);

        return response()->json($patients);
    }
    

    public function searchPatientByMobile(Request $request)
    {
        // Validate the mobile query parameter
        $request->validate([
            'phone' => 'required|numeric',
        ]);

        // Search for the patient by mobile number
        $patient = Patient::where('phone', $request->phone)->get();

        if ($patient) {
            return response()->json($patient, 200);  // Return the found patient
        } else {
            return response()->json(['message' => 'Patient not found'], 404); // Return not found message
        }
    }



    // public function getDoctorsByLoggedInClinic()
    // {
    //     // Get the logged-in user's clinic_id
    //     $clinicId = Auth::user()->clinic_id;
    
    //     // Fetch users with the `type` field set to 'doctor' in the same clinic
    //     $doctors = User::where('clinic_id', $clinicId)
    //                    ->where('type', 'doctor') // Using `type` to identify doctors
    //                    ->get(['id', 'name', 'speciality', 'education']); // Fetch only necessary fields
    
    //     // Return the doctors as a JSON response
    //     return response()->json($doctors);
    // }


//     public function getDoctorsByLoggedInClinic()
// {
//     // Get the logged-in user
//     $user = Auth::user();

//     // Check if the logged-in user's type is 2
//     if ($user->type == 2) {
//         // Fetch users with type 1 (assuming type 1 is what you want to display)
//         $users = User::where('clinic_id', $user->clinic_id)
//                      ->where('type', 1) // Fetch users of type 1
//                      ->get(['id', 'name', 'speciality', 'education']); // Fetch only necessary fields

//         // Return the users as a JSON response
//         return response()->json($users);
//     }

//     // If the logged-in user's type is not 2, return an empty response or error
//     return response()->json(['message' => 'Unauthorized access'], 403);
// }
public function getDoctorsByLoggedInClinic()
{
    // Get the logged-in user
    $user = Auth::user();

    // Only proceed if the user is of type 2
    if ($user && $user->type == 2) {
        // Fetch doctors with type 1 within the same clinic
        $users = User::where('clinic_id', $user->clinic_id)
                     ->where('type', 1)
                     ->get(['id', 'name', 'speciality', 'education']);

        return response()->json($users);
    }

    // If the user is not type 2, return a silent no-content response
    return response()->noContent(); // 204 No Content
}




    // public function getPatientInfoForBill(Request $request)
    // {
    //     try {
    //         // Validate the request to ensure a valid 'tokan_number' is provided
    //         $request->validate([
    //             'tokan_number' => 'required|integer',
    //         ]);
    
    //         // Get the 'tokan_number' from the request
    //         $tokanNumber = $request->input('tokan_number');
    
    //         // Fetch the token and its associated patient data
    //         $tokan = Tokan::where('tokan_number', $tokanNumber)
    //             ->whereDate('date', now()->toDateString()) // Ensure the token is valid for today
    //             ->with('patient') // Assuming a 'patient' relationship exists in the Tokan model
    //             ->first();
    
    //         // Check if the token exists
    //         if (!$tokan) {
    //             return response()->json(['message' => 'Token not found or expired'], 404);
    //         }
    
    //         // Check if patient data is associated with the token
    //         if (!$tokan->patient) {
    //             return response()->json(['message' => 'No patient data found for this token'], 404);
    //         }
    
    //         // Return the patient and token data
    //         return response()->json([
    //             'tokan' => $tokan,
    //             'patient' => $tokan->patient,
    //         ], 200);
    
    //     } catch (\Exception $e) {
    //         // Handle any unexpected errors and log them
    //         \Log::error('Error fetching patient info by token: ' . $e->getMessage());
    
    //         return response()->json([
    //             'error' => 'An error occurred while fetching patient data',
    //             'message' => $e->getMessage(),
    //         ], 500);
    //     }
    // }

// -------------------- 

//     public function getPatientInfoForBill(Request $request)
// {
//     try {
//         // Validate the request to ensure a valid 'tokan_number' is provided
//         $request->validate([
//             'tokan_number' => 'required|integer',
//         ]);

//         // Get the 'tokan_number' from the request
//         $tokanNumber = $request->input('tokan_number');

//         // Get the logged-in doctor's clinic ID
//         $clinicId = auth()->user()->clinic_id;

//         // Fetch the token where the clinic ID matches the logged-in doctor's clinic ID
//         $tokan = Tokan::where('tokan_number', $tokanNumber)
//             ->whereDate('date', now()->toDateString()) // Ensure the token is for today
//             ->where('clinic_id', $clinicId) // Match logged-in doctor's clinic ID
//             ->with('patient') // Assuming a 'patient' relationship exists in the Tokan model
//             ->first();

//         // Check if the token exists and belongs to the same clinic
//         if (!$tokan) {
//             return response()->json(['message' => 'Token not found, expired, or does not belong to this clinic'], 404);
//         }

//         // Check if patient data is associated with the token
//         if (!$tokan->patient) {
//             return response()->json(['message' => 'No patient data found for this token'], 404);
//         }

//         // Return the patient and token data
//         return response()->json([
//             'tokan' => $tokan,
//             'patient' => $tokan->patient,
//         ], 200);

//     } catch (\Exception $e) {
//         // Handle any unexpected errors and log them
//         \Log::error('Error fetching patient info by token: ' . $e->getMessage());

//         return response()->json([
//             'error' => 'An error occurred while fetching patient data',
//             'message' => $e->getMessage(),
//         ], 500);
//     }
// }
public function getPatientInfoForBill(Request $request)
{
    try {
        $request->validate([
            'tokan_number' => 'required|integer',
        ]);

        $tokanNumber = $request->input('tokan_number');
        $loggedInDoctorId = auth()->user()->id;
        $clinicId = auth()->user()->clinic_id;

        // Fetch token directly assigned to the logged-in doctor
        $tokan = Tokan::where('tokan_number', $tokanNumber)
            ->whereDate('date', now()->toDateString())
            ->where('clinic_id', $clinicId)
            ->where('doctor_id', $loggedInDoctorId) // ✅ Enforce doctor-token assignment in query
            ->with('patient')
            ->first();

        if (!$tokan) {
            return response()->json([
                'message' => 'Token not found, expired, or not assigned to you.'
            ], 404);
        }

        if (!$tokan->patient) {
            return response()->json(['message' => 'No patient data found for this token'], 404);
        }

        return response()->json([
            'tokan' => $tokan,
            'patient' => $tokan->patient,
        ], 200);

    } catch (\Exception $e) {
        \Log::error('Error fetching patient info by token: ' . $e->getMessage());

        return response()->json([
            'error' => 'An error occurred while fetching patient data',
            'message' => $e->getMessage(),
        ], 500);
    }
}

    



    public function checkPatient(Request $request)
    {
        $tokenId = $request->input('id');

        try {
            $exists = Patient::where('id', $tokenId)->exists();
            return response()->json(['exists' => $exists], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to check patient'], 500);
        }
  
    }




        public function getPatients(Request $request)
        {
            // Get query parameters
            $phone = $request->query('phone');
            $clinicId = $request->query('clinic_id');
    
            // Log received parameters
            Log::info("Received Search Request", ['phone' => $phone, 'clinic_id' => $clinicId]);
    
            // Validate input
            if (!$phone || !$clinicId) {
                return response()->json(['error' => 'Phone and Clinic ID are required'], 400);
            }
    
            // Ensure `clinic_id` is an integer
            $clinicId = intval($clinicId);
    
            // Fetch patient matching the phone number and clinic_id
            $patients = Patient::where('phone', $phone)
                ->where('clinic_id', $clinicId)
                ->get();
    
            // Log the retrieved data
            Log::info("Patients Found:", ['data' => $patients]);
    
            // Return response
            if ($patients->isEmpty()) {
                return response()->json(['message' => 'No patient found'], 404);
            }
    
            return response()->json($patients);
        }
    

}

