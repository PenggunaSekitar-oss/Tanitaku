const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace(
  "case 'cari-penyakit': return <CariPenyakitView />;",
  "case 'cari-penyakit': return <CariPenyakitView navigate={setCurrentView} />;"
);
fs.writeFileSync('src/App.tsx', app);
