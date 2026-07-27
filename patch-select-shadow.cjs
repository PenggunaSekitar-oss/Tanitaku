const fs = require('fs');

// Patch Select.tsx
let sel = fs.readFileSync('src/components/Select.tsx', 'utf-8');
sel = sel.replace(
  /shadow-\[6px_6px_0px_0px_#000\]/g,
  ""
);
fs.writeFileSync('src/components/Select.tsx', sel);
