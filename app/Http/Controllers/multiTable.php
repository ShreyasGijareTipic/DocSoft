<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;              
use Illuminate\Support\Facades\DB;      
use App\Models\SpareParts;
use App\Models\Equipment;
use App\Models\Report;
use App\Models\ReportDetails;  
use Illuminate\Support\Facades\Auth; 

class multiTable extends Controller
{   
  
    public function storeAssignWithEquipment(Request $request)
    {
        DB::beginTransaction(); // Start a transaction
    
        try {
            // Step 1: Validate and create equipment first
            $equipmentData = $request->validate([
                'location' => 'required|string',
                'equipment_name' => 'required|string',
                'model' => 'nullable|string',
                'brand_name' => 'required|string',
                'serial_no' => 'nullable|string',
            ]);
    
            // Add 'show' field and create equipment entry
            $equipmentData['show'] = "1";
            $equipment = Equipment::create($equipmentData);
    
            // Step 2: Validate report data and add the newly created equipment ID
            $validatedData = $request->validate([
                'customer_id' => 'required|integer',
                'customer_name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'contact_person' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'mobile' => 'required|digits_between:10,15',
                'location' => 'required|string|max:255',
                'call_type' => 'required|integer',
                'closed' => 'boolean',
                'updated_by' => 'nullable|integer',
                'assigned_to' => 'required|integer',
            ]);
    
            // Use the equipment ID in the report data
            $validatedData['equipment_id'] = $equipment->id;
            $validatedData['equipment_name'] = $equipment->equipment_name;
            $validatedData['location'] = $equipment->location;
            $validatedData['model'] = $equipment->model;
            $validatedData['brand_name'] = $equipment->brand_name;
            $validatedData['serial_no'] = $equipment->serial_no;
            $validatedData['created_by'] = Auth::user()->id;
            $validatedData['assigned_by'] = Auth::user()->type;
    
            // Create report
            $report = Report::create($validatedData);
    
            DB::commit(); // Commit transaction if both are successful
    
            return response()->json([
                'message' => 'Report and Equipment created successfully',
                'report' => $report,
                'equipment' => $equipment,
            ], 201);
    
        } catch (\Throwable $th) {
            DB::rollBack(); // Rollback transaction on failure
            \Log::error($th->getMessage());
    
            return response()->json([
                'message' => 'Internal Server Error',
                'error' => $th->getMessage(),
            ], 500);
        }
    }
    
    

    public function storeData(Request $request)
    {
        // Validate request for report details and remark
        $validatedData = $request->validate([
            'report_id' => 'required|exists:reports,id',
            'created_by' => 'required|integer',
            'nature_complaint' => 'nullable|string',
            'actual_fault' => 'nullable|string',
            'action_taken' => 'nullable|string',
            'remark' => 'nullable|integer',
            'customer_suggestion' => 'nullable|string',
            'signature_by' => 'required|string',
            'signature' => 'required|string',
            'spare_parts' => 'nullable|array',
            'spare_parts.*.description' => 'required|string|max:255',
            'spare_parts.*.qty' => 'required|integer|min:1',
            'spare_parts.*.remark' => 'nullable|string|max:255',
        ]);
    
        // Start transaction to ensure atomicity
        DB::beginTransaction();
    
        try {
            // Store data in the report details table
            $reportDetail = ReportDetails::create($validatedData);
    
            // Update the remark field in the reports table
            Report::where('id', $validatedData['report_id'])->update([
                'remark' => $validatedData['remark'],
            ]);
    
            // Store data in the spare parts table only if 'spare_parts' data is provided and not empty
            if (!empty($validatedData['spare_parts'])) {
                foreach ($validatedData['spare_parts'] as $sparePart) {
                    SpareParts::create([
                        'description' => $sparePart['description'],
                        'qty' => $sparePart['qty'],
                        'remark' => $sparePart['remark'] ?? null,
                        'report_details_id' => $reportDetail->id,
                    ]);
                }
            }
    
            // Commit transaction
            DB::commit();
    
            return response()->json([
                'message' => 'Data stored successfully',
                'reportDetail' => $reportDetail,
            ], 201);
    
        } catch (\Throwable $th) {
            // Rollback transaction in case of error
            DB::rollBack();
            \Log::error($th->getMessage());
    
            return response()->json([
                'message' => 'Internal Server Error',
                'error' => $th->getMessage(),
            ], 500);
        }
    }




   



