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
        ]);

        $timeslot = Timeslot::create($validatedData);
        return response()->json(['message' => 'Timeslot created successfully!', 'timeslot' => $timeslot], 201);
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

    // Update a timeslot
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'doctor_id' => 'required|integer',
            'time' => 'required|date_format:H:i:s',
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
