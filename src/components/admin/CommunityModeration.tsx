import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Lightbulb, Check, X, Star, MessageSquare, Flag, 
  ThumbsUp, Trash2, Loader2
} from "lucide-react";
import { toast } from "sonner";

interface InnovationPost {
  id: string;
  title: string;
  content: string;
  user_id: string;
  is_featured: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_name?: string;
}

export function CommunityModeration() {
  const [posts, setPosts] = useState<InnovationPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error } = await supabase
        .from('innovation_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (postsData && postsData.length > 0) {
        // Fetch user profiles
        const userIds = [...new Set(postsData.map(p => p.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, email')
          .in('id', userIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        const enrichedPosts = postsData.map(post => ({
          ...post,
          user_name: profileMap.get(post.user_id)?.name || profileMap.get(post.user_id)?.email || 'Unknown User'
        }));

        setPosts(enrichedPosts);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleFeaturePost = async (postId: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('innovation_posts')
        .update({ is_featured: featured })
        .eq('id', postId);

      if (error) throw error;

      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, is_featured: featured } : p
      ));
      toast.success(featured ? 'Post featured' : 'Post unfeatured');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('innovation_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(prev => prev.filter(p => p.id !== postId));
      toast.success('Post deleted');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const featuredPosts = posts.filter(p => p.is_featured);
  const regularPosts = posts.filter(p => !p.is_featured);

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
        <h2 className="text-2xl font-bold mb-2">Community & Innovation</h2>
        <p className="text-muted-foreground">Moderate innovation posts and community content</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold">{posts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-eco-sun/10">
                <Star className="h-6 w-6 text-eco-sun" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Featured</p>
                <p className="text-2xl font-bold">{featuredPosts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <ThumbsUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Likes</p>
                <p className="text-2xl font-bold">{posts.reduce((sum, p) => sum + p.likes_count, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-eco-sky/10">
                <MessageSquare className="h-6 w-6 text-eco-sky" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comments</p>
                <p className="text-2xl font-bold">{posts.reduce((sum, p) => sum + p.comments_count, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            All Posts ({posts.length})
          </TabsTrigger>
          <TabsTrigger value="featured">
            Featured ({featuredPosts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No posts yet</p>
              <p className="text-sm mt-1">Innovation posts from users will appear here</p>
            </div>
          ) : (
            posts.map((post) => (
              <Card key={post.id} variant="eco">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            {post.is_featured && <Star className="h-5 w-5 text-eco-sun fill-eco-sun" />}
                            <Lightbulb className="h-5 w-5 text-eco-sun" />
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">by {post.user_name}</p>
                        </div>
                        {post.is_featured && <Badge className="bg-eco-sun">Featured</Badge>}
                      </div>
                      <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {post.likes_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {post.comments_count}
                        </span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex lg:flex-col gap-2">
                      {post.is_featured ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleFeaturePost(post.id, false)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Unfeature
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => handleFeaturePost(post.id, true)}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Feature
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="featured" className="mt-6 space-y-4">
          {featuredPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No featured posts</p>
              <p className="text-sm mt-1">Feature posts from the All Posts tab</p>
            </div>
          ) : (
            featuredPosts.map((post) => (
              <Card key={post.id} variant="eco">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Star className="h-4 w-4 text-eco-sun fill-eco-sun" />
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">by {post.user_name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {post.likes_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {post.comments_count}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleFeaturePost(post.id, false)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Unfeature
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
