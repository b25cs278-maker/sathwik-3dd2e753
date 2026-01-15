-- 5. Post Engagements (likes, shares, saves)
CREATE TABLE IF NOT EXISTS public.network_post_engagements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.network_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  engagement_type text NOT NULL CHECK (engagement_type IN ('like', 'share', 'save')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id, engagement_type)
);

ALTER TABLE public.network_post_engagements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view network engagements"
ON public.network_post_engagements FOR SELECT
USING (true);

CREATE POLICY "Users can create network engagements"
ON public.network_post_engagements FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove network engagements"
ON public.network_post_engagements FOR DELETE
USING (auth.uid() = user_id);

-- 6. Post Comments with threading
CREATE TABLE IF NOT EXISTS public.network_post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.network_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  parent_id uuid REFERENCES public.network_post_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes_count integer NOT NULL DEFAULT 0,
  mentions uuid[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.network_post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view network post comments"
ON public.network_post_comments FOR SELECT
USING (true);

CREATE POLICY "Users can create network post comments"
ON public.network_post_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own network post comments"
ON public.network_post_comments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own network post comments"
ON public.network_post_comments FOR DELETE
USING (auth.uid() = user_id);

-- 7. Direct Messages
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  content text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their direct messages"
ON public.direct_messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send direct messages"
ON public.direct_messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update read status"
ON public.direct_messages FOR UPDATE
USING (auth.uid() = recipient_id);