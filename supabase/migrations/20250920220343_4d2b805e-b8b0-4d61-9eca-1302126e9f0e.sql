-- Erstelle Kunden-Unternehmen Tabelle
CREATE TABLE public.customer_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  country TEXT DEFAULT 'Schweiz',
  phone TEXT,
  email TEXT,
  website TEXT,
  vat_number TEXT,
  notes TEXT,
  status TEXT DEFAULT 'aktiv' CHECK (status IN ('aktiv', 'inaktiv', 'potenziell')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Erstelle Kontaktpersonen Tabelle
CREATE TABLE public.contact_persons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  customer_company_id UUID REFERENCES public.customer_companies(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  title TEXT,
  department TEXT,
  phone TEXT,
  mobile TEXT,
  email TEXT,
  notes TEXT,
  is_primary_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.customer_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_persons ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for customer_companies
CREATE POLICY "Users can view their company's customer companies" 
ON public.customer_companies 
FOR SELECT 
USING (
  company_id IN (
    SELECT id FROM public.companies WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Users can create customer companies for their company" 
ON public.customer_companies 
FOR INSERT 
WITH CHECK (
  company_id IN (
    SELECT id FROM public.companies WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Users can update their company's customer companies" 
ON public.customer_companies 
FOR UPDATE 
USING (
  company_id IN (
    SELECT id FROM public.companies WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their company's customer companies" 
ON public.customer_companies 
FOR DELETE 
USING (
  company_id IN (
    SELECT id FROM public.companies WHERE owner_id = auth.uid()
  )
);

-- Create RLS policies for contact_persons
CREATE POLICY "Users can view their company's contact persons" 
ON public.contact_persons 
FOR SELECT 
USING (
  company_id IN (
    SELECT id FROM public.companies WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Users can create contact persons for their company" 
ON public.contact_persons 
FOR INSERT 
WITH CHECK (
  company_id IN (
    SELECT id FROM public.companies WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Users can update their company's contact persons" 
ON public.contact_persons 
FOR UPDATE 
USING (
  company_id IN (
    SELECT id FROM public.companies WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their company's contact persons" 
ON public.contact_persons 
FOR DELETE 
USING (
  company_id IN (
    SELECT id FROM public.companies WHERE owner_id = auth.uid()
  )
);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_customer_companies_updated_at
  BEFORE UPDATE ON public.customer_companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_persons_updated_at
  BEFORE UPDATE ON public.contact_persons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_customer_companies_company_id ON public.customer_companies(company_id);
CREATE INDEX idx_customer_companies_status ON public.customer_companies(status);
CREATE INDEX idx_contact_persons_company_id ON public.contact_persons(company_id);
CREATE INDEX idx_contact_persons_customer_company_id ON public.contact_persons(customer_company_id);
CREATE INDEX idx_contact_persons_primary_contact ON public.contact_persons(is_primary_contact);