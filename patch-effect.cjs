const fs = require('fs');
let code = fs.readFileSync('src/views/KeuanganView.tsx', 'utf-8');

code = code.replace(
  "const [deleteMessage, setDeleteMessage] = useState('');",
  `const [deleteMessage, setDeleteMessage] = useState('');

  React.useEffect(() => {
    if (tanaman.length > 0 && !form.komoditas && !editingId) {
      setForm(prev => ({ ...prev, komoditas: tanaman[0].komoditas }));
    }
  }, [tanaman, form.komoditas, editingId]);`
);
fs.writeFileSync('src/views/KeuanganView.tsx', code);
