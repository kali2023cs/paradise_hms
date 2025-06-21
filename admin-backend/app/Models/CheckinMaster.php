<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckinMaster extends Model
{
    use HasFactory;

    protected $connection = 'mysql2';
    protected $table = 'checkin_master';

    // Add these properties to automatically cast datetime fields
    protected $dates = [
        'check_in_datetime',
        'check_out_datetime',
        'created_at',
        'updated_at',
    ];

    // Alternatively, you can use $casts for more precise control
    protected $casts = [
        'check_in_datetime' => 'datetime',
        'check_out_datetime' => 'datetime',
        'is_vip' => 'boolean',
        'late_checkout' => 'boolean',
        'allow_credit' => 'boolean',
        'foreign_guest' => 'boolean',
        'allow_charges_posting' => 'boolean',
        'enable_paxwise' => 'boolean',
        'enable_room_sharing' => 'boolean',
    ];

    protected $fillable = [
        'is_reservation',
        'reservation_number',
        'arrival_mode',
        'ota',
        'booking_id',
        'contact',
        'title',
        'first_name',
        'last_name',
        'gender',
        'city',
        'id_number',
        'email',
        'check_in_mode',
        'allow_credit',
        'foreign_guest',
        'segment_id',
        'business_source_id',
        'photo',
        'document',
        'gst_number',
        'guest_company',
        'age',
        'gst_type',
        'address',
        'visit_remark',
        'pin_code',
        'nationality',
        'booking_instructions',
        'guest_special_instructions',
        'is_vip',
        'check_in_type',
        'check_in_datetime',
        'number_of_days',
        'check_out_datetime',
        'grace_hours',
        'payment_by',
        'allow_charges_posting',
        'enable_paxwise',
        'enable_room_sharing',
    ];

    public function rooms()
    {
        return $this->hasMany(CheckinRoomTrans::class, 'checkin_id');
    }

    public function segment()
    {
        return $this->belongsTo(Segment::class, 'segment_id');
    }
}