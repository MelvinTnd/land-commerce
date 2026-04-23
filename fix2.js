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
            $table->string('image')->nullable();
            $table->json('images')->nullable();
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

// Now fix composer.json to remove post-install-cmd
const composerFile = 'C:/Users/hp/Desktop/land-commerce-api/composer.json';
let composer = JSON.parse(fs.readFileSync(composerFile, 'utf8'));
if (composer.scripts && composer.scripts['post-install-cmd']) {
    composer.scripts['post-install-cmd'] = composer.scripts['post-install-cmd'].filter(
        cmd => !cmd.includes('migrate')
    );
    fs.writeFileSync(composerFile, JSON.stringify(composer, null, 4));
}
console.log('Fixed migration and composer.json');
