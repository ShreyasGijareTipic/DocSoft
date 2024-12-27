<?php

namespace App\Http\Controllers;
use App\Models\ServiceReport;
use Illuminate\Http\Request;

class ServiceReportController extends Controller
{
    function createReport(Request $request)
 {
    try {
        // Validate request
        $fields = $request->validate([
            'serial_no' => 'required|string',
             'call_type' => 'required|string',
             'nature_complaint'=> 'required|string',
             'actual_fault'=> 'required|string',
             'action_taken'=> 'required|string',
             'customer_suggestion'=> 'required|string',
             'status'=> 'required|string',
                                                   //  'user_id'=> 'required|string',
                                                  //  'customer_id'=> 'required|string',
             'customer_name'=> 'required|string',
             'address'=> 'required|string',
             'email'=> 'required|string',
             'contact_person'=> 'required|string',
             'mobile'=> 'required|string',
                                                  //  'updated_by'=> 'nullable|string',
            'equipment_name' => 'required|string',
            'model' => 'required|string',
            'company_name' => 'required|string',
            'type' => 'required|string',
            'subtype' => 'nullable|string',
                                                   //   'equipment_id'=>'required|string',        
        ]);
        $user_id ="1";
        $customer_id ="4";
        $equipment_id ="2";
        // Create Service Report
        $report =ServiceReport::create([
             'serial_no' => $fields['serial_no'],
            'call_type'=> $fields['call_type'],
            'nature_complaint'=> $fields['nature_complaint'],
            'actual_fault'=> $fields['actual_fault'],
            'action_taken'=> $fields['action_taken'],
            'customer_suggestion'=> $fields['customer_suggestion'],
            'status'=> $fields['status'],
            'customer_name'=> $fields['customer_name'],
            'address'=> $fields['address'],
            'email'=> $fields['email'],
            'contact_person'=> $fields['contact_person'],
            'mobile'=> $fields['mobile'],
            'equipment_name' => $fields['equipment_name'],
            'model' => $fields['model'],
            'company_name' => $fields['company_name'],
            'type' => $fields['type'],
            'subtype' => $fields['subtype'],
            'user_id'=> $user_id,
            'customer_id'=>$customer_id,
            'equipment_id'=> $equipment_id


        
        ]);

        // Return success response
        return response()->json([
            'message' => "submit Report Successfully",
            'report_id' => $report->id,
            'report' => $report,
        ], 201);
        
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

function getReport(){
        $report =ServiceReport::all();
        return response()->json($report, 200);
    }


function getReportBySerialNo(Request $request) {
        // Validate the search input
        $fields = $request->validate([
            'search' => 'required|string',
        ]);
    
        // Use the validated 'search' field to find customers by customer_name
        // $customers = Customer::where('customer_name', 'LIKE', '%' . $fields['search'] . '%')->get();
        $report = ServiceReport :: where('serial_no','LIKE','%'. $fields['search'] . '%')-> get();
    
        // Check if any customers were found
        if ($report->isEmpty()) {
            return response()->json(['message' => 'No report found'], 404);
        }
    
        // Return the matching customers
        return response()->json($report);
    }
    
    

    
function updateReportById(Request $request, $id)
    {
        try {
            // Find the service report by ID
            $report = ServiceReport::find($id);
            
            // Check if service report exists
            if (!$report) {
                return response()->json([
                    'message' => 'Service Report not found'
                ], 404);
            }
    
            // Validate request (sometimes)
            $fields = $request->validate([

                'customer_id' => 'sometimes|string',
                'user_id' => 'sometimes|string',
                'serial_no' => 'sometimes|string',
                'call_type' => 'sometimes|string',
                
                'nature_complaint' => 'sometimes|string',
                'actual_fault' => 'sometimes|string',
                'action_taken' => 'sometimes|string',
                'customer_suggestion' => 'sometimes|string',
                'status' => 'sometimes|string',
                'customer_name' => 'sometimes|string',
                'address' => 'sometimes|string',
                'email' => 'sometimes|string',
                'contact_person' => 'sometimes|string',
                'mobile' => 'sometimes|string',
                'updated_by' => 'sometimes|string',
                'model' => 'sometimes|string',
                
                'company_name' => 'sometimes|string',
                'type' => 'sometimes|string',
                'subtype' => 'sometimes|string',
                'equipment_id' => 'sometimes|string',
            ]);
    
            // Predefined values (these can be dynamic or passed from request)
            $user_id = 2;
            $equipment_id = 34;
            $customer_id = 1;
            // Update service report fields if present in the reques
            $report->serial_no = $fields['serial_no'] ?? $report->serial_no;
            $report->call_type = $fields['call_type'] ?? $report->call_type;
            $report->nature_complaint = $fields['nature_complaint'] ?? $report->nature_complaint;
            $report->actual_fault = $fields['actual_fault'] ?? $report->actual_fault;
            $report->action_taken = $fields['action_taken'] ?? $report->action_taken;
            $report->customer_suggestion = $fields['customer_suggestion'] ?? $report->customer_suggestion;
            $report->status = $fields['status'] ?? $report->status;
            $report->customer_name = $fields['customer_name'] ?? $report->customer_name;
            $report->address = $fields['address'] ?? $report->address;
            $report->email = $fields['email'] ?? $report->email;
            $report->contact_person = $fields['contact_person'] ?? $report->contact_person;
            $report->mobile = $fields['mobile'] ?? $report->mobile;
            $report->updated_by = $fields['updated_by'] ?? $report->updated_by;
            $report->model = $fields['model'] ?? $report->model;
            $report->company_name = $fields['company_name'] ?? $report->company_name;
            $report->type = $fields['type'] ?? $report->type;
            $report->subtype = $fields['subtype'] ?? $report->subtype;
    
    
            $report->equipment_id = $equipment_id ?? $report->equipment_id;
            $report->user_id = $user_id ?? $report->user_id;
            $report->customer_id = $customer_id ?? $report->customer_id;
    
    
            // Save the updated service report
            $report->save();
    
            // Return success response with updated service report data
            return response()->json([
                'message' => 'Service Report updated successfully',
                'data' => $report
            ], 200);
    
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors
            return response()->json([
                'message' => 'Validation Error',
                'errors' => $e->errors(),
            ], 422);
    
        } catch (\Exception $e) {
            // Handle any other errors
            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage(),
            ], 500);
        }
}
}