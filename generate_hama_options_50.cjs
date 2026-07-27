const fs = require('fs');
let content = fs.readFileSync('src/views/CariPestisidaView.tsx', 'utf-8');

const newOptions = `const HAMA_OPTIONS = [
  { value: 'Ulat Grayak', label: 'Ulat Grayak (Spodoptera)' },
  { value: 'Ulat Tanah', label: 'Ulat Tanah (Agrotis)' },
  { value: 'Ulat Penggerek Batang', label: 'Ulat Penggerek Batang / Buah' },
  { value: 'Ulat Plutella', label: 'Ulat Plutella (Hama Kubis)' },
  { value: 'Kutu Kebul', label: 'Kutu Kebul (Bemisia tabaci)' },
  { value: 'Kutu Daun', label: 'Kutu Daun (Aphids / Myzus)' },
  { value: 'Thrips', label: 'Thrips' },
  { value: 'Tungau', label: 'Tungau Merah / Kuning (Mites)' },
  { value: 'Lalat Buah', label: 'Lalat Buah (Bactrocera)' },
  { value: 'Pengorok Daun', label: 'Lalat Pengorok Daun (Liriomyza)' },
  { value: 'Wereng', label: 'Wereng Coklat / Hijau' },
  { value: 'Walang Sangit', label: 'Walang Sangit' },
  { value: 'Kepik Hijau', label: 'Kepik Hijau / Lembing' },
  { value: 'Orong-orong', label: 'Orong-orong (Anjing Tanah)' },
  { value: 'Oteng-oteng', label: 'Oteng-oteng (Kumbang Daun)' },
  { value: 'Siput', label: 'Siput Babi / Bekicot / Keong Mas' },
  { value: 'Rayap', label: 'Rayap / Semut Tanah' },
  { value: 'Nematoda', label: 'Nematoda Bintil Akar (Puruh Akar)' },
  { value: 'Semut', label: 'Semut Api / Hitam' },
  { value: 'Belalang', label: 'Belalang Kayu / Hijau' },
  { value: 'Kutu Putih', label: 'Kutu Putih (Mealybug)' },
  { value: 'Ulat Jengkal', label: 'Ulat Jengkal' },
  { value: 'Ulat Penggulung Daun', label: 'Ulat Penggulung Daun' },
  { value: 'Ganjur', label: 'Lalat Ganjur (Padi)' },
  { value: 'Kutu Sisik', label: 'Kutu Sisik (Scale insect)' },
  { value: 'Ulat Api', label: 'Ulat Api' },
  
  // Penyakit
  { value: 'Patek', label: 'Antraknosa (Patek)' },
  { value: 'Bercak Daun', label: 'Bercak Daun (Cercospora / Septoria)' },
  { value: 'Busuk Daun', label: 'Busuk Daun (Phytophthora)' },
  { value: 'Layu Fusarium', label: 'Layu Fusarium (Layu Jamur)' },
  { value: 'Layu Bakteri', label: 'Layu Bakteri (Ralstonia)' },
  { value: 'Virus Kuning', label: 'Virus Kuning (Gemini)' },
  { value: 'Mosaik Virus', label: 'Mosaik Virus (TMV / CMV)' },
  { value: 'Akar Gada', label: 'Akar Gada (Clubroot)' },
  { value: 'Bercak Ungu', label: 'Bercak Ungu (Trotol)' },
  { value: 'Busuk Bakteri', label: 'Busuk Lunak Bakteri (Erwinia)' },
  { value: 'Embun Bulu', label: 'Embun Bulu (Downy Mildew)' },
  { value: 'Embun Tepung', label: 'Embun Tepung (Powdery Mildew)' },
  { value: 'Karat Daun', label: 'Karat Daun' },
  { value: 'Rebah Semai', label: 'Rebah Semai (Damping Off)' },
  { value: 'Busuk Batang', label: 'Busuk Batang / Leher Akar' },
  { value: 'Bercak Bakteri', label: 'Bercak Daun Bakteri (Xanthomonas)' },
  { value: 'Pucuk Pucat', label: 'Mboler / Pucuk Pucat (Bawang)' },
  { value: 'Kudis Buah', label: 'Kudis Buah (Scab)' },
  { value: 'Busuk Buah', label: 'Busuk Buah / Basah' },
  { value: 'Layu Verticillium', label: 'Layu Verticillium' },
  { value: 'Kanker Batang', label: 'Kanker Batang' },
  { value: 'Bercak Coklat', label: 'Bercak Coklat' },
  { value: 'Hawar Daun', label: 'Hawar Daun' },
  { value: 'Penyakit Karat Putih', label: 'Karat Putih' }
];`;

let optStart = content.indexOf('const HAMA_OPTIONS = [');
let optEnd = content.indexOf('];', optStart) + 2;

content = content.substring(0, optStart) + newOptions + content.substring(optEnd);

fs.writeFileSync('src/views/CariPestisidaView.tsx', content);
