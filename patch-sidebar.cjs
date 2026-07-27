const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

code = code.replace(
  "bg-[#0000FF] text-black font-bold",
  "bg-primary text-white font-bold"
).replace(
  "text-black font-bold' : 'text-on-surface-muted/70'",
  "text-white font-bold' : 'text-on-surface-muted/70'"
);

fs.writeFileSync('src/components/Sidebar.tsx', code);
