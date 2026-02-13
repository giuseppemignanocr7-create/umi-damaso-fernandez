import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAttivita, createEntrata } from '../../supabaseStore';
import { X, MapPin, Clock, Calendar, Users, Check, Loader2 } from 'lucide-react';

export default function UmiShop() {
  const navigate = useNavigate();
  const [paidActivities, setPaidActivities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAttivita().then(data => setPaidActivities(data.filter(a => a.pubblicata && a.costo > 0))).catch(() => {});
  }, []);

  const handleBuy = async (att) => {
    setSaving(true);
    try {
      await createEntrata({ socio_nome: 'Test Admin', causale: att.titolo, importo: att.costo, data: new Date().toISOString().slice(0,10), stato: 'Saldato', metodo: 'Test', attivita_id: att.id });
      setSelected(null);
      setToast(`Test acquisto "${att.titolo}" (€${att.costo}) salvato!`);
    } catch (e) { setToast('Errore: ' + (e.message || 'salvataggio fallito')); }
    setSaving(false);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase mb-1">UMI Shop (Anteprima Amministratore)</h1>
      <p className="text-umi-muted text-sm mb-6">Clicca su una card per testare la procedura di acquisto.</p>

      {paidActivities.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">🛍️</div>
          <p className="text-umi-muted text-sm">Nessuna attività a pagamento disponibile. Aggiungine una dal Catalogo Attività.</p>
          <button onClick={() => navigate('/admin/catalogo')} className="mt-4 gradient-primary text-white px-6 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity">
            Vai al Catalogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paidActivities.map(att => (
            <div key={att.id} onClick={() => setSelected(att)} className="bg-umi-card border border-umi-border rounded-xl overflow-hidden card-hover cursor-pointer">
              <div className="h-40 bg-umi-input flex items-center justify-center text-4xl relative">
                {att.tipologia === 'Masterclass' ? '🎓' : att.tipologia === 'Congresso UMI' ? '🏛️' : att.tipologia === 'Viaggio Studi' ? '✈️' : '📋'}
                <span className="absolute top-2 right-2 text-sm bg-umi-gold text-white px-2 py-0.5 rounded-full font-bold">€{att.costo}</span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full">{att.tipologia}</span>
                </div>
                <h3 className="text-sm font-bold text-umi-text mb-1">{att.titolo}</h3>
                <div className="flex items-center gap-3 text-[10px] text-umi-muted mb-3">
                  {att.data && <span className="flex items-center gap-0.5"><Calendar size={10} /> {new Date(att.data).toLocaleDateString('it-IT')}</span>}
                  {att.durata && <span className="flex items-center gap-0.5"><Clock size={10} /> {att.durata}</span>}
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleBuy(att); }} className="w-full gradient-gold text-white text-sm font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">
                  🛒 ACQUISTA
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-umi-card border border-umi-border rounded-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="h-48 bg-umi-input flex items-center justify-center text-6xl relative rounded-t-2xl">
              {selected.tipologia === 'Masterclass' ? '🎓' : selected.tipologia === 'Congresso UMI' ? '🏛️' : '📋'}
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 p-1.5 bg-black/40 rounded-full hover:bg-black/60 transition-colors"><X size={18} className="text-white" /></button>
              <span className="absolute bottom-3 right-3 text-lg bg-umi-gold text-white px-3 py-1 rounded-full font-bold">€{selected.costo}</span>
            </div>
            <div className="p-6">
              <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full">{selected.tipologia}</span>
              <h2 className="text-lg font-bold text-umi-text mt-3 mb-2">{selected.titolo}</h2>
              {selected.descrizione && <p className="text-sm text-umi-muted mb-4">{selected.descrizione}</p>}
              <div className="space-y-2 mb-6 bg-umi-input rounded-lg p-4">
                {selected.data && <div className="flex items-center gap-2 text-xs text-umi-muted"><Calendar size={14} className="text-umi-primary" /> {new Date(selected.data).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>}
                {selected.durata && <div className="flex items-center gap-2 text-xs text-umi-muted"><Clock size={14} className="text-umi-primary" /> {selected.durata}</div>}
                {selected.luogo && <div className="flex items-center gap-2 text-xs text-umi-muted"><MapPin size={14} className="text-umi-primary" /> {selected.luogo}</div>}
                <div className="flex items-center gap-2 text-xs text-umi-muted"><Users size={14} className="text-umi-primary" /> {selected.modalita}</div>
                {selected.docente && <div className="flex items-center gap-2 text-xs text-umi-muted">👨‍🏫 {selected.docente}</div>}
              </div>
              <button onClick={() => handleBuy(selected)} disabled={saving} className={`w-full gradient-gold text-white text-sm font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${saving ? 'opacity-60' : ''}`}>
                {saving ? <><Loader2 size={16} className="animate-spin" /> Salvataggio...</> : `🛒 TEST ACQUISTO (€${selected.costo})`}
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
