<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_admin' => true,
        ]);

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'property_code' => 'required|string|min:3',
        ]);

        // First get the user with password for authentication
        $authUser = \DB::connection('mysql')
            ->table('users')
            ->where('email', $request->email)
            ->select('users.*') // Include all user fields including password
            ->first();

        if (!$authUser || !Hash::check($request->password, $authUser->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Now get the full user details with joins
        $user = \DB::connection('mysql')
            ->table('users')
            ->leftJoin('company_master', 'users.cmp_id', '=', 'company_master.id')
            ->leftJoin('property_master', 'users.prop_id', '=', 'property_master.id')
            ->leftJoin('roles_master', 'users.role_id', '=', 'roles_master.id')
            ->where('users.email', $request->email)
            ->select(
                'users.id', // Important for tokenable_id
                'users.cmp_id',
                'users.prop_id',
                'users.role_id',
                'users.name as user_name',
                'users.email as user_email',
                'company_master.company_name',
                'company_master.company_code',
                'property_master.property_name',
                'property_master.property_code',
                'property_master.city',
                'property_master.contact_number',
                'roles_master.role_name'
            )
            ->first();
        if($request->property_code != $user->property_code ){
            return response()->json(['message' => 'Invalid Property Code'], 401);
        }

        $databaseName = 'property_' . $request->property_code;
        config(['database.connections.mysql2.database' => $databaseName]);
        DB::purge('mysql2');
        DB::reconnect('mysql2');

        $plainToken = Str::random(60);
        $hashedToken = hash('sha256', $plainToken);

        DB::connection('mysql')->table('personal_access_tokens')->insert([
            'tokenable_type' => 'App\Models\User', // Use the actual User model class
            'tokenable_id' => $authUser->id,
            'name' => 'auth_token',
            'token' => $hashedToken,
            'abilities' => json_encode(['*']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'user' => $user,
            'token' => $plainToken,
            'property_code' => $request->property_code,
        ]);
    }



    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        $token = $request->user()->currentAccessToken();
        
        $user = \DB::connection('mysql')
            ->table('users')
            ->leftJoin('company_master', 'users.cmp_id', '=', 'company_master.id')
            ->leftJoin('property_master', 'users.prop_id', '=', 'property_master.id')
            ->leftJoin('roles_master', 'users.role_id', '=', 'roles_master.id')
            ->where('users.id', $request->user()->id)
            ->select(
                'users.id',
                'users.cmp_id',
                'users.prop_id',
                'users.role_id',
                'users.name as user_name',
                'users.email as user_email',
                'company_master.company_name',
                'company_master.company_code',
                'property_master.property_name',
                'property_master.property_code',
                'property_master.city',
                'property_master.contact_number',
                'roles_master.role_name'
            )
            ->first();
        return response()->json($user);
    }
}
