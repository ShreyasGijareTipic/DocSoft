<?php

namespace App\Http\Controllers;
 
use App\Models\Timeslot;
use Illuminate\Http\Request;
 
class TimeslotController extends Controller
{
    // Display a listing of timeslots
    public function index()
    {
        $timeslots = Timeslot::all();
        return response()->json($timeslots);
    }
 
    // Store new timeslots
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'doctor_id' => 'required|integer',
            'time' => 'required|date_format:H:i:s',
            'slot' => 'required|integer'

        ]);
 
        $timeslot = Timeslot::create($validatedData);
        return response()->json(['message' => 'Timeslot created successfully!', 'timeslots' => $timeslot], 201);
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

    public function allData($doctor_id)
    {
        // Fetch times for the given doctor_id
        $timeslots = Timeslot::where('doctor_id', $doctor_id)
                             ->get(); // Get only the 'time' column

        return response()->json($timeslots);
    }

    public function forDoctorSlot($doctor_id)
{
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
            'doctor_id' => 'required|integer',
            'time' => 'required|date_format:H:i:s',
            'slot' => 'required|integer',

        ]);
 
        $timeslot = Timeslot::findOrFail($id);
        $timeslot->update($validatedData);
        return response()->json(['message' => 'Timeslot updated successfully!', 'timeslot' => $timeslot]);
    }
 
    // Delete a timeslot
    public function destroy($id)
    {
        $timeslot = Timeslot::findOrFail($id);
        $timeslot->delete();
        return response()->json(['message' => 'Timeslot deleted successfully!']);
    }
}