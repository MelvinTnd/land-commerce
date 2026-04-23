const fs = require('fs');
const path = require('path');
const d = 'C:/Users/hp/Desktop/land-commerce-api/database/migrations';
const file = fs.readdirSync(d).find(f => f.includes('add_image_to_products_table'));

const content = `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'image')) {
                $table->string('image')->nullable()->after('sku');
            }
            if (!Schema::hasColumn('products', 'images')) {
                $table->json('images')->nullable()->after('image');
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['image', 'images']);
        });
    }
};
`;

fs.writeFileSync(path.join(d, file), content);
console.log('Migration updated successfully.');
