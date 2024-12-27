<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    // If the table name is not the default (plural of model name), specify it
    protected $table = 'appointments';

    // Allow mass assignment for these fields
    protected $fillable = [
        'patient_name',
        'patient_address',
        'patient_contact',
        'patient_email',
        'patient_dob',
        'appointment_date',
        'appointment_time',
    ];

    // If timestamps are not used in your table, disable them
    // public $timestamps = false;
}
