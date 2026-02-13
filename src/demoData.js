// ============================================
// DEMO DATA - Dati dimostrativi completi per UMI
// ============================================

export const DEMO_PROFILE = {
  id: 'demo-user-001',
  matricola: 'UMI-2026-0001',
  nome: 'Marco',
  cognome: 'Prestigiacomo',
  data_nascita: '1985-06-15',
  nazionalita: 'Italiana',
  citta: 'Roma',
  cap: '00100',
  indirizzo: 'Via della Magia 42',
  ruolo: 'Socio Ordinario UMI',
  prefisso: '+39',
  cellulare: '333 1234567',
  email: 'demo@damaso.edu',
  stato: 'Attivo',
  scadenza: '2027-12-31',
  foto_url: null,
  is_admin: true,
  created_at: '2026-01-15T10:00:00Z',
};

export const DEMO_SOCI = [
  { id: 's1', matricola: 'UMI-2026-0001', nome: 'Marco', cognome: 'Prestigiacomo', ruolo: 'Socio Ordinario UMI', stato: 'Attivo', email: 'demo@damaso.edu', citta: 'Roma', scadenza: '2027-12-31', created_at: '2026-01-15' },
  { id: 's2', matricola: 'UMI-2026-0002', nome: 'Elena', cognome: 'Merlini', ruolo: 'Studente UMI', stato: 'Attivo', email: 'elena.merlini@damaso.edu', citta: 'Milano', scadenza: '2027-06-30', created_at: '2026-01-20' },
  { id: 's3', matricola: 'UMI-2026-0003', nome: 'Roberto', cognome: 'Houdini', ruolo: 'Docente UMI', stato: 'Attivo', email: 'r.houdini@damaso.edu', citta: 'Torino', scadenza: '2027-12-31', created_at: '2026-02-01' },
  { id: 's4', matricola: 'UMI-2026-0004', nome: 'Sofia', cognome: 'Cardini', ruolo: 'Socio Onorario UMI', stato: 'Onorario', email: 'sofia.cardini@damaso.edu', citta: 'Firenze', scadenza: '2030-12-31', created_at: '2025-09-10' },
  { id: 's5', matricola: 'UMI-2026-0005', nome: 'Luca', cognome: 'Bartolomei', ruolo: 'Staff UMI', stato: 'Attivo', email: 'luca.b@damaso.edu', citta: 'Napoli', scadenza: '2027-12-31', created_at: '2026-01-25' },
  { id: 's6', matricola: 'UMI-2026-0006', nome: 'Giulia', cognome: 'Silvan', ruolo: 'Studente UMI', stato: 'Attivo', email: 'g.silvan@damaso.edu', citta: 'Bologna', scadenza: '2027-06-30', created_at: '2026-02-05' },
  { id: 's7', matricola: 'UMI-2026-0007', nome: 'Alessandro', cognome: 'Vernon', ruolo: 'Socio Ordinario UMI', stato: 'Scaduto', email: 'a.vernon@damaso.edu', citta: 'Palermo', scadenza: '2026-01-31', created_at: '2025-06-15' },
  { id: 's8', matricola: 'UMI-2026-0008', nome: 'Francesca', cognome: 'Copperfield', ruolo: 'Studente UMI', stato: 'Attivo', email: 'f.copper@damaso.edu', citta: 'Venezia', scadenza: '2027-08-31', created_at: '2026-02-08' },
  { id: 's9', matricola: 'UMI-2026-0009', nome: 'Giovanni', cognome: 'Thurston', ruolo: 'Docente UMI', stato: 'Attivo', email: 'g.thurston@damaso.edu', citta: 'Genova', scadenza: '2027-12-31', created_at: '2025-11-20' },
  { id: 's10', matricola: 'UMI-2026-0010', nome: 'Chiara', cognome: 'Henning', ruolo: 'Visitatore', stato: 'Attivo', email: 'chiara.h@damaso.edu', citta: 'Bari', scadenza: '2026-12-31', created_at: '2026-02-10' },
  { id: 's11', matricola: 'UMI-2026-0011', nome: 'Antonio', cognome: 'Blackstone', ruolo: 'Socio Ordinario UMI', stato: 'Attivo', email: 'a.blackstone@damaso.edu', citta: 'Catania', scadenza: '2027-12-31', created_at: '2026-01-05' },
  { id: 's12', matricola: 'UMI-2026-0012', nome: 'Maria', cognome: 'Kellar', ruolo: 'Studente UMI', stato: 'Sospeso', email: 'm.kellar@damaso.edu', citta: 'Verona', scadenza: '2027-03-31', created_at: '2025-12-01' },
];

