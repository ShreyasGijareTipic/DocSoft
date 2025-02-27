<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clinic', function (Blueprint $table) {
            $table->id();
            $table->string('clinic_name');
            $table->string('logo');
            $table->text('clinic_address');
            $table->string('clinic_registration_no')->unique();
            $table->string('clinic_mobile');
            $table->string('clinic_whatsapp_url');
            $table->string('clinic_permanant_tokan')->unique();
            $table->string('clinic_webhook_tokan')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clinic');
    }
};
