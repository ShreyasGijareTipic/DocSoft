<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientExamination extends Model
{
    use HasFactory;

    protected $table = 'patient_examinations';

    protected $fillable = [
        'p_p_i_id',
        'patient_id', 
        'bp',
        'pulse',
        'height',
        'weight',
        'past_history',
        'complaints',
        'systemic_exam_general',
        'systemic_exam_pa',
    ];

    /**
     * Define the relationship with the Bill model.
     */
    public function bill()
    {
        return $this->belongsTo(PrescriptionPatientInfo::class);
    }
}
