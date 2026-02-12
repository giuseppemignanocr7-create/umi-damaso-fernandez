-- ============================================
-- UMI DAMASO FERNANDEZ - Database Schema
-- ============================================

-- PROFILES (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  matricola TEXT UNIQUE,
  nome TEXT NOT NULL,
  cognome TEXT NOT NULL,
  data_nascita DATE,
  nazionalita TEXT DEFAULT 'Italiana',
  citta TEXT,
  cap TEXT,
  indirizzo TEXT,
  ruolo TEXT NOT NULL DEFAULT 'Socio Ordinario UMI',
  prefisso TEXT DEFAULT '+39',
  cellulare TEXT,
  email TEXT NOT NULL,
  stato TEXT NOT NULL DEFAULT 'Attivo',
  scadenza DATE DEFAULT '2026-12-31',
  foto_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ATTIVITA (corsi, lezioni, eventi)
CREATE TABLE public.attivita (
  id BIGSERIAL PRIMARY KEY,
  titolo TEXT NOT NULL,
  tipologia TEXT NOT NULL,
  modalita TEXT NOT NULL,
  data TIMESTAMPTZ,
  durata TEXT,
  costo NUMERIC(10,2) DEFAULT 0,
  luogo TEXT,
  docenti TEXT[] DEFAULT '{}',
  link_riunione TEXT,
  richiedente TEXT,
  email_paypal TEXT DEFAULT 'gianluigis@virgilio.it',
  giorno_ora_lezione TIMESTAMPTZ,
  descrizione TEXT,
  immagine_url TEXT,
  pubblicata BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ISCRIZIONI (soci <-> attivita)
CREATE TABLE public.iscrizioni (
  id BIGSERIAL PRIMARY KEY,
  socio_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  attivita_id BIGINT REFERENCES public.attivita(id) ON DELETE CASCADE,
  stato TEXT DEFAULT 'Iscritto',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(socio_id, attivita_id)
);

-- BIBLIOTECA
CREATE TABLE public.biblioteca (
  id BIGSERIAL PRIMARY KEY,
  titolo TEXT NOT NULL,
  autore TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'PDF',
  url TEXT,
  descrizione TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- VIDEOTECA
CREATE TABLE public.videoteca (
  id BIGSERIAL PRIMARY KEY,
  titolo TEXT NOT NULL,
  autore TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'Tutorial',
  durata TEXT,
  url TEXT,
  descrizione TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ALBO D'ORO
CREATE TABLE public.albo (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  evento TEXT,
  data DATE,
  descrizione TEXT,
  badge_url TEXT,
  attestato_url TEXT,
  socio_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USCITE FINANZIARIE
CREATE TABLE public.uscite (
  id BIGSERIAL PRIMARY KEY,
  titolo TEXT NOT NULL,
  importo NUMERIC(10,2) NOT NULL DEFAULT 0,
  data DATE,
  categoria TEXT NOT NULL,
  dettagli TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENTRATE (pagamenti soci)
CREATE TABLE public.entrate (
  id BIGSERIAL PRIMARY KEY,
  socio_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  socio_nome TEXT,
  causale TEXT,
  importo NUMERIC(10,2) NOT NULL DEFAULT 0,
  data DATE DEFAULT CURRENT_DATE,
  stato TEXT DEFAULT 'Pendente',
  attivita_id BIGINT REFERENCES public.attivita(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MEDIA CENTER
CREATE TABLE public.media (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'foto',
  file_url TEXT,
  attivita_id BIGINT REFERENCES public.attivita(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICHE
CREATE TABLE public.notifiche (
  id BIGSERIAL PRIMARY KEY,
  tipo TEXT NOT NULL DEFAULT 'comunicazione',
  titolo TEXT NOT NULL,
  data TIMESTAMPTZ DEFAULT NOW(),
  letta BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONFIGURAZIONE
CREATE TABLE public.configurazione (
  id INT PRIMARY KEY DEFAULT 1,
  paypal_email TEXT DEFAULT 'gianluigis@virgilio.it',
  logo_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.configurazione (id, paypal_email) VALUES (1, 'gianluigis@virgilio.it');

-- DEFAULT NOTIFICHE
INSERT INTO public.notifiche (tipo, titolo, data) VALUES
  ('comunicazione', 'Aggiornamento Regolamento', NOW()),
  ('comunicazione', 'Manutenzione Portale', NOW() - INTERVAL '1 day'),
  ('comunicazione', 'Nuove Iscrizioni', NOW() - INTERVAL '2 days');

-- MATRICOLA SEQUENCE
CREATE SEQUENCE IF NOT EXISTS matricola_seq START 1;

-- FUNCTION: auto-generate matricola
CREATE OR REPLACE FUNCTION generate_matricola()
RETURNS TRIGGER AS $$
BEGIN
  NEW.matricola := 'DF-' || LPAD(nextval('matricola_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_matricola
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  WHEN (NEW.matricola IS NULL)
  EXECUTE FUNCTION generate_matricola();

-- RLS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attivita ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iscrizioni ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biblioteca ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videoteca ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uscite ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entrate ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifiche ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configurazione ENABLE ROW LEVEL SECURITY;

-- PROFILES: users see own profile, admin sees all
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));
CREATE POLICY "Admin insert profiles" ON public.profiles FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin delete profiles" ON public.profiles FOR DELETE USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- PUBLIC READ for shared resources
CREATE POLICY "Anyone can read attivita" ON public.attivita FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage attivita" ON public.attivita FOR ALL USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Anyone can read biblioteca" ON public.biblioteca FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage biblioteca" ON public.biblioteca FOR ALL USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Anyone can read videoteca" ON public.videoteca FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage videoteca" ON public.videoteca FOR ALL USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Anyone can read albo" ON public.albo FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage albo" ON public.albo FOR ALL USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Admin manage uscite" ON public.uscite FOR ALL USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Users view own entrate" ON public.entrate FOR SELECT USING (socio_id = auth.uid() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));
CREATE POLICY "Admin manage entrate" ON public.entrate FOR ALL USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Anyone can read media" ON public.media FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage media" ON public.media FOR ALL USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Anyone can read notifiche" ON public.notifiche FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage notifiche" ON public.notifiche FOR ALL USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Anyone can read config" ON public.configurazione FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage config" ON public.configurazione FOR ALL USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- ISCRIZIONI: user sees own, admin sees all
CREATE POLICY "Users view own iscrizioni" ON public.iscrizioni FOR SELECT USING (socio_id = auth.uid() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));
CREATE POLICY "Users insert own iscrizioni" ON public.iscrizioni FOR INSERT WITH CHECK (socio_id = auth.uid() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));
CREATE POLICY "Admin manage iscrizioni" ON public.iscrizioni FOR ALL USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- STORAGE BUCKETS (will be created via API)
