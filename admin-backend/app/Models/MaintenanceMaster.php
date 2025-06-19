<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceMaster extends Model
{
    use HasFactory;

    protected $connection = 'mysql2';
    protected $table = 'maintenance_master';
    protected $primaryKey = 'id';

    protected $fillable = [
        'issue_type',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function logs()
    {
        return $this->hasMany(RoomMaintenanceLog::class, 'maintenance_type_id');
    }
}