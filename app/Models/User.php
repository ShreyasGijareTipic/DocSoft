<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

        /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'logo',
        'clinic_id',
        'name',
        'email',
        'mobile',
        'address',
        'registration_number',
        'speciality',
        'education',
        'consulting_fee',
        'type',
        'profilepic',
        'blocked',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


//     public function clinic()
// {
//     return $this->belongsTo(Clinic::class, 'clinic_name'); // Use 'clinic_id' as the foreign key
// }
public function patients()
{
    return $this->hasMany(Patient::class, 'doctor_id');
}

public function medicalObservations()
{
    return $this->hasOne(DoctorMedicalObservation::class, 'doctor_id');
}

public function clinic()
{
    return $this->belongsTo(Clinic::class, 'clinic_id');
}

}

