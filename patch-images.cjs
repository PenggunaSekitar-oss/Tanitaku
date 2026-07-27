const fs = require('fs');

let content = fs.readFileSync('src/views/CariPenyakitView.tsx', 'utf-8');

const replacements = [
  { name: 'Antraknosa (Patek)', url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Colletotrichum_lindemuthianum.jpg' },
  { name: 'Layu Fusarium', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Fusarium_wilt_symptom_tobacco.jpg/960px-Fusarium_wilt_symptom_tobacco.jpg' },
  { name: 'Layu Bakteri', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Ralstonia_solanacearum_symptoms.jpg/960px-Ralstonia_solanacearum_symptoms.jpg' },
  { name: 'Bercak Daun Cercospora', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Cercospora_beticola_on_sugar_beet.jpeg/960px-Cercospora_beticola_on_sugar_beet.jpeg' },
  { name: 'Busuk Daun Phytophthora', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Late_blight_on_potato_leaf_2.jpg/960px-Late_blight_on_potato_leaf_2.jpg' },
  { name: 'Virus Kuning (Gemini Virus)', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Abutilon_pictum_serres_du_Luxembourg.jpg/960px-Abutilon_pictum_serres_du_Luxembourg.jpg' },
  { name: 'Akar Gada (Clubroot)', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Knolvoet_bij_bloemkool_%28Plasmodiophora_brassicae_on_cauliflower%29.jpg/960px-Knolvoet_bij_bloemkool_%28Plasmodiophora_brassicae_on_cauliflower%29.jpg' },
  { name: 'Bercak Ungu (Trotol)', url: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Chain_of_conidia_of_an_Alternaria_sp._fungus_PHIL_3963_lores.jpg' },
  { name: 'Busuk Bakteri (Erwinia)', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Slime_flux_on_Camperdown_elm.png/960px-Slime_flux_on_Camperdown_elm.png' },
  { name: 'Embun Bulu (Downy Mildew)', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Downy_and_Powdery_mildew_on_grape_leaf.JPG' },
  { name: 'Embun Tepung (Powdery Mildew)', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Golovinomyces_sordidus_on_Broadleaf_Plantain_-_Plantago_major_%2844171864324%29.jpg/960px-Golovinomyces_sordidus_on_Broadleaf_Plantain_-_Plantago_major_%2844171864324%29.jpg' },
  { name: 'Rebah Semai (Damping Off)', url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Pinus_taeda_seedling_damping_off_%28cropped%29.jpg' }
];

// Instead of regex which can be tricky, I will parse PENYAKIT_CATALOG out, replace imageUrl fields, and inject back.
// But it's easier to just do a smart regex replacement since they are in order and have unique names.

replacements.forEach(r => {
    // Find the object block that has this name.
    const nameStr = `nama: '${r.name}'`;
    const blockStart = content.indexOf(nameStr);
    if (blockStart > -1) {
        const nextUrlPos = content.indexOf('imageUrl:', blockStart);
        if (nextUrlPos > -1) {
            const endUrlPos = content.indexOf('\n', nextUrlPos);
            const oldLine = content.substring(nextUrlPos, endUrlPos);
            
            // replace it
            content = content.replace(oldLine, `imageUrl: '${r.url}'`);
        }
    }
});

// Since the new images are realistic, let's remove the heavy css filter so they look natural.
content = content.replace('filter contrast-110 saturate-150', '');
content = content.replace('filter contrast-110', '');

fs.writeFileSync('src/views/CariPenyakitView.tsx', content);
