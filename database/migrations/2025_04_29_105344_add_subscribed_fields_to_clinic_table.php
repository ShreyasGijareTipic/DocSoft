<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('clinic', function (Blueprint $table) {
            $table->integer('subscribed_plan')->default(1)->after('clinic_webhook_tokan');
            $table->date('subscription_validity')->nullable()->after('subscribed_plan');
            $table->unsignedBigInteger('refer_by_id')->nullable()->after('subscription_validity');
            $table->foreign('refer_by_id')->references('id')->on('users');
        });
    }
    
    public function down()
    {
        Schema::table('clinic', function (Blueprint $table) {
            $table->dropColumn('subscribed_plan');
            $table->dropColumn('subscription_validity');
            $table->dropForeign('company_info_refer_by_id_foreign');
            $table->dropColumn('refer_by_id');
        });
    }
};
