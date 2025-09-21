-- Fix security warning: Set search_path for the function
CREATE OR REPLACE FUNCTION public.soft_delete_user_account()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update profile to mark as deleted
  UPDATE public.profiles 
  SET 
    account_status = 'deleted',
    deleted_at = NOW()
  WHERE user_id = auth.uid();
  
  RETURN NEW;
END;
$$;