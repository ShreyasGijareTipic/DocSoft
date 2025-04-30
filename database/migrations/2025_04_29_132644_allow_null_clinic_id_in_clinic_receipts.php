<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AllowNullClinicIdInClinicReceipts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('clinic_receipts', function (Blueprint $table) {
            $table->unsignedBigInteger('clinic_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('clinic_receipts', function (Blueprint $table) {
            $table->unsignedBigInteger('clinic_id')->nullable(false)->change();
        });
    }
}