<?php

namespace App\Http\Controllers;

use App\Models\PatientExamination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\AyurvedicDiagnosis;

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
    // public function store(Request $request)
    // {
    //     // Validate the request data
    //     $validatedData = $request->validate([
    //         'p_p_i_id' => 'required|exists:Bills,id',
    //         'patient_id' => 'nullable|exists:patients,id', // <- NEW
    //         'bp' => 'nullable|string',
    //         'height' => 'nullable|string',
    //         'weight' => 'nullable|string',
    //         'pulse' => 'nullable|string',
    //         'past_history' => 'nullable|string',
    //         'complaints' => 'nullable|string',
    //         'systemic_exam_general' => 'nullable|string',
    //         'systemic_exam_pa' => 'nullable|string',
    //     ]);

    //     // Create a new patient examination record
    //     $examination = PatientExamination::create($validatedData);

    //     return response()->json($examination, 201); // Return with status code 201 (Created)
    // }


// public function store(Request $request)
// {
//     // Validate the request data
//     $validatedData = $request->validate([
//         'p_p_i_id' => 'required|exists:Bills,id',
//         'patient_id' => 'nullable|exists:patients,id',
//         'bp' => 'nullable|string',
//         'height' => 'nullable|string',
//         'weight' => 'nullable|string',
//         'pulse' => 'nullable|string',
//         'past_history' => 'nullable|string',
//         'complaints' => 'nullable|string',
//         'systemic_exam_general' => 'nullable|string',
//         'systemic_exam_pa' => 'nullable|string',

//         // AyurvedicDiagnosis fields
//         'occupation' => 'nullable|string',
//         'pincode' => 'nullable|string',
//         'email' => 'nullable|string',
//         'ayurPastHistory'=> 'nullable|string',
//         'prasavvedan_parikshayein' => 'nullable|string',
//         'habits' => 'nullable|string',
//         'lab_investigation' => 'nullable|string',
//         'personal_history' => 'nullable|string',
//         'food_and_drug_allergy' => 'nullable|string',
//         'lmp' => 'nullable|string',
//         'edd' => 'nullable|string',
//     ]);

//     // Create PatientExamination
//     $examinationData = $request->only([
//         'p_p_i_id',
//         'patient_id',
//         'bp',
//         'height',
//         'weight',
//         'pulse',
//         'past_history',
//         'complaints',
//         'systemic_exam_general',
//         'systemic_exam_pa',
//     ]);
//     $examination = PatientExamination::create($examinationData);

//     // Create AyurvedicDiagnosis
//     $ayurvedicData = $request->only([
//         'p_p_i_id',
//         'patient_id',
//         'occupation',
//         'pincode',
//         'email',
//         'ayurPastHistory',
//         'prasavvedan_parikshayein',
//         'habits',
//         'lab_investigation',
//         'personal_history',
//         'food_and_drug_allergy',
//         'lmp',
//         'edd',
//     ]);
//     $ayurvedicDiagnosis = AyurvedicDiagnosis::create($ayurvedicData);

