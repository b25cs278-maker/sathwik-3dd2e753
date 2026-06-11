
-- Trigger / internal functions: not meant to be RPC-callable
REVOKE EXECUTE ON FUNCTION public.update_post_likes_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_post_comments_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_network_post_comments_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_network_post_engagement_counts() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_event_attendees_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_group_members_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_referral_code() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Admin-only RPCs
REVOKE EXECUTE ON FUNCTION public.award_submission_points(uuid, integer, uuid) FROM PUBLIC, anon, authenticated;

-- Keep authenticated-callable RPCs explicit (idempotent)
GRANT EXECUTE ON FUNCTION public.redeem_reward(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_referral(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.can_access_tier(uuid, task_tier) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_execution_score(uuid) TO authenticated;
