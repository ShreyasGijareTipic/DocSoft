<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up()
{
    Schema::table('bills', function (Blueprint $table) {
        $table->string('occupation')->nullable()->after('patient_dob');
        $table->string('pincode')->nullable()->after('occupation');
    });
}

public function down()
{
    Schema::table('bills', function (Blueprint $table) {
        $table->dropColumn(['occupation', 'pincode']);
    });
}

};
