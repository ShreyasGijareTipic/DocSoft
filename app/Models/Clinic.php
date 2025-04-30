<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clinic extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'clinic';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'clinic_name',
        'logo',
        'clinic_address',
        'clinic_registration_no',
        'clinic_mobile',
        'clinic_whatsapp_mobile',
        'clinic_whatsapp_url',
        'clinic_permanant_tokan',
        'clinic_webhook_tokan',
        'subscribed_plan',
        'subscription_validity',
        'refer_by_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        // 'clinic_permanant_tokan',
        // 'clinic_webhook_tokan',
    ];


    // public function users()
    // {
    //     return $this->hasMany(User::class, 'clinic_name'); // 'clinic_id' as the foreign key in the users table
    // }
}
