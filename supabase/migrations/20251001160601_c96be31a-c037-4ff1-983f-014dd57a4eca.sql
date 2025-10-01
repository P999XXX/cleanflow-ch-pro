-- Füge is_customer Spalte zu customer_companies hinzu
ALTER TABLE public.customer_companies 
ADD COLUMN IF NOT EXISTS is_customer BOOLEAN DEFAULT true;

-- Füge is_private_customer Spalte zu contact_persons hinzu
ALTER TABLE public.contact_persons 
ADD COLUMN IF NOT EXISTS is_private_customer BOOLEAN DEFAULT false;

-- Update bestehende Einträge: Alle mit contact_type='Kunde' werden als is_customer=true markiert
UPDATE public.customer_companies 
SET is_customer = true 
WHERE contact_type = 'Kunde';

-- Kommentar für die Spalten
COMMENT ON COLUMN public.customer_companies.is_customer IS 'Kennzeichnet ob das Unternehmen ein Kunde ist';
COMMENT ON COLUMN public.contact_persons.is_private_customer IS 'Kennzeichnet ob die Person ein Privatkunde ist';