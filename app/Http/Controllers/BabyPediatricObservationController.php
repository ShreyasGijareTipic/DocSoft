<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log; // ✅ CORRECT placement
use App\Models\BabyPediatricObservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class BabyPediatricObservationController extends Controller
{
    // Optional: middleware if you're using Sanctum
    // public function __construct()
    // {
    //     $this->middleware('auth:sanctum');
    // }

    // ✅ 1. Store New Observation
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'p_p_i_id' => 'required|integer|exists:bills,id',
                'patient_id' => 'required|integer',
                'doctor_id' => 'required|integer',
                'weightBaby' => 'nullable|numeric',
                'heightBaby' => 'nullable|numeric',
                'head_circumference' => 'nullable|numeric',
                'temperature' => 'nullable|numeric',
                'heart_rate' => 'nullable|integer',
                'respiratory_rate' => 'nullable|integer',
                'vaccinations_given' => 'nullable|string',
                'milestones_achieved' => 'nullable|string',
                'remarks' => 'nullable|string',
            ]);

            $validated['created_by'] = Auth::id();

            $observation = BabyPediatricObservation::create($validated);

            return response()->json([
                'message' => 'Observation saved successfully',
                'data' => $observation
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Observation Save Error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ✅ 2. Get Single Observation by ID
    public function getById($id)
    {
        $observation = BabyPediatricObservation::find($id);

        if (!$observation) {
            return response()->json(['message' => 'Observation not found'], 404);
        }

        return response()->json($observation);
    }

    // ✅ 3. Get Observations by p_p_i_id
   public function getByPpiId($p_p_i_id)
{
    $observations = BabyPediatricObservation::where('p_p_i_id', $p_p_i_id)
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($observations);
}

    // ✅ 4. Get Observations by Patient ID
    public function getByPatientId($patient_id)
    {
        $observations = BabyPediatricObservation::where('patient_id', $patient_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($observations);
    }
}
