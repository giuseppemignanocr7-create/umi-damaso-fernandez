import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Book, Film, Plus } from 'lucide-react';

const tabs = [
  { key: 'profilo', icon: '👤', label: 'Profilo' },
  { key: 'corsi', icon: '📋', label: 'I Miei Corsi' },
  { key: 'premi', icon: '🏅', label: 'Premi Pers.' },
  { key: 'pagamenti', icon: '💳', label: 'Pagamenti' },
];

export default function SocioProfilo() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profilo');
  const user = profile || {};

  const initials = user ? `${(user.nome?.[0] || '').toUpperCase()}${(user.cognome?.[0] || '').toUpperCase()}` : '??';

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
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-umi-green/20 text-umi-green px-2 py-0.5 rounded-full font-semibold">
                {user?.stato || 'ATTIVO'}
              </span>
              <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full font-semibold">
                {user?.ruolo}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => navigate('/socio/biblioteca')} className="flex items-center gap-1 text-xs text-umi-primary hover:text-umi-primary-light transition-colors">
                <Book size={14} /> Biblioteca
              </button>
              <button onClick={() => navigate('/socio/videoteca')} className="flex items-center gap-1 text-xs text-umi-primary hover:text-umi-primary-light transition-colors">
                <Film size={14} /> Videoteca
              </button>
            </div>
            <p className="text-xs text-umi-muted">⏰ Scadenza Accademica: {user?.scadenza || '2026-12-30'}</p>
          </div>

          {/* TESSERA DIGITALE */}
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 border border-umi-gold rounded-xl p-4 w-64 flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-bold">UM</div>
              <span className="text-white text-xs font-bold tracking-wider">UMI DAMASO FERNANDEZ</span>
            </div>
            <div className="text-umi-gold text-[10px] mb-1">VALIDA FINO AL {user?.scadenza || '31/12/2026'}</div>
            <div className="text-umi-gold text-[10px] mb-2">MATRICOLA: <span className="font-bold">{user?.matricola || 'DF-0001'}</span></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-umi-orange flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <div>
                <p className="text-[10px] text-emerald-300">{user?.ruolo}</p>
                <p className="text-white text-xs font-bold">{user?.nome} {user?.cognome}</p>
              </div>
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
              <div className="flex justify-between">
                <span className="text-xs text-umi-muted uppercase">Email Accademica</span>
                <span className="text-sm text-umi-text">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-umi-muted uppercase">Telefono</span>
                <span className="text-sm text-umi-text">{user?.prefisso} {user?.cellulare}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-umi-muted uppercase">Residenza</span>
                <span className="text-sm text-umi-text">{user?.indirizzo}, {user?.citta} ({user?.cap})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-umi-muted uppercase">Nazionalità</span>
                <span className="text-sm text-umi-text">{user?.nazionalita}</span>
              </div>
            </div>
          </div>
          <div className="bg-umi-card border border-umi-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-4 border-b border-umi-border pb-3">Connessioni Magiche</h3>
            <p className="text-sm text-umi-dim">Nessun social collegato.</p>
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
          {(!user?.corsiIscritti || user.corsiIscritti.length === 0) ? (
            <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-umi-muted text-sm">Nessun corso trovato.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.corsiIscritti.map((c, i) => (
                <div key={i} className="bg-umi-card border border-umi-border rounded-xl p-5 card-hover">
                  <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full">LEZIONE</span>
                  <h3 className="text-sm font-bold text-umi-text mt-2">{c.titolo || 'Lezione in Presenza'}</h3>
                  <p className="text-xs text-umi-muted mt-1">{c.data}</p>
                  <p className="text-xs text-umi-dim">{c.modalita || 'Presenza'}</p>
                  <button className="mt-3 text-xs bg-umi-green/20 text-umi-green px-3 py-1 rounded-full font-semibold">✅ Disponibile</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'premi' && (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">🏅</div>
          <p className="text-umi-muted text-sm">Nessun premio personale ricevuto.</p>
        </div>
      )}

      {activeTab === 'pagamenti' && (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">💳</div>
          <p className="text-umi-muted text-sm">Nessun pagamento registrato.</p>
        </div>
      )}
    </div>
  );
}
