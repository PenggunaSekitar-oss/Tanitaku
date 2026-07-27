const fs = require('fs');

let bibit = fs.readFileSync('src/views/CariBibitView.tsx', 'utf-8');

bibit = bibit.replace(
  "  if (k.includes('jagung')) return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400';",
  "  if (k.includes('jagung')) return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400';\n  if (k.includes('bayam') || k.includes('kangkung')) return 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&q=80&w=400';\n  if (k.includes('pepaya')) return 'https://images.unsplash.com/photo-1517282009859-f000eca3bca2?auto=format&fit=crop&q=80&w=400';\n  if (k.includes('wortel')) return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=400';\n  if (k.includes('kentang')) return 'https://images.unsplash.com/photo-1518977672859-67d10e05697d?auto=format&fit=crop&q=80&w=400';"
);

fs.writeFileSync('src/views/CariBibitView.tsx', bibit);
