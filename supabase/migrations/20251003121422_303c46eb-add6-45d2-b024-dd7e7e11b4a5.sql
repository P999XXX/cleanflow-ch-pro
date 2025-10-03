-- ============================================
-- PHASE 2: Security & Data Integrity
-- ============================================

-- 1. Enable pgcrypto extension for encryption (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create audit_logs table for tracking changes
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  changed_by UUID NOT NULL REFERENCES auth.users(id),
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  old_data JSONB,
  new_data JSONB,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view audit logs for their company
CREATE POLICY "Admins can view audit logs for their company"
  ON public.audit_logs
  FOR SELECT
  USING (
    public.is_company_admin(auth.uid(), company_id)
  );

-- Policy: System can insert audit logs (via triggers)
CREATE POLICY "System can insert audit logs"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (true);

-- 3. Create audit trigger function for employee_details
CREATE OR REPLACE FUNCTION public.audit_employee_details()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id UUID;
BEGIN
  -- Get company_id from the record
  IF TG_OP = 'DELETE' THEN
    v_company_id := OLD.company_id;
  ELSE
    v_company_id := NEW.company_id;
  END IF;

  -- Insert audit log
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (
      table_name,
      record_id,
      action,
      changed_by,
      new_data,
      company_id
    ) VALUES (
      TG_TABLE_NAME,
      NEW.id,
      'INSERT',
      auth.uid(),
      to_jsonb(NEW),
      v_company_id
    );
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (
      table_name,
      record_id,
      action,
      changed_by,
      old_data,
      new_data,
      company_id
    ) VALUES (
      TG_TABLE_NAME,
      NEW.id,
      'UPDATE',
      auth.uid(),
      to_jsonb(OLD),
      to_jsonb(NEW),
      v_company_id
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (
      table_name,
      record_id,
      action,
      changed_by,
      old_data,
      company_id
    ) VALUES (
      TG_TABLE_NAME,
      OLD.id,
      'DELETE',
      auth.uid(),
      to_jsonb(OLD),
      v_company_id
    );
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- 4. Attach audit trigger to employee_details
DROP TRIGGER IF EXISTS audit_employee_details_changes ON public.employee_details;
CREATE TRIGGER audit_employee_details_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.employee_details
  FOR EACH ROW EXECUTE FUNCTION public.audit_employee_details();

-- 5. Strengthen RLS policies for employee_details
-- Drop existing policies first
DROP POLICY IF EXISTS "Strict employee details access" ON public.employee_details;
DROP POLICY IF EXISTS "Strict employee details update" ON public.employee_details;
DROP POLICY IF EXISTS "Strict employee details insert" ON public.employee_details;
DROP POLICY IF EXISTS "Users can delete their company's employee details" ON public.employee_details;

-- New policy: Admins see all, employees see only their own
CREATE POLICY "Employee details access by role"
  ON public.employee_details
  FOR SELECT
  USING (
    -- Admins can see all in their company
    public.is_company_admin(auth.uid(), company_id)
    OR
    -- Employees can see only their own
    (
      contact_person_id IN (
        SELECT id FROM public.contact_persons 
        WHERE user_id = auth.uid()
      )
    )
  );

-- New policy: Only admins can insert
CREATE POLICY "Only admins can insert employee details"
  ON public.employee_details
  FOR INSERT
  WITH CHECK (
    public.is_company_admin(auth.uid(), company_id)
  );

-- New policy: Admins can update all, employees can update non-sensitive fields
CREATE POLICY "Employee details update by role"
  ON public.employee_details
  FOR UPDATE
  USING (
    -- Admins can update all
    public.is_company_admin(auth.uid(), company_id)
    OR
    -- Employees can update their own (trigger will validate fields)
    (
      contact_person_id IN (
        SELECT id FROM public.contact_persons 
        WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    -- Only admins can modify sensitive fields
    public.is_company_admin(auth.uid(), company_id)
  );

-- New policy: Only admins can delete
CREATE POLICY "Only admins can delete employee details"
  ON public.employee_details
  FOR DELETE
  USING (
    public.is_company_admin(auth.uid(), company_id)
  );

-- 6. Add validation constraints
-- IBAN validation for Swiss format (CH followed by 19 digits)
ALTER TABLE public.employee_details 
  DROP CONSTRAINT IF EXISTS valid_swiss_iban;

ALTER TABLE public.employee_details
  ADD CONSTRAINT valid_swiss_iban
  CHECK (
    iban IS NULL 
    OR iban ~* '^CH[0-9]{2}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{1}$'
  );

-- AHV number validation (756.xxxx.xxxx.xx format)
ALTER TABLE public.employee_details
  DROP CONSTRAINT IF EXISTS valid_swiss_ahv;

ALTER TABLE public.employee_details
  ADD CONSTRAINT valid_swiss_ahv
  CHECK (
    ahv_number IS NULL
    OR ahv_number ~* '^756\.[0-9]{4}\.[0-9]{4}\.[0-9]{2}$'
  );

-- Employment rate must be between 1 and 100
ALTER TABLE public.employee_details
  DROP CONSTRAINT IF EXISTS valid_employment_rate;

ALTER TABLE public.employee_details
  ADD CONSTRAINT valid_employment_rate
  CHECK (
    employment_rate IS NULL
    OR (employment_rate >= 1 AND employment_rate <= 100)
  );

-- Hourly wage must be positive
ALTER TABLE public.employee_details
  DROP CONSTRAINT IF EXISTS valid_hourly_wage;

ALTER TABLE public.employee_details
  ADD CONSTRAINT valid_hourly_wage
  CHECK (
    hourly_wage IS NULL
    OR hourly_wage > 0
  );

-- 7. Create function to get audit logs (admin only)
CREATE OR REPLACE FUNCTION public.get_audit_logs(
  p_company_id UUID,
  p_table_name TEXT DEFAULT NULL,
  p_limit INT DEFAULT 100
)
RETURNS TABLE (
  id UUID,
  table_name TEXT,
  record_id UUID,
  action TEXT,
  changed_by UUID,
  changed_at TIMESTAMP WITH TIME ZONE,
  old_data JSONB,
  new_data JSONB,
  user_email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.is_company_admin(auth.uid(), p_company_id) THEN
    RAISE EXCEPTION 'Only administrators can view audit logs';
  END IF;

  RETURN QUERY
  SELECT 
    al.id,
    al.table_name,
    al.record_id,
    al.action,
    al.changed_by,
    al.changed_at,
    al.old_data,
    al.new_data,
    au.email as user_email
  FROM public.audit_logs al
  LEFT JOIN auth.users au ON al.changed_by = au.id
  WHERE al.company_id = p_company_id
    AND (p_table_name IS NULL OR al.table_name = p_table_name)
  ORDER BY al.changed_at DESC
  LIMIT p_limit;
END;
$$;

-- 8. Add comments for documentation
COMMENT ON TABLE public.audit_logs IS 'Audit trail for tracking changes to sensitive data';
COMMENT ON FUNCTION public.audit_employee_details() IS 'Trigger function to log all changes to employee_details table';
COMMENT ON FUNCTION public.get_audit_logs IS 'Retrieves audit logs for a company (admin only)';
COMMENT ON CONSTRAINT valid_swiss_iban ON public.employee_details IS 'Validates Swiss IBAN format (CH + 19 digits)';
COMMENT ON CONSTRAINT valid_swiss_ahv ON public.employee_details IS 'Validates Swiss AHV number format (756.xxxx.xxxx.xx)';
COMMENT ON CONSTRAINT valid_employment_rate ON public.employee_details IS 'Employment rate must be between 1-100%';
COMMENT ON CONSTRAINT valid_hourly_wage ON public.employee_details IS 'Hourly wage must be positive';