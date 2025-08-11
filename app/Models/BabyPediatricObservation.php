<?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class BabyPediatricObservation extends Model
// {
//     use HasFactory;
// }


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BabyPediatricObservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'p_p_i_id',
        'patient_id',
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
        'created_by',
    ];

    // Relationships
    public function bill()
    {
        return $this->belongsTo(Bill::class, 'p_p_i_id');
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

