<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;
    protected $fillable = [
        'clinic_id',
       'doctor_id' ,
        // 'selcted_doctor_id',
        'name',
        'email',
        // 'contact_number',
        'phone',
        'address',
        'dob',
        // 'gender',
    ];
    public function doctor()
{
    return $this->belongsTo(User::class, 'doctor_id');
}



}
