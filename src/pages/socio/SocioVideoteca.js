import React, { useState, useEffect } from 'react';
import { Search, X, Play, User, Clock, Tag, ExternalLink } from 'lucide-react';
import { fetchVideoteca } from '../../supabaseStore';

export default function SocioVideoteca() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [catFilter, setCatFilter] = useState('Tutte');
  useEffect(() => { fetchVideoteca().then(setItems).catch(() => {}); }, []);

  const categories = ['Tutte', ...new Set(items.map(v => v.categoria).filter(Boolean))];
  const filtered = items.filter(v => {
    const matchSearch = !search || v.titolo?.toLowerCase().includes(search.toLowerCase()) || v.autore?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'Tutte' || v.categoria === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Videoteca Virtuale UMI</h1>
        <p className="text-umi-muted text-sm">Archivio multimediale di lezioni, seminari e congressi.</p>
      </div>

      <div className="relative my-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-umi-dim" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca nelle registrazioni video..."
          className="w-full bg-umi-input border border-umi-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-umi-text focus:outline-none focus:border-umi-primary" />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {categories.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${catFilter === c ? 'bg-umi-primary text-white' : 'bg-umi-card text-umi-muted border border-umi-border hover:border-umi-primary'}`}>
            {c}
          </button>
        ))}
        <span className="text-xs text-umi-dim self-center ml-auto">{filtered.length} video</span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">🎬</div>
          <p className="text-umi-muted text-sm">Nessuna registrazione trovata nella videoteca virtuale.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(vid => (
            <div key={vid.id} onClick={() => setSelected(vid)} className="bg-umi-card border border-umi-border rounded-xl overflow-hidden card-hover cursor-pointer group">
              <div className="h-36 bg-umi-input flex items-center justify-center relative">
                <div className="w-14 h-14 rounded-full bg-black/40 flex items-center justify-center group-hover:bg-umi-primary/80 transition-colors">
                  <Play size={24} className="text-white ml-1" />
                </div>
                {vid.durata && <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">{vid.durata}</span>}
                <span className="absolute top-2 left-2 text-[10px] bg-umi-primary/80 text-white px-2 py-0.5 rounded-full">{vid.categoria}</span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-umi-text mb-1 group-hover:text-umi-primary transition-colors">{vid.titolo}</h3>
                <p className="text-xs text-umi-muted flex items-center gap-1"><User size={10} /> {vid.autore}</p>
                {vid.descrizione && <p className="text-xs text-umi-dim mt-1 line-clamp-2">{vid.descrizione}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIDEO DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-umi-card border border-umi-border rounded-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="h-52 bg-umi-input rounded-t-2xl flex items-center justify-center relative">
              <button onClick={() => {
                if (selected.url) window.open(selected.url, '_blank');
              }} className="w-20 h-20 rounded-full bg-umi-primary/80 flex items-center justify-center hover:bg-umi-primary transition-colors cursor-pointer">
                <Play size={36} className="text-white ml-1" />
              </button>
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 p-1.5 bg-black/40 rounded-full hover:bg-black/60 transition-colors">
                <X size={18} className="text-white" />
              </button>
              {selected.durata && <span className="absolute bottom-3 right-3 text-xs bg-black/60 text-white px-2 py-1 rounded">{selected.durata}</span>}
            </div>
            <div className="p-6">
              <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full">{selected.categoria}</span>
              <h2 className="text-lg font-bold text-umi-text mt-2 mb-3">{selected.titolo}</h2>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-umi-muted"><User size={14} className="text-umi-primary" /> {selected.autore}</div>
                <div className="flex items-center gap-2 text-sm text-umi-muted"><Tag size={14} className="text-umi-primary" /> {selected.categoria}</div>
                {selected.durata && <div className="flex items-center gap-2 text-sm text-umi-muted"><Clock size={14} className="text-umi-primary" /> {selected.durata}</div>}
              </div>
              {selected.descrizione && <p className="text-sm text-umi-muted mb-6 bg-umi-input rounded-lg p-4">{selected.descrizione}</p>}
              <div className="flex gap-3">
                <button onClick={() => { if (selected.url) window.open(selected.url, '_blank'); }}
                  className="flex-1 gradient-primary text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <Play size={16} /> Guarda Video
                </button>
                {selected.url && (
                  <a href={selected.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 bg-umi-input border border-umi-border rounded-lg text-sm text-umi-muted hover:text-umi-text transition-colors flex items-center gap-2">
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
