import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MAGI_RESPONSES = {
  greeting: [
    '✨ Benvenuto nel Portale UMI! Sono MAGI, la tua assistente magica. Posso navigare l\'app per te, darti informazioni o guidarti. Cosa desideri?',
    '🔮 Salve, Mago! MAGI al tuo servizio. Chiedimi qualsiasi cosa: posso portarti in qualsiasi sezione, spiegarti le funzionalità o raccontarti la storia dell\'UMI.',
  ],
  soci: [
    '👥 La sezione Soci gestisce tutti gli iscritti. Puoi filtrare per stato (Attivo/Sospeso/Scaduto), cercare per nome o matricola, cambiare stato e aggiungere nuovi soci.\n\n💡 Dì "vai ai soci" per aprire la pagina.',
  ],
  attivita: [
    '📋 Il Catalogo gestisce corsi, masterclass, congressi e oggettistica. Ogni attività ha prezzo automatico per tipologia e modalità. Ci sono lezioni gratuite e a pagamento.\n\n💡 Dì "vai al catalogo" per gestire le attività.',
  ],
  biblioteca: [
    '📚 La Biblioteca Virtuale contiene testi, dispense e pergamene accademiche. Puoi cercare per titolo, autore o categoria. Ogni documento è consultabile con un click.\n\n💡 Dì "vai alla biblioteca" per esplorare.',
  ],
  videoteca: [
    '🎬 La Videoteca contiene lezioni magistrali, seminari, tutorial e highlights dei congressi. Filtra per categoria e cerca per titolo o autore.\n\n💡 Dì "vai alla videoteca" per guardare.',
  ],
  contabilita: [
    '💰 La Contabilità mostra il bilancio completo: uscite per piattaforme e organizzazione, entrate da iscrizioni e acquisti. Include la configurazione PayPal per i pagamenti.\n\n💡 Dì "vai alla contabilità" per i dettagli.',
  ],
  shop: [
    '🛍️ Lo Shop UMI mostra tutte le attività disponibili. I soci possono acquistare corsi e masterclass direttamente online. Ogni acquisto viene registrato automaticamente.\n\n💡 Dì "vai allo shop" per esplorare.',
  ],
  albo: [
    '🏆 L\'Albo d\'Oro raccoglie premi e onorificenze: dal FISM Grand Prix alla Laurea Honoris Causa. Un catalogo dei migliori talenti UMI attraverso i decenni.\n\n💡 Dì "vai all\'albo" per ammirare i campioni.',
  ],
  notifiche: [
    '🔔 Il Centro Notifiche monitora scadenze tessere, pagamenti pendenti, attività imminenti e comunicazioni. Puoi creare, modificare ed eliminare notifiche.\n\n💡 Dì "vai alle notifiche" per gestirle.',
  ],
  media: [
    '🖼️ Il Media Center gestisce foto, attestati e materiale didattico. Puoi visualizzare e scaricare ogni file. Il centro raccoglie ricordi di congressi e eventi.\n\n💡 Dì "vai ai media" per esplorare.',
  ],
  profilo: [
    '👤 Il Profilo mostra i tuoi dati personali, la tessera digitale con QR code, i badge sbloccati, i corsi frequentati e lo storico pagamenti completo.\n\n💡 Dì "vai al profilo" per vederlo.',
  ],
  registri: [
    '📜 I Registri Antichi contengono 79 anni di storia dell\'UMI! Troverai la Cronologia Storica con 15 eventi dal 1947 ad oggi, 8 Documenti Antichi e 5 Maestri Leggendari.\n\n💡 Dì "vai ai registri" per esplorare l\'archivio.',
  ],
  agenda: [
    '📅 L\'Agenda mostra il calendario degli eventi con i prossimi corsi, masterclass e congressi. Naviga per mese e vedi gli eventi in arrivo.\n\n💡 Dì "vai all\'agenda" per consultarla.',
  ],
  corsi: [
    '🎓 I Miei Corsi mostra tutte le attività a cui sei iscritto. Puoi filtrare per futuri/passati/online e iscriverti a nuovi corsi con un click.\n\n💡 Dì "vai ai corsi" per il tuo registro.',
  ],
  pagamenti: [
    '💳 Pagamenti mostra lo storico completo: totale, saldato e pendente. Puoi pagare direttamente le quote pendenti e scaricare le ricevute.\n\n💡 Dì "vai ai pagamenti" per il riepilogo.',
  ],
  help: [
    '🔮 **MAGI può fare tutto questo:**\n\n📍 **Navigazione** — Dì "vai a [sezione]" per aprire qualsiasi pagina\n📊 **Info** — Chiedi di soci, attività, biblioteca, contabilità...\n📜 **Storia** — Chiedi della storia UMI o dei maestri leggendari\n🎩 **Trucchi** — Dì "trucco del giorno" per un segreto magico\n❓ **Aiuto** — Chiedi "cosa puoi fare" per questa lista\n\n**Sezioni disponibili:** Dashboard, Soci, Shop, Biblioteca, Videoteca, Corsi, Albo, Media, Agenda, Pagamenti, Profilo, Registri, Catalogo, Contabilità, Notifiche',
  ],
  magia: [
    '✨ L\'Università della Magia Italiana – Damaso Fernandez è stata fondata nel 1947 a Roma. Il Maestro Fernandez creò l\'Accademia per preservare l\'arte dell\'illusionismo italiano.\n\nOggi l\'UMI conta oltre 500 soci attivi con masterclass, congressi internazionali, viaggi studi e una biblioteca di 1.200+ volumi.\n\n💡 Dì "vai ai registri" per esplorare 79 anni di storia!',
    '🎩 Damaso Fernandez (1912–1989) fu un pioniere dell\'illusionismo italiano. Fondò l\'Accademia nel 1947 con 12 soci. Il motto "Ars Magica Aeterna" guida ancora oggi la missione UMI.\n\nNel 1978 l\'Accademia divenne Università, introducendo corsi strutturati. Nel 2024 è nato il portale MAGI che stai usando ora!',
  ],
  trick: [
    '🎩 **Trucco del Giorno: Il Mazzo Telepatico**\nFai scegliere una carta a un volontario. Mentre lui la guarda, dì: "Sto leggendo la tua mente...". In realtà, prima di dare il mazzo hai sbirciato la carta in fondo. Quando il volontario rimette la carta, fai un taglio. La sua carta sarà accanto a quella che conosci!\n\n*"La magia non è nell\'inganno, è nella meraviglia." — D. Fernandez*',
    '🃏 **Trucco del Giorno: La Moneta che Attraversa il Tavolo**\nMetti una moneta sul tavolo, coprila con la mano. Con l\'altra mano batti sotto il tavolo. Togli la mano dal tavolo: la moneta è sparita! Il segreto: lasciala scivolare nel grembo durante il gesto di copertura.\n\n*"Ogni illusione è una storia raccontata con le mani." — G. Rosetti*',
    '✨ **Trucco del Giorno: La Carta Acrobata**\nMostra una carta a faccia in su sul palmo. Chiudi lentamente la mano e riaprila: la carta si è girata a faccia in giù! Il segreto: mentre chiudi la mano, usa il pollice per capovolgere la carta con un movimento impercettibile.\n\n*"Il segreto non è nel trucco, è nella presentazione." — M. Bellini*',
    '🔮 **Trucco del Giorno: Previsione Infallibile**\nPrima dello spettacolo, scrivi "37" su un foglio e sigillalo. Chiedi al pubblico: "Pensate a un numero tra 1 e 50, entrambe le cifre dispari e diverse." L\'80% delle persone pensa 37! Apri la busta.\n\n*"Il mentalista non legge la mente, guida il pensiero." — S. Rinaldi*',
  ],
  curiosita: [
    '💡 **Lo sapevi?** Il termine "prestigiatore" viene dal latino "praestigiae" (illusioni). In italiano antico significava "chi fa le prestigi", cioè meraviglie.',
    '💡 **Lo sapevi?** Il primo libro di magia stampato risale al 1584: "The Discoverie of Witchcraft" di Reginald Scot, che svelava i trucchi per combattere la superstizione.',
    '💡 **Lo sapevi?** Harry Houdini non era il suo vero nome. Si chiamava Erik Weisz ed era nato in Ungheria nel 1874. Scelse "Houdini" in onore del mago francese Robert-Houdin.',
    '💡 **Lo sapevi?** La FISM (Fédération Internationale des Sociétés Magiques) è stata fondata nel 1948, solo un anno dopo l\'UMI! Il congresso mondiale si tiene ogni 3 anni.',
  ],
  default: [
    '🔮 Domanda interessante! Posso aiutarti con:\n• **Navigazione** — "vai a [sezione]"\n• **Informazioni** — chiedi di qualsiasi area\n• **Trucchi** — "trucco del giorno"\n• **Storia UMI** — "registri" o "storia"\n\nProva a riformulare o chiedi "aiuto" per la lista completa!',
  ],
};

