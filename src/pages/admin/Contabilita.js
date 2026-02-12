import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Save, TrendingDown, TrendingUp, Scale } from 'lucide-react';
import { CATEGORIE_USCITA, PAYPAL_EMAIL } from '../../supabaseClient';
import { fetchUscite, createUscita, fetchEntrate, fetchConfig, updateConfig } from '../../supabaseStore';
import Modal from '../../components/shared/Modal';
import StatCard from '../../components/shared/StatCard';

export default function Contabilita() {
  const [mainTab, setMainTab] = useState('uscite');

  return (
    <div>
      <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase mb-1">Contabilità</h1>
      <p className="text-umi-muted text-sm mb-6">Analisi entrate e pagamenti pendenti.</p>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'uscite', label: 'Uscite Finanziarie' },
          { key: 'entrate', label: 'Registro Entrate' },
          { key: 'bilancio', label: 'Riepilogo Bilancio' },
          { key: 'config', label: 'Configurazione' },
        ].map(t => (
          <button key={t.key} onClick={() => setMainTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${mainTab === t.key ? 'bg-umi-primary text-white' : 'bg-umi-card text-umi-muted border border-umi-border hover:border-umi-primary'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {mainTab === 'uscite' && <UsciteTab />}
      {mainTab === 'entrate' && <EntrateTab />}
      {mainTab === 'bilancio' && <BilancioTab />}
      {mainTab === 'config' && <ConfigTab />}
    </div>
  );
}

function UsciteTab() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titolo: '', importo: '', data: '', categoria: CATEGORIE_USCITA[0], dettagli: '' });
  const [items, setItems] = useState([]);
  const load = useCallback(() => { fetchUscite().then(setItems).catch(() => {}); }, []);
  useEffect(() => { load(); }, [load]);

  const totaleUscite = items.reduce((s, u) => s + Number(u.importo || 0), 0);
  const filtered = items.filter(u => !search || u.titolo.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    if (!form.titolo || !form.importo) return;
    await createUscita({ titolo: form.titolo, importo: Number(form.importo), data: form.data || null, categoria: form.categoria, dettagli: form.dettagli });
    setForm({ titolo: '', importo: '', data: '', categoria: CATEGORIE_USCITA[0], dettagli: '' });
    setShowModal(false);
    load();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-umi-text tracking-wider uppercase">Uscite Finanziarie</h2>
        <button onClick={() => setShowModal(true)} className="gradient-red text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={16} /> Registra Uscita
        </button>
      </div>
      <p className="text-umi-muted text-sm mb-6">Registro dei costi di gestione e mantenimento dell'Ateneo Magico.</p>

      <div className="mb-6">
        <StatCard icon={<TrendingDown size={20} />} label="Totale Uscite Registrate" value={`€${totaleUscite.toFixed(2)}`} color="umi-red" />
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-umi-dim" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cerca tra le uscite..."
          className="w-full bg-umi-input border border-umi-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-umi-text focus:outline-none focus:border-umi-primary" />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIE_USCITA.map(c => {
          const short = c.replace('Piattaforma ', '').replace('Organizzazione ', '');
          return <span key={c} className="text-xs bg-umi-primary/10 text-umi-primary-light px-3 py-1 rounded-full">{short}</span>;
        })}
      </div>

      <div className="bg-umi-card border border-umi-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-umi-border">
              <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Titolo / Categoria</th>
              <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Data</th>
              <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Importo</th>
              <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-umi-dim text-sm">Nessun costo registrato.</td></tr>
            ) : (
              filtered.map(u => (
                <tr key={u.id} className="border-b border-umi-border/50 hover:bg-umi-input/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm text-umi-text font-semibold">{u.titolo}</p>
                    <p className="text-xs text-umi-dim">{u.categoria}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-umi-muted">{u.data}</td>
                  <td className="px-4 py-3 text-sm text-umi-red font-bold">-€{Number(u.importo).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-umi-primary hover:text-umi-primary-light">Modifica</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Registra Nuova Uscita">
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Titolo Spesa</label>
            <input type="text" value={form.titolo} onChange={(e) => setForm(p => ({ ...p, titolo: e.target.value }))} placeholder='es. "Abbonamento ZOOM mensile"'
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Importo (€)</label>
            <input type="number" min="0" step="0.01" value={form.importo} onChange={(e) => setForm(p => ({ ...p, importo: e.target.value }))}
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Data</label>
            <input type="date" value={form.data} onChange={(e) => setForm(p => ({ ...p, data: e.target.value }))}
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Categoria</label>
            <select value={form.categoria} onChange={(e) => setForm(p => ({ ...p, categoria: e.target.value }))}
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary">
              {CATEGORIE_USCITA.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Dettagli (Opzionale)</label>
            <textarea value={form.dettagli} onChange={(e) => setForm(p => ({ ...p, dettagli: e.target.value }))} rows={3} placeholder="Aggiungi una nota..."
              className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm text-umi-muted hover:bg-umi-input transition-colors">Annulla</button>
            <button onClick={handleSave} className="gradient-red text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Save size={14} /> Salva Spesa
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function EntrateTab() {
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState('TUTTI');
  const [items, setItems] = useState([]);
  useEffect(() => { fetchEntrate().then(setItems).catch(() => {}); }, []);

  const totaleIncassato = items.filter(e => e.stato === 'Saldato').reduce((s, e) => s + Number(e.importo || 0), 0);
  const totalePendenti = items.filter(e => e.stato === 'Pendente').reduce((s, e) => s + Number(e.importo || 0), 0);

  const filtered = items.filter(e => {
    const matchSearch = !search || e.socio_nome?.toLowerCase().includes(search.toLowerCase()) || e.causale?.toLowerCase().includes(search.toLowerCase());
    const matchFiltro = filtro === 'TUTTI' || (filtro === 'SALDATI' && e.stato === 'Saldato') || (filtro === 'DA INCASSARE' && e.stato === 'Pendente');
    return matchSearch && matchFiltro;
  });

  return (
    <>
      <h2 className="text-lg font-bold text-umi-text tracking-wider uppercase mb-4">Gestione Finanziaria - Registro Entrate</h2>
      <p className="text-umi-muted text-sm mb-6">Bilancio tra entrate soci e costi di mantenimento portale.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard icon="💲" label="Totale Incassato Soci" value={`€${totaleIncassato}`} color="umi-green" />
        <StatCard icon="⚠️" label="Pagamenti Pendenti" value={`€${totalePendenti}`} color="umi-orange" />
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[250px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-umi-dim" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cerca socio o attività..."
            className="w-full bg-umi-input border border-umi-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-umi-text focus:outline-none focus:border-umi-primary" />
        </div>
        <div className="flex gap-2">
          {['TUTTI', 'SALDATI', 'DA INCASSARE'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${filtro === f ? 'bg-umi-primary text-white' : 'bg-umi-card text-umi-muted border border-umi-border'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-umi-card border border-umi-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-umi-border">
              <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Socio</th>
              <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Causale / Attività</th>
              <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Data</th>
              <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Importo</th>
              <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Stato</th>
              <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-umi-dim text-sm">Nessuna transazione trovata.</td></tr>
            ) : (
              filtered.map(e => (
                <tr key={e.id} className="border-b border-umi-border/50 hover:bg-umi-input/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-umi-text">{e.socio_nome}</td>
                  <td className="px-4 py-3 text-sm text-umi-muted">{e.causale}</td>
                  <td className="px-4 py-3 text-sm text-umi-muted">{e.data}</td>
                  <td className="px-4 py-3 text-sm text-umi-green font-bold">€{Number(e.importo).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${e.stato === 'Saldato' ? 'bg-umi-green/20 text-umi-green' : 'bg-umi-orange/20 text-umi-orange'}`}>
                      {e.stato}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-umi-primary hover:text-umi-primary-light">Dettagli</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function BilancioTab() {
  const [entrateItems, setEntrateItems] = useState([]);
  const [usciteItems, setUsciteItems] = useState([]);
  useEffect(() => { fetchEntrate().then(setEntrateItems).catch(() => {}); fetchUscite().then(setUsciteItems).catch(() => {}); }, []);
  const totaleEntrate = entrateItems.filter(e => e.stato === 'Saldato').reduce((s, e) => s + Number(e.importo || 0), 0);
  const totaleUscite = usciteItems.reduce((s, u) => s + Number(u.importo || 0), 0);
  const bilancio = totaleEntrate - totaleUscite;
  const pendenti = entrateItems.filter(e => e.stato === 'Pendente').reduce((s, e) => s + Number(e.importo || 0), 0);

  return (
    <>
      <h2 className="text-lg font-bold text-umi-text tracking-wider uppercase mb-6">Riepilogo Bilancio</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-umi-card border border-umi-green rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2"><TrendingUp size={18} className="text-umi-green" /><span className="text-xs uppercase tracking-wider text-umi-muted">Totale Entrate</span></div>
          <div className="text-3xl font-bold text-umi-green">€{totaleEntrate.toFixed(2)}</div>
          <p className="text-xs text-umi-dim mt-1">Dalle attività e iscrizioni dei soci</p>
        </div>
        <div className="bg-umi-card border border-umi-red rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2"><TrendingDown size={18} className="text-umi-red" /><span className="text-xs uppercase tracking-wider text-umi-muted">Totale Uscite</span></div>
          <div className="text-3xl font-bold text-umi-red">€{totaleUscite.toFixed(2)}</div>
          <p className="text-xs text-umi-dim mt-1">Mantenimento portale e costi accademici</p>
        </div>
        <div className="bg-umi-card border border-umi-primary rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2"><Scale size={18} className="text-umi-primary" /><span className="text-xs uppercase tracking-wider text-umi-muted">Bilancio Netto</span></div>
          <div className={`text-3xl font-bold ${bilancio >= 0 ? 'text-umi-green' : 'text-umi-red'}`}>€{bilancio.toFixed(2)}</div>
          <p className="text-xs text-umi-dim mt-1">Utile netto dell'Accademia</p>
        </div>
      </div>

      <div className="bg-umi-card border border-umi-border rounded-xl p-6">
        <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-4">Analisi delle Attività</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-umi-border/50">
            <span className="text-sm text-umi-muted">Pagamenti Soci Ricevuti</span>
            <span className="text-sm text-umi-green font-bold">€{totaleEntrate.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-umi-border/50">
            <span className="text-sm text-umi-muted">Pagamenti Soci in Attesa (PENDING)</span>
            <span className="text-sm text-umi-orange font-bold">€{pendenti.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-umi-muted">Costi Gestione Portale</span>
            <span className="text-sm text-umi-red font-bold">-€{totaleUscite.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </>
  );
}

function ConfigTab() {
  const [paypalEmail, setPaypalEmail] = useState(PAYPAL_EMAIL);
  const [saved, setSaved] = useState(false);
  useEffect(() => { fetchConfig().then(c => { if (c?.paypal_email) setPaypalEmail(c.paypal_email); }).catch(() => {}); }, []);

  const handleSave = async () => {
    await updateConfig({ paypal_email: paypalEmail });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <h2 className="text-lg font-bold text-umi-text tracking-wider uppercase mb-6">Impostazioni Pagamenti</h2>
      <div className="bg-umi-card border border-umi-border rounded-xl p-6 max-w-lg">
        <div className="mb-4">
          <label className="block text-xs uppercase tracking-wider text-umi-muted mb-2">Email PayPal (Principale)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-umi-dim">✉</span>
            <input type="email" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)}
              className="w-full bg-umi-input border border-umi-border rounded-lg pl-9 pr-3 py-2.5 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
          </div>
        </div>
        {saved && <p className="text-umi-green text-sm mb-3">✓ Configurazione salvata!</p>}
        <button onClick={handleSave} className="gradient-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
          <Save size={14} /> Salva Configurazioni
        </button>
      </div>
    </>
  );
}
