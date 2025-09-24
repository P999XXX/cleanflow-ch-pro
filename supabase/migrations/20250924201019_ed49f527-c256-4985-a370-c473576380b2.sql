-- Remove title and department columns and add position column to contact_persons table
ALTER TABLE public.contact_persons 
DROP COLUMN IF EXISTS title,
DROP COLUMN IF EXISTS department,
ADD COLUMN position TEXT;