const NAV_MAP = {
  dashboard: '/socio', home: '/socio',
  shop: '/socio/shop', negozio: '/socio/shop', acquisti: '/socio/shop',
  biblioteca: '/socio/biblioteca', libri: '/socio/biblioteca',
  videoteca: '/socio/videoteca', video: '/socio/videoteca',
  corsi: '/socio/corsi', 'miei corsi': '/socio/corsi', lezioni: '/socio/corsi',
  albo: '/socio/albo', 'albo d\'oro': '/socio/albo', premi: '/socio/albo', trofei: '/socio/albo',
  media: '/socio/media', foto: '/socio/media', immagini: '/socio/media',
  agenda: '/socio/agenda', calendario: '/socio/agenda', eventi: '/socio/agenda',
  pagamenti: '/socio/pagamenti', ricevute: '/socio/pagamenti',
  profilo: '/socio/profilo', tessera: '/socio/profilo', 'dati personali': '/socio/profilo',
  registri: '/admin/registri', 'registri antichi': '/admin/registri', storia: '/admin/registri', archivio: '/admin/registri',
  soci: '/admin/soci', 'elenco soci': '/admin/soci', iscritti: '/admin/soci',
  catalogo: '/admin/catalogo', attivita: '/admin/catalogo',
  contabilita: '/admin/contabilita', bilancio: '/admin/contabilita',
  notifiche: '/admin/notifiche',
  'nuovo socio': '/admin/nuovo-socio',
};

