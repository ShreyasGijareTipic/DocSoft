<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\User;
use App\Models\Tokan;
use Illuminate\Support\Facades\Auth;

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


public function store(Request $request)
{
    try {
        // Validate the request data (including slot)
        $validatedData = $request->validate([
            'clinic_id' => 'string',
            'name' => 'required|min:1',
            'email' => 'required|email',
            'phone' => ['required', 'string', 'digits:10', 'regex:/^\d{10}$/'],
            'address' => 'required',
            'dob' => 'required|date',
            'doctor_id' => 'string',
            'slot' => 'required|string|in:morning,afternoon,evening',  // Ensure slot is required and valid
        ]);

        // Get the authenticated user's clinic_id
        $clinicId = Auth::user()->clinic_id;
        $doctorId = $request->doctor_id;
        $slot = $request->slot;  // Capture the slot value

        // Debug: Check if slot is being received properly
        if (!$slot) {
            return response()->json(['error' => 'Slot field is missing'], 422);
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
            'slot' => $slot,  // Ensure slot is stored
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
   












    // Get a single patient
    // public function show(Patient $patient)
    // {
    //     return response()->json($patient, 200);
    // }

    // Update a patient
    public function update(Request $request, Patient $patient)
    {
        $request->validate([
            'name' => 'sometimes|required',
            'email' => 'sometimes|required|email|unique:patients,email,' . $patient->id,
            'phone' => 'sometimes|required',
            'address' => 'sometimes|required',
            'dob' => 'sometimes|required|date',
            // 'gender' => 'sometimes|required'
        ]);

        $patient->update($request->all());

        return response()->json($patient, 200);
    }

    // Delete a patient
    public function destroy(Patient $patient)
    {
        $patient->delete();
        return response()->json(null, 204);
    }

    // public function getSuggestions(Request $request)
    // {
    //     $name = $request->query('name');

    //     // Assuming you have a Patient model
    //     $patients = Patient::where('name', 'LIKE', "%{$name}%")
    //         ->get(['id', 'name', 'age', 'address', 'email', 'phone', 'dob']); // Adjust the fields as necessary

    //     return response()->json($patients);
    // }


    public function show($id)
    {
        // Fetch patient by ID or throw a 404 error if not found
        $patient = Patient::findOrFail($id);
        
        // Return the patient data as JSON response
        return response()->json($patient);
    }






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



    public function getDoctorsByLoggedInClinic()
    {
        // Get the logged-in user's clinic_id
        $clinicId = Auth::user()->clinic_id;
    
        // Fetch users with the `type` field set to 'doctor' in the same clinic
        $doctors = User::where('clinic_id', $clinicId)
                       ->where('type', 'doctor') // Using `type` to identify doctors
                       ->get(['id', 'name', 'speciality', 'education']); // Fetch only necessary fields
    
        // Return the doctors as a JSON response
        return response()->json($doctors);
    }


    public function getPatientInfoForBill(Request $request)
    {
        try {
            // Validate the request to ensure a valid 'tokan_number' is provided
            $request->validate([
                'tokan_number' => 'required|integer',
            ]);
    
            // Get the 'tokan_number' from the request
            $tokanNumber = $request->input('tokan_number');
    
            // Fetch the token and its associated patient data
            $tokan = Tokan::where('tokan_number', $tokanNumber)
                ->whereDate('date', now()->toDateString()) // Ensure the token is valid for today
                ->with('patient') // Assuming a 'patient' relationship exists in the Tokan model
                ->first();
    
            // Check if the token exists
            if (!$tokan) {
                return response()->json(['message' => 'Token not found or expired'], 404);
            }
    
            // Check if patient data is associated with the token
            if (!$tokan->patient) {
                return response()->json(['message' => 'No patient data found for this token'], 404);
            }
    
            // Return the patient and token data
            return response()->json([
                'tokan' => $tokan,
                'patient' => $tokan->patient,
            ], 200);
    
        } catch (\Exception $e) {
            // Handle any unexpected errors and log them
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

