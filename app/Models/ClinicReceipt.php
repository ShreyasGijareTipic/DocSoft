<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClinicReceipt extends Model
{
    use HasFactory;

    protected $table = 'clinic_receipts';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'clinic_id',
        'plan_id',
        'user_id',
        'valid_till',
        'total_amount',
        'transaction_id',
        'transaction_status'
    ];

    /**
     * Get the clinic that owns the receipt.
     */
    public function clinic()
    {
        return $this->belongsTo(Clinic::class, 'clinic_id', 'clinic_id');
    }

    /**
     * Get the plan associated with the receipt.
     */
    public function plan()
    {
        return $this->belongsTo(Plan::class, 'plan_id');
    }

    /**
     * Get the user associated with the receipt.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}