export const DEMO_ATTIVITA = [
  { id: 'a1', titolo: 'Masterclass di Cartomagia Avanzata', tipologia: 'Masterclass', modalita: 'In Presenza', data: '2026-03-15', durata: '4 ore', costo: 60, luogo: 'Aula Magna Damaso, Roma', docenti: ['Roberto Houdini', 'Sofia Cardini'], descrizione: 'Un viaggio nei segreti della cartomagia professionale con tecniche avanzate di manipolazione.', pubblicata: true, link_riunione: '', richiedente: 'Segreteria', email_paypal: 'gianluigis@virgilio.it' },
  { id: 'a2', titolo: 'Lezione: Fondamenti di Prestidigitazione', tipologia: 'Lezione', modalita: 'In Presenza', data: '2026-03-20', durata: '2 ore', costo: 30, luogo: 'Sala Kellar, Roma', docenti: ['Giovanni Thurston'], descrizione: 'Tecniche base di sleight of hand per principianti e intermedi.', pubblicata: true, link_riunione: '', giorno_ora_lezione: 'Giovedì 18:00', richiedente: 'Segreteria', email_paypal: 'gianluigis@virgilio.it' },
  { id: 'a3', titolo: 'Campus Online: Mentalismo Moderno', tipologia: 'Campus Online', modalita: 'Online / Streaming', data: '2026-04-01', durata: '8 ore (4 sessioni)', costo: 100, luogo: '', docenti: ['Elena Merlini'], descrizione: 'Corso completo di mentalismo con cold reading, hot reading e tecniche psicologiche.', pubblicata: true, link_riunione: 'https://zoom.us/j/demo123', richiedente: 'Segreteria', email_paypal: 'gianluigis@virgilio.it' },
  { id: 'a4', titolo: 'Congresso UMI 2026 - Roma', tipologia: 'Congresso UMI', modalita: 'In Presenza', data: '2026-06-10', durata: '3 giorni', costo: 0, luogo: 'Teatro Eliseo, Roma', docenti: ['Tutti i Docenti UMI'], descrizione: 'Il grande appuntamento annuale con gala show, conferenze e workshop.', pubblicata: true, link_riunione: '', richiedente: 'Presidenza', email_paypal: 'gianluigis@virgilio.it' },
  { id: 'a5', titolo: 'Viaggio Studi: Magia a Praga', tipologia: 'Viaggio Studi', modalita: 'In Presenza', data: '2026-05-20', durata: '5 giorni', costo: 450, luogo: 'Praga, Repubblica Ceca', docenti: ['Roberto Houdini'], descrizione: 'Visita ai luoghi storici della magia europea con workshop esclusivi.', pubblicata: true, link_riunione: '', richiedente: 'Segreteria', email_paypal: 'gianluigis@virgilio.it' },
  { id: 'a6', titolo: 'Masterclass Online: Illusionismo Digitale', tipologia: 'Masterclass', modalita: 'Online / Streaming', data: '2026-03-25', durata: '3 ore', costo: 15, luogo: '', docenti: ['Luca Bartolomei'], descrizione: 'Tecniche di illusionismo adattate al digitale: magic su Zoom, iPad magic e social media.', pubblicata: true, link_riunione: 'https://zoom.us/j/demo456', richiedente: 'Segreteria', email_paypal: 'gianluigis@virgilio.it' },
  { id: 'a7', titolo: 'Evento Spettacolo: Gala di Primavera', tipologia: 'Evento Spettacolo', modalita: 'In Presenza', data: '2026-04-15', durata: 'Serata', costo: 0, luogo: 'Teatro Quirino, Roma', docenti: ['Cast UMI'], descrizione: 'Spettacolo di gala con i migliori performer dell\'Università.', pubblicata: true, link_riunione: '', richiedente: 'Presidenza', email_paypal: 'gianluigis@virgilio.it' },
  { id: 'a8', titolo: 'Oggettistica: Mazzo Damaso Signature', tipologia: 'Oggettistica Varia', modalita: 'In Presenza', data: '2026-02-01', durata: '', costo: 25, luogo: 'Spedizione', docenti: [], descrizione: 'Mazzo di carte personalizzato UMI Damaso Fernandez, edizione limitata 2026.', pubblicata: true, link_riunione: '', richiedente: 'Shop', email_paypal: 'gianluigis@virgilio.it' },
];

