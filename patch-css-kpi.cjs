const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

code += `\n.kpi-card-blue { background-color: #002147 !important; border-color: #000000 !important; }\n`;
code += `.kpi-card-blue * { color: #ffffff !important; font-weight: 900 !important; }\n`;

fs.writeFileSync('src/index.css', code);
