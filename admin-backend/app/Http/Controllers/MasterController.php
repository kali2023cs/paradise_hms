<?php

namespace App\Http\Controllers;

use App\Models\BlockMaster;
use App\Models\FloorMaster;
use App\Models\RoomTypeMaster;
use App\Models\RoomStatusMaster;
use Illuminate\Http\Request;
use App\Models\RoomMaster;
use App\Models\GuestMaster;
use Illuminate\Support\Facades\Storage;
use App\Models\TitleMaster;
use App\Models\IdMaster;
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

    public function guestmaster(Request $request)
    {
        $guests = GuestMaster::all()->map(function ($guest) {
            return [
                'id' => $guest->id,
                'title_id' => $guest->title_id,
                'first_name' => $guest->first_name,
                'last_name' => $guest->last_name,
                'gender' => $guest->gender,
                'date_of_birth' => $guest->date_of_birth,
                'email' => $guest->email,
                'phone' => $guest->phone,
                'mobile' => $guest->mobile,
                'address' => $guest->address,
                'city' => $guest->city,
                'state' => $guest->state,
                'country' => $guest->country,
                'postal_code' => $guest->postal_code,
                'id_type' => $guest->id_type,
                'id_number' => $guest->id_number,
                'id_document' => $guest->id_document,
                'nationality' => $guest->nationality,
                'company_name' => $guest->company_name,
                'gst_number' => $guest->gst_number,
                'is_vip' => $guest->is_vip,
                'vip_level' => $guest->vip_level,
                'is_blacklisted' => $guest->is_blacklisted,
                'created_at' => Carbon::parse($guest->created_at)->format('d-m-Y H:i:s'),
                'updated_at' => Carbon::parse($guest->updated_at)->format('d-m-Y H:i:s'),
            ];
        });

        return response()->json($guests);
    }

    public function addguestmaster(Request $request)
    {
        // Convert string booleans to actual booleans before validation
        $request->merge([
            'is_vip' => $this->normalizeBoolean($request->is_vip),
            'is_blacklisted' => $this->normalizeBoolean($request->is_blacklisted)
        ]);

        $validated = $request->validate([
            'title_id' => 'nullable|exists:mysql2.title_master,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'date_of_birth' => 'nullable|date_format:Y-m-d',
            'email' => 'nullable|email|max:255|unique:mysql2.guest_master,email',
            'phone' => 'nullable|string|max:20',
            'mobile' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'id_type' => 'nullable|exists:mysql2.id_master,id',
            'id_number' => 'nullable|string|max:255',
            'id_document' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'nationality' => 'nullable|string|max:255',
            'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'company_name' => 'nullable|string|max:255',
            'company_address' => 'nullable|string',
            'gst_number' => 'nullable|string|max:50',
            'gst_type' => 'nullable|string|max:50',
            'is_vip' => 'nullable|boolean',
            'vip_level' => 'nullable|string|max:50',
            'remarks' => 'nullable|string',
            'is_blacklisted' => 'nullable|boolean',
            'blacklist_reason' => 'nullable|string',
        ]);

        $data = $validated;
        
        // Handle file uploads
        if ($request->hasFile('id_document')) {
            $data['id_document'] = $request->file('id_document')->store('id_documents', 'public');
        }
        
        if ($request->hasFile('profile_photo')) {
            $data['profile_photo'] = $request->file('profile_photo')->store('profile_photos', 'public');
        }
        
        $guest = GuestMaster::create([
            ...$data,
            'created_by' => $request->user()->id,
            'updated_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Guest added successfully',
            'data' => $guest
        ], 201);
    }

    public function editguestmaster(Request $request, $id)
    {
        $guest = GuestMaster::find($id);

        if (!$guest) {
            return response()->json(['message' => 'Guest not found'], 404);
        }

        // Convert string booleans to actual booleans before validation
        $request->merge([
            'is_vip' => $this->normalizeBoolean($request->is_vip, $guest->is_vip),
            'is_blacklisted' => $this->normalizeBoolean($request->is_blacklisted, $guest->is_blacklisted)
        ]);

        $validated = $request->validate([
            'title_id' => 'nullable|exists:title_master,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'date_of_birth' => 'nullable|date_format:Y-m-d',
            'email' => 'nullable|email|max:255|unique:guest_master,email,'.$guest->id,
            'phone' => 'nullable|string|max:20',
            'mobile' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'id_type' => 'nullable|exists:id_master,id',
            'id_number' => 'nullable|string|max:255',
            'id_document' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'nationality' => 'nullable|string|max:255',
            'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'company_name' => 'nullable|string|max:255',
            'company_address' => 'nullable|string',
            'gst_number' => 'nullable|string|max:50',
            'gst_type' => 'nullable|string|max:50',
            'is_vip' => 'nullable|boolean',
            'vip_level' => 'nullable|string|max:50',
            'remarks' => 'nullable|string',
            'is_blacklisted' => 'nullable|boolean',
            'blacklist_reason' => 'nullable|string',
        ]);

        $data = $validated;
        
        // Handle file uploads
        if ($request->hasFile('id_document')) {
            // Delete old file if exists
            if ($guest->id_document) {
                Storage::disk('public')->delete($guest->id_document);
            }
            $data['id_document'] = $request->file('id_document')->store('id_documents', 'public');
        }
        
        if ($request->hasFile('profile_photo')) {
            // Delete old file if exists
            if ($guest->profile_photo) {
                Storage::disk('public')->delete($guest->profile_photo);
            }
            $data['profile_photo'] = $request->file('profile_photo')->store('profile_photos', 'public');
        }

        $guest->update([
            ...$data,
            'updated_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Guest updated successfully',
            'data' => $guest
        ]);
    }

    public function deleteGuestMaster($id)
    {
        $guest = GuestMaster::find($id);
        if (!$guest) {
            return response()->json(['message' => 'Guest not found'], 404);
        }

        // Delete associated files
        if ($guest->id_document) {
            Storage::disk('public')->delete($guest->id_document);
        }
        if ($guest->profile_photo) {
            Storage::disk('public')->delete($guest->profile_photo);
        }

        $guest->delete();
        return response()->json(['message' => 'Guest deleted successfully']);
    }

    public function titlemaster(Request $request)
    {
        $titles = TitleMaster::all()->map(function ($title) {
            return [
                'id' => $title->id,
                'title_name' => $title->title_name,
            ];
        });

        return response()->json($titles);
    }

    public function idmaster(Request $request)
    {
        $idTypes = IdMaster::active()->get()->map(function ($idType) {
            return [
                'id' => $idType->id,
                'id_type' => $idType->id_type,
                'description' => $idType->description,
            ];
        });

        return response()->json($idTypes);
    }

    private function normalizeBoolean($value, $default = false)
    {
        if (is_null($value)) {
            return $default;
        }
        
        if (is_bool($value)) {
            return $value;
        }
        
        if (is_int($value)) {
            return (bool)$value;
        }
        
        if (is_string($value)) {
            $value = strtolower($value);
            return in_array($value, ['true', '1', 'yes', 'on']);
        }
        
        return $default;
    }


}
