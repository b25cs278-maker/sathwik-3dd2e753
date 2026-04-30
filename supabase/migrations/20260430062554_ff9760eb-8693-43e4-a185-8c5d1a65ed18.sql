
-- Fix profile email exposure: require authentication for visible-profile reads
DROP POLICY IF EXISTS "Users can view visible profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view visible profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
  (is_visible = true AND auth.uid() IS NOT NULL)
  OR auth.uid() = id
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Fix partners contact_email exposure: require authentication
DROP POLICY IF EXISTS "Anyone can view active partners" ON public.partners;
CREATE POLICY "Authenticated users can view active partners"
ON public.partners FOR SELECT
TO authenticated
USING (is_active = true);

-- Harden award_submission_points: require admin reviewer
CREATE OR REPLACE FUNCTION public.award_submission_points(p_submission_id uuid, p_points integer, p_reviewer_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
BEGIN
  -- Authorization: only admins may award points, and reviewer must match the caller
  IF p_reviewer_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: reviewer mismatch';
  END IF;
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;
  IF p_points IS NULL OR p_points < 0 OR p_points > 10000 THEN
    RAISE EXCEPTION 'Invalid points value';
  END IF;

  SELECT user_id INTO v_user_id FROM public.task_submissions WHERE id = p_submission_id;
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Submission not found';
  END IF;

  -- Prevent double-awarding
  IF EXISTS (SELECT 1 FROM public.task_submissions WHERE id = p_submission_id AND status = 'approved') THEN
    RAISE EXCEPTION 'Submission already approved';
  END IF;

  UPDATE public.task_submissions
  SET status = 'approved',
      points_awarded = p_points,
      reviewer_id = p_reviewer_id,
      reviewed_at = now()
  WHERE id = p_submission_id;

  UPDATE public.profiles
  SET points = COALESCE(points, 0) + p_points
  WHERE id = v_user_id;

  INSERT INTO public.activity_logs (user_id, event_type, payload)
  VALUES (v_user_id, 'points_awarded', jsonb_build_object(
    'submission_id', p_submission_id,
    'points', p_points,
    'reviewer_id', p_reviewer_id
  ));
END;
$function$;

-- Make submission photo bucket private and add owner/admin RLS policies
UPDATE storage.buckets SET public = false WHERE id = 'my-bucket-green';

DROP POLICY IF EXISTS "my-bucket-green users can upload" ON storage.objects;
DROP POLICY IF EXISTS "my-bucket-green owners can read" ON storage.objects;
DROP POLICY IF EXISTS "my-bucket-green admins can read" ON storage.objects;
DROP POLICY IF EXISTS "my-bucket-green owners can update" ON storage.objects;
DROP POLICY IF EXISTS "my-bucket-green owners can delete" ON storage.objects;

CREATE POLICY "my-bucket-green users can upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'my-bucket-green'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "my-bucket-green owners can read"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'my-bucket-green'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "my-bucket-green admins can read"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'my-bucket-green'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "my-bucket-green owners can update"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'my-bucket-green'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "my-bucket-green owners can delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'my-bucket-green'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
