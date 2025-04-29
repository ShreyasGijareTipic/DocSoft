<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tokan;
use App\Models\Patient;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class TokanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tokans = Tokan::all();
        return response()->json($tokans);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'clinic_id' => 'required|integer',
            'doctor_id' => 'integer',
            'patient_id' => 'required|integer',
            'date' => 'date',
            'slot' => 'string',
            'status' => 'string',
        ]);
    
        // Get the last token number for the given clinic on the current date
        $lastToken = Tokan::where('clinic_id', $validatedData['clinic_id'])
                          ->whereDate('date', now()->toDateString()) // Filter for today’s date
                          ->orderBy('tokan_number', 'desc')
                          ->first();
    
        // Determine the next token number (Start from 1 if no tokens exist for today)
        $validatedData['tokan_number'] = $lastToken ? $lastToken->tokan_number + 1 : 1;
    
        // Create new token
        $tokan = Tokan::create($validatedData);
    
        return response()->json(['message' => 'Token created successfully!', 'tokan' => $tokan], 201);
    }
    
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $tokan = Tokan::find($id);

        if (!$tokan) {
            return response()->json(['message' => 'Tokan not found'], 404);
        }

        return response()->json($tokan);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $tokan = Tokan::find($id);

        if (!$tokan) {
            return response()->json(['message' => 'Tokan not found'], 404);
        }

        $validatedData = $request->validate([
            'clinic_id' => 'integer',
            'doctor_id' => 'integer',
            'patient_id' => 'integer',
            'appointment_id' => 'integer',
            'date' => 'date',
            'status' => 'string',
        ]);

        $tokan->update($validatedData);

        return response()->json(['message' => 'Tokan updated successfully!', 'tokan' => $tokan]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $tokan = Tokan::find($id);

        if (!$tokan) {
            return response()->json(['message' => 'Tokan not found'], 404);
        }

        $tokan->delete();

        return response()->json(['message' => 'Tokan deleted successfully!']);
    }

    // public function getTodaysTokans()
    // {
    //     try {
    //         $today = Carbon::today()->toDateString();

    //         $tokans = Tokan::whereDate('date', $today)
    //                        ->orderBy('tokan_number', 'asc')
    //                        ->get();

    //         return response()->json([
    //             'success' => true,
    //             'data' => $tokans
    //         ], 200);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Error fetching today\'s tokens',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }


    public function getTodaysTokans()
{
    try {
        $today = Carbon::today()->toDateString();
        $clinicId = auth()->user()->clinic_id; // Get logged-in user's clinic ID

        $tokans = Tokan::whereDate('date', $today)
                       ->where('clinic_id', $clinicId) // Filter by clinic ID
                       ->orderBy('tokan_number', 'asc')
                       ->get();

        return response()->json([
            'success' => true,
            'data' => $tokans
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error fetching today\'s tokens',
            'error' => $e->getMessage()
        ], 500);
    }
}






    public function updateStatus(Request $request)
    {
        $request->validate([
            'tokan_number' => 'required|exists:tokan,tokan_number',
            'status' => 'required|in:Pending,In Progress,Completed',
        ]);
    
        $tokan = DB::table('tokan')->where('tokan_number', $request->tokan_number)->first();
    
        if (!$tokan) {
            return response()->json(['success' => false, 'message' => 'Token not found'], 404);
        }
    
        DB::table('tokan')->where('tokan_number', $request->tokan_number)->update(['status' => $request->status]);
    
        return response()->json(['success' => true, 'message' => 'Status updated successfully']);
    }
    
    


    public function displyed()
    {
        $doctorId = auth()->id();
    
        // Step 1: Get patient IDs from `tokan` table where doctor_id = logged-in doctor
        $patientIds = tokan::where('doctor_id', $doctorId)->pluck('patient_id'); // Assuming tokan has patient_id field
    
        // Step 2: Get patient details for those IDs from `patients` table
        $patients = Patient::whereIn('id', $patientIds)->get();
    
        return response()->json($patients);
    }
    



// public function suggestionPatient(Request $request){

//     $doctorId = Auth::id(); // currently logged in doctor ID
//     $search = $request->input('query');

//     // Join patients with tokens to filter only doctor's patients
//     $patients = Patient::whereIn('id', function ($query) use ($doctorId) {
//             $query->select('patient_id')
//                   ->from('tokan')
//                   ->where('doctor_id', $doctorId);
//         })
//         ->where(function ($query) use ($search) {
//             $query->where('name', 'like', '%' . $search . '%')
//                   ->orWhere('phone', 'like', '%' . $search . '%');
//         })
//         ->limit(10)
//         ->get();

//     return response()->json($patients);
// }


public function checkToken(Request $request) {
    // $patientId = $request->input('patient_id');
    // $exists = DB::table('tokan')->where('patient_id', $patientId)->exists();

    // return response()->json(['exists' => $exists], 200);
    $patientId = $request->input('patient_id');

    try {
        // Check in 'tokan' table
        $tokenExists = DB::table('tokan')->where('patient_id', $patientId)->exists();

        // Check in 'patients' table
        $patientExists = Patient::where('id', $patientId)->exists();

        // Return true if found in either table
        $exists = $tokenExists || $patientExists;

        return response()->json(['exists' => $exists], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'Failed to check token/patient',
            'details' => $e->getMessage()
        ], 500);
    }
}


}
