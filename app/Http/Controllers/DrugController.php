<?php

namespace App\Http\Controllers;

use App\Models\Drug;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DrugController extends Controller
{
        /**
     * Display a listing of the drugs.
     */
    public function index()
    {
        $doctorId = Auth::id(); // Get the authenticated doctor's ID
        $drugs = Drug::where('doctor_id', $doctorId)->get(); // Fetch drugs only for this doctor
        return response()->json($drugs);
    }
    


// ------------------------------------------------------------------------------ 

public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'doctor_id' => 'string',

           'drug_name' => 'required|string|max:255',
            'generic_name' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'manufacturer' => 'nullable|string|max:255',
        ]);

        $doctorId = Auth::id();

        // Create a new Bill record
        $drug = Drug::create([
            'doctor_id' => $doctorId, 

            
           'drug_name' => $request->drug_name,
            'generic_name' => $request->generic_name,
            'category' => $request->category,
            'manufacturer' => $request->manufacturer,
        ]);

        return response()->json([
            'id' => (string)$drug->id,
            // Include any other necessary fields
        ], 201);


        foreach ($request->drugDetails as $drugDetailsData) {
            $drugDetailsData['drug_id'] = (string)$drug->id; // Store bill ID as a string
            Description::create($drugDetailsData);
        }

    }
// --------------------------------------------------------------------------------------------- 







    /**
     * Store a newly created drug in storage.
     */
    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'doctor_id' => 'required|exists:users,id',
    //         'drug_name' => 'required|string|max:255',
    //         'generic_name' => 'required|string|max:255',
    //         'category' => 'required|string|max:255',
    //         'manufacturer' => 'required|string|max:255',
    //     ]);

    //     $drug = Drug::create($validated);
    //     return response()->json($drug, 201);
    // }














    /**
     * Display the specified drug.
     */
    public function show($id)
    {
        $drug = Drug::find($id);

        if (!$drug) {
            return response()->json(['message' => 'Drug not found'], 404);
        }

        return response()->json($drug);
    }

    /**
     * Update the specified drug in storage.
     */
    public function update(Request $request, $id)
    {
        $drug = Drug::find($id);

        if (!$drug) {
            return response()->json(['message' => 'Drug not found'], 404);
        }

        $validated = $request->validate([
            // 'doctor_id' => 'required|exists:users,id',
            'drug_name' => 'required|string|max:255',
            // 'generic_name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'manufacturer' => 'required|string|max:255',
        ]);

        $drug->update($validated);
        return response()->json($drug);
    }

    /**
     * Remove the specified drug from storage.
     */
    public function destroy($id)
    {
        $drug = Drug::find($id);

        if (!$drug) {
            return response()->json(['message' => 'Drug not found'], 404);
        }

        $drug->delete();
        return response()->json(['message' => 'Drug deleted successfully']);
    }







    public function getDrugsByDoctorId()
{
    $doctorId = Auth::id(); // Get the authenticated doctor's ID
    $drugs = Drug::where('doctor_id', $doctorId)->orderBy('created_at', 'desc')->get(); // Fetch drugs for this doctor
    
    if ($drugs->isEmpty()) {
        return response()->json(['error' => 'No drugs found for this doctor.'], 404);
    }

    return response()->json($drugs); // Return drugs as JSON
}


// public function getMedicinesByDoctor(Request $request)
// {
//     try {
//         // Get the logged-in doctor's ID
//         $doctorId = Auth::id();

//         if (!$doctorId) {
//             return response()->json(['error' => 'Unauthorized'], 401);
//         }

//         // Fetch medicines associated with the doctor
//         $medicines = Drug::where('doctor_id', $doctorId)
//                          ->with('details') // Assuming a relation exists to fetch drug details
//                          ->get();

//         return response()->json(['medicines' => $medicines], 200);
//     } catch (\Exception $e) {
//         return response()->json(['error' => 'Failed to fetch medicines'], 500);
//     }
// }


public function getMedicinesByDoctor($doctorId)
{
    $medicines = Drug::where('doctor_id', $doctorId)->get();
    return response()->json($medicines);
}




} 
