<?php

namespace App\Http\Controllers;

use App\Models\DoctorMedicalObservation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\DoctorAyurvedicObservation;

class DoctorMedicalObservationController extends Controller
{
    /**
     * Get medical observations settings for a doctor
     *
     * @param int $doctorId
     * @return \Illuminate\Http\JsonResponse
     */
    // public function getByDoctor($doctorId)
    // {
    //     try {
    //         $doctor = User::findOrFail($doctorId);
    //         $observations = $doctor->medicalObservations;
            
    //         if (!$observations) {
    //             // Return default values if no settings exist
    //             return response()->json([
    //                 'bp' => 0,
    //                 'pulse' => 0,
    //                 'weight' => 0,
    //                 'height' => 0,
    //                 'systemic_examination' => 0,
    //                 'diagnosis' => 0,
    //                 'past_history' => 0,
    //                 'complaint' => 0,
    //             ]);
    //         }
            
    //         return response()->json($observations);
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => 'Failed to fetch medical observations: ' . $e->getMessage()], 500);
    //     }
    // }
    public function getByDoctor($doctorId)
{
    try {
        // Ensure doctor exists
        $doctor = User::findOrFail($doctorId);

        // Fetch medical and ayurvedic observations
        $medical = $doctor->medicalObservations;
        // $ayurvedic = $doctor->ayurvedicObservations;
        $ayurvedic = DoctorAyurvedicObservation::where('doctor_id', $doctorId)->first();


        // Default fields
        $medicalDefaults = [
            'bp' => 0,
            'pulse' => 0,
            'weight' => 0,
            'height' => 0,
            'systemic_examination' => 0,
            'diagnosis' => 0,
            'past_history' => 0,
            'complaint' => 0,
        ];

        $ayurvedicDefaults = [
            'occupation' => 0,
            'pincode' => 0,
            'email' => 0,
            'past_history' => 0,
            'prasavvedan_parikshayein' => 0,
            'habits' => 0,
            'lab_investigation' => 0,
            'personal_history' => 0,
            'food_and_drug_allergy' => 0,
            'lmp' => 0,
            'edd' => 0,
        ];

        // Merge values with defaults and cast to boolean
        $medicalFinal = [];
        foreach ($medicalDefaults as $key => $default) {
            $medicalFinal[$key] = isset($medical->$key) ? (bool)$medical->$key : false;
        }

        $ayurvedicFinal = [];
        foreach ($ayurvedicDefaults as $key => $default) {
            $ayurvedicFinal[$key] = isset($ayurvedic->$key) ? (bool)$ayurvedic->$key : false;
        }

        return response()->json([
            'medical_observations' => $medicalFinal,
            'ayurvedic_observations' => $ayurvedicFinal,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to fetch observations: ' . $e->getMessage()
        ], 500);
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


// public function save(Request $request)
// {
//     try {
//         $validator = Validator::make($request->all(), [
//             'doctor_id' => 'required|exists:users,id',

//             // Medical Observation Fields
//             'bp' => 'required|boolean',
//             'pulse' => 'required|boolean',
//             'weight' => 'required|boolean',
//             'height' => 'required|boolean',
//             'systemic_examination' => 'required|boolean',
//             'diagnosis' => 'required|boolean',
//             'past_history' => 'required|boolean',
//             'complaint' => 'required|boolean',

//             // Ayurvedic Observation Fields
//             'occupation' => 'required|boolean',
//             'pincode' => 'required|boolean',
//             'email' => 'required|boolean',
//             'prasavvedan_parikshayein' => 'required|boolean',
//             'habits' => 'required|boolean',
//             'lab_investigation' => 'required|boolean',
//             'personal_history' => 'required|boolean',
//             'food_and_drug_allergy' => 'required|boolean',
//             'lmp' => 'required|boolean',
//             'edd' => 'required|boolean',
//         ]);

//         if ($validator->fails()) {
//             return response()->json(['errors' => $validator->errors()], 422);
//         }

//         // Save Medical Observation
//         $medical = \App\Models\DoctorMedicalObservation::updateOrCreate(
//             ['doctor_id' => $request->doctor_id],
//             [
//                 'bp' => $request->bp,
//                 'pulse' => $request->pulse,
//                 'weight' => $request->weight,
//                 'height' => $request->height,
//                 'systemic_examination' => $request->systemic_examination,
//                 'diagnosis' => $request->diagnosis,
//                 'past_history' => $request->past_history,
//                 'complaint' => $request->complaint,
//             ]
//         );

//         // Save Ayurvedic Observation
//         $ayurvedic = \App\Models\DoctorAyurvedicObservation::updateOrCreate(
//             ['doctor_id' => $request->doctor_id],
//             [
//                 'occupation' => $request->occupation,
//                 'pincode' => $request->pincode,
//                 'email' => $request->email,
//                 'past_history' => $request->past_history, // shared field
//                 'prasavvedan_parikshayein' => $request->prasavvedan_parikshayein,
//                 'habits' => $request->habits,
//                 'lab_investigation' => $request->lab_investigation,
//                 'personal_history' => $request->personal_history,
//                 'food_and_drug_allergy' => $request->food_and_drug_allergy,
//                 'lmp' => $request->lmp,
//                 'edd' => $request->edd,
//             ]
//         );

//         return response()->json([
//             'message' => 'Medical and Ayurvedic observations saved successfully',
//             'medical' => $medical,
//             'ayurvedic' => $ayurvedic,
//         ]);

//     } catch (\Exception $e) {
//         return response()->json(['error' => 'Failed to save observations: ' . $e->getMessage()], 500);
//     }
// }


}