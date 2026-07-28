import { lazy, Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TaniOpsProvider } from './context/TaniOpsContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PintasanModal } from './components/PintasanModal';
import { AccessGate } from './components/AccessGate';
import { ToastProvider } from './context/ToastContext';
import { AgriDynamicToastNotifier } from './components/AgriDynamicToastNotifier';
import { BrandLockup } from './components/BrandLockup';

const DashboardView = lazy(() => import('./views/DashboardView').then((module) => ({ default: module.DashboardView })));
const PemantauanView = lazy(() => import('./views/PemantauanView').then((module) => ({ default: module.PemantauanView })));
const PemupukanView = lazy(() => import('./views/PemupukanView').then((module) => ({ default: module.PemupukanView })));
const KocorView = lazy(() => import('./views/KocorView').then((module) => ({ default: module.KocorView })));
const JenisHamaView = lazy(() => import('./views/JenisHamaView').then((module) => ({ default: module.JenisHamaView })));
const KeuanganView = lazy(() => import('./views/KeuanganView').then((module) => ({ default: module.KeuanganView })));
const LogAktivitasView = lazy(() => import('./views/LogAktivitasView').then((module) => ({ default: module.LogAktivitasView })));
const PengaturanView = lazy(() => import('./views/PengaturanView').then((module) => ({ default: module.PengaturanView })));
const CariBibitView = lazy(() => import('./views/CariBibitView').then((module) => ({ default: module.CariBibitView })));
const CariPupukView = lazy(() => import('./views/CariPupukView').then((module) => ({ default: module.CariPupukView })));
const CariPestisidaView = lazy(() => import('./views/CariPestisidaView').then((module) => ({ default: module.CariPestisidaView })));
const CariPenyakitView = lazy(() => import('./views/CariPenyakitView').then((module) => ({ default: module.CariPenyakitView })));

const VALID_VIEWS = new Set([
  'dashboard',
  'pemantauan',
  'pemupukan',
  'kocor',
  'jenis-hama',
  'cari-bibit',
  'cari-pupuk',
  'cari-pestisida',
  'cari-penyakit',
  'keuangan',
  'log',
  'pengaturan',
]);

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const hashView = window.location.hash.replace(/^#\/?/, '');
    return VALID_VIEWS.has(hashView) ? hashView : 'dashboard';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pintasanOpen, setPintasanOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    try {
      localStorage.setItem('theme', 'light');
    } catch {
      // The interface does not depend on persisting the fixed light theme.
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hashView = window.location.hash.replace(/^#\/?/, '');
      setCurrentView(VALID_VIEWS.has(hashView) ? hashView : 'dashboard');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: string) => {
    const nextView = VALID_VIEWS.has(view) ? view : 'dashboard';
    if (window.location.hash !== `#/${nextView}`) {
      window.location.hash = `/${nextView}`;
    }
    setCurrentView(nextView);
  };

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <DashboardView navigate={navigateTo} />;
      case 'pemantauan': return <PemantauanView />;
      case 'pemupukan': return <PemupukanView />;
      case 'kocor': return <KocorView />;
      case 'jenis-hama': return <JenisHamaView />;
      case 'cari-bibit': return <CariBibitView />;
      case 'cari-pupuk': return <CariPupukView />;
      case 'cari-pestisida': return <CariPestisidaView />;
      case 'cari-penyakit': return <CariPenyakitView navigate={navigateTo} />;
      case 'keuangan': return <KeuanganView />;
      case 'log': return <LogAktivitasView />;
      case 'pengaturan': return <PengaturanView />;
      default: return <DashboardView navigate={navigateTo} />;
    }
  };

  return (
    <ToastProvider>
      <TaniOpsProvider>
        <AccessGate>
          <AgriDynamicToastNotifier navigate={navigateTo} />
          <div className="app-shell flex h-screen overflow-hidden bg-[#F2F1EC] text-[#1C211D] font-sans selection:bg-[#24533F] selection:text-white">
            <Sidebar currentView={currentView} onNavigate={navigateTo} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="relative flex min-w-0 flex-1 flex-col bg-[#F2F1EC]">
              <Topbar currentView={currentView} onOpenSidebar={() => setSidebarOpen(true)} />
              <div className="flex-1 overflow-y-auto flex flex-col justify-between">
                <main className="app-content mx-auto w-full max-w-[1440px] flex-1 p-4 sm:p-6 lg:p-8 xl:px-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentView}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="w-full h-full"
                    >
                      <Suspense
                        fallback={
                          <div className="min-h-[40vh] flex items-center justify-center text-sm font-bold text-slate-500">
                            Memuat modul TANITA…
                          </div>
                        }
                      >
                        {renderView()}
                      </Suspense>
                    </motion.div>
                  </AnimatePresence>
                </main>
                <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#D9D8D1] bg-[#F7F6F1] px-6 py-5 pb-20 text-center md:flex-row md:pb-5">
                  <BrandLockup compact />
                  <span className="text-[10px] font-medium text-[#747D77]">© 2026 TANITA · Operasional kebun</span>
                </footer>
              </div>
              <MobileBottomNav
                currentView={currentView}
                onNavigate={navigateTo}
                onOpenSidebar={() => setSidebarOpen(true)}
                onOpenPintasan={() => setPintasanOpen(true)}
              />
            </div>

            {/* Modal Pintasan Fitur Operasional */}
            <PintasanModal
              isOpen={pintasanOpen}
              onClose={() => setPintasanOpen(false)}
              onNavigate={navigateTo}
              currentView={currentView}
            />
          </div>
        </AccessGate>
      </TaniOpsProvider>
    </ToastProvider>
  );
}
