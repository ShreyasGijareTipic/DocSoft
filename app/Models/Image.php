<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
use HasFactory;
    protected $table = 'images_table';
    protected $primaryKey = 'id';  // Corrected typo in primaryKey
    public $timestamps = true;
protected $fillable = [
    'name',
    'image',

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


}
