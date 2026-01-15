-- 12. Triggers for counter updates
CREATE OR REPLACE FUNCTION public.update_network_post_engagement_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.engagement_type = 'like' THEN
      UPDATE public.network_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    ELSIF NEW.engagement_type = 'share' THEN
      UPDATE public.network_posts SET shares_count = shares_count + 1 WHERE id = NEW.post_id;
    ELSIF NEW.engagement_type = 'save' THEN
      UPDATE public.network_posts SET saves_count = saves_count + 1 WHERE id = NEW.post_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.engagement_type = 'like' THEN
      UPDATE public.network_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    ELSIF OLD.engagement_type = 'share' THEN
      UPDATE public.network_posts SET shares_count = shares_count - 1 WHERE id = OLD.post_id;
    ELSIF OLD.engagement_type = 'save' THEN
      UPDATE public.network_posts SET saves_count = saves_count - 1 WHERE id = OLD.post_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS update_network_engagement_counts ON public.network_post_engagements;
CREATE TRIGGER update_network_engagement_counts
AFTER INSERT OR DELETE ON public.network_post_engagements
FOR EACH ROW
EXECUTE FUNCTION public.update_network_post_engagement_counts();

-- Comments count trigger
CREATE OR REPLACE FUNCTION public.update_network_post_comments_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.network_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.network_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS update_network_comments_count ON public.network_post_comments;
CREATE TRIGGER update_network_comments_count
AFTER INSERT OR DELETE ON public.network_post_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_network_post_comments_count();

-- Event attendees count trigger
CREATE OR REPLACE FUNCTION public.update_event_attendees_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.network_events SET attendees_count = attendees_count + 1 WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.network_events SET attendees_count = attendees_count - 1 WHERE id = OLD.event_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS update_event_attendees ON public.event_attendees;
CREATE TRIGGER update_event_attendees
AFTER INSERT OR DELETE ON public.event_attendees
FOR EACH ROW
EXECUTE FUNCTION public.update_event_attendees_count();

-- Group members count trigger
CREATE OR REPLACE FUNCTION public.update_group_members_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    UPDATE public.network_groups SET members_count = members_count + 1 WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
    UPDATE public.network_groups SET members_count = members_count - 1 WHERE id = OLD.group_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'active' AND NEW.status = 'active' THEN
      UPDATE public.network_groups SET members_count = members_count + 1 WHERE id = NEW.group_id;
    ELSIF OLD.status = 'active' AND NEW.status != 'active' THEN
      UPDATE public.network_groups SET members_count = members_count - 1 WHERE id = OLD.group_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS update_group_member_count ON public.group_members;
CREATE TRIGGER update_group_member_count
AFTER INSERT OR UPDATE OR DELETE ON public.group_members
FOR EACH ROW
EXECUTE FUNCTION public.update_group_members_count();