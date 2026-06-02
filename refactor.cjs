const fs = require('fs');
let content = fs.readFileSync('src/components/BlocksUniverse.tsx', 'utf8');
content = content.replace(/\\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('src/components/BlocksUniverse.tsx', content);
