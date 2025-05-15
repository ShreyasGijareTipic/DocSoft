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
        Schema::table('patient_examinations', function (Blueprint $table) {
            $table->string('weight')->nullable()->after('pulse'); // You can change the position as needed
            $table->string('height')->nullable()->after('weight');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patient_examinations', function (Blueprint $table) {
            $table->dropColumn(['weight', 'height']);
        });
    }
};
