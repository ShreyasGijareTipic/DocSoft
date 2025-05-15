<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorMedicalObservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'bp',
        'pulse',
        'weight',
        'height',
        'systemic_examination',
        'diagnosis',
        'past_history',
        'complaint'
    ];

    /**
     * Cast attributes to their native types
     */
    protected $casts = [
        'bp' => 'boolean',
        'pulse' => 'boolean',
        'weight' => 'boolean',
        'height' => 'boolean',
        'systemic_examination' => 'boolean',
        'diagnosis' => 'boolean',
        'past_history' => 'boolean',
        'complaint' => 'boolean',
    ];

    /**
     * Get the doctor that owns these medical observation settings
     */
    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}