import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NewSubmission {
  id: string;
  task_id: string;
  user_id: string;
  created_at: string;
  status: string;
}

export function useRealtimeSubmissions() {
  const [newSubmissions, setNewSubmissions] = useState<NewSubmission[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Subscribe to new task submissions
    const channel = supabase
      .channel('admin-submissions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'task_submissions'
        },
        (payload) => {
          console.log('New submission received:', payload);
          const newSubmission = payload.new as NewSubmission;
          
          setNewSubmissions(prev => [newSubmission, ...prev].slice(0, 10));
          setUnreadCount(prev => prev + 1);
          
          toast.info('New Task Submission', {
            description: 'A new task submission is pending review',
            action: {
              label: 'Review',
              onClick: () => window.location.href = '/admin/review'
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const clearNotifications = () => {
    setUnreadCount(0);
  };

  return {
    newSubmissions,
    unreadCount,
    clearNotifications
  };
}