function getPageContext(pathname) {
  if (pathname.includes('soci') || pathname.includes('nuovo-socio')) return 'soci';
  if (pathname.includes('catalogo') || pathname.includes('attivit')) return 'attivita';
  if (pathname.includes('biblioteca')) return 'biblioteca';
  if (pathname.includes('videoteca')) return 'videoteca';
  if (pathname.includes('contabilita')) return 'contabilita';
  if (pathname.includes('shop')) return 'shop';
  if (pathname.includes('albo')) return 'albo';
  if (pathname.includes('notifiche')) return 'notifiche';
  if (pathname.includes('media')) return 'media';
  if (pathname.includes('profilo')) return 'profilo';
  if (pathname.includes('registri')) return 'registri';
  if (pathname.includes('agenda')) return 'agenda';
  if (pathname.includes('corsi')) return 'corsi';
  if (pathname.includes('pagamenti')) return 'pagamenti';
  return null;
}

function pickResponse(key) {
  const arr = MAGI_RESPONSES[key] || MAGI_RESPONSES.default;
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateResponse(input, pathname) {
  const lower = input.toLowerCase();

  // Navigation commands
  const navMatch = lower.match(/(?:vai|porta|apri|mostra|naviga)\s+(?:a |al |alla |ai |alle |allo )?(.+)/);
  if (navMatch) {
    const dest = navMatch[1].trim().replace(/['"]/g, '');
    for (const [key, path] of Object.entries(NAV_MAP)) {
      if (dest.includes(key) || key.includes(dest)) {
        return `NAV::${path}::✨ Ti porto subito a **${key.charAt(0).toUpperCase() + key.slice(1)}**! Apparecchio...`;
      }
    }
  }

  // Trick of the day
  if (lower.match(/trucco|trick|segreto|effetto|illusione/)) return pickResponse('trick');
  // Curiosità
  if (lower.match(/curiosit|sapevi|fatto|fun fact|interessante/)) return pickResponse('curiosita');
  // Standard matches
  if (lower.match(/ciao|salve|buon|hello|hey|salut/)) return pickResponse('greeting');
  if (lower.match(/soci|iscritti|membri|tessera|matricola/)) return pickResponse('soci');
  if (lower.match(/attivit|corso|lezione|masterclass|campus|congresso/)) return pickResponse('attivita');
  if (lower.match(/biblio|libro|testo|pdf|dispens/)) return pickResponse('biblioteca');
  if (lower.match(/video|lezione registr|seminari/)) return pickResponse('videoteca');
  if (lower.match(/registr|antico|storia|cronolog|fondaz|timeline/)) return pickResponse('registri');
  if (lower.match(/contab|bilancio|uscit|entrat|soldi|euro|costo/)) return pickResponse('contabilita');
  if (lower.match(/shop|acquist|compra|negozio/)) return pickResponse('shop');
  if (lower.match(/albo|premio|onorific|trofeo/)) return pickResponse('albo');
  if (lower.match(/notific|avvis|scadenz/)) return pickResponse('notifiche');
  if (lower.match(/media|foto|attestat|didatt|immagin/)) return pickResponse('media');
  if (lower.match(/profilo|account|dati personal/)) return pickResponse('profilo');
  if (lower.match(/agenda|calendario|event/)) return pickResponse('agenda');
  if (lower.match(/pagament|ricevut|quota|rinnov/)) return pickResponse('pagamenti');
  if (lower.match(/aiut|help|cosa puoi|come funzion|guida/)) return pickResponse('help');
  if (lower.match(/magi|damaso|universit|umi|fernandez/)) return pickResponse('magia');
  if (lower.match(/grazie|thanks|perfetto|ottimo/)) return '😊 È stato un piacere! Se hai altre domande, sono sempre qui. La magia non si ferma mai! ✨';

  const ctx = getPageContext(pathname);
  if (ctx) return `Sei nella sezione **${ctx}**.\n\n${pickResponse(ctx)}`;
  return pickResponse('default');
}

function renderMagiText(text) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-purple-200 font-bold">{part}</strong> : part
  );
}

export default function MagiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'magi', text: '✨ Ciao! Sono **MAGI**, l\'intelligenza magica del portale UMI. Posso navigare l\'app per te, spiegarti ogni sezione o insegnarti un trucco di magia! Chiedi **"aiuto"** per vedere tutto quello che so fare.' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEnd = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const response = generateResponse(userMsg, location.pathname);
      if (response.startsWith('NAV::')) {
        const parts = response.split('::');
        const path = parts[1];
        const msg = parts.slice(2).join('::');
        setMessages(prev => [...prev, { role: 'magi', text: msg }]);
        setTyping(false);
        setTimeout(() => navigate(path), 800);
      } else {
        setMessages(prev => [...prev, { role: 'magi', text: response }]);
        setTyping(false);
      }
    }, 600 + Math.random() * 800);
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg shadow-purple-900/40 flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)' }}
        title="MAGI - Assistente Magica"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <span className="text-2xl">🔮</span>
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#1a1a2e] animate-pulse" />
        )}
      </button>

      {/* CHAT PANEL */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-[#12122a] border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-900/30 flex flex-col overflow-hidden" style={{ height: '520px' }}>
          {/* HEADER */}
          <div className="px-4 py-3 border-b border-purple-500/20 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              🔮
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm tracking-wider">M.A.G.I.</h3>
              <p className="text-purple-300 text-[10px] tracking-wider uppercase">Magical Artificial General Intelligence</p>
            </div>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'magi' && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 mt-1 shrink-0" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                    🔮
                  </div>
                )}
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-purple-600/40 text-purple-100 rounded-br-md'
                    : 'bg-[#1e1b4b] text-purple-100 rounded-bl-md border border-purple-500/20'
                }`}>
                  {renderMagiText(m.text)}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 mt-1 shrink-0" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                  🔮
                </div>
                <div className="bg-[#1e1b4b] border border-purple-500/20 px-4 py-2 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* QUICK ACTIONS */}
          <div className="px-3 py-2 border-t border-purple-500/10 flex gap-1.5 overflow-x-auto">
            {['Aiuto', 'Trucco del giorno', 'Curiosità', 'Storia UMI'].map(q => (
              <button key={q} onClick={() => { setInput(q); setTimeout(() => { const r = generateResponse(q, location.pathname); setMessages(prev => [...prev, { role: 'user', text: q }]); setTyping(true); setTimeout(() => { if (r.startsWith('NAV::')) { const p = r.split('::'); setMessages(prev => [...prev, { role: 'magi', text: p.slice(2).join('::') }]); setTyping(false); setTimeout(() => navigate(p[1]), 800); } else { setMessages(prev => [...prev, { role: 'magi', text: r }]); setTyping(false); } }, 600); }, 50); }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 hover:bg-purple-500/25 transition-colors whitespace-nowrap border border-purple-500/20">
                {q}
              </button>
            ))}
          </div>

          {/* INPUT */}
          <div className="p-3 border-t border-purple-500/20 bg-[#0f0f24]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Chiedi a MAGI..."
                className="flex-1 bg-[#1a1a3e] border border-purple-500/30 rounded-xl px-3 py-2.5 text-sm text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-400 transition-colors"
              />
              <button
                onClick={send}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 hover:scale-105"
                style={{ background: input.trim() ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : '#1a1a3e' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
