import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  referrals_count: number;
  avatar_url: string | null;
}

export function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userStats, setUserStats] = useState<{ points: number; referrals: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();

    // Realtime subscription
    const channel = supabase
      .channel("leaderboard-updates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        () => fetchLeaderboard()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, name, points, referrals_count, avatar_url")
        .order("points", { ascending: false })
        .limit(20);

      if (data) {
        setEntries(data);

        if (user) {
          const rank = data.findIndex((e) => e.id === user.id);
          if (rank !== -1) {
            setUserRank(rank + 1);
            setUserStats({
              points: data[rank].points || 0,
              referrals: data[rank].referrals_count || 0,
            });
          } else {
            // User not in top 20, fetch their data
            const { data: profile } = await supabase
              .from("profiles")
              .select("points, referrals_count")
              .eq("id", user.id)
              .single();

            if (profile) {
              // Calculate rank
              const { count } = await supabase
                .from("profiles")
                .select("*", { count: "exact", head: true })
                .gt("points", profile.points || 0);

              setUserRank((count || 0) + 1);
              setUserStats({
                points: profile.points || 0,
                referrals: profile.referrals_count || 0,
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-amber-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-muted-foreground">
            {rank}
          </span>
        );
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-amber-400/10 border-amber-400/30";
      case 2:
        return "bg-gray-300/10 border-gray-300/30";
      case 3:
        return "bg-amber-600/10 border-amber-600/30";
      default:
        return "bg-muted/30 border-border";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* User Stats */}
      {userRank && userStats && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Rank</p>
                  <p className="text-2xl font-bold">#{userRank}</p>
                </div>
              </div>
              <div className="flex gap-4 text-center">
                <div>
                  <p className="text-lg font-bold">{userStats.points}</p>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{userStats.referrals}</p>
                  <p className="text-xs text-muted-foreground">Referrals</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Top 20 Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {entries.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = entry.id === user?.id;

              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${getRankBg(rank)} ${
                    isCurrentUser ? "ring-2 ring-primary/50" : ""
                  }`}
                >
                  <div className="w-8 flex justify-center">
                    {getRankIcon(rank)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {entry.name || "Anonymous"}
                      {isCurrentUser && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          You
                        </Badge>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-right">
                      <p className="font-bold">{entry.points || 0}</p>
                      <p className="text-xs text-muted-foreground">pts</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-muted-foreground">
                        {entry.referrals_count || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">refs</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {entries.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No leaderboard entries yet. Complete the quiz to get started!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
