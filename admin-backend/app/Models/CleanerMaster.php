<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CleanerMaster extends Model
{
    use HasFactory;

    protected $connection = 'mysql2';
    protected $table = 'cleaner_master';

    protected $fillable = [
        'name',
        'phone',
        'shift',
        'is_active',
    ];

    public $timestamps = true;

    // Optional: relationship with cleaning logs
    public function cleaningLogs()
    {
        return $this->hasMany(RoomCleaningLog::class, 'cleaner_id');
    }
}
