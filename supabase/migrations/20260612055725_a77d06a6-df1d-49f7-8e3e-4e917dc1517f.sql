
CREATE OR REPLACE FUNCTION public.admin_get_quizzes()
RETURNS SETOF public.quizzes
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  RETURN QUERY SELECT * FROM public.quizzes ORDER BY created_at DESC;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_get_quizzes() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_get_quizzes() TO authenticated;
