<?php

namespace App\Http\Controllers;
use app\Model\Equipment;
use Illuminate\Http\Request;

function registerEquipment(Request $request)
{
    
        // Validate request
        $fields = $request->validate([
            'equipment_name' => 'required|string',
            'model_pnc' => 'required|string',
            'company_name' => 'required|string',
            'type' => 'required|string',
            'subtype' => 'required|string',
            'purchase_date' => 'nullable|date',
            'warranty_status' => 'required|in:Yes,No',
            'serial_number' => 'nullable|string|max:255',
            'status' => 'required|in:Active,Inactive,Deprecated',
            'maintenance_date' => 'nullable|date',
        ]);

        // Create equipment
        $equipment = Equipment::create([
            'equipment_name' => $request->equipment_name,
            'model_pnc' => $request->model_pnc,
            'company_name' => $request->company_name,
            'type' => $request->type,
            'subtype' => $request->subtype,
            'purchase_date' => $request->purchase_date,
            'warranty_status' => $request->warranty_status === 'Yes' ? true : false,
            'serial_number' => $request->serial_number,
            'status' => $request->status,
            'maintenance_date' => $request->maintenance_date,
        ]);

        // Return response
        return response()->json([
            'message' => "New Equipment Added Successfully",
            'equipment' => $equipment,
        ], 201);

    
    // catch (\Throwable $th) {
    //     // Log error
    //     \Log::error($th->getMessage());
    //     return response()->json([
    //         'message' => 'Internal Server Error',
    //         'error' => $th->getMessage(),
    //     ], 500);
    // }
}

function updateEquipment(Request $request ,$id){
    
}