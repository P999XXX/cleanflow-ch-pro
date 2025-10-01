-- Add contact_type column to contact_persons table
ALTER TABLE public.contact_persons 
ADD COLUMN contact_type TEXT;

-- Migrate existing data
UPDATE public.contact_persons 
SET contact_type = CASE 
  WHEN is_employee = true THEN 'Mitarbeiter'
  WHEN is_private_customer = true THEN 'Privatkunde'
  ELSE NULL
END;

-- Add index for better query performance
CREATE INDEX idx_contact_persons_contact_type ON public.contact_persons(contact_type);

-- Add comment for documentation
COMMENT ON COLUMN public.contact_persons.contact_type IS 'Unified contact type: Mitarbeiter or Privatkunde';