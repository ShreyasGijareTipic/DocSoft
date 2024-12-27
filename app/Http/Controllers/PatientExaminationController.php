<?php

namespace App\Http\Controllers;

use App\Models\PatientExamination;
use Illuminate\Http\Request;

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
            'bill_id' => 'required|exists:bills,id',
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
            'bill_id' => 'required|exists:bills,id',
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
        $patientExaminations = PatientExamination::where('bill_id', $billId)->get();

        // Return the data as a JSON response
        return response()->json($patientExaminations, 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error fetching patient examinations.',
            'error' => $e->getMessage(),
        ], 500);
    }
}
}
