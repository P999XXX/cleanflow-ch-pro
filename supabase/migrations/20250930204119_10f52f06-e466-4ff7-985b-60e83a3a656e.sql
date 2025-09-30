-- Extend contact_persons table with is_employee flag
ALTER TABLE public.contact_persons 
ADD COLUMN is_employee BOOLEAN DEFAULT false;

-- Create employee_details table
CREATE TABLE public.employee_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_person_id UUID NOT NULL REFERENCES public.contact_persons(id) ON DELETE CASCADE,
  birth_date DATE,
  birth_place TEXT,
  current_address TEXT,
  address_since DATE,
  origin_country TEXT DEFAULT 'Schweiz',
  permit_type TEXT CHECK (permit_type IN ('CH', 'B', 'C', 'F', 'L')),
  permit_document_url TEXT,
  ahv_number TEXT,
  marital_status TEXT CHECK (marital_status IN ('ledig', 'verheiratet', 'geschieden', 'verwitwet', 'in_partnerschaft')),
  tax_residence BOOLEAN DEFAULT false,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  employment_start_date DATE,
  company_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(contact_person_id)
);

-- Create employee_children table
CREATE TABLE public.employee_children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_details_id UUID NOT NULL REFERENCES public.employee_details(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employee_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_children ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employee_details
CREATE POLICY "Users can view their company's employee details"
  ON public.employee_details FOR SELECT
  USING (company_id IN (
    SELECT id FROM public.companies WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can create employee details for their company"
  ON public.employee_details FOR INSERT
  WITH CHECK (company_id IN (
    SELECT id FROM public.companies WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can update their company's employee details"
  ON public.employee_details FOR UPDATE
  USING (company_id IN (
    SELECT id FROM public.companies WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete their company's employee details"
  ON public.employee_details FOR DELETE
  USING (company_id IN (
    SELECT id FROM public.companies WHERE owner_id = auth.uid()
  ));

-- RLS Policies for employee_children
CREATE POLICY "Users can view children of their company's employees"
  ON public.employee_children FOR SELECT
  USING (employee_details_id IN (
    SELECT id FROM public.employee_details WHERE company_id IN (
      SELECT id FROM public.companies WHERE owner_id = auth.uid()
    )
  ));

CREATE POLICY "Users can create children for their company's employees"
  ON public.employee_children FOR INSERT
  WITH CHECK (employee_details_id IN (
    SELECT id FROM public.employee_details WHERE company_id IN (
      SELECT id FROM public.companies WHERE owner_id = auth.uid()
    )
  ));

CREATE POLICY "Users can update children of their company's employees"
  ON public.employee_children FOR UPDATE
  USING (employee_details_id IN (
    SELECT id FROM public.employee_details WHERE company_id IN (
      SELECT id FROM public.companies WHERE owner_id = auth.uid()
    )
  ));

CREATE POLICY "Users can delete children of their company's employees"
  ON public.employee_children FOR DELETE
  USING (employee_details_id IN (
    SELECT id FROM public.employee_details WHERE company_id IN (
      SELECT id FROM public.companies WHERE owner_id = auth.uid()
    )
  ));

-- Create storage bucket for employee documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'employee-documents',
  'employee-documents',
  false,
  5242880,
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
);

-- Storage policies for employee documents
CREATE POLICY "Users can view their company's employee documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'employee-documents' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.companies WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload employee documents for their company"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'employee-documents' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.companies WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their company's employee documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'employee-documents' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.companies WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their company's employee documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'employee-documents' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.companies WHERE owner_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_employee_details_updated_at
  BEFORE UPDATE ON public.employee_details
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();