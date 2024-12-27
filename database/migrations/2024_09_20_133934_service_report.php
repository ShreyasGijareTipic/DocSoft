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
            $table->id();
            $table->string('serial_no');
            $table->string('call_type');
            $table->string('nature_complaint');
            $table->string('actual_fault');
            $table->string('action_taken');
            $table->string('customer_suggestion');
            $table->string('status');
            $table->string('customer_name');
            $table->string('address');
            $table->string('email');
            $table->string('contact_person'); 
            $table->string('mobile');
            $table->string('updated_by')->nullable();  // Nullable integer (e.g., user ID)
            $table->string('model');  // Model
            $table->string('company_name');  // Company name
            $table->string('type');  // Type of equipment
            $table->string('subtype')->nullable();  // Subtype of equipment
            $table->string('equipment_id');
            $table->string('user_id');
            $table->string('customer_id');
            
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
