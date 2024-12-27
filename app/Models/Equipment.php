<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    use HasFactory;
    protected $table = 'equipment';
    protected $primsryKey = 'id';
    public $timestamps = true;

   
        protected $fillable = [
            'location',
            'equipment_name',
            'brand_name',
            'model',
            'serial_no',
            'show',
    ];
      // Optionally, you can define hidden fields
      protected $hidden = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    protected $casts = [

        'created_at' => 'datetime',  // Optionally cast 'created_at' and 'updated_at' to datetime
        'updated_at' => 'datetime',

        ];
        protected $attributes = [
            'show' => 1,
        ];

}
