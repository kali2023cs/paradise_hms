<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\RoomMaster;
use App\Models\RoomStatusMaster;
use App\Models\CleaningStatusMaster;
use App\Models\CleanerMaster;
use App\Models\RoomCleaningLog;
use App\Models\BlockRoom;
use App\Models\User;
use App\Models\RoomMaintenanceLog;
use App\Models\MaintenanceStatusMaster;
use App\Models\MaintenanceMaster;


class RoommenuController extends Controller
{

   public function retriveRoomMasterForBlock()
    {
        $data = RoomMaster::join('roomstatus_master', 'room_master.status_id', '=', 'roomstatus_master.id')
            ->select(
                'room_master.*',
                'roomstatus_master.status_name as status_name'
            )
            ->whereIn(DB::raw('UPPER(roomstatus_master.status_name)'), ['AVAILABLE', 'OUT OF ORDER'])
            ->get();

        return response()->json([
            'status' => true,
            'data' => $data
        ]);
    }

    public function blockRoom(Request $request)
    {

        $room = RoomMaster::where('id', $request->room_id)->first();

        if (!$room) {
            return response()->json([
                'status' => false,
                'message' => 'Room not found',
            ], 404);
        }

        $status_id = RoomStatusMaster::where(DB::raw('UPPER(status_name)'), 'BLOCKED')
            ->pluck('id')
            ->first();

        if (!$status_id) {
            return response()->json([
                'status' => false,
                'message' => 'BLOCKED status not found in roomstatus_master',
            ], 500);
        }

        $block = BlockRoom::create([
            'room_id'      => $room->id,
            'status_id'    => $status_id,
            'reason'       => $request->reason,
            'fromdatetime' => Carbon::parse($request->from_date),
            'todatetime'   => Carbon::parse($request->to_date),
            'blocked_by'   => Auth::id() ?? 1, // fallback to 1 if not authenticated
        ]);

        RoomMaster::where('id', $request->room_id)
            ->update(['status_id' => $status_id]);

        return response()->json([
            'status' => true,
            'message' => 'Room blocked successfully',
            'data' => $block
        ]);
    }

    public function retriveBlockedRooms()
    {
        $blockedStatusId = RoomStatusMaster::where(DB::raw('UPPER(status_name)'), 'BLOCKED')->pluck('id')->first();

        if (!$blockedStatusId) {
            return response()->json([
                'status' => false,
                'message' => 'BLOCKED status not found'
            ], 500);
        }

        $rooms = RoomMaster::where('status_id', $blockedStatusId)->get();

        return response()->json([
            'status' => true,
            'data' => $rooms
        ]);
    }

    public function unblockRoom(Request $request)
    {
        $room = RoomMaster::find($request->room_id);

        if (!$room) {
            return response()->json([
                'status' => false,
                'message' => 'Room not found',
            ], 404);
        }

        $dirtyStatusId = RoomStatusMaster::where(DB::raw('UPPER(status_name)'), 'DIRTY')->pluck('id')->first();

        if (!$dirtyStatusId) {
            return response()->json([
                'status' => false,
                'message' => 'DIRTY status not found',
            ], 500);
        }

        // Optional: delete the block record or mark it inactive
        BlockRoom::where('room_id', $room->id)
            ->orderBy('id', 'desc')
            ->take(1)
            ->update(['status_id' => $dirtyStatusId]);

        $room->update(['status_id' => $dirtyStatusId]);

        return response()->json([
            'status' => true,
            'message' => 'Room unblocked successfully',
        ]);
    }

