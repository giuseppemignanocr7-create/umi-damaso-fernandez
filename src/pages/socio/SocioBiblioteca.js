import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { fetchBiblioteca } from '../../supabaseStore';

export default function SocioBiblioteca() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  useEffect(() => { fetchBiblioteca().then(setItems).catch(() => {}); }, []);

  const filtered = items.filter(d =>
    !search || d.titolo.toLowerCase().includes(search.toLowerCase()) || d.autore.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
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
    </div>
  );
}
