import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchAttivita } from '../../supabaseStore';
import { DEMO_PAGAMENTI, DEMO_ALBO } from '../../demoData';
import { Book, Film, Plus, Download, QrCode, Shield, Calendar } from 'lucide-react';

const tabs = [
  { key: 'profilo', icon: '👤', label: 'Profilo' },
  { key: 'tessera', icon: '🪪', label: 'Tessera QR' },
  { key: 'corsi', icon: '📋', label: 'I Miei Corsi' },
  { key: 'premi', icon: '🏅', label: 'Premi' },
  { key: 'pagamenti', icon: '💳', label: 'Pagamenti' },
];

function QRCodeSVG({ data, size = 120 }) {
  const modules = 21;
  const cellSize = size / modules;
  const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0; return Math.abs(h); };
  const seed = hash(data);
  const grid = Array.from({ length: modules }, (_, r) =>
    Array.from({ length: modules }, (_, c) => {
      if (r < 7 && c < 7) return (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) ? 1 : 0;
      if (r < 7 && c >= modules - 7) return (r === 0 || r === 6 || c === modules - 1 || c === modules - 7 || (r >= 2 && r <= 4 && c >= modules - 5 && c <= modules - 3)) ? 1 : 0;
      if (r >= modules - 7 && c < 7) return (r === modules - 1 || r === modules - 7 || c === 0 || c === 6 || (r >= modules - 5 && r <= modules - 3 && c >= 2 && c <= 4)) ? 1 : 0;
      return ((seed * (r * modules + c + 1)) % 7) < 3 ? 1 : 0;
    })
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx="4" />
      {grid.map((row, r) => row.map((cell, c) =>
        cell ? <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize} fill="#1a1a2e" /> : null
      ))}
    </svg>
  );
}

