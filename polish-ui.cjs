const fs = require('fs');

// 1. Update BannerCarousel for dynamic dots
let banner = fs.readFileSync('src/components/BannerCarousel.tsx', 'utf-8');
banner = banner.replace(
  /className=\{`w-2 h-2 rounded-full transition-colors \$\{\s*index === currentIndex \? "bg-white" : "bg-white\/50"\s*\}`\}/,
  'className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-6 bg-white" : "w-2 bg-white/50"}`}'
);
fs.writeFileSync('src/components/BannerCarousel.tsx', banner);

// 2. Update DashboardView for subtitle, hover states, and smooth dropdown
let dashboard = fs.readFileSync('src/views/DashboardView.tsx', 'utf-8');

// Title area
const oldTitle = `<div className="flex items-center justify-between w-full">
        <h1 className="font-brutal font-black uppercase tracking-wider text-3xl text-on-surface">
          Dashboard Operasional
        </h1>
      </div>`;
const newTitle = `<div className="flex flex-col gap-1 w-full">
        <h1 className="font-brutal font-black uppercase tracking-wider text-3xl text-on-surface">
          Dashboard Operasional
        </h1>
        <p className="text-on-surface-muted text-sm font-medium">
          Pantauan aktivitas, jadwal, dan operasional harian lahan Anda
        </p>
      </div>`;
dashboard = dashboard.replace(oldTitle, newTitle);

// Replace RekomendasiTanamanItem
const oldComponentRegex = /function RekomendasiTanamanItem\(\{[^}]+\}[: ]+any\) \{[\s\S]*?return \([\s\S]*?\}\s*\)\s*;\s*\}/;

const newComponent = `function RekomendasiTanamanItem({ t, blokLahan }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const hst = calculateHST(t.tanggalTanam);
  const rekomendasi = getRecommendations(hst);
  const fase = determineFaseTanaman(hst);
  const blok = blokLahan.find((b: any) => b.id === t.blokId);

  return (
    <div className="neo-card-small p-4 bg-surface-high/30 hover:bg-surface/60 transition-colors flex flex-col gap-4 border border-outline">
      <div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 w-full flex items-center justify-between md:justify-start gap-4">
          <div>
            <h3 className="font-display font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
              {t.komoditas}{" "}
              <span className="text-on-surface-muted text-sm font-normal">
                ({t.varietas})
              </span>
            </h3>
            <span className="text-xs font-mono text-on-surface-muted">
              {blok?.nama || "Unknown"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-lg text-black bg-action px-2 py-0.5 rounded-[4px_2px_4px_2px] neo-border-thin shadow-[2px_2px_0px_0px_#000] inline-block">
              {hst}{" "}
              <span className="text-xs font-sans font-normal text-black/70">
                HST
              </span>
            </span>
            <span className={\`material-symbols-outlined text-on-surface transition-transform duration-300 \${isOpen ? 'rotate-180' : 'rotate-0'}\`}>
              expand_more
            </span>
          </div>
        </div>
      </div>

      <div className={\`grid transition-all duration-300 ease-in-out \${isOpen ? "grid-rows-[1fr] opacity-100 mt-2 pt-4 border-t border-outline" : "grid-rows-[0fr] opacity-0"}\`}>
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
            <div className="flex flex-col gap-2 p-3 bg-surface rounded-sm border border-outline">
              <span className="text-xs font-bold text-on-surface-muted uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-success">
                  compost
                </span>{" "}
                Rekomendasi Pupuk
              </span>
              <span className="text-sm font-sans leading-relaxed">
                {rekomendasi.pupuk}
              </span>
            </div>
            <div className="flex flex-col gap-2 p-3 bg-surface rounded-sm border border-outline">
              <span className="text-xs font-bold text-on-surface-muted uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-danger">
                  pest_control
                </span>{" "}
                Tindakan Pestisida
              </span>
              <span className="text-sm font-sans leading-relaxed">
                {rekomendasi.pestisida}
              </span>
            </div>
            <div className="flex flex-col gap-2 p-3 bg-surface rounded-sm border border-outline">
              <span className="text-xs font-bold text-on-surface-muted uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  agriculture
                </span>{" "}
                Langkah Perawatan
              </span>
              <span className="text-sm font-sans leading-relaxed">
                {rekomendasi.perawatan}
              </span>
            </div>
            <div className="flex flex-col gap-2 p-3 bg-surface rounded-sm border border-outline">
              <span className="text-xs font-bold text-on-surface-muted uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-warning">
                  bug_report
                </span>{" "}
                Antisipasi Hama
              </span>
              <span className="text-sm font-sans leading-relaxed">
                {rekomendasi.hama}
              </span>
            </div>
            <div className="flex flex-col md:col-span-2 gap-2 p-4 bg-action/10 rounded-sm border-l-4 border-action">
              <span className="text-xs font-bold text-action uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">
                  lightbulb
                </span>{" "}
                Tips & Trik TaniBot
              </span>
              <span className="text-sm font-sans leading-relaxed text-on-surface font-medium">
                {rekomendasi.tips}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

dashboard = dashboard.replace(oldComponentRegex, newComponent);
fs.writeFileSync('src/views/DashboardView.tsx', dashboard);
