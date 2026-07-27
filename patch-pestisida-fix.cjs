const fs = require('fs');
let code = fs.readFileSync('src/views/CariPestisidaView.tsx', 'utf-8');

code = code.replace(
  /if \(jenisInput\) \{\n\s*if \(item\.jenis === jenisInput\) \{\n\s*score \+= 10;\n\s*\} else \{\n\s*isMatch = false;\n\s*\}\n\s*\}/g,
  ``
);

fs.writeFileSync('src/views/CariPestisidaView.tsx', code);
