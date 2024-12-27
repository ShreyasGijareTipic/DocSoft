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
        Schema::create('service_reports', function (Blueprint $table) {
        //customer Details
            $table->id();
            $table->string('customer_id');
            $table->string('customer_name');
            $table->string('address');
            $table->string('contact_person');
            $table->string('email');
            $table->string('mobile');
            $table->string('signature_path');
            $table->string('signature_by');

        //Equipment Details
            $table->string('equipment_id');
            $table->string('location');
            $table->string('equipment_name');
            $table->string('serial_no')->nullable();
            $table->string('model')->nullable();
            $table->string('brand_name');

        //Service Report
            $table->string('call_type');
            $table->string('nature_complaint')->nullable();
            $table->string('actual_fault')->nullable();
            $table->string('action_taken')->nullable();
            $table->string('customer_suggestion')->nullable();
            

        //Extra Feilds for Analysis and Service Person
            $table->string('status');
            $table->string('created_by');
           $table->string('user_signature');
           
            $table->string('updated_by')->nullable();  // Nullable integer (e.g., user ID)
             // Model
            $table->string('company_name');  // Company name
            $table->string('type');  // Type of equipment
            $table->string('subtype')->nullable();  // Subtype of equipment
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_reports');
    }
};
