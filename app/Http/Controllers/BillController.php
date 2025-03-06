<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bill;
use App\Models\Description;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\User;
use Illuminate\Support\Facades\DB;



class BillController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'doctor_id' => 'string',
            'patient_name' => 'required|string',
            'address' => 'required|string',
            'email' => 'nullable|email', // Make email optional
            'contact' => 'required|string|max:12',
            'dob' => 'date',
            'doctor_name' => 'string',
            'registration_number' => 'string',
            'visit_date' => 'required|date',
            'grand_total' => 'string',
        ]);
    
        $doctorId = Auth::id();
    
        // Create a new Bill record
        $bill = Bill::create([
            'doctor_id' => $doctorId,
            'patient_name' => $request->patient_name,
            'patient_address' => $request->address,
            'patient_email' => $request->email ?? null, // Set to null if not provided
            'patient_contact' => $request->contact,
            'patient_dob' => $request->dob,
            'doctor_name' => $request->doctor_name,
            'registration_number' => $request->registration_number,
            'visit_date' => $request->visit_date,
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




}

