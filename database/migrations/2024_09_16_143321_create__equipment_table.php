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
        Schema::create('Equipment', function (Blueprint $table) {
            $table->id();  // Auto-incrementing ID
            $table->string('equipment_name')->nullable();  // Equipment name
            $table->string('model_pnc')->nullable();  // Model/PNC
            $table->string('company_name')->nullable();  // Company name
            $table->string('type')->nullable();  // Type of equipment
            $table->string('subtype')->nullable();  // Subtype of equipment
            // $table->decimal('price', 10, 2);  // Price with 2 decimal places
            // $table->string('purchase_date')->nullable();  // Purchase date, can be null
            // $table->enum('warranty_status', ['Yes', 'No'])->default('No');  // Warranty status
            $table->string('serial_number')->nullable();  // Serial number, can be null
            // $table->enum('status', ['Active', 'Inactive', 'Deprecated'])
            //       ->default('Active')
            //       ->nullable();  // Status of the equipment
            // $table->date('maintenance_date')->nullable();  // Last maintenance date, can be null
            $table->timestamps();  // Created_at and updated_at columns
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Equipment');
    }
};
