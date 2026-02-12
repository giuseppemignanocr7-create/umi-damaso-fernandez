import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchProfiles, fetchAttivita, fetchEntrate, fetchUscite, fetchNotifiche } from '../../supabaseStore';
import { TrendingUp, Users, BookOpen, DollarSign, Calendar, Bell, ArrowUpRight } from 'lucide-react';

function AnimatedCounter({ target, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{prefix}{typeof target === 'number' && target % 1 !== 0 ? count.toFixed(2) : count}{suffix}</span>;
}

const cards = [
  { icon: '🛍️', title: 'UMI SHOP', desc: 'Shop attività a pagamento', path: '/admin/shop' },
  { icon: '📚', title: 'BIBLIOTECA', desc: 'PDF, dispense e testi', path: '/admin/biblioteca' },
  { icon: '🎬', title: 'VIDEOTECA', desc: 'Video lezioni e seminari', path: '/admin/videoteca' },
  { icon: '👥', title: 'GESTIONE SOCI', desc: 'Anagrafica e statistiche', path: '/admin/gestione-soci' },
  { icon: '📋', title: 'CATALOGO', desc: 'Corsi, eventi e masterclass', path: '/admin/catalogo' },
  { icon: '🏆', title: "ALBO D'ORO", desc: 'Onorificenze e diplomi', path: '/admin/albo' },
  { icon: '💰', title: 'CONTABILITÀ', desc: 'Entrate e pagamenti', path: '/admin/contabilita' },
  { icon: '🖼️', title: 'MEDIA CENTER', desc: 'Foto e materiali', path: '/admin/media' },
  { icon: '🔔', title: 'NOTIFICHE', desc: 'Scadenze e avvisi', path: '/admin/notifiche' },
  { icon: '📅', title: 'AGENDA', desc: 'Calendario eventi', path: '/admin/agenda' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [stats, setStats] = useState({ soci: 0, attivi: 0, attivita: 0, entrate: 0, uscite: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifiche, setNotifiche] = useState([]);

  const load = useCallback(async () => {
    try {
      const [soci, att, ent, usc, not] = await Promise.all([
        fetchProfiles(), fetchAttivita(), fetchEntrate(), fetchUscite(), fetchNotifiche()
      ]);
      const totEntrate = ent.reduce((s, e) => s + (e.importo || 0), 0);
      const totUscite = usc.reduce((s, u) => s + (u.importo || 0), 0);
      setStats({
        soci: soci.length,
        attivi: soci.filter(s => s.stato === 'Attivo').length,
        attivita: att.length,
        entrate: totEntrate,
        uscite: totUscite,
      });
      setNotifiche(not.slice(0, 3));
      const feed = [
        ...soci.slice(0, 3).map(s => ({ icon: '👤', text: `${s.nome} ${s.cognome} — ${s.ruolo}`, sub: s.stato, time: s.created_at })),
        ...att.slice(0, 3).map(a => ({ icon: '📋', text: a.titolo, sub: a.tipologia, time: a.data })),
        ...ent.slice(0, 2).map(e => ({ icon: '💰', text: `€${e.importo} — ${e.causale}`, sub: e.stato, time: e.data })),
      ].sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0)).slice(0, 8);
      setRecentActivity(feed);
    } catch {}
  }, []);
  useEffect(() => { load(); }, [load]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buongiorno' : hour < 18 ? 'Buon pomeriggio' : 'Buonasera';

  return (
    <div>
      {/* HERO GREETING */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase mb-1">
            {greeting}, {profile?.nome || 'Admin'} ✦
          </h1>
          <p className="text-umi-muted text-sm">Ecco il riepilogo della tua Università Magica.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-umi-dim">
          <Calendar size={14} /> {new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div className="bg-umi-card border border-umi-border rounded-xl p-4 card-hover">
          <div className="flex items-center justify-between mb-2">
            <Users size={18} className="text-blue-400" />
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full font-bold">SOCI</span>
          </div>
          <p className="text-2xl font-bold text-umi-text"><AnimatedCounter target={stats.soci} /></p>
          <p className="text-[10px] text-umi-green font-bold flex items-center gap-0.5"><TrendingUp size={10} /> {stats.attivi} attivi</p>
        </div>
        <div className="bg-umi-card border border-umi-border rounded-xl p-4 card-hover">
          <div className="flex items-center justify-between mb-2">
            <BookOpen size={18} className="text-purple-400" />
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full font-bold">ATTIVITÀ</span>
          </div>
          <p className="text-2xl font-bold text-umi-text"><AnimatedCounter target={stats.attivita} /></p>
          <p className="text-[10px] text-umi-muted">corsi, eventi, shop</p>
        </div>
        <div className="bg-umi-card border border-umi-border rounded-xl p-4 card-hover">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={18} className="text-green-400" />
            <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded-full font-bold">ENTRATE</span>
          </div>
          <p className="text-2xl font-bold text-umi-green"><AnimatedCounter target={Math.round(stats.entrate)} prefix="€" /></p>
          <p className="text-[10px] text-umi-muted">totale incassato</p>
        </div>
        <div className="bg-umi-card border border-umi-border rounded-xl p-4 card-hover">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={18} className="text-red-400" />
            <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded-full font-bold">USCITE</span>
          </div>
          <p className="text-2xl font-bold text-umi-red"><AnimatedCounter target={Math.round(stats.uscite)} prefix="€" /></p>
          <p className="text-[10px] text-umi-muted">spese sostenute</p>
        </div>
        <div className="bg-umi-card border border-umi-border rounded-xl p-4 card-hover">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={18} className={stats.entrate >= stats.uscite ? 'text-green-400' : 'text-red-400'} />
            <span className="text-[10px] bg-umi-gold/20 text-umi-gold px-1.5 py-0.5 rounded-full font-bold">BILANCIO</span>
          </div>
          <p className={`text-2xl font-bold ${stats.entrate >= stats.uscite ? 'text-umi-green' : 'text-umi-red'}`}>
            {stats.entrate >= stats.uscite ? '+' : '-'}€<AnimatedCounter target={Math.abs(Math.round(stats.entrate - stats.uscite))} />
          </p>
          <p className="text-[10px] text-umi-muted">bilancio netto</p>
        </div>
      </div>

      {/* MAGI INSIGHT BANNER */}
      <div className="mb-6 rounded-xl p-4 border border-purple-500/30 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.08))' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>🔮</div>
        <div className="flex-1">
          <p className="text-sm font-bold text-purple-200">MAGI Insight</p>
          <p className="text-xs text-purple-300/80">
            {stats.soci > 0 ? `Ci sono ${stats.attivi} soci attivi su ${stats.soci} totali (${Math.round(stats.attivi/stats.soci*100)}%). ` : ''}
            {stats.entrate > stats.uscite ? `Bilancio positivo di €${Math.round(stats.entrate - stats.uscite)}. Ottimo lavoro!` : 'Monitora le spese per mantenere l\'equilibrio finanziario.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* RECENT ACTIVITY FEED */}
        <div className="lg:col-span-2 bg-umi-card border border-umi-border rounded-xl p-5">
          <h3 className="text-xs font-bold text-umi-text tracking-wider uppercase mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-umi-green rounded-full animate-pulse" /> Attività Recente
          </h3>
          <div className="space-y-2">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-umi-input transition-colors">
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-umi-text truncate">{item.text}</p>
                  <p className="text-[10px] text-umi-dim">{item.sub}</p>
                </div>
                {item.time && <span className="text-[10px] text-umi-dim shrink-0">{new Date(item.time).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="bg-umi-card border border-umi-border rounded-xl p-5">
          <h3 className="text-xs font-bold text-umi-text tracking-wider uppercase mb-4 flex items-center gap-2">
            <Bell size={14} className="text-umi-gold" /> Notifiche
          </h3>
          {notifiche.length === 0 ? (
            <p className="text-xs text-umi-dim">Nessuna notifica.</p>
          ) : (
            <div className="space-y-3">
              {notifiche.map(n => (
                <div key={n.id} className="border-l-2 border-umi-gold pl-3">
                  <p className="text-xs text-umi-text">{n.titolo}</p>
                  <p className="text-[10px] text-umi-dim">{new Date(n.data).toLocaleDateString('it-IT')}</p>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => navigate('/admin/notifiche')} className="mt-3 text-xs text-umi-primary flex items-center gap-1 hover:text-umi-primary-light transition-colors">
            Vedi tutte <ArrowUpRight size={12} />
          </button>
        </div>
      </div>

      {/* MODULE CARDS */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-umi-text tracking-wider uppercase">Moduli</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map(card => (
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
    </div>
  );
}
