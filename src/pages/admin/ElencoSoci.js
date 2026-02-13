import React, { useState, useEffect } from 'react';
import { Search, X, Mail, Phone, MapPin, Calendar, Shield, UserCheck, Trash2 } from 'lucide-react';
import { STATI_SOCIO } from '../../supabaseClient';
import { fetchProfiles, updateProfile, deleteProfile } from '../../supabaseStore';

export default function ElencoSoci() {
  const [search, setSearch] = useState('');
  const [filtroStato, setFiltroStato] = useState('Tutti');
  const [soci, setSoci] = useState([]);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');
  useEffect(() => {
    fetchProfiles().then(data => { setSoci(data); }).catch(() => {});
  }, []);

  const filtered = soci.filter(s => {
    const matchSearch = !search ||
      `${s.nome} ${s.cognome}`.toLowerCase().includes(search.toLowerCase()) ||
      (s.matricola || '').toLowerCase().includes(search.toLowerCase());
    const matchStato = filtroStato === 'Tutti' || s.stato === filtroStato;
    return matchSearch && matchStato;
  });

  const handleStatusChange = async (socio, newStatus) => {
    try {
      await updateProfile(socio.id, { stato: newStatus });
      setSoci(prev => prev.map(s => s.id === socio.id ? { ...s, stato: newStatus } : s));
      setSelected(prev => prev ? { ...prev, stato: newStatus } : null);
      setToast(`Stato di ${socio.nome} ${socio.cognome} aggiornato a "${newStatus}"`);
    } catch (e) { setToast('Errore: ' + (e.message || 'salvataggio fallito')); }
    setTimeout(() => setToast(''), 3000);
  };

  const handleDelete = async (socio) => {
    if (!window.confirm(`Eliminare ${socio.nome} ${socio.cognome}?`)) return;
    try {
      await deleteProfile(socio.id);
      setSoci(prev => prev.filter(s => s.id !== socio.id));
      setSelected(null);
      setToast(`${socio.nome} ${socio.cognome} eliminato`);
    } catch (e) { setToast('Errore: ' + (e.message || 'eliminazione fallita')); }
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Registro Soci</h1>
        <span className="text-xs text-umi-dim">{filtered.length} di {soci.length} soci</span>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-umi-dim" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca per nome o tessera..."
            className="w-full bg-umi-input border border-umi-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-umi-text focus:outline-none focus:border-umi-primary" />
        </div>
        <select value={filtroStato} onChange={(e) => setFiltroStato(e.target.value)}
          className="bg-umi-input border border-umi-border rounded-lg px-4 py-2.5 text-sm text-umi-text focus:outline-none focus:border-umi-primary">
          <option value="Tutti">Tutti gli stati</option>
          {STATI_SOCIO.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* MOBILE: Card layout, DESKTOP: Table */}
      <div className="hidden md:block bg-umi-card border border-umi-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-umi-border">
                <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Socio</th>
                <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Tessera</th>
                <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Email</th>
                <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Stato</th>
                <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-umi-dim text-sm">Nessun socio trovato.</td></tr>
              ) : (
                filtered.map(socio => (
                  <tr key={socio.id} onClick={() => setSelected(socio)} className="border-b border-umi-border/50 hover:bg-umi-input/50 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-umi-primary/30 flex items-center justify-center text-xs text-umi-primary font-bold">
                          {socio.nome?.[0]}{socio.cognome?.[0]}
                        </div>
                        <div>
                          <p className="text-sm text-umi-text font-semibold">{socio.nome} {socio.cognome}</p>
                          <p className="text-xs text-umi-dim">{socio.ruolo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-umi-gold font-mono">{socio.matricola}</td>
                    <td className="px-4 py-3 text-sm text-umi-muted">{socio.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        socio.stato === 'Attivo' ? 'bg-umi-green/20 text-umi-green' :
                        socio.stato === 'Sospeso' ? 'bg-umi-orange/20 text-umi-orange' :
                        socio.stato === 'Scaduto' ? 'bg-umi-red/20 text-umi-red' :
                        'bg-umi-primary/20 text-umi-primary-light'
                      }`}>{socio.stato}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={(e) => { e.stopPropagation(); setSelected(socio); }} className="text-xs text-umi-primary hover:text-umi-primary-light transition-colors font-semibold">
                        Dettagli →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-2">
        {filtered.length === 0 ? (
          <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
            <p className="text-umi-dim text-sm">Nessun socio trovato.</p>
          </div>
        ) : filtered.map(socio => (
          <div key={socio.id} onClick={() => setSelected(socio)} className="bg-umi-card border border-umi-border rounded-xl p-4 flex items-center gap-3 card-hover cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-umi-primary/30 flex items-center justify-center text-xs text-umi-primary font-bold shrink-0">
              {socio.nome?.[0]}{socio.cognome?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-umi-text font-semibold truncate">{socio.nome} {socio.cognome}</p>
              <p className="text-[10px] text-umi-dim">{socio.ruolo} · {socio.matricola}</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
              socio.stato === 'Attivo' ? 'bg-umi-green/20 text-umi-green' :
              socio.stato === 'Sospeso' ? 'bg-umi-orange/20 text-umi-orange' :
              'bg-umi-red/20 text-umi-red'
            }`}>{socio.stato}</span>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-umi-card border border-umi-border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-umi-primary/30 flex items-center justify-center text-lg text-umi-primary font-bold">
                    {selected.nome?.[0]}{selected.cognome?.[0]}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-umi-text">{selected.nome} {selected.cognome}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full">{selected.ruolo}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        selected.stato === 'Attivo' ? 'bg-umi-green/20 text-umi-green' :
                        selected.stato === 'Sospeso' ? 'bg-umi-orange/20 text-umi-orange' :
                        'bg-umi-red/20 text-umi-red'
                      }`}>{selected.stato}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-umi-input rounded-full transition-colors"><X size={18} className="text-umi-muted" /></button>
              </div>

              <div className="bg-umi-input rounded-lg p-4 space-y-3 mb-6">
                <div className="flex items-center gap-2 text-xs text-umi-muted"><Shield size={14} className="text-umi-gold" /> Matricola: <span className="font-mono text-umi-gold">{selected.matricola}</span></div>
                <div className="flex items-center gap-2 text-xs text-umi-muted"><Mail size={14} className="text-umi-primary" /> {selected.email}</div>
                {selected.cellulare && <div className="flex items-center gap-2 text-xs text-umi-muted"><Phone size={14} className="text-umi-primary" /> {selected.prefisso} {selected.cellulare}</div>}
                {selected.citta && <div className="flex items-center gap-2 text-xs text-umi-muted"><MapPin size={14} className="text-umi-primary" /> {selected.indirizzo}, {selected.citta} ({selected.cap})</div>}
                {selected.nazionalita && <div className="flex items-center gap-2 text-xs text-umi-muted">🌍 {selected.nazionalita}</div>}
                {selected.scadenza && <div className="flex items-center gap-2 text-xs text-umi-muted"><Calendar size={14} className="text-umi-primary" /> Scadenza: {selected.scadenza}</div>}
                {selected.data_nascita && <div className="flex items-center gap-2 text-xs text-umi-muted"><Calendar size={14} className="text-umi-primary" /> Nato: {selected.data_nascita}</div>}
              </div>

              <div className="mb-4">
                <p className="text-xs text-umi-muted uppercase font-bold mb-2 flex items-center gap-1"><UserCheck size={12} /> Cambia Stato</p>
                <div className="flex gap-2 flex-wrap">
                  {STATI_SOCIO.map(s => (
                    <button key={s} onClick={() => handleStatusChange(selected, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selected.stato === s
                        ? s === 'Attivo' ? 'bg-umi-green text-white' : s === 'Sospeso' ? 'bg-umi-orange text-white' : s === 'Scaduto' ? 'bg-red-500 text-white' : 'bg-umi-primary text-white'
                        : 'bg-umi-card text-umi-muted border border-umi-border hover:border-umi-primary'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => handleDelete(selected)} className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors">
                <Trash2 size={14} /> Elimina Socio
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-umi-green text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 text-sm animate-pulse">
          ✅ {toast}
        </div>
      )}
    </div>
  );
}
