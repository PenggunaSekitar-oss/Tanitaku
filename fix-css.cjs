const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');
css = css.replace(
  /:root\.light\s*\{[^}]*--action-color:\s*#FFEE32;[^}]*\}/,
  (match) => {
    return match.replace('--action-color: #FFEE32;', '--action-color: #b45309;');
  }
);
fs.writeFileSync('src/index.css', css);
