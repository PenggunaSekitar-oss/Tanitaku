const fs = require('fs');
let code = fs.readFileSync('src/views/DashboardView.tsx', 'utf-8');
code = code.replace(
  /src="\/banner\.png"/g,
  'src="https://res.cloudinary.com/ddc26noa/image/upload/v1784590990/1784563793022_mnva4t.png"'
);
fs.writeFileSync('src/views/DashboardView.tsx', code);
