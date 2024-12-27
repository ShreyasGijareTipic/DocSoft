<?php

namespace App\Http\Controllers;
use App\Models\Equipment;
use Illuminate\Http\Request;

class EquipmentDataController extends Controller
{
    function registerNewEquipment(Request $request)
{
    try {

        // "location":"UKIYO Kitchen",
        // "equipment_name":"Fryer/Cooking Block 000323",
        // "brand_name":"INTECH",
        // "serial_no":"GG0000E1000000710HA"

        // Validate request
        $fields = $request->validate([
            'location' => 'required|string',
            'equipment_name' => 'required|string',
            'model' => 'nullable|string',
           'brand_name' => 'required|string',
            'serial_no' => 'nullable|string',
            
        ]);
       
        $show ="1";
        // Create equipment
        $equipment = Equipment::create([
            'equipment_name' => $fields['equipment_name'],
            'model' => $fields['model'] ?? null,  // Set default to null if not present
            'brand_name' => $fields['brand_name'],
            'location' => $fields['location'],
            'serial_no' => $fields['serial_no'] ?? null,  // Set default to null if not present
            'show' => $show]);
 
        // Return success response
        return response()->json([
            'message' => "New Equipment Added Successfully",
            'equipment' => $equipment,
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
 
function getEquipmentByName(Request $request) {
    // Validate the search input
    $fields = $request->validate([
        'search' => 'required|string',
    ]);
 
    // Use the validated 'search' field to find customers by equipment_name
    $equipment = EquipmentData::where('equipment_name', 'LIKE', '%' . $fields['search'] . '%')->get();
 
    // Check if any customers were found
    if ($equipment->isEmpty()) {
        return response()->json(['message' => 'No Equipment found'], 404);
    }
 
    // Return the matching Equipment
    return response()->json($equipment);
}
 
function getEquipmentByModel(Request $request) {
    // Validate the search input
    $fields = $request->validate([
        'search' => 'required|string',
        // 'selectedEquipmentName'=>'required|string'
 
    ]);
 
    // Use the validated 'search' field to find customers by model
    $equipment = EquipmentData::where('model', 'LIKE', '%' . $fields['search'] . '%')->get();
                              //where('equipment_name', $fields['selectedEquipmentName'])
                            // ->where('model', 'LIKE', '%' . $fields['search'] . '%')->get();
 
 
    // Check if any model were found
    if ($equipment->isEmpty()) {
        return response()->json(['message' => 'No Model found'], 404);
    }
 
    // Return the matching customers
    return response()->json($equipment);
}
  function getEquipment()
  {
    $equipment = EquipmentData::all();
  return response()->json($equipment, 200);
  }
 
 
 
  public function deleteEquipment($id)
  {   $equipment = EquipmentData::find($id);
     
     
     
     
      if (!$equipment) {
          return response()->json(['message' => 'Equipment not found.'], 404);
      }
     
      // Access confirmation from the request
      $confirm = $request->input('confirm');
     
      if ($confirm) {
          // Proceed to delete the customer
          $equipment->delete();
          return response()->json(['message' => 'Customer deleted successfully.']);
      } else {
          return response()->json(['message' => 'Deletion not confirmed.'], 400);
      }
  }
 
  public function updateEquipment(Request $request, $id)
{
                                                         // Find the customer by ID
    $equipment = EquipmentData::find($id);
                                                         // Check if customer exists
    if (!$equipment) {
        return response()->json([
            'message' => 'Equipment not found'
        ], 404);
    }
                                                         // Validate request(sometimes)
    $fields = $request->validate([
        'equipment_name' => 'sometimes|string',
        'model' => 'sometimes|string',
        'company_name' => 'sometimes|string',
        'type' => 'sometimes|string',
        'subtype' => 'sometimes|string',
        'show' => 'sometimes|string',
    ]);
    $show=true;
                                         // Update Equipment fields if present in the request
    $equipment->equipment_name = $fields['equipment_name'] ?? $equipment->equipment_name;
    $equipment->model = $fields['model'] ?? $equipment->model;
    $equipment->company_name = $fields['company_name'] ?? $equipment->company_name;
    $equipment->type = $fields['type'] ?? $equipment->type;
    $equipment->subtype = $fields['subtype'] ?? $equipment->subtype;
    $equipment->show = $fields['show'] ?? $equipment->show;
                                                         // Save the updated
    $equipment->save();
                                                         // Return the updated
    return response()->json([
        'message' => 'Equipment updated successfully',
        'data' => $equipment
    ], 200);
}
}
