<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactUs extends Model
{
    use HasFactory;

    // Specify the table name if it's different from the plural of the model name
    protected $table = 'contact_us';

    // Define the fillable properties to allow mass assignment
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'mobile',
        'location',
        'vehicle_category',
        'vehicle_registration_number',
    ];
}
