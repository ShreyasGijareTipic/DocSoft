<?php
 
namespace App\Http\Controllers;
 
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
 
    public function getAppointments()
{
    $Online_Appointments = Online_Appointments::all(); // Fetches all records
 
    return response()->json($Online_Appointments);
}

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
public function getAppointmentByToken($tokan)
{
    $today = Carbon::today()->format('Y-m-d');

    // Step 1: Fetch appointment by token and today's date
    $appointment = Online_Appointments::where('tokan', $tokan)
        ->where('date', $today)
        ->first();

    if (!$appointment) {
        return response()->json(['message' => 'Appointment not found'], 404);
    }

    // Step 2: Extract last 10 digits of phone
    $cleanPhone = substr(preg_replace('/\D/', '', $appointment->phone), -10);

    // Step 3: Check if patient with that phone exists
    $patient = Patient::where('phone', 'LIKE', "%$cleanPhone")->first();

    // Step 4: Return response accordingly
    if ($patient) {
        return response()->json([
            'appointment' => $appointment,
            'patient_id' => $patient->id,
            'patient' => $patient,
        ]);
    } else {
        // Just appointment info if no match found
        return response()->json([
            'appointment' => $appointment,
            'patient_id' => null,
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
 