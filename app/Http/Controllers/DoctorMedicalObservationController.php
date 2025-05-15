<?php

namespace App\Http\Controllers;

use App\Models\DoctorMedicalObservation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DoctorMedicalObservationController extends Controller
{
    /**
     * Get medical observations settings for a doctor
     *
     * @param int $doctorId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByDoctor($doctorId)
    {
        try {
            $doctor = User::findOrFail($doctorId);
            $observations = $doctor->medicalObservations;
            
            if (!$observations) {
                // Return default values if no settings exist
                return response()->json([
                    'bp' => 0,
                    'pulse' => 0,
                    'weight' => 0,
                    'height' => 0,
                    'systemic_examination' => 0,
                    'diagnosis' => 0,
                    'past_history' => 0,
                    'complaint' => 0,
                ]);
            }
            
            return response()->json($observations);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch medical observations: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Save or update medical observations settings for a doctor
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function save(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'doctor_id' => 'required|exists:users,id',
                'bp' => 'required|boolean',
                'pulse' => 'required|boolean',
                'weight' => 'required|boolean',
                'height' => 'required|boolean',
                'systemic_examination' => 'required|boolean',
                'diagnosis' => 'required|boolean',
                'past_history' => 'required|boolean',
                'complaint' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Find existing record or create new one
            $observations = DoctorMedicalObservation::updateOrCreate(
                ['doctor_id' => $request->doctor_id],
                [
                    'bp' => $request->bp,
                    'pulse' => $request->pulse,
                    'weight' => $request->weight,
                    'height' => $request->height,
                    'systemic_examination' => $request->systemic_examination,
                    'diagnosis' => $request->diagnosis,
                    'past_history' => $request->past_history,
                    'complaint' => $request->complaint,
                ]
            );
            
            return response()->json([
                'message' => 'Medical observations settings saved successfully',
                'data' => $observations
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to save medical observations: ' . $e->getMessage()], 500);
        }
    }
}
