<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorAyurvedicObservation extends Model
{
    use HasFactory;

     protected $fillable = [
        'doctor_id',
        'occupation',
        'pincode',
        'email',
        'past_history',
        'prasavvedan_parikshayein',
        'habits',
        'lab_investigation',
        'personal_history',
        'food_and_drug_allergy',
        'lmp',
        'edd',
    ];


public function ayurvedicObservations()
{
    return $this->hasOne(DoctorAyurvedicObservation::class, 'doctor_id');
}


}
