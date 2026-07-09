import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile } from '@/types/profile';

const emptyProfile: UserProfile = {
  id: '',
  username: 'learner',
  displayName: 'Learner',
  avatar: '',
  coverImage: '',
  bio: 'Your profile is ready. Add more details when profile editing is available.',
  tagline: 'NexusCraft member',
  level: 1,
  xp: 0,
  streak: 0,
  totalXp: 0,
  joinDate: new Date(),
  socialLinks: {},
  education: [],
  experience: [],
  privacy: {
    profileVisibility: 'public',
    activityVisibility: 'everyone',
    connectionRequests: 'everyone',
  },
  theme: 'dark',
};

export function useProfileUser() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [raw, setRaw] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (cancelled) return;

      if (error) {
        console.error('Error loading profile:', error);
      }

      setRaw(data);
      const points = (data as any)?.points ?? 0;
      const displayName = (data as any)?.name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Learner';
      setProfile({
        ...emptyProfile,
        id: user.id,
        username: displayName
          .toLowerCase()
          .replace(/\s+/g, '-'),
        displayName,
        avatar: (data as any)?.avatar_url ?? '',
        coverImage: (data as any)?.cover_image_url ?? '',
        bio: (data as any)?.bio ?? emptyProfile.bio,
        tagline: (data as any)?.headline ?? emptyProfile.tagline,
        xp: points,
        totalXp: points,
        level: Math.max(1, Math.floor(points / 100) + 1),
        joinDate: (data as any)?.created_at ? new Date((data as any).created_at) : new Date(),
        socialLinks: {
          website: (data as any)?.website ?? '',
          linkedin: (data as any)?.linkedin_url ?? '',
          github: (data as any)?.github_url ?? '',
        },
        education: Array.isArray((data as any)?.education) ? (data as any).education : [],
        experience: Array.isArray((data as any)?.experience) ? (data as any).experience : [],
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
