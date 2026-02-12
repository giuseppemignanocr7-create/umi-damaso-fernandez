import React, { useState, useEffect } from 'react';
import { fetchAttivita } from '../../supabaseStore';

export default function SocioCorsi() {
  const [tab, setTab] = useState('Tutti');
  const [allAttivita, setAllAttivita] = useState([]);
  useEffect(() => { fetchAttivita().then(d => setAllAttivita(d.filter(a => a.pubblicata))).catch(() => {}); }, []);

  const filtered = allAttivita.filter(a => {
    if (tab === 'Tutti') return true;
    if (tab === 'Futuri') return new Date(a.data) >= new Date();
    if (tab === 'Passati') return new Date(a.data) < new Date();
    if (tab === 'Online') return a.modalita === 'Online / Streaming';
    return true;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">I Miei Corsi</h1>
        <p className="text-umi-muted text-sm">Il tuo registro delle attività e lezioni.</p>
      </div>

      <div className="flex gap-2 mb-6">
        {['Tutti', 'Futuri', 'Passati', 'Online'].map(f => (
          <button key={f} onClick={() => setTab(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === f ? 'bg-umi-primary text-white' : 'bg-umi-card text-umi-muted border border-umi-border hover:border-umi-primary'}`}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-umi-muted text-sm">Nessun corso trovato con i filtri correnti.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(att => (
            <div key={att.id} className="bg-umi-card border border-umi-border rounded-xl p-5 card-hover">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">
                  {att.tipologia === 'Lezione' ? '📖' : att.tipologia === 'Masterclass' ? '🎓' : '📋'}
                </span>
                <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full uppercase">{att.tipologia}</span>
              </div>
              <h3 className="text-sm font-bold text-umi-text mb-1">{att.titolo}</h3>
              <p className="text-xs text-umi-muted mb-1">{att.data}</p>
              <p className="text-xs text-umi-dim mb-3">{att.modalita === 'In Presenza' ? 'Presenza' : 'Online'}</p>
              <button className="text-xs bg-umi-green/20 text-umi-green px-3 py-1.5 rounded-full font-semibold">
                ✅ Disponibile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
