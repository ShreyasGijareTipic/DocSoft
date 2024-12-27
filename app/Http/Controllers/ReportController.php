<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;


       

class ReportController extends Controller
{

    public function store(Request $request)
    {
        // Validate request data except for 'created_by' and 'assigned_by'
        $validatedData = $request->validate([
            'customer_id' => 'required|integer',
            'customer_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'mobile' => 'required|digits_between:10,15',

            // Equipment Details
            'equipment_id' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'equipment_name' => 'required|string|max:255',
            'serial_no' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'brand_name' => 'nullable|string|max:255',

            // Extra Fields for Analysis and Service Person
            'call_type' => 'required|integer', // 1=installation, 2=service, etc.
            'closed' => 'boolean',
            'updated_by' => 'nullable|integer',
            'assigned_to' => 'required|integer', // 1=installation, 2=service, etc.

        ]);

        // Automatically assign 'created_by' as the current authenticated user's ID
        $validatedData['created_by'] = Auth::user()->id;
        $validatedData['assigned_by'] = Auth::user()->type; // Admin assigns themselves
       
   

        // Store the data
        $report = Report::create($validatedData);

        // Return a response
        return response()->json([
            'message' => 'Report created successfully',
            'report' => $report
        ], 201);
    
    }

public function updateReport2(Request $request, $id)
{
    // Validate the incoming request
    $request->validate([
        'file' => 'sometimes|file|mimes:jpg,jpeg,png,bmp' // Optional file field
    ]);

    // Retrieve the report by ID
    $report = Report::find($id);
    
    // Check if the report exists
    if (!$report) {
        return response()->json(['message' => 'Service Report not found'], 404);
    }

    // Update fields if they exist in the request
    $fields = [
        'customer_id', 'customer_name', 'address', 'contact_person', 'email',
        'mobile', 'signature_by', 'equipment_id', 'location', 'equipment_name',
        'serial_no', 'model', 'brand_name', 'call_type', 'nature_complaint',
        'actual_fault', 'action_taken', 'customer_suggestion', 'status', 
        'updated_by'
    ];

    foreach ($fields as $field) {
        if ($request->has($field)) {
            $report->$field = $request->input($field);
        }
    }

    // Update signature field if a file is provided
    if ($request->hasFile('file')) {
        $file = $request->file('file');
        
        // Check if the uploaded file is valid
        if ($file->isValid()) {
            // Read the file contents and encode to base64
            $fileContents = file_get_contents($file->getRealPath());
            $report->signature = base64_encode($fileContents);
        } else {
            return response()->json(['message' => 'Invalid file'], 400);
        }
    }

    // Save the changes to the report
    $report->save();

    // Return the updated report and a success message
    return response()->json([
        'message' => 'Report updated successfully',
        'report' => $report // Optionally return the updated report
    ]);
}



public function updateSignature(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,bmp', // Allow image formats
            'id' => 'required|exists:reports,id' // Ensure the report exists
        ]);
    
        // Retrieve the report by ID
        $report = Report::findOrFail($request->input('id'));
    
        // Retrieve and convert the uploaded file to base64 format
        $file = $request->file('file');
        $fileContents = file_get_contents($file->getRealPath());
        $base64Signature = base64_encode($fileContents);
    
        // Update the signature field
        $report->signature = $base64Signature;
    
        // Save the changes to the report
        $report->save();
    
        return response()->json(['message' => 'Signature updated successfully']);
    }
    


public function showSignature($id)
     {
         $report = Report::findOrFail($id);
     
         if ($report->signature) {
             $path = $report->signature;
             
             if (Storage::disk('public')->exists($path)) {
                 return response()->file(storage_path("app/public/{$path}"));
             }
         }
     
         return response()->json(['message' => 'Signature not found'], 404);
     }
     
     public function getReportById($id)
     {
         try {
             // Fetch the report by ID using findOrFail
             $report = Report::findOrFail($id);
     
             // Return the found report as a JSON response
             return response()->json( $report, 200);
         } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
             // Return a 404 response if the report is not found
             return response()->json(['error' => 'Report not found.'], 404);
         } catch (\Exception $e) {
             // Log any other errors for debugging
             \Log::error('Failed to fetch report: ' . $e->getMessage());
     
             // Return a 500 Internal Server Error response
             return response()->json(['error' => 'Failed to fetch report. Please try again later.'], 500);
         }
     }
     
public function getDateById($id)
{
    try {
        // Fetch the report by ID using findOrFail
        $report = Report::findOrFail($id);
        // $report->created_at = $report->created_at;
        // Return the found report
        return response()->json(['created_at' => $report->created_at->format('Y-m-d H:i:s')], 200);   //created_at
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        // Return a 404 response if the report is not found
        return response()->json(['error' => 'Report not found.'],201);
    } catch (\Exception $e) {
        // Log any other errors for debugging
        \Log::error('Failed to fetch report: ' . $e->getMessage());

        // Return a 500 Internal Server Error response
        return response()->json(['error' => 'Failed to fetch report. Please try again later.'], 500);
    }
}
public function searchById($id)
{
    try {
        // Find the report by its ID
        $report = Report::find($id);

        // Check if the report exists
        if (!$report) {
            return response()->json(['message' => 'Report not found'], 404);
        }

        // Return the report data in JSON format
        return response()->json([
            'message' => 'Report retrieved successfully',
            'data' => $report
        ], 200);

    } catch (\Throwable $th) {
        // Log the error for debugging
        \Log::error('Failed to retrieve report: ' . $th->getMessage());

        // Return error response
        return response()->json([
            'message' => 'Internal Server Error',
            'error' => $th->getMessage(),
        ], 500);
    }
}

