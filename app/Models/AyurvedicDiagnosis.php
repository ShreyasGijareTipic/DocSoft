<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AyurvedicDiagnosis extends Model
{
    use HasFactory;

     protected $fillable = [
        'p_p_i_id',
         'patient_id',
        'occupation',
        'pincode',
        'email',
        'ayurPastHistory',
        'prasavvedan_parikshayein',
        'habits',
        'lab_investigation',
        'personal_history',
        'food_and_drug_allergy',
        'lmp',
        'edd',
    ];

  public function prescriptionPatientInfo()
    {
        return $this->belongsTo(PrescriptionPatientInfo::class, 'p_p_i_id');
    }

}
