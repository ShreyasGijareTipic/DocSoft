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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->integer('customer_id')->unsigned();
            $table->string('customer_name');
            $table->string('address');
            $table->string('contact_person');
            $table->string('email');
            $table->bigInteger('mobile')->unsigned();
       
        //Equipment Details
            $table->string('equipment_id');
            $table->string('location');
            $table->string('equipment_name');
            $table->string('serial_no')->nullable();
            $table->string('model')->nullable();
            $table->string('brand_name')->nullable();

           
        //Extra Feilds for Analysis and Service Person
            $table->tinyInteger('call_type')->unsigned();//1= installation //2=
            $table->tinyInteger('closed')->default(0);
            $table->integer('created_by')->unsigned();//user id of creater
            $table->integer('assigned_by')->unsigned();//admin or user
            $table->integer('updated_by')->unsigned()->nullable();//user id of updater
            $table->timestamps();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
