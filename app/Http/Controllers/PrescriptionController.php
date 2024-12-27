<?php
namespace App\Http\Controllers;
use App\Models\Prescription;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
    public function getPrescriptions($doctorRegistrationNumber)
    {
        $prescriptions = Prescription::where('registration_number', $doctorRegistrationNumber)->get();

        $prescriptions->transform(function ($prescription) {
            $prescription->medicines = json_decode($prescription->medicines);
            return $prescription;
        });

        return response()->json($prescriptions);
    }


    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'doctor_name' => 'required|string|max:255',
                'registration_number' => 'required|string|max:255',
                'patient_name' => 'required|string|max:255',
                'visit_date' => 'required|date',
                'medicines' => 'required|array',
                'medicines.*.medicine' => 'required|string|max:255',
                'medicines.*.dosage' => 'required|string|max:255',
                'medicines.*.timing' => 'required|string|max:255',
                'medicines.*.frequency' => 'required|string|max:255',
                'medicines.*.duration' => 'required|string|max:255',
                'bp' => 'nullable|string|max:255',
                'pulse' => 'nullable|string|max:255',
                'past_history' => 'nullable|string|max:1000',
                'complaints' => 'nullable|string|max:1000',
                'systemic_examination_general' => 'nullable|string|max:1000',
                'systemic_examination_pa' => 'nullable|string|max:1000',
            ]);
    
            
            $prescription = Prescription::create([
                'doctor_name' => $validated['doctor_name'],
                'registration_number' => $validated['registration_number'],
                'patient_name' => $validated['patient_name'],
                'visit_date' => $validated['visit_date'],
                'medicines' => json_encode($validated['medicines']),
                'bp' => $validated['bp'],
                'pulse' => $validated['pulse'],
                'past_history' => $validated['past_history'],
                'complaints' => $validated['complaints'],
                'systemic_examination_general' => $validated['systemic_examination_general'],
                'systemic_examination_pa' => $validated['systemic_examination_pa'],
            ]);
    
            
            foreach ($validated['medicines'] as $medicine) {
                $prescription->medicines()->create([
                    'name' => $medicine['medicine'],
                    'dosage' => $medicine['dosage'],
                    'timing' => $medicine['timing'],
                    'frequency' => $medicine['frequency'],
                    'duration' => $medicine['duration'],
                ]);
            }
    
            return response()->json([
                'message' => 'Prescription created successfully',
                'data' => $prescription->load('medicines'), 
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the prescription',
                'message' => $e->getMessage(),
            ], 500);
            
        }
    }
 }        
