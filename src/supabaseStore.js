import { supabase } from './supabaseClient';

// ============ PROFILES ============
export async function fetchProfiles() {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchProfileById(id) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createProfile(profileData) {
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
  const { data, error } = await supabase.from('attivita').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createAttivita(attData) {
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
  const { data, error } = await supabase.from('biblioteca').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createBiblioteca(docData) {
  const { data, error } = await supabase.from('biblioteca').insert(docData).select().single();
  if (error) throw error;
  return data;
}

// ============ VIDEOTECA ============
export async function fetchVideoteca() {
  const { data, error } = await supabase.from('videoteca').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createVideoteca(vidData) {
  const { data, error } = await supabase.from('videoteca').insert(vidData).select().single();
  if (error) throw error;
  return data;
}

// ============ ALBO ============
export async function fetchAlbo() {
  const { data, error } = await supabase.from('albo').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createAlbo(alboData) {
  const { data, error } = await supabase.from('albo').insert(alboData).select().single();
  if (error) throw error;
  return data;
}

// ============ USCITE ============
export async function fetchUscite() {
  const { data, error } = await supabase.from('uscite').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createUscita(uscitaData) {
  const { data, error } = await supabase.from('uscite').insert(uscitaData).select().single();
  if (error) throw error;
  return data;
}

// ============ ENTRATE ============
export async function fetchEntrate() {
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
  const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createMedia(mediaData) {
  const { data, error } = await supabase.from('media').insert(mediaData).select().single();
  if (error) throw error;
  return data;
}

// ============ NOTIFICHE ============
export async function fetchNotifiche() {
  const { data, error } = await supabase.from('notifiche').select('*').order('data', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createNotifica(notData) {
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
  const { data, error } = await supabase.from('configurazione').select('*').eq('id', 1).single();
  if (error) throw error;
  return data;
}

export async function updateConfig(updates) {
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
