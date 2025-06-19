<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RoomStatusMaster extends Model
{
    use SoftDeletes;

    protected $connection = 'mysql2';
    protected $table = 'roomstatus_master';

    protected $fillable = [
        'status_code',
        'status_name',
        'created_by',
        'updated_by',
        'deleted_by',
    ];
}
