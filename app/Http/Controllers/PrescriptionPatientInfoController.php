<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PrescriptionPatientInfo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Description;

class PrescriptionPatientInfoController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'doctor_id' => 'string',

            'patient_name' => 'required|string',
            'address' => 'required|string',
            'email' => 'nullable|email',
            'contact' => ['nullable', 'string', 'digits:10', 'regex:/^\d{10}$/'],
            'dob' => 'nullable|date',
            'doctor_name' => 'nullable|string',
            'registration_number' => 'nullable|string',
            'visit_date' => 'required|date',
            // 'grand_total' => 'required|numeric',
        ]);

        // Get the logged-in doctor's ID
        $doctorId = Auth::id();

        // Create a new PrescriptionPatientInfo record
        $bill = PrescriptionPatientInfo::create([
            'doctor_id' => $doctorId, // Store the logged-in doctor's ID
            'patient_name' => $request->patient_name,
            'patient_address' => $request->address,
            'patient_email' => $request->email,
            'patient_contact' => $request->contact,
            'patient_dob' => $request->dob,
            'doctor_name' => $request->doctor_name,
            'registration_number' => $request->registration_number,
            'visit_date' => $request->visit_date,
            // 'grand_total' => $request->grand_total,
        ]);

        // Optionally, you could store descriptions if needed (commented out code below)
        // foreach ($request->descriptions as $descriptionData) {
        //     $descriptionData['bill_id'] = (string)$bill->id; // Store bill ID as a string
        //     Description::create($descriptionData);
        // }

        return response()->json([
            'id' => (string)$bill->id,
            'message' => 'Prescription record created successfully'
        ], 201);
    }

    public function index($id)
    {
        try {
            // Retrieve the bill from the database based on the provided ID
            $bill = DB::select('SELECT * FROM prescription_patient_info WHERE id = ?', [$id]);

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

    // Get bills for the logged-in doctor
    public function getBillsByDoctorId()
    {
        // Get the authenticated user's ID (doctor's ID)
        $doctorId = Auth::id();

        // Fetch bills where doctor_id matches the logged-in doctor's ID
        $bills = PrescriptionPatientInfo::where('doctor_id', $doctorId)->orderBy('created_at', 'desc')->get();

        // Check if bills were found
        if ($bills->isEmpty()) {
            return response()->json(['error' => 'No bills found for this doctor.'], 404);
        }

        return response()->json($bills); // Return bills as JSON
    }

    public function getBillWithDoctor($id)
    {
        // Fetch the bill by ID along with the doctor details
        $bill = PrescriptionPatientInfo::with('doctor')->find($id);

        if (!$bill) {
            return response()->json(['error' => 'Bill not found'], 404);
        }

        return response()->json($bill);
    }
}
