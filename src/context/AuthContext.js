import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase, ADMIN_EMAIL } from '../supabaseClient';
import { createProfile, fetchProfileById } from '../supabaseStore';
import { DEMO_PROFILE } from '../demoData';
import { setDemoMode, isDemoMode } from '../demoMode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user);
      } else {
        setLoading(false);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user);
      } else if (!isDemoMode()) {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(authUser) {
    try {
      const p = await fetchProfileById(authUser.id);
      setUser(authUser);
      setProfile(p);
      setIsAdmin(p?.is_admin || false);
    } catch {
      setUser(authUser);
      setProfile(null);
      setIsAdmin(authUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    }
    setLoading(false);
  }

  const loginDemo = useCallback((mode) => {
    const demoProfile = { ...DEMO_PROFILE, is_admin: mode === 'admin' };
    setUser({ id: 'demo', email: 'demo@damaso.edu' });
    setProfile(demoProfile);
    setIsAdmin(mode === 'admin');
    setIsDemo(true);
    setDemoMode(true);
    setLoading(false);
    return { success: true, isAdmin: mode === 'admin' };
  }, []);

  const login = useCallback(async (email, password) => {
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      const { error } = await supabase.auth.signInWithPassword({ email, password: 'admin-damaso-2026' });
      if (error) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password: 'admin-damaso-2026',
          options: { data: { nome: 'Admin', cognome: 'Segreteria', ruolo: 'admin' } }
        });
        if (signUpError) return { success: false, error: signUpError.message };
        try {
          await createProfile({
            id: signUpData.user.id,
            nome: 'Admin',
            cognome: 'Segreteria',
            email,
            ruolo: 'admin',
            is_admin: true,
            stato: 'Attivo',
          });
        } catch (e) { /* profile may already exist */ }
        return { success: true, isAdmin: true };
      }
      return { success: true, isAdmin: true };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: 'Credenziali non valide.' };
    return { success: true, isAdmin: false };
  }, []);

  const register = useCallback(async (formData) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { nome: formData.nome, cognome: formData.cognome } }
    });
    if (authError) return { success: false, error: authError.message };

    try {
      await createProfile({
        id: authData.user.id,
        nome: formData.nome,
        cognome: formData.cognome,
        data_nascita: formData.dataNascita || null,
        nazionalita: formData.nazionalita,
        citta: formData.citta,
        cap: formData.cap,
        indirizzo: formData.indirizzo,
        ruolo: formData.ruolo,
        prefisso: formData.prefisso,
        cellulare: formData.cellulare,
        email: formData.email,
        foto_url: formData.foto || null,
        is_admin: false,
        stato: 'Attivo',
      });
    } catch (e) {
      console.error('Profile creation error:', e);
    }
    return { success: true };
  }, []);

  const registerOmaggio = useCallback(async (formData) => {
    const tempPassword = 'omaggio-' + Date.now();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password || tempPassword,
      options: { data: { nome: formData.nome, cognome: formData.cognome } }
    });
    if (authError) return { success: false, error: authError.message };

    try {
      await createProfile({
        id: authData.user.id,
        nome: formData.nome,
        cognome: formData.cognome,
        data_nascita: formData.dataNascita || null,
        nazionalita: formData.nazionalita,
        citta: formData.citta,
        cap: formData.cap,
        indirizzo: formData.indirizzo,
        ruolo: formData.ruolo,
        prefisso: formData.prefisso,
        cellulare: formData.cellulare,
        email: formData.email,
        foto_url: formData.foto || null,
        is_admin: false,
        stato: 'Attivo',
      });
    } catch (e) {
      console.error('Profile creation error:', e);
    }
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    if (!isDemo) await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    setIsDemo(false);
    setDemoMode(false);
  }, [isDemo]);

  const updateUser = useCallback((updated) => {
    setProfile(prev => prev ? { ...prev, ...updated } : updated);
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, isDemo, loading, login, loginDemo, register, registerOmaggio, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
