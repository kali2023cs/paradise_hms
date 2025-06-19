<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RoomTypeMaster extends Model
{
    use SoftDeletes;

    protected $table = 'roomtype_master';

    protected $connection = 'mysql2';
    protected $fillable = [
        'room_type_code',
        'room_type_name',
        'description',
        'default_plan_id',
        'display_order',
        'wifi_plan_id',
        'max_adult_pax',
        'max_child_pax',
        'max_extra_pax',
        'negative_count',
        'roomtype_status',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $dates = ['deleted_at'];

    public function defaultPlan()
    {
        return $this->belongsTo(Plan::class, 'default_plan_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function deleter()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}
