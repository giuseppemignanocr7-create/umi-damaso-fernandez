import { supabase } from './supabaseClient';
import { isDemoMode } from './demoMode';
import {
  DEMO_SOCI, DEMO_ATTIVITA, DEMO_BIBLIOTECA, DEMO_VIDEOTECA, DEMO_ALBO,
  DEMO_USCITE, DEMO_ENTRATE, DEMO_MEDIA, DEMO_NOTIFICHE, DEMO_PROFILE,
  DEMO_PAGAMENTI, DEMO_ISCRIZIONI, DEMO_PRESENZE
} from './demoData';

// ============ HELPER: demo ID ============
let _demoSeq = Date.now();
function demoId() { return 'demo-' + (++_demoSeq); }

// ============ PROFILES ============
export async function fetchProfiles() {
  if (isDemoMode()) return [...DEMO_SOCI];
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchProfileById(id) {
  if (isDemoMode()) return { ...DEMO_PROFILE };
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createProfile(profileData) {
  if (isDemoMode()) { const n = { ...profileData, id: demoId(), created_at: new Date().toISOString() }; DEMO_SOCI.unshift(n); return n; }
  const { data, error } = await supabase.from('profiles').insert(profileData).select().single();
  if (error) throw error;
  return data;
}

export async function updateProfile(id, updates) {
  if (isDemoMode()) {
    const idx = DEMO_SOCI.findIndex(s => s.id === id);
    if (idx >= 0) Object.assign(DEMO_SOCI[idx], updates);
    return { id, ...updates };
  }
  const { data, error } = await supabase.from('profiles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProfile(id) {
  if (isDemoMode()) { const idx = DEMO_SOCI.findIndex(s => s.id === id); if (idx >= 0) DEMO_SOCI.splice(idx, 1); return true; }
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ============ ATTIVITA ============
export async function fetchAttivita() {
  if (isDemoMode()) return [...DEMO_ATTIVITA];
  const { data, error } = await supabase.from('attivita').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createAttivita(attData) {
  if (isDemoMode()) { const n = { ...attData, id: demoId(), created_at: new Date().toISOString() }; DEMO_ATTIVITA.unshift(n); return n; }
  const { data, error } = await supabase.from('attivita').insert(attData).select().single();
  if (error) throw error;
  return data;
}

export async function updateAttivita(id, updates) {
  if (isDemoMode()) { const idx = DEMO_ATTIVITA.findIndex(a => a.id === id); if (idx >= 0) Object.assign(DEMO_ATTIVITA[idx], updates); return { id, ...updates }; }
  const { data, error } = await supabase.from('attivita').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteAttivita(id) {
  if (isDemoMode()) { const idx = DEMO_ATTIVITA.findIndex(a => a.id === id); if (idx >= 0) DEMO_ATTIVITA.splice(idx, 1); return true; }
  const { error } = await supabase.from('attivita').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ============ ISCRIZIONI ============
export async function fetchIscrizioni(socioId) {
  if (isDemoMode()) return socioId ? DEMO_ISCRIZIONI.filter(i => i.socio_id === socioId) : [...DEMO_ISCRIZIONI];
  let q = supabase.from('iscrizioni').select('*, attivita(*)');
  if (socioId) q = q.eq('socio_id', socioId);
  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createIscrizione(iscData) {
  if (isDemoMode()) {
    const exists = DEMO_ISCRIZIONI.find(i => i.socio_id === iscData.socio_id && i.attivita_id === iscData.attivita_id);
    if (exists) return exists;
    const n = { ...iscData, id: demoId(), stato: 'Iscritto', created_at: new Date().toISOString() };
    DEMO_ISCRIZIONI.unshift(n);
    return n;
  }
  const { data, error } = await supabase.from('iscrizioni').insert(iscData).select().single();
  if (error) throw error;
  return data;
}

export async function deleteIscrizione(id) {
  if (isDemoMode()) { const idx = DEMO_ISCRIZIONI.findIndex(i => i.id === id); if (idx >= 0) DEMO_ISCRIZIONI.splice(idx, 1); return true; }
  const { error } = await supabase.from('iscrizioni').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ============ BIBLIOTECA ============
export async function fetchBiblioteca() {
  if (isDemoMode()) return [...DEMO_BIBLIOTECA];
  const { data, error } = await supabase.from('biblioteca').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createBiblioteca(docData) {
  if (isDemoMode()) { const n = { ...docData, id: demoId() }; DEMO_BIBLIOTECA.unshift(n); return n; }
  const { data, error } = await supabase.from('biblioteca').insert(docData).select().single();
  if (error) throw error;
  return data;
}

export async function updateBiblioteca(id, updates) {
  if (isDemoMode()) { const idx = DEMO_BIBLIOTECA.findIndex(b => b.id === id); if (idx >= 0) Object.assign(DEMO_BIBLIOTECA[idx], updates); return { id, ...updates }; }
  const { data, error } = await supabase.from('biblioteca').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteBiblioteca(id) {
  if (isDemoMode()) { const idx = DEMO_BIBLIOTECA.findIndex(b => b.id === id); if (idx >= 0) DEMO_BIBLIOTECA.splice(idx, 1); return true; }
  const { error } = await supabase.from('biblioteca').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ============ VIDEOTECA ============
export async function fetchVideoteca() {
  if (isDemoMode()) return [...DEMO_VIDEOTECA];
  const { data, error } = await supabase.from('videoteca').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createVideoteca(vidData) {
  if (isDemoMode()) { const n = { ...vidData, id: demoId() }; DEMO_VIDEOTECA.unshift(n); return n; }
  const { data, error } = await supabase.from('videoteca').insert(vidData).select().single();
  if (error) throw error;
  return data;
}

export async function updateVideoteca(id, updates) {
  if (isDemoMode()) { const idx = DEMO_VIDEOTECA.findIndex(v => v.id === id); if (idx >= 0) Object.assign(DEMO_VIDEOTECA[idx], updates); return { id, ...updates }; }
  const { data, error } = await supabase.from('videoteca').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteVideoteca(id) {
  if (isDemoMode()) { const idx = DEMO_VIDEOTECA.findIndex(v => v.id === id); if (idx >= 0) DEMO_VIDEOTECA.splice(idx, 1); return true; }
  const { error } = await supabase.from('videoteca').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ============ ALBO ============
export async function fetchAlbo() {
  if (isDemoMode()) return [...DEMO_ALBO];
  const { data, error } = await supabase.from('albo').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createAlbo(alboData) {
  if (isDemoMode()) { const n = { ...alboData, id: demoId() }; DEMO_ALBO.unshift(n); return n; }
  const { data, error } = await supabase.from('albo').insert(alboData).select().single();
  if (error) throw error;
  return data;
}

export async function updateAlbo(id, updates) {
  if (isDemoMode()) { const idx = DEMO_ALBO.findIndex(a => a.id === id); if (idx >= 0) Object.assign(DEMO_ALBO[idx], updates); return { id, ...updates }; }
  const { data, error } = await supabase.from('albo').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteAlbo(id) {
  if (isDemoMode()) { const idx = DEMO_ALBO.findIndex(a => a.id === id); if (idx >= 0) DEMO_ALBO.splice(idx, 1); return true; }
  const { error } = await supabase.from('albo').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ============ USCITE ============
export async function fetchUscite() {
  if (isDemoMode()) return [...DEMO_USCITE];
  const { data, error } = await supabase.from('uscite').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createUscita(uscitaData) {
  if (isDemoMode()) { const n = { ...uscitaData, id: demoId() }; DEMO_USCITE.unshift(n); return n; }
  const { data, error } = await supabase.from('uscite').insert(uscitaData).select().single();
  if (error) throw error;
  return data;
}

export async function updateUscita(id, updates) {
  if (isDemoMode()) { const idx = DEMO_USCITE.findIndex(u => u.id === id); if (idx >= 0) Object.assign(DEMO_USCITE[idx], updates); return { id, ...updates }; }
  const { data, error } = await supabase.from('uscite').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteUscita(id) {
  if (isDemoMode()) { const idx = DEMO_USCITE.findIndex(u => u.id === id); if (idx >= 0) DEMO_USCITE.splice(idx, 1); return true; }
  const { error } = await supabase.from('uscite').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ============ ENTRATE ============
export async function fetchEntrate() {
  if (isDemoMode()) return [...DEMO_ENTRATE];
  const { data, error } = await supabase.from('entrate').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createEntrata(entrataData) {
  if (isDemoMode()) { const n = { ...entrataData, id: demoId(), created_at: new Date().toISOString() }; DEMO_ENTRATE.unshift(n); return n; }
  const { data, error } = await supabase.from('entrate').insert(entrataData).select().single();
  if (error) throw error;
  return data;
}

export async function updateEntrata(id, updates) {
  if (isDemoMode()) { const idx = DEMO_ENTRATE.findIndex(e => e.id === id); if (idx >= 0) Object.assign(DEMO_ENTRATE[idx], updates); return { id, ...updates }; }
  const { data, error } = await supabase.from('entrate').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteEntrata(id) {
  if (isDemoMode()) { const idx = DEMO_ENTRATE.findIndex(e => e.id === id); if (idx >= 0) DEMO_ENTRATE.splice(idx, 1); return true; }
  const { error } = await supabase.from('entrate').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ============ PAGAMENTI SOCIO ============
export async function fetchPagamentiSocio(socioId) {
  if (isDemoMode()) return socioId ? DEMO_PAGAMENTI.filter(p => !p.socio_id || p.socio_id === socioId) : [...DEMO_PAGAMENTI];
  let q = supabase.from('pagamenti_socio').select('*');
  if (socioId) q = q.eq('socio_id', socioId);
  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createPagamentoSocio(pagData) {
  if (isDemoMode()) { const n = { ...pagData, id: demoId(), ricevuta_num: 'RIC-' + new Date().getFullYear() + '-' + String(DEMO_PAGAMENTI.length + 1).padStart(5, '0'), created_at: new Date().toISOString() }; DEMO_PAGAMENTI.unshift(n); return n; }
  const { data, error } = await supabase.from('pagamenti_socio').insert(pagData).select().single();
  if (error) throw error;
  return data;
}

export async function updatePagamentoSocio(id, updates) {
  if (isDemoMode()) { const idx = DEMO_PAGAMENTI.findIndex(p => p.id === id); if (idx >= 0) Object.assign(DEMO_PAGAMENTI[idx], updates); return { id, ...updates }; }
  const { data, error } = await supabase.from('pagamenti_socio').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// ============ PRESENZE ============
export async function fetchPresenze(attivitaId) {
  if (isDemoMode()) return attivitaId ? DEMO_PRESENZE.filter(p => p.attivita_id === attivitaId) : [...DEMO_PRESENZE];
  let q = supabase.from('presenze').select('*, profiles(nome, cognome, matricola)');
  if (attivitaId) q = q.eq('attivita_id', attivitaId);
  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createPresenza(presenzaData) {
  if (isDemoMode()) { const n = { ...presenzaData, id: demoId(), created_at: new Date().toISOString() }; DEMO_PRESENZE.unshift(n); return n; }
  const { data, error } = await supabase.from('presenze').insert(presenzaData).select().single();
  if (error) throw error;
  return data;
}

// ============ MEDIA ============
export async function fetchMedia() {
  if (isDemoMode()) return [...DEMO_MEDIA];
  const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createMedia(mediaData) {
  if (isDemoMode()) { const n = { ...mediaData, id: demoId() }; DEMO_MEDIA.unshift(n); return n; }
  const { data, error } = await supabase.from('media').insert(mediaData).select().single();
  if (error) throw error;
  return data;
}

export async function updateMedia(id, updates) {
  if (isDemoMode()) { const idx = DEMO_MEDIA.findIndex(m => m.id === id); if (idx >= 0) Object.assign(DEMO_MEDIA[idx], updates); return { id, ...updates }; }
  const { data, error } = await supabase.from('media').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteMedia(id) {
  if (isDemoMode()) { const idx = DEMO_MEDIA.findIndex(m => m.id === id); if (idx >= 0) DEMO_MEDIA.splice(idx, 1); return true; }
  const { error } = await supabase.from('media').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ============ NOTIFICHE ============
export async function fetchNotifiche() {
  if (isDemoMode()) return [...DEMO_NOTIFICHE];
  const { data, error } = await supabase.from('notifiche').select('*').order('data', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createNotifica(notData) {
  if (isDemoMode()) { const n = { ...notData, id: demoId(), data: new Date().toISOString(), letta: false }; DEMO_NOTIFICHE.unshift(n); return n; }
  const { data, error } = await supabase.from('notifiche').insert(notData).select().single();
  if (error) throw error;
  return data;
}

export async function updateNotifica(id, updates) {
  if (isDemoMode()) { const idx = DEMO_NOTIFICHE.findIndex(n => n.id === id); if (idx >= 0) Object.assign(DEMO_NOTIFICHE[idx], updates); return { id, ...updates }; }
  const { data, error } = await supabase.from('notifiche').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function markNotificaRead(id) {
  return updateNotifica(id, { letta: true });
}

export async function deleteNotifica(id) {
  if (isDemoMode()) { const idx = DEMO_NOTIFICHE.findIndex(n => n.id === id); if (idx >= 0) DEMO_NOTIFICHE.splice(idx, 1); return true; }
  const { error } = await supabase.from('notifiche').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ============ CONFIGURAZIONE ============
export async function fetchConfig() {
  if (isDemoMode()) return { id: 1, paypal_email: 'gianluigis@virgilio.it' };
  const { data, error } = await supabase.from('configurazione').select('*').eq('id', 1).single();
  if (error) throw error;
  return data;
}

export async function updateConfig(updates) {
  if (isDemoMode()) return { id: 1, ...updates };
  const { data, error } = await supabase.from('configurazione').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', 1).select().single();
  if (error) throw error;
  return data;
}

// ============ STORAGE HELPERS ============
export async function uploadFile(bucket, path, file) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}
