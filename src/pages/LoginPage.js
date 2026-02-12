import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../supabaseClient';
import Logo from '../components/shared/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const isAdminEmail = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = await login(email, isAdminEmail ? '' : password);
      if (result.success) {
        navigate(result.isAdmin ? '/admin' : '/socio');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Errore di connessione.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-umi-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={false} />
          </div>
          <h1 className="small-caps text-2xl font-bold text-umi-text tracking-[3px] mb-1">DAMASO FERNANDEZ</h1>
          <p className="text-umi-gold text-sm tracking-wider uppercase">Università Magica Internazionale</p>
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
              type="submit"
              className="w-full gradient-primary text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity tracking-wider"
            >
              {submitting ? 'Accesso...' : 'Entra →'}
            </button>
          </form>

          <p className="text-center text-sm text-umi-muted mt-6">
            Non hai ancora un account?{' '}
            <Link to="/registrazione" className="text-umi-primary font-semibold hover:text-umi-primary-light transition-colors">
              Registrati
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-umi-dim mt-6">
          Sistema Protetto da Incantesimi di Livello 7
        </p>
      </div>
    </div>
  );
}
