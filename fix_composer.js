const fs = require('fs');
const composerFile = 'C:/Users/hp/Desktop/land-commerce-api/composer.json';
const composer = JSON.parse(fs.readFileSync(composerFile, 'utf8'));

// Remove post-install-cmd entirely (key:generate runs at startup via docker-entrypoint.sh)
delete composer.scripts['post-install-cmd'];

// Also remove pre-package-uninstall to keep it clean
delete composer.scripts['pre-package-uninstall'];

fs.writeFileSync(composerFile, JSON.stringify(composer, null, 4) + '\n');
console.log('Done. composer.json cleaned.');
console.log('post-install-cmd:', composer.scripts['post-install-cmd'] || 'REMOVED ✓');
