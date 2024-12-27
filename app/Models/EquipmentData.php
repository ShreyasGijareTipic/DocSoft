<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipmentData extends Model
{
    use HasFactory;
    protected $table = 'equipment_data';
    protected $primsryKey = 'id';
    public $timestamps = true;

 
    protected $fillable = [
        'location',
        'equipment_name',
        'model',
        'brand_name',
        'serial_no',
        'show',
 
    ];
 
   
      // Optionally, you can define hidden fields
      protected $hidden = [
        'created_at' => 'date',
        'updated_at' => 'date',
    ];
    protected $casts = [
        'created_at' => 'date',  // Optionally cast 'created_at' and 'updated_at' to datetime
        'updated_at' => 'date',
 
        ];
}
