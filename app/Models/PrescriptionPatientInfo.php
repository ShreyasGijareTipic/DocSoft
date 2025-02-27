<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrescriptionPatientInfo extends Model
{
    use HasFactory;

    protected $table = 'prescription_patient_info';

    protected $fillable = [
        'doctor_id',
        'patient_name',
        'patient_address',
        'patient_email',
        'patient_contact',
        'patient_dob',
        'doctor_name',
        'registration_number',
        'visit_date',
        'grand_total',
    ];


    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    } 
    
    public function patientExamonations()
    {
        return $this->hasMany(PatientExamonations::class);
    }
    
    public function healthDirectives()
    {
        return $this->hasMany(HealthDirective::class);
    }

}
