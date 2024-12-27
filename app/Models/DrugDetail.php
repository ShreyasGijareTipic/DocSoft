<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class DrugDetail extends Model
{
    use HasFactory;

    protected $table = 'drugs_details';

    protected $fillable = [
        'drug_id', 
        'dosage_form', 
        'strength', 
        'price', 
        'stock_quantity', 
        'expiration_date', 
        'side_effects', 
        'usage_instructions', 
        'storage_conditions'
    ];

    // Define the relationship to the Drug model
    // public function drug()
    // {
    //     return $this->belongsTo(Drug::class, 'drug_id'); // Make sure 'medicine_id' matches
    // }

    public function type()
    {
        return $this->belongTo(ExpenseType::class,'drugs_details');
    }
}
