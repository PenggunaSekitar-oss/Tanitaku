const fs = require('fs');
let code = fs.readFileSync('src/views/KeuanganView.tsx', 'utf-8');

const targetStr = `            <Accordion title="Estimasi Panen" icon="eco" isOpen={openSection === "estimasiPanen"} onToggle={() => setOpenSection(openSection === "estimasiPanen" ? null : "estimasiPanen")}>
              <div className="flex flex-col gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-muted mb-1.5">Komoditas Panen</label>
                  <input type="text" value={form.komoditas || ''} onChange={e => setForm({...form, komoditas: e.target.value})} className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" placeholder="Contoh: Sawi, Cabai" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-on-surface-muted mb-1.5">Target Hasil</label>
                    <NumberInput value={form.targetHasil} onNumberChange={v => setForm({...form, targetHasil: v})} allowDecimals={true} className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-on-surface-muted mb-1.5">Satuan</label>
                    <Select value={form.satuanHasil || 'Kilogram'} onChange={v => setForm({...form, satuanHasil: v})} options={[
                      { value: 'Kilogram', label: 'Kilogram' },
                      { value: 'Ton', label: 'Ton' },
                      { value: 'Ikat', label: 'Ikat' },
                      { value: 'Pack', label: 'Pack' },
                      { value: 'Pieces', label: 'Pieces' }
                    ]} />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-on-surface-muted mb-1.5">Estimasi Harga Jual (Per Satuan)</label>
                    <NumberInput value={form.hargaJual} onNumberChange={v => setForm({...form, hargaJual: v})} className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" />
                  </div>
                </div>
              </div>
            </Accordion>`;

const newStr = `            <Accordion title="Estimasi Panen" icon="eco" isOpen={openSection === "estimasiPanen"} onToggle={() => setOpenSection(openSection === "estimasiPanen" ? null : "estimasiPanen")}>
              {tanaman.length === 0 ? (
                <div className="bg-yellow-400/20 text-yellow-500 font-bold p-4 rounded-lg neo-border-thin shadow-sm mt-2 text-sm">
                  <span className="material-symbols-outlined align-middle mr-2 font-bold">warning</span>
                  Tidak boleh dan tidak bisa diisi data panen jika tidak ada data di Pemantauan Lahan & Tanaman. Silakan tambah data tanaman terlebih dahulu.
                </div>
              ) : (
                <div className="flex flex-col gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-muted mb-1.5">Komoditas Panen</label>
                    <Select
                      value={form.komoditas || tanaman[0]?.komoditas || ''}
                      onChange={v => setForm({...form, komoditas: v})}
                      options={tanaman.map(t => ({
                        value: t.komoditas,
                        label: t.komoditas + (t.varietas ? " (" + t.varietas + ")" : "") + " - " + (blokLahan.find(b => b.id === t.blokId)?.nama || "Unknown Blok")
                      }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-semibold text-on-surface-muted mb-1.5">Target Hasil</label>
                      <NumberInput value={form.targetHasil} onNumberChange={v => setForm({...form, targetHasil: v})} allowDecimals={true} className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-semibold text-on-surface-muted mb-1.5">Satuan</label>
                      <Select value={form.satuanHasil || 'Kilogram'} onChange={v => setForm({...form, satuanHasil: v})} options={[
                        { value: 'Kilogram', label: 'Kilogram' },
                        { value: 'Ton', label: 'Ton' },
                        { value: 'Ikat', label: 'Ikat' },
                        { value: 'Pack', label: 'Pack' },
                        { value: 'Pieces', label: 'Pieces' }
                      ]} />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-semibold text-on-surface-muted mb-1.5">Estimasi Harga Jual (Per Satuan)</label>
                      <NumberInput value={form.hargaJual} onNumberChange={v => setForm({...form, hargaJual: v})} className="w-full bg-surface-high neo-border-thin px-4 py-2.5 min-h-[48px] text-[15px] text-on-surface rounded-[8px_3px_8px_3px] focus:outline-none focus:ring-0" />
                    </div>
                  </div>
                </div>
              )}
            </Accordion>`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('src/views/KeuanganView.tsx', code);
