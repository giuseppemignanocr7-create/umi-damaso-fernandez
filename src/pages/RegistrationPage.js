import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Download, Coffee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLES, NATIONALITIES, PHONE_PREFIXES, ROLE_QUOTAS } from '../supabaseClient';

export default function RegistrationPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    nome: '', cognome: '', dataNascita: '', nazionalita: 'Italiana',
    citta: '', cap: '', indirizzo: '',
    ruolo: ROLES[0], prefisso: '+39', cellulare: '',
    email: '', password: '', confermaPassword: '',
  });
  const [foto, setFoto] = useState(null);
  const [acceptStatuto, setAcceptStatuto] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const quota = useMemo(() => ROLE_QUOTAS[form.ruolo] || 0, [form.ruolo]);
  const initials = `${(form.nome?.[0] || '').toUpperCase()}${(form.cognome?.[0] || '').toUpperCase()}` || '??';
  const matricolaPreview = 'DF-XXXX';

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (ev) => setFoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!acceptStatuto || !acceptPrivacy) {
      setError('Devi accettare lo Statuto e il Trattamento Dati.');
      return;
    }
    if (form.password !== form.confermaPassword) {
      setError('Le password non corrispondono.');
      return;
    }
    if (form.password.length < 6) {
      setError('La password deve avere almeno 6 caratteri.');
      return;
    }
    try {
      const result = await register({
        nome: form.nome, cognome: form.cognome, dataNascita: form.dataNascita,
        nazionalita: form.nazionalita, citta: form.citta, cap: form.cap,
        indirizzo: form.indirizzo, ruolo: form.ruolo, prefisso: form.prefisso,
        cellulare: form.cellulare, email: form.email, password: form.password,
        foto,
      });
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Errore di connessione.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-umi-bg flex items-center justify-center p-4">
        <div className="bg-umi-card border border-umi-green rounded-xl p-8 max-w-md text-center">
          <div className="text-5xl mb-4">✨</div>
          <h2 className="text-xl font-bold text-umi-text mb-2">Domanda Inviata!</h2>
          <p className="text-umi-muted mb-6">La tua iscrizione è stata registrata con successo. Puoi ora accedere al portale.</p>
          <Link to="/" className="inline-block gradient-primary text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
            Vai al Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-umi-bg">
      <div className="bg-umi-card border-b border-umi-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-umi-primary flex items-center justify-center font-bold text-white text-sm">UM</div>
          <div>
            <span className="font-bold text-umi-text tracking-wider text-sm uppercase">Nuova Iscrizione</span>
            <p className="text-xs text-umi-muted">Università Magica Damaso Fernandez</p>
          </div>
        </div>
        <Link to="/" className="bg-umi-red/20 text-umi-red border border-umi-red/30 px-4 py-2 rounded-lg text-sm hover:bg-umi-red/30 transition-colors">
          ← Torna al Login
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN FORM - LEFT 2 COLUMNS */}
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
            <div className="flex items-center gap-4">
              <div className="text-umi-gold text-xs mb-2">MATRICOLA: <span className="font-bold">{matricolaPreview}</span></div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-16 h-16 rounded-full bg-umi-orange flex items-center justify-center text-white font-bold text-xl">
                {foto ? <img src={foto} alt="" className="w-full h-full rounded-full object-cover" /> : initials}
              </div>
              <div>
                <p className="text-xs text-emerald-300 uppercase">{form.ruolo || 'Ruolo'}</p>
                <p className="text-white font-bold text-lg">{form.nome || 'Nome'} {form.cognome || 'Cognome'}</p>
              </div>
              <div className="ml-auto w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center text-white/30 text-xs">QR</div>
            </div>
          </div>

          <div className="text-center">
            <label className="cursor-pointer inline-flex items-center gap-2 bg-umi-input border border-umi-border rounded-lg px-4 py-2 text-sm text-umi-muted hover:border-umi-primary transition-colors">
              <Camera size={16} />
              <span>Carica la tua foto</span>
              <input type="file" accept="image/jpeg,image/png" onChange={handleFoto} className="hidden" />
            </label>
            <p className="text-xs text-umi-dim mt-1">Formati supportati: JPG, PNG. Dimensione max 2MB.</p>
          </div>

          {/* DATI PERSONALI */}
          <div className="bg-umi-card border border-umi-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-4 border-b border-umi-border pb-3">Dati Personali</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Nome</label>
                <input type="text" value={form.nome} onChange={handleChange('nome')} required
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Cognome</label>
                <input type="text" value={form.cognome} onChange={handleChange('cognome')} required
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Data di Nascita</label>
                <input type="date" value={form.dataNascita} onChange={handleChange('dataNascita')} required
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
              <div>
                <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Città</label>
                <input type="text" value={form.citta} onChange={handleChange('citta')} required
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">CAP</label>
                <input type="text" value={form.cap} onChange={handleChange('cap')} required
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Via di Residenza</label>
                <input type="text" value={form.indirizzo} onChange={handleChange('indirizzo')} required
                  placeholder="Indirizzo completo (Via/Piazza, n. civico)"
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
              </div>
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
              <div>
                <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Prefisso</label>
                <select value={form.prefisso} onChange={handleChange('prefisso')}
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary">
                  {PHONE_PREFIXES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Cellulare</label>
                <input type="tel" value={form.cellulare} onChange={handleChange('cellulare')} required
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
              </div>
            </div>
          </div>

          {/* ACCESSO PORTALE */}
          <div className="bg-umi-card border border-umi-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-4 border-b border-umi-border pb-3">Accesso Portale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Email Accademica</label>
                <input type="email" value={form.email} onChange={handleChange('email')} required
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Password</label>
                <input type="password" value={form.password} onChange={handleChange('password')} required
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Conferma Password</label>
                <input type="password" value={form.confermaPassword} onChange={handleChange('confermaPassword')} required
                  className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR DESTRA */}
        <div className="space-y-6">
          {/* QUOTA */}
          <div className="bg-umi-card border border-umi-border rounded-xl p-6 text-center">
            <h4 className="text-xs uppercase tracking-wider text-umi-muted mb-3">Quota Iscrizione</h4>
            <p className="text-4xl font-bold text-umi-text mb-4">{quota} EUR</p>
            {quota === 0 ? (
              <div className="gradient-green text-white font-semibold py-3 rounded-lg text-sm">✓ Nulla da pagare</div>
            ) : (
              <button type="button" className="w-full gradient-gold text-white font-semibold py-3 rounded-lg text-sm hover:opacity-90 transition-opacity">
                💳 Paga Adesso
              </button>
            )}
          </div>

          {/* DOWNLOAD */}
          <div className="bg-umi-card border border-umi-border rounded-xl p-6">
            <h4 className="text-xs uppercase tracking-wider text-umi-muted mb-4">Area Download</h4>
            <div className="space-y-3">
              {[
                { label: 'STATUTO UMI', sub: 'Scarica PDF 2024' },
                { label: 'PRIVACY POLICY', sub: 'Scarica PDF 2024' },
                { label: 'TRATTAMENTO DATI', sub: 'Scarica PDF 2024' },
              ].map(doc => (
                <button key={doc.label} type="button" className="w-full flex items-center gap-3 bg-umi-input border border-umi-border rounded-lg px-4 py-3 text-left hover:border-umi-primary transition-colors">
                  <Download size={16} className="text-umi-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-umi-text font-semibold">{doc.label}</p>
                    <p className="text-xs text-umi-dim">{doc.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CHECKBOX */}
          <div className="bg-umi-card border border-umi-border rounded-xl p-6 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={acceptStatuto} onChange={(e) => setAcceptStatuto(e.target.checked)}
                className="mt-1 accent-umi-primary" />
              <span className="text-sm text-umi-text">Accetto lo Statuto UMI.</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={acceptPrivacy} onChange={(e) => setAcceptPrivacy(e.target.checked)}
                className="mt-1 accent-umi-primary" />
              <span className="text-sm text-umi-text">Accetto il Trattamento Dati.</span>
            </label>
          </div>

          {error && (
            <div className="bg-umi-red/10 border border-umi-red/30 rounded-lg p-3 text-center">
              <p className="text-umi-red text-sm">{error}</p>
            </div>
          )}

          {/* SUBMIT */}
          <button type="submit" className="w-full gradient-gold text-white font-bold py-4 rounded-lg hover:opacity-90 transition-opacity tracking-wider text-lg">
            ✨ Invia Domanda
          </button>

          {/* OFFRI UN CAFFE */}
          <div className="bg-umi-card border border-umi-border rounded-xl p-6 text-center">
            <h4 className="text-xs uppercase tracking-wider text-umi-muted mb-3">Aiutaci a Migliorare</h4>
            <button type="button" className="inline-flex items-center gap-2 bg-umi-input border border-umi-border rounded-lg px-4 py-2 text-sm text-umi-text hover:border-umi-gold transition-colors">
              <Coffee size={16} className="text-umi-gold" />
              Offri un caffè
            </button>
            <p className="text-xs text-umi-dim mt-2">Il tuo supporto facoltativo ci aiuta a potenziare le funzioni digitali dell'Accademia.</p>
          </div>
        </div>
      </form>
    </div>
  );
}
