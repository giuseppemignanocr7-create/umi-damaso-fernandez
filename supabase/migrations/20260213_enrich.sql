-- ============================================
-- UMI DAMASO FERNANDEZ - Schema Enrichment v2
-- ============================================

-- PROFILES: add fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS specializzazione TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS livello TEXT DEFAULT 'Base';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS codice_fiscale TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS luogo_nascita TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sesso TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ATTIVITA: add fields
ALTER TABLE public.attivita ADD COLUMN IF NOT EXISTS max_partecipanti INT;
ALTER TABLE public.attivita ADD COLUMN IF NOT EXISTS docente TEXT;
ALTER TABLE public.attivita ADD COLUMN IF NOT EXISTS categoria TEXT;
ALTER TABLE public.attivita ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE public.attivita ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ISCRIZIONI: add fields
ALTER TABLE public.iscrizioni ADD COLUMN IF NOT EXISTS pagato BOOLEAN DEFAULT FALSE;
ALTER TABLE public.iscrizioni ADD COLUMN IF NOT EXISTS importo_pagato NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.iscrizioni ADD COLUMN IF NOT EXISTS metodo_pagamento TEXT;
ALTER TABLE public.iscrizioni ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE public.iscrizioni ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ENTRATE: add fields
ALTER TABLE public.entrate ADD COLUMN IF NOT EXISTS metodo TEXT DEFAULT 'Bonifico';
ALTER TABLE public.entrate ADD COLUMN IF NOT EXISTS ricevuta_num TEXT;
ALTER TABLE public.entrate ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE public.entrate ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- USCITE: add fields
ALTER TABLE public.uscite ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE public.uscite ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- BIBLIOTECA: add fields
ALTER TABLE public.biblioteca ADD COLUMN IF NOT EXISTS anno INT;
ALTER TABLE public.biblioteca ADD COLUMN IF NOT EXISTS pagine INT;
ALTER TABLE public.biblioteca ADD COLUMN IF NOT EXISTS lingua TEXT DEFAULT 'Italiano';
ALTER TABLE public.biblioteca ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- VIDEOTECA: add fields
ALTER TABLE public.videoteca ADD COLUMN IF NOT EXISTS visualizzazioni INT DEFAULT 0;
ALTER TABLE public.videoteca ADD COLUMN IF NOT EXISTS lingua TEXT DEFAULT 'Italiano';
ALTER TABLE public.videoteca ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ALBO: add fields
ALTER TABLE public.albo ADD COLUMN IF NOT EXISTS categoria TEXT;
ALTER TABLE public.albo ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- MEDIA: add fields
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS evento TEXT;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS data DATE;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS socio_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS descrizione TEXT;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- NOTIFICHE: add fields
ALTER TABLE public.notifiche ADD COLUMN IF NOT EXISTS destinatario_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.notifiche ADD COLUMN IF NOT EXISTS messaggio TEXT;
ALTER TABLE public.notifiche ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- NEW TABLE: PRESENZE (attendance tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS public.presenze (
  id BIGSERIAL PRIMARY KEY,
  socio_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  attivita_id BIGINT REFERENCES public.attivita(id) ON DELETE CASCADE,
  data DATE DEFAULT CURRENT_DATE,
  presente BOOLEAN DEFAULT TRUE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(socio_id, attivita_id, data)
);

ALTER TABLE public.presenze ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own presenze" ON public.presenze FOR SELECT USING (socio_id = auth.uid() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));
CREATE POLICY "Admin manage presenze" ON public.presenze FOR ALL USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- ============================================
-- NEW TABLE: PAGAMENTI_SOCIO (personal payment log)
-- ============================================
CREATE TABLE IF NOT EXISTS public.pagamenti_socio (
  id BIGSERIAL PRIMARY KEY,
  socio_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  causale TEXT NOT NULL,
  importo NUMERIC(10,2) NOT NULL DEFAULT 0,
  data DATE DEFAULT CURRENT_DATE,
  stato TEXT DEFAULT 'Pendente',
  metodo TEXT DEFAULT 'Bonifico',
  ricevuta_num TEXT,
  attivita_id BIGINT REFERENCES public.attivita(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pagamenti_socio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own pagamenti" ON public.pagamenti_socio FOR SELECT USING (socio_id = auth.uid() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));
CREATE POLICY "Users insert own pagamenti" ON public.pagamenti_socio FOR INSERT WITH CHECK (socio_id = auth.uid() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));
CREATE POLICY "Admin manage pagamenti" ON public.pagamenti_socio FOR ALL USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- AUTO ricevuta_num
CREATE OR REPLACE FUNCTION generate_ricevuta_num()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ricevuta_num := 'RIC-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEW.id::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ricevuta_pagamenti
  BEFORE INSERT ON public.pagamenti_socio
  FOR EACH ROW
  WHEN (NEW.ricevuta_num IS NULL)
  EXECUTE FUNCTION generate_ricevuta_num();

CREATE TRIGGER trg_ricevuta_entrate
  BEFORE INSERT ON public.entrate
  FOR EACH ROW
  WHEN (NEW.ricevuta_num IS NULL)
  EXECUTE FUNCTION generate_ricevuta_num();

-- Entrate: allow socio insert for self-payments
CREATE POLICY "Users insert own entrate" ON public.entrate FOR INSERT WITH CHECK (socio_id = auth.uid() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));
-- Entrate: users can update own payment status
CREATE POLICY "Users update own entrate" ON public.entrate FOR UPDATE USING (socio_id = auth.uid() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE));
