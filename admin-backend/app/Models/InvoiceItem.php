<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    protected $connection = 'mysql2';
    protected $table = 'invoice_items';
    
    protected $fillable = [
        'invoice_id', 'item_type', 'description',
        'quantity', 'unit_price', 'tax_rate', 'amount'
    ];
    
    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }
}