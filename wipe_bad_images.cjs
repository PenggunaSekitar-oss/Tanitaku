const fs = require('fs');

function cleanFile(filename, urlField, latinField) {
    let content = fs.readFileSync(filename, 'utf-8');
    let rows = content.split('\n');
    let newRows = [];
    
    for (let i = 0; i < rows.length; i++) {
        let line = rows[i];
        if (line.includes(urlField + ":")) {
            // Find latin name
            let searchStr = "";
            for (let j = i; j >= Math.max(0, i - 15); j--) {
                let match = rows[j].match(new RegExp(`${latinField}:\\s*['"]([^'"]+)['"]`));
                if (match) {
                    searchStr = match[1];
                    break;
                }
            }
            
            let matchUrl = line.match(new RegExp(`${urlField}:\\s*["']([^"']+)["']`));
            if (matchUrl && searchStr) {
                let url = matchUrl[1];
                let genus = searchStr.split(' ')[0].replace(/[^a-zA-Z]/g, '');
                if (url.length > 0 && !url.toLowerCase().includes(genus.toLowerCase()) && !url.toLowerCase().includes('aphid') && !url.toLowerCase().includes('whitefly')) {
                    console.log(`Wiping: ${genus} - ${url}`);
                    line = line.replace(new RegExp(`${urlField}:\\s*["'][^"']+["']`), `${urlField}: ""`);
                } else if (url.includes('loremflickr')) {
                    line = line.replace(new RegExp(`${urlField}:\\s*["'][^"']+["']`), `${urlField}: ""`);
                }
            }
        }
        newRows.push(line);
    }
    fs.writeFileSync(filename, newRows.join('\n'));
}

cleanFile('src/views/JenisHamaView.tsx', 'gambar', 'latin');
cleanFile('src/views/CariPenyakitView.tsx', 'imageUrl', 'penyebab');