public function searchByStatus(Request $request)
{
    
    try {
        // Fetch the status from request (dropdown values: Working Fully, Working Moderately, Not Working)
        $status = $request->input('status');

        // Validate the status input to match the fixed dropdown values
        $validStatuses = ['Working Fully', 'Working Moderately', 'Not Working'];
        if (!in_array($status, $validStatuses)) {
            return response()->json(['error' => 'Invalid status value.'], 400);
        }

        // Fetch reports based on the given status
        $reports = Report::where('status', $status)->get();

        // If no reports are found, return an appropriate response
        if ($reports->isEmpty()) {
            return response()->json(['message' => 'No reports found for the given status.'], 200);
        }

        // Return the found reports
        return response()->json($reports, 200);
    } catch (\Exception $e) {
        // Log any other errors for debugging
        \Log::error('Failed to fetch reports by status: ' . $e->getMessage());

        // Return a 500 Internal Server Error response
        return response()->json(['error' => 'Failed to fetch reports. Please try again later.'], 500);
    }
}

public function searchByUserIdNotWorking(Request $request)
{
    //Validate the incoming request data
    $validator = Validator::make($request->all(), [
        'created_by' => 'string',
        'status' => 'string',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    try {
        // Fetch reports based on created_by and status
        $reports = Report::where('created_by', $request->input('created_by'))
                          ->where('status', $request->input('Not Working'))
                          ->get();

        // Check if reports are found
        if ($reports->isEmpty()) {
            return response()->json(['error' => 'No reports found with the specified criteria.'], 200);
        }

        // Return the found reports
        return response()->json($reports, 200);
    } catch (\Exception $e) {
        // Log the error for debugging
        \Log::error('Failed to search reports: ' . $e->getMessage());

        // Return a 500 Internal Server Error response
        return response()->json(['error' => 'Failed to search reports. Please try again later.'], 500);
    }
}

// public function searchByUserIdWorkingFully(Request $request, $status)
// {  
//     $string = "";
//     if ($status == 0) {
//         $string = "Working Fully"; 
//     } 
//     if ($status == 1) {
//         $string = "Not Working";
//     }

//     try {          
//         $user = Auth::user();
//         // Get the authenticated user's ID and type
//         $userId = $user->id;
//         $userType = $user->type;
        
//         // Build the query with the common status condition
//         $query = Report::where('status', $string);
        
//         // Conditionally add the `created_by` condition based on user type
//         if ($userType == 1) {
//             $query->where('created_by', $userId);
//         }

//         // Select only the specified columns
//         $reports = $query->select('id', 'customer_name', 'address', 'contact_person', 'email', 'mobile', 'date', 'call_type', 'status')->get();
        
//         // Check if reports are found
//         if ($reports->isEmpty()) {
//             return response()->json(['error' => 'No reports found with the specified criteria.'], 200);
//         }

//         // Return the filtered reports
//         return response()->json($reports, 200);

//     } catch (\Exception $e) {
//         // Log the error for debugging
//         \Log::error('Failed to search reports: ' . $e->getMessage());
//         // Return a 500 Internal Server Error response
//         return response()->json(['error' => 'Failed to search reports. Please try again later.'], 500);
//     }
// }

public function searchByUserIdWorkingFully(Request $request, $status)
{  
    // $string = "";
    // if ($status == 0) {
    //     $string = "Working Fully"; 
    // } 
    // if ($status == 1) {
    //     $string = "Not Working";
    // }

    try {          
        $user = Auth::user();
        // Get the authenticated user's ID and type
        $userId = $user->id;
        $userType = $user->type;
        
        // Build the query with the common status condition
        $query = Report::where('closed', $status);
        
        // Conditionally add the `created_by` condition based on user type
        if ($userType == 1) {
            $query->where('assigned_to', $userId);
        }

        // Select only the specified columns
        $reports = $query->select('id', 'customer_name','remark','address','contact_person', 'email',  'mobile', 'created_at', 'call_type', 'closed')
        ->orderBy('created_at', 'desc')
        ->get();
        
        // Check if reports are found
        if ($reports->isEmpty()) {
            return response()->json(['error' => 'No reports found with the specified criteria.'], 200);
        }

        // Return the filtered reports
        return response()->json($reports, 200);

    } catch (\Exception $e) {
        // Log the error for debugging
        \Log::error('Failed to search reports: ' . $e->getMessage());
        // Return a 500 Internal Server Error response
        return response()->json(['error' => 'Failed to search reports. Please try again later.'], 500);
    }
}


}
