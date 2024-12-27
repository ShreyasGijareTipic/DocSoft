<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
 
class Appointment extends Model
{
    use HasFactory;
    protected $table = 'appointments';
    protected $fillable = [
        'patient_name',
        'patient_address',
        'patient_contact',
        'patient_email',
        'patient_dob',
        'appointment_date',
        'appointment_time',
        'status',
        'doctor_id'
    ];
}