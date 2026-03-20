
-- Add referral-related columns to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by text,
  ADD COLUMN IF NOT EXISTS referrals_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS valid_referrals integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quiz_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS quiz_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS extra_attempt_unlocked boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS bonus_given boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS device_id text,
  ADD COLUMN IF NOT EXISTS user_ip text;

-- Create referrals tracking table
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL,
  referred_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  counted boolean NOT NULL DEFAULT false,
  referred_ip text,
  referred_device_id text,
  email_verified boolean NOT NULL DEFAULT false,
  quiz_completed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  validated_at timestamp with time zone,
  UNIQUE(referrer_id, referred_id)
);

-- Enable RLS on referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS policies for referrals
CREATE POLICY "Users can view their own referrals as referrer"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id);

CREATE POLICY "Users can view referrals where they are referred"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referred_id);

CREATE POLICY "Admins can view all referrals"
  ON public.referrals FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert referrals"
  ON public.referrals FOR INSERT
  WITH CHECK (auth.uid() = referred_id);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  code text;
  exists_count integer;
BEGIN
  LOOP
    code := upper(substr(md5(random()::text || NEW.id::text), 1, 8));
    SELECT count(*) INTO exists_count FROM public.profiles WHERE referral_code = code;
    EXIT WHEN exists_count = 0;
  END LOOP;
  NEW.referral_code := code;
  RETURN NEW;
END;
$$;

-- Trigger to auto-generate referral code on profile creation
CREATE TRIGGER set_referral_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  WHEN (NEW.referral_code IS NULL)
  EXECUTE FUNCTION public.generate_referral_code();

-- Function to validate and process referral
CREATE OR REPLACE FUNCTION public.validate_referral(p_referred_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_referral RECORD;
  v_referred_profile RECORD;
  v_referrer_profile RECORD;
  v_ip_count integer;
  v_points_per_referral integer := 10;
BEGIN
  -- Get the referral record
  SELECT * INTO v_referral FROM public.referrals 
    WHERE referred_id = p_referred_id AND counted = false
    LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'No pending referral found');
  END IF;

  -- Check self-referral
  IF v_referral.referrer_id = p_referred_id THEN
    UPDATE public.referrals SET status = 'invalid' WHERE id = v_referral.id;
    RETURN jsonb_build_object('success', false, 'error', 'Self-referral not allowed');
  END IF;

  -- Get referred user profile
  SELECT * INTO v_referred_profile FROM public.profiles WHERE id = p_referred_id;
  
  -- Check quiz completed
  IF NOT v_referred_profile.quiz_completed THEN
    RETURN jsonb_build_object('success', false, 'error', 'Quiz not completed');
  END IF;

  -- Check IP limit (max 3 referrals per IP)
  IF v_referral.referred_ip IS NOT NULL THEN
    SELECT count(*) INTO v_ip_count FROM public.referrals 
      WHERE referred_ip = v_referral.referred_ip AND counted = true;
    IF v_ip_count >= 3 THEN
      UPDATE public.referrals SET status = 'invalid' WHERE id = v_referral.id;
      RETURN jsonb_build_object('success', false, 'error', 'IP limit exceeded');
    END IF;
  END IF;

  -- Check device limit (max 3 referrals per device)
  IF v_referral.referred_device_id IS NOT NULL THEN
    SELECT count(*) INTO v_ip_count FROM public.referrals 
      WHERE referred_device_id = v_referral.referred_device_id AND counted = true;
    IF v_ip_count >= 3 THEN
      UPDATE public.referrals SET status = 'invalid' WHERE id = v_referral.id;
      RETURN jsonb_build_object('success', false, 'error', 'Device limit exceeded');
    END IF;
  END IF;

  -- All checks passed - validate referral
  UPDATE public.referrals 
    SET status = 'valid', counted = true, quiz_completed = true, validated_at = now()
    WHERE id = v_referral.id;

  -- Update referrer stats
  UPDATE public.profiles 
    SET referrals_count = referrals_count + 1,
        valid_referrals = valid_referrals + 1,
        points = COALESCE(points, 0) + v_points_per_referral
    WHERE id = v_referral.referrer_id;

  -- Unlock extra attempt for referrer if first valid referral
  UPDATE public.profiles
    SET extra_attempt_unlocked = true
    WHERE id = v_referral.referrer_id AND valid_referrals >= 1 AND extra_attempt_unlocked = false;

  -- Log activity
  INSERT INTO public.activity_logs (user_id, event_type, payload)
  VALUES (v_referral.referrer_id, 'referral_validated', jsonb_build_object(
    'referred_id', p_referred_id,
    'points_earned', v_points_per_referral
  ));

  RETURN jsonb_build_object('success', true, 'points_earned', v_points_per_referral);
END;
$$;

-- Enable realtime for leaderboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.referrals;
