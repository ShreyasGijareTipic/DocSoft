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
        Schema::create('report_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('report_id');
            $table->foreign('report_id')->references('id')->on('reports')->onDelete('cascade');
            $table->integer('created_by')->unsigned();//user id of creater
            $table->string('nature_complaint')->nullable();
            $table->string('actual_fault')->nullable();
            $table->string('action_taken')->nullable();
            $table->tinyInteger('remark')->unsigned();//user id of creater
            $table->string('customer_suggestion')->nullable();
            $table->string('signature_by'); // Customer signaturers name 
            $table->longText('signature');  // Customer signature as BLOB
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_details');
    }
};
