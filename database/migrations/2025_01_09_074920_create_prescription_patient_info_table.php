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
        Schema::create('prescription_patient_info', function (Blueprint $table) {
            $table->id();

            $table->string('patient_name');
            $table->string('patient_address');
            $table->string('patient_email')->nullable();
            $table->string('patient_contact');
            $table->date('patient_dob')->nullable();
            $table->string('doctor_name');
            $table->string('registration_number');
            $table->date('visit_date');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prescription_patient_info');
    }
};
