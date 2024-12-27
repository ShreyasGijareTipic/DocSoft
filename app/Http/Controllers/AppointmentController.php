<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\Timeslot;

use Illuminate\Database\Eloquent\ModelNotFoundException;

class AppointmentController extends Controller
{
    // Create a new appointment
    public function xyz(Request $request,$doctor_id)
    {
        try {
            $validatedData = $request->validate([
                'patient_name' => 'required|string|max:255',
                'patient_address' => 'required|string|max:500',
                'patient_contact' => 'required|string|max:15',
                'patient_email' => 'required|email|max:255',
                'patient_dob' => 'required|date',
                'appointment_date' => 'required|date',
                'appointment_time' => 'required|date_format:H:i:s',
            ]);
    
            $validatedData['doctor_id']=$doctor_id;
            $appointment = Appointment::create($validatedData);

            return response()->json([
                'message' => 'Appointment created successfully!',
                'appointment' => $appointment,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating appointment.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Fetch all appointments
    public function index()
    {
        $appointments = Appointment::where('status','!=',1)->get();

        return response()->json($appointments, 200);
    }

    // Show a specific appointment
    public function show($id)
    {
        try {
            $appointment = Appointment::findOrFail($id);

            return response()->json($appointment, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Appointment not found.',
            ], 404);
        }
    }

    // Update an existing appointment
    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'patient_name' => 'sometimes|required|string|max:255',
                'patient_address' => 'sometimes|required|string|max:500',
                'patient_contact' => 'sometimes|required|string|max:15',
                'patient_email' => 'sometimes|required|email|max:255',
                'patient_dob' => 'sometimes|required|date',
                'appointment_date' => 'sometimes|required|date',
                'appointment_time' => 'sometimes|required|date_format:H:i',
            ]);

            $appointment = Appointment::findOrFail($id);
            $appointment->update($validatedData);

            return response()->json([
                'message' => 'Appointment updated successfully!',
                'appointment' => $appointment,
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Appointment not found.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating appointment.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Delete an appointment
    public function destroy($id)
    {
        try {
            $appointment = Appointment::findOrFail($id);
            $appointment->delete();

            return response()->json([
                'message' => 'Appointment deleted successfully!',
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Appointment not found.',
            ], 404);
        }
    }



// Update Appointment Date and Time by ID
public function updateAppointment(Request $request,$id,$status)
{
    // Validate input data
    $request->validate([
        'date' => 'required|date',
        'time' => 'required|date_format:H:i:s',
    ]);

    // Find appointment by ID
    $appointment = Appointment::find($id);

    // Check if appointment exists
    if (!$appointment) {
        return response()->json(['error' => 'Appointment not found'], 404);
    }

    // Update the appointment date and time
    $appointment->appointment_date = $request->date;
    $appointment->appointment_time = $request->time;
    $appointment->status=$request->status;
    $appointment->save();

    // Return success response
    return response()->json(['message' => 'Appointment updated successfully', 'data' => $appointment], 200);
}





public function getAvailableTimeSlots($doctor_id,$selectedDate)
{

     // Fetch times for the given doctor_id
     $timeslots = Timeslot::where('doctor_id', $doctor_id)
     ->pluck('time') // Get only the 'time' column
     ->toArray();   // Convert to a plain array
    // Define the reference slots
    
 
    // Fetch booked slots for the selected date
    $bookedSlots = Appointment::where('appointment_date', $selectedDate)
        ->where('doctor_id',$doctor_id)
        ->where('status',1)
        ->pluck('appointment_time')
        ->toArray();
 
    // Calculate available slots by excluding booked slots from reference slots
    $availableSlots = array_diff($timeslots, $bookedSlots);
 
    // Return available slots
    return array_values($availableSlots); // Reindex the array
}





}
