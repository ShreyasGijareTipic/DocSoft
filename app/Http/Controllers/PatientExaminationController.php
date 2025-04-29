<?php

namespace App\Http\Controllers;

use App\Models\PatientExamination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class PatientExaminationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all patient examinations
        $examinations = PatientExamination::with('bill')->get();

        return response()->json($examinations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'p_p_i_id' => 'required|exists:Bills,id',
            'patient_id' => 'nullable|exists:patients,id', // <- NEW
            'bp' => 'nullable|string',
            'pulse' => 'nullable|string',
            'past_history' => 'nullable|string',
            'complaints' => 'nullable|string',
            'systemic_exam_general' => 'nullable|string',
            'systemic_exam_pa' => 'nullable|string',
        ]);

        // Create a new patient examination record
        $examination = PatientExamination::create($validatedData);

        return response()->json($examination, 201); // Return with status code 201 (Created)
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Fetch a specific patient examination
        $examination = PatientExamination::with('bill')->findOrFail($id);

        return response()->json($examination);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'p_p_i_id' => 'required|exists:Bills,id',
            'bp' => 'nullable|string',
            'pulse' => 'nullable|string',
            'past_history' => 'nullable|string',
            'complaints' => 'nullable|string',
            'systemic_exam_general' => 'nullable|string',
            'systemic_exam_pa' => 'nullable|string',
        ]);

        // Fetch and update the patient examination record
        $examination = PatientExamination::findOrFail($id);
        $examination->update($validatedData);

        return response()->json($examination);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Delete a specific patient examination record
        $examination = PatientExamination::findOrFail($id);
        $examination->delete();

        return response()->json(['message' => 'Record deleted successfully']);
    }



    public function showByBillId($billId)
{
    try {
        // Fetch patient examination data based on bill_id
        $patientExaminations = PatientExamination::where('p_p_i_id', $billId)->get();

        // Return the data as a JSON response
        return response()->json($patientExaminations, 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error fetching patient examinations.',
            'error' => $e->getMessage(),
        ], 500);
    }
}





public function getPatientExaminationsByBillId($p_p_i_id) {
    try {
        // Validate the input ID (ensure it's not empty and is numeric)
        if (empty($p_p_i_id) || !is_numeric($p_p_i_id)) {
            return response()->json(['message' => 'Invalid p_p_i_id provided'], 400);
        }

        // Fetch data from the 'patient_examinations' table using Query Builder
        $patientExaminations = DB::table('patient_examinations')
            ->where('p_p_i_id', $p_p_i_id)
            ->get();

        // Check if any data exists for the given p_p_i_id
        if ($patientExaminations->isEmpty()) {
            return response()->json(['message' => 'PatientExaminations not found'], 404);
        }

        // Return the fetched data as a JSON response
        return response()->json($patientExaminations, 200);
    } catch (\Exception $e) {
        // Log the error for debugging purposes
        \Log::error('Error fetching PatientExaminations: ' . $e->getMessage());

        // Return a generic error response
        return response()->json([
            'error' => 'An error occurred while fetching PatientExaminations.',
            'message' => $e->getMessage(),
        ], 500);
    }
}



}