export const DEMO_BIBLIOTECA = [
  { id: 'b1', titolo: 'Il Grande Manuale della Cartomagia', autore: 'Roberto Giobbi', categoria: 'PDF', url: '#', descrizione: 'Opera fondamentale in 5 volumi sulla cartomagia moderna.' },
  { id: 'b2', titolo: 'Mentalismo Pratico Vol.1', autore: 'Corinda', categoria: 'PDF', url: '#', descrizione: '13 Steps to Mentalism - traduzione italiana commentata.' },
  { id: 'b3', titolo: 'Dispense: Tecniche di Palming', autore: 'Prof. Thurston', categoria: 'Dispensa', url: '#', descrizione: 'Guida pratica alle tecniche di concealment con monete e carte.' },
  { id: 'b4', titolo: 'Storia della Magia Italiana', autore: 'Damaso Fernandez', categoria: 'PDF', url: '#', descrizione: 'Dalla commedia dell\'arte ai moderni illusionisti italiani.' },
  { id: 'b5', titolo: 'Pergamena: Codice del Mago', autore: 'Consiglio UMI', categoria: 'Pergamena', url: '#', descrizione: 'Il codice etico e deontologico dell\'Università Magica.' },
  { id: 'b6', titolo: 'Appunti di Psicologia dell\'Inganno', autore: 'Elena Merlini', categoria: 'Dispensa', url: '#', descrizione: 'Come la mente percepisce e viene ingannata: basi cognitive.' },
];

export const DEMO_VIDEOTECA = [
  { id: 'v1', titolo: 'Lezione Magistrale: L\'Arte del Misdirection', autore: 'Roberto Houdini', categoria: 'Lezione', durata: '1h 45min', url: '#', descrizione: 'Come dirigere l\'attenzione del pubblico.' },
  { id: 'v2', titolo: 'Seminario: Close-up Magic per Ristoranti', autore: 'Sofia Cardini', categoria: 'Seminario', durata: '2h 10min', url: '#', descrizione: 'Tecniche e routine per la magia da tavolo.' },
  { id: 'v3', titolo: 'Congresso UMI 2025 - Highlights', autore: 'Staff UMI', categoria: 'Congresso', durata: '3h 20min', url: '#', descrizione: 'I momenti migliori del congresso annuale.' },
  { id: 'v4', titolo: 'Tutorial: Ambitious Card Routine', autore: 'Giovanni Thurston', categoria: 'Tutorial', durata: '45min', url: '#', descrizione: 'Step-by-step della routine più classica.' },
  { id: 'v5', titolo: 'Masterclass: Coin Magic Essentials', autore: 'Luca Bartolomei', categoria: 'Tutorial', durata: '1h 30min', url: '#', descrizione: 'Tecniche fondamentali con le monete.' },
];

