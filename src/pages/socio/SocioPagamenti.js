import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_PAGAMENTI } from '../../demoData';
import { X, Receipt, Calendar, CreditCard, Download, Check } from 'lucide-react';

export default function SocioPagamenti() {
  const { profile, isDemo } = useAuth();
  const pagamenti = isDemo ? DEMO_PAGAMENTI : (profile?.pagamenti || []);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('Tutti');
  const [toast, setToast] = useState('');

  const filtered = pagamenti.filter(p => {
    if (filter === 'Saldati') return p.stato === 'Saldato';
    if (filter === 'Pendenti') return p.stato === 'Pendente';
    return true;
  });

  const totale = pagamenti.reduce((s, p) => s + (p.importo || 0), 0);
  const saldato = pagamenti.filter(p => p.stato === 'Saldato').reduce((s, p) => s + (p.importo || 0), 0);
  const pendente = totale - saldato;

  const handlePay = (p) => {
    setSelected(null);
    setToast(`Pagamento "${p.causale}" effettuato!`);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Storico Pagamenti</h1>
        <p className="text-umi-muted text-sm">Riepilogo dei tuoi pagamenti e rinnovi.</p>
      </div>

      {/* SUMMARY CARDS */}
      {pagamenti.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-umi-card border border-umi-border rounded-xl p-4 text-center">
            <p className="text-[10px] text-umi-muted uppercase mb-1">Totale</p>
            <p className="text-lg font-bold text-umi-text">€{totale.toFixed(2)}</p>
          </div>
          <div className="bg-umi-card border border-umi-border rounded-xl p-4 text-center">
            <p className="text-[10px] text-umi-muted uppercase mb-1">Saldato</p>
            <p className="text-lg font-bold text-umi-green">€{saldato.toFixed(2)}</p>
          </div>
          <div className="bg-umi-card border border-umi-border rounded-xl p-4 text-center">
            <p className="text-[10px] text-umi-muted uppercase mb-1">Pendente</p>
            <p className="text-lg font-bold text-umi-orange">€{pendente.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* FILTER TABS */}
      <div className="flex gap-2 mb-4">
        {['Tutti', 'Saldati', 'Pendenti'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === f ? 'bg-umi-primary text-white' : 'bg-umi-card text-umi-muted border border-umi-border hover:border-umi-primary'}`}>
            {f}
          </button>
        ))}
        <span className="text-xs text-umi-dim self-center ml-auto">{filtered.length} transazioni</span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">💰</div>
          <p className="text-umi-muted text-sm">{filter !== 'Tutti' ? 'Nessun pagamento con questo filtro.' : 'Nessun pagamento registrato.'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p, i) => (
            <div key={p.id || i} onClick={() => setSelected(p)}
              className="bg-umi-card border border-umi-border rounded-xl p-4 flex items-center gap-4 card-hover cursor-pointer">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${p.stato === 'Saldato' ? 'bg-umi-green/20' : 'bg-umi-orange/20'}`}>
                {p.stato === 'Saldato' ? '✅' : '⏳'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-umi-text truncate">{p.causale}</p>
                <p className="text-[10px] text-umi-dim">{new Date(p.data).toLocaleDateString('it-IT')}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-umi-text">€{Number(p.importo).toFixed(2)}</p>
                <span className={`text-[10px] font-bold ${p.stato === 'Saldato' ? 'text-umi-green' : 'text-umi-orange'}`}>{p.stato}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAYMENT DETAIL / RECEIPT MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-umi-card border border-umi-border rounded-2xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-full bg-umi-primary/20 flex items-center justify-center">
                  <Receipt size={24} className="text-umi-primary" />
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-umi-input rounded-full transition-colors"><X size={18} className="text-umi-muted" /></button>
              </div>

              <h2 className="text-lg font-bold text-umi-text mb-1">Dettaglio Pagamento</h2>
              <p className="text-xs text-umi-dim mb-4">Ricevuta n. {selected.id || 'RIC-' + Math.random().toString(36).slice(2, 8).toUpperCase()}</p>

              <div className="bg-umi-input rounded-lg p-4 space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-xs text-umi-muted">Causale</span>
                  <span className="text-sm text-umi-text font-semibold">{selected.causale}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-umi-muted flex items-center gap-1"><Calendar size={12} /> Data</span>
                  <span className="text-sm text-umi-text">{new Date(selected.data).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-umi-muted flex items-center gap-1"><CreditCard size={12} /> Metodo</span>
                  <span className="text-sm text-umi-text">{selected.metodo || 'Bonifico'}</span>
                </div>
                <div className="border-t border-umi-border pt-3 flex justify-between items-center">
                  <span className="text-xs text-umi-muted font-bold uppercase">Importo</span>
                  <span className="text-xl font-bold text-umi-text">€{Number(selected.importo).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-umi-muted">Stato</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${selected.stato === 'Saldato' ? 'bg-umi-green/20 text-umi-green' : 'bg-umi-orange/20 text-umi-orange'}`}>
                    {selected.stato}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                {selected.stato === 'Pendente' ? (
                  <button onClick={() => handlePay(selected)} className="flex-1 gradient-gold text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <CreditCard size={16} /> Paga Ora
                  </button>
                ) : (
                  <button className="flex-1 gradient-primary text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <Download size={16} /> Scarica Ricevuta
                  </button>
                )}
              </div>
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
