-- 8. Groups/Communities
CREATE TABLE IF NOT EXISTS public.network_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  cover_image_url text,
  group_type text NOT NULL DEFAULT 'public' CHECK (group_type IN ('public', 'private', 'hidden')),
  owner_id uuid NOT NULL,
  members_count integer NOT NULL DEFAULT 0,
  posts_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.network_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public network groups"
ON public.network_groups FOR SELECT
USING (group_type = 'public' OR owner_id = auth.uid());

CREATE POLICY "Users can create network groups"
ON public.network_groups FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update network groups"
ON public.network_groups FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete network groups"
ON public.network_groups FOR DELETE
USING (auth.uid() = owner_id);

-- 9. Group Members
CREATE TABLE IF NOT EXISTS public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.network_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'banned')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active group members"
ON public.group_members FOR SELECT
USING (status = 'active');

CREATE POLICY "Users can join network groups"
ON public.group_members FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave network groups"
ON public.group_members FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Group admins can update member status"
ON public.group_members FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.group_members gm 
  WHERE gm.group_id = group_members.group_id 
  AND gm.user_id = auth.uid() 
  AND gm.role IN ('admin', 'moderator')
) OR auth.uid() = user_id);

-- 10. Network Events
CREATE TABLE IF NOT EXISTS public.network_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  cover_image_url text,
  event_type text NOT NULL DEFAULT 'online' CHECK (event_type IN ('online', 'in_person', 'hybrid')),
  location text,
  event_url text,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  organizer_id uuid NOT NULL,
  group_id uuid REFERENCES public.network_groups(id) ON DELETE SET NULL,
  attendees_count integer NOT NULL DEFAULT 0,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.network_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public network events"
ON public.network_events FOR SELECT
USING (is_public = true OR organizer_id = auth.uid());

CREATE POLICY "Users can create network events"
ON public.network_events FOR INSERT
WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update network events"
ON public.network_events FOR UPDATE
USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete network events"
ON public.network_events FOR DELETE
USING (auth.uid() = organizer_id);

-- 11. Event Attendees
CREATE TABLE IF NOT EXISTS public.event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.network_events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'going' CHECK (status IN ('interested', 'going', 'maybe')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view event attendees"
ON public.event_attendees FOR SELECT
USING (true);

CREATE POLICY "Users can RSVP to events"
ON public.event_attendees FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their event RSVP"
ON public.event_attendees FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their event RSVP"
ON public.event_attendees FOR DELETE
USING (auth.uid() = user_id);