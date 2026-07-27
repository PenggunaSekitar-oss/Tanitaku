const fs = require('fs');
let code = fs.readFileSync('src/components/Topbar.tsx', 'utf-8');

code = code.replace(
  /export function Topbar\(\{ onOpenSidebar \}: any\) \{/,
  `export function Topbar({ onOpenSidebar }: any) {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setInstallPrompt(null);
      });
    }
  };`
);

code = code.replace(
  /<div className="flex items-center gap-2">/,
  `<div className="flex items-center gap-2">
        {installPrompt && (
          <button 
            onClick={handleInstallClick} 
            className="flex items-center gap-2 bg-action text-on-action px-3 py-1.5 rounded-[8px_3px_8px_3px] neo-border-thin shadow-[2px_2px_0px_0px_#000] font-bold text-xs hover:-translate-y-0.5 transition-transform"
            title="Install Aplikasi"
          >
            <span className="material-symbols-outlined text-[16px]">install_mobile</span>
            <span className="hidden sm:inline">Install App</span>
          </button>
        )}`
);

fs.writeFileSync('src/components/Topbar.tsx', code);
