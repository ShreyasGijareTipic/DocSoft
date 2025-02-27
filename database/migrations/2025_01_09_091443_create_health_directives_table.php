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
        Schema::create('health_directives', function (Blueprint $table) {
            $table->id();
            $table->string('p_p_i_id')->constrained('prescription_patient_info')->onDelete('cascade'); // Foreign key to the patients table
            $table->string('medicine');              // Name of the medicine
            $table->string('dosage');                // Dosage (e.g., 500mg)
            $table->string('timing');                // Timing (e.g., Morning, Night)
            $table->string('frequency');             // Frequency (e.g., Twice a day)
            $table->string('duration');              // Duration (e.g., 7 days)
            $table->timestamps();

            // Define the foreign key constraint
            // $table->foreign('p_p_i_id')->references('id')->on('prescription_patient_info')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('health_directives');
    }
};
