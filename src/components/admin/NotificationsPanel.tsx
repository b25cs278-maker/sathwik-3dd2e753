import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bell, Send, Users, Megaphone, Calendar, CheckCircle2, Loader2, Trash2, Gift
} from "lucide-react";
import { toast } from "sonner";

interface NotificationDraft {
  title: string;
  message: string;
  type: 'task_reminder' | 'approval' | 'challenge' | 'reward' | 'general';
  audience: 'all' | 'students' | 'admins';
}

interface SentNotification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  created_at: string;
  user_count?: number;
}

export function NotificationsPanel() {
  const [draft, setDraft] = useState<NotificationDraft>({
    title: "",
    message: "",
    type: "general",
    audience: "all"
  });
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sentNotifications, setSentNotifications] = useState<SentNotification[]>([]);

  useEffect(() => {
    fetchSentNotifications();
  }, []);

  const fetchSentNotifications = async () => {
    try {
      // Get recent notifications grouped by title/message (bulk notifications)
      const { data, error } = await supabase
        .from('notifications')
        .select('id, title, message, notification_type, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Group notifications by title+message+type to show as single entries
      const groupedMap = new Map<string, SentNotification>();
      (data || []).forEach(n => {
        const key = `${n.title}|${n.message}|${n.notification_type}`;
        const existing = groupedMap.get(key);
        if (existing) {
          existing.user_count = (existing.user_count || 1) + 1;
        } else {
          groupedMap.set(key, {
            id: n.id,
            title: n.title,
            message: n.message,
            notification_type: n.notification_type,
            created_at: n.created_at,
            user_count: 1
          });
        }
      });

      setSentNotifications(Array.from(groupedMap.values()).slice(0, 10));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!draft.title.trim() || !draft.message.trim()) {
      toast.error('Please fill in title and message');
      return;
    }

    setSending(true);
    try {
      // Get users based on audience
      let userIds: string[] = [];
      
      if (draft.audience === 'all') {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id');
        userIds = profiles?.map(p => p.id) || [];
      } else if (draft.audience === 'students') {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'student');
        userIds = roles?.map(r => r.user_id) || [];
      } else if (draft.audience === 'admins') {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');
        userIds = roles?.map(r => r.user_id) || [];
      }

      if (userIds.length === 0) {
        toast.error('No users found for the selected audience');
        setSending(false);
        return;
      }

      // Create notifications for all users
      const notifications = userIds.map(userId => ({
        user_id: userId,
        title: draft.title,
        message: draft.message,
        notification_type: draft.type,
        is_read: false
      }));

      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) throw error;
      
      toast.success(`Notification sent to ${userIds.length} user(s)`);
      setDraft({ title: "", message: "", type: "general", audience: "all" });
      fetchSentNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteNotification = async (title: string, message: string, type: string) => {
    if (!confirm('Delete all instances of this notification?')) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('title', title)
        .eq('message', message)
        .eq('notification_type', type);

      if (error) throw error;
      toast.success('Notifications deleted');
      fetchSentNotifications();
    } catch (error) {
      console.error('Error deleting notifications:', error);
      toast.error('Failed to delete notifications');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'general':
        return <Megaphone className="h-4 w-4" />;
      case 'challenge':
        return <Calendar className="h-4 w-4" />;
      case 'task_reminder':
        return <Bell className="h-4 w-4" />;
      case 'approval':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'reward':
        return <Gift className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Notifications & Announcements</h2>
        <p className="text-muted-foreground">Send notifications to users</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Compose Notification */}
        <Card variant="eco">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Compose Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Notification title..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Textarea
                value={draft.message}
                onChange={(e) => setDraft({ ...draft, message: e.target.value })}
                placeholder="Write your message..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select value={draft.type} onValueChange={(v) => setDraft({ ...draft, type: v as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Announcement</SelectItem>
                    <SelectItem value="challenge">Challenge</SelectItem>
                    <SelectItem value="task_reminder">Task Reminder</SelectItem>
                    <SelectItem value="approval">Approval Update</SelectItem>
                    <SelectItem value="reward">Reward</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Audience</label>
                <Select value={draft.audience} onValueChange={(v) => setDraft({ ...draft, audience: v as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="students">Students Only</SelectItem>
                    <SelectItem value="admins">Admins Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handleSendNotification}
              disabled={sending}
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card variant="eco">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sentNotifications.length > 0 ? (
              <div className="space-y-3">
                {sentNotifications.map((notif) => (
                  <div key={notif.id} className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(notif.notification_type)}
                        <span className="font-medium">{notif.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(notif.created_at).toLocaleString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => handleDeleteNotification(notif.title, notif.message, notif.notification_type)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{notif.message}</p>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Sent to {notif.user_count} user(s)
                      </span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {notif.notification_type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No notifications sent yet</p>
                <p className="text-sm mt-1">Compose a notification to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Templates */}
      <Card variant="eco">
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start"
              onClick={() => setDraft({
                title: "New Challenge Available!",
                message: "A new environmental challenge is now live. Complete it to earn bonus points!",
                type: "challenge",
                audience: "all"
              })}
            >
              <Calendar className="h-5 w-5 mb-2 text-primary" />
              <span className="font-medium">New Challenge</span>
              <span className="text-xs text-muted-foreground">Announce a new task</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start"
              onClick={() => setDraft({
                title: "Weekly Reminder",
                message: "Don't forget to complete your weekly environmental tasks to maintain your streak!",
                type: "task_reminder",
                audience: "all"
              })}
            >
              <Bell className="h-5 w-5 mb-2 text-eco-sun" />
              <span className="font-medium">Weekly Reminder</span>
              <span className="text-xs text-muted-foreground">Task completion reminder</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start"
              onClick={() => setDraft({
                title: "Congratulations!",
                message: "Our community has reached a major milestone. Thank you for your contributions!",
                type: "approval",
                audience: "all"
              })}
            >
              <CheckCircle2 className="h-5 w-5 mb-2 text-primary" />
              <span className="font-medium">Achievement</span>
              <span className="text-xs text-muted-foreground">Share approvals</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start"
              onClick={() => setDraft({
                title: "Important Update",
                message: "We have some important news to share with you about upcoming changes.",
                type: "general",
                audience: "all"
              })}
            >
              <Megaphone className="h-5 w-5 mb-2 text-destructive" />
              <span className="font-medium">Announcement</span>
              <span className="text-xs text-muted-foreground">General updates</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
