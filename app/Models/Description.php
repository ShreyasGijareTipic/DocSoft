<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Description extends Model
{
    use HasFactory;

    protected $table = 'descriptions';
    
    protected $fillable = [
        'bill_id',
        'description',
        'quantity',
        'price',
        'gst',
        'total',
       
    ];
    public function type()
    {
        return $this->belongTo(ExpenseType::class,'descriptions');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    // Optionally, hide the password from arrays and JSON responses
   

    
}
