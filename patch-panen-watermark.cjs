const fs = require('fs');
let code = fs.readFileSync('src/views/PemantauanView.tsx', 'utf-8');

const targetStr = `                    <div key={t.id} className="neo-card flex flex-col relative group">
                      <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 transition-opacity">`;

const replaceStr = `                    <div key={t.id} className={\`neo-card flex flex-col relative group \${t.status === 'Panen' ? 'opacity-80' : ''}\`}>
                      {t.status === 'Panen' && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none overflow-hidden">
                          <span className="text-danger/20 font-black text-6xl md:text-8xl transform -rotate-12 select-none border-4 md:border-8 border-danger/20 p-2 md:p-4 rounded-xl font-brutal tracking-widest uppercase">
                            PANEN
                          </span>
                        </div>
                      )}
                      <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 transition-opacity z-20">`;

code = code.replace(targetStr, replaceStr);

// Also need to make sure the checkmark works. Maybe the modal is hidden or behind something?
// ConfirmModal is fixed inset-0 with z-50, it should be fine.

fs.writeFileSync('src/views/PemantauanView.tsx', code);
