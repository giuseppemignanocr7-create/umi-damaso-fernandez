import React, { useState } from 'react';
import { Search, Calendar, BookOpen, Award, Star, ChevronDown, ChevronUp } from 'lucide-react';

const TIMELINE = [
  { anno: 1947, titolo: 'Fondazione dell\'Accademia', desc: 'Il Maestro Damaso Fernandez fonda l\'Accademia di Arti Magiche a Roma, con l\'intento di preservare e tramandare l\'antica arte dell\'illusionismo italiano. I primi 12 soci fondatori si riuniscono nella storica Sala dei Misteri.', tipo: 'fondazione', icona: '🏛️' },
  { anno: 1952, titolo: 'Primo Congresso Nazionale', desc: 'Si tiene il primo Congresso Nazionale dell\'Accademia a Firenze. 47 maghi da tutta Italia si riuniscono per tre giorni di spettacoli, conferenze e scambio di sapere. Nasce il motto: "Ars Magica Aeterna".', tipo: 'evento', icona: '🎪' },
  { anno: 1958, titolo: 'Apertura della Biblioteca Arcana', desc: 'Viene inaugurata la Biblioteca Arcana, primo archivio dedicato alla letteratura magica in Italia. La collezione iniziale conta 340 volumi, tra cui manoscritti rari del XVIII secolo e pergamene inedite.', tipo: 'cultura', icona: '📚' },
  { anno: 1963, titolo: 'Prima Partecipazione FISM', desc: 'Una delegazione di 5 maghi rappresenta l\'Accademia al Congresso Mondiale FISM a Barcellona. Giovanni Rosetti vince la medaglia d\'argento nella categoria Manipolazione.', tipo: 'premio', icona: '🏆' },
  { anno: 1971, titolo: 'Creazione dell\'Albo d\'Oro', desc: 'Viene istituito l\'Albo d\'Oro per onorare i maestri che hanno contribuito in modo eccezionale all\'arte magica. I primi 5 nomi incisi sono quelli dei soci fondatori ancora in vita.', tipo: 'istituzione', icona: '✨' },
  { anno: 1978, titolo: 'Trasformazione in Università', desc: 'L\'Accademia diventa ufficialmente "Università della Magia Italiana – Damaso Fernandez". Vengono introdotti percorsi formativi strutturati: Corso Base, Corso Avanzato e Masterclass.', tipo: 'fondazione', icona: '🎓' },
  { anno: 1985, titolo: 'Grand Prix Europeo a Londra', desc: 'Il socio Marco Bellini vince il Grand Prix al Congresso Europeo di Magia a Londra con il suo numero "L\'Orologio del Tempo". L\'UMI raggiunge fama internazionale.', tipo: 'premio', icona: '🥇' },
  { anno: 1990, titolo: 'Apertura sede di Milano', desc: 'Viene inaugurata la seconda sede dell\'UMI a Milano, espandendo la portata dell\'università al nord Italia. 120 nuovi soci si iscrivono nel primo anno.', tipo: 'espansione', icona: '🏢' },
  { anno: 1997, titolo: 'Cinquantenario: Gala delle Meraviglie', desc: 'Per il 50° anniversario si tiene il "Gala delle Meraviglie" al Teatro Argentina di Roma. 500 ospiti, 20 artisti internazionali e la prima diretta televisiva di un evento UMI.', tipo: 'evento', icona: '🎭' },
  { anno: 2003, titolo: 'Era Digitale: primo sito web', desc: 'L\'UMI entra nell\'era digitale con il primo sito web ufficiale. Viene lanciata la newsletter mensile "Il Mago Moderno" che raggiunge 2.000 abbonati nel primo anno.', tipo: 'tecnologia', icona: '💻' },
  { anno: 2010, titolo: 'Campus Online Internazionale', desc: 'Nasce il Campus Online, piattaforma di e-learning che porta le lezioni UMI in tutto il mondo. Studenti da 23 paesi si iscrivono ai corsi di Cartomagia, Mentalismo e Close-up.', tipo: 'tecnologia', icona: '🌐' },
  { anno: 2015, titolo: 'Partnership con FISM Italia', desc: 'L\'UMI diventa partner ufficiale della FISM Italia. I soci UMI ricevono accesso privilegiato ai congressi internazionali e programmi di scambio con accademie estere.', tipo: 'istituzione', icona: '🤝' },
  { anno: 2020, titolo: 'Resilienza: la Magia non si ferma', desc: 'Durante la pandemia, l\'UMI trasferisce tutte le attività online. Nascono i "Venerdì Magici": sessioni settimanali in streaming con maestri internazionali. Record di 800 partecipanti simultanei.', tipo: 'evento', icona: '🔮' },
  { anno: 2024, titolo: 'Inaugurazione del Portale MAGI', desc: 'Viene lanciato il nuovo portale digitale dell\'UMI con l\'intelligenza artificiale MAGI (Magical Artificial General Intelligence). Un assistente magico che guida soci e visitatori.', tipo: 'tecnologia', icona: '🤖' },
  { anno: 2026, titolo: 'Presente: l\'UMI oggi', desc: 'L\'Università conta oltre 500 soci attivi in Italia e nel mondo. Il catalogo include masterclass, congressi, viaggi studi e una biblioteca di oltre 1.200 volumi digitali.', tipo: 'presente', icona: '⚡' },
];

