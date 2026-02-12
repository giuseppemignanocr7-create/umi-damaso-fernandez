import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { STATI_SOCIO } from '../../supabaseClient';
import { fetchProfiles } from '../../supabaseStore';

export default function ElencoSoci() {
  const [search, setSearch] = useState('');
  const [filtroStato, setFiltroStato] = useState('Tutti');
  const [soci, setSoci] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles().then(data => { setSoci(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = soci.filter(s => {
    const matchSearch = !search ||
      `${s.nome} ${s.cognome}`.toLowerCase().includes(search.toLowerCase()) ||
      (s.matricola || '').toLowerCase().includes(search.toLowerCase());
    const matchStato = filtroStato === 'Tutti' || s.stato === filtroStato;
    return matchSearch && matchStato;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase mb-6">Registro Soci</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[250px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-umi-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca per nome o tessera."
            className="w-full bg-umi-input border border-umi-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-umi-text focus:outline-none focus:border-umi-primary"
          />
        </div>
        <select
          value={filtroStato}
          onChange={(e) => setFiltroStato(e.target.value)}
          className="bg-umi-input border border-umi-border rounded-lg px-4 py-2.5 text-sm text-umi-text focus:outline-none focus:border-umi-primary"
        >
          <option value="Tutti">Tutti gli stati</option>
          {STATI_SOCIO.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-umi-card border border-umi-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-umi-border">
                <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Socio</th>
                <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Tessera</th>
                <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Username</th>
                <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Password</th>
                <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Stato</th>
                <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-umi-dim text-sm">
                    Nessun socio trovato nei registri.
                  </td>
                </tr>
              ) : (
                filtered.map(socio => (
                  <tr key={socio.id} className="border-b border-umi-border/50 hover:bg-umi-input/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-umi-primary/30 flex items-center justify-center text-xs text-umi-primary font-bold">
                          {socio.nome[0]}{socio.cognome[0]}
                        </div>
                        <div>
                          <p className="text-sm text-umi-text font-semibold">{socio.nome} {socio.cognome}</p>
                          <p className="text-xs text-umi-dim">{socio.ruolo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-umi-gold font-mono">{socio.matricola}</td>
                    <td className="px-4 py-3 text-sm text-umi-muted">{socio.email}</td>
                    <td className="px-4 py-3 text-sm text-umi-muted">••••••</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        socio.stato === 'Attivo' ? 'bg-umi-green/20 text-umi-green' :
                        socio.stato === 'Sospeso' ? 'bg-umi-orange/20 text-umi-orange' :
                        socio.stato === 'Scaduto' ? 'bg-umi-red/20 text-umi-red' :
                        'bg-umi-primary/20 text-umi-primary-light'
                      }`}>
                        {socio.stato}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-umi-primary hover:text-umi-primary-light transition-colors">
                        Dettagli
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
