<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BlockRoom extends Model
{
    use HasFactory;
    
    protected $connection = 'mysql2';
    protected $table = 'block_rooms';

    protected $primaryKey = 'id';

    public $timestamps = false; // since the table uses a custom timestamp column

    protected $fillable = [
        'room_id',
        'status_id',
        'reason',
        'fromdatetime',
        'todatetime',
        'blocked_by',
        'timestamp',
    ];

    protected $casts = [
        'fromdatetime' => 'datetime',
        'todatetime' => 'datetime',
        'timestamp' => 'datetime',
    ];

    public function blockedBy()
    {
        return $this->belongsTo(User::class, 'blocked_by');
    }
}
