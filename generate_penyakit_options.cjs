const fs = require('fs');
let content = fs.readFileSync('src/views/CariPenyakitView.tsx', 'utf-8');

const newData = `const PENYAKIT_OPTIONS = [
  { value: 'Patek', label: 'Antraknosa (Patek)' },
  { value: 'Layu Fusarium', label: 'Layu Fusarium' },
  { value: 'Layu Bakteri', label: 'Layu Bakteri' },
  { value: 'Bercak Daun', label: 'Bercak Daun Cercospora' },
  { value: 'Busuk Daun', label: 'Busuk Daun Phytophthora' },
  { value: 'Virus Kuning', label: 'Virus Kuning (Gemini Virus)' },
  { value: 'Akar Gada', label: 'Akar Gada (Clubroot)' },
  { value: 'Bercak Ungu', label: 'Bercak Ungu (Trotol)' },
  { value: 'Busuk Bakteri', label: 'Busuk Bakteri (Erwinia)' },
  { value: 'Embun Bulu', label: 'Embun Bulu (Downy Mildew)' },
  { value: 'Embun Tepung', label: 'Embun Tepung (Powdery Mildew)' },
  { value: 'Karat Daun', label: 'Karat Daun' },
  { value: 'Rebah Semai', label: 'Rebah Semai (Damping Off)' },
  { value: 'Busuk Pangkal Batang', label: 'Busuk Pangkal Batang' },
  { value: 'Hawar Daun Jagung', label: 'Hawar Daun Jagung' },
  { value: 'Bulai Jagung', label: 'Bulai Jagung' },
  { value: 'Karat Putih', label: 'Karat Putih' },
  { value: 'Pucuk Pucat', label: 'Pucuk Pucat (Mboler)' },
  { value: 'Jamur Upas', label: 'Jamur Upas' },
  { value: 'Bercak Coklat', label: 'Bercak Coklat' },
  { value: 'Bercak Cincin Pepaya', label: 'Bercak Cincin Pepaya' },
  { value: 'Busuk Leher Akar', label: 'Busuk Leher Akar (Lanas)' },
  { value: 'Hawar Pelepah Padi', label: 'Hawar Pelepah Padi' },
  { value: 'Blas Padi', label: 'Blas Padi (Potong Leher)' },
  { value: 'Layu Verticillium', label: 'Layu Verticillium' },
  { value: 'Kanker Batang', label: 'Kanker Batang Karet/Kakao' },
  { value: 'Busuk Pangkal Batang Sawit', label: 'Busuk Pangkal Batang Sawit' },
  { value: 'Embun Jelaga', label: 'Embun Jelaga' },
  { value: 'Bercak Daun Bakteri', label: 'Bercak Daun Bakteri (Xanthomonas)' },
  { value: 'Hawar Daun Bakteri', label: 'Hawar Daun Bakteri (Kresek)' },
  { value: 'Kanker Bakteri Jeruk', label: 'Kanker Bakteri Jeruk (Citrus Canker)' },
  { value: 'Busuk Hitam', label: 'Busuk Hitam (Black Rot)' },
  { value: 'Penyakit Darah Pisang', label: 'Penyakit Darah Pisang' },
  { value: 'Gusung Bulir Bakteri', label: 'Gusung Bulir Bakteri' },
  { value: 'Penyakit Kuning Jati', label: 'Penyakit Kuning Jati' },
  { value: 'Kudis Bakteri', label: 'Kudis Bakteri (Bacterial Scab)' },
  { value: 'Virus Mosaik', label: 'Virus Mosaik (TMV/CMV)' },
  { value: 'Virus Keriting Bule', label: 'Virus Keriting Bule (CVBV)' },
  { value: 'Penyakit Tungro', label: 'Penyakit Tungro' },
  { value: 'Bercak Cincin Kerdil', label: 'Bercak Cincin Kerdil (PRSV)' },
  { value: 'Penyakit Kerdil Rumput', label: 'Penyakit Kerdil Rumput (Grassy Stunt)' },
  { value: 'Mosaik Belang Kacang Panjang', label: 'Mosaik Belang Kacang Panjang' },
  { value: 'Kerdil Pisang', label: 'Kerdil Pisang (Bunchy Top)' },
  { value: 'Nematoda Bintil Akar', label: 'Nematoda Bintil Akar (Root-Knot)' },
  { value: 'Busuk Pangkal', label: 'Busuk Pangkal (Phoma)' }
];`;

let startIdx = content.indexOf('const PENYAKIT_OPTIONS = [');
let endIdx = content.indexOf('];', startIdx) + 2;

content = content.substring(0, startIdx) + newData + content.substring(endIdx);

fs.writeFileSync('src/views/CariPenyakitView.tsx', content);
