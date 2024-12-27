<?php

namespace App\Http\Controllers;

use App\Models\HealthDirective;
use Illuminate\Http\Request;

class HealthDirectiveController extends Controller
{
    /**
     * Display a listing of health directives.
     */
    public function index()
    {
        $healthDirectives = HealthDirective::all();
        return response()->json($healthDirectives);
    }

    /**
     * Store a new health directive.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'bill_id' => 'required|exists:bills,id',
            'medicine' => 'required|string',
            'strength' => 'required|string',
            'dosage' => 'required|string',
            'timing' => 'required|string',
            'frequency' => 'required|string',
            'duration' => 'required|string',
        ]);

        $healthDirective = HealthDirective::create($validatedData);
        return response()->json($healthDirective, 201);
    }

    /**
     * Display the specified health directive.
     */
    public function show($id)
    {
        $healthDirective = HealthDirective::findOrFail($id);
        return response()->json($healthDirective);
    }

    /**
     * Update the specified health directive.
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
          
            'medicine' => 'nullable|string',
            'strength' => 'required|string',
            'dosage' => 'nullable|string',
            'timing' => 'nullable|string',
            'frequency' => 'nullable|string',
            'duration' => 'nullable|string',
        ]);

        $healthDirective = HealthDirective::findOrFail($id);
        $healthDirective->update($validatedData);
        return response()->json($healthDirective);
    }

    /**
     * Remove the specified health directive.
     */
    public function destroy($id)
    {
        $healthDirective = HealthDirective::findOrFail($id);
        $healthDirective->delete();
        return response()->json(['message' => 'Health directive deleted successfully']);
    }

    public function getByBillId($bill_id)
{
    // Assuming you have a `HealthDirective` model that relates to the `health_directives` table
    $healthDirectives = HealthDirective::where('bill_id', $bill_id)->get();

    return response()->json($healthDirectives);
}

}
