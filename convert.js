const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'src', 'models');

// Lire tous les fichiers .js dans models/
fs.readdirSync(modelsDir).forEach(file => {
  if (!file.endsWith('.js')) return;
  
  const filePath = path.join(modelsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Convertir import en require
  content = content.replace(/import\s+mongoose\s+from\s+['"]mongoose['"]/g, "const mongoose = require('mongoose')");
  content = content.replace(/import\s+bcrypt\s+from\s+['"]bcryptjs['"]/g, "const bcrypt = require('bcryptjs')");
  
  // Convertir export default en module.exports
  content = content.replace(/export\s+default\s+/g, 'module.exports = ');
  
  fs.writeFileSync(filePath, content);
  console.log(` Converti: ${file}`);
});

console.log(' Conversion terminée !');