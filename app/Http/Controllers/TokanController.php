<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tokan;

class TokanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tokans = Tokan::all();
        return response()->json($tokans);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'clinic_id' => 'required|integer',
            'doctor_id' => '',
            'patient_id' => 'required|integer',
            'tokan_number' => 'integer',
            'date' => 'date',
            'status' => 'string',
        ]);

        $tokan = Tokan::create($validatedData);

        return response()->json(['message' => 'Tokan created successfully!', 'tokan' => $tokan], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $tokan = Tokan::find($id);

        if (!$tokan) {
            return response()->json(['message' => 'Tokan not found'], 404);
        }

        return response()->json($tokan);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $tokan = Tokan::find($id);

        if (!$tokan) {
            return response()->json(['message' => 'Tokan not found'], 404);
        }

        $validatedData = $request->validate([
            'clinic_id' => 'integer',
            'doctor_id' => 'integer',
            'patient_id' => 'integer',
            'appointment_id' => 'integer',
            'date' => 'date',
            'status' => 'string',
        ]);

        $tokan->update($validatedData);

        return response()->json(['message' => 'Tokan updated successfully!', 'tokan' => $tokan]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $tokan = Tokan::find($id);

        if (!$tokan) {
            return response()->json(['message' => 'Tokan not found'], 404);
        }

        $tokan->delete();

        return response()->json(['message' => 'Tokan deleted successfully!']);
    }
}
