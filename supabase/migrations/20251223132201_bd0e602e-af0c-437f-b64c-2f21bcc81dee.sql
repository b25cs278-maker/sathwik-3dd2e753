-- Update the can_access_tier function to remove company tier
CREATE OR REPLACE FUNCTION public.can_access_tier(p_user_id uuid, p_tier task_tier)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE p_tier
    WHEN 'basic' THEN true
    WHEN 'advanced' THEN public.get_user_execution_score(p_user_id) >= 70
    WHEN 'company' THEN false -- Company tier disabled
    ELSE false
  END;
$$;