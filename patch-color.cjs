const fs = require('fs');
let content = fs.readFileSync('src/views/CariBibitView.tsx', 'utf-8');

content = content.replace(
  'className="col-span-2 bg-primary/10 p-2 border border-primary/20 rounded-sm flex flex-col gap-0.5"',
  'className="col-span-2 bg-action/10 p-2 border border-action/20 rounded-sm flex flex-col gap-0.5"'
);

content = content.replace(
  'className="text-[9px] font-bold uppercase tracking-wider text-primary"',
  'className="text-[9px] font-bold uppercase tracking-wider text-action"'
);

content = content.replace(
  'className="text-sm font-bold text-primary-dark"',
  'className="text-sm font-bold text-on-surface"'
);

fs.writeFileSync('src/views/CariBibitView.tsx', content);
