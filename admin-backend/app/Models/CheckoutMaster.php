<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CheckoutMaster extends Model
{
    protected $connection = 'mysql2';
    protected $table = 'checkout_master';
    
    protected $fillable = [
        'checkin_id','check_room_id', 'actual_checkout_datetime', 'early_checkout', 'late_checkout',
        'checkout_remarks', 'payment_status', 'total_amount', 'tax_amount',
        'discount_amount', 'grand_total', 'amount_paid', 'balance_due', 'created_by'
    ];
    
    protected $casts = [
        'actual_checkout_datetime' => 'datetime',
        'early_checkout' => 'boolean',
        'late_checkout' => 'boolean',
    ];
    
    public function checkin()
    {
        return $this->belongsTo(CheckinMaster::class, 'checkin_id');
    }
    
    public function payments()
    {
        return $this->hasMany(CheckoutPayment::class, 'checkout_id');
    }
    
    public function invoice()
    {
        return $this->hasOne(Invoice::class, 'checkout_id');
    }
}