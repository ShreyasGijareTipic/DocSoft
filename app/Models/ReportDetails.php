<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportDetails extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_id',
        'created_by',
        'nature_complaint',
        'actual_fault',
        'action_taken',
        'remark',
        'customer_suggestion',
        'signature_by',
        'signature'
    ];

    public function report()
    {
        return $this->belongsTo(Report::class);
    }
}
