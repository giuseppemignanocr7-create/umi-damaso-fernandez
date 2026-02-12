import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MAGI_RESPONSES = {
  greeting: [
    'Benvenuto nel Portale UMI! Sono MAGI, la tua assistente magica. Come posso aiutarti?',
    'Salve, Mago! MAGI al tuo servizio. Chiedimi qualsiasi cosa sul portale.',
  ],
  soci: [
    'La sezione Soci ti permette di gestire tutti gli iscritti. Puoi filtrare per stato, cercare per nome o matricola, e aggiungere nuovi soci omaggio.',
    'Attualmente ci sono 12 soci registrati. 9 attivi, 1 scaduto, 1 sospeso e 1 onorario. Vuoi che ti aiuti con qualcosa di specifico?',
  ],
  attivita: [
    'Il Catalogo Attività gestisce corsi, masterclass, congressi e oggettistica. Ogni attività ha un prezzo calcolato automaticamente in base alla tipologia e modalità.',
    'Ci sono 8 attività pubblicate: 2 Masterclass, 1 Lezione, 1 Campus Online, 1 Congresso, 1 Viaggio Studi, 1 Evento e 1 Oggettistica.',
  ],
  biblioteca: [
    'La Biblioteca Virtuale contiene 6 documenti tra PDF, dispense e pergamene. I soci possono consultarli dalla loro area riservata.',
  ],
  videoteca: [
    'La Videoteca ha 5 contenuti multimediali: lezioni magistrali, seminari, tutorial e highlights dei congressi.',
  ],
  contabilita: [
    'La Contabilità mostra: Uscite €3.889,88 per piattaforme e organizzazione eventi. Entrate €840,00 da iscrizioni e acquisti soci. Bilancio e configurazione PayPal.',
  ],
  shop: [
    'Lo Shop UMI mostra tutte le attività a pagamento. I soci possono acquistare corsi, masterclass e oggettistica direttamente online con PayPal.',
  ],
  albo: [
    "L'Albo d'Oro raccoglie 5 premi e onorificenze: dal FISM Grand Prix alla Laurea Honoris Causa. Un catalogo dei migliori talenti UMI.",
  ],
  notifiche: [
    'Il Centro Notifiche monitora: scadenze tessere, pagamenti pendenti, attività imminenti e comunicazioni generali.',
  ],
  media: [
    'Il Media Center gestisce foto, attestati e materiale didattico. Puoi caricare nuovi file e collegarli alle attività.',
  ],
  profilo: [
    'Il Profilo mostra i tuoi dati personali, la tessera digitale, i corsi frequentati e lo storico pagamenti.',
  ],
  help: [
    'Posso aiutarti con:\n• Gestione Soci e iscrizioni\n• Catalogo Attività e Shop\n• Biblioteca e Videoteca\n• Contabilità e pagamenti\n• Albo d\'Oro e premi\n• Media Center\n• Qualsiasi domanda sul portale UMI!',
  ],
  magia: [
    'La magia è l\'arte di creare meraviglia. L\'UMI Damaso Fernandez è dedicata a preservare e tramandare quest\'arte attraverso formazione, eventi e una comunità di appassionati.',
    'Damaso Fernandez è stato un pioniere della magia italiana. L\'Università porta il suo nome in onore del suo contributo all\'arte dell\'illusionismo.',
  ],
  default: [
    'Interessante domanda! Come MAGI, posso guidarti in tutte le sezioni del portale. Prova a chiedermi di soci, attività, biblioteca, contabilità o qualsiasi altra area.',
    'Non sono sicura di aver capito. Posso aiutarti con la navigazione del portale, spiegarti le funzionalità o darti statistiche. Cosa ti serve?',
  ],
};

function getPageContext(pathname) {
  if (pathname.includes('soci') || pathname.includes('gestione-soci') || pathname.includes('nuovo-socio')) return 'soci';
  if (pathname.includes('catalogo') || pathname.includes('attivit')) return 'attivita';
  if (pathname.includes('biblioteca')) return 'biblioteca';
  if (pathname.includes('videoteca')) return 'videoteca';
  if (pathname.includes('contabilita')) return 'contabilita';
  if (pathname.includes('shop')) return 'shop';
  if (pathname.includes('albo')) return 'albo';
  if (pathname.includes('notifiche')) return 'notifiche';
  if (pathname.includes('media')) return 'media';
  if (pathname.includes('profilo')) return 'profilo';
  return null;
}

function pickResponse(key) {
  const arr = MAGI_RESPONSES[key] || MAGI_RESPONSES.default;
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateResponse(input, pathname) {
  const lower = input.toLowerCase();
  if (lower.match(/ciao|salve|buon|hello|hey/)) return pickResponse('greeting');
  if (lower.match(/soci|iscritti|membri|tessera|matricola/)) return pickResponse('soci');
  if (lower.match(/attivit|corso|lezione|masterclass|campus|congresso/)) return pickResponse('attivita');
  if (lower.match(/biblio|libro|testo|pdf|dispens/)) return pickResponse('biblioteca');
  if (lower.match(/video|lezione registr|seminari/)) return pickResponse('videoteca');
  if (lower.match(/contab|bilancio|uscit|entrat|paga|soldi|euro|costo/)) return pickResponse('contabilita');
  if (lower.match(/shop|acquist|compra/)) return pickResponse('shop');
  if (lower.match(/albo|premio|onorific|trofeo/)) return pickResponse('albo');
  if (lower.match(/notific|avvis|scadenz/)) return pickResponse('notifiche');
  if (lower.match(/media|foto|attestat|didatt/)) return pickResponse('media');
  if (lower.match(/profilo|account|dati personal/)) return pickResponse('profilo');
  if (lower.match(/aiut|help|cosa puoi|come funzion/)) return pickResponse('help');
  if (lower.match(/magi|damaso|universit|umi/)) return pickResponse('magia');

  const ctx = getPageContext(pathname);
  if (ctx) return pickResponse(ctx);
  return pickResponse('default');
}

export default function MagiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'magi', text: 'Ciao! Sono MAGI, l\'intelligenza magica del portale UMI. Chiedimi qualsiasi cosa!' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEnd = useRef(null);
  const location = useLocation();

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
      setMessages(prev => [...prev, { role: 'magi', text: response }]);
      setTyping(false);
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
                  {m.text}
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
            {['Aiuto', 'Soci', 'Attività', 'Contabilità'].map(q => (
              <button key={q} onClick={() => { setInput(q); setTimeout(() => { setMessages(prev => [...prev, { role: 'user', text: q }]); setTyping(true); setTimeout(() => { setMessages(prev => [...prev, { role: 'magi', text: generateResponse(q, location.pathname) }]); setTyping(false); }, 600); }, 50); }}
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
