import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bell, Send, Users, Megaphone, Calendar, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

interface NotificationDraft {
  title: string;
  message: string;
  type: 'announcement' | 'challenge' | 'reminder' | 'success';
  audience: 'all' | 'students' | 'admins';
}

export function NotificationsPanel() {
  const [draft, setDraft] = useState<NotificationDraft>({
    title: "",
    message: "",
    type: "announcement",
    audience: "all"
  });
  const [sending, setSending] = useState(false);
  const [sentNotifications, setSentNotifications] = useState<Array<NotificationDraft & { sentAt: string }>>([]);

  const handleSendNotification = async () => {
    if (!draft.title.trim() || !draft.message.trim()) {
      toast.error('Please fill in title and message');
      return;
    }

    setSending(true);
    
    // Simulate sending notification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSentNotifications(prev => [
      { ...draft, sentAt: new Date().toISOString() },
      ...prev
    ]);
    
    toast.success('Notification sent successfully!');
    setDraft({ title: "", message: "", type: "announcement", audience: "all" });
    setSending(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return <Megaphone className="h-4 w-4" />;
      case 'challenge':
        return <Calendar className="h-4 w-4" />;
      case 'reminder':
        return <Bell className="h-4 w-4" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

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
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="challenge">Challenge</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="success">Success Story</SelectItem>
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
                'Sending...'
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
                {sentNotifications.map((notif, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(notif.type)}
                        <span className="font-medium">{notif.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notif.sentAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notif.message}</p>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground capitalize">{notif.audience}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No notifications sent yet</p>
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
                type: "reminder",
                audience: "students"
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
                type: "success",
                audience: "all"
              })}
            >
              <CheckCircle2 className="h-5 w-5 mb-2 text-primary" />
              <span className="font-medium">Success Story</span>
              <span className="text-xs text-muted-foreground">Share achievements</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start"
              onClick={() => setDraft({
                title: "Important Update",
                message: "We have some important news to share with you about upcoming changes.",
                type: "announcement",
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
