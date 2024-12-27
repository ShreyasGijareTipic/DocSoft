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
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->timestamps();$table->string('equipment_name');  // Equipment name
            $table->string('model');  // Model
            $table->string('company_name');  // Company name
            $table->string('type');  // Type of equipment
            $table->string('subtype')->nullable();  // Subtype of equipment
            $table ->string('show')->nullable();  

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
