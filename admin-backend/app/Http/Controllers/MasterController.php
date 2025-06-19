<?php

namespace App\Http\Controllers;

use App\Models\BlockMaster;
use App\Models\FloorMaster;
use App\Models\RoomTypeMaster;
use App\Models\RoomStatusMaster;
use Illuminate\Http\Request;
use App\Models\RoomMaster;
use Carbon\Carbon;
use App\Models\Plan;

class MasterController extends Controller
{
    public function blockmaster(Request $request)
    {
        $blocks = BlockMaster::all()->map(function ($block) {
            return [
                'id' => $block->id,
                'block_no' => $block->block_no,
                'block_name' => $block->block_name,
                'created_at' => Carbon::parse($block->created_at)->format('d-m-Y H:i:s'),
                'updated_at' => Carbon::parse($block->updated_at)->format('d-m-Y H:i:s'),
                'created_by' => $block->created_by,
                'updated_by' => $block->updated_by,
            ];
        });

        return response()->json($blocks);
    }

    public function addblockmaster(Request $request)
    {
        $validated = $request->validate([
            'block_no' => 'required|string|max:255',
            'block_name' => 'required|string|max:255',
        ]);

        $block = new BlockMaster();
        $block->block_no = $validated['block_no'];
        $block->block_name = $validated['block_name'];
        $block->created_by = $request->user()->id;
        $block->updated_by = $request->user()->id;
        $block->save();

        return response()->json([
            'message' => 'Block Master added successfully',
            'data' => $block
        ], 201);
    }

    public function deleteBlockMaster($id)
    {
        $block = BlockMaster::find($id);
        if (!$block) {
            return response()->json(['message' => 'Block not found'], 404);
        }

        $block->delete();
        return response()->json(['message' => 'Block deleted successfully']);
    }

    public function ediblockmaster(Request $request, $id)
    {
        $block = BlockMaster::find($id);

        if (!$block) {
            return response()->json(['message' => 'Block not found'], 404);
        }

        $validated = $request->validate([
            'block_no' => 'required|string|max:255',
            'block_name' => 'required|string|max:255',
        ]);

        $block->block_no = $validated['block_no'];
        $block->block_name = $validated['block_name'];
        $block->updated_by = $request->user()->id;
        $block->save();

        return response()->json([
            'message' => 'Block Master updated successfully',
            'data' => $block
        ]);
    }


    public function floormaster(Request $request)
    {
        $floors = FloorMaster::with('block')->get()->map(function ($floor) {
            return [
                'id' => $floor->id,
                'floor_no' => $floor->floor_no,
                'floor_name' => $floor->floor_name,
                'block' => $floor->block ? [
                    'id' => $floor->block->id,
                    'block_no' => $floor->block->block_no,
                    'block_name' => $floor->block->block_name,
                ] : null,
                'created_at' => Carbon::parse($floor->created_at)->format('d-m-Y H:i:s'),
                'updated_at' => Carbon::parse($floor->updated_at)->format('d-m-Y H:i:s'),
                'created_by' => $floor->created_by,
                'updated_by' => $floor->updated_by,
            ];
        });

        return response()->json($floors);
    }

    public function addfloormaster(Request $request)
    {
        $validated = $request->validate([
            'floor_no' => 'required|string|max:255',
            'floor_name' => 'required|string|max:255',
            'block_id' => 'required|exists:mysql2.block_master,id',
        ]);

        $floor = new FloorMaster();
        $floor->floor_no = $validated['floor_no'];
        $floor->floor_name = $validated['floor_name'];
        $floor->block_id = $validated['block_id'];
        $floor->created_by = $request->user()->id;
        $floor->updated_by = $request->user()->id;
        $floor->save();

        return response()->json([
            'message' => 'Floor Master added successfully',
            'data' => $floor
        ], 201);
    }

    public function editfloormaster(Request $request, $id)
    {
        $floor = FloorMaster::find($id);

        if (!$floor) {
            return response()->json(['message' => 'Floor not found'], 404);
        }

        $validated = $request->validate([
            'floor_no' => 'required|string|max:255',
            'floor_name' => 'required|string|max:255',
            'block_id' => 'required|exists:mysql2.block_master,id',
        ]);

        $floor->floor_no = $validated['floor_no'];
        $floor->floor_name = $validated['floor_name'];
        $floor->block_id = $validated['block_id'];
        $floor->updated_by = $request->user()->id;
        $floor->save();

        return response()->json([
            'message' => 'Floor Master updated successfully',
            'data' => $floor
        ]);
    }

    public function deleteFloorMaster($id)
    {
        $floor = FloorMaster::find($id);
        if (!$floor) {
            return response()->json(['message' => 'Floor not found'], 404);
        }

        $floor->delete();
        return response()->json(['message' => 'Floor deleted successfully']);
    }

    public function getPlans()
    {
        $plans = Plan::all();
        return response()->json($plans);
    }

    public function roomtypemaster(Request $request)
    {
        $roomTypes = RoomTypeMaster::with('defaultPlan')->get()->map(function ($room) {
            return [
                'id' => $room->id,
                'room_type_code' => $room->room_type_code,
                'room_type_name' => $room->room_type_name,
                'default_plan' => $room->defaultPlan ? [
                    'id' => $room->defaultPlan->id,
                    'plan_name' => $room->defaultPlan->plan_name,
                ] : null,
                'display_order' => $room->display_order,
                'wifi_plan_id' => $room->wifi_plan_id,
                'max_adult_pax' => $room->max_adult_pax,
                'max_child_pax' => $room->max_child_pax,
                'max_extra_pax' => $room->max_extra_pax,
                'negative_count' => $room->negative_count,
                'roomtype_status' => $room->roomtype_status,
                'created_at' => Carbon::parse($room->created_at)->format('d-m-Y H:i:s'),
                'created_by' => $room->created_by,
                'updated_by' => $room->updated_by,
            ];
        });

        return response()->json($roomTypes);
    }