//     return response()->json([
//         'examination' => $examination,
//         'ayurvedic_diagnosis' => $ayurvedicDiagnosis
//     ], 201);
// }
public function store(Request $request)
{
    // Validate the request data
    $validatedData = $request->validate([
        'p_p_i_id' => 'required|exists:bills,id',
        'patient_id' => 'nullable|exists:patients,id',
        'bp' => 'nullable|string',
        'height' => 'nullable|string',
        'weight' => 'nullable|string',
        'pulse' => 'nullable|string',
        'past_history' => 'nullable|string',
        'complaints' => 'nullable|string',
        'systemic_exam_general' => 'nullable|string',
        'systemic_exam_pa' => 'nullable|string',

        // AyurvedicDiagnosis fields
        'occupation' => 'nullable|string',
        'pincode' => 'nullable|string',
        'email' => 'nullable|string',
        'ayurPastHistory' => 'nullable|string',
        'prasavvedan_parikshayein' => 'nullable|string',
        'habits' => 'nullable|string',
        'lab_investigation' => 'nullable|string',
        'personal_history' => 'nullable|string',
        'food_and_drug_allergy' => 'nullable|string',
        'drug_allery' => 'nullable|string',
       
        'lmp' => 'nullable|string',
        'edd' => 'nullable|string',
    ]);

    $examination = null;
    $ayurvedicDiagnosis = null;

    // Extract PatientExamination fields
    $examinationData = $request->only([
        'p_p_i_id',
        'patient_id',
        'bp',
        'height',
        'weight',
        'pulse',
        'past_history',
        'complaints',
        'systemic_exam_general',
        'systemic_exam_pa',
    ]);

    // Check if at least one field (excluding p_p_i_id and patient_id) is filled
    $examinationContent = collect($examinationData)->except(['p_p_i_id', 'patient_id']);
    if ($examinationContent->filter()->isNotEmpty()) {
        $examination = PatientExamination::create($examinationData);
    }

    // Extract AyurvedicDiagnosis fields
    $ayurvedicData = $request->only([
        'p_p_i_id',
        'patient_id',
        'occupation',
        'pincode',
        'email',
        'ayurPastHistory',
        'prasavvedan_parikshayein',
        'habits',
        'lab_investigation',
        'personal_history',
        'food_and_drug_allergy',
        'drug_allery',
       
        'lmp',
        'edd',
    ]);

     if (isset($ayurvedicData['personal_history'])) {
        try {
            json_decode($ayurvedicData['personal_history']); // Validate JSON
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid personal_history format.'], 400);
        }
    }


    // Check if at least one field (excluding p_p_i_id and patient_id) is filled
    $ayurContent = collect($ayurvedicData)->except(['p_p_i_id', 'patient_id']);
    if ($ayurContent->filter()->isNotEmpty()) {
        $ayurvedicDiagnosis = AyurvedicDiagnosis::create($ayurvedicData);
    }

    return response()->json([
        'examination' => $examination,
        'ayurvedic_diagnosis' => $ayurvedicDiagnosis
    ], 201);
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
            'p_p_i_id' => 'required|exists:bills,id',
            'bp' => 'nullable|string',
            'pulse' => 'nullable|string',
            'height' => 'nullable|string',
            'weight' => 'nullable|string',
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

        // Fetch data from the 'ayurvedic_diagnoses' table
// $ayurvedicExamination = DB::table('ayurvedic_diagnoses')
//     ->where('p_p_i_id', $p_p_i_id)
//     ->get();    

        // Check if any data exists for the given p_p_i_id
        if ($patientExaminations->isEmpty() ) {
            return response()->json(['message' => 'PatientExaminations not found '], 404);
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
// public function getPatientExaminationsByBillId($p_p_i_id)
// {
//     try {
//         // Optional: Validate ID (You may skip this if always passing valid IDs)
//         if (empty($p_p_i_id) || !is_numeric($p_p_i_id)) {
//             return response()->json([
//                 'success' => false,
//                 'message' => 'Invalid p_p_i_id provided.'
//             ], 200); // 200 to keep it frontend-friendly
//         }

//         // Fetch from patient_examinations table
//         $patientExaminations = DB::table('patient_examinations')
//             ->where('p_p_i_id', $p_p_i_id)
//             ->get();

//         // If no data found
//         if ($patientExaminations->isEmpty()) {
//             return response()->json([
//                 'success' => false,
//                 'message' => 'Patient Examination data not found.'
//             ], 200);
//         }

//         // If data exists, return it
//         return response()->json([
//             'success' => true,
//             'data' => $patientExaminations
//         ], 200);

//     } catch (\Exception $e) {
//         \Log::error('Error fetching PatientExaminations: ' . $e->getMessage());

//         return response()->json([
//             'success' => false,
//             'message' => 'Something went wrong while fetching data.',
//             'error' => $e->getMessage()
//         ], 500);
//     }
// }




// public function getAyurvedictExaminationsByBillId($p_p_i_id) {
//     try {
//         // Validate the input ID (ensure it's not empty and is numeric)
//         if (empty($p_p_i_id) || !is_numeric($p_p_i_id)) {
//             return response()->json(['message' => 'Invalid p_p_i_id provided'], 400);
//         }

        
//         // Fetch data from the 'ayurvedic_diagnoses' table
// $ayurvedicExamination = DB::table('ayurvedic_diagnoses')
//     ->where('p_p_i_id', $p_p_i_id)
//     ->get();    

//         // Check if any data exists for the given p_p_i_id
//         if ($ayurvedicExamination->isEmpty() ) {
//             return response()->json(['message' => 'Ayurvedic Observation not found  '], 404);
//         }



         

//         // Return the fetched data as a JSON response
//         return response()->json($ayurvedicExamination, 200);

//     } catch (\Exception $e) {
//         // Log the error for debugging purposes
//         \Log::error('Error fetching Ayurvedic Observation: ' . $e->getMessage());

//         // Return a generic error response
//         return response()->json([
//             'error' => 'An error occurred while fetching Ayurvedic Observation.',
//             'message' => $e->getMessage(),
//         ], 500);
//     }
// }

public function getAyurvedictExaminationsByBillId($p_p_i_id)
{
    try {
        if (empty($p_p_i_id) || !is_numeric($p_p_i_id)) {
            return response()->json(['message' => 'Invalid p_p_i_id provided'], 400);
        }

        $results = DB::table('ayurvedic_diagnoses')
            ->where('p_p_i_id', $p_p_i_id)
            ->get();

        if ($results->isEmpty()) {
            return response()->json(['message' => 'Ayurvedic Observation not found'], 404);
        }

        // Clean up each result row
        $cleanedResults = $results->map(function ($item) {
            $item = (array) $item;

            // Handle JSON fields: personal_history and prasavvedan_parikshayein
            // foreach (['personal_history', 'prasavvedan_parikshayein', 'habits'] as $field) {
            //     if (!empty($item[$field])) {
            //         $decoded = json_decode($item[$field], true);

            //         if (json_last_error() === JSON_ERROR_NONE) {
            //             // Remove keys where value is null or empty string
            //             $filtered = array_filter($decoded, fn($v) => $v !== null && $v !== '');
            //             $item[$field] = !empty($filtered) ? $filtered : null;
            //         } else {
            //             // If invalid JSON, keep it null
            //             $item[$field] = null;
            //         }
            //     } else {
            //         $item[$field] = null;
            //     }
            // }
                foreach (['personal_history', 'prasavvedan_parikshayein', 'habits'] as $field) {
    if (!empty($item[$field])) {
        $decoded = json_decode($item[$field], true);

        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            $filtered = array_filter($decoded, fn($v) => $v !== null && $v !== '');
            $item[$field] = !empty($filtered) ? $filtered : null;
        } else {
            $item[$field] = null;
        }
    } else {
        $item[$field] = null;
    }
}



            // Convert back to object if you want consistent response structure
            return (object) $item;
        });

        return response()->json($cleanedResults, 200);

    } catch (\Exception $e) {
        \Log::error('Error fetching Ayurvedic Observation: ' . $e->getMessage());

        return response()->json([
            'error' => 'An error occurred while fetching Ayurvedic Observation.',
            'message' => $e->getMessage(),
        ], 500);
    }
}



}
