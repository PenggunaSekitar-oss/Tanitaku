import React, { useState, useEffect, useRef } from 'react';
import { useTaniOps } from '../context/TaniOpsContext';
import { useToast, getManagerGreeting } from '../context/ToastContext';
import { calculateHST } from '../utils/calculations';
import { Select } from './Select';
import { formatLocalDate } from '../utils/localDate';

interface AgriNotificationWidgetProps {
  weatherDesc?: string;
  temperature?: number;
  navigate?: (v: string) => void;
}

export function AgriNotificationWidget({ weatherDesc = 'Cerah', temperature = 31, navigate }: AgriNotificationWidgetProps) {
  const { tanaman, blokLahan, addLogAktivitas } = useTaniOps();
  const { showAgriToast, showToast } = useToast();
  const hasAutoNotifiedRef = useRef(false);

  // Settings Toggles
  const [enableWateringToast, setEnableWateringToast] = useState<boolean>(true);
  const [enableFertilizerToast, setEnableFertilizerToast] = useState<boolean>(true);

  const [simulatedWeather, setSimulatedWeather] = useState<'cerah' | 'berawan' | 'hujan'>('cerah');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<'pagi' | 'siang' | 'sore'>('pagi');

  // Sync simulated weather if external BMKG weather description is updated
  useEffect(() => {
    const desc = weatherDesc.toLowerCase();
    if (desc.includes('hujan')) {
      setSimulatedWeather('hujan');
    } else if (desc.includes('berawan') || desc.includes('mendung')) {
      setSimulatedWeather('berawan');
    } else {
      setSimulatedWeather('cerah');
    }
  }, [weatherDesc]);

  const activeTanaman = tanaman.filter(t => t.status !== 'Panen');

  // 1. Calculate Watering Recommendation based on weather
  const isPanasTerik = simulatedWeather === 'cerah' || temperature >= 30;
  const isHujan = simulatedWeather === 'hujan';

  let penyiramanFreq = '2x Sehari';
  let penyiramanTimes = 'Pagi (06:30) & Sore (16:30)';
  let penyiramanVolume = '1 - 1.5 Liter / m²';
  let penyiramanBadgeBg = 'bg-[#154734] text-white';
  let penyiramanTips = 'Penyiraman standar 2x sehari untuk stabilitas kelembaban media tanam.';

  if (isHujan) {
    penyiramanFreq = '0x (Tunda Penyiraman)';
    penyiramanTimes = 'Ditunda (Menyesuaikan Intensitas Hujan)';
    penyiramanVolume = '0 Liter (Kelembaban dari Air Hujan)';
    penyiramanBadgeBg = 'bg-warning text-black';
    penyiramanTips = 'Curah hujan alami mencukupi. Pastikan drainase parit bedengan bebas genangan.';
  } else if (isPanasTerik) {
    penyiramanFreq = '3x Sehari (Suhu Terik)';
    penyiramanTimes = 'Pagi (06:30), Siang (12:00), Sore (16:30)';
    penyiramanVolume = '1.5 - 2 Liter / m²';
    penyiramanBadgeBg = 'bg-[#154734] text-white font-black';
    penyiramanTips = 'Cuaca panas meningkatkan laju evaporasi. Tambahkan penyiraman siang agar tanaman tidak layu.';
  }

  // 2. Calculate Fertilizer Recommendation based on HST
  const getFertilizerAlerts = () => {
    const alerts: Array<{
      tanamanId: string;
      komoditas: string;
      blokNama: string;
      hst: number;
      judulSusulan: string;
      rekomendasi: string;
      dosisTips: string;
    }> = [];

    activeTanaman.forEach(t => {
      const hst = calculateHST(t.tanggalTanam);
      const blok = blokLahan.find(b => b.id === t.blokId);
      const blokNama = blok?.nama || 'Lahan Utama';

      if (hst <= 3) {
        alerts.push({
          tanamanId: t.id,
          komoditas: t.komoditas,
          blokNama,
          hst,
          judulSusulan: 'Pupuk Dasar',
          rekomendasi: 'Kompos Organik / Bokashi & SP-36',
          dosisTips: 'Taburkan pupuk dasar pada bedengan sebelum atau awal tanam.'
        });
      } else if (hst >= 7 && hst <= 12) {
        alerts.push({
          tanamanId: t.id,
          komoditas: t.komoditas,
          blokNama,
          hst,
          judulSusulan: 'Pemupukan Susulan I',
          rekomendasi: 'Kocor Urea / ZA + NPK Dosis Ringan',
          dosisTips: 'Dosis 2 - 3 gr/tanaman. Pacu pertumbuhan akar & tunas awal.'
        });
      } else if (hst >= 14 && hst <= 25) {
        alerts.push({
          tanamanId: t.id,
          komoditas: t.komoditas,
          blokNama,
          hst,
          judulSusulan: 'Pemupukan Susulan II (Fase Vegetatif)',
          rekomendasi: 'NPK Seimbang 16-16-16 + Asam Humat',
          dosisTips: 'Dosis 10 - 15 gr/tanaman. Memperkuat batang & percabangan daun.'
        });
      } else if (hst >= 30 && hst <= 42) {
        alerts.push({
          tanamanId: t.id,
          komoditas: t.komoditas,
          blokNama,
          hst,
          judulSusulan: 'Pemupukan Susulan III (Pembungaan)',
          rekomendasi: 'Pupuk Tinggi Fosfat & Kalium (MKP / KNO3 Merah)',
          dosisTips: 'Dosis 15 - 20 gr/tanaman. Merangsang bunga & mencegah kerontokan.'
        });
      } else if (hst >= 45 && hst <= 60) {
        alerts.push({
          tanamanId: t.id,
          komoditas: t.komoditas,
          blokNama,
          hst,
          judulSusulan: 'Pemupukan Susulan IV (Pengisian Buah)',
          rekomendasi: 'KNO3 Putih + Kalsium Nitrat',
          dosisTips: 'Dosis 20 - 25 gr/tanaman. Memperbesar buah & tingkatkan bobot panen.'
        });
      } else if (hst >= 61) {
        alerts.push({
          tanamanId: t.id,
          komoditas: t.komoditas,
          blokNama,
          hst,
          judulSusulan: 'Pemupukan Susulan V (Kualitas Panen)',
          rekomendasi: 'Kalsium Boron + Kalium Tinggi',
          dosisTips: 'Mencegah busuk ujung buah & menjaga daya simpan.'
        });
      }
    });

    return alerts;
  };

  const fertilizerAlerts = getFertilizerAlerts();

  // Trigger Toast Notification for Watering
  const handleTriggerWateringToast = () => {
    if (!enableWateringToast) {
      showToast('Pengingat penyiraman sedang dinonaktifkan.', 'info');
      return;
    }
    if (blokLahan.length === 0) {
      showToast('Tambahkan blok lahan sebelum mencatat penyiraman.', 'error');
      return;
    }
    const targetBlok = blokLahan[0]?.nama || 'Lahan Budidaya';
    const firstPlant = activeTanaman[0]?.komoditas ? activeTanaman[0].komoditas.toLowerCase() : 'tanaman';
    const timeLabel = selectedTimeOfDay === 'pagi' ? 'Pagi' : selectedTimeOfDay === 'siang' ? 'Siang' : 'Sore';
    const weatherConditionLabel = isHujan ? 'Cuaca Hujan' : isPanasTerik ? 'Suhu Terik' : 'Cuaca Cerah';
    const greeting = getManagerGreeting();

    const notifHeader = `Jadwal Penyiraman ${timeLabel} (${weatherConditionLabel})`;
    const notifDetail = isHujan
      ? '0x (Tunda Penyiraman). Curah hujan alami mencukupi. Pastikan drainase parit bedengan bebas genangan.'
      : `Siram ${firstPlant} ${penyiramanFreq.toLowerCase()} (${penyiramanVolume}). ${penyiramanTips}`;

    showAgriToast({
      title: 'Notifikasi Penyiraman',
      message: `${greeting}\n${notifHeader}\n${notifDetail}`,
      category: 'penyiraman',
      badgeText: penyiramanFreq,
      icon: isHujan ? 'cloud_rain' : 'water_drop',
      actionLabel: 'Sudah Disiram',
      onAction: () => handleLogPenyiraman(targetBlok)
    });
  };

  // Trigger Toast Notification for Fertilizing
  const handleTriggerFertilizerToast = (alertItem?: any) => {
    if (!enableFertilizerToast) {
      showToast('Pengingat pemupukan sedang dinonaktifkan.', 'info');
      return;
    }
    if (blokLahan.length === 0) {
      showToast('Tambahkan blok lahan sebelum mencatat pemupukan.', 'error');
      return;
    }
    const item = alertItem || fertilizerAlerts[0] || {
      komoditas: activeTanaman[0]?.komoditas || 'Cabai Merah',
      blokNama: blokLahan[0]?.nama || 'Lahan A',
      hst: activeTanaman[0] ? calculateHST(activeTanaman[0].tanggalTanam) : 14,
      judulSusulan: 'Pemupukan Susulan II',
      rekomendasi: 'NPK Seimbang 16-16-16',
      dosisTips: 'Dosis 2 - 3 gr/tanaman.'
    };

    const greeting = getManagerGreeting();
    const notifHeader = `Jadwal ${item.judulSusulan} (${item.komoditas})`;
    const notifDetail = `[HST ${item.hst}] Kocor/tabur pupuk di ${item.blokNama}. Gunakan ${item.rekomendasi}. ${item.dosisTips || ''}`;

    showAgriToast({
      title: `Notifikasi Pemupukan (${item.komoditas})`,
      message: `${greeting}\n${notifHeader}\n${notifDetail}`,
      category: 'pemupukan',
      badgeText: `HST ${item.hst}`,
      icon: 'compost',
      actionLabel: 'Catat Pemupukan',
      onAction: () => handleLogPemupukan(item.blokNama, item.judulSusulan)
    });
  };

  // Log Penyiraman
  const handleLogPenyiraman = (blokNama: string) => {
    const today = formatLocalDate();
    const blok = blokLahan.find(b => b.nama === blokNama) || blokLahan[0];
    if (!blok) {
      showToast('Blok lahan tidak ditemukan. Aktivitas tidak disimpan.', 'error');
      return;
    }
    addLogAktivitas({
      tanggal: today,
      blokId: blok.id,
      kategori: 'Irigasi',
      deskripsi: `Penyiraman ${selectedTimeOfDay.toUpperCase()} (${penyiramanFreq}) sesuai rekomendasi cuaca`,
      biaya: 0,
      petugas: 'Petani Operasional'
    });
    showToast(`Penyiraman ${selectedTimeOfDay.toUpperCase()} berhasil dicatat di Log Aktivitas!`, 'success');
  };

  // Log Pemupukan
  const handleLogPemupukan = (blokNama: string, susulanTitle: string) => {
    const today = formatLocalDate();
    const blok = blokLahan.find(b => b.nama === blokNama) || blokLahan[0];
    if (!blok) {
      showToast('Blok lahan tidak ditemukan. Aktivitas tidak disimpan.', 'error');
      return;
    }
    addLogAktivitas({
      tanggal: today,
      blokId: blok.id,
      kategori: 'Pemupukan',
      deskripsi: `Aplikasi ${susulanTitle} sesuai panduan HST`,
      biaya: 0,
      petugas: 'Petani Operasional'
    });
    showToast(`${susulanTitle} berhasil dicatat di Log Aktivitas!`, 'success');
  };

  return (
    <div className="neo-card p-5 md:p-6 bg-surface flex flex-col gap-5 border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-black pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#154734] text-white border-2 border-black flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] shrink-0">
            <span className="material-symbols-outlined text-2xl">notifications_active</span>
          </div>
          <div>
            <h2 className="font-brutal font-black text-lg sm:text-xl text-on-surface uppercase tracking-wider">
              Konfigurasi Toast Notifikasi Tani
            </h2>
            <p className="text-xs text-on-surface-muted font-medium mt-0.5">
              Simulator manual penyiraman dan panduan HST. Kondisi cuaca dapat diuji sebelum mencatat aktivitas.
            </p>
          </div>
        </div>

        {/* Quick Weather Simulator Controller */}
        <div className="flex items-center gap-1.5 bg-surface-high p-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] self-stretch sm:self-auto justify-between">
          <span className="text-[11px] font-black text-on-surface-muted px-2 uppercase font-mono hidden md:inline">
            Uji Cuaca:
          </span>
          <button
            type="button"
            onClick={() => setSimulatedWeather('cerah')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1 cursor-pointer ${
              simulatedWeather === 'cerah'
                ? 'bg-[#FFEE32] text-black border border-black shadow-[1px_1px_0px_0px_#000]'
                : 'text-on-surface-muted hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">wb_sunny</span>
            Cerah
          </button>
          <button
            type="button"
            onClick={() => setSimulatedWeather('berawan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1 cursor-pointer ${
              simulatedWeather === 'berawan'
                ? 'bg-surface text-on-surface border border-black shadow-[1px_1px_0px_0px_#000]'
                : 'text-on-surface-muted hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">cloud</span>
            Berawan
          </button>
          <button
            type="button"
            onClick={() => setSimulatedWeather('hujan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1 cursor-pointer ${
              simulatedWeather === 'hujan'
                ? 'bg-[#154734] text-white border border-black shadow-[1px_1px_0px_0px_#000]'
                : 'text-on-surface-muted hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">water_drop</span>
            Hujan
          </button>
        </div>
      </div>

      {/* Global Toggle Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-high p-4 rounded-xl border border-outline">
        <label className="flex items-center justify-between gap-3 p-3 bg-surface rounded-lg border border-black cursor-pointer shadow-[2px_2px_0px_0px_#000] hover:bg-surface-high transition">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#0288D1] text-2xl">water_drop</span>
            <div>
              <span className="font-bold text-xs sm:text-sm text-on-surface block">Aktifkan Pengingat Penyiraman</span>
              <span className="text-[11px] text-on-surface-muted">Mengaktifkan simulasi dan pencatatan penyiraman</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={enableWateringToast}
            onChange={(e) => setEnableWateringToast(e.target.checked)}
            className="w-5 h-5 accent-action rounded cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between gap-3 p-3 bg-surface rounded-lg border border-black cursor-pointer shadow-[2px_2px_0px_0px_#000] hover:bg-surface-high transition">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#154734] text-2xl">compost</span>
            <div>
              <span className="font-bold text-xs sm:text-sm text-on-surface block">Aktifkan Pengingat Pemupukan</span>
              <span className="text-[11px] text-on-surface-muted">Mengaktifkan simulasi panduan berbasis HST</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={enableFertilizerToast}
            onChange={(e) => setEnableFertilizerToast(e.target.checked)}
            className="w-5 h-5 accent-success rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Grid Details: Penyiraman vs Pemupukan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* PANEL 1: PENYIRAMAN */}
        <div className="bg-surface-high p-4 sm:p-5 rounded-xl border-2 border-black flex flex-col justify-between gap-4 shadow-[3px_3px_0px_0px_#000]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-outline pb-2.5">
              <span className="font-brutal font-black text-xs sm:text-sm uppercase tracking-wider text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0288D1] text-[20px]">shower</span>
                1. Aturan Penyiraman (Cuaca)
              </span>
              <span className={`text-[10px] sm:text-xs uppercase font-black px-2.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000] ${penyiramanBadgeBg}`}>
                {penyiramanFreq}
              </span>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-outline/50">
                <span className="text-on-surface-muted font-medium">Kondisi Cuaca Terdeteksi:</span>
                <span className="font-bold text-on-surface capitalize flex items-center gap-1">
                  {simulatedWeather === 'hujan' && '🌧️ Hujan (Tunda)'}
                  {simulatedWeather === 'berawan' && '☁️ Berawan (2x/hari)'}
                  {simulatedWeather === 'cerah' && (isPanasTerik ? '☀️ Cerah Terik (3x/hari)' : '☀️ Cerah (2x/hari)')}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-outline/50">
                <span className="text-on-surface-muted font-medium">Jadwal Sesi:</span>
                <span className="font-bold text-on-surface">{penyiramanTimes}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-outline/50">
                <span className="text-on-surface-muted font-medium">Dosis Air Direkomendasikan:</span>
                <span className="font-mono font-bold text-action text-sm">{penyiramanVolume}</span>
              </div>

              <div className="bg-surface p-3 rounded-lg border border-black mt-1">
                <p className="text-xs text-on-surface leading-relaxed">
                  💡 <b className="font-black text-on-surface">Panduan Agrikultur:</b> {penyiramanTips}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t-2 border-black">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface-muted shrink-0">Simulasi Sesi:</span>
              <Select
                options={[
                  { value: 'pagi', label: 'Pagi (06:30)' },
                  { value: 'siang', label: 'Siang (12:00)' },
                  { value: 'sore', label: 'Sore (16:30)' },
                ]}
                value={selectedTimeOfDay}
                onChange={(value) => setSelectedTimeOfDay(value as 'pagi' | 'siang' | 'sore')}
                className="w-36 text-xs font-bold"
              />
            </div>

            <button
              type="button"
              onClick={handleTriggerWateringToast}
              className="px-4 py-2 bg-[#154734] text-white font-black text-xs uppercase tracking-wider rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#0e3023] active:translate-y-0.5 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              Uji Toast Penyiraman
            </button>
          </div>
        </div>

        {/* PANEL 2: PEMUPUKAN HST */}
        <div className="bg-surface-high p-4 sm:p-5 rounded-xl border-2 border-black flex flex-col justify-between gap-4 shadow-[3px_3px_0px_0px_#000]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-outline pb-2.5">
              <span className="font-brutal font-black text-xs sm:text-sm uppercase tracking-wider text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[#154734] text-[20px]">compost</span>
                2. Aturan Pemupukan (HST)
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-black px-2.5 py-0.5 rounded bg-[#154734] text-white border border-black shadow-[1px_1px_0px_0px_#000]">
                {fertilizerAlerts.length} Tanaman Aktif
              </span>
            </div>

            <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
              {fertilizerAlerts.length > 0 ? (
                fertilizerAlerts.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-surface rounded-lg border-2 border-black flex items-center justify-between gap-3 shadow-[1px_1px_0px_0px_#000]">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-xs text-on-surface truncate">
                          {item.komoditas} ({item.blokNama})
                        </span>
                        <span className="text-[10px] font-black bg-action text-on-action px-2 py-0.5 rounded border border-black">
                          HST {item.hst}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#154734] block truncate mt-0.5">
                        {item.judulSusulan}: <span className="text-on-surface font-normal">{item.rekomendasi}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTriggerFertilizerToast(item)}
                      className="p-1.5 rounded-lg bg-action/10 text-action hover:bg-action hover:text-on-action border border-black transition shrink-0 cursor-pointer shadow-[1px_1px_0px_0px_#000]"
                      title="Kirim Notifikasi Toast"
                    >
                      <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-surface rounded-lg border border-dashed border-outline text-center text-xs text-on-surface-muted">
                  Belum ada jadwal pemupukan khusus HST hari ini.
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-3 border-t-2 border-black">
            <button
              type="button"
              onClick={() => navigate && navigate('pemupukan')}
              className="text-xs font-black text-action hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              Atur Dosis &amp; Jadwal
            </button>

            <button
              type="button"
              onClick={() => handleTriggerFertilizerToast()}
              className="px-4 py-2 bg-[#154734] text-white font-black text-xs uppercase tracking-wider rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#0e3023] active:translate-y-0.5 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              Uji Toast Pemupukan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
