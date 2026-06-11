
REVOKE EXECUTE ON FUNCTION public.validate_referral(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
