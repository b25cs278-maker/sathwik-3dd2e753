import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Lightbulb, Rocket, Trophy, Heart, MessageCircle, 
  Plus, Search, TrendingUp, Users
} from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  post_type: 'idea' | 'project' | 'challenge';
  tags: string[];
  likes_count: number;
  comments_count: number;
  is_featured: boolean;
  created_at: string;
  user_name?: string;
  user_liked?: boolean;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  user_name?: string;
}

export function InnovationHub() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    post_type: "idea" as 'idea' | 'project' | 'challenge',
    tags: ""
  });
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error } = await supabase
        .from('innovation_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user profiles and likes
      const userIds = [...new Set(postsData?.map(p => p.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);

      let userLikes: string[] = [];
      if (user) {
        const { data: likes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);
        userLikes = likes?.map(l => l.post_id) || [];
      }

      const postsWithDetails = postsData?.map(post => ({
        ...post,
        post_type: post.post_type as 'idea' | 'project' | 'challenge',
        user_name: profiles?.find(p => p.id === post.user_id)?.name || 'Anonymous',
        user_liked: userLikes.includes(post.id)
      })) || [];

      setPosts(postsWithDetails);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPost.title || !newPost.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { error } = await supabase.from('innovation_posts').insert({
        user_id: user.id,
        title: newPost.title,
        content: newPost.content,
        post_type: newPost.post_type,
        tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean)
      });

      if (error) throw error;

      toast.success("Post created successfully!");
      setShowCreateDialog(false);
      setNewPost({ title: "", content: "", post_type: "idea", tags: "" });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error("Failed to create post");
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!user) {
      toast.error("Please log in to like posts");
      return;
    }

    try {
      if (isLiked) {
        await supabase.from('post_likes').delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        await supabase.from('post_likes').insert({
          post_id: postId,
          user_id: user.id
        });
      }
      fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const fetchComments = async (postId: string) => {
    const { data, error } = await supabase
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return;
    }

    const userIds = [...new Set(data?.map(c => c.user_id) || [])];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name')
      .in('id', userIds);

    setComments(data?.map(c => ({
      ...c,
      user_name: profiles?.find(p => p.id === c.user_id)?.name || 'Anonymous'
    })) || []);
  };

  const handleAddComment = async () => {
    if (!user || !selectedPost || !newComment.trim()) return;

    try {
      const { error } = await supabase.from('post_comments').insert({
        post_id: selectedPost.id,
        user_id: user.id,
        content: newComment.trim()
      });

      if (error) throw error;

      setNewComment("");
      fetchComments(selectedPost.id);
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error("Failed to add comment");
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'idea': return <Lightbulb className="h-4 w-4" />;
      case 'project': return <Rocket className="h-4 w-4" />;
      case 'challenge': return <Trophy className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getPostTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'idea': return 'default';
      case 'project': return 'secondary';
      case 'challenge': return 'outline';
      default: return 'default';
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || post.post_type === activeTab;
    return matchesSearch && matchesTab;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            Innovation & Community Hub
          </h2>
          <p className="text-muted-foreground">Share ideas, showcase projects, and join challenges</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Post Type</label>
                <div className="flex gap-2 mt-1">
                  {(['idea', 'project', 'challenge'] as const).map(type => (
                    <Button
                      key={type}
                      variant={newPost.post_type === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewPost(p => ({ ...p, post_type: type }))}
                    >
                      {getPostTypeIcon(type)}
                      <span className="ml-1 capitalize">{type}</span>
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newPost.title}
                  onChange={(e) => setNewPost(p => ({ ...p, title: e.target.value }))}
                  placeholder="Give your post a title..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(p => ({ ...p, content: e.target.value }))}
                  placeholder="Describe your idea, project, or challenge..."
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <Input
                  value={newPost.tags}
                  onChange={(e) => setNewPost(p => ({ ...p, tags: e.target.value }))}
                  placeholder="sustainability, recycling, water..."
                />
              </div>
              <Button onClick={handleCreatePost} className="w-full">
                Publish Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card variant="eco">
          <CardContent className="p-4 text-center">
            <Lightbulb className="h-6 w-6 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{posts.filter(p => p.post_type === 'idea').length}</p>
            <p className="text-sm text-muted-foreground">Ideas</p>
          </CardContent>
        </Card>
        <Card variant="eco">
          <CardContent className="p-4 text-center">
            <Rocket className="h-6 w-6 mx-auto text-eco-sky mb-1" />
            <p className="text-2xl font-bold">{posts.filter(p => p.post_type === 'project').length}</p>
            <p className="text-sm text-muted-foreground">Projects</p>
          </CardContent>
        </Card>
        <Card variant="eco">
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 mx-auto text-eco-sun mb-1" />
            <p className="text-2xl font-bold">{posts.filter(p => p.post_type === 'challenge').length}</p>
            <p className="text-sm text-muted-foreground">Challenges</p>
          </CardContent>
        </Card>
        <Card variant="eco">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto text-eco-reward mb-1" />
            <p className="text-2xl font-bold">{new Set(posts.map(p => p.user_id)).size}</p>
            <p className="text-sm text-muted-foreground">Contributors</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="idea">Ideas</TabsTrigger>
            <TabsTrigger value="project">Projects</TabsTrigger>
            <TabsTrigger value="challenge">Challenges</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredPosts.map(post => (
          <Card key={post.id} variant="eco" className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getPostTypeBadgeVariant(post.post_type) as any}>
                      {getPostTypeIcon(post.post_type)}
                      <span className="ml-1 capitalize">{post.post_type}</span>
                    </Badge>
                    {post.is_featured && (
                      <Badge variant="outline" className="text-eco-sun border-eco-sun">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                by {post.user_name} • {new Date(post.created_at).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                {post.content}
              </p>
              
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleLike(post.id, post.user_liked || false)}
                  className={post.user_liked ? "text-red-500" : ""}
                >
                  <Heart className={`h-4 w-4 mr-1 ${post.user_liked ? "fill-current" : ""}`} />
                  {post.likes_count}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post);
                    fetchComments(post.id);
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {post.comments_count}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No posts found. Be the first to share an idea!</p>
        </div>
      )}

      {/* Comments Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedPost?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">{selectedPost?.content}</p>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Comments ({comments.length})</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {comments.map(comment => (
                  <div key={comment.id} className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm">{comment.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {comment.user_name} • {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No comments yet. Be the first!
                  </p>
                )}
              </div>
            </div>

            {user && (
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button onClick={handleAddComment}>Post</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
