<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthDirective extends Model
{
    use HasFactory;

    protected $table = 'health_directives'; // Explicitly define the table name (optional if following convention)

    protected $fillable = [
        'bill_id', 
        'medicine', 
        'strength',
        'dosage', 
        'timing', 
        'frequency', 
        'duration'
    ];

    // Define the relationship with the Bill model
    public function bill()
    {
        return $this->belongsTo(Bill::class, 'bill_id'); // Foreign key 'bill_id' references 'id' on 'bills' table
    }
}
