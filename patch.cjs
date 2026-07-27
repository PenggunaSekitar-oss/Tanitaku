const fs = require('fs');

let pemantauan = fs.readFileSync('src/views/PemantauanView.tsx', 'utf-8');
pemantauan = pemantauan.replace(
  /\{t\.status === 'Panen' \? \([\s\S]*?<span className="bg-success text-white font-bold text-xs uppercase px-2 py-0\.5 rounded-\[4px_2px_4px_2px\] neo-border-thin shadow-\[2px_2px_0px_0px_#000\]">Sudah Panen<\/span>\n\s*\) : \(/m,
  `{t.status === 'Panen' ? (
                            <>
                              <span className="bg-success text-white font-bold text-xs uppercase px-2 py-0.5 rounded-[4px_2px_4px_2px] neo-border-thin shadow-[2px_2px_0px_0px_#000]">Sudah Panen</span>
                              <button onClick={() => handleDeleteTanaman(t.id)} className="p-1 bg-background border border-outline rounded-sm text-on-surface-muted hover:text-danger hover:border-danger transition">
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </>
                          ) : (`
);
fs.writeFileSync('src/views/PemantauanView.tsx', pemantauan);

let dashboard = fs.readFileSync('src/views/DashboardView.tsx', 'utf-8');
dashboard = dashboard.replace(
  /\{tanaman\.length === 0 \? \(/g,
  "{tanaman.filter(t => t.status !== 'Panen').length === 0 ? ("
);
dashboard = dashboard.replace(
  /tanaman\.map\(\(t\) => \(/g,
  "tanaman.filter(t => t.status !== 'Panen').map((t) => ("
);
fs.writeFileSync('src/views/DashboardView.tsx', dashboard);
