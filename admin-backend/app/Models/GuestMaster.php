<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GuestMaster extends Model
{
    use SoftDeletes;

    protected $connection = 'mysql2';
    protected $table = 'guest_master';

    protected $fillable = [
        'title_id',
        'first_name',
        'last_name',
        'gender',
        'date_of_birth',
        'email',
        'phone',
        'mobile',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'id_type',
        'id_number',
        'id_document',
        'nationality',
        'profile_photo',
        'company_name',
        'company_address',
        'gst_number',
        'gst_type',
        'is_vip',
        'vip_level',
        'preferences',
        'remarks',
        'blacklist_reason',
        'is_blacklisted',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'is_vip' => 'boolean',
        'is_blacklisted' => 'boolean',
        'preferences' => 'array',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    // Relationships (Example: if you have user table for created_by, updated_by)
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
