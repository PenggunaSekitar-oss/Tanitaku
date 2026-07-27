const fs = require('fs');
let code = fs.readFileSync('src/views/KeuanganView.tsx', 'utf-8');

code = code.replace(
  /<div className="bg-surface neo-border-thin p-3 rounded-\[8px_3px_8px_3px\] flex flex-col justify-between">/g,
  '<div className="bg-surface neo-border-thin p-3 rounded-[8px_3px_8px_3px] flex flex-col justify-between kpi-card-blue">'
);
code = code.replace(
  /<div className="col-span-2 bg-surface neo-border-thin p-3 rounded-\[8px_3px_8px_3px\] flex justify-between items-center">/g,
  '<div className="col-span-2 bg-surface neo-border-thin p-3 rounded-[8px_3px_8px_3px] flex justify-between items-center kpi-card-blue">'
);
code = code.replace(
  /<div className="flex-1 bg-surface neo-border-thin px-3 py-2 rounded-\[8px_3px_8px_3px\] flex flex-col text-center justify-center">/g,
  '<div className="flex-1 bg-surface neo-border-thin px-3 py-2 rounded-[8px_3px_8px_3px] flex flex-col text-center justify-center kpi-card-blue">'
);

fs.writeFileSync('src/views/KeuanganView.tsx', code);
