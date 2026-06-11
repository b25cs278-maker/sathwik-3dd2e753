
REVOKE SELECT ON public.referrals FROM authenticated, anon;
GRANT SELECT (
  id, referrer_id, referred_id, status, counted,
  email_verified, quiz_completed, created_at, validated_at
) ON public.referrals TO authenticated;
GRANT INSERT ON public.referrals TO authenticated;

REVOKE UPDATE ON public.profiles FROM authenticated, anon;
GRANT UPDATE (
  name, avatar_url, bio, headline, location, website,
  linkedin_url, github_url, skills, experience, education,
  is_visible, cover_image_url
) ON public.profiles TO authenticated;

GRANT DELETE ON public.profiles TO authenticated;
