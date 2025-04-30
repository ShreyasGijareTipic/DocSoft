<?php

namespace App\Http\Controllers;

use App\Models\Clinic;

use Illuminate\Http\Request;

class ClinicController extends Controller
{
    /**
     * Display a listing of the clinics.
     */
    public function index()
    {
        $clinic = Clinic::all();
        return response()->json($clinic);
    }

    /**
 * Store a newly created clinic in storage.
 */
public function store(Request $request)
{
    try {
        // Validate the input
        $request->validate([
            'clinic_name' => 'required|string|max:255',
            'logo' => 'required|string', // Expecting a base64 string or a URL
            'clinic_address' => 'required|string',
            'clinic_registration_no' => 'required|string|unique:clinic',
            'clinic_mobile' => 'required|string',
            'clinic_whatsapp_mobile' => 'nullable|string',
            'clinic_whatsapp_url' => 'nullable|string',
            'clinic_permanant_tokan' => 'nullable|string|unique:clinic',
            'clinic_webhook_tokan' => 'nullable|string|unique:clinic',
            'subscribed_plan' => 'required|integer',
            'subscription_validity' => 'required',
            'refer_by_id' => 'required',
        ]);
        
        // Create the clinic record
        $clinic = Clinic::create($request->all());
        
        // Return success response with clinic_id highlighted for registration
        return response()->json([
            'success' => true,
            'message' => 'Clinic created successfully.',
            'clinic_id' => $clinic->id, // Explicitly returning clinic_id for registration
            'data' => $clinic,
        ], 201);
        
    } catch (\Exception $e) {
        // Handle errors
        return response()->json([
            'success' => false,
            'message' => 'Failed to create clinic. Error: ' . $e->getMessage(),
        ], 500);
    }
}
    

    /**
     * Display the specified clinic.
     */
    public function show(Clinic $clinic)
    {
        $clinic = Clinic::all();
        return response()->json($clinic);
    }



    public function showdatabyid($id)
{
   
    $clinic = Clinic::find($id);;

    // Check if the clinic exists
    if (!$clinic) {
        return response()->json(['error' => 'Clinic not found'], 404);
    }
    return response()->json($clinic);
}



    /**
     * Update the specified clinic in storage.
     */
    public function update(Request $request, $clinicId)
{
    try {
        // Fetch the clinic record or fail if not found
        $clinic = Clinic::findOrFail($clinicId);

        // Validate incoming request data
        $request->validate([
            'logo' => 'nullable|string',
            'clinic_address' => 'nullable|string',
            'clinic_mobile' => 'nullable|string',
            'clinic_whatsapp_mobile' => 'nullable|string',
            'clinic_whatsapp_url' => 'nullable|string',
            'clinic_permanant_tokan' => 'nullable|string',
            'clinic_webhook_tokan' => 'nullable|string',
        ]);

        // Prepare the data for update
        $data = [
            'clinic_name' => $clinic->clinic_name, // Assuming this is not editable, otherwise add validation for it
            'clinic_registration_no' => $clinic->clinic_registration_no, // Assuming this is not editable, otherwise add validation for it
            'clinic_mobile' => $request->clinic_mobile ?? $clinic->clinic_mobile,
            'clinic_address' => $request->clinic_address ?? $clinic->clinic_address,
            'clinic_whatsapp_mobile' => $request->clinic_whatsapp_mobile ?? $clinic->clinic_whatsapp_mobile,
            'clinic_whatsapp_url' => $request->clinic_whatsapp_url ?? $clinic->clinic_whatsapp_url,
            'clinic_permanant_tokan' => $request->clinic_permanant_tokan ?? $clinic->clinic_permanant_tokan,
            'clinic_webhook_tokan' => $request->clinic_webhook_tokan ?? $clinic->clinic_webhook_tokan,
        ];

        // Update the clinic record
        $clinic->update($data);

        // Return the updated clinic record in response
        return response()->json($clinic);

    } catch (\Exception $e) {
        // Handle errors and return a response with the error message
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


    /**
     * Remove the specified clinic from storage.
     */
    public function destroy(Clinic $clinic)
    {
        $clinic->delete();
        return response()->json(null, 204);
    }
}
