<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Drug extends Model
{
    use HasFactory;

    protected $table = 'drugs';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'doctor_id',
        'drug_name',
        'generic_name',
        'category',
        'manufacturer',
    ];

    /**
     * Relationship with the User (Doctor).
     */
    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
    
    // Define the relationship to the DrugDetail model
    public function details()
    {
        return $this->hasMany(DrugDetail::class, 'drug_id'); // 'medicine_id' must match the foreign key in DrugDetail
    }

    

}
