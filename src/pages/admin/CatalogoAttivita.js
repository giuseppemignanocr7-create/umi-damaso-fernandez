import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Upload } from 'lucide-react';
import { TIPOLOGIE_ATTIVITA, MODALITA_ATTIVITA, getPriceForActivity, PAYPAL_EMAIL } from '../../supabaseClient';
import { fetchAttivita, createAttivita } from '../../supabaseStore';

export default function CatalogoAttivita() {
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState('Tutti');
  const [formTab, setFormTab] = useState('dettagli');
  const [form, setForm] = useState({
    titolo: '', tipologia: TIPOLOGIE_ATTIVITA[0], modalita: MODALITA_ATTIVITA[0],
    data: '', durata: '', costo: 0, luogo: '', docenti: [''],
    linkRiunione: '', richiedente: '', emailPaypal: PAYPAL_EMAIL,
    giornoOraLezione: '', immagine: null, descrizione: '',
  });

  const priceRule = useMemo(() => getPriceForActivity(form.tipologia, form.modalita), [form.tipologia, form.modalita]);
  const isFixedPrice = typeof priceRule === 'number';
  const isNA = priceRule === null;
  const effectiveCost = isFixedPrice ? priceRule : (isNA ? null : form.costo);

  const [allAtt, setAllAtt] = useState([]);
  const loadAtt = useCallback(() => { fetchAttivita().then(setAllAtt).catch(() => {}); }, []);
  useEffect(() => { loadAtt(); }, [loadAtt]);

  const filteredAtt = allAtt.filter(a => {
    if (tab === 'Tutti') return true;
    if (tab === 'Futuri') return new Date(a.data) >= new Date();
    if (tab === 'Passati') return new Date(a.data) < new Date();
    if (tab === 'Online') return a.modalita === 'Online / Streaming';
    return true;
  });

  const handleChange = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const addDocente = () => setForm(p => ({ ...p, docenti: [...p.docenti, ''] }));
  const updateDocente = (i, val) => {
    const d = [...form.docenti];
    d[i] = val;
    setForm(p => ({ ...p, docenti: d }));
  };

  const handlePublish = async () => {
    if (!form.titolo) return;
    await createAttivita({
      titolo: form.titolo,
      tipologia: form.tipologia,
      modalita: form.modalita,
      data: form.data || null,
      durata: form.durata,
      costo: effectiveCost || 0,
      luogo: form.luogo,
      docenti: form.docenti.filter(Boolean),
      link_riunione: form.linkRiunione,
      richiedente: form.richiedente,
      email_paypal: form.emailPaypal,
      giorno_ora_lezione: form.giornoOraLezione || null,
      descrizione: form.descrizione,
      pubblicata: true,
    });
    setShowForm(false);
    setForm({
      titolo: '', tipologia: TIPOLOGIE_ATTIVITA[0], modalita: MODALITA_ATTIVITA[0],
      data: '', durata: '', costo: 0, luogo: '', docenti: [''],
      linkRiunione: '', richiedente: '', emailPaypal: PAYPAL_EMAIL,
      giornoOraLezione: '', immagine: null, descrizione: '',
    });
    loadAtt();
  };

  const showLezioneFields = form.tipologia === 'Lezione' && form.modalita === 'In Presenza';
  const showOnlineFields = form.modalita === 'Online / Streaming';

  if (showForm) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Nuova Attività</h1>
          </div>
          <button onClick={handlePublish} className="gradient-gold text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Upload size={16} /> Pubblica Attività
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setFormTab('dettagli')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${formTab === 'dettagli' ? 'bg-umi-primary text-white' : 'bg-umi-card text-umi-muted border border-umi-border'}`}>
            Dettagli & Logistica
          </button>
          <button onClick={() => setFormTab('contenuti')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${formTab === 'contenuti' ? 'bg-umi-primary text-white' : 'bg-umi-card text-umi-muted border border-umi-border'}`}>
            Contenuti & Media
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {formTab === 'dettagli' ? (
              <>
                <div className="bg-umi-card border border-umi-border rounded-xl p-6 space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Titolo Attività</label>
                    <input type="text" value={form.titolo} onChange={handleChange('titolo')} placeholder="es. Pozioni Avanzate"
                      className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Tipologia</label>
                      <select value={form.tipologia} onChange={handleChange('tipologia')}
                        className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary">
                        {TIPOLOGIE_ATTIVITA.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Modalità</label>
                      <select value={form.modalita} onChange={handleChange('modalita')}
                        className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary">
                        {MODALITA_ATTIVITA.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>

                  {isNA && (
                    <div className="bg-umi-red/10 border border-umi-red/30 rounded-lg p-3 text-umi-red text-sm text-center">
                      Questa combinazione tipologia/modalità non è disponibile.
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Data</label>
                      <input type="datetime-local" value={form.data} onChange={handleChange('data')}
                        className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Durata / Info</label>
                      <input type="text" value={form.durata} onChange={handleChange('durata')} placeholder="es. 2 ore"
                        className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Costo (€)</label>
                    {isFixedPrice ? (
                      <div className="bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-gold text-sm font-bold">
                        €{priceRule} {priceRule === 0 ? '(GRATIS)' : '(FISSO)'}
                      </div>
                    ) : isNA ? (
                      <div className="bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-red text-sm">N/A</div>
                    ) : (
                      <input type="number" min="0" value={form.costo} onChange={handleChange('costo')} placeholder="Inserisci importo"
                        className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
                    )}
                  </div>

                  {showLezioneFields && (
                    <>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Giorno e Ora Lezione</label>
                        <input type="datetime-local" value={form.giornoOraLezione} onChange={handleChange('giornoOraLezione')}
                          className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Il Richiedente la Lezione</label>
                        <input type="text" value={form.richiedente} onChange={handleChange('richiedente')} placeholder="Nome e Cognome del richiedente"
                          className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Email PayPal per l'acquisto</label>
                        <input type="email" value={form.emailPaypal} onChange={handleChange('emailPaypal')}
                          className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
                      </div>
                    </>
                  )}

                  {showOnlineFields && (
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Link Riunione</label>
                      <input type="url" value={form.linkRiunione} onChange={handleChange('linkRiunione')} placeholder="https://zoom.us/..."
                        className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
                    </div>
                  )}
                </div>

                <div className="bg-umi-card border border-umi-border rounded-xl p-6">
                  <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-4">Luogo & Docenti</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Luogo / Aula</label>
                      <input type="text" value={form.luogo} onChange={handleChange('luogo')} placeholder="Aula Magna, Torre Ovest"
                        className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Docenti</label>
                      {form.docenti.map((d, i) => (
                        <input key={i} type="text" value={d} onChange={(e) => updateDocente(i, e.target.value)}
                          placeholder="Nome docente"
                          className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary mb-2" />
                      ))}
                      <button type="button" onClick={addDocente} className="text-xs text-umi-primary hover:text-umi-primary-light">+ Aggiungi docente</button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-umi-card border border-umi-border rounded-xl p-6">
                <h3 className="text-sm font-bold text-umi-text tracking-wider uppercase mb-4">Contenuti & Media</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Descrizione</label>
                    <textarea value={form.descrizione} onChange={handleChange('descrizione')} rows={4} placeholder="Descrizione dell'attività..."
                      className="w-full bg-umi-input border border-umi-border rounded-lg px-3 py-2 text-umi-text text-sm focus:outline-none focus:border-umi-primary resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-umi-muted mb-1">Immagine (opzionale)</label>
                    <div className="border-2 border-dashed border-umi-border rounded-lg p-8 text-center hover:border-umi-primary transition-colors">
                      <p className="text-umi-dim text-sm">Trascina un'immagine o clicca per caricare</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR - PREVIEW */}
          <div className="space-y-4">
            <div className="bg-umi-card border border-umi-border rounded-xl overflow-hidden">
              <div className="h-32 bg-umi-input flex items-center justify-center text-3xl">🎓</div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full">{form.tipologia}</span>
                  <span className="text-xs text-umi-gold font-bold">
                    {effectiveCost === null ? 'N/A' : effectiveCost === 0 ? 'GRATIS' : `€${effectiveCost}`}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-umi-text mb-1">{form.titolo || 'Titolo attività'}</h3>
                <p className="text-xs text-umi-muted">{form.data || 'Data e ora'}</p>
                <p className="text-xs text-umi-dim">{form.luogo || (showOnlineFields ? 'Online Streaming' : 'Luogo')}</p>
                <div className="flex gap-2 mt-3">
                  {effectiveCost > 0 ? (
                    <button className="flex-1 gradient-gold text-white text-xs font-semibold py-2 rounded-lg">PAGA ORA</button>
                  ) : (
                    <>
                      <button className="flex-1 gradient-primary text-white text-xs font-semibold py-2 rounded-lg">Iscriviti</button>
                      <button className="flex-1 bg-umi-input border border-umi-border text-umi-muted text-xs py-2 rounded-lg">Info</button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-umi-dim text-center">Questa card è un'anteprima di come lo studente visualizzerà l'attività nel catalogo.</p>
            <button onClick={() => setShowForm(false)} className="w-full bg-umi-input border border-umi-border text-umi-muted py-2 rounded-lg text-sm hover:border-umi-primary transition-colors">
              ← Annulla
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-umi-text tracking-wider uppercase">Catalogo Attività</h1>
          <p className="text-umi-muted text-sm">Gestisci corsi, lezioni ed eventi accademici.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="gradient-primary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={16} /> Nuova Attività
        </button>
      </div>

      <div className="flex gap-2 my-6">
        {['Tutti', 'Futuri', 'Passati', 'Online'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t ? 'bg-umi-primary text-white' : 'bg-umi-card text-umi-muted border border-umi-border hover:border-umi-primary'}`}>
            {t}
          </button>
        ))}
      </div>

      {filteredAtt.length === 0 ? (
        <div className="bg-umi-card border border-umi-border rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-umi-muted text-sm">Nessuna attività trovata con i filtri correnti.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAtt.map(att => (
            <div key={att.id} className="bg-umi-card border border-umi-border rounded-xl overflow-hidden card-hover">
              <div className="h-32 bg-umi-input flex items-center justify-center text-3xl">🎓</div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-umi-primary/20 text-umi-primary-light px-2 py-0.5 rounded-full">{att.tipologia}</span>
                  <span className="text-xs text-umi-gold font-bold">{att.costo === 0 ? 'GRATIS' : `€${att.costo}`}</span>
                </div>
                <h3 className="text-sm font-bold text-umi-text mb-1">{att.titolo}</h3>
                <p className="text-xs text-umi-muted">{att.data}</p>
                <p className="text-xs text-umi-dim">{att.luogo || att.modalita}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
