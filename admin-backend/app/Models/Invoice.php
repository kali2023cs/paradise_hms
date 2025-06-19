<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $connection = 'mysql2';
    protected $table = 'invoices';
    
    protected $fillable = [
        'invoice_number', 'checkout_id', 'invoice_date', 'due_date',
        'status', 'subtotal', 'tax_amount', 'total_amount',
        'amount_paid', 'balance_due', 'notes', 'terms'
    ];
    
    protected $casts = [
        'invoice_date' => 'datetime',
        'due_date' => 'datetime',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'balance_due' => 'decimal:2',
    ];
    
    // Status constants with shorter values if needed
    const STATUS_PAID = 'Paid';
    const STATUS_PARTIAL = 'Partial';
    const STATUS_PENDING = 'Pending';
    const STATUS_OVERDUE = 'Overdue';
    const STATUS_CANCELLED = 'Cancelled';

    public function checkout()
    {
        return $this->belongsTo(CheckoutMaster::class, 'checkout_id');
    }
    
    public function items()
    {
        return $this->hasMany(InvoiceItem::class, 'invoice_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($invoice) {
            // Ensure status is one of the allowed values
            $invoice->status = in_array($invoice->status, [
                self::STATUS_PAID,
                self::STATUS_PARTIAL,
                self::STATUS_PENDING,
                self::STATUS_OVERDUE,
                self::STATUS_CANCELLED
            ]) ? $invoice->status : self::STATUS_PENDING;
        });
    }
}