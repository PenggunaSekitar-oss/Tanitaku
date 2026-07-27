const fs = require('fs');
let code = fs.readFileSync('src/views/DashboardView.tsx', 'utf-8');

code = code.replace(
  "function RekomendasiTanamanItem({ t, blokLahan }: any) {",
  "function RekomendasiTanamanItem({ t, blokLahan, navigate }: any) {"
);

const target = `          <div className="flex flex-col gap-2 p-3 bg-surface rounded-sm border border-outline">
            <span className="text-xs font-bold text-on-surface-muted uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-warning">
                bug_report
              </span>{" "}
              Antisipasi Hama
            </span>
            <span className="text-sm font-sans leading-relaxed">
              {rekomendasi.hama}
            </span>
          </div>`;

const replace = `          <div className="flex flex-col gap-2 p-3 bg-surface rounded-sm border border-outline">
            <span className="text-xs font-bold text-on-surface-muted uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-warning">
                bug_report
              </span>{" "}
              Antisipasi Hama
            </span>
            <span className="text-sm font-sans leading-relaxed">
              {rekomendasi.hama}
            </span>
            <button 
              onClick={() => {
                const targetHama = rekomendasi.hama.split(',')[0].trim();
                localStorage.setItem('targetPestisida', targetHama);
                if (navigate) navigate('cari-pestisida');
              }}
              className="mt-2 text-[10px] bg-action text-on-action font-bold uppercase px-3 py-1.5 rounded-[4px_2px_4px_2px] neo-border-thin shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] transition self-start"
            >
              Cari Solusi Obat & Pestisida
            </button>
          </div>`;

code = code.replace(target, replace);
fs.writeFileSync('src/views/DashboardView.tsx', code);
