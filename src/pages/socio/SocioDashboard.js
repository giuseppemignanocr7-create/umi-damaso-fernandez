import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchAttivita, fetchBiblioteca, fetchVideoteca } from '../../supabaseStore';
import { DEMO_PAGAMENTI } from '../../demoData';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const BADGES = [
  { id: 'new', icon: '🌟', name: 'Novizio', desc: 'Benvenuto nell\'Accademia', unlocked: true },
  { id: 'reader', icon: '📖', name: 'Lettore', desc: 'Ha consultato la Biblioteca', unlocked: true },
  { id: 'watcher', icon: '🎬', name: 'Studioso', desc: 'Ha visionato la Videoteca', unlocked: true },
  { id: 'social', icon: '🤝', name: 'Socio Attivo', desc: 'Iscrizione attiva', unlocked: true },
  { id: 'gold', icon: '🏆', name: 'Albo d\'Oro', desc: 'Presente nell\'Albo', unlocked: false },
  { id: 'master', icon: '🧙', name: 'Maestro', desc: 'Completato 5+ corsi', unlocked: false },
  { id: 'patron', icon: '💎', name: 'Mecenate', desc: 'Sostenitore UMI', unlocked: false },
  { id: 'legend', icon: '⚡', name: 'Leggenda', desc: 'Membro da 5+ anni', unlocked: false },
];

const cards = [
  { icon: '🛍️', title: 'Shop UMI', desc: 'Corsi, masterclass ed eventi', path: '/socio/shop' },
  { icon: '📚', title: 'Biblioteca', desc: 'Testi, dispense e PDF', path: '/socio/biblioteca' },
  { icon: '🎬', title: 'Videoteca', desc: 'Video lezioni e seminari', path: '/socio/videoteca' },
  { icon: '👤', title: 'Profilo', desc: 'Tessera e dati personali', path: '/socio/profilo' },
  { icon: '📋', title: 'I Miei Corsi', desc: 'Registro attività', path: '/socio/corsi' },
  { icon: '🏆', title: "Albo d'Oro", desc: 'Trofei e onorificenze', path: '/socio/albo' },
  { icon: '💰', title: 'Pagamenti', desc: 'Storico e rinnovi', path: '/socio/pagamenti' },
  { icon: '🖼️', title: 'Media', desc: 'Foto e risorse', path: '/socio/media' },
  { icon: '📅', title: 'Agenda', desc: 'Calendario eventi', path: '/socio/agenda' },
];

