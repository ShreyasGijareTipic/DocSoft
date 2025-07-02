<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Support\Facades\Log;


use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\Online_Appointments;
use App\Services\WhatsAppService;
use App\Models\Patient;
 
class OnlineAppointmentsController extends Controller
{
    // public function store(Request $request)
    // {
    //     // Validate input
    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'service' => 'required|string|max:255',
    //         'date' => 'required|date',
    //         'time' => 'required|string|max:10',
    //         'phone' => 'required|string|max:15',
    //     ]);
 
    //     // Create appointment
    //     $appointment = Appointment::create($validated);
 
    //     // Send WhatsApp confirmation message with button
    //     WhatsAppService::sendConfirmation($appointment->phone, $appointment);
 
    //     // Return JSON response
    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Appointment booked and WhatsApp message sent.',
    //         'appointment' => $appointment,
    //     ], 201);
    // }
// ___________________________________________________________________________________  
//     public function getAppointments()
// {
//     $Online_Appointments = Online_Appointments::all(); // Fetches all records
 
//     return response()->json($Online_Appointments);
// }

public function getAppointments()
{
    $user = auth()->user();

    // Check if user is logged in and has a clinic_id
    if (!$user || !isset($user->clinic_id)) {
        return response()->json(['message' => 'Unauthorized or clinic ID not found'], 401);
    }

    // Fetch appointments where clinic_id matches logged-in user's clinic_id
    $appointments = Online_Appointments::where('clinic_id', $user->clinic_id)->get();

    return response()->json($appointments);
}
// public function getAppointments()
// {
//     $user = auth()->user();

//       $user = auth()->user();
// if ($user) {
//     Log::info("🧑 Logged-in User ID: " . $user->id);
// } else {
//     Log::warning("⚠️ No user is currently authenticated.");
// }


//     // 🛡️ Step 1: Auth check
//     if (!$user || !isset($user->clinic_id)) {
//         return response()->json(['message' => 'Unauthorized or clinic ID not found'], 401);
//     }

//     $clinicId = $user->clinic_id;

//     // ✅ Step 2: Get appointments for this clinic only
//     $appointments = Online_Appointments::where('clinic_id', $clinicId)->get();

//     // ✅ Step 3: Return JSON
//     return response()->json([
//         'clinic_id' => $clinicId,
//         'total_appointments' => $appointments->count(),
//         'appointments' => $appointments
//     ]);
    
// }



// __________________________________________________________________________________________


// public function getAppointmentByToken($tokan)
// {
//     $today = Carbon::today()->format('Y-m-d');

//     $appointment = Online_Appointments::where('tokan', $tokan)
//         ->where('date', $today)
//         ->first();

//     if (!$appointment) {
//         return response()->json(['message' => 'Appointment not found'], 404);
//     }

//     return response()->json($appointment);
// }
// public function getAppointmentByToken($tokan)
// {
//     $today = Carbon::today()->format('Y-m-d');

//     // Step 1: Fetch appointment by token and today's date
//     $appointment = Online_Appointments::where('tokan', $tokan)
//         ->where('date', $today)
//         ->first();

//     if (!$appointment) {
//         return response()->json(['message' => 'Appointment not found'], 404);
//     }

//     // Step 2: Extract last 10 digits of phone
//     $cleanPhone = substr(preg_replace('/\D/', '', $appointment->phone), -10);

//     // Step 3: Check if patient with that phone exists
//     $patient = Patient::where('phone', 'LIKE', "%$cleanPhone")->first();

//     // Step 4: Return response accordingly
//     if ($patient) {
//         return response()->json([
//             'appointment' => $appointment,
//             'patient_id' => $patient->id,
//             'patient' => $patient,
//         ]);
//     } else {
//         // Just appointment info if no match found
//         return response()->json([
//             'appointment' => $appointment,
//             'patient_id' => null,
//         ]);
//     }
// }
public function getAppointmentByToken($tokan)
{
    // Step 0: Check if user is logged in
    $user = auth()->user();
if ($user) {
    Log::info("🧑 Logged-in User ID: " . $user->id);
} else {
    Log::warning("⚠️ No user is currently authenticated.");
}

    if (!$user || !isset($user->clinic_id)) {
        return response()->json( [$user,'message' => 'Unauthorized'], 401);
    }

    $clinicId = $user->clinic_id;
    $doctorId = $user->id;
    $today = Carbon::today()->format('Y-m-d');

    // Step 1: Get today's appointment with matching clinic and token
    $appointment = Online_Appointments::where('tokan', $tokan)
        ->where('date', $today)
        ->where('clinic_id', $clinicId)
        ->first();

    if (!$appointment) {
        return response()->json(['message' => 'Appointment not found'], 404);
    }

    // Step 2: Clean the phone number to get last 10 digits
    $cleanPhone = substr(preg_replace('/\D/', '', $appointment->phone), -10);

    // Step 3: Find patient in same clinic AND created by same doctor
    $patient = Patient::where('clinic_id', $clinicId)
        ->where('doctor_id', $doctorId) // You can also use 'doctor_id' if your schema uses that
        ->where('phone', 'LIKE', "%$cleanPhone")
        ->first();

    // Step 4: Return response based on existence
    if ($patient) {
        return response()->json([
            'appointment' => $appointment,
            'patient_id' => $patient->id,
            'patient' => $patient,
            'is_existing_patient' => true
        ]);
    } else {
        return response()->json([
            'appointment' => $appointment,
            'patient_id' => null,
            'is_existing_patient' => false
        ]);
    }
}


 
 
    public function export(Request $request)
    {
        $start = $request->query('start_date');
        $end = $request->query('end_date');
 
        $query = Online_Appointments::query();
 
        if ($start && $end) {
            $query->whereBetween('date', [$start, $end]);
        }
 
        return response()->json($query->get());
   
}
}
 