export const DEMO_ALBO = [
  { id: 'al1', nome: 'Sofia Cardini', evento: 'FISM Grand Prix 2025', data: '2025-07-15', descrizione: 'Medaglia d\'oro nella categoria Close-up al campionato mondiale.' },
  { id: 'al2', nome: 'Roberto Houdini', evento: 'Premio Damaso Fernandez', data: '2025-12-20', descrizione: 'Riconoscimento alla carriera per contributi eccezionali all\'arte magica.' },
  { id: 'al3', nome: 'Elena Merlini', evento: 'Italian Magic Championship', data: '2026-01-10', descrizione: 'Primo posto nella categoria Mentalismo al campionato italiano.' },
  { id: 'al4', nome: 'Giovanni Thurston', evento: 'Laurea Honoris Causa UMI', data: '2025-06-01', descrizione: 'Dottorato onorario in Scienze dell\'Illusione.' },
  { id: 'al5', nome: 'Marco Prestigiacomo', evento: 'Trofeo Giovani Talenti', data: '2025-11-05', descrizione: 'Vincitore del concorso nazionale per giovani illusionisti.' },
];

export const DEMO_USCITE = [
  { id: 'u1', titolo: 'Abbonamento ZOOM Pro', importo: 149.90, data: '2026-01-15', categoria: 'Piattaforma ZOOM', dettagli: 'Piano annuale per streaming lezioni online' },
  { id: 'u2', titolo: 'Abbonamento CANVA Team', importo: 109.99, data: '2026-01-15', categoria: 'Piattaforma CANVA', dettagli: 'Design grafiche, poster e social media' },
  { id: 'u3', titolo: 'Abbonamento MEGA Cloud', importo: 99.99, data: '2026-01-20', categoria: 'Piattaforma MEGA', dettagli: 'Storage cloud per video lezioni e materiali' },
  { id: 'u4', titolo: 'Prenotazione Teatro Eliseo', importo: 2500.00, data: '2026-02-01', categoria: 'Organizzazione Congresso UMI', dettagli: 'Acconto per il Congresso UMI 2026' },
  { id: 'u5', titolo: 'Stampa Attestati e Diplomi', importo: 180.00, data: '2026-02-05', categoria: 'Spese varie', dettagli: '200 attestati su pergamena per premiazioni' },
  { id: 'u6', titolo: 'Catering Gala Primavera', importo: 850.00, data: '2026-03-01', categoria: 'Organizzazione EVENTO', dettagli: 'Servizio catering per 80 persone' },
];

export const DEMO_ENTRATE = [
  { id: 'e1', socio_nome: 'Marco Prestigiacomo', causale: 'Masterclass Cartomagia', importo: 60, data: '2026-02-10', stato: 'Saldato' },
  { id: 'e2', socio_nome: 'Elena Merlini', causale: 'Campus Mentalismo', importo: 100, data: '2026-02-11', stato: 'Saldato' },
  { id: 'e3', socio_nome: 'Giulia Silvan', causale: 'Masterclass Cartomagia', importo: 60, data: '2026-02-11', stato: 'Pendente' },
  { id: 'e4', socio_nome: 'Francesca Copperfield', causale: 'Campus Mentalismo', importo: 100, data: '2026-02-12', stato: 'Saldato' },
  { id: 'e5', socio_nome: 'Antonio Blackstone', causale: 'Viaggio Studi Praga', importo: 450, data: '2026-02-12', stato: 'Pendente' },
  { id: 'e6', socio_nome: 'Alessandro Vernon', causale: 'Mazzo Damaso Signature', importo: 25, data: '2026-02-08', stato: 'Saldato' },
  { id: 'e7', socio_nome: 'Luca Bartolomei', causale: 'Lezione Prestidigitazione', importo: 30, data: '2026-02-09', stato: 'Saldato' },
  { id: 'e8', socio_nome: 'Chiara Henning', causale: 'Masterclass Online', importo: 15, data: '2026-02-12', stato: 'Pendente' },
];

export const DEMO_MEDIA = [
  { id: 'm1', nome: 'Foto Congresso UMI 2025 - Palco', tipo: 'foto', url: '#' },
  { id: 'm2', nome: 'Foto Congresso UMI 2025 - Pubblico', tipo: 'foto', url: '#' },
  { id: 'm3', nome: 'Attestato Sofia Cardini - FISM', tipo: 'attestato', url: '#' },
  { id: 'm4', nome: 'Attestato Roberto Houdini - Premio Damaso', tipo: 'attestato', url: '#' },
  { id: 'm5', nome: 'Dispensa Palming - Slide', tipo: 'didattica', url: '#' },
  { id: 'm6', nome: 'Foto Masterclass Cartomagia', tipo: 'foto', url: '#' },
  { id: 'm7', nome: 'Certificato Campus Mentalismo', tipo: 'attestato', url: '#' },
  { id: 'm8', nome: 'Materiale Didattico: Card Forces', tipo: 'didattica', url: '#' },
];

