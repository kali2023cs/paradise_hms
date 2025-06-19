<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CleaningStatusMaster extends Model
{
    use HasFactory;

    protected $connection = 'mysql2';
    protected $table = 'cleaning_status_master';

    protected $fillable = [
        'status_name',
        'is_active',
    ];

    public $timestamps = true;

    // Optional: relationship with cleaning logs
    public function cleaningLogs()
    {
        return $this->hasMany(RoomCleaningLog::class, 'status_id');
    }
}
