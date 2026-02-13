import React, { useState, useEffect } from 'react';
import { fetchAttivita, createIscrizione } from '../../supabaseStore';
import { useAuth } from '../../context/AuthContext';
import { X, MapPin, Clock, Calendar, Check, Loader2 } from 'lucide-react';

export default function SocioCorsi() {
  const [tab, setTab] = useState('Tutti');
  const [allAttivita, setAllAttivita] = useState([]);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);
  const { profile } = useAuth();
  useEffect(() => { fetchAttivita().then(d => setAllAttivita(d.filter(a => a.pubblicata))).catch(() => {}); }, []);

  const filtered = allAttivita.filter(a => {
    if (tab === 'Tutti') return true;
    if (tab === 'Futuri') return new Date(a.data) >= new Date();
    if (tab === 'Passati') return new Date(a.data) < new Date();
    if (tab === 'Online') return a.modalita === 'Online / Streaming';
    return true;
  });

  const handleEnroll = async (att) => {
    setSaving(true);
    try {
      const socioId = profile?.id || 'demo-user-001';
      await createIscrizione({ socio_id: socioId, attivita_id: att.id, pagato: att.costo === 0, importo_pagato: att.costo || 0 });
      setSelected(null);
      setToast(`Iscrizione a "${att.titolo}" salvata!`);
    } catch (e) { setToast('Errore: ' + (e.message || 'salvataggio fallito')); }
    setSaving(false);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">I Miei Corsi</h1>
        <p className="text-umi-muted text-sm">Il tuo registro delle attività e lezioni.</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['Tutti', 'Futuri', 'Passati', 'Online'].map(f => (
          <button key={f} onClick={() => setTab(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${tab === f ? 'bg-umi-primary text-white' : 'bg-umi-card text-umi-muted border border-umi-border hover:border-umi-primary'}`}>
            {f}
          </button>
        ))}
        <span className="text-xs text-umi-dim self-center ml-auto">{filtered.length} corsi</span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-umi-muted text-sm">Nessun corso trovato con i filtri correnti.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(att => {
            const isPast = new Date(att.data) < new Date();
            return (
              <div key={att.id} onClick={() => setSelected(att)} className="bg-umi-card border border-umi-border rounded-xl p-5 card-hover cursor-pointer group">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">
                    {att.tipologia === 'Lezione' ? '📖' : att.tipologia === 'Masterclass' ? '🎓' : att.tipologia === 'Congresso UMI' ? '🏛️' : att.tipologia === 'Viaggio Studi' ? '✈️' : '📋'}
                  </span>
                  <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full uppercase">{att.tipologia}</span>
                  {isPast && <span className="text-[10px] bg-umi-dim/20 text-umi-dim px-1.5 py-0.5 rounded-full">PASSATO</span>}
                </div>
                <h3 className="text-sm font-bold text-umi-text mb-1 group-hover:text-umi-primary transition-colors">{att.titolo}</h3>
                <div className="flex items-center gap-3 text-[10px] text-umi-muted mb-1">
                  {att.data && <span className="flex items-center gap-0.5"><Calendar size={10} /> {new Date(att.data).toLocaleDateString('it-IT')}</span>}
                  {att.durata && <span className="flex items-center gap-0.5"><Clock size={10} /> {att.durata}</span>}
                </div>
                {att.luogo && <p className="text-[10px] text-umi-dim flex items-center gap-0.5 mb-2"><MapPin size={10} /> {att.luogo}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-umi-dim">{att.modalita === 'In Presenza' ? '🏫 Presenza' : '💻 Online'}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${isPast ? 'bg-blue-500/20 text-blue-300' : 'bg-umi-green/20 text-umi-green'}`}>
                    {isPast ? '📝 Completato' : '✅ Disponibile'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-umi-card border border-umi-border rounded-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{selected.tipologia === 'Masterclass' ? '🎓' : selected.tipologia === 'Congresso UMI' ? '🏛️' : '📖'}</span>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-umi-input rounded-full transition-colors"><X size={18} className="text-umi-muted" /></button>
              </div>
              <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full">{selected.tipologia}</span>
              <h2 className="text-lg font-bold text-umi-text mt-2 mb-2">{selected.titolo}</h2>
              {selected.descrizione && <p className="text-sm text-umi-muted mb-4">{selected.descrizione}</p>}
              <div className="space-y-2 mb-6 bg-umi-input rounded-lg p-4">
                {selected.data && <div className="flex items-center gap-2 text-xs text-umi-muted"><Calendar size={14} className="text-umi-primary" /> {new Date(selected.data).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>}
                {selected.durata && <div className="flex items-center gap-2 text-xs text-umi-muted"><Clock size={14} className="text-umi-primary" /> {selected.durata}</div>}
                {selected.luogo && <div className="flex items-center gap-2 text-xs text-umi-muted"><MapPin size={14} className="text-umi-primary" /> {selected.luogo}</div>}
                <div className="flex items-center gap-2 text-xs text-umi-muted">{selected.modalita === 'In Presenza' ? '🏫' : '💻'} {selected.modalita}</div>
                {selected.docente && <div className="flex items-center gap-2 text-xs text-umi-muted">👨‍🏫 {selected.docente}</div>}
                <div className="flex items-center gap-2 text-xs text-umi-muted">💰 {selected.costo > 0 ? `€${selected.costo}` : 'Gratuito'}</div>
              </div>
              <button onClick={() => handleEnroll(selected)} disabled={saving} className={`w-full gradient-primary text-white text-sm font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${saving ? 'opacity-60' : ''}`}>
                {saving ? <><Loader2 size={16} className="animate-spin" /> Salvataggio...</> : new Date(selected.data) < new Date() ? '📝 Rivedi Materiale' : '✅ Conferma Iscrizione'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-umi-green text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-pulse">
          <Check size={18} /> {toast}
        </div>
      )}
    </div>
  );
}
