
-- Update handle_new_user to store referred_by from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_referral_code text;
  v_referrer_id uuid;
BEGIN
  v_referral_code := NEW.raw_user_meta_data ->> 'referred_by';
  
  INSERT INTO public.profiles (id, name, email, referred_by)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name', NEW.email, v_referral_code);
  
  -- Default role is student
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  -- If referred, create referral tracking record
  IF v_referral_code IS NOT NULL AND v_referral_code != '' THEN
    SELECT id INTO v_referrer_id FROM public.profiles WHERE referral_code = v_referral_code;
    IF v_referrer_id IS NOT NULL AND v_referrer_id != NEW.id THEN
      INSERT INTO public.referrals (referrer_id, referred_id)
      VALUES (v_referrer_id, NEW.id);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Also need to generate referral codes for existing users who don't have one
UPDATE public.profiles
SET referral_code = upper(substr(md5(random()::text || id::text), 1, 8))
WHERE referral_code IS NULL;
