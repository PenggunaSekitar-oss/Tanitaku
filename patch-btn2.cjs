const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

css = css.replace(
  /filter: brightness\(1\.05\);/g,
  `filter: brightness(1.1);`
);
fs.writeFileSync('src/index.css', css);
