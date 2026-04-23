const fs = require('fs');
const dockerfilePath = 'C:/Users/hp/Desktop/land-commerce-api/Dockerfile';
let content = fs.readFileSync(dockerfilePath, 'utf8');

// After "COPY . ." add a line that copies .env.example to .env if not present
const oldLine = '# ── Dépendances PHP ───────────────────────────────────────────────────────────\nRUN composer install --optimize-autoloader --no-dev --no-interaction';
const newLine = '# ── Préparer le fichier .env pour le build ───────────────────────────────────\nRUN cp .env.example .env\n\n# ── Dépendances PHP ───────────────────────────────────────────────────────────\nRUN composer install --optimize-autoloader --no-dev --no-interaction';

if (content.includes(oldLine)) {
    content = content.replace(oldLine, newLine);
    fs.writeFileSync(dockerfilePath, content);
    console.log('Dockerfile fixed: .env.example will be copied before composer install ✓');
} else {
    console.log('Pattern not found. Current content:');
    console.log(content);
}
