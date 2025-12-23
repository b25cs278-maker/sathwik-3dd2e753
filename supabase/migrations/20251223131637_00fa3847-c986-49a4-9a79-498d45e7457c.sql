-- Add task tier enum
CREATE TYPE public.task_tier AS ENUM ('basic', 'advanced', 'company');

-- Add tier column to tasks table
ALTER TABLE public.tasks ADD COLUMN tier public.task_tier NOT NULL DEFAULT 'basic';

-- Create function to get user's average execution score
CREATE OR REPLACE FUNCTION public.get_user_execution_score(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT ROUND(AVG(overall_score))::integer
     FROM (
       SELECT overall_score
       FROM public.task_evaluations
       WHERE user_id = p_user_id
       ORDER BY evaluated_at DESC
       LIMIT 5
     ) recent_scores),
    0
  );
$$;

-- Create function to check if user can access a task tier
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
    WHEN 'company' THEN public.get_user_execution_score(p_user_id) >= 85
    ELSE false
  END;
$$;

-- Update RLS policy for tasks to include tier-based access
DROP POLICY IF EXISTS "Anyone can view active tasks" ON public.tasks;

CREATE POLICY "Users can view accessible active tasks"
ON public.tasks
FOR SELECT
USING (
  is_active = true 
  AND (
    tier = 'basic' 
    OR public.can_access_tier(auth.uid(), tier)
  )
);