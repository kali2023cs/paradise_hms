<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FloorMaster extends Model
{
    use SoftDeletes;

    protected $connection = 'mysql2';
    protected $table = 'floor_master';

    protected $fillable = [
        'floor_no',
        'floor_name',
        'block_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $dates = [
        'deleted_at',
    ];

    public function block()
    {
        return $this->belongsTo(BlockMaster::class, 'block_id');
    }

}
