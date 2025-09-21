-- Optimierte RLS-Policies für user_roles Tabelle
-- Lösche die bestehende einschränkende SELECT-Policy
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Erstelle eine verbesserte SELECT-Policy, die Benutzern erlaubt:
-- 1. Ihre eigenen Rollen zu sehen
-- 2. Rollen in ihrer Firma zu sehen (wenn sie Zugang zur Firma haben)
CREATE POLICY "Users can view roles in their company" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (
  -- Benutzer können ihre eigenen Rollen sehen
  auth.uid() = user_id 
  OR 
  -- Benutzer können Rollen in Firmen sehen, zu denen sie Zugang haben
  company_id IN (
    SELECT companies.id
    FROM companies
    WHERE companies.owner_id = auth.uid()
  )
);

-- Verbessere die INSERT-Policy für bessere Sicherheit
DROP POLICY IF EXISTS "Users can create roles for their company" ON public.user_roles;

CREATE POLICY "Users can create roles for their company" 
ON public.user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (
  company_id IN (
    SELECT companies.id
    FROM companies
    WHERE companies.owner_id = auth.uid()
  )
  AND
  -- Stelle sicher, dass nur gültige Rollen zugewiesen werden können
  role IN ('masteradministrator', 'administrator', 'employee')
);

-- Verbessere die UPDATE-Policy
DROP POLICY IF EXISTS "Users can update roles for their company" ON public.user_roles;

CREATE POLICY "Users can update roles for their company" 
ON public.user_roles 
FOR UPDATE 
TO authenticated
USING (
  company_id IN (
    SELECT companies.id
    FROM companies
    WHERE companies.owner_id = auth.uid()
  )
)
WITH CHECK (
  company_id IN (
    SELECT companies.id
    FROM companies
    WHERE companies.owner_id = auth.uid()
  )
  AND
  role IN ('masteradministrator', 'administrator', 'employee')
);