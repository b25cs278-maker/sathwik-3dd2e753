import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActiveUser {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  last_active: string | null;
}

export function ActiveUsersList() {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveUsers = async () => {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, avatar_url, last_active")
        .gte("last_active", oneDayAgo.toISOString())
        .order("last_active", { ascending: false });

      if (error) {
        console.error("Error fetching active users:", error);
        return;
      }

      setActiveUsers(data || []);
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
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        (payload) => {
          console.log("Profile change detected:", payload);
          fetchActiveUsers();
        }
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
      case "online":
        return "bg-green-500";
      case "recent":
        return "bg-yellow-500";
      case "away":
        return "bg-gray-400";
      default:
        return "bg-gray-300";
    }
  };

  const getInitials = (name: string | null, email: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "?";
  };

  if (loading) {
    return (
      <Card variant="eco">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Users
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
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {activeUsers.map((user) => {
                const activity = getActivityStatus(user.last_active);
                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(user.name, user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(
                          activity.status
                        )}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {user.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={activity.status === "online" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {activity.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
