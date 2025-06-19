<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Plan extends Model
{
    use SoftDeletes;

    protected $connection = 'mysql2';
    protected $table = 'plans';

    protected $fillable = [
        'plan_name',
        'description',
        'rate_per_day',
        'apply_gst',
        'apply_gst_on_sum',
        'apply_luxury_tax',
        'apply_service_tax',
        'complimentary_wifi',
        'complimentary_breakfast',
        'complimentary_lunch',
        'complimentary_dinner',
        'status',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
