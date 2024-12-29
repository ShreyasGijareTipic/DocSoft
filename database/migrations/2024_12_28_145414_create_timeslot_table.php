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
        Schema::create('timeslot', function (Blueprint $table) {
            $table->id();
            $table->integer('doctor_id'); 
            $table->time('time'); // Time field
            $table->integer('slot'); // Number of slots available
            $table->timestamps(); // Created_at and Updated_at timestamps

            // Foreign key constraint
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timeslot');
    }
};
