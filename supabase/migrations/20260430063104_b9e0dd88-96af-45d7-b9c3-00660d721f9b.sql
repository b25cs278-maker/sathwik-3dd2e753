
-- Revoke EXECUTE from PUBLIC, anon, and authenticated for all internal SECURITY DEFINER functions.
-- Triggers and RLS policies will continue to work because they execute with the function owner's
-- privileges regardless of the EXECUTE grant on the API roles.

-- Helpers referenced only inside RLS / server code
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.can_access_tier(uuid, task_tier) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_user_execution_score(uuid) FROM PUBLIC, anon, authenticated;

-- Reward redemption: not currently called from the client; lock it down
REVOKE EXECUTE ON FUNCTION public.redeem_reward(uuid, uuid) FROM PUBLIC, anon, authenticated;

-- Trigger-only functions: never called directly
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_referral_code() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_post_likes_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_post_comments_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_network_post_engagement_counts() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_network_post_comments_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_event_attendees_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_group_members_count() FROM PUBLIC, anon, authenticated;

-- Keep EXECUTE for the two functions actually invoked from the app:
--   public.validate_referral(uuid)        -- called by signed-in users after the quiz
--   public.award_submission_points(uuid, integer, uuid)  -- called by admins; function checks role internally
-- Make sure they can be called by authenticated users (they default to PUBLIC; this is explicit).
GRANT EXECUTE ON FUNCTION public.validate_referral(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.award_submission_points(uuid, integer, uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_referral(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.award_submission_points(uuid, integer, uuid) FROM anon;
