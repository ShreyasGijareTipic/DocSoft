<?php

namespace App\Http\Controllers;

use App\Models\HealthDirective;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class HealthDirectiveController extends Controller
{
    /**
     * Display a listing of health directives.
     */
    public function index()
    {
        $healthDirectives = HealthDirective::all();
        return response()->json($healthDirectives);
    }

    /**
     * Store a new health directive.
     */
//     public function store(Request $request)
// {
//     \Log::info('Request Data:', $request->all()); // Log the incoming data

//     // Validate the incoming request data
//     $validatedData = $request->validate([
//         'p_p_i_id' => 'exists:bills,id',
//         'patient_id' => 'nullable|exists:patients,id', // <- NEW
//         'medicine' => 'nullable|string',
//         'strength' => 'nullable|string',
//         'dosage' => 'nullable|string',
//         'timing' => 'nullable|string',
//         'frequency' => 'nullable|string',
//         'duration' => 'nullable|string',
//     ]);

//     \Log::info('Validated Data:', $validatedData); // Log validated data

//     // Create the health directive
//     $healthDirective = HealthDirective::create($validatedData);
    
//     // Log the health directive created
//     \Log::info('Created Health Directive:', $healthDirective->toArray());

//     return response()->json($healthDirective, 201);
// }
public function store(Request $request)
{
    \Log::info('Request Data:', $request->all());

    // Expecting an array of prescriptions
    $prescriptions = $request->input('prescriptions');

    if (!is_array($prescriptions)) {
        return response()->json(['message' => 'Prescriptions must be an array'], 400);
    }

    $created = [];

    foreach ($prescriptions as $index => $prescription) {
        $validated = \Validator::make($prescription, [
            'p_p_i_id' => 'required|exists:bills,id',
            'patient_id' => 'nullable|exists:patients,id',
            'medicine' => 'nullable|string',
            'strength' => 'nullable|string',
            'dosage' => 'nullable|string',
            'timing' => 'nullable|string',
            'frequency' => 'nullable|string',
            'duration' => 'nullable|string',
        ]);

        if ($validated->fails()) {
            return response()->json([
                'message' => 'Validation failed on prescription at index ' . $index,
                'errors' => $validated->errors(),
            ], 422);
        }

        $data = $validated->validated();
        $created[] = HealthDirective::create($data);
    }

    return response()->json(['message' => 'Health directives created successfully', 'data' => $created], 201);
}



    /**
     * Display the specified health directive.
     */
    public function show($id)
    {
        $healthDirective = HealthDirective::findOrFail($id);
        return response()->json($healthDirective);
    }

    /**
     * Update the specified health directive.
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
          
            'medicine' => 'nullable|string',
            'strength' => 'required|string',
            'dosage' => 'nullable|string',
            'timing' => 'nullable|string',
            'frequency' => 'nullable|string',
            'duration' => 'nullable|string',
        ]);

        $healthDirective = HealthDirective::findOrFail($id);
        $healthDirective->update($validatedData);
        return response()->json($healthDirective);
    }

    /**
     * Remove the specified health directive.
     */
    public function destroy($id)
    {
        $healthDirective = HealthDirective::findOrFail($id);
        $healthDirective->delete();
        return response()->json(['message' => 'Health directive deleted successfully']);
    }

    public function getByBillId($id)
{
    try {
        // Perform the query to join health_directives and drugs tables
        $healthDirectives = DB::table('health_directives')
            ->join('drugs', 'health_directives.medicine', '=', 'drugs.id')
            ->where('health_directives.p_p_i_id', $id)  // Filter by the ID
            ->select('health_directives.*', 'drugs.drug_name')
            ->get();

        // Return the result as a JSON response
        return response()->json($healthDirectives);

    } catch (\Exception $e) {
        // Log the error message
        \Log::error('Error fetching health directives: ' . $e->getMessage());

        // Return a response with the error message
        return response()->json(['error' => 'Failed to fetch health directives', 'message' => $e->getMessage()], 500);
    }
}




public function getPrescriptionsByBillId($p_p_i_id) {
    try {
        
        $healthDirectives = DB::table('health_directives')
            ->where('p_p_i_id', $p_p_i_id)
            ->get();

        
        // if ($healthDirectives->isEmpty()) {
        //     return response()->json(['message' => 'Prescription not found'], 400);
        // }

      
        return response()->json($healthDirectives, 200);
    } catch (\Exception $e) {
        
        return response()->json([
            'error' => 'An error occurred while fetching prescriptions.',
            'message' => $e->getMessage(),
        ], 500);
    }
}
// public function getPrescriptionsByBillId($p_p_i_id) {
//     try {
//         $healthDirectives = DB::table('health_directives')
//             ->where('p_p_i_id', $p_p_i_id)
//             ->get();

//         if ($healthDirectives->isEmpty()) {
//             return response()->json([
//                 'success' => false,
//                 'message' => 'Prescription not found.'
//             ], 200); // Changed from 404 to 200
//         }

//         return response()->json([
//             'success' => true,
//             'data' => $healthDirectives
//         ], 200);

//     } catch (\Exception $e) {
//         return response()->json([
//             'success' => false,
//             'error' => 'An error occurred while fetching prescriptions.',
//             'message' => $e->getMessage(),
//         ], 500);
//     }
// }

}
