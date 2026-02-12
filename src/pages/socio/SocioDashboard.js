import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const cards = [
  { icon: '🛍️', title: 'Shop UMI', desc: 'Acquista l\'accesso a corsi, masterclass ed eventi esclusivi', path: '/socio/shop' },
  { icon: '📚', title: 'Biblioteca', desc: 'Accedi ai tuoi testi, dispense e documenti PDF', path: '/socio/biblioteca' },
  { icon: '🎬', title: 'Videoteca', desc: 'Guarda le video lezioni e i seminari registrati', path: '/socio/videoteca' },
  { icon: '👤', title: 'Profilo', desc: 'Il tuo profilo e informazioni personali', path: '/socio/profilo' },
  { icon: '📋', title: 'I Miei Corsi', desc: 'Il tuo registro delle attività e lezioni', path: '/socio/corsi' },
  { icon: '🏆', title: "Albo d'Oro", desc: "La bacheca dei trofei e titoli dell'Università", path: '/socio/albo' },
  { icon: '💰', title: 'Costi', desc: 'Storico pagamenti e rinnovi', path: '/socio/pagamenti' },
  { icon: '🖼️', title: 'Media', desc: 'Documenti, foto e risorse didattiche', path: '/socio/media' },
];

export default function SocioDashboard() {
  const { profile } = useAuth();
  const user = profile || {};
  const navigate = useNavigate();
  const isVisitatore = user?.ruolo === 'Visitatore';

  const visibleCards = isVisitatore
    ? cards.filter(c => c.path === '/socio/shop')
    : cards;

  return (
    <div>
      <div className="text-center mb-10">
        <div className="text-4xl mb-4">✦</div>
        <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase mb-2">
          Bentornato nell'Accademia, {user?.nome || 'Mago'}
        </h1>
        <p className="text-umi-muted text-sm max-w-lg mx-auto">
          Il portale magico è a tua disposizione. Esplora le risorse digitali o gestisci il tuo percorso accademico.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-1">Menu Rapido</h2>
        <p className="text-xs text-umi-muted">Seleziona un'area per accedere ai dettagli del tuo percorso magico.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleCards.map(card => (
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

      {isVisitatore && (
        <div className="mt-8 bg-umi-card border border-umi-gold/30 rounded-xl p-6 text-center">
          <p className="text-umi-gold text-sm">
            Come Visitatore hai accesso solo al Magic Shop. Per sbloccare tutte le funzionalità, contatta la segreteria.
          </p>
        </div>
      )}
    </div>
  );
}
