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
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bill_id'); // Foreign key to the patients table
            $table->string('medicine');              // Name of the medicine
            $table->string('dosage');                // Dosage (e.g., 500mg)
            $table->string('timing');                // Timing (e.g., Morning, Night)
            $table->string('frequency');             // Frequency (e.g., Twice a day)
            $table->string('duration');              // Duration (e.g., 7 days)
            $table->timestamps();

            // Define the foreign key constraint
            $table->foreign('bill_id')->references('id')->on('bills')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prescriptions');
    }
};
