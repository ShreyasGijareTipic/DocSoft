<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpareParts extends Model
{
    use HasFactory;
    protected $table = 'spare_parts';
    protected $primsryKey = 'id';
    public $timestamps = true;

 protected $fillable =[
    'description',
    'qty',
    'remark',
    'report_details_id',
    
 ];
protected $hidden = [
    'created_at' => 'datetime',
    'updated_at' => 'datetime',
];
protected $casts = [
    'created_at' => 'datetime',  // Optionally cast 'created_at' and 'updated_at' to datetime
    'updated_at' => 'datetime',

    ];

 



}



