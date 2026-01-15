-- 4. Network Posts (LinkedIn-style content)
CREATE TABLE IF NOT EXISTS public.network_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content text NOT NULL,
  media_urls text[] DEFAULT '{}',
  document_urls text[] DEFAULT '{}',
  post_type text NOT NULL DEFAULT 'update' CHECK (post_type IN ('update', 'article', 'event', 'job', 'achievement', 'question')),
  visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'connections', 'private')),
  likes_count integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  shares_count integer NOT NULL DEFAULT 0,
  saves_count integer NOT NULL DEFAULT 0,
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.network_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public network posts"
ON public.network_posts FOR SELECT
USING (
  visibility = 'public' 
  OR user_id = auth.uid()
);

CREATE POLICY "Users can create network posts"
ON public.network_posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own network posts"
ON public.network_posts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own network posts"
ON public.network_posts FOR DELETE
USING (auth.uid() = user_id);