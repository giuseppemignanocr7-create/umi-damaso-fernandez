import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit3 } from 'lucide-react';

export default function RecoveryPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-umi-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-umi-primary mx-auto flex items-center justify-center mb-4 relative">
            <span className="text-white font-bold text-xl">UM</span>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-umi-gold flex items-center justify-center">
              <Edit3 size={12} className="text-white" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-umi-text tracking-wider uppercase mb-2">Recupero Accesso</h1>
        </div>

        <div className="bg-umi-card border border-umi-border rounded-xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-4xl mb-4">✉️</div>
              <p className="text-umi-text mb-2">Email inviata!</p>
              <p className="text-umi-muted text-sm">Se l'indirizzo è registrato, riceverai le istruzioni per reimpostare la password.</p>
            </div>
          ) : (
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
              <button
                type="submit"
                className="w-full gradient-primary text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity tracking-wider"
              >
                Invia →
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-umi-primary hover:text-umi-primary-light transition-colors">
              ← Torna al Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
