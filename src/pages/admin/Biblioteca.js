import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, User, Save } from 'lucide-react';
import { fetchBiblioteca, createBiblioteca } from '../../supabaseStore';
import Modal from '../../components/shared/Modal';

export default function Biblioteca() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titolo: '', autore: '', categoria: 'PDF', url: '', descrizione: '' });
  const [items, setItems] = useState([]);

  const load = useCallback(() => {
    fetchBiblioteca().then(setItems).catch(() => {});
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = items.filter(d =>
    !search || d.titolo.toLowerCase().includes(search.toLowerCase()) || d.autore.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.titolo || !form.autore) return;
    await createBiblioteca({ ...form });
    setForm({ titolo: '', autore: '', categoria: 'PDF', url: '', descrizione: '' });
    setShowModal(false);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Biblioteca Virtuale UMI</h1>
          <p className="text-umi-muted text-sm">Archivio digitale di testi, dispense e pergamene accademiche.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="gradient-primary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={16} /> Aggiungi Testo
        </button>
      </div>

      <div className="relative my-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-umi-dim" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca tra i volumi della biblioteca..."
          className="w-full bg-umi-input border border-umi-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-umi-text focus:outline-none focus:border-umi-primary" />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-umi-muted text-sm">Nessun documento trovato nella biblioteca virtuale.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(doc => (
            <div key={doc.id} className="bg-umi-card border border-umi-border rounded-xl p-5 card-hover">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full">{doc.categoria}</span>
              </div>
              <h3 className="text-sm font-bold text-umi-text mb-1">{doc.titolo}</h3>
              <p className="text-xs text-umi-muted mb-2">{doc.autore}</p>
              {doc.descrizione && <p className="text-xs text-umi-dim">{doc.descrizione}</p>}
              {doc.url && (
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs text-umi-primary hover:text-umi-primary-light">
                  Apri documento →
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuovo Documento Biblioteca">
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Titolo del Libro / Documento</label>
            <input type="text" value={form.titolo} onChange={(e) => setForm(p => ({ ...p, titolo: e.target.value }))}
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Autore</label>
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
              <option value="PDF">PDF</option>
              <option value="EBOOK">EBOOK</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">URL PDF / Link Download</label>
            <input type="url" value={form.url} onChange={(e) => setForm(p => ({ ...p, url: e.target.value }))} placeholder="https://..."
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Descrizione Breve</label>
            <textarea value={form.descrizione} onChange={(e) => setForm(p => ({ ...p, descrizione: e.target.value }))}
              placeholder="Di cosa tratta questo testo?" rows={3}
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm text-umi-muted hover:bg-umi-input transition-colors">Annulla</button>
            <button onClick={handleSave} className="gradient-gold text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Save size={14} /> Salva Documento
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
