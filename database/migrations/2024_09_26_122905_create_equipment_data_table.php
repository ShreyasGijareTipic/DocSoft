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
        Schema::create('equipment_data', function (Blueprint $table) {
            $table->id();
            $table->string('location'); 
            $table->string('equipment_name');  
            $table->string('brand_name')->nullable(); 
            $table->string('model')->nullable();  
            $table->string('serial_no')->nullable();
            $table ->string('show')->nullable();  
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_data');
    }
};
