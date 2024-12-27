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
        Schema::create('customer_info', function (Blueprint $table) {
            $table->id();  // Auto-incrementing ID
            $table->timestamps();  // Created_at and updated_at columns
            $table->string('customer_name');
            $table->string('address');
            $table->string('contact_person');
            $table->string('email');
            $table->string('mobile');
            $table->string('block');
            $table->string('show')->nullable();  // Default value is true
            $table->integer('updated_by')->nullable();  // Nullable integer (e.g., user ID)
            $table->unsignedBigInteger('created_by')->nullable();  // Nullable to allow null values
            $table->unsignedBigInteger('deleted_by')->nullable();  // Nullable to allow null values

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_info');
    }
};
