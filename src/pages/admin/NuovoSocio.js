import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { ROLES, NATIONALITIES, PHONE_PREFIXES } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function NuovoSocio() {
  const [form, setForm] = useState({
    nome: '', cognome: '', dataNascita: '', nazionalita: 'Italiana',
    citta: '', cap: '', indirizzo: '',
    ruolo: ROLES[0], prefisso: '+39', cellulare: '',
    email: '', password: '',
  });
  const [foto, setFoto] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (ev) => setFoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const initials = `${(form.nome?.[0] || '').toUpperCase()}${(form.cognome?.[0] || '').toUpperCase()}` || '??';

  const { registerOmaggio } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.nome || !form.cognome || !form.email) {
      setError('Compila tutti i campi obbligatori.');
      return;
    }
    const pwd = form.password || 'omaggio2026!';
    try {
      const result = await registerOmaggio({ ...form, password: pwd, foto });
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setForm({
            nome: '', cognome: '', dataNascita: '', nazionalita: 'Italiana',
            citta: '', cap: '', indirizzo: '',
            ruolo: ROLES[0], prefisso: '+39', cellulare: '',
            email: '', password: '',
          });
          setFoto(null);
        }, 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Errore durante la registrazione.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase mb-1">Nuovo Socio (Omaggio)</h1>
      <p className="text-umi-muted text-sm mb-6">L'inserimento diretto da amministratore non prevede costi di iscrizione.</p>

      {success && (
        <div className="bg-umi-green/10 border border-umi-green/30 rounded-xl p-4 mb-6 text-center">
          <p className="text-umi-green font-semibold">✓ Socio registrato con successo!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* TESSERA PREVIEW */}
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 border-2 border-umi-gold rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">UM</div>
                <span className="text-white text-sm font-bold tracking-wider">UMI DAMASO FERNANDEZ</span>
              </div>
              <span className="text-umi-gold text-xs">VALIDA FINO AL 31/12/2026</span>
            </div>
            <div className="text-umi-gold text-xs mb-2">MATRICOLA: <span className="font-bold">DF-XXXX</span></div>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-14 h-14 rounded-full bg-umi-orange flex items-center justify-center text-white font-bold text-lg">
                {foto ? <img src={foto} alt="" className="w-full h-full rounded-full object-cover" /> : initials}
              </div>
              <div>
                <p className="text-xs text-emerald-300 uppercase">{form.ruolo || 'Ruolo'}</p>
                <p className="text-white font-bold">{form.nome || 'Nome'} {form.cognome || 'Cognome'}</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <label className="cursor-pointer inline-flex items-center gap-2 bg-umi-input border border-umi-border rounded-lg px-4 py-2 text-sm text-umi-muted hover:border-umi-primary transition-colors">
              <Camera size={16} />
              <span>Carica foto</span>
              <input type="file" accept="image/jpeg,image/png" onChange={handleFoto} className="hidden" />
            </label>
          </div>

          {/* DATI PERSONALI */}
          <div className="bg-umi-card border border-umi-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-4 border-b border-umi-border pb-3">Dati Personali</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Nome *</label>
                <input type="text" value={form.nome} onChange={handleChange('nome')} required
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Cognome *</label>
                <input type="text" value={form.cognome} onChange={handleChange('cognome')} required
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Data di Nascita</label>
                <input type="date" value={form.dataNascita} onChange={handleChange('dataNascita')}
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Nazionalità</label>
                <select value={form.nazionalita} onChange={handleChange('nazionalita')}
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary">
                  {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* RESIDENZA */}
          <div className="bg-umi-card border border-umi-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-4 border-b border-umi-border pb-3">Residenza</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Città</label>
                <input type="text" value={form.citta} onChange={handleChange('citta')}
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" /></div>
              <div><label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">CAP</label>
                <input type="text" value={form.cap} onChange={handleChange('cap')}
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" /></div>
              <div className="md:col-span-2"><label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Via di Residenza</label>
                <input type="text" value={form.indirizzo} onChange={handleChange('indirizzo')} placeholder="Indirizzo completo (Via/Piazza, n. civico)"
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" /></div>
            </div>
          </div>

          {/* RUOLO E RECAPITI */}
          <div className="bg-umi-card border border-umi-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-4 border-b border-umi-border pb-3">Ruolo e Recapiti</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Ruolo Accademico</label>
                <select value={form.ruolo} onChange={handleChange('ruolo')}
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary">
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div><label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Prefisso</label>
                <select value={form.prefisso} onChange={handleChange('prefisso')}
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary">
                  {PHONE_PREFIXES.map(p => <option key={p} value={p}>{p}</option>)}
                </select></div>
              <div><label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Cellulare</label>
                <input type="tel" value={form.cellulare} onChange={handleChange('cellulare')}
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" /></div>
            </div>
          </div>

          {/* ACCESSO PORTALE */}
          <div className="bg-umi-card border border-umi-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-4 border-b border-umi-border pb-3">Accesso Portale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Email *</label>
                <input type="email" value={form.email} onChange={handleChange('email')} required
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" /></div>
              <div><label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Password</label>
                <input type="password" value={form.password} onChange={handleChange('password')} placeholder="Default: omaggio2026"
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" /></div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-umi-card border border-umi-red/30 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">❤️</div>
            <h4 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-2">Iscrizione Omaggio</h4>
            <p className="text-xs text-umi-muted">Questa iscrizione è gestita manualmente dall'amministratore e non prevede versamenti di quote nel portale.</p>
          </div>

          {error && (
            <div className="bg-umi-red/10 border border-umi-red/30 rounded-lg p-3 text-center">
              <p className="text-umi-red text-sm">{error}</p>
            </div>
          )}

          <button type="submit" className="w-full gradient-gold text-white font-bold py-4 rounded-lg hover:opacity-90 transition-opacity tracking-wider">
            ✨ Registra Socio
          </button>
        </div>
      </form>
    </div>
  );
}
