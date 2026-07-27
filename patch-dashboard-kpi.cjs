const fs = require('fs');
let code = fs.readFileSync('src/views/DashboardView.tsx', 'utf-8');

code = code.replace(
  /<div className="neo-card-small p-3 flex flex-col justify-center">/g,
  '<div className="neo-card-small p-3 flex flex-col justify-center kpi-card-blue">'
);
code = code.replace(
  /<div className="flex justify-between items-center neo-card-small p-3">/g,
  '<div className="flex justify-between items-center neo-card-small p-3 kpi-card-blue">'
);

fs.writeFileSync('src/views/DashboardView.tsx', code);
