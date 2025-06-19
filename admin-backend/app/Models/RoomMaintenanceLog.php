<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomMaintenanceLog extends Model
{
    use HasFactory;

    protected $connection = 'mysql2';
    protected $table = 'room_maintenance_logs';
    protected $primaryKey = 'id';

    protected $fillable = [
        'room_id',
        'maintenance_type_id',
        'maintenance_status_id',
        'issue_description',
        'reported_by',
        'started_at',
        'resolved_at',
        'remarks'
    ];

    protected $dates = [
        'started_at',
        'resolved_at',
        'created_at',
        'updated_at'
    ];

    public function room()
    {
        return $this->belongsTo(RoomMaster::class, 'room_id');
    }

    public function maintenanceType()
    {
        return $this->belongsTo(MaintenanceMaster::class, 'maintenance_type_id');
    }

    public function status()
    {
        return $this->belongsTo(MaintenanceStatusMaster::class, 'maintenance_status_id');
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }
}