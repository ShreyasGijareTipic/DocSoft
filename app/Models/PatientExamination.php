<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientExamination extends Model
{
    use HasFactory;

    protected $table = 'patient_examinations';

    protected $fillable = [
        'bill_id',
        'bp',
        'pulse',
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
        return $this->belongsTo(Bill::class);
    }
}
