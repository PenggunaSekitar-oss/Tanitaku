import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: false
        },
        manifest: {
          name: 'TANITA - Manajemen Pertanian',
          short_name: 'TANITA',
          description: 'Aplikasi manajemen operasional dan keuangan pertanian',
          id: '/',
          lang: 'id',
          start_url: '/',
          scope: '/',
          theme_color: '#24533F',
          background_color: '#F1F0EB',
          display: 'standalone',
          icons: [
            {
              src: 'https://res.cloudinary.com/ddc26noa/image/upload/c_pad,w_192,h_192,b_transparent/v1784860433/5199_1_j0xnzq.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'https://res.cloudinary.com/ddc26noa/image/upload/c_pad,w_512,h_512,b_transparent/v1784860433/5199_1_j0xnzq.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'https://res.cloudinary.com/ddc26noa/image/upload/c_pad,w_512,h_512,b_transparent/v1784860433/5199_1_j0xnzq.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled when DISABLE_HMR is set by the host environment.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
