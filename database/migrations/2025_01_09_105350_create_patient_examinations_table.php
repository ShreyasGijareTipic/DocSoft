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
        Schema::create('patient_examinations', function (Blueprint $table) {
            $table->id();
            $table->string('p_p_i_id')->constrained('prescription_patient_info')->onDelete('cascade');  // Foreign key referencing bills table
            $table->string('bp')->nullable(); // Blood Pressure
            $table->string('pulse')->nullable(); // Pulse
            $table->text('past_history')->nullable(); // Past History
            $table->text('complaints')->nullable(); // Complaints
            $table->text('systemic_exam_general')->nullable(); // Systemic Examination - General
            $table->text('systemic_exam_pa')->nullable(); // Systemic Examination - PA
            $table->timestamps();

            // Define foreign key relationship with bills table
           // $table->foreign('bill_id')->references('id')->on('bills')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_examinations');
    }
};
