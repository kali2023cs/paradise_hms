<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomCleaningLog extends Model
{
    use HasFactory;

    protected $connection = 'mysql2';
    protected $table = 'room_cleaning_logs';

    protected $fillable = [
        'room_id',
        'cleaner_id',
        'status_id',
        'remarks',
        'started_at',
        'completed_at',
    ];

    // Relationships (optional, but useful if you want cleaner/room/status info)
    public function room()
    {
        return $this->belongsTo(RoomMaster::class, 'room_id');
    }

    public function cleaner()
    {
        return $this->belongsTo(CleanerMaster::class, 'cleaner_id');
    }

    public function status()
    {
        return $this->belongsTo(CleaningStatusMaster::class, 'status_id');
    }
}
