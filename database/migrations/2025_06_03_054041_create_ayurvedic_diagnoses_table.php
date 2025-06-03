<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('ayurvedic_diagnoses', function (Blueprint $table) {
        $table->id();
        $table->string('p_p_i_id')->constrained('prescription_patient_info')->onDelete('cascade'); ;
        $table->text('occupation')->nullable();
        $table->string('pincode')->nullable();
        $table->text('email')->nullable();
        $table->text('past_history')->nullable();
        $table->text('prasavvedan_parikshayein')->nullable();
        $table->text('habits')->nullable();
        $table->text('lab_investigation')->nullable();
        $table->text('personal_history')->nullable();
        $table->text('food_and_drug_allergy')->nullable();
        $table->text('lmp')->nullable();
        $table->text('edd')->nullable();
        $table->timestamps();

        // Optional: Foreign key constraint
        // $table->foreign('doctor_id')->references('id')->on('users')->onDelete('cascade');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ayurvedic_diagnoses');
    }
};
