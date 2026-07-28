import React, { useState, useEffect } from 'react';
import { BrandLockup } from './BrandLockup';

interface AccessGateProps {
  children: React.ReactNode;
}

// Offline access codes cannot provide server-grade authorization. Keeping only
// digests prevents the raw activation codes from being shipped in the bundle.
const VALID_CODE_HASHES = [
  '802c1a85c1eb04d132e8f12c3ebd10ece869a764bdd930244ade2b8712d25aa5',
  '8a91c9007231752a91ce51701f262581e45e8d8506ac8f9dda07bc72eb307fe5',
  '9e05b273466a570954e7e97f580456c62050902a6032276ec7251636ae55d9fa',
  '871c58f635b5313f3d0d1fc5cf3281b28bf2c3fc23a7f524bcb4f3139988e655',
];

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function AccessGate({ children }: AccessGateProps) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [inputCode, setInputCode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedCodeHash = localStorage.getItem('tanita_access_code_hash');
      if (savedCodeHash && VALID_CODE_HASHES.includes(savedCodeHash)) {
        setIsUnlocked(true);
      }
      localStorage.removeItem('tanita_access_granted');
      localStorage.removeItem('tanita_redeem_code');
    } catch {
      setErrorMsg('Penyimpanan browser tidak tersedia. Akses tidak dapat dipertahankan.');
    }
  }, []);

  const handleVerifyCode = async () => {
    const code = inputCode.trim().toUpperCase().replace(/\s+/g, '');
    
    if (!code) {
      setErrorMsg('Harap masukkan Kode Akses terlebih dahulu');
      setSuccessMsg('');
      return;
    }

    setIsVerifying(true);
    try {
      const codeHash = await sha256(code);
      if (VALID_CODE_HASHES.includes(codeHash)) {
        setErrorMsg('');
        setSuccessMsg('Kode akses valid. Membuka TANITA Operations...');
        localStorage.setItem('tanita_access_code_hash', codeHash);
        setIsUnlocked(true);
        setInputCode('');
        setSuccessMsg('');
        return;
      }

      setSuccessMsg('');
      setErrorMsg('Kode Akses tidak valid. Silakan periksa kembali.');
    } catch {
      setSuccessMsg('');
      setErrorMsg('Verifikasi lokal tidak tersedia pada browser ini.');
    } finally {
      setIsVerifying(false);
    }
  };

  const getWaLink = () => {
    let savedNum: string | null = null;
    try {
      savedNum = localStorage.getItem('tanita_wa_number');
    } catch {
      // A generic WhatsApp compose URL is used below.
    }
    let num = savedNum ? savedNum.replace(/\D/g, '') : '';
    if (num.startsWith('0')) {
      num = '62' + num.slice(1);
    }
    const text = encodeURIComponent('Halo Admin TANITA, saya membutuhkan bantuan kode akses perangkat TANITA.');
    return num ? `https://wa.me/${num}?text=${text}` : `https://wa.me/?text=${text}`;
  };

  if (!isUnlocked) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[#ECEBE5] p-4 font-sans text-[#1B2721] selection:bg-[#C9DCCE] selection:text-[#17251E] sm:p-6">
        {/* Main Access Gate Card */}
        <div className="relative z-10 my-auto flex w-full max-w-md flex-col gap-6 rounded-[22px] border border-[#D6D3CA] bg-[#FBFAF6] p-6 shadow-[0_18px_50px_rgba(28,39,33,0.08)] sm:p-8">
          
          {/* Header Section */}
          <div className="flex flex-col items-center text-center gap-3">
            <BrandLockup />

            <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 border border-slate-200 font-display font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs font-extrabold text-[#154734]">verified_user</span>
              <span>Kunci Akses Perangkat</span>
            </div>

            <div className="space-y-1 mt-1">
              <h1 className="font-display text-2xl font-semibold tracking-[-0.035em] text-[#19251F]">
                Buka perangkat
              </h1>
              <p className="mx-auto max-w-xs text-xs font-medium leading-relaxed text-[#69736C] sm:text-sm">
                Masukkan kode akses yang diberikan pengelola untuk membuka ruang kerja lokal.
              </p>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 font-display font-bold text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-xl shrink-0 text-rose-600">error</span>
              <span className="leading-snug">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-[#154734]/10 border border-[#154734]/30 text-[#154734] font-display font-bold text-xs sm:text-sm rounded-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-xl shrink-0 text-[#154734]">check_circle</span>
              <span className="leading-snug">{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyCode();
            }} 
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-display font-extrabold text-slate-900 uppercase tracking-wider">
                  Kode akses
                </label>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                  Tersimpan lokal
                </span>
              </div>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
                  key
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Masukkan kode akses..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-slate-950 focus:bg-white p-3.5 pl-11 pr-11 rounded-2xl text-slate-950 font-display font-bold text-base tracking-widest placeholder:text-slate-400 placeholder:font-sans placeholder:tracking-normal placeholder:text-sm focus:outline-none transition-all shadow-2xs focus:ring-2 focus:ring-slate-950/10"
                  autoFocus
                />
                
                {inputCode && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 p-1 transition-colors cursor-pointer"
                    title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full h-12 bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-white font-display font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-800"
            >
              <span>{isVerifying ? 'Memverifikasi…' : 'Verifikasi kode'}</span>
              <span className="material-symbols-outlined text-xl font-bold">arrow_forward</span>
            </button>
          </form>

          {/* Secondary Action Link */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setShowHintModal(true)}
              className="text-xs font-display font-bold text-slate-600 hover:text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer py-1"
            >
              <span className="material-symbols-outlined text-base text-slate-500">help_outline</span>
              <span>Bantuan &amp; Permintaan Kode Akses</span>
            </button>
          </div>

          {/* Footer Info */}
          <div className="text-center text-[11px] font-display font-semibold text-slate-400 pt-1 border-t border-slate-100">
            © 2026 TANITA &middot; Kunci Aktivasi Lokal
          </div>

        </div>

        {/* Info & Assistance Modal */}
        {showHintModal && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150 text-slate-900"
            onClick={() => setShowHintModal(false)}
          >
            <div 
              className="bg-[#FEFEFA] border border-slate-200 shadow-2xl rounded-3xl p-6 w-full max-w-md flex flex-col gap-5 relative animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2">
                  <BrandLockup compact />
                  <span className="text-xs font-display font-bold text-slate-500">&middot; Bantuan akses</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowHintModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer rounded-lg hover:bg-slate-100"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-display font-medium text-slate-600 leading-relaxed">
                  Kode akses TANITA diterbitkan oleh pengelola ruang kerja kebun untuk membuka aplikasi pada perangkat ini.
                </p>

                <div className="p-4 bg-[#154734]/10 rounded-2xl border border-[#154734]/30 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#154734] font-display font-bold text-xs">
                    <span className="material-symbols-outlined text-base text-[#154734]">verified</span>
                    <span>Petunjuk Aktivasi:</span>
                  </div>
                  <p className="text-xs font-display font-medium text-slate-700 leading-relaxed">
                    Masukkan kode yang telah Anda terima. Jika Anda belum memiliki atau kehilangan kode, hubungi pengelola operasional TANITA.
                  </p>
                </div>

                {/* WhatsApp Contact Section */}
                <div className="p-4 bg-[#154734]/10 border border-[#154734]/30 rounded-2xl flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-[#154734] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-lg text-[#154734]">chat</span>
                      <span>Butuh Bantuan Akses?</span>
                    </span>
                    <span className="text-[10px] bg-[#154734] text-white font-display font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">WhatsApp</span>
                  </div>
                  <p className="text-xs font-display font-medium text-slate-700 leading-relaxed">
                    Hubungi admin layanan bantuan operasional via WhatsApp untuk konfirmasi atau permintaan Kode Akses TANITA.
                  </p>
                  <a
                    href={getWaLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-[#154734] hover:bg-[#154734] text-white font-display font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-2xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    <span className="material-symbols-outlined text-lg">chat</span>
                    <span>Hubungi via WhatsApp</span>
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowHintModal(false)}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-display font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-2xs transition-all cursor-pointer border border-slate-800"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
