-- Add new fields to employee_details table for HR and salary data
ALTER TABLE public.employee_details
ADD COLUMN IF NOT EXISTS hourly_wage numeric(10,2),
ADD COLUMN IF NOT EXISTS iban text,
ADD COLUMN IF NOT EXISTS employment_rate numeric(5,2) DEFAULT 100.00,
ADD COLUMN IF NOT EXISTS nationality text DEFAULT 'Schweiz';

-- Add constraint to ensure employment_rate is between 0 and 100
ALTER TABLE public.employee_details
ADD CONSTRAINT employment_rate_check CHECK (employment_rate > 0 AND employment_rate <= 100);

-- Add constraint to ensure hourly_wage is positive
ALTER TABLE public.employee_details
ADD CONSTRAINT hourly_wage_check CHECK (hourly_wage IS NULL OR hourly_wage > 0);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_employee_details_contact_person_id ON public.employee_details(contact_person_id);
CREATE INDEX IF NOT EXISTS idx_employee_children_employee_details_id ON public.employee_children(employee_details_id);