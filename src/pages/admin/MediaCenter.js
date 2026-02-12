import React, { useState, useEffect, useCallback } from 'react';
import { Search, Upload, Save } from 'lucide-react';
import { fetchMedia, createMedia, fetchAttivita } from '../../supabaseStore';

export default function MediaCenter() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('Tutti');
  const [showUpload, setShowUpload] = useState(false);
  const [tipoMedia, setTipoMedia] = useState('foto');
  const [form, setForm] = useState({ attivita: '', file: null });
  const [items, setItems] = useState([]);
  const [attivitaList, setAttivitaList] = useState([]);
  const load = useCallback(() => { fetchMedia().then(setItems).catch(() => {}); }, []);
  useEffect(() => { load(); fetchAttivita().then(setAttivitaList).catch(() => {}); }, [load]);

  const filtered = items.filter(m => {
    const matchSearch = !search || m.nome?.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === 'Tutti' ||
      (tab === 'Foto' && m.tipo === 'foto') ||
      (tab === 'Attestati' && m.tipo === 'attestato') ||
      (tab === 'Didattica' && m.tipo === 'didattica');
    return matchSearch && matchTab;
  });

  const handleSave = async () => {
    await createMedia({ tipo: tipoMedia, attivita_id: form.attivita || null, nome: `Media ${Date.now()}` });
    setShowUpload(false);
    setForm({ attivita: '', file: null });
    load();
  };

  if (showUpload) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Caricamento Media</h1>
        </div>

        <div className="space-y-6 max-w-2xl">
          <div className="bg-umi-card border border-umi-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-4">1. Tipo di Media</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'foto', icon: '📸', label: 'Foto Evento', desc: 'Galleria Immagini' },
                { key: 'video', icon: '🎬', label: 'Video Shortcut', desc: 'YouTube / Vimeo Link' },
                { key: 'documento', icon: '📄', label: 'Documento', desc: 'Dispense PDF / Slide' },
              ].map(t => (
                <button key={t.key} onClick={() => setTipoMedia(t.key)}
                  className={`p-4 rounded-xl border text-center transition-colors ${tipoMedia === t.key ? 'border-umi-primary bg-umi-primary/10' : 'border-umi-border bg-umi-input hover:border-umi-primary'}`}>
                  <div className="text-2xl mb-2">{t.icon}</div>
                  <p className="text-sm font-bold text-umi-text">{t.label}</p>
                  <p className="text-xs text-umi-dim">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-umi-card border border-umi-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-4">2. Dettagli & Collegamento</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Collega all'Attività</label>
                <select value={form.attivita} onChange={(e) => setForm(p => ({ ...p, attivita: e.target.value }))}
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary">
                  <option value="">-- Seleziona Attività --</option>
                  {attivitaList.map(a => <option key={a.id} value={a.id}>{a.titolo}</option>)}
                </select>
                <p className="text-xs text-umi-dim mt-1">Il file verrà aggiunto alla scheda di questa attività.</p>
              </div>
              <div className="border-2 border-dashed border-umi-border rounded-lg p-8 text-center hover:border-umi-primary transition-colors cursor-pointer">
                <Upload size={24} className="mx-auto text-umi-dim mb-2" />
                <p className="text-sm text-umi-muted">Trascina una foto o clicca per caricare</p>
                <p className="text-xs text-umi-dim mt-1">JPG, PNG Max 5MB</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setShowUpload(false)} className="px-4 py-2 rounded-lg text-sm text-umi-muted hover:bg-umi-input transition-colors">Annulla</button>
            <button onClick={handleSave} className="gradient-gold text-white px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Save size={14} /> Salva Media
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Media Center</h1>
          <p className="text-umi-muted text-sm">Gestione centralizzata di foto, dispense e attestati.</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="gradient-primary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Upload size={16} /> Carica Media
        </button>
      </div>

      <div className="relative my-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-umi-dim" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca file, evento o studente..."
          className="w-full bg-umi-input border border-umi-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-umi-text focus:outline-none focus:border-umi-primary" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {['Tutti', 'Foto', 'Attestati', 'Didattica'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${tab === t ? 'bg-umi-primary text-white' : 'bg-umi-card text-umi-muted border border-umi-border'}`}>
              {t === 'Foto' ? '📸 ' : t === 'Attestati' ? '📜 ' : t === 'Didattica' ? '📚 ' : ''}{t}
            </button>
          ))}
        </div>
        <span className="text-xs text-umi-dim">Visualizzati {filtered.length} elementi</span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">🖼️</div>
          <h3 className="text-lg font-bold text-umi-text mb-2">NESSUN MEDIA TROVATO</h3>
          <p className="text-umi-muted text-sm">Prova a modificare i filtri o carica nuovi contenuti.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map(m => (
            <div key={m.id} className="bg-umi-card border border-umi-border rounded-xl p-4 card-hover">
              <div className="h-24 bg-umi-input rounded-lg mb-3 flex items-center justify-center text-2xl">
                {m.tipo === 'foto' ? '📸' : m.tipo === 'video' ? '🎬' : '📄'}
              </div>
              <p className="text-sm text-umi-text font-semibold truncate">{m.nome}</p>
              <p className="text-xs text-umi-dim">{m.tipo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
