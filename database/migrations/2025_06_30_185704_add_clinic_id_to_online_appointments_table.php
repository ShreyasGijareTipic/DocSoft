<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('online_appointments', function (Blueprint $table) {
            $table->unsignedBigInteger('clinic_id')->nullable()->after('id');
            // If you have a clinics table and want to enforce a relationship:
            // $table->foreign('clinic_id')->references('id')->on('clinics')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('online_appointments', function (Blueprint $table) {
            $table->dropColumn('clinic_id');
            // If you used foreign key:
            // $table->dropForeign(['clinic_id']);
        });
    }
};
