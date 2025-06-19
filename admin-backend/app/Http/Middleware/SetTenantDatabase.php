<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SetTenantDatabase
{
    public function handle(Request $request, Closure $next)
    {
        $propertyCode = $request->header('X-Property-Code');

        if ($propertyCode) {
            $dbName = 'property_' . $propertyCode;
            config(['database.connections.mysql2.database' => $dbName]);
            DB::purge('mysql2');
            DB::reconnect('mysql2');
        }

        return $next($request);
    }
}