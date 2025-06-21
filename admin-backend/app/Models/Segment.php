<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Segment extends Model
{
    use HasFactory;

    protected $connection = 'mysql2';
    protected $table = 'segment_master';  // Updated table name
    
    protected $fillable = [
        'segment_name'
    ];
    
    public function checkins()
    {
        return $this->hasMany(CheckinMaster::class, 'segment_id');
    }
}