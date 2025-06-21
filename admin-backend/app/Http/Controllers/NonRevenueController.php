<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;
use App\Models\RoomMaster;
use App\Models\BlockMaster;
use App\Models\FloorMaster;
use App\Models\CheckinRoomTrans;
use App\Models\BlockRoom;
use App\Models\Users;
use App\Models\RoomCleaningLog;
use App\Models\CleanerMaster;
use App\Models\CleaningStatusMaster;
use App\Models\RoomMaintenanceLog;
use App\Models\MaintenanceMaster;
use App\Models\MaintenanceStatusMaster;
use App\Models\CheckinMaster;
use Illuminate\Support\Facades\DB; 

class NonRevenueController extends Controller
{
    public function generatePoliceReport(Request $request)
    {
        // Validate the request parameters
        $request->validate([
            'fromdate' => 'required|integer',
            'todate' => 'required|integer',
            'purpose' => 'required|string',
            'type' => 'required|string'
        ]);

        $fromDate = Carbon::createFromTimestamp($request->input('fromdate'))->startOfDay();
        $toDate = Carbon::createFromTimestamp($request->input('todate'))->endOfDay();
        $purpose = $request->input('purpose');
        $type = $request->input('type');

        try {
            if ($type === 'checkin') {
                $records = DB::connection('mysql2')->table('checkin_master')
                    ->select(
                        'checkin_master.*',
                        'arrival_mode.mode_name',
                        'title_master.title_name',
                        'checkin_room_trans.room_id',
                        'checkin_room_trans.male',
                        'checkin_room_trans.female',
                        'checkin_room_trans.extra',
                        'checkin_room_trans.guest_name',
                        'checkin_room_trans.contact as contact_no',
                        'room_master.room_no',
                        'roomtype_master.room_type_name'
                    )
                    ->join('title_master', 'title_master.id', '=', 'checkin_master.title')
                    ->join('arrival_mode', 'arrival_mode.id', '=', 'checkin_master.arrival_mode')
                    ->leftJoin('checkin_room_trans', 'checkin_room_trans.checkin_id', '=', 'checkin_master.id')
                    ->leftJoin('room_master', 'room_master.id', '=', 'checkin_room_trans.room_id')
                    ->leftJoin('roomtype_master', 'roomtype_master.id', '=', 'checkin_room_trans.room_type_id')
                    ->whereBetween('checkin_master.check_in_datetime', [$fromDate, $toDate])
                    ->get();
            } else {
                $records = DB::connection('mysql2')->table('checkout_master')
                    ->select('checkout_master.*', 'checkin_room_trans.guest_name','checkin_room_trans.male','checkin_room_trans.female','checkin_room_trans.contact as contact_no','checkin_room_trans.extra','room_master.room_no','arrival_mode.mode_name','roomtype_master.room_type_name','checkin_master.check_in_datetime','checkin_master.check_out_datetime')
                    ->join('checkin_master', 'checkin_master.id', '=', 'checkout_master.checkin_id')
                    ->join('checkin_room_trans', 'checkin_room_trans.id', '=', 'checkout_master.check_room_id')
                    ->leftJoin('room_master', 'room_master.id', '=', 'checkin_room_trans.room_id')
                    ->join('arrival_mode', 'arrival_mode.id', '=', 'checkin_master.arrival_mode')
                    ->leftJoin('roomtype_master', 'roomtype_master.id', '=', 'checkin_room_trans.room_type_id')
                    ->whereBetween('checkout_master.actual_checkout_datetime', [$fromDate, $toDate])
                    ->get();
            }

            return response()->json([
                'success' => true,
                'records' => $records
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate police report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function generateCheckInOutReport(Request $request) {
        $request->validate([
            'fromdate' => 'required|integer',
            'todate' => 'required|integer',
            'purpose' => 'required|string',
            'type' => 'required|string'
        ]);

        $fromDate = Carbon::createFromTimestamp($request->input('fromdate'))->startOfDay();
        $toDate = Carbon::createFromTimestamp($request->input('todate'))->endOfDay();
        $purpose = $request->input('purpose');
        $type = $request->input('type');

        try {
            $fromDate = Carbon::createFromTimestamp($request->fromdate);
            $toDate = Carbon::createFromTimestamp($request->todate);
            
            if ($type === 'checkin') {
                $records = DB::connection('mysql2')->table('checkin_master')
                    ->select(
                        'checkin_master.*',
                        'arrival_mode.mode_name',
                        'title_master.title_name',
                        'checkin_room_trans.room_id',
                        'checkin_room_trans.male',
                        'checkin_room_trans.female',
                        'checkin_room_trans.extra',
                        'checkin_room_trans.guest_name',
                        'checkin_room_trans.contact as contact_no',
                        'room_master.room_no',
                        'roomtype_master.room_type_name'
                    )
                    ->join('title_master', 'title_master.id', '=', 'checkin_master.title')
                    ->join('arrival_mode', 'arrival_mode.id', '=', 'checkin_master.arrival_mode')
                    ->leftJoin('checkin_room_trans', 'checkin_room_trans.checkin_id', '=', 'checkin_master.id')
                    ->leftJoin('room_master', 'room_master.id', '=', 'checkin_room_trans.room_id')
                    ->leftJoin('roomtype_master', 'roomtype_master.id', '=', 'checkin_room_trans.room_type_id')
                    ->whereBetween('checkin_master.check_in_datetime', [$fromDate, $toDate])
                    ->get();
            } else {
                $records = DB::connection('mysql2')->table('checkout_master')
                    ->select('checkout_master.*', 'checkin_room_trans.guest_name','checkin_room_trans.male','checkin_room_trans.female','checkin_room_trans.contact as contact_no','checkin_room_trans.extra','room_master.room_no','arrival_mode.mode_name','roomtype_master.room_type_name','checkin_master.check_in_datetime','checkin_master.check_out_datetime')
                    ->join('checkin_master', 'checkin_master.id', '=', 'checkout_master.checkin_id')
                    ->join('checkin_room_trans', 'checkin_room_trans.id', '=', 'checkout_master.check_room_id')
                    ->leftJoin('room_master', 'room_master.id', '=', 'checkin_room_trans.room_id')
                    ->join('arrival_mode', 'arrival_mode.id', '=', 'checkin_master.arrival_mode')
                    ->leftJoin('roomtype_master', 'roomtype_master.id', '=', 'checkin_room_trans.room_type_id')
                    ->whereBetween('checkout_master.actual_checkout_datetime', [$fromDate, $toDate])
                    ->get();
            }

            return response()->json([
                'success' => true,
                'records' => $records,
                'hotelDetails' => [
                    'name' => env('HOTEL_NAME', 'My Hotel'),
                    'address' => env('HOTEL_ADDRESS', '123 Main St')
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Report generation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function generateRoomsReport(Request $request)
{
    // Validate the request parameters
    $request->validate([
        'statuses' => 'sometimes|array',
        'includeInactive' => 'sometimes|boolean'
    ]);

    $statuses = $request->input('statuses', []);
    $includeInactive = $request->input('includeInactive', false);

    try {
        $query = DB::connection('mysql2')->table('room_master')
            ->select(
                'room_master.*',
                'roomtype_master.room_type_name',
                'roomstatus_master.status_name',
                'floor_master.floor_name'
            )
            ->leftJoin('roomtype_master', 'roomtype_master.id', '=', 'room_master.room_type_id')
            ->leftJoin('roomstatus_master', 'roomstatus_master.id', '=', 'room_master.status_id')
            ->leftJoin('floor_master', 'floor_master.id', '=', 'room_master.floor_id');

        // Apply status filters if any
        if (!empty($statuses)) {
            $query->whereIn('roomstatus_master.status_name', $statuses);
        }

        // Filter active/inactive rooms
        if (!$includeInactive) {
            $query->where('room_master.is_active', true);
        }

        $records = $query->get();
        
        // Generate summary counts
        $summary = [
            'total_rooms' => $records->count(),
            'active_rooms' => $records->where('is_active', true)->count(),
            'inactive_rooms' => $records->where('is_active', false)->count(),
        ];
        
        // Add status counts to summary
        $statusCounts = $records->groupBy('status_name')->map->count();
        foreach ($statusCounts as $status => $count) {
            $summary[$status] = $count;
        }

        return response()->json([
            'success' => true,
            'records' => $records,
            'summary' => $summary
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to generate rooms report',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function getBlocks()
    {
        try {
            $blocks = BlockMaster::select('id', 'block_name', 'block_no')->get();
            return response()->json($blocks);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch blocks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getFloors(Request $request)
    {
        $blockId = $request->input('block_id');
        
        $query = FloorMaster::with('block');
        
        if ($blockId) {
            $query->where('block_id', $blockId);
        }
        
        return $query->get();
    }

   public function generate(Request $request)
    {
        $request->validate([
            'report_date' => 'required|date',
            'block_id' => 'nullable|integer',
            'floor_id' => 'nullable|integer'
        ]);

        $reportDate = Carbon::parse($request->report_date)->format('Y-m-d');
        // $blockId = $request->block_id;
        // $floorId = $request->floor_id;

        $query = DB::connection('mysql2')->table('room_master as rm')
            ->select(
                'rm.id as room_id',
                'rm.room_no',
                'f.block_id',
                'b.block_name',
                'rm.floor_id',
                'f.floor_name',
                'rm.room_type_id',
                'rt.room_type_name',
                'rs.status_name as room_status',
                DB::raw('(SELECT csm.status_name FROM room_cleaning_logs cl 
                        JOIN cleaning_status_master csm ON cl.status_id = csm.id 
                        WHERE cl.room_id = rm.id 
                        AND (DATE(cl.completed_at) <= ? OR cl.completed_at IS NULL)
                        ORDER BY cl.id DESC LIMIT 1) as cleaning_status'),
                DB::raw('(SELECT mm.issue_type FROM room_maintenance_logs ml 
                        JOIN maintenance_master mm ON ml.maintenance_type_id = mm.id 
                        WHERE ml.room_id = rm.id 
                        AND (DATE(ml.resolved_at) >= ? OR ml.resolved_at IS NULL)
                        ORDER BY ml.id DESC LIMIT 1) as maintenance_status'),
                DB::raw('(SELECT crt.guest_name FROM checkin_room_trans crt
                        JOIN checkin_master ci ON crt.checkin_id = ci.id
                        WHERE crt.room_id = rm.id
                        AND DATE(ci.check_in_datetime) <= ?
                        AND DATE(ci.check_out_datetime) >= ?
                        LIMIT 1) as guest_name'),
                DB::raw('(SELECT crt.contact FROM checkin_room_trans crt
                        JOIN checkin_master ci ON crt.checkin_id = ci.id
                        WHERE crt.room_id = rm.id
                        AND DATE(ci.check_in_datetime) <= ?
                        AND DATE(ci.check_out_datetime) >= ?
                        LIMIT 1) as guest_contact'),
                DB::raw('(SELECT ci.check_in_datetime FROM checkin_room_trans crt
                        JOIN checkin_master ci ON crt.checkin_id = ci.id
                        WHERE crt.room_id = rm.id
                        AND DATE(ci.check_in_datetime) <= ?
                        AND DATE(ci.check_out_datetime) >= ?
                        LIMIT 1) as check_in_date'),
                DB::raw('(SELECT ci.check_out_datetime FROM checkin_room_trans crt
                        JOIN checkin_master ci ON crt.checkin_id = ci.id
                        WHERE crt.room_id = rm.id
                        AND DATE(ci.check_in_datetime) <= ?
                        AND DATE(ci.check_out_datetime) >= ?
                        LIMIT 1) as check_out_date'),
                DB::raw('(SELECT br.reason FROM block_rooms br
                        WHERE br.room_id = rm.id
                        AND DATE(br.fromdatetime) <= ?
                        AND DATE(br.todatetime) >= ?
                        LIMIT 1) as block_reason')
            )
            ->join('floor_master as f', 'rm.floor_id', '=', 'f.id')
            ->join('block_master as b', 'f.block_id', '=', 'b.id')
            ->join('roomtype_master as rt', 'rm.room_type_id', '=', 'rt.id')
            ->join('roomstatus_master as rs', 'rm.status_id', '=', 'rs.id');
            // ->when($blockId, function ($query) use ($blockId) {
            //     return $query->where('f.block_id', $blockId);
            // })
            // ->when($floorId, function ($query) use ($floorId) {
            //     return $query->where('rm.floor_id', $floorId);
            // });

        // Prepare the bindings in the correct order
        $bindings = [
            $reportDate,  // cleaning_status
            $reportDate,  // maintenance_status
            $reportDate, $reportDate,  // guest_name
            $reportDate, $reportDate,  // guest_contact
            $reportDate, $reportDate,  // check_in_date
            $reportDate, $reportDate,  // check_out_date
            $reportDate, $reportDate   // block_reason
        ];

        // Execute the query with bindings
        $rooms = $query->setBindings($bindings)->get();

        // Process the results
        $reportData = $rooms->map(function ($room) {
            $roomData = (array)$room;
            
            // Status priority logic
            if ($roomData['guest_name'] !== null) {
                $roomData['room_status'] = 'Occupied';
            } elseif ($roomData['block_reason'] !== null) {
                $roomData['room_status'] = 'Blocked';
            } elseif ($roomData['maintenance_status'] !== null) {
                $roomData['room_status'] = 'Maintenance';
            }

            return $roomData;
        });

        return response()->json([
            'success' => true,
            'records' => $reportData
        ]);
    }

    public function houseKeepingGenerate(Request $request)
    {
        $request->validate([
            'report_date' => 'required|date',
            'status' => 'nullable|string',
            'cleaner_id' => 'nullable|integer'
        ]);

        $reportDate = Carbon::parse($request->report_date);
        $statusFilter = $request->status;
        $cleanerFilter = $request->cleaner_id;

        // Base query for cleaning logs
        $query = RoomCleaningLog::with([
            'room.floor.block',
            'room.roomType',
            'cleaner',
            'status'
        ])
        ->whereDate('started_at', '<=', $reportDate)
        ->where(function($q) use ($reportDate) {
            $q->whereDate('completed_at', '>=', $reportDate)
              ->orWhereNull('completed_at');
        })
        ->latest();

        // Apply status filter
        if ($statusFilter && $statusFilter !== 'All') {
            $query->whereHas('status', function($q) use ($statusFilter) {
                $q->where('status_name', $statusFilter);
            });
        }

        // Apply cleaner filter
        if ($cleanerFilter) {
            $query->where('cleaner_id', $cleanerFilter);
        }

        $cleaningLogs = $query->get();

        // Process data
        $reportData = [];
        foreach ($cleaningLogs as $log) {
            $timeTaken = null;
            if ($log->started_at && $log->completed_at) {
                $start = Carbon::parse($log->started_at);
                $end = Carbon::parse($log->completed_at);
                $diff = $start->diff($end);
                $timeTaken = $diff->format('%Hh %Im');
                
                // Mark if cleaning took too long (>2 hours)
                if ($diff->h >= 2) {
                    $timeTaken .= " (Overdue)";
                } elseif ($diff->h < 1) {
                    $timeTaken .= " (Fast)";
                }
            }

            $reportData[] = [
                'room_id' => $log->room_id,
                'room_no' => $log->room->room_no,
                'block_name' => $log->room->floor->block->block_name,
                'floor_name' => $log->room->floor->floor_name,
                'room_type_name' => $log->room->roomType->room_type_name,
                'cleaning_status' => $log->status->status_name,
                'cleaner_name' => $log->cleaner ? $log->cleaner->name : 'N/A',
                'started_at' => $log->started_at ? Carbon::parse($log->started_at)->format('Y-m-d H:i') : 'N/A',
                'completed_at' => $log->completed_at ? Carbon::parse($log->completed_at)->format('Y-m-d H:i') : 'N/A',
                'time_taken' => $timeTaken,
                'remarks' => $log->remarks
            ];
        }

        return response()->json([
            'success' => true,
            'records' => $reportData
        ]);
    }

    public function getCleaner()
    {
        return CleanerMaster::get();
    }

    public function getCleaningStatus(Request $request)
    {
        return CleaningStatusMaster::get();
    }
    public function GetMaintenanceMaster()
    {
        return MaintenanceMaster::get();
    }

    public function getMaintenanceStatusMaster(Request $request)
    {
        return MaintenanceStatusMaster::get();
    }

    public function maintenaceGenerate(Request $request)
    {
        $request->validate([
            'from_date' => 'required|date',
            'to_date' => 'required|date',
            'status' => 'nullable|string',
            'priority' => 'nullable|string',
            'type_id' => 'nullable'
        ]);

        $fromDate = Carbon::parse($request->from_date);
        $toDate = Carbon::parse($request->to_date);
        $statusFilter = $request->status;
        $priorityFilter = $request->priority;
        $typeFilter = $request->type_id;

        // Base query for maintenance logs
        $query = RoomMaintenanceLog::with([
            'room.floor.block',
            'maintenanceType',
            'status',
            'reporter'
        ])
        ->whereBetween('started_at', [$fromDate, $toDate])
        ->latest();

        // Apply status filter
        if ($statusFilter && $statusFilter !== 'All') {
            $query->whereHas('status', function($q) use ($statusFilter) {
                $q->where('status_name', $statusFilter);
            });
        }

        // Apply priority filter
        if ($priorityFilter && $priorityFilter !== 'All') {
            $query->where('priority', $priorityFilter);
        }

        // Apply type filter
        if ($typeFilter && $typeFilter !== 'All') {
            $query->where('maintenance_type_id', $typeFilter);
        }

        $maintenanceLogs = $query->get();

        // Process data
        $reportData = [];
        foreach ($maintenanceLogs as $log) {
            $timeTaken = null;
            $timeTakenHours = null;
            
            if ($log->started_at && $log->resolved_at) {
                $start = Carbon::parse($log->started_at);
                $end = Carbon::parse($log->resolved_at);
                $diff = $start->diff($end);
                
                $timeTakenHours = $diff->h + ($diff->days * 24);
                $timeTaken = $diff->format('%dd %hh %im');
                
                // Mark if resolution took too long
                if ($log->priority === 'Emergency' && $timeTakenHours > 2) {
                    $timeTaken .= " (Overdue)";
                } elseif ($log->priority === 'High' && $timeTakenHours > 24) {
                    $timeTaken .= " (Overdue)";
                } elseif ($timeTakenHours < 1) {
                    $timeTaken .= " (Fast)";
                }
            }

            $reportData[] = [
                'id' => $log->id,
                'room_id' => $log->room_id,
                'room_no' => $log->room->room_no,
                'block_name' => $log->room->floor->block->block_name,
                'floor_name' => $log->room->floor->floor_name,
                'issue_type' => $log->maintenanceType->issue_type,
                'priority' => $log->priority,
                'status' => $log->status->status_name,
                'reported_by' => $log->reporter ? $log->reporter->name : 'System',
                'reported_date' => Carbon::parse($log->started_at)->format('Y-m-d H:i'),
                'technician' => $log->technician,
                'time_taken' => $timeTaken,
                'time_taken_hours' => $timeTakenHours,
                'description' => $log->issue_description
            ];
        }

        return response()->json([
            'success' => true,
            'records' => $reportData
        ]);
    }

    public function blockReportGenerate(Request $request)
    {
        $request->validate([
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
            'reason' => 'nullable|string',
            'blocked_by' => 'nullable|string'
        ]);

        $fromDate = Carbon::parse($request->from_date)->startOfDay();
        $toDate = Carbon::parse($request->to_date)->endOfDay();
        $reasonFilter = $request->reason;
        $blockedByFilter = $request->blocked_by;

        $query = BlockRoom::with([
            'room.floor.block',
            'blockedByUser'
        ])
        ->where('fromdatetime', '<=', $toDate)
        ->where('todatetime', '>=', $fromDate);

        if ($reasonFilter && $reasonFilter !== 'All') {
            $query->where('reason', $reasonFilter);
        }

        if ($blockedByFilter && $blockedByFilter !== 'All') {
            $query->where('blocked_by', $blockedByFilter);
        }

        $blocks = $query->get();

        $reportData = $blocks->map(function ($block) {
            return [
                'id' => $block->id,
                'room_id' => $block->room_id,
                'room_no' => $block->room->room_no ?? 'N/A',
                'block_name' => $block->room->floor->block->block_name ?? 'N/A',
                'floor_name' => $block->room->floor->floor_name ?? 'N/A',
                'reason' => $block->reason,
                'blocked_by' => $block->blockedByUser->name ?? 'System',
                'from_date' => $block->fromdatetime->format('Y-m-d H:i'),
                'to_date' => $block->todatetime->format('Y-m-d H:i'),
                'current_status' => $block->todatetime->isPast() ? 'Expired' : 'Active',
                'notes' => $block->reason
            ];
        });

        return response()->json([
            'success' => true,
            'records' => $reportData
        ]);
    }

    public function getBlockReasons()
    {
        try {
            $reasons = BlockRoom::select('reason')
                ->distinct()
                ->whereNotNull('reason')
                ->orderBy('reason')
                ->pluck('reason');
                
            return response()->json([
                'success' => true,
                'reasons' => $reasons
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch block reasons',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function getRoomBlockers()
    {
        try {
            // Get user IDs who blocked rooms from mysql2 connection
            $blockedUserIds = DB::connection('mysql2')
                ->table('block_rooms') // use actual table name
                ->select('blocked_by')
                ->distinct()
                ->pluck('blocked_by')
                ->toArray();

            // Fetch user details from mysql using the IDs
            $blockers = DB::connection('mysql')
                ->table('users')
                ->leftJoin('roles_master', 'users.role_id', '=', 'roles_master.id')
                ->whereIn('users.id', $blockedUserIds)
                ->select([
                    'users.id',
                    'users.name',
                    'users.email',
                    'users.is_admin',
                    'users.created_at',
                    'roles_master.role_name as role'
                ])
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'is_admin' => (bool) $user->is_admin,
                        'member_since' => \Carbon\Carbon::parse($user->created_at)->format('Y-m-d')
                    ];
                });

            return response()->json([
                'success' => true,
                'blockers' => $blockers
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch room blockers',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function guestforecastgenerate(Request $request)
    {
        $request->validate([
            'report_date' => 'required|date',
            'days' => 'required|integer|min:1|max:7'
        ]);

        $startDate = Carbon::parse($request->report_date);
        $endDate = $startDate->copy()->addDays($request->days - 1);
        
        // Get all check-ins that overlap with the forecast period
        $arrivals = CheckinMaster::with(['rooms.room', 'segment'])
            ->whereBetween('check_in_datetime', [$startDate, $endDate])
            ->orWhere(function($query) use ($startDate, $endDate) {
                $query->where('check_in_datetime', '<', $startDate)
                      ->where('check_out_datetime', '>', $startDate);
            })
            ->get()
            ->map(function($checkin) {
                return [
                    'date' => $checkin->check_in_datetime->format('Y-m-d'),
                    'day_of_week' => $checkin->check_in_datetime->format('l'),
                    'guest_name' => $checkin->first_name . ' ' . $checkin->last_name,
                    'room_number' => $checkin->rooms->first()->room->room_no ?? 'N/A',
                    'expected_time' => $checkin->check_in_datetime->format('H:i'),
                    'segment' => $checkin->segment->segment_name ?? 'Other',
                    'is_vip' => (bool)$checkin->is_vip,
                    'special_requests' => $checkin->guest_special_instructions
                ];
            })
            ->groupBy('date');

        // Get all check-outs that overlap with the forecast period
        $departures = CheckinMaster::with(['rooms.room'])
            ->whereBetween('check_out_datetime', [$startDate, $endDate])
            ->get()
            ->map(function($checkin) {
                $earlyCheckout = $checkin->check_out_datetime->lt(
                    Carbon::parse($checkin->original_check_out)
                );
                
                return [
                    'date' => $checkin->check_out_datetime->format('Y-m-d'),
                    'day_of_week' => $checkin->check_out_datetime->format('l'),
                    'guest_name' => $checkin->first_name . ' ' . $checkin->last_name,
                    'room_number' => $checkin->rooms->first()->room->room_no ?? 'N/A',
                    'expected_time' => $checkin->check_out_datetime->format('H:i'),
                    'checkout_type' => $earlyCheckout ? 'Early' : 'On Time',
                    'late_checkout_approved' => (bool)$checkin->late_checkout,
                    'late_checkout_time' => $checkin->late_checkout_time,
                    'is_vip' => (bool)$checkin->is_vip
                ];
            })
            ->groupBy('date');

        // Build forecast data for each day
        $forecastData = [];
        $currentDate = $startDate->copy();
        
        while ($currentDate <= $endDate) {
            $dateStr = $currentDate->format('Y-m-d');
            $dayOfWeek = $currentDate->format('l');
            
            $forecastData[] = [
                'date' => $dateStr,
                'day_of_week' => $dayOfWeek,
                'arrivals' => $arrivals->get($dateStr, []),
                'departures' => $departures->get($dateStr, [])
            ];
            
            $currentDate->addDay();
        }

        // Calculate summary statistics
        $summary = [
            'total_arrivals' => $arrivals->flatten(1)->count(),
            'total_departures' => $departures->flatten(1)->count(),
            'vip_count' => $arrivals->flatten(1)->where('is_vip', true)->count() + 
                           $departures->flatten(1)->where('is_vip', true)->count(),
            'special_requests_count' => $arrivals->flatten(1)->filter(function($arrival) {
                return !empty($arrival['special_requests']);
            })->count(),
            'peak_arrival_hour' => $this->calculatePeakHour(
                $arrivals->flatten(1)->pluck('expected_time')
            ),
            'peak_departure_hour' => $this->calculatePeakHour(
                $departures->flatten(1)->pluck('expected_time')
            )
        ];

        return response()->json([
            'success' => true,
            'forecast' => $forecastData,
            'summary' => $summary
        ]);
    }

    private function calculatePeakHour($times)
    {
        if ($times->isEmpty()) return 'N/A';
        
        $hourCounts = $times->map(function($time) {
                return explode(':', $time)[0]; // Extract hour
            })
            ->countBy()
            ->sortDesc();
            
        return $hourCounts->keys()->first() . ':00 - ' . 
               (intval($hourCounts->keys()->first()) + 1 . ':00');
    }

}