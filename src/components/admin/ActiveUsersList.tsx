import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Users, Clock, Activity, CheckCircle2, FileText, Trophy, MessageSquare } from "lucide-react";
import { formatDistanceToNow, differenceInMinutes } from "date-fns";

interface UserActivity {
  event_type: string;
  created_at: string;
  payload: any;
}

interface ActiveUser {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  last_active: string | null;
  created_at: string | null;
  activities: UserActivity[];
  timeSpent: number; // in minutes
}

export function ActiveUsersList() {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveUsers = async () => {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      // Fetch profiles active today
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, email, avatar_url, last_active, created_at")
        .gte("last_active", oneDayAgo.toISOString())
        .order("last_active", { ascending: false });

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        return;
      }

      if (!profiles || profiles.length === 0) {
        setActiveUsers([]);
        setLoading(false);
        return;
      }

      // Fetch activity logs for these users
      const userIds = profiles.map(p => p.id);
      const { data: activities, error: activitiesError } = await supabase
        .from("activity_logs")
        .select("user_id, event_type, created_at, payload")
        .in("user_id", userIds)
        .gte("created_at", oneDayAgo.toISOString())
        .order("created_at", { ascending: false });

      if (activitiesError) {
        console.error("Error fetching activities:", activitiesError);
      }

      // Fetch task submissions for these users
      const { data: submissions, error: submissionsError } = await supabase
        .from("task_submissions")
        .select("user_id, status, created_at")
        .in("user_id", userIds)
        .gte("created_at", oneDayAgo.toISOString());

      if (submissionsError) {
        console.error("Error fetching submissions:", submissionsError);
      }

      // Fetch quiz attempts for these users
      const { data: quizAttempts, error: quizError } = await supabase
        .from("quiz_attempts")
        .select("user_id, score, started_at")
        .in("user_id", userIds)
        .gte("started_at", oneDayAgo.toISOString());

      if (quizError) {
        console.error("Error fetching quiz attempts:", quizError);
      }

      // Combine data
      const usersWithActivity: ActiveUser[] = profiles.map(profile => {
        const userActivities: UserActivity[] = [];
        
        // Add activity logs
        activities?.filter(a => a.user_id === profile.id).forEach(a => {
          userActivities.push({
            event_type: a.event_type,
            created_at: a.created_at,
            payload: a.payload
          });
        });

        // Add submissions as activities
        submissions?.filter(s => s.user_id === profile.id).forEach(s => {
          userActivities.push({
            event_type: `task_${s.status}`,
            created_at: s.created_at,
            payload: null
          });
        });

        // Add quiz attempts as activities
        quizAttempts?.filter(q => q.user_id === profile.id).forEach(q => {
          userActivities.push({
            event_type: "quiz_attempt",
            created_at: q.started_at,
            payload: { score: q.score }
          });
        });

        // Sort activities by time
        userActivities.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        // Calculate time spent (estimate based on first and last activity, or session duration)
        const sessionStart = profile.created_at ? new Date(profile.created_at) : new Date();
        const lastActive = profile.last_active ? new Date(profile.last_active) : new Date();
        
        // If user was active today, calculate time from first activity today
        let timeSpent = 0;
        if (userActivities.length > 0) {
          const firstActivityToday = userActivities[userActivities.length - 1];
          const lastActivityToday = userActivities[0];
          timeSpent = differenceInMinutes(
            new Date(lastActivityToday.created_at),
            new Date(firstActivityToday.created_at)
          );
          // Add a minimum of 5 minutes if they have activities
          timeSpent = Math.max(timeSpent, 5);
        } else {
          // If no logged activities, estimate based on last_active
          const now = new Date();
          const timeSinceActive = differenceInMinutes(now, lastActive);
          if (timeSinceActive < 60) {
            timeSpent = Math.max(5, 60 - timeSinceActive);
          } else {
            timeSpent = 5; // Minimum session time
          }
        }

        return {
          ...profile,
          activities: userActivities.slice(0, 5), // Keep last 5 activities
          timeSpent
        };
      });

      setActiveUsers(usersWithActivity);
    } catch (error) {
      console.error("Error fetching active users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveUsers();

    // Set up real-time subscription
    const channel = supabase
      .channel("active-users-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => fetchActiveUsers()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "activity_logs" },
        () => fetchActiveUsers()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "task_submissions" },
        () => fetchActiveUsers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getActivityStatus = (lastActive: string | null) => {
    if (!lastActive) return { status: "offline", label: "Never" };

    const lastActiveDate = new Date(lastActive);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60);

    if (diffMinutes < 5) {
      return { status: "online", label: "Online now" };
    } else if (diffMinutes < 60) {
      return { status: "recent", label: `${Math.round(diffMinutes)}m ago` };
    } else {
      return { status: "away", label: formatDistanceToNow(lastActiveDate, { addSuffix: true }) };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "recent": return "bg-yellow-500";
      case "away": return "bg-gray-400";
      default: return "bg-gray-300";
    }
  };

  const getInitials = (name: string | null, email: string | null) => {
    if (name) {
      return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    if (email) return email[0].toUpperCase();
    return "?";
  };

  const getActivityIcon = (eventType: string) => {
    if (eventType.includes("task")) return <CheckCircle2 className="h-3 w-3" />;
    if (eventType.includes("quiz")) return <Trophy className="h-3 w-3" />;
    if (eventType.includes("points")) return <Trophy className="h-3 w-3" />;
    if (eventType.includes("reward")) return <Trophy className="h-3 w-3" />;
    if (eventType.includes("post") || eventType.includes("comment")) return <MessageSquare className="h-3 w-3" />;
    return <Activity className="h-3 w-3" />;
  };

  const formatEventType = (eventType: string) => {
    return eventType
      .replace(/_/g, " ")
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimeSpent = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <Card variant="eco">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Daily Active Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="eco">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Daily Active Users
          </span>
          <Badge variant="secondary" className="text-xs">
            {activeUsers.length} today
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No active users today</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recent Activity</TableHead>
                  <TableHead className="text-right">Time Spent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeUsers.map((user) => {
                  const activity = getActivityStatus(user.last_active);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.avatar_url || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(user.name, user.email)}
                              </AvatarFallback>
                            </Avatar>
                            <span
                              className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${getStatusColor(activity.status)}`}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={activity.status === "online" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {activity.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.activities.length > 0 ? (
                          <div className="space-y-1">
                            {user.activities.slice(0, 3).map((act, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                {getActivityIcon(act.event_type)}
                                <span>{formatEventType(act.event_type)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Browsing</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium text-sm">{formatTimeSpent(user.timeSpent)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
