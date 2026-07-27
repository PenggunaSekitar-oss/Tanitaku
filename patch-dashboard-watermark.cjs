const fs = require('fs');
let code = fs.readFileSync('src/views/DashboardView.tsx', 'utf-8');

const targetStr = `    <div className="neo-card-small p-4 bg-surface-high/30 flex flex-col gap-4 border border-outline">
      <div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >`;

const replaceStr = `    <div className={\`neo-card-small p-4 bg-surface-high/30 flex flex-col gap-4 border border-outline relative overflow-hidden \${t.status === 'Panen' ? 'opacity-80' : ''}\`}>
      {t.status === 'Panen' && (
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
          <span className="text-danger/20 font-black text-4xl transform -rotate-12 select-none border-4 border-danger/20 p-2 rounded-xl font-brutal tracking-widest uppercase">
            PANEN
          </span>
        </div>
      )}
      <div 
        className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >`;

code = code.replace(targetStr, replaceStr);

fs.writeFileSync('src/views/DashboardView.tsx', code);
