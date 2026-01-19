import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlatformStats {
  totalLearners: number;
  completedTasks: number;
  totalPoints: number;
  successRate: number;
}

export function useRealtimeStats() {
  const [stats, setStats] = useState<PlatformStats>({
    totalLearners: 0,
    completedTasks: 0,
    totalPoints: 0,
    successRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Fetch all stats in parallel
      const [profilesResult, submissionsResult, approvedResult] = await Promise.all([
        supabase.from('profiles').select('points', { count: 'exact' }),
        supabase.from('task_submissions').select('id', { count: 'exact' }),
        supabase.from('task_submissions').select('id', { count: 'exact' }).eq('status', 'approved'),
      ]);

      const totalLearners = profilesResult.count || 0;
      const totalSubmissions = submissionsResult.count || 0;
      const approvedSubmissions = approvedResult.count || 0;
      
      // Calculate total points
      const totalPoints = profilesResult.data?.reduce((sum, p) => sum + (p.points || 0), 0) || 0;
      
      // Calculate success rate (default to 98 if no submissions yet)
      const successRate = totalSubmissions > 0 
        ? Math.round((approvedSubmissions / totalSubmissions) * 100) 
        : 98;

      setStats({
        totalLearners,
        completedTasks: approvedSubmissions,
        totalPoints,
        successRate,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up realtime subscriptions for automatic updates
    const profilesChannel = supabase
      .channel('stats-profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => fetchStats()
      )
      .subscribe();

    const submissionsChannel = supabase
      .channel('stats-submissions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'task_submissions' },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(submissionsChannel);
    };
  }, []);

  return { stats, isLoading, refetch: fetchStats };
}
