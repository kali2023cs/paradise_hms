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
                $records = DB::table('checkin_master')
                    ->select(
                        'checkin_master.*',
                        'gender_master.gender_name as gendername',
                        'arrival_mode.mode_name',
                        'title_master.title_name',
                        'checkin_room_trans.room_id',
                        'room_master.room_no',
                        'roomtype_master.room_type_name'
                    )
                    ->join('gender_master', 'gender_master.id', '=', 'checkin_master.gender')
                    ->join('title_master', 'title_master.id', '=', 'checkin_master.title')
                    ->join('arrival_mode', 'arrival_mode.id', '=', 'checkin_master.arrival_mode')
                    ->leftJoin('checkin_room_trans', 'checkin_room_trans.checkin_id', '=', 'checkin_master.id')
                    ->leftJoin('room_master', 'room_master.id', '=', 'checkin_room_trans.room_id')
                    ->leftJoin('roomtype_master', 'roomtype_master.id', '=', 'checkin_room_trans.room_type_id')
                    ->whereBetween('checkin_master.check_in_datetime', [$fromDate, $toDate])
                    ->get();
            } else {
                $records = DB::table('checkout_master')
                    ->select('checkout_master.*', 'checkin_master.guest_name')
                    ->join('checkin_master', 'checkin_master.id', '=', 'checkout_master.checkin_id')
                    ->whereBetween('checkout_master.created_at', [$fromDate, $toDate])
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
}