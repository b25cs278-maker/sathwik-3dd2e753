-- Add badges table
CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon_url text,
  criteria jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add rewards table
CREATE TABLE public.rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  cost_points integer NOT NULL,
  stock integer,
  image_url text,
  redeemable_external boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add redemptions table
CREATE TABLE public.redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  reward_id uuid REFERENCES public.rewards(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  fulfilled_at timestamptz
);

-- Add user_badges junction table
CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_id uuid REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now()
);

-- Add activity logs table
CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  event_type text NOT NULL,
  payload jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Badges policies (public read, admin write)
CREATE POLICY "Anyone can view badges" ON public.badges
FOR SELECT USING (true);

CREATE POLICY "Admins can manage badges" ON public.badges
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Rewards policies (public read active, admin write)
CREATE POLICY "Anyone can view active rewards" ON public.rewards
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage rewards" ON public.rewards
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Redemptions policies
CREATE POLICY "Users can view their own redemptions" ON public.redemptions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own redemptions" ON public.redemptions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all redemptions" ON public.redemptions
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update redemptions" ON public.redemptions
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- User badges policies
CREATE POLICY "Users can view their own badges" ON public.user_badges
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user badges" ON public.user_badges
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage user badges" ON public.user_badges
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Activity logs policies (users see own, admins see all)
CREATE POLICY "Users can view their own activity" ON public.activity_logs
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity" ON public.activity_logs
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert activity logs" ON public.activity_logs
FOR INSERT WITH CHECK (true);

-- Add verification_score to task_submissions for AI hybrid verification
ALTER TABLE public.task_submissions 
ADD COLUMN IF NOT EXISTS ai_verification_score integer,
ADD COLUMN IF NOT EXISTS ai_verification_notes text,
ADD COLUMN IF NOT EXISTS ai_flagged boolean DEFAULT false;

-- Insert default badges
INSERT INTO public.badges (name, description, criteria, icon_url) VALUES
('Green Novice', 'Complete your first 5 environmental tasks', '{"type": "tasks_completed", "value": 5}', '/badges/novice.svg'),
('Eco Contributor', 'Complete 25 environmental tasks', '{"type": "tasks_completed", "value": 25}', '/badges/contributor.svg'),
('Clean City Hero', 'Earn 100 points from community cleaning tasks', '{"type": "category_points", "category": "community", "value": 100}', '/badges/hero.svg'),
('Recycling Champion', 'Complete 10 recycling tasks', '{"type": "category_tasks", "category": "recycling", "value": 10}', '/badges/recycling.svg'),
('Water Guardian', 'Complete 10 water conservation tasks', '{"type": "category_tasks", "category": "conservation", "value": 10}', '/badges/water.svg');

-- Insert default rewards
INSERT INTO public.rewards (name, description, cost_points, stock, is_active) VALUES
('Eco T-Shirt', 'Organic cotton t-shirt with EcoLearn logo', 500, 100, true),
('Reusable Water Bottle', 'BPA-free stainless steel water bottle', 300, 200, true),
('Tree Planting Certificate', 'We plant a tree in your name', 250, null, true),
('Premium Course Access', 'Unlock advanced environmental courses', 1000, null, true),
('Eco Starter Kit', 'Bamboo cutlery set, reusable bags, and more', 750, 50, true);

-- Function to award points and update badges
CREATE OR REPLACE FUNCTION public.award_submission_points(
  p_submission_id uuid,
  p_points integer,
  p_reviewer_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user_id from submission
  SELECT user_id INTO v_user_id FROM public.task_submissions WHERE id = p_submission_id;
  
  -- Update submission
  UPDATE public.task_submissions 
  SET 
    status = 'approved',
    points_awarded = p_points,
    reviewer_id = p_reviewer_id,
    reviewed_at = now()
  WHERE id = p_submission_id;
  
  -- Add points to user profile
  UPDATE public.profiles 
  SET points = COALESCE(points, 0) + p_points
  WHERE id = v_user_id;
  
  -- Log the activity
  INSERT INTO public.activity_logs (user_id, event_type, payload)
  VALUES (v_user_id, 'points_awarded', jsonb_build_object(
    'submission_id', p_submission_id,
    'points', p_points,
    'reviewer_id', p_reviewer_id
  ));
END;
$$;

-- Function to redeem a reward
CREATE OR REPLACE FUNCTION public.redeem_reward(
  p_user_id uuid,
  p_reward_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reward_cost integer;
  v_reward_stock integer;
  v_user_points integer;
  v_redemption_id uuid;
BEGIN
  -- Get reward details
  SELECT cost_points, stock INTO v_reward_cost, v_reward_stock 
  FROM public.rewards 
  WHERE id = p_reward_id AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Reward not found or inactive');
  END IF;
  
  -- Check stock
  IF v_reward_stock IS NOT NULL AND v_reward_stock <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Reward out of stock');
  END IF;
  
  -- Get user points
  SELECT COALESCE(points, 0) INTO v_user_points FROM public.profiles WHERE id = p_user_id;
  
  IF v_user_points < v_reward_cost THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient points');
  END IF;
  
  -- Deduct points
  UPDATE public.profiles SET points = points - v_reward_cost WHERE id = p_user_id;
  
  -- Decrement stock if applicable
  IF v_reward_stock IS NOT NULL THEN
    UPDATE public.rewards SET stock = stock - 1 WHERE id = p_reward_id;
  END IF;
  
  -- Create redemption
  INSERT INTO public.redemptions (user_id, reward_id, status)
  VALUES (p_user_id, p_reward_id, 'pending')
  RETURNING id INTO v_redemption_id;
  
  -- Log activity
  INSERT INTO public.activity_logs (user_id, event_type, payload)
  VALUES (p_user_id, 'reward_redeemed', jsonb_build_object(
    'redemption_id', v_redemption_id,
    'reward_id', p_reward_id,
    'points_spent', v_reward_cost
  ));
  
  RETURN jsonb_build_object('success', true, 'redemption_id', v_redemption_id);
END;
$$;