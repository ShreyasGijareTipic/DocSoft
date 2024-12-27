<?php

namespace App\Http\Controllers;
use App\Models\SpareParts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SparePartController extends Controller
{


public function sparePartsUpload(Request $request)
{
    // Validate the incoming request
    $validatedData = $request->validate([
        '*.description' => 'required|string|max:255',
        '*.qty' => 'required|integer|min:1',
        '*.remark' => 'nullable|string|max:255',
        '*.report_details_id' => 'required|integer',  // Ensure report_id exists in the reports table

    ]);

    
 try{
    // $userId = Auth::user()->id;
    // Loop through each spare part and save it
    foreach ($validatedData as $fields) {
        SpareParts::create([
            'description' => $fields['description'],
            'qty' => $fields['qty'],
            'remark' => $fields['remark'] ?? null,  // Default to null if not provided
            'report_details_id' => $fields['report_details_id'],
        ]);
   
 }
 return response()->json(['message' => 'Spare parts uploaded successfully'], 201);
}
 catch (\Throwable $th) {
    // Log error
    \Log::error($th->getMessage());

    // Return error response
    return response()->json([
        'message' => 'Internal Server Error',
        'error' => $th->getMessage(),
    ], 500);
}
 
}

public function searchSparePartByReportId($report_id)
{
    try {
        // Validate that the report_id is provided
        if (!$report_id) {
            return response()->json(['message' => 'Report ID is required'], 400);
        }

        // Find spare parts by the given report_id
        $spareParts = SpareParts::where('report_id', $report_id)->get();

        // Check if any spare parts were found
        if ($spareParts->isEmpty()) {
            return response()->json([], 200); // Return an empty array instead of a message
        }

        // Return the spare parts data in JSON format
        return response()->json($spareParts, 200);

    } catch (\Throwable $th) {
        // Log error
        \Log::error($th->getMessage());

        // Return error response
        return response()->json([
            'message' => 'Internal Server Error',
            'error' => $th->getMessage(),
        ], 500);
    }
}


function getSpareParts()
{
  $parts = SpareParts::all();
//   $parts = SpareParts::where('remark',1)->get();
return response()->json($parts, 200);
}

function updateSparePartsByReport(Request $request, $id)
{
                                                            // Find the customer by ID
    $parts = SpareParts::find($id);
                                                            // Check if customer exists
       if (!$parts) {
           return response()->json([
               'message' => 'Spare Part is not found'
           ], 404);
       }
                                                            // Validate request(sometimes)
       $fields = $request->validate([
           'description' => 'sometimes|string',
           'qty' => 'sometimes|string',
           'remark' => 'sometimes|string',
           'report_id' =>'someties|string',
           'user_id' =>'sometimes|string',
          
       ]);
       $report_id = "1235";
       $user_id = "2";
                                                            // Update customer fields if present in the request
       $parts->description = $fields['description'] ?? $parts->description;
       $parts->qty = $fields['qty'] ?? $parts->qty;
       $parts->remark = $fields['remark'] ?? $parts->remark;

       $parts->report_id = $report_id  ?? $parts->report_id;
       $parts->user_id = $user_id ?? $parts->user_id;
                                                            
       $parts->save();
                                                            
       return response()->json([
           'message' => 'Spare parts updated successfully',
           'data' => $parts
       ], 200); 
   
}
public function updateSparePart(Request $request, $id)
{
    // Validate the incoming request
    $validatedData = $request->validate([
        'description' => 'required|string|max:255',
        'qty' => 'required|string|min:1',
        'remark' => 'nullable|string|max:255',
        'report_id' => 'required|string',  
    ]);

    try {
        // Find the spare part by its ID
        $sparePart = SpareParts::find($id);

        // Check if the spare part exists
        if (!$sparePart) {
            return response()->json(['message' => 'Spare part not found'], 404);
        }

        // Update the spare part with the validated data
        $sparePart->update([
            'description' => $validatedData['description'],
            'qty' => $validatedData['qty'],
            'remark' => $validatedData['remark'] ?? $sparePart->remark,  // Retain existing remark if not provided
            'report_id' => $validatedData['report_id'],
        ]);

        // Return success response
        return response()->json([
            'message' => 'Spare part updated successfully',
            'data' => $sparePart
        ], 200);

    } catch (\Throwable $th) {
        // Log the error
        \Log::error($th->getMessage());

        // Return error response
        return response()->json([
            'message' => 'Internal Server Error',
            'error' => $th->getMessage(),
        ], 500);
    }
}


}