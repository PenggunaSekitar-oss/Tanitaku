const fs = require('fs');
let code = fs.readFileSync('src/views/DashboardView.tsx', 'utf-8');

code = code.replace(
  `{isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pt-4 border-t border-outline">`,
  `{isOpen && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pt-4 border-t border-outline">`
);
fs.writeFileSync('src/views/DashboardView.tsx', code);
