-- Fix RLS policies to allow soft delete functionality
-- Drop existing policies that are blocking the update
DROP POLICY IF EXISTS "Users can soft delete their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a comprehensive update policy that allows status changes including soft delete
CREATE POLICY "Users can update their own profile including status" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create a separate policy for viewing that excludes deleted accounts from normal operations
-- but allows the user to see their own profile during the deletion process
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);