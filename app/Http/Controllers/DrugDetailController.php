<?php

namespace App\Http\Controllers;

use App\Models\DrugDetail;
use App\Models\Drug;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class DrugDetailController extends Controller
{
    // Display a listing of drug details
    public function index()
{
    $doctorId = Auth::id(); // Get the authenticated doctor's ID
    $drugs = Drug::where('doctor_id', $doctorId)->pluck('id'); // Get IDs of drugs that belong to this doctor
    $drugDetails = DrugDetail::whereIn('drug_id', $drugs)->get(); // Fetch drug details only for the drugs belonging to this doctor
    
    return response()->json($drugDetails);
}


    // Show the details of a specific drug detail
    public function show($id)
    {
        $drugDetail = DrugDetail::find($id); // Find a drug detail by its ID
        
        if (!$drugDetail) {
            return response()->json(['message' => 'Drug detail not found'], 404);
        }

        return response()->json($drugDetail);  // Return drug detail in JSON format
    }



    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'drug_id' => 'required|exists:drugs,id',
    //         'dosage_form' => 'required|string',
    //         'strength' => 'required|string',
    //         'price' => 'required|numeric',
    //         'stock_quantity' => 'required|integer',
    //         'expiration_date' => 'required|date',
    //         'side_effects' => 'nullable|string',
    //         'usage_instructions' => 'nullable|string',
    //         'storage_conditions' => 'nullable|string',
    //     ]);
    
    //     $drugDetail = DrugDetail::create($validated);
    
    //     return response()->json($drugDetail, 201);
    // }








    // public function store(Request $request)
    // {
    //     try {
    //         $validated = $request->validate([
    //             'drug_id' => 'required|exists:drugs,id',
    //             'dosage_form' => 'required|string',
    //             'strength' => 'required|string',
    //             'price' => 'required|numeric',
    //             'stock_quantity' => 'required|integer',
    //             'expiration_date' => 'required|date',
    //             'side_effects' => 'nullable|string',
    //             'usage_instructions' => 'nullable|string',
    //             'storage_conditions' => 'nullable|string',
    //         ]);
        
    //         $drugDetail = DrugDetail::create($validated);
        
    //         return response()->json($drugDetail, 201);
    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         return response()->json([
    //             'error' => 'Validation error',
    //             'message' => $e->errors()  // This will show the specific validation errors
    //         ], 422);
    //     }
    // }
    
    // ------------------------------------------------------------------------ 


    public function store(Request $request)
    {
        try {
            // Validate incoming data
            $validatedData = $request->validate([
                'drugs_details' => 'required|array',
                'drugs_details.*.drug_id' => 'required|exists:drugs,id', // Ensure that the drug_id exists in the drugs table
                'drugs_details.*.dosage_form' => 'required|string',
                'drugs_details.*.strength' => 'required|string',
                'drugs_details.*.price' => 'required|numeric', // Ensure price is numeric
                'drugs_details.*.stock_quantity' => 'required|integer', // Ensure stock_quantity is an integer
                'drugs_details.*.expiration_date' => 'required|date', // Ensure expiration_date is a valid date
                'drugs_details.*.side_effects' => 'required|string',
                'drugs_details.*.usage_instructions' => 'required|string',
                'drugs_details.*.storage_conditions' => 'required|string',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Log the validation errors for debugging
            \Log::error('Validation failed:', $e->validator->errors()->toArray());
            return response()->json(['error' => 'Validation failed', 'messages' => $e->validator->errors()], 422);
        }
    
        // Loop through each description and create it
        $drugDetails = [];
        foreach ($validatedData['drugs_details'] as $desc) {
            // Create the drug detail record
            $drugDetails[] = DrugDetail::create([
                'drug_id' => $desc['drug_id'],
                'dosage_form' => $desc['dosage_form'],
                'strength' => $desc['strength'],
                'price' => $desc['price'],
                'stock_quantity' => $desc['stock_quantity'],
                'expiration_date' => $desc['expiration_date'],
                'side_effects' => $desc['side_effects'],
                'usage_instructions' => $desc['usage_instructions'],
                'storage_conditions' => $desc['storage_conditions'],
            ]);
        }
    
        // Return response with created descriptions
        return response()->json(['success' => true, 'drugs_details' => $drugDetails], 201);
    }


    
    // ------------------------------------------------------------------------ 






    // Update an existing drug detail
    public function update(Request $request, $id)
    {
        $drugDetail = DrugDetail::find($id);

        if (!$drugDetail) {
            return response()->json(['message' => 'Drug detail not found'], 404);
        }

        // Validate the incoming request data
        $request->validate([
            'drug_id' => 'required|exists:drugs,id',
            'dosage_form' => 'required|string|max:255',
            'strength' => 'required|string|max:255',
            'price' => 'required|numeric',
            'stock_quantity' => 'required|integer',
            'expiration_date' => 'required|date',
            'side_effects' => 'nullable|string',
            'usage_instructions' => 'nullable|string',
            'storage_conditions' => 'nullable|string',
        ]);

        // Update the drug detail's data
        $drugDetail->update($request->all());

        return response()->json($drugDetail);
    }

    // Delete a specific drug detail
    public function destroy($id)
    {
        $drugDetail = DrugDetail::find($id);

        if (!$drugDetail) {
            return response()->json(['message' => 'Drug detail not found'], 404);
        }

        // Delete the drug detail from the database
        $drugDetail->delete();

        return response()->json(['message' => 'Drug detail deleted successfully']);
    }



    public function showdetails($id)
    {
        $doctorId = Auth::id(); // Get the authenticated doctor's ID
        // Check if the drug belongs to the authenticated doctor
        $drug = Drug::where('doctor_id', $doctorId)->where('id', $id)->first();
    
        if (!$drug) {
            return response()->json(['message' => 'You are not authorized to view this drug detail'], 403);
        }
    
        // Fetch drug details only for the authenticated doctor's drug
        $drugDetails = DrugDetail::where('drug_id', $id)->get();
    
        if ($drugDetails->isEmpty()) {
            return response()->json(['message' => 'No drug details found for the given drug'], 404);
        }
    
        return response()->json($drugDetails);
    }
    





    public function getDrugDetailsByDrugId($drug_id) {
        // Using a raw SQL query to fetch descriptions
        $drugDetail = DB::select('SELECT * FROM drugs_details WHERE drug_id = ?', [(string)$drug_id]);
    
        if (empty($drugDetail)) {
            return response()->json(['message' => 'Drug Details not found'], 404);
        }
        
        return response()->json($drugDetail, 200);
    }







}
