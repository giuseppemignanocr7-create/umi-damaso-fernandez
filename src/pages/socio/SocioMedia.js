import React, { useState, useEffect } from 'react';
import { Search, X, Download, Eye, Tag } from 'lucide-react';
import { fetchMedia } from '../../supabaseStore';

export default function SocioMedia() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('Tutti');
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  useEffect(() => { fetchMedia().then(setItems).catch(() => {}); }, []);

  const filtered = items.filter(m => {
    const matchSearch = !search || m.nome?.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === 'Tutti' ||
      (tab === 'Foto' && m.tipo === 'foto') ||
      (tab === 'Attestati' && m.tipo === 'attestato') ||
      (tab === 'Didattica' && m.tipo === 'didattica');
    return matchSearch && matchTab;
  });

  return (
    <div>
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Media</h1>
        <p className="text-umi-muted text-sm">Documenti, foto e risorse didattiche.</p>
      </div>

      <div className="relative my-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-umi-dim" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca file, evento o studente..."
          className="w-full bg-umi-input border border-umi-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-umi-text focus:outline-none focus:border-umi-primary" />
      </div>

      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['Tutti', 'Foto', 'Attestati', 'Didattica'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${tab === t ? 'bg-umi-primary text-white' : 'bg-umi-card text-umi-muted border border-umi-border hover:border-umi-primary'}`}>
              {t === 'Foto' ? '📸 ' : t === 'Attestati' ? '📜 ' : t === 'Didattica' ? '📚 ' : ''}{t}
            </button>
          ))}
        </div>
        <span className="text-xs text-umi-dim whitespace-nowrap">{filtered.length} elementi</span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">🖼️</div>
          <p className="text-umi-muted text-sm">Nessun media trovato. Prova a modificare i filtri.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(m => (
            <div key={m.id} onClick={() => setSelected(m)} className="bg-umi-card border border-umi-border rounded-xl overflow-hidden card-hover cursor-pointer group">
              <div className="h-28 bg-umi-input flex items-center justify-center text-3xl relative">
                {m.tipo === 'foto' ? '📸' : m.tipo === 'attestato' ? '📜' : m.tipo === 'didattica' ? '�' : '�📄'}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Eye size={24} className="text-white" />
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm text-umi-text font-semibold truncate">{m.nome}</p>
                <p className="text-[10px] text-umi-dim capitalize">{m.tipo}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MEDIA PREVIEW MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-umi-card border border-umi-border rounded-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="h-56 bg-umi-input rounded-t-2xl flex items-center justify-center text-6xl relative">
              {selected.tipo === 'foto' ? '📸' : selected.tipo === 'attestato' ? '📜' : '📚'}
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 p-1.5 bg-black/40 rounded-full hover:bg-black/60 transition-colors">
                <X size={18} className="text-white" />
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-lg font-bold text-umi-text mb-2">{selected.nome}</h2>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-umi-muted"><Tag size={14} className="text-umi-primary" /> <span className="capitalize">{selected.tipo}</span></div>
                {selected.evento && <div className="flex items-center gap-2 text-xs text-umi-muted">📋 {selected.evento}</div>}
                {selected.data && <div className="flex items-center gap-2 text-xs text-umi-muted">📅 {new Date(selected.data).toLocaleDateString('it-IT')}</div>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => { if (selected.url && selected.url !== '#') window.open(selected.url, '_blank'); }}
                  className="flex-1 gradient-primary text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <Eye size={16} /> Visualizza
                </button>
                <button className="px-4 py-2.5 bg-umi-input border border-umi-border rounded-lg text-sm text-umi-muted hover:text-umi-text transition-colors flex items-center gap-2">
                  <Download size={16} /> Scarica
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
