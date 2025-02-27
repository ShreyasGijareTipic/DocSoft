<?php

namespace App\Http\Controllers;
 
use App\Models\Timeslot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

 
class TimeslotController extends Controller
{
    // Display a listing of timeslots
    public function index()
    {
        $timeslots = Timeslot::all();
        return response()->json($timeslots);
    }

 
    public function store(Request $request)
    {
        try {
            // Validate input fields
            $validatedData = $request->validate([
                'time' => 'required|date_format:H:i:s', // Only hours and minutes
                'slot' => 'required|integer'          // Ensure slot is an integer
            ]);
    
            // Get the logged-in doctor's ID
            $doctorId = Auth::id(); // Fetch doctor ID dynamically
    
            // Add the doctor_id to validated data
            $validatedData['doctor_id'] = $doctorId;
    
            // Create a new timeslot
            $timeslot = Timeslot::create($validatedData);
    
            // Return JSON response
            return response()->json([
                'message' => 'Timeslot created successfully!',
                'timeslot' => $timeslot
            ], 201);

        } catch (\Exception $e) {
            // Return JSON response with error message
            return response()->json([
                'message' => 'An error occurred while creating the timeslot.',
                'error' => $e->getMessage() // Optional: For debugging purposes, remove in production
            ], 200);
        }
    }

 
    // Display a single timeslot
    public function show($doctor_id)
    {
        // Fetch times for the given doctor_id
        $timeslots = Timeslot::where('doctor_id', $doctor_id)
                             ->pluck('time') // Get only the 'time' column
                             ->toArray();   // Convert to a plain array
        return response()->json($timeslots);
    }



    public function allData()
{
    // Get the logged-in doctor
    $doctor = Auth::user(); // Get authenticated user

    // Ensure the user is a doctor and retrieve their ID
   // Assuming 'role' column determines the role
        $timeslots = Timeslot::where('doctor_id', $doctor->id)->get(); // Fetch time slots
        return response()->json($timeslots);
    

    // Return error if the user is not a doctor or unauthorized
    return response()->json(['error' => 'Unauthorized'], 403);
}



    public function forDoctorSlot()
    {
        // Get the logged-in doctor's ID
        $doctor_id = Auth::user()->id; // Assuming the doctor logs in and is authenticated
    
        // Fetch timeslots for the logged-in doctor
        $timeslots = Timeslot::where('doctor_id', $doctor_id)
            ->pluck('time')  // Get only the 'time' column
            ->toArray();  // Convert to a plain array
    
        // Create an array of all times from 00:00:00 to 23:00:00
        $allTimes = [];
        for ($hour = 0; $hour < 24; $hour++) {
            for ($minute = 0; $minute < 60; $minute += 60) {  // Increment by hour (0, 60, 120, etc.)
                $time = sprintf("%02d:%02d:%02d", $hour, $minute, 0);
                $allTimes[] = $time;  // Add time in 'HH:MM:SS' format
            }
        }
    
        // Find the times that are NOT in the timeslots array
        $unavailableTimes = array_diff($allTimes, $timeslots);
    
        // Return the unavailable times as JSON
        return response()->json(array_values($unavailableTimes));
    }

 
    // Update a timeslot
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            // 'doctor_id' => 'required|integer',
            'time' => 'required|date_format:H:i:s',
            'slot' => 'required|integer',

        ]);
 
        $timeslot = Timeslot::findOrFail($id);
        $timeslot->update($validatedData);
        return response()->json(['message' => 'Timeslot updated successfully!', 'timeslot' => $timeslot]);
    }
 
    public function destroy($id)
{
    try {
        // Ensure the logged-in user is a doctor
        $doctorId = Auth::user()->id; // Get logged-in doctor ID
        
        // Find timeslot and check if it belongs to the doctor
        $timeslot = Timeslot::where('id', $id)
                            ->where('doctor_id', $doctorId)
                            ->firstOrFail();

        // Delete the timeslot
        $timeslot->delete();

        return response()->json(['message' => 'Timeslot deleted successfully!']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to delete timeslot.'], 400);
    }
}
}