import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../supabaseClient';
import Logo from '../components/shared/Logo';
import { triggerHatBurst } from '../components/shared/MagicEffects';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();

  const isAdminEmail = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const [submitting, setSubmitting] = useState(false);

  const btnRef = useRef(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  const fireMagic = (el) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    triggerHatBurst(rect.left + rect.width / 2, rect.top);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    fireMagic(btnRef.current);
    try {
      const result = await login(email, isAdminEmail ? '' : password);
      if (result.success) {
        setTimeout(() => navigate(result.isAdmin ? '/admin' : '/socio'), 600);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Errore di connessione.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-umi-bg flex items-center justify-center p-4 overflow-hidden relative">
      {/* AMBIENT FLOATING STARS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute text-umi-gold/30" style={{
            left: `${8 + (i * 7.5) % 90}%`,
            top: `${10 + (i * 13) % 80}%`,
            fontSize: `${6 + (i % 4) * 3}px`,
            animation: `floatStar ${3 + (i % 3)}s ease-in-out infinite ${i * 0.4}s`,
          }}>{['✦', '✧', '★', '·'][i % 4]}</div>
        ))}
      </div>

      <div className={`w-full max-w-md transition-all duration-700 ${entered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`transition-all duration-1000 ${entered ? 'scale-100 rotate-0' : 'scale-50 rotate-12'}`} style={{ transitionDelay: '0.2s', transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              <Logo size="xl" showText={false} />
            </div>
          </div>
          <h1 className={`small-caps text-2xl font-bold tracking-[3px] mb-1 magic-gradient-text transition-all duration-700 ${entered ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '0.4s' }}>DAMASO FERNANDEZ</h1>
          <p className={`text-umi-gold text-sm tracking-wider uppercase transition-all duration-700 ${entered ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '0.6s' }}>Università Magica Internazionale</p>
        </div>

        <div className="bg-umi-card border border-umi-border rounded-xl p-8">
          <h2 className="text-center text-lg font-bold text-umi-text tracking-wider uppercase mb-6">Accedi al Portale</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-umi-muted mb-2">Email Accademica</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@damaso.edu"
                className="w-full bg-umi-input border border-umi-border rounded-lg px-4 py-3 text-umi-text focus:outline-none focus:border-umi-primary transition-colors"
                required
              />
            </div>

            {isAdminEmail ? (
              <div className="bg-umi-primary/10 border border-umi-primary/30 rounded-lg p-4 text-center">
                <p className="text-umi-primary-light text-sm">Benvenuto, Amministratore.</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-umi-muted">Password</label>
                  <Link to="/recupero" className="text-xs text-umi-primary hover:text-umi-primary-light transition-colors">
                    Password dimenticata?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-4 py-3 text-umi-text focus:outline-none focus:border-umi-primary transition-colors"
                  required={!isAdminEmail}
                />
              </div>
            )}

            {error && (
              <div className="bg-umi-red/10 border border-umi-red/30 rounded-lg p-3 text-center">
                <p className="text-umi-red text-sm">{error}</p>
              </div>
            )}

            <button
              ref={btnRef}
              type="submit"
              className="w-full gradient-primary text-white font-semibold py-3 rounded-lg hover:opacity-90 hover:shadow-lg hover:shadow-umi-primary/30 transition-all tracking-wider relative overflow-hidden group"
            >
              <span className="relative z-10">{submitting ? '✨ Incantesimo...' : '✦ Entra →'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </form>

          <p className="text-center text-sm text-umi-muted mt-6">
            Non hai ancora un account?{' '}
            <Link to="/registrazione" className="text-umi-primary font-semibold hover:text-umi-primary-light transition-colors">
              Registrati
            </Link>
          </p>
        </div>

        {/* DEMO ACCESS */}
        <div className="mt-6 bg-umi-card border border-purple-500/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <span className="text-xl">🔮</span>
            <h3 className="text-sm font-bold text-purple-300 tracking-wider uppercase">Accesso Demo</h3>
          </div>
          <p className="text-center text-xs text-umi-muted mb-4">Esplora il portale completo senza registrazione</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={(e) => { fireMagic(e.currentTarget); const r = loginDemo('admin'); if (r.success) setTimeout(() => navigate('/admin'), 600); }}
              className="py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 relative overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
            >
              <span className="relative z-10">🛡️ Demo Admin</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
            <button
              onClick={(e) => { fireMagic(e.currentTarget); const r = loginDemo('socio'); if (r.success) setTimeout(() => navigate('/socio'), 600); }}
              className="py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 relative overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}
            >
              <span className="relative z-10">🎭 Demo Socio</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-umi-dim mt-6">
          Sistema Protetto da Incantesimi di Livello 7 — Powered by M.A.G.I.
        </p>
      </div>
    </div>
  );
}
