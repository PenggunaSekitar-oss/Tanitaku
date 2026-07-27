const fs = require('fs');
let code = fs.readFileSync('src/views/PemantauanView.tsx', 'utf-8');

code = code.replace(
  "const [deleteMessage, setDeleteMessage] = useState('');",
  "const [deleteMessage, setDeleteMessage] = useState('');\n  const [panenConfirmOpen, setPanenConfirmOpen] = useState(false);\n  const [panenId, setPanenId] = useState<string | null>(null);"
);

code = code.replace(
  /<ConfirmModal\s*isOpen=\{deleteConfirmOpen\}[\s\S]*?\/>/,
  `$&
        <ConfirmModal 
          isOpen={panenConfirmOpen} 
          message="Tandai tanaman ini sudah dipanen?" 
          confirmText="TANDAI PANEN"
          onConfirm={() => {
            if (panenId) {
              updateTanaman(panenId, { status: 'Panen' });
              showToast('Status tanaman diubah menjadi Panen', 'success');
              setPanenConfirmOpen(false);
              setPanenId(null);
            }
          }} 
          onCancel={() => {
            setPanenConfirmOpen(false);
            setPanenId(null);
          }} 
        />`
);

code = code.replace(
  /if \(window\.confirm\("Tandai tanaman ini sudah dipanen\?"\)\) \{\s*updateTanaman\(t\.id, \{ status: 'Panen' \}\);\s*\}/,
  `setPanenId(t.id);\n                                setPanenConfirmOpen(true);`
);

fs.writeFileSync('src/views/PemantauanView.tsx', code);
