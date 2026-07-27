import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TaniOpsProvider } from './context/TaniOpsContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PintasanModal } from './components/PintasanModal';
import { AccessGate } from './components/AccessGate';
import { DashboardView } from './views/DashboardView';
import { PemantauanView } from './views/PemantauanView';
import { PemupukanView } from './views/PemupukanView';
import { KocorView } from './views/KocorView';
import { JenisHamaView } from './views/JenisHamaView';
import { KeuanganView } from './views/KeuanganView';
import { LogAktivitasView } from './views/LogAktivitasView';
import { PengaturanView } from './views/PengaturanView';
import { CariBibitView } from './views/CariBibitView';
import { CariPupukView } from './views/CariPupukView';
import { CariPestisidaView } from './views/CariPestisidaView';
import { CariPenyakitView } from './views/CariPenyakitView';
import { ToastProvider } from './context/ToastContext';
import { AgriDynamicToastNotifier } from './components/AgriDynamicToastNotifier';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pintasanOpen, setPintasanOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'light');
  }, []);

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <DashboardView navigate={setCurrentView} />;
      case 'pemantauan': return <PemantauanView />;
      case 'pemupukan': return <PemupukanView />;
      case 'kocor': return <KocorView />;
      case 'jenis-hama': return <JenisHamaView />;
      case 'cari-bibit': return <CariBibitView />;
      case 'cari-pupuk': return <CariPupukView />;
      case 'cari-pestisida': return <CariPestisidaView />;
      case 'cari-penyakit': return <CariPenyakitView navigate={setCurrentView} />;
      case 'keuangan': return <KeuanganView />;
      case 'log': return <LogAktivitasView />;
      case 'pengaturan': return <PengaturanView navigate={setCurrentView} />;
      default: return <DashboardView navigate={setCurrentView} />;
    }
  };

  return (
    <ToastProvider>
      <TaniOpsProvider>
        <AgriDynamicToastNotifier navigate={setCurrentView} />
        <AccessGate>
          <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-[#154734] selection:text-white">
            <Sidebar currentView={currentView} onNavigate={setCurrentView} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
                      {renderView()}
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
                onNavigate={setCurrentView}
                onOpenSidebar={() => setSidebarOpen(true)}
                onOpenPintasan={() => setPintasanOpen(true)}
              />
            </div>

            {/* Modal Pintasan Fitur Operasional */}
            <PintasanModal
              isOpen={pintasanOpen}
              onClose={() => setPintasanOpen(false)}
              onNavigate={setCurrentView}
              currentView={currentView}
            />
          </div>
        </AccessGate>
      </TaniOpsProvider>
    </ToastProvider>
  );
}

