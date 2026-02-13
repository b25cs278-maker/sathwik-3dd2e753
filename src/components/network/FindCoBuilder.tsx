import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, UserPlus, MapPin, Briefcase, Code, 
  Filter, Users, Sparkles, ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CoBuilderProfile {
  id: string;
  name: string;
  headline: string | null;
  avatar_url: string | null;
  skills: string[];
  location: string | null;
  bio: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  points: number;
  isConnected?: boolean;
  connectionStatus?: string;
}

export function FindCoBuilder() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("");

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["co-builders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, headline, avatar_url, skills, location, bio, linkedin_url, github_url, points")
        .eq("is_visible", true)
        .neq("id", user?.id || "")
        .order("points", { ascending: false })
        .limit(50);
      if (error) throw error;

      // Fetch connection statuses
      let connections: any[] = [];
      if (user) {
        const { data: conns } = await supabase
          .from("user_connections")
          .select("requester_id, addressee_id, status")
          .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);
        connections = conns || [];
      }

      return (data || []).map(profile => {
        const conn = connections.find(
          c => (c.requester_id === profile.id || c.addressee_id === profile.id)
        );
        return {
          ...profile,
          skills: profile.skills || [],
          isConnected: conn?.status === "accepted",
          connectionStatus: conn?.status,
        } as CoBuilderProfile;
      });
    },
    enabled: !!user,
  });

  const sendConnection = useMutation({
    mutationFn: async (addresseeId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("user_connections").insert({
        requester_id: user.id,
        addressee_id: addresseeId,
        status: "pending",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["co-builders"] });
      toast.success("Connection request sent!");
    },
    onError: () => toast.error("Failed to send request"),
  });

  // Collect all unique skills for filter suggestions
  const allSkills = [...new Set(profiles.flatMap(p => p.skills))].sort();

  const filtered = profiles.filter(p => {
    const matchesSearch = searchQuery === "" ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = skillFilter === "" ||
      p.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase()));
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-display font-bold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Find Co-Builder
        </h3>
        <p className="text-sm text-muted-foreground">
          Discover learners with complementary skills to build projects together
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, headline, or bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative w-full sm:w-64">
          <Code className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by skill..."
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Skill Quick Filters */}
      {allSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allSkills.slice(0, 12).map(skill => (
            <Badge
              key={skill}
              variant={skillFilter === skill ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => setSkillFilter(skillFilter === skill ? "" : skill)}
            >
              {skill}
            </Badge>
          ))}
          {allSkills.length > 12 && (
            <Badge variant="outline" className="text-muted-foreground">
              +{allSkills.length - 12} more
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} learner{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Profiles Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">No co-builders found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or skill filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(profile => (
            <Card key={profile.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {profile.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{profile.name || "Anonymous"}</p>
                    {profile.headline && (
                      <p className="text-xs text-muted-foreground truncate">{profile.headline}</p>
                    )}
                    {profile.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> {profile.location}
                      </p>
                    )}
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{profile.bio}</p>
                )}

                {profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {profile.skills.slice(0, 4).map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {profile.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{profile.skills.length - 4}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3">
                  {profile.isConnected ? (
                    <Badge variant="outline" className="text-xs text-primary border-primary">
                      Connected
                    </Badge>
                  ) : profile.connectionStatus === "pending" ? (
                    <Badge variant="outline" className="text-xs">
                      Request Pending
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendConnection.mutate(profile.id)}
                      disabled={sendConnection.isPending}
                      className="text-xs"
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Connect
                    </Button>
                  )}
                  {(profile.linkedin_url || profile.github_url) && (
                    <div className="flex gap-1 ml-auto">
                      {profile.github_url && (
                        <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
                          <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
