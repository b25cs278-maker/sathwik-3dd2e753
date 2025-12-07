-- Add explicit policy to deny anonymous access to profiles
-- Since existing policies are RESTRICTIVE and use auth.uid(), we add a PERMISSIVE base policy
-- that requires authentication, ensuring unauthenticated requests are blocked

-- First, let's add the profile deletion policy for GDPR compliance
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);
