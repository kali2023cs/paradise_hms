<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RoomMaster extends Model
{
    use SoftDeletes;

    protected $connection = 'mysql2';
    protected $table = 'room_master';

    protected $fillable = [
        'room_no',
        'display_order',
        'floor_id',
        'room_type_id',
        'max_pax',
        'max_extra_pax',
        'status_id',
        'checkin_id',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public function floor()
    {
        return $this->belongsTo(FloorMaster::class, 'floor_id');
    }

    public function roomType()
    {
        return $this->belongsTo(RoomTypeMaster::class, 'room_type_id');
    }

    public function status()
    {
        return $this->belongsTo(RoomStatusMaster::class, 'status_id');
    }
}

