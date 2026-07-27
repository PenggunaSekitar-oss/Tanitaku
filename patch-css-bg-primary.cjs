const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

code = code.replace(
  /:root:not\(\.light\) \.bg-primary \{[\s\S]*?\}/,
  ''
);

code += `\n.bg-primary { color: #ffffff !important; font-weight: 900 !important; }\n`;
code += `\n.font-mono { font-weight: 900 !important; }\n`;

// They said "semua warna hijau pada mode light ubah menjadi warna kuning"
// The success color in light mode is currently #10b981
code = code.replace('--success-color: #10b981;', '--success-color: #facc15;');

// They also said "warna kuning seperti kuning footer bawah dengan text putih tebal (semua komponen)"
// It means bg-success should have white bold text!
code += `\n.bg-success { color: #ffffff !important; font-weight: 900 !important; }\n`;

fs.writeFileSync('src/index.css', code);
