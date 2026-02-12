import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAttivita } from '../../supabaseStore';

export default function UmiShop() {
  const navigate = useNavigate();
  const [paidActivities, setPaidActivities] = useState([]);

  useEffect(() => {
    fetchAttivita().then(data => setPaidActivities(data.filter(a => a.pubblicata && a.costo > 0))).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase mb-1">UMI Shop (Anteprima Amministratore)</h1>
      <p className="text-umi-muted text-sm mb-6">Clicca su una card per testare la procedura di acquisto.</p>

      {paidActivities.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">🛍️</div>
          <p className="text-umi-muted text-sm">Nessuna attività a pagamento disponibile. Aggiungine una dal Catalogo Attività.</p>
          <button
            onClick={() => navigate('/admin/catalogo')}
            className="mt-4 gradient-primary text-white px-6 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            Vai al Catalogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paidActivities.map(att => (
            <div key={att.id} className="bg-umi-card border border-umi-border rounded-xl overflow-hidden card-hover">
              <div className="h-40 bg-umi-input flex items-center justify-center text-4xl">🎓</div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full">{att.tipologia}</span>
                  <span className="text-xs text-umi-gold font-bold">€{att.costo}</span>
                </div>
                <h3 className="text-sm font-bold text-umi-text mb-1">{att.titolo}</h3>
                <p className="text-xs text-umi-muted mb-3">{att.data}</p>
                <button className="w-full gradient-gold text-white text-sm font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">
                  🛒 ACQUISTA
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
