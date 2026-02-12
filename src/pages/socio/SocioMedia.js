import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { fetchMedia } from '../../supabaseStore';

export default function SocioMedia() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('Tutti');
  const [items, setItems] = useState([]);
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
          <p className="text-umi-muted text-sm">Prova a modificare i filtri.</p>
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
