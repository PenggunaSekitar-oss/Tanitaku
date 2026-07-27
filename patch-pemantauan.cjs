const fs = require('fs');
let code = fs.readFileSync('src/views/PemantauanView.tsx', 'utf-8');

const targetStr = `                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 transition-opacity">
                          <button onClick={() => handleEditTanaman(t)} className="p-1 bg-background border border-outline rounded-sm text-on-surface-muted hover:text-action hover:border-action transition">
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button onClick={() => handleDeleteTanaman(t.id)} className="p-1 bg-background border border-outline rounded-sm text-on-surface-muted hover:text-danger hover:border-danger transition">
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>`;

const replaceStr = `                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 transition-opacity">
                          {t.status === 'Panen' ? (
                            <span className="bg-success text-black font-bold text-xs uppercase px-2 py-0.5 rounded-[4px_2px_4px_2px] neo-border-thin shadow-[2px_2px_0px_0px_#000]">Sudah Panen</span>
                          ) : (
                            <>
                              <button onClick={() => {
                                if (window.confirm("Tandai tanaman ini sudah dipanen?")) {
                                  updateTanaman(t.id, { status: 'Panen' });
                                }
                              }} className="p-1 bg-background border border-outline rounded-sm text-on-surface-muted hover:text-success hover:border-success transition" title="Tandai Panen">
                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                              </button>
                              <button onClick={() => handleEditTanaman(t)} className="p-1 bg-background border border-outline rounded-sm text-on-surface-muted hover:text-action hover:border-action transition">
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                              </button>
                              <button onClick={() => handleDeleteTanaman(t.id)} className="p-1 bg-background border border-outline rounded-sm text-on-surface-muted hover:text-danger hover:border-danger transition">
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </>
                          )}
                        </div>`;

code = code.replace(targetStr, replaceStr);

fs.writeFileSync('src/views/PemantauanView.tsx', code);
