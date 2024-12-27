<?php

namespace App\Http\Controllers;

use App\Models\Description;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;


class DescriptionController extends Controller
{
    //
    // public function store(Request $request) {
    //     try {
    //         $validatedData = $request->validate([
    //             'bill_id' => 'required|string|exists:bills,id', // Check that bill_id exists in bills table
    //             'description' => 'required|string',
    //             'quantity' => 'required|string',
    //             'price' => 'required|string',
    //             'gst' => 'required|string',
    //             'total' => 'required|string'
    //         ]);

    //         $description = new Description(); // Assuming Description is your model
    //         $description->bill_id = $validated['bill_id'];
    //         $description->description = $validated['description'];
    //         $description->quantity = $validated['quantity'];
    //         $description->price = $validated['price'];
    //         $description->gst = $validated['gst'];
    //         $description->total = $validated['total'];
    //         $description->save();
    
    //         foreach ($validatedData as $descriptionData) {
    //             Description::create($descriptionData);
    //         }
    //         return response()->json([
    //             'id' => $description->id, // Return the created description's ID
    //         ], 201);


           
    
    //         return response()->json(['message' => 'Descriptions added successfully'], 201);
    
    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         // Handle validation exception
    //         return response()->json(['errors' => $e->validator->errors()], 422);
    //     } catch (\Exception $e) {
    //         // Handle any other exceptions
    //         return response()->json(['error' => 'An error occurred while adding descriptions: ' . $e->getMessage()], 500);
    //     }
    // }    



    public function store(Request $request)
    {
        try {
            // Validate incoming data
            $validatedData = $request->validate([
                'descriptions' => 'required|array',
                'descriptions.*.bill_id' => 'required|string|exists:bills,id',
                'descriptions.*.description' => 'required|string',
                'descriptions.*.quantity' => 'required|integer|min:1',
                'descriptions.*.price' => 'required|numeric|min:0',
                'descriptions.*.gst' => 'required|numeric|min:0',
                'descriptions.*.total' => 'required|numeric|min:0',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Log the validation errors for debugging
            \Log::error('Validation failed:', $e->validator->errors()->toArray());
            return response()->json(['error' => 'Validation failed', 'messages' => $e->validator->errors()], 422);
        }
    
        // Loop through each description and create it
        $descriptions = [];
        foreach ($validatedData['descriptions'] as $desc) {
            $descriptions[] = Description::create($desc);
        }
    
        // Return response with created descriptions
        return response()->json(['success' => true, 'descriptions' => $descriptions], 201);
    }



    // public function getDescriptionsByBillId($bill_id) {
    //     $descriptions = Description::where('bill_id', (string)$bill_id)->get();
    //     if ($descriptions->isEmpty()) {
    //         return response()->json(['message' => 'Descriptions not found'], 404);
    //     }
    //     return response()->json($descriptions, 200);

    //     // $descriptions = Description::where('bill_id', $bill_id)->get();
    //     // return response()->json($descriptions, 200);
    // }

    public function getDescriptionsByBillId($bill_id) {
        // Using a raw SQL query to fetch descriptions
        $descriptions = DB::select('SELECT * FROM descriptions WHERE bill_id = ?', [(string)$bill_id]);
    
        if (empty($descriptions)) {
            return response()->json(['message' => 'Descriptions not found'], 404);
        }
        
        return response()->json($descriptions, 200);
    }
    
    

    

}
