const fs = require('fs');
let code = fs.readFileSync('src/views/DashboardView.tsx', 'utf-8');

code = code.replace(
  /<div className="p-4 md:p-6 overflow-y-auto flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-6 hide-scrollbar">/g,
  '<div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">\n              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">'
);

code = code.replace(
  /                \)\)\n              \)}\n            <\/div>/g,
  '                ))\n              )}\n              </div>\n            </div>'
);

fs.writeFileSync('src/views/DashboardView.tsx', code);
