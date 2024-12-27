<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable=[
        'customerName',
        'customerAddress',
        'customerMobile',
        'finalAmount',
        'totalAmount',
        'paidAmount',
        'discount',
        'paymentType',
        'invoiceType',
        'orderStatus',
        'deliveryDate',
        'invoiceDate',
        'show'
    ];

    /**
     * Get the item.
     */
    public function items()
    {
        return $this->hasMany(OrderDetail::class);
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
}
