const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const indexHtml = path.join(buildDir, 'index.html');
const html404 = path.join(buildDir, '404.html');

try {
  if (fs.existsSync(indexHtml)) {
    fs.copyFileSync(indexHtml, html404);
    console.log('✅ 404.html creado exitosamente');
  } else {
    console.error('❌ No se encontró index.html en build/');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error copiando index.html a 404.html:', error);
  process.exit(1);
}

