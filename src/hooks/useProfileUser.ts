import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile } from '@/types/profile';
import { currentUser as fallback } from '@/data/profileMockData';

/**
 * Merge live Supabase profile row with placeholder UserProfile shape.
 * Real columns (id, name, email, points, avatar_url, created_at) overlay the
 * mock defaults so the UI keeps working while richer fields land later.
 */
export function useProfileUser() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(fallback);
  const [loading, setLoading] = useState(true);
  const [raw, setRaw] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (cancelled) return;
      setRaw(data);
      const points = (data as any)?.points ?? 0;
      setProfile({
        ...fallback,
        id: user.id,
        username: ((data as any)?.name ?? user.email?.split('@')[0] ?? 'learner')
          .toLowerCase()
          .replace(/\s+/g, '-'),
        displayName: (data as any)?.name ?? user.email?.split('@')[0] ?? 'Learner',
        avatar:
          (data as any)?.avatar_url ??
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email ?? user.id)}`,
        bio: (data as any)?.bio ?? fallback.bio,
        tagline: (data as any)?.tagline ?? fallback.tagline,
        xp: points,
        totalXp: points,
        level: Math.max(1, Math.floor(points / 100) + 1),
        joinDate: (data as any)?.created_at ? new Date((data as any).created_at) : new Date(),
      });
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { profile, raw, loading, userId: user?.id, email: user?.email };
}
