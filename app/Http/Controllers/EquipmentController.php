<?php

namespace App\Http\Controllers;
use App\Models\Equipment;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    
// function registerEquipment(Request $request)
// {
//     try {
//         // Validate request
//         $fields = $request->validate([
//             'equipment_name' => 'required|string',
//             'model' => 'required|string',
//             'company_name' => 'required|string',
//             'type' => 'required|string',
//             'subtype' => 'nullable|string',
            
//         ]);
       
//         $show =true;
//         // Create equipment
//         $equipment = Equipment::create([
//             'equipment_name' => $fields['equipment_name'],
//             'model' => $fields['model'],
//             'company_name' => $fields['company_name'],
//             'type' => $fields['type'],
//             'subtype' => $fields['subtype'],
//             'show'=> $show,
//         ]);

//         // Return success response
//         return response()->json([
//             'message' => "New Equipment Added Successfully",
//             'equipment' => $equipment,
//         ], 201);
        
//     } catch (\Throwable $th) {
//         // Log error
//         \Log::error($th->getMessage());

//         // Return error response
//         return response()->json([
//             'message' => 'Internal Server Error',
//             'error' => $th->getMessage(),
//         ], 500);
//     }
// }

// function getEquipmentByName(Request $request) {
//     // Validate the search input
//     $fields = $request->validate([
//         'search' => 'required|string',
//     ]);

//     // Use the validated 'search' field to find customers by equipment_name
//     $equipment = Equipment::where('equipment_name', 'LIKE', '%' . $fields['search'] . '%')->get();
                            

//     // Check if any customers were found
//     if ($equipment->isEmpty()) {
//         return response()->json(['message' => 'No Equipment found'], 200);
//     }

//     // Return the matching Equipment
//     return response()->json($equipment);
// }

// function getEquipmentByModel(Request $request) {
//     // Validate the search input
//     $fields = $request->validate([
//         'search' => 'required|string',
//         'selectedEquipmentName'=>'required|string'

//     ]);

//     // Use the validated 'search' field to find customers by model
//     $equipment = Equipment::where('equipment_name', $fields['selectedEquipmentName'])
//                             ->where('model', 'LIKE', '%' . $fields['search'] . '%')->get();


//     // Check if any model were found
//     if ($equipment->isEmpty()) {
//         return response()->json(['message' => 'No Model found'], 404);
//     }

//     // Return the matching customers
//     return response()->json($equipment);
// }

//   function getEquipment()
//   {
//     $equipment = equipment::all();
//   return response()->json($equipment, 200);
//   }


 
//   public function deleteEquipment($id)
//   {   $equipment = equipment::find($id);
     
      
      
      
//       if (!$equipment) {
//           return response()->json(['message' => 'Equipment not found.'], 404);
//       }
      
//       // Access confirmation from the request
//       $confirm = $request->input('confirm');
      
//       if ($confirm) {
//           // Proceed to delete the customer
//           $equipment->delete();
//           return response()->json(['message' => 'Customer deleted successfully.']);
//       } else {
//           return response()->json(['message' => 'Deletion not confirmed.'], 400);
//       }
//   } 

//   public function updateEquipment(Request $request, $id)
// {
//                                                          // Find the customer by ID
//     $equipment = equipment::find($id);
//                                                          // Check if customer exists
//     if (!$equipment) {
//         return response()->json([
//             'message' => 'Equipment not found'
//         ], 404);
//     }
//                                                          // Validate request(sometimes)
//     $fields = $request->validate([
//         'equipment_name' => 'sometimes|string',
//         'model' => 'sometimes|string',
//         'company_name' => 'sometimes|string',
//         'type' => 'sometimes|string',
//         'subtype' => 'sometimes|string',
//         'show' => 'sometimes|string',
//     ]);
//     $show=true;
//                                          // Update Equipment fields if present in the request
//     $equipment->equipment_name = $fields['equipment_name'] ?? $equipment->equipment_name;
//     $equipment->model = $fields['model'] ?? $equipment->model;
//     $equipment->company_name = $fields['company_name'] ?? $equipment->company_name;
//     $equipment->type = $fields['type'] ?? $equipment->type;
//     $equipment->subtype = $fields['subtype'] ?? $equipment->subtype;
//     $equipment->show = $fields['show'] ?? $equipment->show;
//                                                          // Save the updated 
//     $equipment->save();
//                                                          // Return the updated
//     return response()->json([
//         'message' => 'Equipment updated successfully',
//         'data' => $equipment
//     ], 200);
// }
public function index()
{
    $equipment = Equipment::all();
    return response()->json($equipment);
}
public function store(Request $request)
{
    // Validate the incoming request data
    $validatedData = $request->validate([
        'equipment_name' => 'required|string|max:255',
        'model' => 'required|string|max:255',
        'serial_no' => 'required|string|unique:equipment,serial_no',
        'location' => 'required|string|max:255',
        'brand_name' => 'required|string|max:255',
    ]);

    // Create the equipment
    $equipment = Equipment::create($validatedData);

    // Return success response
   return response()->json($equipment, 200); // Return an empty array instead of a message
}
// Store a newly created equipment in storage
public function storeEquipment(Request $request)
{
    $validatedData = $request->validate([
        'location' => 'string',
        'equipment_name' => 'required|string',
        'brand_name' => 'nullable|string',
        'model' => 'nullable|string',
        'serial_no' => 'string',
    ]);

    $validatedData['show'] = $validatedData['show'] ?? 1; // Default value

    $equipment = Equipment::create($validatedData);

    return response()->json($equipment, 201);
}


// Display the specified equipment
public function show($id)
{
    $equipment = Equipment::findOrFail($id);
    return response()->json($equipment);
}

// Update the specified equipment in storage
public function update(Request $request, $id)
{
    // Validate incoming request
    $validatedData = $request->validate([
        'location' => 'required|string',
        'equipment_name' => 'required|string',
        'brand_name' => 'nullable|string',
        'model' => 'nullable|string',
        'serial_no' => 'nullable|string',
        'show' => 'nullable|string',
    ]);

    // Find equipment by ID
    $equipment = Equipment::findOrFail($id);
    
    // Update equipment data
    $equipment->update($validatedData);

    return response()->json($equipment);
}

// Remove the specified equipment from storage
public function destroy($id)
{
    $equipment = Equipment::findOrFail($id);
    $equipment->delete();

    return response()->json(null, 204);
}
// Display the specified equipment
public  function getEquipmentByName(Request $request) {
            // Validate the search input
            $fields = $request->validate([
                'search' => 'required|string',
            ]);
        
            // Use the validated 'search' field to find customers by equipment_name
            $equipment = Equipment::where('equipment_name', 'LIKE', '%' . $fields['search'] . '%')->get();
                                    
        
            // Check if any customers were found
            if ($equipment->isEmpty()) {
                return response()->json(['message' => 'No Equipment found'], 200);
            }
        
            // Return the matching Equipment
            return response()->json($equipment);
        }
        
}

