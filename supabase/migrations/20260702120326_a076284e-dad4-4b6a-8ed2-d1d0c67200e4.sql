REVOKE EXECUTE ON FUNCTION public.admin_get_quizzes() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.can_access_tier(uuid, public.task_tier) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.get_user_execution_score(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.redeem_reward(uuid, uuid) FROM anon, authenticated, public;

REVOKE EXECUTE ON FUNCTION public.get_active_quizzes_for_play() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_active_quizzes_for_play() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.submit_quiz_attempt(uuid, jsonb, integer) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.submit_quiz_attempt(uuid, jsonb, integer) TO authenticated;