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
        Schema::create('multi_enquiry', function (Blueprint $table) {
            $table->id(); // Auto-incremental ID
            $table->string('name'); // Name column
            $table->string('email'); // Email column
            $table->string('contact_number'); // Contact number column
            $table->text('message'); // Message column
            $table->string('status')->nullable(); // status of Enquiry
            $table->string('remark')->nullable(); // remarks for Enquiry status
            $table->integer('type')->nullable();//0=contact_us/1=buy/2=sell
            $table->string('updated_by')->nullable();
            $table->timestamps(); // Created at and updated at timestamps 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_us');
    }
};
