const fs = require('fs');

let content = fs.readFileSync('src/views/CariBibitView.tsx', 'utf-8');

// Function to determine properties based on komoditas
function getExtraData(komoditas) {
  const k = komoditas.toLowerCase();
  let umurPanen = "60-70 HST";
  let potensiHasil = "15-20 ton/ha";
  let harga = "Rp 50.000 / 10gr";

  if (k.includes('cabai rawit')) {
    umurPanen = "80-90 HST"; potensiHasil = "10-15 ton/ha"; harga = "Rp 135.000 / 10gr";
  } else if (k.includes('cabai merah')) {
    umurPanen = "75-85 HST"; potensiHasil = "15-20 ton/ha"; harga = "Rp 140.000 / 10gr";
  } else if (k.includes('tomat')) {
    umurPanen = "60-70 HST"; potensiHasil = "40-60 ton/ha"; harga = "Rp 95.000 / 5gr";
  } else if (k.includes('bawang merah')) {
    umurPanen = "60-70 HST"; potensiHasil = "15-20 ton/ha"; harga = "Rp 110.000 / 50gr (TSS)";
  } else if (k.includes('bawang daun')) {
    umurPanen = "60-75 HST"; potensiHasil = "15-20 ton/ha"; harga = "Rp 75.000 / 10gr";
  } else if (k.includes('kubis') || k.includes('kol')) {
    umurPanen = "60-75 HST"; potensiHasil = "40-50 ton/ha"; harga = "Rp 150.000 / 20gr";
  } else if (k.includes('sawi') || k.includes('pakcoy')) {
    umurPanen = "25-30 HST"; potensiHasil = "20-25 ton/ha"; harga = "Rp 25.000 / 25gr";
  } else if (k.includes('selada')) {
    umurPanen = "30-40 HST"; potensiHasil = "10-15 ton/ha"; harga = "Rp 35.000 / 15gr";
  } else if (k.includes('terong')) {
    umurPanen = "50-60 HST"; potensiHasil = "40-50 ton/ha"; harga = "Rp 55.000 / 10gr";
  } else if (k.includes('timun')) {
    umurPanen = "35-40 HST"; potensiHasil = "40-50 ton/ha"; harga = "Rp 45.000 / 20gr";
  } else if (k.includes('pare')) {
    umurPanen = "40-50 HST"; potensiHasil = "20-25 ton/ha"; harga = "Rp 60.000 / 10gr";
  } else if (k.includes('kacang panjang')) {
    umurPanen = "45-50 HST"; potensiHasil = "15-20 ton/ha"; harga = "Rp 50.000 / 50gr";
  } else if (k.includes('buncis')) {
    umurPanen = "45-50 HST"; potensiHasil = "15-20 ton/ha"; harga = "Rp 45.000 / 50gr";
  } else if (k.includes('melon')) {
    umurPanen = "65-75 HST"; potensiHasil = "30-40 ton/ha"; harga = "Rp 180.000 / 20gr";
  } else if (k.includes('semangka')) {
    umurPanen = "65-75 HST"; potensiHasil = "30-40 ton/ha"; harga = "Rp 150.000 / 20gr";
  } else if (k.includes('jagung')) {
    umurPanen = "70-80 HST"; potensiHasil = "15-20 ton/ha"; harga = "Rp 110.000 / 1kg";
  } else if (k.includes('kangkung')) {
    umurPanen = "20-25 HST"; potensiHasil = "10-15 ton/ha"; harga = "Rp 20.000 / 500gr";
  } else if (k.includes('bayam')) {
    umurPanen = "20-25 HST"; potensiHasil = "10-15 ton/ha"; harga = "Rp 25.000 / 50gr";
  } else if (k.includes('edamame')) {
    umurPanen = "65-70 HST"; potensiHasil = "10-12 ton/ha"; harga = "Rp 65.000 / 500gr";
  } else if (k.includes('kacang tanah')) {
    umurPanen = "90-100 HST"; potensiHasil = "2-3 ton/ha"; harga = "Rp 35.000 / 1kg";
  } else if (k.includes('kacang merah')) {
    umurPanen = "60-70 HST"; potensiHasil = "1.5-2 ton/ha"; harga = "Rp 40.000 / 500gr";
  } else if (k.includes('pepaya')) {
    umurPanen = "7-9 Bulan"; potensiHasil = "60-80 ton/ha"; harga = "Rp 250.000 / 10gr";
  } else if (k.includes('wortel')) {
    umurPanen = "90-100 HST"; potensiHasil = "20-30 ton/ha"; harga = "Rp 150.000 / 100gr";
  } else if (k.includes('kentang')) {
    umurPanen = "100-110 HST"; potensiHasil = "20-25 ton/ha"; harga = "Rp 25.000 / kg (umbi)";
  }
  
  return { umurPanen, potensiHasil, harga };
}

