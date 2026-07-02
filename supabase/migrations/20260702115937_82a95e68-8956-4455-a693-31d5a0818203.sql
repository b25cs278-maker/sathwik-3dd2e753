GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (name, email, avatar_url, bio, headline, location, website, linkedin_url, github_url, skills, experience, education, is_visible, cover_image_url, last_active) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

REVOKE SELECT (device_id, user_ip) ON public.profiles FROM authenticated, anon;
REVOKE UPDATE (points, profile_views, referral_code, referred_by, referrals_count, valid_referrals, quiz_completed, quiz_attempts, extra_attempt_unlocked, bonus_given, device_id, user_ip) ON public.profiles FROM authenticated, anon;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated, anon;

REVOKE SELECT (referred_ip, referred_device_id) ON public.referrals FROM authenticated, anon;