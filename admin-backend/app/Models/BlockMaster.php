<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlockMaster extends Model
{
    use SoftDeletes;
    
    protected $connection = 'mysql2';
    protected $table = 'block_master';

    protected $fillable = [
        'block_no',
        'block_name',
    ];

    protected $dates = [
        'deleted_at',
    ];
}