// Replace in CATALOG
content = content.replace(/\{ komoditas: (.*?), nama: (.*?), produsen: (.*?), ketinggian: (.*?), cuaca: (.*?), keunggulan: (.*?), kekurangan: (.*?) \}/g, (match, kom, nama, prod, ket, cuaca, keu, kek) => {
  // eval to get the actual string
  const komStr = eval(kom);
  const extra = getExtraData(komStr);
  return `{ komoditas: ${kom}, nama: ${nama}, produsen: ${prod}, ketinggian: ${ket}, cuaca: ${cuaca}, umurPanen: '${extra.umurPanen}', potensiHasil: '${extra.potensiHasil}', harga: '${extra.harga}', keunggulan: ${keu}, kekurangan: ${kek} }`;
});

// Update the render part
const renderKekurangan = `
                  <div className="border-t border-outline pt-3 mt-auto flex flex-col gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-action block mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">check_circle</span> Keunggulan Utama</span>
                      <p className="text-sm text-on-surface leading-relaxed">{item.keunggulan}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-danger block mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">warning</span> Kekurangan / Tantangan</span>
                      <p className="text-sm text-on-surface leading-relaxed">{item.kekurangan}</p>
                    </div>
                  </div>
`;

const currentRender = `                  <div className="border-t border-outline pt-3 mt-auto flex flex-col gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-action block mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">check_circle</span> Keunggulan Utama</span>
                      <p className="text-sm text-on-surface leading-relaxed">{item.keunggulan}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-danger block mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">warning</span> Kekurangan / Tantangan</span>
                      <p className="text-sm text-on-surface leading-relaxed">{item.kekurangan}</p>
                    </div>
                  </div>`;

const newRender = `
                  <div className="grid grid-cols-2 gap-2 my-2">
                    <div className="bg-surface-high p-2 border border-outline rounded-sm flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-muted">Umur Panen</span>
                      <span className="text-sm font-bold text-on-surface">{item.umurPanen}</span>
                    </div>
                    <div className="bg-surface-high p-2 border border-outline rounded-sm flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-muted">Potensi Hasil</span>
                      <span className="text-sm font-bold text-on-surface">{item.potensiHasil}</span>
                    </div>
                    <div className="col-span-2 bg-primary/10 p-2 border border-primary/20 rounded-sm flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-primary">Estimasi Harga</span>
                      <span className="text-sm font-bold text-primary-dark">{item.harga}</span>
                    </div>
                  </div>

                  <div className="border-t border-outline pt-3 mt-auto flex flex-col gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-action block mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">check_circle</span> Keunggulan Utama</span>
                      <p className="text-sm text-on-surface leading-relaxed">{item.keunggulan}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-danger block mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">warning</span> Kekurangan / Tantangan</span>
                      <p className="text-sm text-on-surface leading-relaxed">{item.kekurangan}</p>
                    </div>
                  </div>`;
                  
content = content.replace(currentRender, newRender.trim());

fs.writeFileSync('src/views/CariBibitView.tsx', content);
