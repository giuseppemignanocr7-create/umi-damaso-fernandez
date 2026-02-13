import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, User, Tag, ExternalLink, Download } from 'lucide-react';
import { fetchBiblioteca } from '../../supabaseStore';

export default function SocioBiblioteca() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [catFilter, setCatFilter] = useState('Tutte');
  useEffect(() => { fetchBiblioteca().then(setItems).catch(() => {}); }, []);

  const categories = ['Tutte', ...new Set(items.map(d => d.categoria).filter(Boolean))];
  const filtered = items.filter(d => {
    const matchSearch = !search || d.titolo?.toLowerCase().includes(search.toLowerCase()) || d.autore?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'Tutte' || d.categoria === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="magic-fade-in">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Biblioteca Virtuale UMI</h1>
        <p className="text-umi-muted text-sm">Archivio digitale di testi, dispense e pergamene accademiche.</p>
      </div>

      <div className="relative my-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-umi-dim" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca tra i volumi della biblioteca..."
          className="w-full bg-umi-input border border-umi-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-umi-text focus:outline-none focus:border-umi-primary" />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {categories.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${catFilter === c ? 'bg-umi-primary text-white' : 'bg-umi-card text-umi-muted border border-umi-border hover:border-umi-primary'}`}>
            {c}
          </button>
        ))}
        <span className="text-xs text-umi-dim self-center ml-auto">{filtered.length} risultati</span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-umi-muted text-sm">Nessun documento trovato nella biblioteca virtuale.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 magic-stagger">
          {filtered.map(doc => (
            <div key={doc.id} onClick={() => setSelected(doc)} className="bg-umi-card border border-umi-border rounded-xl p-5 card-magic magic-glow cursor-pointer group">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full">{doc.categoria}</span>
              </div>
              <h3 className="text-sm font-bold text-umi-text mb-1 group-hover:text-umi-primary transition-colors">{doc.titolo}</h3>
              <p className="text-xs text-umi-muted mb-2 flex items-center gap-1"><User size={10} /> {doc.autore}</p>
              {doc.descrizione && <p className="text-xs text-umi-dim line-clamp-2">{doc.descrizione}</p>}
              <div className="mt-3 flex items-center gap-2">
                {doc.url && <span className="text-xs text-umi-primary flex items-center gap-0.5"><ExternalLink size={10} /> Leggi</span>}
                <span className="text-xs text-umi-dim flex items-center gap-0.5"><BookOpen size={10} /> Dettagli</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 magic-backdrop" onClick={() => setSelected(null)}>
          <div className="bg-umi-card border border-umi-border rounded-2xl max-w-lg w-full magic-modal" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full">{selected.categoria}</span>
                  <h2 className="text-lg font-bold text-umi-text mt-2">{selected.titolo}</h2>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-umi-input rounded-full transition-colors">
                  <X size={18} className="text-umi-muted" />
                </button>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-umi-muted"><User size={14} className="text-umi-primary" /> {selected.autore}</div>
                <div className="flex items-center gap-2 text-sm text-umi-muted"><Tag size={14} className="text-umi-primary" /> {selected.categoria}</div>
                {selected.anno && <div className="flex items-center gap-2 text-sm text-umi-muted"><BookOpen size={14} className="text-umi-primary" /> Anno: {selected.anno}</div>}
              </div>
              {selected.descrizione && (
                <div className="bg-umi-input rounded-lg p-4 mb-6">
                  <p className="text-sm text-umi-text leading-relaxed">{selected.descrizione}</p>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => { if (selected.url && selected.url !== '#') window.open(selected.url, '_blank'); }}
                  className="flex-1 gradient-primary text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  {selected.url && selected.url !== '#' ? <><ExternalLink size={16} /> Apri Documento</> : <><BookOpen size={16} /> Leggi Online</>}
                </button>
                <button className="px-4 py-2.5 bg-umi-input border border-umi-border rounded-lg text-sm text-umi-muted hover:text-umi-text transition-colors flex items-center gap-2">
                  <Download size={16} /> PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
