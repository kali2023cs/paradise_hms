<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('block_master', function (Blueprint $table) {
            $table->unsignedBigInteger('created_by')->nullable()->after('block_name');
            $table->unsignedBigInteger('updated_by')->nullable()->after('created_by');

            // No foreign key constraints added here
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('block_master', function (Blueprint $table) {
            $table->dropColumn(['created_by', 'updated_by']);
        });
    }
};
