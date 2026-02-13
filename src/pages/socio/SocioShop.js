import React, { useState, useEffect } from 'react';
import { fetchAttivita, createIscrizione, createPagamentoSocio, createEntrata } from '../../supabaseStore';
import { useAuth } from '../../context/AuthContext';
import { X, MapPin, Clock, Users, Calendar, Check, Loader2 } from 'lucide-react';

export default function SocioShop() {
  const [allPublished, setAllPublished] = useState([]);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');
  const [filter, setFilter] = useState('Tutti');
  const [saving, setSaving] = useState(false);
  const { profile } = useAuth();
  useEffect(() => { fetchAttivita().then(d => setAllPublished(d.filter(a => a.pubblicata))).catch(() => {}); }, []);

  const filtered = allPublished.filter(a => {
    if (filter === 'Gratuiti') return a.costo === 0;
    if (filter === 'A Pagamento') return a.costo > 0;
    if (filter === 'In Presenza') return a.modalita === 'In Presenza';
    if (filter === 'Online') return a.modalita === 'Online / Streaming';
    return true;
  });

  const handleAction = async (att) => {
    setSaving(true);
    try {
      const socioId = profile?.id || 'demo-user-001';
      const socioNome = profile ? `${profile.nome} ${profile.cognome}` : 'Demo User';
      await createIscrizione({ socio_id: socioId, attivita_id: att.id, pagato: att.costo === 0, importo_pagato: att.costo });
      if (att.costo > 0) {
        await createPagamentoSocio({ socio_id: socioId, causale: att.titolo, importo: att.costo, data: new Date().toISOString().slice(0,10), stato: 'Saldato', metodo: 'PayPal', attivita_id: att.id });
        await createEntrata({ socio_id: socioId, socio_nome: socioNome, causale: att.titolo, importo: att.costo, data: new Date().toISOString().slice(0,10), stato: 'Saldato', metodo: 'PayPal', attivita_id: att.id });
      }
      setSelected(null);
      setToast(att.costo > 0 ? `Acquisto "${att.titolo}" salvato!` : `Iscrizione a "${att.titolo}" salvata!`);
    } catch (e) { setToast('Errore: ' + (e.message || 'salvataggio fallito')); }
    setSaving(false);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="magic-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Shop Universitario</h1>
        <p className="text-umi-muted text-sm">Esplora e acquista l'accesso ai nostri corsi, masterclass e oggettistica esclusiva.</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['Tutti', 'Gratuiti', 'A Pagamento', 'In Presenza', 'Online'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${filter === f ? 'bg-umi-primary text-white' : 'bg-umi-card text-umi-muted border border-umi-border hover:border-umi-primary'}`}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">🛍️</div>
          <p className="text-umi-muted text-sm">Nessuna attività disponibile con questo filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 magic-stagger">
          {filtered.map(att => (
            <div key={att.id} onClick={() => setSelected(att)} className="bg-umi-card border border-umi-border rounded-xl overflow-hidden card-hover cursor-pointer">
              <div className="h-40 bg-umi-input flex items-center justify-center text-4xl relative">
                {att.tipologia === 'Masterclass' ? '🎓' : att.tipologia === 'Congresso UMI' ? '🏛️' : att.tipologia === 'Viaggio Studi' ? '✈️' : att.tipologia === 'Lezione' ? '📖' : '📋'}
                {att.luogo && (
                  <span className="absolute top-2 left-2 text-[10px] bg-umi-primary/80 text-white px-2 py-0.5 rounded-full uppercase">
                    {att.modalita === 'In Presenza' ? att.luogo.split(',')[0] : 'Online'}
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
                <div className="flex items-center gap-3 text-[10px] text-umi-muted mb-3">
                  {att.data && <span className="flex items-center gap-0.5"><Calendar size={10} /> {new Date(att.data).toLocaleDateString('it-IT')}</span>}
                  {att.durata && <span className="flex items-center gap-0.5"><Clock size={10} /> {att.durata}</span>}
                </div>
                {att.costo > 0 ? (
                  <button onClick={(e) => { e.stopPropagation(); handleAction(att); }} className="w-full gradient-gold text-white text-sm font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">
                    🛒 ACQUISTA
                  </button>
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); handleAction(att); }} className="w-full gradient-primary text-white text-sm font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">
                    ✅ ISCRIVITI
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 magic-backdrop" onClick={() => setSelected(null)}>
          <div className="bg-umi-card border border-umi-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto magic-modal" onClick={e => e.stopPropagation()}>
            <div className="h-48 bg-umi-input flex items-center justify-center text-6xl relative">
              {selected.tipologia === 'Masterclass' ? '🎓' : selected.tipologia === 'Congresso UMI' ? '🏛️' : '📋'}
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 p-1.5 bg-black/40 rounded-full hover:bg-black/60 transition-colors">
                <X size={18} className="text-white" />
              </button>
              <span className="absolute bottom-3 right-3 text-lg bg-umi-gold text-white px-3 py-1 rounded-full font-bold">
                {selected.costo === 0 ? 'GRATIS' : `€${selected.costo}`}
              </span>
            </div>
            <div className="p-6">
              <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full">{selected.tipologia}</span>
              <h2 className="text-lg font-bold text-umi-text mt-3 mb-2">{selected.titolo}</h2>
              {selected.descrizione && <p className="text-sm text-umi-muted mb-4">{selected.descrizione}</p>}
              <div className="space-y-2 mb-6">
                {selected.data && <div className="flex items-center gap-2 text-xs text-umi-muted"><Calendar size={14} className="text-umi-primary" /> {new Date(selected.data).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>}
                {selected.durata && <div className="flex items-center gap-2 text-xs text-umi-muted"><Clock size={14} className="text-umi-primary" /> {selected.durata}</div>}
                {selected.luogo && <div className="flex items-center gap-2 text-xs text-umi-muted"><MapPin size={14} className="text-umi-primary" /> {selected.luogo}</div>}
                <div className="flex items-center gap-2 text-xs text-umi-muted"><Users size={14} className="text-umi-primary" /> {selected.modalita}</div>
                {selected.docente && <div className="flex items-center gap-2 text-xs text-umi-muted">👨‍🏫 {selected.docente}</div>}
              </div>
              <button onClick={() => handleAction(selected)} disabled={saving}
                className={`w-full text-white text-sm font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${selected.costo > 0 ? 'gradient-gold' : 'gradient-primary'} ${saving ? 'opacity-60' : ''}`}>
                {saving ? <><Loader2 size={16} className="animate-spin" /> Salvataggio...</> : selected.costo > 0 ? '🛒 ACQUISTA ORA' : '✅ ISCRIVITI GRATIS'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-umi-green text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-pulse">
          <Check size={18} /> {toast}
        </div>
      )}
    </div>
  );
}