export default function SocioProfilo() {
  const { profile, isDemo } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profilo');
  const [corsi, setCorsi] = useState([]);
  const user = profile || {};

  const loadCorsi = useCallback(async () => {
    try {
      const att = await fetchAttivita();
      setCorsi(att.filter(a => a.pubblicata).slice(0, 4));
    } catch {}
  }, []);
  useEffect(() => { loadCorsi(); }, [loadCorsi]);

  const pagamenti = isDemo ? DEMO_PAGAMENTI : (user?.pagamenti || []);
  const premi = isDemo ? DEMO_ALBO.filter(a => a.nome?.includes(user?.cognome) || a.nome?.includes(user?.nome)).slice(0, 3) : [];
  if (isDemo && premi.length === 0) premi.push({ id: 'dp1', nome: user?.nome + ' ' + user?.cognome, evento: 'Trofeo Giovani Talenti', data: '2025-11-05', descrizione: 'Vincitore del concorso nazionale.' });

  const initials = user ? `${(user.nome?.[0] || '').toUpperCase()}${(user.cognome?.[0] || '').toUpperCase()}` : '??';
  const qrData = `UMI|${user?.matricola || 'DF-0001'}|${user?.nome}|${user?.cognome}|${user?.scadenza || '2027-12-31'}`;

  return (
    <div>
      {/* PROFILE HEADER */}
      <div className="bg-umi-card border border-umi-border rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-umi-input flex items-center justify-center text-3xl text-umi-muted font-bold border-2 border-umi-border">
              {user?.foto ? (
                <img src={user.foto} alt="" className="w-full h-full rounded-full object-cover" />
              ) : initials}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-umi-primary flex items-center justify-center text-white">
              <Plus size={14} />
            </button>
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-bold text-umi-text tracking-wider uppercase mb-2">
              {user?.nome} {user?.cognome}
            </h1>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xs bg-umi-green/20 text-umi-green px-2 py-0.5 rounded-full font-semibold">
                {user?.stato || 'ATTIVO'}
              </span>
              <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full font-semibold">
                {user?.ruolo}
              </span>
              <span className="text-xs bg-umi-gold/20 text-umi-gold px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Shield size={10} /> Verificato
              </span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => navigate('/socio/biblioteca')} className="flex items-center gap-1 text-xs text-umi-primary hover:text-umi-primary-light transition-colors">
                <Book size={14} /> Biblioteca
              </button>
              <button onClick={() => navigate('/socio/videoteca')} className="flex items-center gap-1 text-xs text-umi-primary hover:text-umi-primary-light transition-colors">
                <Film size={14} /> Videoteca
              </button>
              <button onClick={() => navigate('/socio/agenda')} className="flex items-center gap-1 text-xs text-umi-primary hover:text-umi-primary-light transition-colors">
                <Calendar size={14} /> Agenda
              </button>
            </div>
            <p className="text-xs text-umi-muted">⏰ Scadenza Accademica: {user?.scadenza || '2026-12-30'}</p>
          </div>

          {/* TESSERA DIGITALE MINI */}
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 border border-umi-gold rounded-xl p-4 w-64 flex-shrink-0 relative overflow-hidden">
            <div className="absolute top-1 right-2 text-[8px] text-emerald-500/50 font-mono">DIGITAL CARD</div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-bold">UM</div>
              <span className="text-white text-xs font-bold tracking-wider">UMI DAMASO FERNANDEZ</span>
            </div>
            <div className="text-umi-gold text-[10px] mb-1">VALIDA FINO AL {user?.scadenza || '31/12/2026'}</div>
            <div className="text-umi-gold text-[10px] mb-2">MATRICOLA: <span className="font-bold">{user?.matricola || 'DF-0001'}</span></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-umi-orange flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <div>
                  <p className="text-[10px] text-emerald-300">{user?.ruolo}</p>
                  <p className="text-white text-xs font-bold">{user?.nome} {user?.cognome}</p>
                </div>
              </div>
              <button onClick={() => setActiveTab('tessera')} className="text-[9px] text-emerald-300 flex items-center gap-0.5 hover:text-white transition-colors">
                <QrCode size={10} /> QR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'albo', icon: '🏆', label: "Albo d'Oro", path: '/socio/albo' },
          { key: 'shop', icon: '🛍️', label: 'Shop UMI', path: '/socio/shop' },
          { key: 'biblioteca', icon: '📚', label: 'Biblioteca', path: '/socio/biblioteca' },
          { key: 'videoteca', icon: '🎬', label: 'Videoteca', path: '/socio/videoteca' },
          ...tabs,
          { key: 'media', icon: '🖼️', label: 'Media', path: '/socio/media' },
        ].map(t => (
          <button key={t.key} onClick={() => t.path ? navigate(t.path) : setActiveTab(t.key)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeTab === t.key && !t.path ? 'bg-umi-primary text-white' : 'bg-umi-card text-umi-muted border border-umi-border hover:border-umi-primary'
            }`}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'profilo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-umi-card border border-umi-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-4 border-b border-umi-border pb-3">Informazioni Personali</h3>
            <div className="space-y-3">
              {[
                ['Email Accademica', user?.email],
                ['Telefono', `${user?.prefisso || ''} ${user?.cellulare || ''}`],
                ['Data di Nascita', user?.data_nascita || 'N/D'],
                ['Residenza', `${user?.indirizzo || ''}, ${user?.citta || ''} (${user?.cap || ''})`],
                ['Nazionalità', user?.nazionalita],
                ['Matricola', user?.matricola || 'DF-0001'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-xs text-umi-muted uppercase">{label}</span>
                  <span className="text-sm text-umi-text">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-umi-card border border-umi-border rounded-xl p-6">
              <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-4 border-b border-umi-border pb-3">Stato Iscrizione</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-umi-muted">Stato</span>
                  <span className="text-xs bg-umi-green/20 text-umi-green px-2 py-0.5 rounded-full font-bold">{user?.stato || 'Attivo'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-umi-muted">Scadenza</span>
                  <span className="text-sm text-umi-text">{user?.scadenza || '31/12/2027'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-umi-muted">Iscritto dal</span>
                  <span className="text-sm text-umi-text">{user?.created_at ? new Date(user.created_at).toLocaleDateString('it-IT') : '15/01/2026'}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-umi-border">
                <div className="flex items-center justify-between text-xs text-umi-muted mb-1">
                  <span>Progresso Annuale</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-umi-input rounded-full h-2">
                  <div className="bg-gradient-to-r from-umi-primary to-purple-400 h-2 rounded-full transition-all" style={{ width: '75%' }} />
                </div>
              </div>
            </div>
            <div className="bg-umi-card border border-umi-border rounded-xl p-6">
              <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-4 border-b border-umi-border pb-3">Connessioni Magiche</h3>
              <div className="space-y-2">
                {['Instagram', 'YouTube', 'TikTok'].map(s => (
                  <div key={s} className="flex items-center justify-between py-1">
                    <span className="text-xs text-umi-muted">{s}</span>
                    <button className="text-[10px] text-umi-primary border border-umi-primary/30 px-2 py-0.5 rounded-full hover:bg-umi-primary/10 transition-colors">Collega</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TESSERA QR */}
      {activeTab === 'tessera' && (
        <div className="max-w-lg mx-auto">
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 border border-umi-gold rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-umi-gold via-yellow-400 to-umi-gold" />
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">UM</div>
                <span className="text-white text-sm font-bold tracking-[3px] uppercase">Università Magica Internazionale</span>
              </div>
              <p className="text-emerald-400 text-[10px] tracking-[4px] uppercase">Damaso Fernandez</p>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-umi-orange flex items-center justify-center text-white text-2xl font-bold border-2 border-umi-gold/50 shrink-0">
                {initials}
              </div>
              <div className="flex-1">
                <h2 className="text-white text-lg font-bold tracking-wider">{user?.nome} {user?.cognome}</h2>
                <p className="text-emerald-300 text-xs">{user?.ruolo}</p>
                <p className="text-umi-gold text-[10px] mt-1">MATRICOLA: {user?.matricola || 'DF-0001'}</p>
                <p className="text-emerald-400/70 text-[10px]">VALIDA FINO AL {user?.scadenza || '31/12/2027'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10">
              <div>
                <p className="text-[9px] text-emerald-400 uppercase tracking-wider mb-1">Scansiona per verificare</p>
                <p className="text-[8px] text-emerald-500/60 font-mono">{user?.matricola || 'UMI-2026-0001'}</p>
              </div>
              <div className="bg-white rounded-lg p-1">
                <QRCodeSVG data={qrData} size={80} />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[8px] text-emerald-500/50">
              <span>ID: {user?.id?.slice(0, 8) || 'demo-001'}</span>
              <span>Portale UMI v2.0</span>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-3">
            <button className="flex items-center gap-1 text-xs text-umi-primary border border-umi-primary/30 px-4 py-2 rounded-lg hover:bg-umi-primary/10 transition-colors">
              <Download size={14} /> Scarica PDF
            </button>
            <button className="flex items-center gap-1 text-xs text-umi-primary border border-umi-primary/30 px-4 py-2 rounded-lg hover:bg-umi-primary/10 transition-colors">
              <QrCode size={14} /> Condividi QR
            </button>
          </div>
        </div>
      )}

      {activeTab === 'corsi' && (
        <div>
          <div className="flex gap-2 mb-4">
            {['Tutti', 'Futuri', 'Passati', 'Online'].map(f => (
              <button key={f} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-umi-card text-umi-muted border border-umi-border hover:border-umi-primary transition-colors">{f}</button>
            ))}
          </div>
          {corsi.length === 0 ? (
            <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-umi-muted text-sm">Nessun corso trovato.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {corsi.map((c) => (
                <div key={c.id} className="bg-umi-card border border-umi-border rounded-xl p-5 card-hover">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full">{c.tipologia}</span>
                    <span className="text-[10px] text-umi-dim">{c.data ? new Date(c.data).toLocaleDateString('it-IT') : ''}</span>
                  </div>
                  <h3 className="text-sm font-bold text-umi-text mb-1">{c.titolo}</h3>
                  <p className="text-xs text-umi-muted mb-2">{c.modalita} · {c.durata}</p>
                  {c.luogo && <p className="text-[10px] text-umi-dim mb-2">📍 {c.luogo}</p>}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${c.costo > 0 ? 'text-umi-gold' : 'text-umi-green'}`}>
                      {c.costo > 0 ? `€${c.costo}` : 'GRATUITO'}
                    </span>
                    <button className="text-xs bg-umi-green/20 text-umi-green px-3 py-1 rounded-full font-semibold">✅ Iscritto</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'premi' && (
        <div>
          {premi.length === 0 ? (
            <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
              <div className="text-4xl mb-4">🏅</div>
              <p className="text-umi-muted text-sm">Nessun premio personale ricevuto.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {premi.map(p => (
                <div key={p.id} className="bg-umi-card border border-umi-border rounded-xl p-5 flex items-center gap-4 card-hover">
                  <div className="w-12 h-12 rounded-full bg-umi-gold/20 flex items-center justify-center text-2xl shrink-0">🏆</div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-umi-text">{p.evento}</h3>
                    <p className="text-xs text-umi-muted">{p.descrizione}</p>
                  </div>
                  <span className="text-[10px] text-umi-dim shrink-0">{p.data ? new Date(p.data).toLocaleDateString('it-IT') : ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'pagamenti' && (
        <div>
          {pagamenti.length === 0 ? (
            <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
              <div className="text-4xl mb-4">💳</div>
              <p className="text-umi-muted text-sm">Nessun pagamento registrato.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="bg-umi-card border border-umi-border rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-umi-muted">Totale Pagato</span>
                  <span className="text-lg font-bold text-umi-green">€{pagamenti.filter(p => p.stato === 'Saldato').reduce((s, p) => s + p.importo, 0)}</span>
                </div>
              </div>
              {pagamenti.map(p => (
                <div key={p.id} className="bg-umi-card border border-umi-border rounded-xl p-4 flex items-center gap-4 card-hover">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${p.stato === 'Saldato' ? 'bg-umi-green/20' : 'bg-umi-orange/20'}`}>
                    {p.stato === 'Saldato' ? '✅' : '⏳'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-umi-text">{p.causale}</p>
                    <p className="text-[10px] text-umi-dim">{new Date(p.data).toLocaleDateString('it-IT')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-umi-text">€{p.importo}</p>
                    <span className={`text-[10px] font-bold ${p.stato === 'Saldato' ? 'text-umi-green' : 'text-umi-orange'}`}>{p.stato}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
