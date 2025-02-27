<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tokan extends Model
{
    use HasFactory;

    // Table name (if it's not the plural of the model name)
    protected $table = 'tokan';

    // Fillable attributes for mass assignment
    protected $fillable = [
        'clinic_id',
        'doctor_id',
        'patient_id',
        'tokan_number',
        'date',
        'status',
        'created_at',
        'updated_at',
    ];

    // Relationships
    // public function clinic()
    // {
    //     return $this->belongsTo(Clinic::class);
    // }

    // public function doctor()
    // {
    //     return $this->belongsTo(Doctor::class);
    // }

    // public function patient()
    // {
    //     return $this->belongsTo(Patient::class);
    // }

    // public function appointmentDetails()
    // {
    //     return $this->belongsTo(AppointmentDetails::class, 'appointment_id', 'id');
    // }


    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'id');
    }
    

}
