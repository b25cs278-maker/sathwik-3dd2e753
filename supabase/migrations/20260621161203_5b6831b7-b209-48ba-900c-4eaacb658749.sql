
-- Remove broad client SELECT on quizzes (answer keys exposed) - admin policy retained for management
DROP POLICY IF EXISTS "Authenticated users can view active quizzes" ON public.quizzes;

-- Remove direct client INSERT on quiz_attempts (bypasses server grading)
DROP POLICY IF EXISTS "Users can create their own attempts" ON public.quiz_attempts;

-- Ensure RPCs used by clients still work via SECURITY DEFINER (they use service-bypass).
-- Lock down direct table access from PostgREST for non-admins.
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.quizzes FROM authenticated, anon;
REVOKE INSERT, UPDATE, DELETE ON public.quiz_attempts FROM authenticated, anon;
-- Keep SELECT on quiz_attempts so the "Users can view their own attempts" policy works
GRANT SELECT ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quizzes TO service_role;
GRANT ALL ON public.quiz_attempts TO service_role;

-- Ensure clients can call the sanitized RPCs
GRANT EXECUTE ON FUNCTION public.get_active_quizzes_for_play() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.submit_quiz_attempt(uuid, jsonb, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_quizzes() TO authenticated;

-- Restrict EXECUTE on sensitive SECURITY DEFINER admin functions so signed-in users can't call them.
REVOKE EXECUTE ON FUNCTION public.award_submission_points(uuid, integer, uuid) FROM authenticated, anon, public;
GRANT  EXECUTE ON FUNCTION public.award_submission_points(uuid, integer, uuid) TO service_role;

REVOKE EXECUTE ON FUNCTION public.validate_referral(uuid) FROM authenticated, anon, public;
GRANT  EXECUTE ON FUNCTION public.validate_referral(uuid) TO service_role;
