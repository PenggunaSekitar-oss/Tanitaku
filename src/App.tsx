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
    localStorage.setItem('theme', 'light');
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
      case 'pengaturan': return <PengaturanView navigate={navigateTo} />;
      default: return <DashboardView navigate={navigateTo} />;
    }
  };

  return (
    <ToastProvider>
      <TaniOpsProvider>
        <AccessGate>
          <AgriDynamicToastNotifier navigate={navigateTo} />
          <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-[#154734] selection:text-white">
            <Sidebar currentView={currentView} onNavigate={navigateTo} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
              <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
              <div className="flex-1 overflow-y-auto flex flex-col justify-between">
                <main className="p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto flex-1">
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
                <footer className="bg-[#FEFEFA] text-slate-800 font-medium text-center py-4 px-6 border-t border-slate-200/80 text-xs sm:text-sm flex flex-col sm:flex-row justify-between items-center gap-2 mt-8 pb-20 md:pb-4">
                  <div className="flex items-center gap-2 font-display font-semibold text-slate-900">
                    <img 
                      src="https://res.cloudinary.com/ddc26noa/image/upload/v1784860433/5199_1_j0xnzq.png" 
                      alt="TANITA Logo" 
                      className="h-6 sm:h-7 w-auto object-contain shrink-0" 
                    />
                    <span className="text-slate-600 text-xs sm:text-sm font-medium">&mdash; Presisi Pertanian Indonesia</span>
                  </div>
                  <span className="text-slate-500 text-xs">©2026 TANITA &middot; Dibangun oleh Muh Amin Arsyad</span>
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
