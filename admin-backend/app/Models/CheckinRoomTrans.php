<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckinRoomTrans extends Model
{
    use HasFactory;

    protected $connection = 'mysql2';
    protected $table = 'checkin_room_trans';

    protected $fillable = [
        'checkin_id',
        'room_type_id',
        'room_id',
        'rate_plan_id',
        'guest_name',
        'contact',
        'male',
        'female',
        'extra',
        'net_rate',
        'disc_type',
        'disc_val',
        'total',
    ];

    public function checkin()
    {
        return $this->belongsTo(CheckinMaster::class, 'checkin_id');
    }

    public function roomType()
    {
        return $this->belongsTo(RoomTypeMaster::class, 'room_type_id');
    }

    public function room()
    {
        return $this->belongsTo(RoomMaster::class, 'room_id');
    }
}
