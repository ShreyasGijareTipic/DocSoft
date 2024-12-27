<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceReport extends Model
{
    use HasFactory;

    protected $table = 'service_reports';
    protected $primaryKey = 'id';  // Corrected typo in primaryKey
    public $timestamps = true;

    protected $fillable = [
        'serial_no',
        'call_type',
        'nature_complaint',
        'actual_fault',
        'action_taken',
        'customer_suggestion',
        'status',
        'customer_name',
        'address',
        'email',
        'contact_person',
        'mobile',
        'updated_by',
        'model',
        'company_name',
        'type',
        'subtype',
        'equipment_id',
        'user_id',
        'customer_id',
    ];

    protected $hidden = [
        'created_at',  // Correct hidden attributes format
        'updated_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',  // Optionally cast 'created_at' and 'updated_at' to datetime
        'updated_at' => 'datetime',
    ];
}



