const fs = require('fs');
let content = fs.readFileSync('src/views/DashboardView.tsx', 'utf-8');
content = content.replace('w-full h-full object-contain', 'w-full h-full object-cover'); // Only replaces the first occurrence, which is the banner
fs.writeFileSync('src/views/DashboardView.tsx', content);
