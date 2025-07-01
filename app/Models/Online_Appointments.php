<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Online_Appointments extends Model
{
    protected $table = 'online_appointments'; // NOT 'online__appointments'

    protected $fillable = ['name', 'service', 'date', 'time', 'phone','status','tokan'];
    use HasFactory;
    
    public function patient()
{
    return $this->belongsTo(Patient::class, 'patient_id'); // Adjust if different key name
}

}
