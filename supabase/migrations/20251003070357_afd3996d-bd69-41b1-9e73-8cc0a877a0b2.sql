-- ============================================
-- Security Enhancement for Employee Details
-- ============================================

-- Step 1: Add user_id column to contact_persons to link employees with auth users
-- This is crucial for RLS to work properly with employee data
ALTER TABLE public.contact_persons 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_contact_persons_user_id ON public.contact_persons(user_id);

-- Step 2: Create helper function to check if user is admin or masteradmin
CREATE OR REPLACE FUNCTION public.is_company_admin(_user_id uuid, _company_id uuid)
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
      AND company_id = _company_id
      AND role IN ('masteradministrator', 'administrator')
  )
$$;

-- Step 3: Drop existing RLS policy for SELECT on employee_details
DROP POLICY IF EXISTS "Users can view their company's employee details" ON public.employee_details;

-- Step 4: Create new strict RLS policy for SELECT on employee_details
-- Admins can see all employee details of their company
-- Regular employees can only see their own employee details
CREATE POLICY "Strict employee details access"
ON public.employee_details
FOR SELECT
USING (
  -- Check if user is admin of the company
  public.is_company_admin(auth.uid(), company_id)
  OR
  -- OR check if this is the employee's own record
  contact_person_id IN (
    SELECT id 
    FROM public.contact_persons 
    WHERE user_id = auth.uid()
  )
);

-- Step 5: Add comment explaining the security model
COMMENT ON POLICY "Strict employee details access" ON public.employee_details IS 
'Admins (masteradministrator, administrator) can view all employee details in their company. Regular employees can only view their own employee details.';

-- Step 6: Ensure UPDATE and INSERT policies are also strict
DROP POLICY IF EXISTS "Users can update their company's employee details" ON public.employee_details;

CREATE POLICY "Strict employee details update"
ON public.employee_details
FOR UPDATE
USING (
  -- Only admins can update employee details
  public.is_company_admin(auth.uid(), company_id)
  OR
  -- OR employees can update their own details (limited fields)
  contact_person_id IN (
    SELECT id 
    FROM public.contact_persons 
    WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can create employee details for their company" ON public.employee_details;

CREATE POLICY "Strict employee details insert"
ON public.employee_details
FOR INSERT
WITH CHECK (
  -- Only admins can create employee details
  public.is_company_admin(auth.uid(), company_id)
);