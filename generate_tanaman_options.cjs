const fs = require('fs');
let content = fs.readFileSync('src/views/CariPenyakitView.tsx', 'utf-8');

const newData = `const TANAMAN_OPTIONS = [
  { value: 'Semua', label: 'Semua Tanaman' },
  { value: 'Cabai', label: 'Cabai (Rawit/Merah/Besar)' },
  { value: 'Tomat', label: 'Tomat' },
  { value: 'Terong', label: 'Terong' },
  { value: 'Bawang Merah', label: 'Bawang Merah / Putih' },
  { value: 'Kubis', label: 'Kubis, Sawi, Brokoli (Brassicaceae)' },
  { value: 'Kacang', label: 'Kacang-kacangan (Panjang/Buncis/Kedelai)' },
  { value: 'Mentimun', label: 'Mentimun & Melon & Semangka' },
  { value: 'Kangkung', label: 'Kangkung & Bayam & Selada' },
  { value: 'Jagung', label: 'Jagung & Jagung Manis' },
  { value: 'Padi', label: 'Padi' },
  { value: 'Pepaya', label: 'Pepaya' },
  { value: 'Pisang', label: 'Pisang' },
  { value: 'Mangga', label: 'Mangga & Jeruk' },
  { value: 'Perkebunan', label: 'Kopi, Kakao, Karet, Sawit' }
];`;

let startIdx = content.indexOf('const TANAMAN_OPTIONS = [');
let endIdx = content.indexOf('];', startIdx) + 2;

content = content.substring(0, startIdx) + newData + content.substring(endIdx);

fs.writeFileSync('src/views/CariPenyakitView.tsx', content);
