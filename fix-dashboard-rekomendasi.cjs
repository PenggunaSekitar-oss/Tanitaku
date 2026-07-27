const fs = require('fs');

let content = fs.readFileSync('src/views/DashboardView.tsx', 'utf-8');

const replacement = `
function RekomendasiTanamanItem({ t, blokLahan }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const hst = calculateHST(t.tanggalTanam);
  const rekomendasi = getRecommendations(hst);
  const fase = determineFaseTanaman(hst);
  const blok = blokLahan.find((b: any) => b.id === t.blokId);

  return (
    <div className="neo-card-small p-4 bg-surface-high/30 flex flex-col gap-4 border border-outline">
      <div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 w-full flex items-center justify-between md:justify-start gap-4">
          <div>
            <h3 className="font-display font-bold text-lg text-on-surface">
              {t.komoditas}{" "}
              <span className="text-on-surface-muted text-sm font-normal">
                ({t.varietas})
              </span>
            </h3>
            <span className="text-xs font-mono text-on-surface-muted">
              {blok?.nama || "Unknown"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg text-black bg-action px-2 py-0.5 rounded-[4px_2px_4px_2px] neo-border-thin shadow-[2px_2px_0px_0px_#000] inline-block">
              {hst}{" "}
              <span className="text-xs font-sans font-normal text-black/70">
                HST
              </span>
            </span>
            <span className="material-symbols-outlined text-on-surface transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              expand_more
            </span>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pt-4 border-t border-outline">
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
      )}
    </div>
  );
}

export function DashboardView`;

content = content.replace('export function DashboardView', replacement);

const targetListStart = '<div className="p-4 md:p-6 overflow-y-auto flex flex-col gap-6 hide-scrollbar">';
const replaceListStart = '<div className="p-4 md:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 hide-scrollbar">';

content = content.replace(targetListStart, replaceListStart);

// Remove the old map logic and replace with new component call
const oldMapRegex = /\{tanaman\.map\(\(t\) => \{[\s\S]*?return \([\s\S]*?\}\)\}/;
const newMap = `{tanaman.map((t) => (
                <RekomendasiTanamanItem key={t.id} t={t} blokLahan={blokLahan} />
              ))}`;

content = content.replace(oldMapRegex, newMap);

fs.writeFileSync('src/views/DashboardView.tsx', content);
