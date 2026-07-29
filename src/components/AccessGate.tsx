import React, { useEffect, useState } from 'react';
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

export function normalizeAccessCode(value: string): string {
  return value
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[^A-Z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 24);
}

export function formatAccessCode(value: string): string {
  const normalized = normalizeAccessCode(value);
  if (!normalized || normalized.includes('-')) return normalized;
  return normalized.match(/.{1,4}/g)?.join(' ') ?? normalized;
}

function AccessBackdrop() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full text-[#24533F] opacity-[0.11] sm:opacity-[0.065]"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <path d="M-80 720C180 570 328 620 515 482C718 331 902 370 1112 218C1252 117 1377 124 1517 40" stroke="currentColor" strokeWidth="1.5" />
      <path d="M-90 776C175 626 345 684 541 539C743 389 917 427 1133 276C1274 177 1397 181 1534 101" stroke="currentColor" strokeWidth="1.5" />
      <path d="M-100 832C177 682 360 743 566 595C767 451 947 487 1155 337C1290 239 1416 243 1548 164" stroke="currentColor" strokeWidth="1.5" />
      <path d="M-115 888C177 740 377 801 591 652C796 510 970 549 1178 397C1313 299 1437 306 1564 228" stroke="currentColor" strokeWidth="1.5" />
      <path d="M73 76C181 109 236 172 214 266C196 344 260 399 354 383C453 366 505 427 485 512" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 122C128 155 179 207 162 289C146 365 214 436 310 423C407 410 454 466 437 554" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1264 628C1190 593 1139 611 1115 675C1092 738 1026 757 965 715C902 672 835 697 817 774" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1321 674C1243 638 1184 657 1160 720C1137 782 1069 803 1008 762C944 719 883 744 861 822" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="1276" cy="176" r="4" fill="currentColor" />
      <circle cx="193" cy="670" r="4" fill="currentColor" />
    </svg>
  );
}

function getDeviceLabel(): string {
  if (typeof navigator === 'undefined') return 'Perangkat ini';
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return 'Perangkat Android ini';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'Perangkat Apple ini';
  if (/Windows/i.test(ua)) return 'Komputer Windows ini';
  if (/Macintosh/i.test(ua)) return 'Komputer Mac ini';
  return 'Perangkat ini';
}

