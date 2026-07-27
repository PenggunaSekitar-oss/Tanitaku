const fs = require('fs');
let code = fs.readFileSync('src/components/BannerCarousel.tsx', 'utf-8');
code = code.replace(
  /const images = \[[^\]]+\];/,
  `const images = [
  "https://res.cloudinary.com/ddc26noa/image/upload/v1784590991/1784535226661_lmfq6y.png",
  "https://res.cloudinary.com/ddc26noa/image/upload/v1784590991/1784550998344_sf7yal.png",
  "https://res.cloudinary.com/ddc26noa/image/upload/v1784590990/1784551043450_llwkxc.png",
  "https://res.cloudinary.com/ddc26noa/image/upload/v1784590990/1784550949921_mtgrpu.png"
];`
);
fs.writeFileSync('src/components/BannerCarousel.tsx', code);
