const sharp = require('sharp');
const fs = require('fs');

async function run() {
  try {
    const buffer = await sharp('public/logo.jpg')
      .resize(128, 128, { fit: 'inside' })
      .webp({ quality: 80 })
      .toBuffer();
    
    const base64 = buffer.toString('base64');
    const dataUri = `data:image/webp;base64,${base64}`;
    
    fs.mkdirSync('src/assets', { recursive: true });
    fs.writeFileSync('src/assets/logoBase64.ts', `export const logoBase64 = "${dataUri}";\n`);
    console.log('Logo optimized and saved as base64!');
  } catch (err) {
    console.error(err);
  }
}
run();
