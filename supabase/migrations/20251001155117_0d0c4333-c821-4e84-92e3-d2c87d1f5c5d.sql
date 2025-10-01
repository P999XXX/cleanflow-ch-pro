-- Add is_customer field to customer_companies table
ALTER TABLE public.customer_companies 
ADD COLUMN IF NOT EXISTS is_customer boolean DEFAULT true;

-- Add is_private_customer field to contact_persons table
ALTER TABLE public.contact_persons 
ADD COLUMN IF NOT EXISTS is_private_customer boolean DEFAULT false;

-- Migrate existing data: Set is_customer to true for companies with contact_type = 'Kunde'
UPDATE public.customer_companies 
SET is_customer = true 
WHERE contact_type = 'Kunde' OR contact_type IS NULL;

-- Set is_customer to false for non-customer contact types
UPDATE public.customer_companies 
SET is_customer = false 
WHERE contact_type != 'Kunde' AND contact_type IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.customer_companies.is_customer IS 'Indicates if this company is a customer';
COMMENT ON COLUMN public.contact_persons.is_private_customer IS 'Indicates if this person is a private customer (Privatkunde)';