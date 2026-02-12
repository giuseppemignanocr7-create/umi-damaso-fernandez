import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchNotifiche, createNotifica, fetchProfiles, fetchEntrate, fetchAttivita } from '../../supabaseStore';
import Modal from '../../components/shared/Modal';

export default function CentroNotifiche() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [nuovaCom, setNuovaCom] = useState('');
  const [scadenze, setScadenze] = useState([]);
  const [pagamentiPendenti, setPagamentiPendenti] = useState([]);
  const [attivitaImminenti, setAttivitaImminenti] = useState([]);
  const [comunicazioni, setComunicazioni] = useState([]);

  const loadAll = useCallback(async () => {
    try {
      const [soci, entrate, attivita, notifiche] = await Promise.all([
        fetchProfiles(), fetchEntrate(), fetchAttivita(), fetchNotifiche()
      ]);
      setScadenze(soci.filter(s => { const d = (new Date(s.scadenza) - new Date()) / 86400000; return d <= 30 && d > 0; }));
      setPagamentiPendenti(entrate.filter(e => e.stato === 'Pendente'));
      setAttivitaImminenti(attivita.filter(a => { const d = (new Date(a.data) - new Date()) / 86400000; return d >= 0 && d <= 7; }));
      setComunicazioni(notifiche.filter(n => n.tipo === 'comunicazione'));
    } catch {}
  }, []);
  useEffect(() => { loadAll(); }, [loadAll]);

  const handleAddComunicazione = async () => {
    if (!nuovaCom) return;
    await createNotifica({ tipo: 'comunicazione', titolo: nuovaCom });
    setNuovaCom('');
    setShowModal(false);
    loadAll();
  };

  function timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'Adesso';
    if (diff < 3600) return `${Math.floor(diff / 60)} min fa`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ore fa`;
    const days = Math.floor(diff / 86400);
    if (days === 1) return '1 giorno fa';
    return `${days} giorni fa`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Centro Notifiche</h1>
          <p className="text-umi-muted text-sm">Panoramica scadenze, avvisi e aggiornamenti UMI.</p>
        </div>
        <button onClick={() => navigate('/admin')} className="bg-umi-card border border-umi-border text-umi-muted px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:border-umi-primary transition-colors">
          Torna al Menu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* SCADENZE */}
        <div className="bg-umi-card border border-umi-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-umi-green"></span>
              <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase">Scadenze Iscrizione</h3>
            </div>
            <span className="text-xs bg-umi-green/20 text-umi-green px-2 py-0.5 rounded-full font-bold">{scadenze.length}</span>
          </div>
          {scadenze.length === 0 ? (
            <p className="text-sm text-umi-dim">Nessuna scadenza imminente.</p>
          ) : (
            <div className="space-y-2">
              {scadenze.map(s => (
                <div key={s.id} className="flex items-center justify-between bg-umi-input rounded-lg px-3 py-2">
                  <span className="text-sm text-umi-text">{s.nome} {s.cognome}</span>
                  <span className="text-xs text-umi-orange">{s.scadenza}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAGAMENTI PENDENTI */}
        <div className="bg-umi-card border border-umi-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-umi-red"></span>
              <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase">Pagamenti Pendenti</h3>
            </div>
            <span className="text-xs bg-umi-red/20 text-umi-red px-2 py-0.5 rounded-full font-bold">{pagamentiPendenti.length}</span>
          </div>
          {pagamentiPendenti.length === 0 ? (
            <p className="text-sm text-umi-dim">Tutti i pagamenti sono in regola.</p>
          ) : (
            <div className="space-y-2">
              {pagamentiPendenti.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-umi-input rounded-lg px-3 py-2">
                  <span className="text-sm text-umi-text">{p.socio}</span>
                  <span className="text-xs text-umi-red font-bold">€{p.importo}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ATTIVITÀ IMMINENTI */}
        <div className="bg-umi-card border border-umi-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-umi-gold"></span>
              <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase">Attività Imminenti (7GG)</h3>
            </div>
            <span className="text-xs bg-umi-gold/20 text-umi-gold px-2 py-0.5 rounded-full font-bold">{attivitaImminenti.length}</span>
          </div>
          {attivitaImminenti.length === 0 ? (
            <p className="text-sm text-umi-dim">Nessuna attività in programma questa settimana.</p>
          ) : (
            <div className="space-y-2">
              {attivitaImminenti.map(a => (
                <div key={a.id} className="flex items-center justify-between bg-umi-input rounded-lg px-3 py-2">
                  <span className="text-sm text-umi-text">{a.titolo}</span>
                  <span className="text-xs text-umi-gold">{a.data}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COMUNICAZIONI */}
        <div className="bg-umi-card border border-umi-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">📢</span>
              <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase">Comunicazioni UMI</h3>
            </div>
          </div>
          <div className="space-y-2">
            {comunicazioni.map(c => (
              <div key={c.id} className="flex items-center justify-between bg-umi-input rounded-lg px-3 py-2">
                <span className="text-sm text-umi-text">{c.titolo}</span>
                <span className="text-xs text-umi-dim">{timeAgo(c.data)}</span>
              </div>
            ))}
            <button onClick={() => setShowModal(true)}
              className="w-full flex items-center justify-center gap-2 text-umi-primary text-sm py-2 hover:text-umi-primary-light transition-colors">
              <Plus size={14} /> Aggiungi Comunicazione
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuova Comunicazione">
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Titolo Comunicazione</label>
            <input type="text" value={nuovaCom} onChange={(e) => setNuovaCom(e.target.value)}
              placeholder="es. Aggiornamento regolamento..."
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm text-umi-muted hover:bg-umi-input transition-colors">Annulla</button>
            <button onClick={handleAddComunicazione} className="gradient-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              Pubblica
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
