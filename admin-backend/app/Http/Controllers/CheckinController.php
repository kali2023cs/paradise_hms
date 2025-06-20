<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\CheckinMaster;
use App\Models\CheckinRoomTrans;
use App\Models\RoomMaster;

class CheckinController extends Controller
{
    public function getArrivalModes(Request $request)
    {
        $arrivalModes = DB::connection('mysql2')->table('arrival_mode')
            ->select('id', 'mode_name')
            ->where('is_active', 1)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $arrivalModes,
        ]);
    }

    public function getAllGender(Request $request)
    {
        $gender = DB::connection('mysql2')->table('gender_master')
            ->select('id', 'gender_name')
            ->where('is_active', 1)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $gender,
        ]);
    }

    public function getAllTitleMaster(Request $request)
    {
        $title = DB::connection('mysql2')->table('title_master')
            ->select('id', 'title_name')
            ->where('is_active', 1)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $title,
        ]);
    }

    public function getAllSegments(Request $request)
    {
        $segments = DB::connection('mysql2')->table('segment_master')
            ->select('id', 'segment_name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $segments,
        ]);
    }

    public function getAllBusinessSources(Request $request)
    {
        $businesssource = DB::connection('mysql2')->table('business_source')
            ->select('id', 'source_name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $businesssource,
        ]);
    }

    public function getAllRoomTypes(Request $request)
    {
        $roomtypes = DB::connection('mysql2')->table('roomtype_master')
            ->select('id', 'room_type_name')
            ->where('roomtype_status', 'Active')
            ->whereNull('deleted_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $roomtypes,
        ]);
    }

    public function getRoomsByType(Request $request, $roomTypeId)
    {
        $rooms = DB::connection('mysql2')->table('room_master')
            ->select('id', 'room_no', 'room_type_id', 'max_pax', 'max_extra_pax')
            ->where('is_active', 1)
            ->where('room_type_id', $roomTypeId)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $rooms,
        ]);
    }

    public function getRoomTypePlan(Request $request, $roomTypeId)
    {
        $plans = DB::connection('mysql2')->table('plans')
            ->select('*')
            ->where('status', 'Active')
            ->where('room_type_id', $roomTypeId)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $plans,
        ]);
    }

    public function checkinConfirm(Request $request)
    {
        $data = $request->all();

        DB::connection('mysql2')->beginTransaction();

        try {
            $checkin = CheckinMaster::create($data['guestInfo']);

            foreach ($data['roomDetails'] as $room) {
                $roomData = [
                    'checkin_id' => $checkin->id,
                    'room_type_id' => $room['roomTypeId'],
                    'room_id' => $room['roomId'],
                    'rate_plan_id' => $room['ratePlanId'],
                    'guest_name' => $room['guestName'],
                    'contact' => $room['contact'],
                    'male' => $room['male'],
                    'female' => $room['female'],
                    'extra' => $room['extra'],
                    'net_rate' => $room['netRate'],
                    'disc_type' => $room['discType'],
                    'disc_val' => $room['discVal'],
                    'total' => $room['total'],
                ];

                CheckinRoomTrans::create($roomData);

                RoomMaster::where('id', $room['roomId'])->update([
                    'checkin_id' => $checkin->id,
                    'status_id' => 2
                ]);
            }

            DB::connection('mysql2')->commit();

            return response()->json([
                'status' => true,
                'message' => 'Check-in data saved successfully!',
                'checkin_id' => $checkin->id,
            ]);
        } catch (\Exception $e) {
            DB::connection('mysql2')->rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function editCheckin(Request $request, $checkinId)
    {
        $data = $request->all();

        DB::connection('mysql2')->beginTransaction();

        try {
            $checkin = CheckinMaster::findOrFail($checkinId);
            $checkin->update($data['guestInfo']);

            CheckinRoomTrans::where('checkin_id', $checkinId)->delete();

            foreach ($data['roomDetails'] as $room) {
                CheckinRoomTrans::create(array_merge($room, ['checkin_id' => $checkin->id]));

                RoomMaster::where('id', $room['roomId'])->update([
                    'status_id' => 2
                ]);
            }

            DB::connection('mysql2')->commit();

            return response()->json([
                'status' => true,
                'message' => 'Check-in updated successfully!',
                'checkin_id' => $checkin->id,
            ]);
        } catch (\Exception $e) {
            DB::connection('mysql2')->rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function checkinList(Request $request)
    {
        try {
            $checkins = CheckinMaster::with('rooms')
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'status' => true,
                'data' => $checkins,
                'message' => 'Check-in list retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function checkin($checkinId)
    {
        try {
            $checkin = CheckinMaster::with('rooms')->find($checkinId);

            if (!$checkin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Check-in record not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'guestInfo' => $checkin,
                    'roomDetails' => $checkin->rooms
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving check-in details: ' . $e->getMessage()
            ], 500);
        }
    }
}
