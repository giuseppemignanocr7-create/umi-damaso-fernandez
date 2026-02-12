import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const ADMIN_EMAIL = 'gianluigis@virgilio.it';
export const PAYPAL_EMAIL = 'gianluigis@virgilio.it';

export const ROLES = [
  'Socio Ordinario UMI',
  'Socio Onorario UMI',
  'Studente UMI',
  'Docente UMI',
  'Staff UMI',
  'Visitatore',
];

export const NATIONALITIES = [
  'Italiana','Francese','Spagnola','Tedesca','Inglese','Americana','Brasiliana',
  'Argentina','Messicana','Cinese','Giapponese','Russa','Portoghese','Olandese',
  'Belga','Svizzera','Austriaca','Polacca','Romena','Greca','Turca','Indiana',
  'Australiana','Canadese','Colombiana','Peruviana','Cilena','Cubana','Egiziana',
  'Marocchina','Tunisina','Algerina','Sudafricana','Nigeriana','Altra',
];

export const PHONE_PREFIXES = [
  '+39','+1','+44','+33','+34','+49','+351','+31','+32','+41','+43',
  '+48','+40','+30','+90','+55','+54','+52','+86','+81','+82','+91',
  '+61','+7','+20','+212','+216','+234','+27',
];

export const STATI_SOCIO = ['Attivo','Sospeso','Scaduto','Onorario','Vitalizio'];

export const TIPOLOGIE_ATTIVITA = [
  'Lezione','Campus Online','Masterclass','Congresso UMI',
  'Viaggio Studi','Evento Spettacolo','Oggettistica Varia',
];

export const MODALITA_ATTIVITA = ['In Presenza','Online / Streaming'];

export const CATEGORIE_USCITA = [
  'Piattaforma ZOOM','Piattaforma CANVA','Piattaforma MEGA',
  'Organizzazione Congresso UMI','Organizzazione EVENTO','Spese varie',
];

export const ROLE_QUOTAS = {
  'Socio Ordinario UMI': 0,
  'Socio Onorario UMI': 0,
  'Studente UMI': 0,
  'Docente UMI': 0,
  'Staff UMI': 0,
  'Visitatore': 0,
};

export function getPriceForActivity(tipologia, modalita) {
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
