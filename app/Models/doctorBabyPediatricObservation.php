<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class doctorBabyPediatricObservation extends Model
{
    use HasFactory;

    protected $table = 'doctor_baby_pediatric_observations';

    protected $fillable = [
        'doctor_id',
        'weightBaby',
        'heightBaby',
        'head_circumference',
        'temperature',
        'heart_rate',
        'respiratory_rate',
        'vaccinations_given',
        'milestones_achieved',
        'remarks',
    ];

    /**
     * Relationship with the doctor (User) model
     */
    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}
