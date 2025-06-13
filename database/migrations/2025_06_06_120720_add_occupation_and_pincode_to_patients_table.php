<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up()
{
    Schema::table('patients', function (Blueprint $table) {
        $table->string('occupation')->nullable()->after('dob');
        $table->string('pincode')->nullable()->after('occupation');
    });
}

public function down()
{
    Schema::table('patients', function (Blueprint $table) {
        $table->dropColumn(['occupation', 'pincode']);
    });
}
};
