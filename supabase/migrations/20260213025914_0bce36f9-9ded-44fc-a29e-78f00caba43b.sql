
-- Learning events table (admin-managed events + learner personal reminders)
CREATE TABLE public.learning_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  event_type text NOT NULL DEFAULT 'workshop', -- workshop, webinar, deadline, reminder, bootcamp
  icon text DEFAULT 'calendar',
  color text DEFAULT 'text-primary',
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone,
  is_public boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL,
  activities text[] DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.learning_events ENABLE ROW LEVEL SECURITY;

-- Anyone can view public events
CREATE POLICY "Anyone can view public learning events"
  ON public.learning_events FOR SELECT
  USING (is_public = true OR created_by = auth.uid());

-- Admins can manage all events
CREATE POLICY "Admins can manage learning events"
  ON public.learning_events FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Users can create personal reminders (non-public)
CREATE POLICY "Users can create personal reminders"
  ON public.learning_events FOR INSERT
  WITH CHECK (auth.uid() = created_by AND is_public = false);

-- Users can update their own reminders
CREATE POLICY "Users can update own reminders"
  ON public.learning_events FOR UPDATE
  USING (auth.uid() = created_by AND is_public = false);

-- Users can delete their own reminders
CREATE POLICY "Users can delete own reminders"
  ON public.learning_events FOR DELETE
  USING (auth.uid() = created_by AND is_public = false);

-- Learning progress table (track module completion)
CREATE TABLE public.learning_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  track_id text NOT NULL,
  module_id text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  score integer,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, track_id, module_id)
);

ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
CREATE POLICY "Users can view own learning progress"
  ON public.learning_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own learning progress"
  ON public.learning_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own learning progress"
  ON public.learning_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all progress
CREATE POLICY "Admins can view all learning progress"
  ON public.learning_progress FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
