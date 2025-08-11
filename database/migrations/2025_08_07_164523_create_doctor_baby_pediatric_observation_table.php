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
        Schema::create('doctor_baby_pediatric_observations', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('doctor_id');
            $table->boolean('weight')->default(0);
            $table->boolean('height')->default(0);
            $table->boolean('head_circumference')->default(0);
            $table->boolean('temperature')->default(0);
            $table->boolean('heart_rate')->default(0);
            $table->boolean('respiratory_rate')->default(0);
            $table->boolean('vaccinations_given')->default(0);
            $table->boolean('milestones_achieved')->default(0);
            $table->boolean('remarks')->default(0);

            $table->timestamps();

            // Foreign key (if doctors table is users)
            $table->foreign('doctor_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctor_baby_pediatric_observations');
    }
};
