const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

code = code.replace(
  "--success-color: #34d399;",
  "--success-color: #eab308;"
);

fs.writeFileSync('src/index.css', code);
