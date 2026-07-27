const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

css = css.replace(
  /\.neo-btn:active \{/g,
  `.neo-btn:hover {
  transform: translateY(-2px);
  box-shadow: 4px 4px 0px 0px #000000;
  filter: brightness(1.05);
}

.neo-btn:active {`
);
fs.writeFileSync('src/index.css', css);
