<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;
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

}