const DOCUMENTI_STORICI = [
  { id: 'd1', titolo: 'Atto Fondativo dell\'Accademia', anno: 1947, tipo: 'Pergamena', desc: 'Documento originale firmato dai 12 soci fondatori, con il sigillo dell\'Accademia e il motto "Ars Magica Aeterna".', icona: '📜' },
  { id: 'd2', titolo: 'Statuto dell\'Università (Revisione 1978)', anno: 1978, tipo: 'Documento', desc: 'Lo statuto aggiornato che ha trasformato l\'Accademia in Università, definendo ruoli, percorsi formativi e struttura organizzativa.', icona: '📋' },
  { id: 'd3', titolo: 'Registro dei Soci Fondatori', anno: 1947, tipo: 'Registro', desc: 'Il primo registro con i nomi, le firme e le specializzazioni dei 12 maghi che hanno dato vita all\'istituzione.', icona: '📖' },
  { id: 'd4', titolo: 'Catalogo della Biblioteca Arcana', anno: 1958, tipo: 'Catalogo', desc: 'L\'inventario originale dei 340 volumi della prima Biblioteca Arcana, con annotazioni a mano del bibliotecario Maestro Verdini.', icona: '📚' },
  { id: 'd5', titolo: 'Manifesto "Il Mago del Futuro"', anno: 1971, tipo: 'Manifesto', desc: 'Il celebre manifesto scritto da Damaso Fernandez sulla visione futura della magia, considerato un testo fondamentale dell\'illusionismo moderno.', icona: '✒️' },
  { id: 'd6', titolo: 'Album Fotografico: 50 Anni di Meraviglie', anno: 1997, tipo: 'Album', desc: 'Raccolta di 200 fotografie storiche dal 1947 al 1997, dai primi spettacoli ai grandi congressi internazionali.', icona: '📸' },
  { id: 'd7', titolo: 'Lettera di Riconoscimento FISM', anno: 2015, tipo: 'Lettera', desc: 'Lettera ufficiale della FISM che riconosce l\'UMI come istituzione di eccellenza per la formazione magica in Europa.', icona: '✉️' },
  { id: 'd8', titolo: 'Archivio Digitale: Programmi dei Congressi', anno: 2003, tipo: 'Archivio', desc: 'Raccolta digitalizzata di tutti i programmi dei congressi nazionali dal 1952 al 2003, con elenco artisti e abstract delle conferenze.', icona: '💾' },
];

