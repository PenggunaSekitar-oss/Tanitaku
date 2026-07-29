import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker
const updateSW = registerSW({
  onNeedRefresh() {
    try {
      sessionStorage.setItem('tanita_pwa_update_ready', 'true');
    } catch {
      // The in-app event below still displays the update prompt.
    }
    window.dispatchEvent(new Event('tanita-pwa-update-ready'));
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

window.addEventListener('tanita-apply-pwa-update', () => {
  void updateSW(true);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
