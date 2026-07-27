import React, { useState, useEffect, useRef } from 'react';
import { INDONESIA_REGIONS, BMKGRegion } from '../data/indonesiaRegions';

const BMKG_REGIONS = INDONESIA_REGIONS;
export { INDONESIA_REGIONS as BMKG_REGIONS };
export type { BMKGRegion };

interface BMKGWeatherData {
  lokasi: {
    provinsi: string;
    kotkab: string;
    kecamatan: string;
    desa: string;
  };
  current: {
    weather_desc: string;
    t: number;
    hu: number;
    ws: number;
    wd: string;
    image: string;
    local_datetime: string;
  };
}

export function BmkgWeatherWidget({ onOpenBotModal }: { onOpenBotModal?: () => void }) {
  const [selectedCode, setSelectedCode] = useState<string>(() => {
    return localStorage.getItem('bmkg_selected_region') || "73.04.01.1001"; // Default Binamu
  });
  const [data, setData] = useState<BMKGWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  // Custom dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedRegion = BMKG_REGIONS.find(r => r.code === selectedCode) || BMKG_REGIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchBmkgData = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${code}`);
      if (!res.ok) throw new Error("Gagal mengambil data dari server BMKG");
      const json = await res.json();
      
      if (json.lokasi && json.data && json.data[0] && json.data[0].cuaca && json.data[0].cuaca[0] && json.data[0].cuaca[0][0]) {
        const cuaca = json.data[0].cuaca[0][0];
        setData({
          lokasi: json.lokasi,
          current: {
            weather_desc: cuaca.weather_desc || "Cerah",
            t: cuaca.t ?? 28,
            hu: cuaca.hu ?? 70,
            ws: cuaca.ws ?? 10,
            wd: cuaca.wd || "S",
            image: cuaca.image || "",
            local_datetime: cuaca.local_datetime || new Date().toLocaleString("id-ID")
          }
        });
        setLastUpdated(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      } else {
        throw new Error("Format data BMKG tidak sesuai");
      }
    } catch (err: any) {
      console.error("BMKG Fetch error:", err);
      setError("Tidak dapat terhubung ke API BMKG. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBmkgData(selectedCode);
    localStorage.setItem('bmkg_selected_region', selectedCode);
  }, [selectedCode]);

  const filteredRegions = BMKG_REGIONS.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.provinsi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAgriTip = (desc: string) => {
    const d = desc.toLowerCase();
    if (d.includes('hujan')) {
      return "Peringatan Hujan BMKG: Drainase bedengan wajib lancar, tunda penyemprotan foliar agar tidak terbilas.";
    } else if (d.includes('cerah') || d.includes('terang')) {
      return "Rekomendasi Cerah BMKG: Penguapan tinggi, utamakan penyiraman/pengocoran pagi hari.";
    } else if (d.includes('berawan') || d.includes('kabur')) {
      return "Rekomendasi Berawan BMKG: Kelembapan stabil, waktu ideal untuk aplikasi pupuk susulan & perawatan.";
    }
    return "Pantau kelembapan tanah secara berkala untuk menyesuaikan takaran kocor harian.";
  };

  return (
    <div 
      className="p-4 md:p-6 rounded-2xl flex flex-col gap-4 relative border border-blue-900/50 shadow-md text-white overflow-hidden"
      style={{ backgroundColor: '#00326D' }}
    >
      {/* Header Badge BMKG & Custom Region Picker */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/15 pb-3">
        <div className="flex items-center gap-2">
          {/* Logo Badge BMKG */}
          <div className="bg-amber-400 text-slate-950 font-extrabold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-[15px] text-slate-900">verified</span>
            REAL-TIME BMKG
          </div>
          <span className="text-xs text-blue-200/80 font-mono hidden md:inline">
            Official Data API BMKG
          </span>
        </div>

        {/* Custom Region Selector */}
        <div className="relative w-full sm:w-auto min-w-0" ref={dropdownRef}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 w-full">
            <span className="text-xs font-semibold text-blue-200/90 shrink-0 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-amber-300">location_on</span>
              Wilayah Lahan:
            </span>
            
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold text-white flex items-center justify-between gap-2 cursor-pointer transition w-full sm:w-auto min-w-0 sm:min-w-[200px] shadow-2xs backdrop-blur-xs"
            >
              <div className="flex items-center gap-1.5 truncate min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                <span className="truncate">{selectedRegion.name}</span>
                <span className="text-[10px] text-blue-200/70 font-normal shrink-0">({selectedRegion.provinsi})</span>
              </div>
              <span className="material-symbols-outlined text-[18px] text-amber-300 transition-transform shrink-0" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                expand_more
              </span>
            </button>
          </div>

          {/* Custom Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-full sm:w-80 max-w-[calc(100vw-2rem)] bg-[#00224d] border border-blue-400/30 rounded-xl p-3 z-50 shadow-2xl flex flex-col gap-2 max-h-80 overflow-hidden animate-in fade-in zoom-in duration-150 text-white">
              {/* Search Box */}
              <div className="relative">
                <span className="material-symbols-outlined text-[18px] text-blue-200/60 absolute left-2.5 top-2.5">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari wilayah/kabupaten..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-8 pr-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder:text-blue-200/60"
                  autoFocus
                />
              </div>

              {/* Regions List */}
              <div className="overflow-y-auto flex flex-col gap-1 pr-1 max-h-56">
                {filteredRegions.length === 0 ? (
                  <div className="p-3 text-center text-xs text-blue-200/60 font-mono">
                    Wilayah tidak ditemukan
                  </div>
                ) : (
                  filteredRegions.map((r) => {
                    const isSelected = r.code === selectedCode;
                    return (
                      <button
                        key={r.code}
                        type="button"
                        onClick={() => {
                          setSelectedCode(r.code);
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                        }}
                        className={`text-left p-2 rounded-lg text-xs font-bold transition flex items-center justify-between gap-2 border ${
                          isSelected
                            ? 'bg-[#154734] text-white border-[#154734] shadow-2xs'
                            : 'bg-white/5 hover:bg-white/15 border-transparent text-white'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="leading-tight">{r.name}</span>
                          <span className={`text-[10px] font-normal ${isSelected ? 'text-slate-800' : 'text-blue-200/70'}`}>
                            {r.provinsi}
                          </span>
                        </div>

                        {isSelected && (
                          <span className="material-symbols-outlined text-[16px]">
                            check_circle
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Weather Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          {/* Weather Icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden backdrop-blur-xs">
            {loading ? (
              <span className="material-symbols-outlined text-3xl text-amber-300 animate-spin">
                sync
              </span>
            ) : data?.current?.image ? (
              <img
                src={data.current.image}
                alt={data.current.weather_desc}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="material-symbols-outlined text-[36px] text-amber-300">
                {data?.current?.weather_desc.toLowerCase().includes('hujan') ? 'rainy' : 'wb_sunny'}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-extrabold text-2xl md:text-3xl text-white leading-tight">
                {loading ? "Memuat BMKG..." : `${data?.current?.t ?? '--'}\u00B0C`}
              </h3>
              <span className="text-xs font-bold bg-white/15 text-blue-100 px-2.5 py-0.5 rounded-lg border border-white/20 backdrop-blur-xs">
                {loading ? "Menghubungkan..." : data?.current?.weather_desc}
              </span>
            </div>

            <p className="text-xs font-bold text-blue-100 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-rose-300">pin_drop</span>
              {data?.lokasi ? `${data.lokasi.kotkab || ''} \u00B7 ${data.lokasi.kecamatan || ''}` : selectedRegion.name}
            </p>

            <p className="text-xs text-blue-200/80 mt-1 flex flex-wrap gap-3 font-mono">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-sky-300">water_drop</span>
                Kelembapan: <b className="text-white font-bold">{data?.current?.hu ?? '--'}%</b>
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-teal-300">air</span>
                Angin: <b className="text-white font-bold">{data?.current?.ws ?? '--'} km/j ({data?.current?.wd ?? ''})</b>
              </span>
              {lastUpdated && (
                <span className="text-[11px] text-blue-200/70">
                  \u00B7 Update: {lastUpdated} WIB
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => fetchBmkgData(selectedCode)}
            disabled={loading}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer min-h-[38px]"
            title="Refresh Cuaca BMKG"
          >
            <span className={`material-symbols-outlined text-[16px] ${loading ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>{loading ? "Pembaruan..." : "Refresh BMKG"}</span>
          </button>

          {onOpenBotModal && (
            <button
              type="button"
              onClick={onOpenBotModal}
              className="bg-[#154734] hover:bg-[#154734] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer min-h-[38px]"
            >
              <span className="material-symbols-outlined text-[18px]">psychology</span>
              SARAN TANIBOT
            </button>
          )}
        </div>
      </div>

      {/* Dynamic BMKG Agriculture Guidance */}
      {data && !loading && (
        <div className="p-3 bg-white/10 border-l-4 border-amber-400 rounded-r-xl text-xs flex items-center gap-2 mt-1 backdrop-blur-xs">
          <span className="material-symbols-outlined text-amber-300 text-[20px] shrink-0">
            agriculture
          </span>
          <p className="text-blue-50 leading-relaxed">
            <b className="text-amber-300 font-bold">Rekomendasi Tani BMKG ({selectedRegion.name}):</b> {getAgriTip(data.current.weather_desc)}
          </p>
        </div>
      )}

      {error && (
        <div className="text-xs text-rose-200 bg-rose-900/40 p-2.5 rounded-xl border border-rose-500/30 font-bold">
          {error}
        </div>
      )}
    </div>
  );
}
