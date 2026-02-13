import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Handshake, Rocket, Users, Lightbulb, Search, 
  Plus, MessageSquare, ExternalLink, Filter, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CollabPost {
  id: string;
  user_id: string;
  content: string;
  post_type: string;
  visibility: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  media_urls: string[];
  document_urls: string[];
  profile?: { name: string; headline: string; avatar_url: string; skills: string[] };
}

export function FounderCollaboration() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newPost, setNewPost] = useState({ content: "", category: "idea" });

  const categories = [
    { value: "idea", label: "Idea Pitch", icon: Lightbulb, color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
    { value: "seeking", label: "Seeking Co-founder", icon: Users, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    { value: "project", label: "Project Showcase", icon: Rocket, color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
    { value: "collab", label: "Open Collaboration", icon: Handshake, color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  ];

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["founder-collabs", filterType],
    queryFn: async () => {
      let query = supabase
        .from("network_posts")
        .select("*")
        .in("post_type", ["idea", "seeking", "project", "collab"])
        .eq("visibility", "public")
        .order("created_at", { ascending: false })
        .limit(30);

      if (filterType !== "all") {
        query = query.eq("post_type", filterType);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch profiles for all post authors
      const userIds = [...new Set((data || []).map(p => p.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, headline, avatar_url, skills")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      return (data || []).map(post => ({
        ...post,
        profile: profileMap.get(post.user_id),
      })) as CollabPost[];
    },
  });

  const createPost = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("network_posts").insert({
        user_id: user.id,
        content: newPost.content,
        post_type: newPost.category,
        visibility: "public",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["founder-collabs"] });
      setShowCreateDialog(false);
      setNewPost({ content: "", category: "idea" });
      toast.success("Collaboration post published!");
    },
    onError: () => toast.error("Failed to publish post"),
  });

  const filteredPosts = posts.filter(post =>
    searchQuery === "" ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.profile?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryInfo = (type: string) =>
    categories.find(c => c.value === type) || categories[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-xl font-display font-bold flex items-center gap-2">
            <Handshake className="h-5 w-5 text-primary" />
            Founder Collaboration
          </h3>
          <p className="text-sm text-muted-foreground">
            Pitch ideas, find co-founders, and build together
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button variant="hero" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Post Collaboration
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Collaboration Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <Select
                value={newPost.category}
                onValueChange={(val) => setNewPost(prev => ({ ...prev, category: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <span className="flex items-center gap-2">
                        <cat.icon className="h-4 w-4" />
                        {cat.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Describe your idea, what you're looking for, or what you want to collaborate on..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                rows={5}
              />
              <Button
                onClick={() => createPost.mutate()}
                disabled={!newPost.content.trim() || createPost.isPending}
                className="w-full"
              >
                {createPost.isPending ? "Publishing..." : "Publish Post"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search collaborations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("all")}
          >
            All
          </Button>
          {categories.map(cat => (
            <Button
              key={cat.value}
              variant={filterType === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(cat.value)}
            >
              <cat.icon className="h-3 w-3 mr-1" />
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map(cat => {
          const count = posts.filter(p => p.post_type === cat.value).length;
          return (
            <Card key={cat.value} className="text-center">
              <CardContent className="p-4">
                <cat.icon className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{cat.label}s</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">No collaboration posts yet</p>
            <p className="text-sm text-muted-foreground mt-1">Be the first to pitch an idea!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map(post => {
            const catInfo = getCategoryInfo(post.post_type);
            return (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {post.profile?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-sm">
                          {post.profile?.name || "Anonymous"}
                        </span>
                        <Badge variant="outline" className={`text-xs ${catInfo.color}`}>
                          <catInfo.icon className="h-3 w-3 mr-1" />
                          {catInfo.label}
                        </Badge>
                      </div>
                      {post.profile?.headline && (
                        <p className="text-xs text-muted-foreground mb-2">{post.profile.headline}</p>
                      )}
                      <p className="text-sm whitespace-pre-wrap mb-3">{post.content}</p>
                      {post.profile?.skills && post.profile.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.profile.skills.slice(0, 5).map(skill => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" /> {post.comments_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