const MAESTRI_LEGGENDARI = [
  { nome: 'Damaso Fernandez', ruolo: 'Fondatore', anni: '1947–1989', specialita: 'Grandi Illusioni, Mentalismo', desc: 'Visionario fondatore dell\'Accademia. Ha dedicato la sua vita alla formazione di nuove generazioni di illusionisti.', icona: '👑' },
  { nome: 'Giovanni Rosetti', ruolo: 'Maestro Emerito', anni: '1947–1975', specialita: 'Manipolazione, Close-up', desc: 'Primo medagliato internazionale UMI. Le sue tecniche di manipolazione sono ancora insegnate oggi.', icona: '🃏' },
  { nome: 'Elena Verdini', ruolo: 'Bibliotecaria Arcana', anni: '1958–1995', specialita: 'Storia della Magia, Ricerca', desc: 'Ha curato la Biblioteca Arcana per quasi 40 anni, catalogando oltre 1.200 testi e pergamene rare.', icona: '📖' },
  { nome: 'Marco Bellini', ruolo: 'Campione Europeo', anni: '1980–presente', specialita: 'Illusionismo Scenico', desc: 'Grand Prix al Congresso Europeo 1985. Il suo numero "L\'Orologio del Tempo" è diventato un classico.', icona: '🏆' },
  { nome: 'Sofia Rinaldi', ruolo: 'Direttrice Campus Online', anni: '2010–presente', specialita: 'Mentalismo, Didattica Digitale', desc: 'Ha rivoluzionato la formazione UMI portandola online e raggiungendo studenti in 23 paesi.', icona: '🌐' },
];

