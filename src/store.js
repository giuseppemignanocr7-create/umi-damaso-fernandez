let nextMatricola = 1;
let nextReceiptSerial = 1;

const ADMIN_EMAIL = 'gianluigis@virgilio.it';
const PAYPAL_EMAIL = 'gianluigis@virgilio.it';

const ROLES = [
  'Socio Ordinario UMI',
  'Socio Onorario UMI',
  'Studente UMI',
  'Docente UMI',
  'Staff UMI',
  'Visitatore',
];

const NATIONALITIES = [
  'Italiana','Francese','Spagnola','Tedesca','Inglese','Americana','Brasiliana',
  'Argentina','Messicana','Cinese','Giapponese','Russa','Portoghese','Olandese',
  'Belga','Svizzera','Austriaca','Polacca','Romena','Greca','Turca','Indiana',
  'Australiana','Canadese','Colombiana','Peruviana','Cilena','Cubana','Egiziana',
  'Marocchina','Tunisina','Algerina','Sudafricana','Nigeriana','Altra',
];

const PHONE_PREFIXES = [
  '+39','+1','+44','+33','+34','+49','+351','+31','+32','+41','+43',
  '+48','+40','+30','+90','+55','+54','+52','+86','+81','+82','+91',
  '+61','+7','+20','+212','+216','+234','+27',
];

const STATI_SOCIO = ['Attivo','Sospeso','Scaduto','Onorario','Vitalizio'];

const TIPOLOGIE_ATTIVITA = [
  'Lezione','Campus Online','Masterclass','Congresso UMI',
  'Viaggio Studi','Evento Spettacolo','Oggettistica Varia',
];

const MODALITA_ATTIVITA = ['In Presenza','Online / Streaming'];

const CATEGORIE_USCITA = [
  'Piattaforma ZOOM','Piattaforma CANVA','Piattaforma MEGA',
  'Organizzazione Congresso UMI','Organizzazione EVENTO','Spese varie',
];

const ROLE_QUOTAS = {
  'Socio Ordinario UMI': 0,
  'Socio Onorario UMI': 0,
  'Studente UMI': 0,
  'Docente UMI': 0,
  'Staff UMI': 0,
  'Visitatore': 0,
};

function getPriceForActivity(tipologia, modalita) {
  const rules = {
    'Lezione': { 'In Presenza': 30, 'Online / Streaming': 0 },
    'Masterclass': { 'In Presenza': 60, 'Online / Streaming': 15 },
    'Campus Online': { 'In Presenza': null, 'Online / Streaming': 100 },
    'Congresso UMI': { 'In Presenza': 'LIBERO', 'Online / Streaming': 'LIBERO' },
    'Viaggio Studi': { 'In Presenza': 'LIBERO', 'Online / Streaming': null },
    'Evento Spettacolo': { 'In Presenza': 'LIBERO', 'Online / Streaming': 'LIBERO' },
    'Oggettistica Varia': { 'In Presenza': 'LIBERO', 'Online / Streaming': null },
  };
  const r = rules[tipologia];
  if (!r) return 'LIBERO';
  return r[modalita] ?? null;
}

function generateMatricola() {
  const num = String(nextMatricola).padStart(4, '0');
  nextMatricola++;
  return `DF-${num}`;
}

function generateReceiptSerial() {
  const num = String(nextReceiptSerial).padStart(6, '0');
  nextReceiptSerial++;
  return `RIC-${num}`;
}

const store = {
  soci: [],
  attivita: [],
  biblioteca: [],
  videoteca: [],
  albo: [],
  uscite: [],
  entrate: [],
  media: [],
  notifiche: [
    { id: 1, tipo: 'comunicazione', titolo: 'Aggiornamento Regolamento', data: new Date().toISOString(), letta: false },
    { id: 2, tipo: 'comunicazione', titolo: 'Manutenzione Portale', data: new Date(Date.now() - 86400000).toISOString(), letta: false },
    { id: 3, tipo: 'comunicazione', titolo: 'Nuove Iscrizioni', data: new Date(Date.now() - 172800000).toISOString(), letta: false },
  ],
  paypalEmail: PAYPAL_EMAIL,
  logoUrl: null,
};

function addSocio(data) {
  const matricola = generateMatricola();
  const socio = {
    id: Date.now(),
    matricola,
    ...data,
    stato: 'Attivo',
    dataIscrizione: new Date().toISOString(),
    scadenza: '2026-12-31',
    foto: null,
    corsiIscritti: [],
    pagamenti: [],
    premi: [],
  };
  store.soci.push(socio);
  return socio;
}

function addAttivita(data) {
  const att = {
    id: Date.now(),
    ...data,
    pubblicata: false,
    iscritti: [],
    createdAt: new Date().toISOString(),
  };
  store.attivita.push(att);
  return att;
}

function addBiblioteca(data) {
  const doc = { id: Date.now(), ...data, createdAt: new Date().toISOString() };
  store.biblioteca.push(doc);
  return doc;
}

function addVideoteca(data) {
  const vid = { id: Date.now(), ...data, createdAt: new Date().toISOString() };
  store.videoteca.push(vid);
  return vid;
}

function addAlbo(data) {
  const premio = { id: Date.now(), ...data, createdAt: new Date().toISOString() };
  store.albo.push(premio);
  return premio;
}

function addUscita(data) {
  const uscita = { id: Date.now(), ...data, createdAt: new Date().toISOString() };
  store.uscite.push(uscita);
  return uscita;
}

function addEntrata(data) {
  const entrata = { id: Date.now(), ...data, createdAt: new Date().toISOString() };
  store.entrate.push(entrata);
  return entrata;
}

function addMedia(data) {
  const m = { id: Date.now(), ...data, createdAt: new Date().toISOString() };
  store.media.push(m);
  return m;
}

function addNotifica(data) {
  const n = { id: Date.now(), ...data, data: new Date().toISOString(), letta: false };
  store.notifiche.push(n);
  return n;
}

export {
  store,
  ADMIN_EMAIL,
  PAYPAL_EMAIL,
  ROLES,
  NATIONALITIES,
  PHONE_PREFIXES,
  STATI_SOCIO,
  TIPOLOGIE_ATTIVITA,
  MODALITA_ATTIVITA,
  CATEGORIE_USCITA,
  ROLE_QUOTAS,
  getPriceForActivity,
  generateMatricola,
  generateReceiptSerial,
  addSocio,
  addAttivita,
  addBiblioteca,
  addVideoteca,
  addAlbo,
  addUscita,
  addEntrata,
  addMedia,
  addNotifica,
};