function CountdownTimer({ targetDate }) {
  const [diff, setDiff] = useState({ days: 0, hours: 0, mins: 0 });
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const ms = target - now;
      if (ms <= 0) { setDiff({ days: 0, hours: 0, mins: 0 }); return; }
      setDiff({ days: Math.floor(ms / 86400000), hours: Math.floor((ms % 86400000) / 3600000), mins: Math.floor((ms % 3600000) / 60000) });
    };
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, [targetDate]);
  return (
    <div className="flex gap-3">
      {[['days', 'giorni'], ['hours', 'ore'], ['mins', 'min']].map(([k, label]) => (
        <div key={k} className="text-center">
          <div className="text-2xl font-bold text-white bg-umi-primary/30 rounded-lg w-14 h-14 flex items-center justify-center border border-umi-primary/50">
            {diff[k]}
          </div>
          <span className="text-[9px] text-umi-dim uppercase mt-1">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function SocioDashboard() {
  const { profile, isDemo } = useAuth();
  const user = profile || {};
  const navigate = useNavigate();
  const isVisitatore = user?.ruolo === 'Visitatore';
  const [nextEvent, setNextEvent] = useState(null);
  const [quickStats, setQuickStats] = useState({ attivita: 0, libri: 0, video: 0 });

  const load = useCallback(async () => {
    try {
      const [att, bib, vid] = await Promise.all([fetchAttivita(), fetchBiblioteca(), fetchVideoteca()]);
      const upcoming = att.filter(a => a.data && new Date(a.data) >= new Date() && a.pubblicata)
        .sort((a, b) => new Date(a.data) - new Date(b.data));
      if (upcoming.length > 0) setNextEvent(upcoming[0]);
      setQuickStats({ attivita: att.filter(a => a.pubblicata).length, libri: bib.length, video: vid.length });
    } catch {}
  }, []);
  useEffect(() => { load(); }, [load]);

  const pagamenti = isDemo ? DEMO_PAGAMENTI : (user?.pagamenti || []);
  const visibleCards = isVisitatore ? cards.filter(c => c.path === '/socio/shop') : cards;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buongiorno' : hour < 18 ? 'Buon pomeriggio' : 'Buonasera';
  const magicQuotes = [
    '"La magia è credere in se stessi." — Goethe',
    '"Ogni magia sufficientemente avanzata è indistinguibile dalla tecnologia." — Clarke',
    '"Il mago non è colui che fa cose impossibili, ma colui che rende possibile l\'impossibile."',
    '"La vera magia non è nell\'inganno, ma nella meraviglia che crea."',
  ];
  const dailyQuote = magicQuotes[new Date().getDate() % magicQuotes.length];

  return (
    <div>
      {/* HERO */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">✦</div>
        <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase mb-2">
          {greeting}, {user?.nome || 'Mago'}
        </h1>
        <p className="text-umi-muted text-sm max-w-lg mx-auto italic">"{dailyQuote}"</p>
      </div>

      {/* NEXT EVENT COUNTDOWN + QUICK STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {nextEvent && (
          <div className="lg:col-span-2 rounded-xl p-5 border border-umi-primary/30 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(124,58,237,0.08))' }}>
            <div className="absolute top-2 right-3 text-[10px] text-umi-primary-light font-bold uppercase flex items-center gap-1"><Sparkles size={10} /> Prossimo Evento</div>
            <h3 className="text-lg font-bold text-umi-text mb-1">{nextEvent.titolo}</h3>
            <p className="text-xs text-umi-muted mb-4">{nextEvent.tipologia} · {new Date(nextEvent.data).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}{nextEvent.luogo ? ` · ${nextEvent.luogo}` : ''}</p>
            <CountdownTimer targetDate={nextEvent.data} />
          </div>
        )}
        <div className={`bg-umi-card border border-umi-border rounded-xl p-5 ${!nextEvent ? 'lg:col-span-3' : ''}`}>
          <h3 className="text-xs font-bold text-umi-text tracking-wider uppercase mb-4">Il Tuo Portale</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-umi-muted">Attività Disponibili</span>
              <span className="text-sm font-bold text-umi-primary-light">{quickStats.attivita}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-umi-muted">Testi in Biblioteca</span>
              <span className="text-sm font-bold text-blue-400">{quickStats.libri}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-umi-muted">Video in Videoteca</span>
              <span className="text-sm font-bold text-purple-400">{quickStats.video}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-umi-muted">Pagamenti</span>
              <span className="text-sm font-bold text-umi-gold">{pagamenti.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BADGES */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-3 flex items-center gap-2">
          <span>🎖️</span> I Tuoi Traguardi
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {BADGES.map(b => (
            <div key={b.id} title={`${b.name}: ${b.desc}`}
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${b.unlocked
                ? 'bg-umi-card border border-umi-primary/30 hover:scale-105 cursor-pointer'
                : 'bg-umi-card/50 border border-umi-border opacity-40 grayscale'}`}>
              <span className="text-2xl mb-1">{b.icon}</span>
              <span className="text-[8px] text-umi-muted text-center leading-tight">{b.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MAGI WELCOME */}
      <div className="mb-6 rounded-xl p-4 border border-purple-500/30 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.08))' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>🔮</div>
        <div className="flex-1">
          <p className="text-sm font-bold text-purple-200">Suggerimento di MAGI</p>
          <p className="text-xs text-purple-300/80">
            {quickStats.attivita > 5 ? `Ci sono ${quickStats.attivita} attività disponibili! Esplora il catalogo per trovare il tuo prossimo corso.` : 'Esplora le risorse del portale e inizia il tuo percorso magico.'}
          </p>
        </div>
        <button onClick={() => navigate('/socio/shop')} className="text-xs text-purple-300 flex items-center gap-1 hover:text-purple-200 transition-colors shrink-0">
          Esplora <ArrowUpRight size={12} />
        </button>
      </div>

      {/* MODULE CARDS */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-umi-text tracking-wider uppercase">Menu Rapido</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {visibleCards.map(card => (
          <button
            key={card.title}
            onClick={() => navigate(card.path)}
            className="bg-umi-card border border-umi-border rounded-xl p-4 text-left card-hover group"
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <h3 className="text-[11px] font-bold text-umi-text tracking-wider uppercase mb-1 group-hover:text-umi-primary transition-colors">
              {card.title}
            </h3>
            <p className="text-[10px] text-umi-muted leading-tight">{card.desc}</p>
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