export const DEMO_NOTIFICHE = [
  { id: 'n1', tipo: 'comunicazione', titolo: 'Iscrizioni aperte per il Congresso UMI 2026!', data: '2026-02-12T10:00:00Z' },
  { id: 'n2', tipo: 'comunicazione', titolo: 'Nuova Masterclass Online disponibile: Illusionismo Digitale', data: '2026-02-10T14:00:00Z' },
  { id: 'n3', tipo: 'comunicazione', titolo: 'Ricorda: rinnovo tessera entro il 31/03/2026', data: '2026-02-08T09:00:00Z' },
];

export const DEMO_PAGAMENTI = [
  { id: 'p1', causale: 'Masterclass Cartomagia Avanzata', data: '2026-02-10', importo: 60, stato: 'Saldato', metodo: 'PayPal', ricevuta_num: 'RIC-2026-00001', socio_id: 'demo-user-001' },
  { id: 'p2', causale: 'Mazzo Damaso Signature', data: '2026-02-08', importo: 25, stato: 'Saldato', metodo: 'Contanti', ricevuta_num: 'RIC-2026-00002', socio_id: 'demo-user-001' },
  { id: 'p3', causale: 'Viaggio Studi Praga (Acconto)', data: '2026-02-12', importo: 150, stato: 'Pendente', metodo: 'Bonifico', ricevuta_num: 'RIC-2026-00003', socio_id: 'demo-user-001' },
  { id: 'p4', causale: 'Campus Online Mentalismo', data: '2026-01-20', importo: 100, stato: 'Saldato', metodo: 'PayPal', ricevuta_num: 'RIC-2026-00004', socio_id: 'demo-user-001' },
  { id: 'p5', causale: 'Quota Associativa 2026', data: '2026-01-01', importo: 50, stato: 'Saldato', metodo: 'Bonifico', ricevuta_num: 'RIC-2026-00005', socio_id: 'demo-user-001' },
];

export const DEMO_ISCRIZIONI = [
  { id: 'isc1', socio_id: 'demo-user-001', attivita_id: 'a1', stato: 'Iscritto', pagato: true, importo_pagato: 60, created_at: '2026-02-10T10:00:00Z' },
  { id: 'isc2', socio_id: 'demo-user-001', attivita_id: 'a3', stato: 'Iscritto', pagato: true, importo_pagato: 100, created_at: '2026-01-20T10:00:00Z' },
  { id: 'isc3', socio_id: 'demo-user-001', attivita_id: 'a4', stato: 'Iscritto', pagato: false, importo_pagato: 0, created_at: '2026-02-01T10:00:00Z' },
  { id: 'isc4', socio_id: 'demo-user-001', attivita_id: 'a7', stato: 'Iscritto', pagato: false, importo_pagato: 0, created_at: '2026-02-05T10:00:00Z' },
  { id: 'isc5', socio_id: 's2', attivita_id: 'a1', stato: 'Iscritto', pagato: true, importo_pagato: 60, created_at: '2026-02-11T10:00:00Z' },
  { id: 'isc6', socio_id: 's3', attivita_id: 'a4', stato: 'Iscritto', pagato: false, importo_pagato: 0, created_at: '2026-02-01T14:00:00Z' },
];

export const DEMO_PRESENZE = [
  { id: 'pr1', socio_id: 'demo-user-001', attivita_id: 'a1', data: '2026-03-15', presente: true, note: '' },
  { id: 'pr2', socio_id: 's2', attivita_id: 'a1', data: '2026-03-15', presente: true, note: '' },
  { id: 'pr3', socio_id: 'demo-user-001', attivita_id: 'a4', data: '2026-06-10', presente: true, note: '' },
];
