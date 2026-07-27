const fs = require('fs');
let code = fs.readFileSync('vite.config.ts', 'utf-8');

if (!code.includes('devOptions')) {
  code = code.replace(
    /manifest: \{/,
    `devOptions: {\n          enabled: true\n        },\n        manifest: {`
  );
  fs.writeFileSync('vite.config.ts', code);
}