export function AccessGate({ children }: AccessGateProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [errorAnimationKey, setErrorAnimationKey] = useState(0);

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

  const showError = (message: string) => {
    setSuccessMsg('');
    setErrorMsg(message);
    setErrorAnimationKey((key) => key + 1);
  };

  const handleVerifyCode = async () => {
    const code = normalizeAccessCode(inputCode);

    if (!code) {
      showError('Masukkan kode aktivasi terlebih dahulu.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');
    try {
      const [codeHash] = await Promise.all([
        sha256(code),
        new Promise((resolve) => window.setTimeout(resolve, 420)),
      ]);

      if (!VALID_CODE_HASHES.includes(codeHash)) {
        showError('Kode tidak dikenali. Periksa kembali setiap karakter atau hubungi pengelola.');
        return;
      }

      localStorage.setItem('tanita_access_code_hash', codeHash);
      setSuccessMsg('Kode valid. Menyiapkan ruang kerja kebun…');
      setIsActivating(true);
      await new Promise((resolve) => window.setTimeout(resolve, 700));
      setInputCode('');
      setIsUnlocked(true);
    } catch {
      showError('Verifikasi lokal tidak tersedia pada browser ini.');
    } finally {
      setIsVerifying(false);
      setIsActivating(false);
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
    if (num.startsWith('0')) num = `62${num.slice(1)}`;
    const text = encodeURIComponent('Halo Admin TANITA, saya membutuhkan bantuan kode aktivasi perangkat TANITA.');
    return num ? `https://wa.me/${num}?text=${text}` : `https://wa.me/?text=${text}`;
  };

  const normalizedLength = normalizeAccessCode(inputCode).replace(/-/g, '').length;
  const codeProgress = Math.min(3, Math.max(0, Math.ceil(normalizedLength / 4)));
  const inputStatus = normalizedLength === 0
    ? 'Ketik atau tempel kode yang Anda terima'
    : normalizedLength < 8
      ? 'Lengkapi kode aktivasi'
      : 'Kode siap diverifikasi';

  if (!isUnlocked) {
    return (
      <div className="relative min-h-[100dvh] overflow-hidden bg-[#ECEBE5] font-sans text-[#1B2721] selection:bg-[#C9DCCE] selection:text-[#17251E]">
        <AccessBackdrop />
        <div className="absolute -left-16 top-16 h-36 w-36 rounded-full border border-[#24533F]/10" aria-hidden="true" />
        <div className="absolute -right-20 bottom-12 h-48 w-48 rounded-full border border-[#24533F]/10" aria-hidden="true" />

        <main className="relative z-10 flex min-h-[100dvh] items-center justify-center px-6 py-5 sm:px-6 sm:py-10">
          <section
            aria-labelledby="activation-title"
            className="relative w-full max-w-[420px] overflow-hidden rounded-[20px] border border-[#D2D0C7] bg-[#FBFAF6] shadow-[0_18px_48px_rgba(28,39,33,0.09)] sm:max-w-[470px] sm:rounded-[22px] sm:shadow-[0_22px_64px_rgba(28,39,33,0.10)]"
          >
            <div className="h-1 w-full bg-[#24533F]" aria-hidden="true" />
            <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-8">
              <header className="flex flex-col items-center gap-2 text-center sm:gap-3">
                <BrandLockup compact />

                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#CCD8D0] bg-[#EEF3EF] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#24533F] sm:px-3 sm:py-1 sm:text-[10px]">
                  <span className="material-symbols-outlined text-[15px]">verified_user</span>
                  Aktivasi perangkat
                </div>

                <div className="space-y-1 sm:mt-0.5 sm:space-y-1.5">
                  <h1 id="activation-title" className="font-display text-[22px] font-semibold tracking-[-0.035em] text-[#19251F] sm:text-[28px]">
                    Aktifkan TANITA
                  </h1>
                  <p className="mx-auto max-w-[310px] text-[11px] font-medium leading-relaxed text-[#68726C] sm:max-w-sm sm:text-sm">
                    Masukkan kode aktivasi untuk membuka ruang kerja kebun di perangkat ini.
                  </p>
                </div>
              </header>

              <div className="flex items-center justify-center gap-2 rounded-xl border border-[#D9E0DA] bg-[#F3F6F3] px-3 py-2 text-[10px] font-semibold text-[#526159] sm:hidden">
                <span className="material-symbols-outlined text-[16px] text-[#24533F]">devices</span>
                <span>{getDeviceLabel()}</span>
                <span className="h-1 w-1 rounded-full bg-[#9AA49D]" aria-hidden="true" />
                <span>Diperiksa lokal</span>
              </div>

              <div className="hidden grid-cols-2 gap-2.5 sm:grid" aria-label="Informasi aktivasi">
                <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[#DEDDD5] bg-[#F5F4EF] p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#24533F] shadow-[0_1px_2px_rgba(28,39,33,0.06)]">
                    <span className="material-symbols-outlined text-[18px]">devices</span>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[10px] font-bold text-[#29362F]">{getDeviceLabel()}</p>
                    <p className="text-[9px] font-medium text-[#78817B]">Aktivasi lokal</p>
                  </div>
                </div>
                <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[#DEDDD5] bg-[#F5F4EF] p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#24533F] shadow-[0_1px_2px_rgba(28,39,33,0.06)]">
                    <span className="material-symbols-outlined text-[18px]">cloud_off</span>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[10px] font-bold text-[#29362F]">Tidak dikirim</p>
                    <p className="text-[9px] font-medium text-[#78817B]">Diperiksa lokal</p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleVerifyCode();
                }}
                className="flex flex-col gap-3 sm:gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-end justify-between gap-3">
                    <label htmlFor="activation-code" className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#29362F]">
                      Kode aktivasi
                    </label>
                    <span className="text-[10px] font-medium text-[#7B847E]">
                      {normalizedLength}/24 karakter
                    </span>
                  </div>

                  <div
                    key={errorAnimationKey}
                    className={`relative ${errorMsg ? 'access-code-error' : ''}`}
                  >
                    <span className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-[#87908A]">
                      key
                    </span>
                    <input
                      id="activation-code"
                      type={showPassword ? 'text' : 'password'}
                      value={inputCode}
                      onChange={(event) => {
                        setInputCode(formatAccessCode(event.target.value));
                        if (errorMsg) setErrorMsg('');
                      }}
                      onPaste={(event) => {
                        event.preventDefault();
                        setInputCode(formatAccessCode(event.clipboardData.getData('text')));
                        setErrorMsg('');
                      }}
                      placeholder="TANI XXXX XXXX"
                      className="h-[50px] w-full rounded-xl border border-[#C8C7BE] bg-white py-3 pl-11 pr-12 font-display text-[14px] font-semibold uppercase tracking-[0.16em] text-[#18231D] shadow-[0_1px_2px_rgba(28,39,33,0.04)] outline-none transition placeholder:font-sans placeholder:text-xs placeholder:font-medium placeholder:tracking-[0.08em] placeholder:text-[#A0A69F] focus:border-[#24533F] focus:ring-4 focus:ring-[#24533F]/10 sm:h-[54px] sm:text-[15px]"
                      aria-describedby="activation-code-status activation-code-security"
                      aria-invalid={Boolean(errorMsg)}
                      autoComplete="one-time-code"
                      autoCapitalize="characters"
                      spellCheck={false}
                      autoFocus
                    />
                    {inputCode && (
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#778079] hover:bg-[#F0EFEA] hover:text-[#1D2922]"
                        aria-label={showPassword ? 'Sembunyikan kode' : 'Tampilkan kode'}
                        title={showPassword ? 'Sembunyikan kode' : 'Tampilkan kode'}
                      >
                        <span className="material-symbols-outlined text-[19px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    )}
                  </div>

                  <div id="activation-code-status" className="flex items-center justify-between gap-3">
                    <span className={`text-[10px] font-semibold ${normalizedLength >= 8 ? 'text-[#2D684E]' : 'text-[#7B847E]'}`}>
                      {inputStatus}
                    </span>
                    <div className="flex gap-1" aria-label={`Kelengkapan kode ${codeProgress} dari 3`}>
                      {[1, 2, 3].map((step) => (
                        <span
                          key={step}
                          className={`h-1.5 w-6 rounded-full transition-colors ${
                            step <= codeProgress ? 'bg-[#2D684E]' : 'bg-[#DEDDD6]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-[#E4C9C3] bg-[#FBF2F0] p-3 text-xs font-semibold leading-relaxed text-[#8D3D32]">
                    <span className="material-symbols-outlined mt-px shrink-0 text-[18px]">error</span>
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div role="status" className="flex items-start gap-2.5 rounded-xl border border-[#C5D8CA] bg-[#EEF5F0] p-3 text-xs font-semibold leading-relaxed text-[#24533F]">
                    <span className="material-symbols-outlined access-success-icon mt-px shrink-0 text-[18px]">check_circle</span>
                    <span>{successMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifying || isActivating}
                  className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-[#173E30] bg-[#1E4938] px-4 text-sm font-bold text-white shadow-[0_2px_4px_rgba(24,54,42,0.16)] hover:bg-[#183D2F] hover:shadow-[0_5px_14px_rgba(24,54,42,0.18)] sm:h-12"
                >
                  {isVerifying ? (
                    <>
                      <span className="access-spinner h-4 w-4 rounded-full border-2 border-white/35 border-t-white" aria-hidden="true" />
                      <span>Memeriksa kode…</span>
                    </>
                  ) : isActivating ? (
                    <>
                      <span className="material-symbols-outlined text-xl">check_circle</span>
                      <span>Membuka ruang kerja…</span>
                    </>
                  ) : (
                    <>
                      <span>Aktifkan perangkat</span>
                      <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>

              <p id="activation-code-security" className="hidden items-center justify-center gap-1.5 text-center text-[10px] font-medium leading-relaxed text-[#747D77] sm:flex">
                <span className="material-symbols-outlined text-[15px] text-[#4F685A]">shield_lock</span>
                Kode diperiksa secara lokal dan tidak dikirim ke pihak lain.
              </p>

              <div className="border-t border-[#E2E0D8] pt-3 sm:pt-4">
                <button
                  type="button"
                  onClick={() => setIsHelpOpen((open) => !open)}
                  className="flex min-h-10 w-full items-center justify-between gap-3 rounded-xl px-3 text-left text-xs font-semibold text-[#536059] hover:bg-[#F1F0EB] hover:text-[#1E2B24]"
                  aria-expanded={isHelpOpen}
                  aria-controls="activation-help"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">help_outline</span>
                    Butuh bantuan atau belum punya kode?
                  </span>
                  <span className={`material-symbols-outlined text-[19px] transition-transform ${isHelpOpen ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>

                {isHelpOpen && (
                  <div id="activation-help" className="access-help-panel mt-2 rounded-xl border border-[#D9D8D0] bg-[#F5F4EF] p-4">
                    <p className="text-xs font-medium leading-relaxed text-[#626D66]">
                      Kode diberikan oleh pengelola TANITA. Jika kode hilang atau tidak dikenali, hubungi admin untuk pemeriksaan akses perangkat.
                    </p>
                    <a
                      href={getWaLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#BFD0C5] bg-white px-4 text-xs font-bold text-[#24533F] hover:border-[#71907D] hover:bg-[#EEF3EF]"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                      Hubungi admin melalui WhatsApp
                    </a>
                  </div>
                )}
              </div>

              <footer className="hidden text-center text-[10px] font-semibold text-[#90968F] sm:block">
                © 2026 TANITA · Aktivasi lokal perangkat
              </footer>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return <>{children}</>;
}
