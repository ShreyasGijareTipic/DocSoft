<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;
    protected $fillable = [
        'clinic_id',
        // 'selcted_doctor_id',
        'name',
        'email',
        // 'contact_number',
        'phone',
        'address',
        'dob',
        // 'gender',
    ];
}
