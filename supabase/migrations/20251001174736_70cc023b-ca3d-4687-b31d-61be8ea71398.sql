-- Add status column to contact_persons table
ALTER TABLE public.contact_persons 
ADD COLUMN status text DEFAULT 'aktiv';

-- Add comment for documentation
COMMENT ON COLUMN public.contact_persons.status IS 'Status der Kontaktperson: aktiv, inaktiv';