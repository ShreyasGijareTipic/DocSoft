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
        Schema::create('catalog', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('catalog_name'); // Catalog name
            $table->string('catalog_desc'); // Description of catalog
            $table->string('img_address'); // Image path
            $table->integer('qty');
            $table->timestamps(); // Created at and updated at timestamps

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('catalog');
    }
};