    public function addroomtypemaster(Request $request)
    {
        $validated = $request->validate([
            'room_type_code' => 'required|string|max:10',
            'room_type_name' => 'required|string|max:100',
            'default_plan_id' => 'nullable|exists:mysql2.plans,id',
            'display_order' => 'nullable|integer',
            'wifi_plan_id' => 'nullable|integer',
            'max_adult_pax' => 'nullable|integer',
            'max_child_pax' => 'nullable|integer',
            'max_extra_pax' => 'nullable|integer',
            'negative_count' => 'nullable|integer',
            'roomtype_status' => 'required|in:Active,Inactive',
        ]);

        $room = new RoomTypeMaster($validated);
        $room->created_by = $request->user()->id;
        $room->updated_by = $request->user()->id;
        $room->save();

        return response()->json(['message' => 'Room Type added successfully', 'data' => $room], 201);
    }

    public function editroomtypemaster(Request $request, $id)
    {
        $room = RoomTypeMaster::find($id);
        if (!$room) {
            return response()->json(['message' => 'Room Type not found'], 404);
        }

        $validated = $request->validate([
            'room_type_code' => 'required|string|max:10',
            'room_type_name' => 'required|string|max:100',
            'default_plan_id' => 'nullable|exists:mysql2.plans,id',
            'display_order' => 'nullable|integer',
            'wifi_plan_id' => 'nullable|integer',
            'max_adult_pax' => 'nullable|integer',
            'max_child_pax' => 'nullable|integer',
            'max_extra_pax' => 'nullable|integer',
            'negative_count' => 'nullable|integer',
            'roomtype_status' => 'required|in:Active,Inactive',
        ]);

        $room->update(array_merge($validated, [
            'updated_by' => $request->user()->id
        ]));

        return response()->json(['message' => 'Room Type updated successfully', 'data' => $room]);
    }

    public function deleteRoomTypeMaster($id)
    {
        $room = RoomTypeMaster::find($id);
        if (!$room) {
            return response()->json(['message' => 'Room Type not found'], 404);
        }

        $room->delete();
        return response()->json(['message' => 'Room Type deleted successfully']);
    }

    public function roomstatusmaster()
    {
        $statuses = RoomStatusMaster::all();
        return response()->json($statuses);
    }

    public function roommaster()
    {
        $rooms = RoomMaster::with(['floor', 'roomType', 'status'])
            ->get()
            ->map(function ($room) {
                return [
                    'id' => $room->id,
                    'room_no' => $room->room_no,
                    'display_order' => $room->display_order,
                    'floor_id' => $room->floor_id,
                    'floor_name' => $room->floor ? $room->floor->floor_name : null,
                    'room_type_id' => $room->room_type_id,
                    'room_type_name' => $room->roomType ? $room->roomType->room_type_name : null,
                    'status_id' => $room->status_id,
                    'status_name' => $room->status ? $room->status->status_name : null,
                    'max_pax' => $room->max_pax,
                    'max_extra_pax' => $room->max_extra_pax,
                    'is_active' => $room->is_active,
                    'created_at' => Carbon::parse($room->created_at)->format('d-m-Y H:i:s'),
                ];
            });

        return response()->json($rooms);
    }

    public function addroommaster(Request $request)
    {
         $validated = $request->validate([
            'room_no' => 'required|string|max:10|unique:mysql2.room_master,room_no',
            'display_order' => 'required|integer',
            'floor_id' => 'required|exists:mysql2.floor_master,id',
            'room_type_id' => 'required|exists:mysql2.roomtype_master,id',
            'status_id' => 'required|exists:mysql2.roomstatus_master,id',
            'max_pax' => 'required|integer|min:0',
            'max_extra_pax' => 'required|integer|min:0',
            'is_active' => 'required|boolean',
        ]);


        $room = RoomMaster::create(array_merge($validated, [
            'created_by' => $request->user()->id,
            'updated_by' => $request->user()->id,
        ]));

        return response()->json([
            'message' => 'Room created successfully',
            'data' => $room
        ], 201);
    }

    public function editroommaster(Request $request, $id)
    {
        $room = RoomMaster::find($id);
        if (!$room) {
            return response()->json(['message' => 'Room not found'], 404);
        }

        $validated = $request->validate([
            'room_no' => 'required|string|max:10|unique:mysql2.room_master,room_no,'.$id,
            'display_order' => 'required|integer',
            'floor_id' => 'required|exists:mysql2.floor_master,id',
            'room_type_id' => 'required|exists:mysql2.roomtype_master,id',
            'status_id' => 'required|exists:mysql2.roomstatus_master,id',
            'max_pax' => 'required|integer|min:0',
            'max_extra_pax' => 'required|integer|min:0',
            'is_active' => 'required|boolean',
        ]);

        $room->update(array_merge($validated, [
            'updated_by' => $request->user()->id,
        ]));

        return response()->json([
            'message' => 'Room updated successfully',
            'data' => $room
        ]);
    }

    public function deleteroommaster($id)
    {
        $room = RoomMaster::find($id);
        if (!$room) {
            return response()->json(['message' => 'Room not found'], 404);
        }

        $room->deleted_by = auth()->id();
        $room->save();
        $room->delete();

        return response()->json(['message' => 'Room deleted successfully']);
    }


}
