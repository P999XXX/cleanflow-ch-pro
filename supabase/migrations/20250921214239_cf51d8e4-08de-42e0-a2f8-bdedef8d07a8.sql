-- Add contact_type field to customer_companies table
ALTER TABLE public.customer_companies 
ADD COLUMN contact_type TEXT;

-- Add comment for the new field
COMMENT ON COLUMN public.customer_companies.contact_type IS 'Type of contact: Kunde, Lieferant, Dienstleister, Amtlich, Sonstige';