    public function cleanRoom(Request $request)
    {
        try {
            $validated = $request->validate([
                'room_id' => 'required|integer|exists:room_master,id',
                'cleaner_id' => 'required|integer|exists:cleaner_master,id',
                'status_id' => 'required|integer|exists:cleaning_status_master,id',
                'remarks' => 'nullable|string',
            ]);

            // Create new cleaning log
            $log = RoomCleaningLog::create([
                'room_id' => $validated['room_id'],
                'cleaner_id' => $validated['cleaner_id'],
                'status_id' => $validated['status_id'],
                'remarks' => $validated['remarks'] ?? null,
                'started_at' => now(),
                'completed_at' => $validated['status_id'] == 3 ? now() : null, // Will be set when finishing
            ]);

            // Update room status to "Cleaning"
            if($validated['status_id'] == 3){
                $givenStatusId = RoomStatusMaster::where(DB::raw('UPPER(status_name)'), 'AVAILABLE')
                ->pluck('id')
                ->first();
            }else{
                $givenStatusId = RoomStatusMaster::where(DB::raw('UPPER(status_name)'), 'CLEANING')
                ->pluck('id')
                ->first();
            }

                RoomMaster::where('id', $validated['room_id'])
                ->update(['status_id' => $givenStatusId]);
            

            return response()->json([
                'success' => true,
                'message' => 'Room cleaning started successfully.',
                'data' => $log
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to start room cleaning.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function finishCleaning(Request $request)
    {
        try {
            $validated = $request->validate([
                'room_id' => 'required|integer|exists:room_master,id',
                'status_id' => 'required|integer|exists:cleaning_status_master,id',
            ]);

            // Find the latest cleaning log for this room
            $log = RoomCleaningLog::where('room_id', $validated['room_id'])
                ->whereNull('completed_at')
                ->latest()
                ->first();

            if (!$log) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active cleaning found for this room.',
                ], 400);
            }

            // Update the cleaning log
            $log->update([
                'status_id' => $validated['status_id'],
                'completed_at' => now()
            ]);

            // Update room status to "Available"
            $availableStatusId = RoomStatusMaster::where(DB::raw('UPPER(status_name)'), 'AVAILABLE')
                ->pluck('id')
                ->first();
            
            RoomMaster::where('id', $validated['room_id'])
                ->update(['status_id' => $availableStatusId]);

            return response()->json([
                'success' => true,
                'message' => 'Room cleaning completed successfully.',
                'data' => $log
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete room cleaning.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getCleaningMasters()
    {
        $dirtyStatusId = RoomStatusMaster::where(DB::raw('UPPER(status_name)'), 'DIRTY')
            ->pluck('id')
            ->first();

        try {
            $rooms = RoomMaster::where('is_active', true)
                ->where('status_id', $dirtyStatusId)
                ->get(['id', 'room_no']);
                
            $cleaners = CleanerMaster::where('is_active', true)
                ->get(['id', 'name']);
                
            $statuses = CleaningStatusMaster::where('is_active', true)
                ->get(['id', 'status_name']);

            return response()->json([
                'success' => true,
                'rooms' => $rooms,
                'cleaners' => $cleaners,
                'statuses' => $statuses
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch cleaning masters data.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function reportMaintenance(Request $request)
    {
        try {
            $validated = $request->validate([
                'room_id' => 'required|integer|exists:room_master,id',
                'maintenance_type_id' => 'required|integer|exists:maintenance_master,id',
                'maintenance_status_id' => 'required|integer|exists:maintenance_status_master,id',
                'issue_description' => 'required|string',
                'reported_by' => 'nullable|integer|exists:users,id',
            ]);

            // Create new maintenance log
            $log = RoomMaintenanceLog::create([
                'room_id' => $validated['room_id'],
                'maintenance_type_id' => $validated['maintenance_type_id'],
                'maintenance_status_id' => $validated['maintenance_status_id'],
                'issue_description' => $validated['issue_description'],
                'reported_by' => $validated['reported_by'] ?? auth()->id(),
                'started_at' => now(),
                'resolved_at' => null,
            ]);

            // Update room status to "Under Maintenance"
            $maintenanceStatusId = RoomStatusMaster::where(DB::raw('UPPER(status_name)'), 'MAINTENANCE')
                ->pluck('id')
                ->first();
            
            RoomMaster::where('id', $validated['room_id'])
                ->update(['status_id' => $maintenanceStatusId]);

            return response()->json([
                'success' => true,
                'message' => 'Maintenance reported successfully.',
                'data' => $log
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to report maintenance.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getMaintenanceMasters()
    {
        $availableStatusId = RoomStatusMaster::where(DB::raw('UPPER(status_name)'), 'AVAILABLE')->pluck('id')->first();
        try {
            // Get all active rooms regardless of status for resolution
            $rooms = RoomMaster::where('is_active', true)->where('status_id',$availableStatusId)
                ->get(['id', 'room_no']);
                
            $maintenanceTypes = MaintenanceMaster::where('is_active', true)
                ->get(['id', 'issue_type']);
                
            $statuses = MaintenanceStatusMaster::where('is_active', true)
                ->get(['id', 'status_name']);

            $staff = User::get(['id', 'name']);

            return response()->json([
                'success' => true,
                'rooms' => $rooms,
                'maintenanceTypes' => $maintenanceTypes,
                'statuses' => $statuses,
                'staff' => $staff
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch maintenance masters data.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function resolveMaintenance(Request $request)
    {
        try {
            $validated = $request->validate([
                'room_id' => 'required|integer|exists:room_master,id',
                'maintenance_status_id' => 'required|integer|exists:maintenance_status_master,id',
                'remarks' => 'nullable|string',
            ]);

            // Verify the status is actually "resolved"
            $resolvedStatus = MaintenanceStatusMaster::where(DB::raw('UPPER(status_name)'), 'RESOLVED')
                ->where('id', $validated['maintenance_status_id'])
                ->first();

            if (!$resolvedStatus) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid status for resolution. Please select "Resolved" status.',
                ], 400);
            }

            // Find the latest maintenance log for this room
            $log = RoomMaintenanceLog::where('room_id', $validated['room_id'])
                ->whereNull('resolved_at')
                ->latest()
                ->first();

            if (!$log) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active maintenance found for this room.',
                ], 400);
            }

            // Update the maintenance log
            $log->update([
                'maintenance_status_id' => $validated['maintenance_status_id'],
                'issue_description' => $validated['remarks'] ?? $log->issue_description,
                'resolved_at' => now()
            ]);

            // Update room status to "Available"
            $dirtyStatusId = RoomStatusMaster::where(DB::raw('UPPER(status_name)'), 'DIRTY')
                ->pluck('id')
                ->first();
            
            RoomMaster::where('id', $validated['room_id'])
                ->update(['status_id' => $dirtyStatusId]);

            return response()->json([
                'success' => true,
                'message' => 'Maintenance resolved successfully.',
                'data' => $log
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to resolve maintenance.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getCheckInInfo(Request $request)
    {
        // Validate the request parameters
        $request->validate([
            'room_id' => 'required|integer',
            'checkin_id' => 'required|integer'
        ]);

        $roomId = $request->input('room_id');
        $checkinId = $request->input('checkin_id');

        try {
            // Get checkin master details
            $checkinMaster = DB::table('checkin_master')
            ->select('checkin_master.*', 'gender_master.gender_name as gendername','arrival_mode.mode_name','title_master.title_name')
            ->join('gender_master', 'gender_master.id', '=', 'checkin_master.gender')
            ->join('title_master', 'title_master.id', '=', 'checkin_master.title')
            ->join('arrival_mode', 'arrival_mode.id', '=', 'checkin_master.arrival_mode')
            ->where('checkin_master.id', $checkinId)
            ->first();


            if (!$checkinMaster) {
                return response()->json([
                    'success' => false,
                    'message' => 'Check-in record not found'
                ], 404);
            }

            // Get room transaction details
            $roomTransaction = DB::table('checkin_room_trans')
            ->select('checkin_room_trans.*','plans.plan_name','room_master.room_no','roomtype_master.room_type_name')
            ->join('plans', 'plans.id', '=', 'checkin_room_trans.rate_plan_id')
            ->join('room_master', 'room_master.id', '=', 'checkin_room_trans.room_id')
            ->join('roomtype_master', 'roomtype_master.id', '=', 'checkin_room_trans.room_type_id')
                ->where('checkin_room_trans.room_id', $roomId)
                ->where('checkin_room_trans.checkin_id', $checkinId)
                ->first();

            if (!$roomTransaction) {
                return response()->json([
                    'success' => false,
                    'message' => 'Room transaction not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'checkin_master' => $checkinMaster,
                    'room_transaction' => $roomTransaction
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch check-in information',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
