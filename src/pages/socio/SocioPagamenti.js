import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_PAGAMENTI } from '../../demoData';

export default function SocioPagamenti() {
  const { profile, isDemo } = useAuth();
  const pagamenti = isDemo ? DEMO_PAGAMENTI : (profile?.pagamenti || []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Storico Pagamenti</h1>
        <p className="text-umi-muted text-sm">Riepilogo dei tuoi pagamenti e rinnovi.</p>
      </div>

      {pagamenti.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">💰</div>
          <p className="text-umi-muted text-sm">Nessun pagamento registrato.</p>
        </div>
      ) : (
        <div className="bg-umi-card border border-umi-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-umi-border">
                <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Causale</th>
                <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Data</th>
                <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Importo</th>
                <th className="text-left text-xs uppercase tracking-wider text-umi-muted px-4 py-3">Stato</th>
              </tr>
            </thead>
            <tbody>
              {pagamenti.map((p, i) => (
                <tr key={i} className="border-b border-umi-border/50 hover:bg-umi-input/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-umi-text">{p.causale}</td>
                  <td className="px-4 py-3 text-sm text-umi-muted">{p.data}</td>
                  <td className="px-4 py-3 text-sm text-umi-green font-bold">€{Number(p.importo).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${p.stato === 'Saldato' ? 'bg-umi-green/20 text-umi-green' : 'bg-umi-orange/20 text-umi-orange'}`}>
                      {p.stato || 'Saldato'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
