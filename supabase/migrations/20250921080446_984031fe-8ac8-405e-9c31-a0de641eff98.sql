-- Add account status to profiles table for soft delete functionality
ALTER TABLE public.profiles 
ADD COLUMN account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'deleted', 'suspended'));

-- Add deleted_at timestamp for when account was deleted
ALTER TABLE public.profiles 
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create function to soft delete user account
CREATE OR REPLACE FUNCTION public.soft_delete_user_account()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile to mark as deleted
  UPDATE public.profiles 
  SET 
    account_status = 'deleted',
    deleted_at = NOW()
  WHERE user_id = auth.uid();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies to exclude deleted users from normal operations
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id AND account_status = 'active');

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id AND account_status = 'active');

-- Allow users to mark their own account as deleted
CREATE POLICY "Users can soft delete their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id AND account_status = 'active')
WITH CHECK (auth.uid() = user_id);