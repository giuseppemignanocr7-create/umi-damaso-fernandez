import React, { useState, useEffect } from 'react';
import { fetchAttivita } from '../../supabaseStore';

export default function SocioShop() {
  const [allPublished, setAllPublished] = useState([]);
  useEffect(() => { fetchAttivita().then(d => setAllPublished(d.filter(a => a.pubblicata))).catch(() => {}); }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Shop Universitario</h1>
        <p className="text-umi-muted text-sm">Esplora e acquista l'accesso ai nostri corsi, masterclass e oggettistica esclusiva.</p>
      </div>

      {allPublished.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">🛍️</div>
          <p className="text-umi-muted text-sm">Nessuna attività disponibile nello shop al momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allPublished.map(att => (
            <div key={att.id} className="bg-umi-card border border-umi-border rounded-xl overflow-hidden card-hover">
              <div className="h-40 bg-umi-input flex items-center justify-center text-4xl relative">
                🎓
                {att.luogo && (
                  <span className="absolute top-2 left-2 text-[10px] bg-umi-primary/80 text-white px-2 py-0.5 rounded-full uppercase">
                    {att.modalita === 'In Presenza' ? `Sede ${att.luogo.split(',')[0]}` : 'Online'}
                  </span>
                )}
                <span className="absolute top-2 right-2 text-sm bg-umi-gold text-white px-2 py-0.5 rounded-full font-bold">
                  {att.costo === 0 ? 'GRATIS' : `€${att.costo}`}
                </span>
              </div>
              <div className="p-4">
                <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full">{att.tipologia}</span>
                <h3 className="text-sm font-bold text-umi-text mt-2 mb-1">{att.titolo}</h3>
                {att.descrizione && <p className="text-xs text-umi-dim mb-2 line-clamp-2">{att.descrizione}</p>}
                <p className="text-xs text-umi-muted mb-3">{att.data}</p>
                {att.costo > 0 ? (
                  <button className="w-full gradient-gold text-white text-sm font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">
                    🛒 ACQUISTA
                  </button>
                ) : (
                  <button className="w-full gradient-primary text-white text-sm font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">
                    ✅ ISCRIVITI
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
