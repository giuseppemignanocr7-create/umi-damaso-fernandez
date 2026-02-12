import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, User, Film } from 'lucide-react';
import { fetchVideoteca, createVideoteca } from '../../supabaseStore';
import Modal from '../../components/shared/Modal';

export default function Videoteca() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titolo: '', autore: '', categoria: 'Tutorial', durata: '', url: '', descrizione: '' });
  const [items, setItems] = useState([]);

  const load = useCallback(() => {
    fetchVideoteca().then(setItems).catch(() => {});
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = items.filter(v =>
    !search || v.titolo.toLowerCase().includes(search.toLowerCase()) || v.autore.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.titolo || !form.autore) return;
    await createVideoteca({ ...form });
    setForm({ titolo: '', autore: '', categoria: 'Tutorial', durata: '', url: '', descrizione: '' });
    setShowModal(false);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Videoteca Virtuale UMI</h1>
          <p className="text-umi-muted text-sm">Archivio multimediale di lezioni, seminari e congressi.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="gradient-primary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={16} /> Aggiungi Video
        </button>
      </div>

      <div className="relative my-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-umi-dim" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca nelle registrazioni video..."
          className="w-full bg-umi-input border border-umi-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-umi-text focus:outline-none focus:border-umi-primary" />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">🎬</div>
          <p className="text-umi-muted text-sm">Nessuna registrazione trovata nella videoteca virtuale.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(vid => (
            <div key={vid.id} className="bg-umi-card border border-umi-border rounded-xl p-5 card-hover">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full">{vid.categoria}</span>
                {vid.durata && <span className="text-xs text-umi-dim">{vid.durata}</span>}
              </div>
              <h3 className="text-sm font-bold text-umi-text mb-1">{vid.titolo}</h3>
              <p className="text-xs text-umi-muted mb-2">{vid.autore}</p>
              {vid.descrizione && <p className="text-xs text-umi-dim">{vid.descrizione}</p>}
              {vid.url && (
                <a href={vid.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs text-umi-primary hover:text-umi-primary-light">
                  Guarda video →
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuova Risorsa Video">
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Titolo Video</label>
            <input type="text" value={form.titolo} onChange={(e) => setForm(p => ({ ...p, titolo: e.target.value }))}
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Autore / Docente</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-umi-dim" />
              <input type="text" value={form.autore} onChange={(e) => setForm(p => ({ ...p, autore: e.target.value }))}
                className="w-full bg-umi-input border border-umi-border rounded-lg pl-9 pr-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Categoria</label>
            <select value={form.categoria} onChange={(e) => setForm(p => ({ ...p, categoria: e.target.value }))}
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary">
              <option value="Tutorial">Tutorial</option>
              <option value="Seminario">Seminario</option>
              <option value="Workshop">Workshop</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Durata</label>
            <input type="text" value={form.durata} onChange={(e) => setForm(p => ({ ...p, durata: e.target.value }))} placeholder="es. 45 min"
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Link Video (YouTube/Drive)</label>
            <input type="url" value={form.url} onChange={(e) => setForm(p => ({ ...p, url: e.target.value }))} placeholder="https://..."
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Note / Descrizione</label>
            <textarea value={form.descrizione} onChange={(e) => setForm(p => ({ ...p, descrizione: e.target.value }))}
              placeholder="Cosa viene spiegato in questo video?" rows={3}
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm text-umi-muted hover:bg-umi-input transition-colors">Annulla</button>
            <button onClick={handleSave} className="gradient-primary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Film size={14} /> Salva Video
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
