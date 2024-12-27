<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{   use HasFactory;

    protected $table = 'reports';
    protected $primaryKey = 'id';  // Corrected typo in primaryKey
    public $timestamps = true; 

    protected $fillable = [
        'customer_id',
        'customer_name',
        'address',
        'contact_person',
        'email',
        'mobile',
        'equipment_id',
        'location',
        'equipment_name',
        'serial_no',
        'model',
        'brand_name',
        'call_type',
        'closed',
        'created_by',
        'assigned_by',
        'assigned_to',
        'updated_by',
    ];
    protected $hidden = [
          // Correct hidden attributes format
        'updated_at',
    ];
    protected $casts = [
        'created_at' => 'datetime',  // Optionally cast 'created_at' and 'updated_at' to datetime
        'updated_at' => 'datetime',
    ];
}
