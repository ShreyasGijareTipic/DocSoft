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
        Schema::create('online_appointments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->date('date');
            $table->string('time');
            $table->string('status');
            $table->string('service');
            $table->boolean('reminder_sent')->default(false);
            $table->timestamps();
 
            $table->unique(['date', 'time']); // ✅ Unique constraint - it will prevent from duplicate entry
        });
    }
 
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('online_appointments');
    }
};