export default function RegistriAntichi() {
  const [tab, setTab] = useState('timeline');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const filteredTimeline = TIMELINE.filter(t =>
    !search || t.titolo.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()) || t.anno.toString().includes(search)
  );
  const filteredDocs = DOCUMENTI_STORICI.filter(d =>
    !search || d.titolo.toLowerCase().includes(search.toLowerCase()) || d.desc.toLowerCase().includes(search.toLowerCase())
  );
  const filteredMaestri = MAESTRI_LEGGENDARI.filter(m =>
    !search || m.nome.toLowerCase().includes(search.toLowerCase()) || m.specialita.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { key: 'timeline', label: 'Cronologia Storica', icon: <Calendar size={14} /> },
    { key: 'documenti', label: 'Documenti Antichi', icon: <BookOpen size={14} /> },
    { key: 'maestri', label: 'Maestri Leggendari', icon: <Award size={14} /> },
  ];

  const tipoColors = {
    fondazione: 'border-umi-gold/50 bg-umi-gold/5',
    evento: 'border-umi-primary/50 bg-umi-primary/5',
    cultura: 'border-blue-500/50 bg-blue-500/5',
    premio: 'border-yellow-500/50 bg-yellow-500/5',
    istituzione: 'border-umi-green/50 bg-umi-green/5',
    espansione: 'border-cyan-500/50 bg-cyan-500/5',
    tecnologia: 'border-purple-500/50 bg-purple-500/5',
    presente: 'border-umi-primary/50 bg-umi-primary/10',
  };

  return (
    <div className="magic-fade-in">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3 magic-float">📜</div>
        <h1 className="text-2xl font-bold tracking-wider uppercase mb-2 magic-gradient-text">Registri Antichi</h1>
        <p className="text-umi-muted text-sm max-w-lg mx-auto">L'archivio storico dell'Università della Magia Italiana – Damaso Fernandez. Secoli di sapere, tradizione e meraviglia.</p>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 justify-center">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${tab === t.key ? 'bg-umi-primary text-white shadow-lg shadow-umi-primary/20' : 'bg-umi-card text-umi-muted border border-umi-border hover:border-umi-primary'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="relative mb-6 max-w-md mx-auto">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-umi-dim" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cerca nell'archivio storico..."
          className="w-full bg-umi-input border border-umi-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-umi-text focus:outline-none focus:border-umi-primary" />
      </div>

      {/* TIMELINE TAB */}
      {tab === 'timeline' && (
        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-umi-border" />
          <div className="space-y-6 magic-stagger">
            {filteredTimeline.map((event, i) => (
              <div key={event.anno} className={`relative flex items-start gap-4 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="hidden md:block md:w-1/2" />
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full bg-umi-primary border-4 border-umi-bg z-10 magic-sparkle" />
                <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className={`rounded-xl p-4 border cursor-pointer transition-all magic-glow ${tipoColors[event.tipo] || 'border-umi-border bg-umi-card'}`}
                    onClick={() => toggle(event.anno)}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{event.icona}</span>
                      <span className="text-xs font-bold text-umi-gold bg-umi-gold/10 px-2 py-0.5 rounded-full">{event.anno}</span>
                    </div>
                    <h3 className="text-sm font-bold text-umi-text mb-1">{event.titolo}</h3>
                    <p className={`text-xs text-umi-muted leading-relaxed ${expanded[event.anno] ? '' : 'line-clamp-2'}`}>{event.desc}</p>
                    <button className="text-[10px] text-umi-primary mt-1 flex items-center gap-0.5">
                      {expanded[event.anno] ? <><ChevronUp size={10} /> Meno</> : <><ChevronDown size={10} /> Leggi tutto</>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredTimeline.length === 0 && (
            <div className="text-center py-12 text-umi-muted text-sm">Nessun evento trovato per "{search}"</div>
          )}
        </div>
      )}

      {/* DOCUMENTI TAB */}
      {tab === 'documenti' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 magic-stagger">
          {filteredDocs.map(doc => (
            <div key={doc.id} className="bg-umi-card border border-umi-border rounded-xl p-5 card-magic magic-glow cursor-pointer" onClick={() => toggle(doc.id)}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-umi-gold/10 flex items-center justify-center text-2xl shrink-0 magic-shimmer">{doc.icona}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-umi-gold font-bold">{doc.anno}</span>
                    <span className="text-[10px] bg-umi-primary/20 text-umi-primary-light px-1.5 py-0.5 rounded-full">{doc.tipo}</span>
                  </div>
                  <h3 className="text-sm font-bold text-umi-text mb-1">{doc.titolo}</h3>
                  <p className={`text-xs text-umi-muted leading-relaxed ${expanded[doc.id] ? '' : 'line-clamp-2'}`}>{doc.desc}</p>
                </div>
              </div>
            </div>
          ))}
          {filteredDocs.length === 0 && (
            <div className="col-span-2 text-center py-12 text-umi-muted text-sm">Nessun documento trovato.</div>
          )}
        </div>
      )}

      {/* MAESTRI TAB */}
      {tab === 'maestri' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 magic-stagger">
          {filteredMaestri.map((m, i) => (
            <div key={i} className="bg-umi-card border border-umi-gold/20 rounded-xl p-5 card-magic magic-glow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-umi-gold/15 flex items-center justify-center text-2xl">{m.icona}</div>
                <div>
                  <h3 className="text-sm font-bold text-umi-gold">{m.nome}</h3>
                  <p className="text-[10px] text-umi-primary-light">{m.ruolo}</p>
                </div>
              </div>
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-[10px] text-umi-muted"><Calendar size={10} className="text-umi-dim" /> {m.anni}</div>
                <div className="flex items-center gap-2 text-[10px] text-umi-muted"><Star size={10} className="text-umi-gold" /> {m.specialita}</div>
              </div>
              <p className="text-xs text-umi-muted leading-relaxed">{m.desc}</p>
            </div>
          ))}
          {filteredMaestri.length === 0 && (
            <div className="col-span-3 text-center py-12 text-umi-muted text-sm">Nessun maestro trovato.</div>
          )}
        </div>
      )}

      {/* FOOTER STATS */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 magic-stagger">
        {[
          { icona: '📜', label: 'Anni di Storia', valore: '79' },
          { icona: '📚', label: 'Documenti Archiviati', valore: String(DOCUMENTI_STORICI.length) },
          { icona: '🏆', label: 'Premi Internazionali', valore: '23' },
          { icona: '👑', label: 'Maestri Leggendari', valore: String(MAESTRI_LEGGENDARI.length) },
        ].map((s, i) => (
          <div key={i} className="bg-umi-card border border-umi-border rounded-xl p-4 text-center magic-glow">
            <div className="text-2xl mb-1">{s.icona}</div>
            <p className="text-lg font-bold text-umi-gold">{s.valore}</p>
            <p className="text-[10px] text-umi-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
