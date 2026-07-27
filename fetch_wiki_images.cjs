const fs = require('fs');
const https = require('https');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWikiImage(query) {
    if (!query) return null;
    return new Promise((resolve) => {
        const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(query)}&pithumbsize=400&format=json`;
        const req = https.get(url, { headers: { 'User-Agent': 'TanitaBot/1.0 (https://tanita.app; dev@tanita.app)' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const pages = parsed.query.pages;
                    const firstPage = Object.values(pages)[0];
                    if (firstPage && firstPage.thumbnail) {
                        resolve(firstPage.thumbnail.source);
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null);
                }
            });
        });
        req.on('error', () => resolve(null));
    });
}

async function fixFile(file, urlField, searchField, isPenyakit = false) {
    let content = fs.readFileSync(file, 'utf-8');
    let rows = content.split('\n');
    let newRows = [];
    
    for (let i = 0; i < rows.length; i++) {
        let line = rows[i];
        if (line.includes(urlField + ":")) {
            // Find the search string in the preceding lines
            let searchStr = "";
            for (let j = i; j >= Math.max(0, i - 15); j--) {
                let match = rows[j].match(new RegExp(`${searchField}:\\s*['"]([^'"]+)['"]`));
                if (match) {
                    searchStr = match[1];
                    break;
                }
            }
            
            if (searchStr) {
                let query = "";
                if (isPenyakit) {
                    // Extract scientific name: usually first two words before any / or (
                    query = searchStr.split('/')[0].trim().split(' ').slice(0, 2).join(' ');
                    if (query.includes('Virus') || query.includes('virus')) query = searchStr; 
                } else {
                    query = searchStr.split(' ')[0] + (searchStr.split(' ')[1] ? ' ' + searchStr.split(' ')[1] : '');
                }

                console.log(`Looking up: ${query}`);
                let imgUrl = await fetchWikiImage(query);
                
                // Fallback to genus
                if (!imgUrl && query.includes(' ')) {
                    let genus = query.split(' ')[0];
                    console.log(`  Not found, trying genus: ${genus}`);
                    imgUrl = await fetchWikiImage(genus);
                }
                
                // Special mappings
                if (!imgUrl) {
                     if (query.includes('Spodoptera')) imgUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Spodoptera_litura_%2824045593674%29.jpg/400px-Spodoptera_litura_%2824045593674%29.jpg";
                     if (query.includes('Aphid')) imgUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Aphids_September_2008-1.jpg/400px-Aphids_September_2008-1.jpg";
                     if (query.includes('Bemisia')) imgUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Silverleaf_whitefly.jpg/400px-Silverleaf_whitefly.jpg";
                     if (query.includes('Bactrocera')) imgUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bactrocera_dorsalis.jpg/400px-Bactrocera_dorsalis.jpg";
                     if (query.includes('Tetranychus')) imgUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Tetranychus_urticae_1.jpg/400px-Tetranychus_urticae_1.jpg";
                     if (query.includes('Nilaparvata')) imgUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Nilaparvata_lugens_5.jpg/400px-Nilaparvata_lugens_5.jpg";
                }

                if (imgUrl) {
                    line = line.replace(new RegExp(`${urlField}:\\s*["'][^"']+["']`), `${urlField}: "${imgUrl}"`);
                    console.log(`  -> Found: ${imgUrl}`);
                } else {
                    console.log(`  -> Not found`);
                }
                
                await delay(200);
            }
        }
        newRows.push(line);
    }
    fs.writeFileSync(file, newRows.join('\n'));
    console.log(`Updated ${file}`);
}

(async () => {
    console.log("Fixing JenisHamaView.tsx");
    await fixFile('src/views/JenisHamaView.tsx', 'gambar', 'latin', false);
    console.log("Fixing CariPenyakitView.tsx");
    await fixFile('src/views/CariPenyakitView.tsx', 'imageUrl', 'penyebab', true);
})();
