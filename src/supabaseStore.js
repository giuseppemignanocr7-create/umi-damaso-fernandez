import { supabase } from './supabaseClient';
import { isDemoMode } from './demoMode';
import { DEMO_SOCI, DEMO_ATTIVITA, DEMO_BIBLIOTECA, DEMO_VIDEOTECA, DEMO_ALBO, DEMO_USCITE, DEMO_ENTRATE, DEMO_MEDIA, DEMO_NOTIFICHE, DEMO_PROFILE } from './demoData';

// ============ PROFILES ============
export async function fetchProfiles() {
  if (isDemoMode()) return DEMO_SOCI;
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchProfileById(id) {
  if (isDemoMode()) return DEMO_PROFILE;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createProfile(profileData) {
  if (isDemoMode()) return { ...profileData, id: 'demo-' + Date.now() };
  const { data, error } = await supabase.from('profiles').insert(profileData).select().single();
  if (error) throw error;
  return data;
}

export async function updateProfile(id, updates) {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// ============ ATTIVITA ============
export async function fetchAttivita() {
  if (isDemoMode()) return DEMO_ATTIVITA;
  const { data, error } = await supabase.from('attivita').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createAttivita(attData) {
  if (isDemoMode()) { const n = { ...attData, id: 'demo-' + Date.now() }; DEMO_ATTIVITA.unshift(n); return n; }
  const { data, error } = await supabase.from('attivita').insert(attData).select().single();
  if (error) throw error;
  return data;
}

export async function updateAttivita(id, updates) {
  const { data, error } = await supabase.from('attivita').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// ============ BIBLIOTECA ============
export async function fetchBiblioteca() {
  if (isDemoMode()) return DEMO_BIBLIOTECA;
  const { data, error } = await supabase.from('biblioteca').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createBiblioteca(docData) {
  if (isDemoMode()) { const n = { ...docData, id: 'demo-' + Date.now() }; DEMO_BIBLIOTECA.unshift(n); return n; }
  const { data, error } = await supabase.from('biblioteca').insert(docData).select().single();
  if (error) throw error;
  return data;
}

// ============ VIDEOTECA ============
export async function fetchVideoteca() {
  if (isDemoMode()) return DEMO_VIDEOTECA;
  const { data, error } = await supabase.from('videoteca').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createVideoteca(vidData) {
  if (isDemoMode()) { const n = { ...vidData, id: 'demo-' + Date.now() }; DEMO_VIDEOTECA.unshift(n); return n; }
  const { data, error } = await supabase.from('videoteca').insert(vidData).select().single();
  if (error) throw error;
  return data;
}

// ============ ALBO ============
export async function fetchAlbo() {
  if (isDemoMode()) return DEMO_ALBO;
  const { data, error } = await supabase.from('albo').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createAlbo(alboData) {
  if (isDemoMode()) { const n = { ...alboData, id: 'demo-' + Date.now() }; DEMO_ALBO.unshift(n); return n; }
  const { data, error } = await supabase.from('albo').insert(alboData).select().single();
  if (error) throw error;
  return data;
}

// ============ USCITE ============
export async function fetchUscite() {
  if (isDemoMode()) return DEMO_USCITE;
  const { data, error } = await supabase.from('uscite').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createUscita(uscitaData) {
  if (isDemoMode()) { const n = { ...uscitaData, id: 'demo-' + Date.now() }; DEMO_USCITE.unshift(n); return n; }
  const { data, error } = await supabase.from('uscite').insert(uscitaData).select().single();
  if (error) throw error;
  return data;
}

// ============ ENTRATE ============
export async function fetchEntrate() {
  if (isDemoMode()) return DEMO_ENTRATE;
  const { data, error } = await supabase.from('entrate').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createEntrata(entrataData) {
  const { data, error } = await supabase.from('entrate').insert(entrataData).select().single();
  if (error) throw error;
  return data;
}

// ============ MEDIA ============
export async function fetchMedia() {
  if (isDemoMode()) return DEMO_MEDIA;
  const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createMedia(mediaData) {
  if (isDemoMode()) { const n = { ...mediaData, id: 'demo-' + Date.now() }; DEMO_MEDIA.unshift(n); return n; }
  const { data, error } = await supabase.from('media').insert(mediaData).select().single();
  if (error) throw error;
  return data;
}

// ============ NOTIFICHE ============
export async function fetchNotifiche() {
  if (isDemoMode()) return DEMO_NOTIFICHE;
  const { data, error } = await supabase.from('notifiche').select('*').order('data', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createNotifica(notData) {
  if (isDemoMode()) { const n = { ...notData, id: 'demo-' + Date.now(), data: new Date().toISOString() }; DEMO_NOTIFICHE.unshift(n); return n; }
  const { data, error } = await supabase.from('notifiche').insert(notData).select().single();
  if (error) throw error;
  return data;
}

// ============ ISCRIZIONI ============
export async function fetchIscrizioni(socioId) {
  let q = supabase.from('iscrizioni').select('*, attivita(*)');
  if (socioId) q = q.eq('socio_id', socioId);
  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createIscrizione(iscData) {
  const { data, error } = await supabase.from('iscrizioni').insert(iscData).select().single();
  if (error) throw error;
  return data;
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
