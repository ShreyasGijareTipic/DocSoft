<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDoctorMedicalObservationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('doctor_medical_observations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('doctor_id');
            $table->boolean('bp')->default(0);
            $table->boolean('pulse')->default(0);
            $table->boolean('weight')->default(0);
            $table->boolean('height')->default(0);
            $table->boolean('systemic_examination')->default(0);
            $table->boolean('diagnosis')->default(0);
            $table->boolean('past_history')->default(0);
            $table->boolean('complaint')->default(0);
            $table->timestamps();
            
            $table->foreign('doctor_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('doctor_medical_observations');
    }
}