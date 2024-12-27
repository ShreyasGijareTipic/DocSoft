<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;
    protected $table = 'customer_info';

    // The primary key associated with the table
    protected $primaryKey = 'id';

    // Indicates if the model should be timestamped
    public $timestamps = true;

    // Define the fillable fields (mass assignable)
    protected $fillable = [
        'customer_name',
        'address',
        'contact_person',
        'email',
        'mobile',
        'block',
        'show',
        'updated_by',
        'created_by',
        'deleted_by',
    ];

    // Optionally, you can define hidden fields
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    // Optionally, you can define casts
    protected $casts = [
        'show' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


    
}
