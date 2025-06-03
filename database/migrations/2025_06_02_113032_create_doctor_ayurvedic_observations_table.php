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
    Schema::create('doctor_ayurvedic_observations', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('doctor_id');
        $table->boolean('occupation')->default(0);
        $table->boolean('pincode')->default(0);
        $table->boolean('email')->default(0);
        $table->boolean('past_history')->default(0);
        $table->boolean('prasavvedan_parikshayein')->default(0); // प्रसववेदन परीक्षाएं + आश्रित + काल
        $table->boolean('habits')->default(0); // eating habits/addictions
        $table->boolean('lab_investigation')->default(0);
        $table->boolean('personal_history')->default(0);
        $table->boolean('food_and_drug_allergy')->default(0);
        $table->boolean('lmp')->default(0); // last menstrual period + weeks + days
        $table->boolean('edd')->default(0); // expected date of delivery
        $table->timestamps();

        // Foreign key constraint (optional, if doctor table exists)
        $table->foreign('doctor_id')->references('id')->on('users')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctor_ayurvedic_observations');
    }
};