    public function storeCompleteData(Request $request)
    {
        // Initial validation for basic fields
        $validatedData = $request->validate([
            // Report Fields
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
            'call_type' => 'required|integer',
            'updated_by' => 'nullable|integer',
            'assigned_to' => 'required|integer',
    
            // Report Details Fields
            'nature_complaint' => 'nullable|string',
            'actual_fault' => 'nullable|string',
            'action_taken' => 'nullable|string',
            'remark' => 'required|integer|in:0,1,2,4',
            'customer_suggestion' => 'nullable|string',
            'signature_by' => 'required|string',
            'signature' => 'required|string',
    
            // Spare Parts (Optional)
            'spare_parts' => 'nullable|array',
            'spare_parts.*.description' => 'required|string|max:255',
            'spare_parts.*.qty' => 'required|integer|min:1',
            'spare_parts.*.remark' => 'nullable|string|max:255',
        ]);
    
        // Automatically set `closed` based on `remark` value
        if (in_array($validatedData['remark'], [0, 1])) {
            $validatedData['closed'] = 0;
        } elseif (in_array($validatedData['remark'], [2, 4])) {
            $validatedData['closed'] = 1;
        }
    
        // Set authenticated user info
        $validatedData['created_by'] = Auth::user()->id;
        $validatedData['assigned_by'] = Auth::user()->type;
    
        // Start a transaction
        DB::beginTransaction();
    
        try {
            // Create report entry
            $report = Report::create($validatedData);
    
            // Create report detail entry
            $reportDetailData = array_merge($validatedData, ['report_id' => $report->id]);
            $reportDetail = ReportDetails::create($reportDetailData);
    
            // Store data in the spare parts table if provided and not empty
            if (!empty($validatedData['spare_parts'])) {
                foreach ($validatedData['spare_parts'] as $sparePart) {
                    SpareParts::create([
                        'description' => $sparePart['description'],
                        'qty' => $sparePart['qty'],
                        'remark' => $sparePart['remark'] ?? null,
                        'report_details_id' => $reportDetail->id,
                    ]);
                }
            }
    
            // Commit transaction
            DB::commit();
    
            return response()->json([
                'message' => 'Data stored successfully',
                'report' => $report,
                'reportDetail' => $reportDetail
            ], 201);
    
        } catch (\Throwable $th) {
            // Rollback transaction if an error occurs
            DB::rollBack();
            \Log::error($th->getMessage());
    
            return response()->json([
                'message' => 'Internal Server Error',
                'error' => $th->getMessage(),
            ], 500);
        }
    }



    public function storeCompleteDataWithEquipment(Request $request)
{
    $validatedData = $request->validate([
        // Report Fields
        'customer_id' => 'required|integer',
        'customer_name' => 'required|string|max:255',
        'address' => 'required|string|max:255',
        'contact_person' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'mobile' => 'required|digits_between:10,15',

        // Equipment Details (to be created if no equipment_id is provided)
        'equipment_id' => 'nullable|string|max:255',
        'location' => 'required_without:equipment_id|string|max:255',
        'equipment_name' => 'required_without:equipment_id|string|max:255',
        'serial_no' => 'nullable|string|max:255',
        'model' => 'nullable|string|max:255',
        'brand_name' => 'nullable|string|max:255',

        // Extra Fields for Analysis and Service Person
        'call_type' => 'required|integer',
        'updated_by' => 'nullable|integer',
        'assigned_to' => 'required|integer',

        // Report Details Fields
        'nature_complaint' => 'nullable|string',
        'actual_fault' => 'nullable|string',
        'action_taken' => 'nullable|string',
        'remark' => 'required|integer|in:0,1,2,4',
        'customer_suggestion' => 'nullable|string',
        'signature_by' => 'required|string',
        'signature' => 'required|string',

        // Spare Parts (Optional)
        'spare_parts' => 'nullable|array',
        'spare_parts.*.description' => 'required|string|max:255',
        'spare_parts.*.qty' => 'required|integer|min:1',
        'spare_parts.*.remark' => 'nullable|string|max:255',
    ]);

    if (in_array($validatedData['remark'], [0, 1])) {
        $validatedData['closed'] = 0;
    } elseif (in_array($validatedData['remark'], [2, 4])) {
        $validatedData['closed'] = 1;
    }

    $validatedData['created_by'] = Auth::user()->id;
    $validatedData['assigned_by'] = Auth::user()->type;

    DB::beginTransaction();

    try {
        // Check if equipment_id is provided, else create new equipment
        if (empty($validatedData['equipment_id'])) {
            $equipment = Equipment::create([
                'location' => $validatedData['location'],
                'equipment_name' => $validatedData['equipment_name'],
                'model' => $validatedData['model'] ?? null,
                'brand_name' => $validatedData['brand_name'],
                'serial_no' => $validatedData['serial_no'] ?? null,
                'show' => 1
            ]);
            $validatedData['equipment_id'] = $equipment->id;
        }

        // Create report entry
        $report = Report::create($validatedData);

        // Create report detail entry
        $reportDetailData = array_merge($validatedData, ['report_id' => $report->id]);
        $reportDetail = ReportDetails::create($reportDetailData);

        // Store data in the spare parts table if provided and not empty
        if (!empty($validatedData['spare_parts'])) {
            foreach ($validatedData['spare_parts'] as $sparePart) {
                SpareParts::create([
                    'description' => $sparePart['description'],
                    'qty' => $sparePart['qty'],
                    'remark' => $sparePart['remark'] ?? null,
                    'report_details_id' => $reportDetail->id,
                ]);
            }
        }

        DB::commit();

        return response()->json([
            'message' => 'Data stored successfully',
            'report' => $report,
            'reportDetail' => $reportDetail,
            'equipment' => $equipment ?? null
        ], 201);

    } catch (\Throwable $th) {
        DB::rollBack();
        \Log::error($th->getMessage());

        return response()->json([
            'message' => 'Internal Server Error',
            'error' => $th->getMessage(),
        ], 500);
    }
}

    

    

}
