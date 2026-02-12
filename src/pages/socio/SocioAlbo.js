import React, { useState, useEffect } from 'react';
import { fetchAlbo } from '../../supabaseStore';

export default function SocioAlbo() {
  const [items, setItems] = useState([]);
  useEffect(() => { fetchAlbo().then(setItems).catch(() => {}); }, []);
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Albo d'Oro</h1>
        <p className="text-umi-muted text-sm">La bacheca dei trofei e titoli dell'Università.</p>
      </div>

      {items.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-umi-muted text-sm">Nessuna onorificenza registrata nell'Albo d'Oro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(premio => (
            <div key={premio.id} className="bg-umi-card border border-umi-gold/30 rounded-xl p-5 card-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-umi-gold/20 flex items-center justify-center text-2xl">🏆</div>
                <div>
                  <h3 className="text-sm font-bold text-umi-gold">{premio.nome}</h3>
                  {premio.evento && <p className="text-xs text-umi-muted">{premio.evento}</p>}
                </div>
              </div>
              <p className="text-xs text-umi-dim">{premio.data}</p>
              {premio.descrizione && <p className="text-xs text-umi-muted mt-2">{premio.descrizione}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
