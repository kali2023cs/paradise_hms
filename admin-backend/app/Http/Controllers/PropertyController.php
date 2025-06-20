<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PropertyController extends Controller
{
    public function getPropertyById($id)
    {
        $property = DB::table('property_master')
            ->where('id', $id)
            ->first();

        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        return response()->json(['property' => $property]);
    }
    public function updateProperty(Request $request, $id)
    {
        $data = $request->only([
            'property_name', 'address', 'city', 'state',
            'country', 'zip_code', 'contact_number', 'email'
        ]);

        try {
            $updatedDefault = DB::table('property_master')
                ->where('id', $id)
                ->update($data);

            $updatedMysql2 = DB::connection('mysql2')->table('property_master')
                ->where('id', $id)
                ->update($data);

            if ($updatedDefault || $updatedMysql2) {
                return response()->json(['message' => 'Property updated successfully']);
            } else {
                return response()->json(['message' => 'Update failed or no changes made'], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while updating the property.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}
