import React, { useState, useEffect } from 'react';
import { fetchAlbo } from '../../supabaseStore';
import { X, Award, Calendar, Search } from 'lucide-react';

export default function SocioAlbo() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  useEffect(() => { fetchAlbo().then(setItems).catch(() => {}); }, []);

  const filtered = items.filter(p =>
    !search || p.nome?.toLowerCase().includes(search.toLowerCase()) || p.evento?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Albo d'Oro</h1>
        <p className="text-umi-muted text-sm">La bacheca dei trofei e titoli dell'Università.</p>
      </div>

      {items.length > 0 && (
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-umi-dim" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca per nome o evento..."
            className="w-full bg-umi-input border border-umi-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-umi-text focus:outline-none focus:border-umi-primary" />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-umi-muted text-sm">{search ? 'Nessun risultato trovato.' : "Nessuna onorificenza registrata nell'Albo d'Oro."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(premio => (
            <div key={premio.id} onClick={() => setSelected(premio)} className="bg-umi-card border border-umi-gold/30 rounded-xl p-5 card-hover cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-umi-gold/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🏆</div>
                <div>
                  <h3 className="text-sm font-bold text-umi-gold group-hover:text-yellow-300 transition-colors">{premio.nome}</h3>
                  {premio.evento && <p className="text-xs text-umi-muted">{premio.evento}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-umi-dim mb-2">
                <Calendar size={10} /> {premio.data ? new Date(premio.data).toLocaleDateString('it-IT') : 'N/D'}
              </div>
              {premio.descrizione && <p className="text-xs text-umi-muted line-clamp-2">{premio.descrizione}</p>}
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-umi-card border border-umi-gold/30 rounded-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="text-center pt-8 pb-4">
              <div className="w-20 h-20 rounded-full bg-umi-gold/20 flex items-center justify-center text-4xl mx-auto mb-4">🏆</div>
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-1.5 hover:bg-umi-input rounded-full transition-colors"><X size={18} className="text-umi-muted" /></button>
            </div>
            <div className="px-6 pb-6 text-center">
              <h2 className="text-lg font-bold text-umi-gold mb-1">{selected.nome}</h2>
              {selected.evento && <p className="text-sm text-umi-primary-light mb-4">{selected.evento}</p>}
              <div className="bg-umi-input rounded-lg p-4 mb-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs text-umi-muted"><Calendar size={14} className="text-umi-gold" /> {selected.data ? new Date(selected.data).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/D'}</div>
                <div className="flex items-center gap-2 text-xs text-umi-muted"><Award size={14} className="text-umi-gold" /> Onorificenza UMI</div>
              </div>
              {selected.descrizione && <p className="text-sm text-umi-muted leading-relaxed">{selected.descrizione}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
