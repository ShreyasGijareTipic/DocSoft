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
        Schema::create('scrap_enquiry', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('first_name'); // First name
            $table->string('last_name'); // Last name
            $table->string('email'); // Email
            $table->string('mobile'); // Mobile number
            $table->string('location'); // Location
            $table->string('vehicle_category'); // Vehicle category
            $table->string('vehicle_registration_number'); // Vehicle registration number
            $table->string('vehicle_description')->nullable(); // Vehicle Description
            $table->string('vehicle_manufacturer'); // Vehicle Brand
            $table->string('registration_source'); // eg. Dealer/ Owner/RTO
            $table->string('scrap_purpose'); // eg. Accidental/Expiry
            $table->string('status')->nullable(); // status of Enquiry
            $table->string('remark')->nullable(); // remarks for Enquiry status
            $table->string('updated_by')->nullable(); // 
            $table->timestamps(); // Created at and updated at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inquiry');
    }
};
