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
        Schema::create('drugs_details', function (Blueprint $table) {
            $table->id();
            $table->string('drug_id')->constrained('drugs')->onDelete('cascade');
            $table->string('dosage_form');
            $table->string('strength');
            $table->string('price');
            $table->string('stock_quantity');
            $table->date('expiration_date');
            $table->text('side_effects')->nullable();
            $table->text('usage_instructions')->nullable();
            $table->text('storage_conditions')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drugs_details');
    }
};
