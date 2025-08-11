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
        Schema::create('baby_pediatric_observations', function (Blueprint $table) {
            $table->id();
             $table->string('p_p_i_id')->constrained('bills')->onDelete('cascade');
             $table->integer('patient_id');
             $table->integer('doctor_id'); 
             $table->float('weight')->nullable();
             $table->float('height')->nullable();
             $table->float('head_circumference')->nullable();
             $table->float('temperature')->nullable();
             $table->integer('heart_rate')->nullable();
             $table->integer('respiratory_rate')->nullable();
             $table->text('vaccinations_given')->nullable();
             $table->text('milestones_achieved')->nullable();
             $table->text('remarks')->nullable();
             $table->unsignedBigInteger('created_by')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('baby_pediatric_observations');
    }
};
