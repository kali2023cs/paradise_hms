<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceStatusMaster extends Model
{
    use HasFactory;

    protected $connection = 'mysql2';
    protected $table = 'maintenance_status_master';
    protected $primaryKey = 'id';

    protected $fillable = [
        'status_name',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function logs()
    {
        return $this->hasMany(RoomMaintenanceLog::class, 'maintenance_status_id');
    }
}