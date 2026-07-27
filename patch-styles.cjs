const fs = require('fs');

// Patch Select.tsx
let sel = fs.readFileSync('src/components/Select.tsx', 'utf-8');
sel = sel.replace(
  /rounded-\[12px_4px_12px_4px\] bg-surface-high neo-border-thin shadow-\[3px_3px_0px_0px_#000\] transition-all duration-200 ease-in-out \${disabled \? 'pointer-events-none' : 'cursor-pointer hover:bg-surface'} \${isOpen \? 'shadow-\[0px_0px_0px_0px_#000\] translate-y-\[3px\] translate-x-\[3px\]' : ''}/g,
  "rounded-[8px_3px_8px_3px] bg-surface-high neo-border-thin ${disabled ? 'pointer-events-none' : 'cursor-pointer hover:bg-surface'}"
);
// Also patch the dropdown container style to make it less crazy rounded, let's match the inputs.
sel = sel.replace(
  /rounded-\[16px_8px_16px_8px\]/g,
  "rounded-[8px_3px_8px_3px]"
);
fs.writeFileSync('src/components/Select.tsx', sel);

// Patch CariBibitView.tsx inputs
let bibit = fs.readFileSync('src/views/CariBibitView.tsx', 'utf-8');
bibit = bibit.replace(
  /rounded-\[12px_4px_12px_4px\] shadow-\[3px_3px_0px_0px_#000\] focus:outline-none focus:shadow-\[1px_1px_0px_0px_#000\] focus:translate-y-\[2px\] focus:translate-x-\[2px\] transition-all duration-200/g,
  "rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0"
);
fs.writeFileSync('src/views/CariBibitView.tsx', bibit);
