const fs = require('fs');

let content = fs.readFileSync('src/views/DashboardView.tsx', 'utf-8');

// Add import
if (!content.includes('BannerCarousel')) {
  content = content.replace(
    'import {',
    'import { BannerCarousel } from "../components/BannerCarousel";\nimport {'
  );
}

// Replace banner
const target = `<div className="w-full h-48 md:h-64 rounded-sm overflow-hidden border border-outline relative">
        <img
          src="https://i.ibb.co/TpSCDZL/1784535226661.png"
          alt="Dashboard Banner"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>`;

content = content.replace(target, '<BannerCarousel />');

fs.writeFileSync('src/views/DashboardView.tsx', content);
