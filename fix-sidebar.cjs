const fs = require('fs');

let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

const newMenu = `const MENU = [
  { id: 'dashboard', label: 'Dashboard', subtitle: 'Ringkasan Lahan', icon: 'dashboard' },
  { id: 'pemantauan', label: 'Pemantauan', subtitle: 'Cek Kondisi', icon: 'psychiatry' },
  { id: 'pemupukan', label: 'Perawatan', subtitle: 'Pupuk & Hama', icon: 'compost' },
  { id: 'kocor', label: 'Kalkulator', subtitle: 'Hitung Dosis Kocor', icon: 'water_drop' },
  { id: 'jenis-hama', label: 'Ensiklopedia', subtitle: 'Jenis Hama', icon: 'bug_report' },
  { id: 'keuangan', label: 'Keuangan', subtitle: 'Biaya & Profit', icon: 'payments' },
  { id: 'log', label: 'Log Aktivitas', subtitle: 'Riwayat Tani', icon: 'history' },
  { id: 'pengaturan', label: 'Pengaturan', subtitle: 'Sistem', icon: 'settings' },
];`;

content = content.replace(/const MENU = \[[\s\S]*?\];/, newMenu);

const oldButton = `<span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>`;

const newButton = `<span className="material-symbols-outlined shrink-0">{item.icon}</span>
                <div className="flex flex-col min-w-0">
                  <span className="truncate">{item.label}</span>
                  <span className={\`text-[10px] font-mono uppercase tracking-wider truncate \${currentView === item.id ? 'text-black/70' : 'text-on-surface-muted/70'}\`}>{item.subtitle}</span>
                </div>`;

content = content.replace(oldButton, newButton);

content = content.replace(/px-4 min-h-\[48px\] text-left/, "px-4 py-2 min-h-[56px] text-left");

fs.writeFileSync('src/components/Sidebar.tsx', content);
