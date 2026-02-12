import React from 'react';
import { useNavigate } from 'react-router-dom';

const cards = [
  { icon: '🛍️', title: 'UMI SHOP', desc: 'Visualizza e controlla lo shop delle attività a pagamento', path: '/admin/shop' },
  { icon: '📚', title: 'BIBLIOTECA VIRTUALE', desc: 'Archivio digitale di PDF, dispense e testi antichi', path: '/admin/biblioteca' },
  { icon: '🎬', title: 'VIDEOTECA VIRTUALE', desc: 'Lezioni registrate, seminari e contenuti video', path: '/admin/videoteca' },
  { icon: '👥', title: 'GESTIONE SOCI', desc: 'Anagrafica, statistiche e iscrizioni', path: '/admin/gestione-soci' },
  { icon: '📋', title: 'CATALOGO ATTIVITÀ', desc: 'Crea e modifica corsi ed eventi', path: '/admin/catalogo' },
  { icon: '🏆', title: "ALBO D'ORO", desc: 'Gestione onorificenze e diplomi', path: '/admin/albo' },
  { icon: '💰', title: 'CONTABILITÀ', desc: 'Analisi entrate e pagamenti pendenti', path: '/admin/contabilita' },
  { icon: '🖼️', title: 'MEDIA CENTER', desc: 'Archivio foto e materiali didattici', path: '/admin/media' },
  { icon: '🔔', title: 'NOTIFICHE', desc: 'Scadenze e avvisi di sistema', path: '/admin/notifiche' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase mb-1">Pannello Amministratore</h1>
        <p className="text-umi-muted text-sm">Gestisci l'università e monitora le attività magiche.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(card => (
          <button
            key={card.title}
            onClick={() => navigate(card.path)}
            className="bg-umi-card border border-umi-border rounded-xl p-6 text-left card-hover group"
          >
            <div className="text-3xl mb-3">{card.icon}</div>
            <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-2 group-hover:text-umi-primary transition-colors">
              {card.title}
            </h3>
            <p className="text-xs text-umi-muted">{card.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
