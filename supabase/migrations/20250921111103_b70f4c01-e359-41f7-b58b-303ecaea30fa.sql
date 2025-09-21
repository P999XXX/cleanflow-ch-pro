-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('masteradministrator', 'administrator', 'objektleiter', 'reinigungsmitarbeiter');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role, company_id)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS TABLE(role app_role, company_name TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ur.role, c.name as company_name
  FROM public.user_roles ur
  LEFT JOIN public.companies c ON ur.company_id = c.id
  WHERE ur.user_id = _user_id
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create roles for their company"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  company_id IN (
    SELECT id FROM public.companies WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Users can update roles for their company"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (
  company_id IN (
    SELECT id FROM public.companies WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Users can delete roles for their company"
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  company_id IN (
    SELECT id FROM public.companies WHERE owner_id = auth.uid()
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update the handle_new_user function to assign masteradministrator role when company is created
CREATE OR REPLACE FUNCTION public.assign_masteradmin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert masteradministrator role for the company owner
  INSERT INTO public.user_roles (user_id, role, company_id)
  VALUES (NEW.owner_id, 'masteradministrator', NEW.id);
  
  RETURN NEW;
END;
$$;

-- Create trigger to assign masteradmin role when company is created
CREATE TRIGGER assign_masteradmin_on_company_creation
AFTER INSERT ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.assign_masteradmin_role();