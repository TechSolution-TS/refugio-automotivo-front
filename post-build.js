const fs = require('fs');
const path = require('path');

const distPath = './dist';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/NG_APP_API_URL_PLACEHOLDER/g, process.env.NG_APP_API_URL || 'http://localhost:8080');
  content = content.replace(/NG_APP_API_KEY_PLACEHOLDER/g, process.env.NG_APP_API_KEY || 'JURIDICO_TESTE');
  
  fs.writeFileSync(filePath, content);
}

function processDistFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDistFiles(filePath);
    } else if (file.endsWith('.js')) {
      replaceInFile(filePath);
    }
  });
}

if (fs.existsSync(distPath)) {
  processDistFiles(distPath);
  console.log('Environment variables replaced successfully!');
}