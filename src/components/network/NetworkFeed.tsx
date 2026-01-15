import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, 
  Plus, Image, FileText, Award, HelpCircle, Briefcase,
  Send, Trash2
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface NetworkPost {
  id: string;
  user_id: string;
  content: string;
  media_urls: string[];
  post_type: string;
  visibility: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  created_at: string;
  user_name?: string;
  user_avatar?: string;
  user_headline?: string;
  user_liked?: boolean;
  user_saved?: boolean;
}

interface PostComment {
  id: string;
  content: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string;
  created_at: string;
  parent_id?: string;
  replies?: PostComment[];
}

export function NetworkFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<NetworkPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPost, setNewPost] = useState({ content: "", post_type: "update", visibility: "public" });
  const [selectedPost, setSelectedPost] = useState<NetworkPost | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error } = await supabase
        .from('network_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const userIds = [...new Set(postsData?.map(p => p.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, headline')
        .in('id', userIds);

      let userEngagements: { post_id: string; engagement_type: string }[] = [];
      if (user) {
        const { data: engagements } = await supabase
          .from('network_post_engagements')
          .select('post_id, engagement_type')
          .eq('user_id', user.id);
        userEngagements = engagements || [];
      }

      const postsWithDetails = postsData?.map(post => {
        const profile = profiles?.find(p => p.id === post.user_id);
        return {
          ...post,
          user_name: profile?.name || 'Anonymous',
          user_avatar: profile?.avatar_url,
          user_headline: profile?.headline,
          user_liked: userEngagements.some(e => e.post_id === post.id && e.engagement_type === 'like'),
          user_saved: userEngagements.some(e => e.post_id === post.id && e.engagement_type === 'save')
        };
      }) || [];

      setPosts(postsWithDetails);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPost.content.trim()) {
      toast.error("Please enter some content");
      return;
    }

    try {
      const { error } = await supabase.from('network_posts').insert({
        user_id: user.id,
        content: newPost.content,
        post_type: newPost.post_type,
        visibility: newPost.visibility
      });

      if (error) throw error;

      toast.success("Post published!");
      setShowCreateDialog(false);
      setNewPost({ content: "", post_type: "update", visibility: "public" });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error("Failed to create post");
    }
  };

  const handleEngagement = async (postId: string, type: 'like' | 'save', isActive: boolean) => {
    if (!user) {
      toast.error("Please log in");
      return;
    }

    try {
      if (isActive) {
        await supabase.from('network_post_engagements')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .eq('engagement_type', type);
      } else {
        await supabase.from('network_post_engagements').insert({
          post_id: postId,
          user_id: user.id,
          engagement_type: type
        });
      }
      fetchPosts();
    } catch (error) {
      console.error('Error toggling engagement:', error);
    }
  };

  const fetchComments = async (postId: string) => {
    const { data, error } = await supabase
      .from('network_post_comments')
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
      .select('id, name, avatar_url')
      .in('id', userIds);

    const commentsWithUsers = data?.map(c => ({
      ...c,
      user_name: profiles?.find(p => p.id === c.user_id)?.name || 'Anonymous',
      user_avatar: profiles?.find(p => p.id === c.user_id)?.avatar_url
    })) || [];

    // Build threaded structure
    const rootComments = commentsWithUsers.filter(c => !c.parent_id);
    const replies = commentsWithUsers.filter(c => c.parent_id);
    
    rootComments.forEach(comment => {
      (comment as any).replies = replies.filter(r => r.parent_id === comment.id);
    });

    setComments(rootComments);
  };

  const handleAddComment = async () => {
    if (!user || !selectedPost || !newComment.trim()) return;

    try {
      const { error } = await supabase.from('network_post_comments').insert({
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
    const icons: Record<string, React.ReactNode> = {
      update: <MessageCircle className="h-4 w-4" />,
      article: <FileText className="h-4 w-4" />,
      achievement: <Award className="h-4 w-4" />,
      question: <HelpCircle className="h-4 w-4" />,
      job: <Briefcase className="h-4 w-4" />
    };
    return icons[type] || icons.update;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <Card variant="eco">
        <CardContent className="p-4">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <div className="flex items-center gap-4 cursor-pointer">
                <Avatar>
                  <AvatarFallback>{user?.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 p-3 bg-muted/50 rounded-full text-muted-foreground hover:bg-muted transition-colors">
                  Share your thoughts, achievements, or questions...
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Select value={newPost.post_type} onValueChange={(v) => setNewPost(p => ({ ...p, post_type: v }))}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="update">Update</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="achievement">Achievement</SelectItem>
                      <SelectItem value="question">Question</SelectItem>
                      <SelectItem value="job">Opportunity</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={newPost.visibility} onValueChange={(v) => setNewPost(p => ({ ...p, visibility: v }))}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="connections">Connections Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder="What would you like to share?"
                  value={newPost.content}
                  onChange={(e) => setNewPost(p => ({ ...p, content: e.target.value }))}
                  rows={5}
                  className="resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={handleCreatePost}>
                    <Send className="h-4 w-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      {posts.map(post => (
        <Card key={post.id} variant="eco" className="overflow-hidden">
          <CardContent className="p-4">
            {/* Post Header */}
            <div className="flex items-start gap-3 mb-3">
              <Avatar>
                <AvatarImage src={post.user_avatar} />
                <AvatarFallback>{post.user_name?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{post.user_name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {getPostTypeIcon(post.post_type)}
                    <span className="ml-1 capitalize">{post.post_type}</span>
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {post.user_headline && `${post.user_headline} • `}
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Post Content */}
            <p className="whitespace-pre-wrap mb-4">{post.content}</p>

            {/* Engagement Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground pb-3 border-b">
              {post.likes_count > 0 && <span>{post.likes_count} likes</span>}
              {post.comments_count > 0 && <span>{post.comments_count} comments</span>}
              {post.shares_count > 0 && <span>{post.shares_count} shares</span>}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleEngagement(post.id, 'like', post.user_liked || false)}
                className={post.user_liked ? "text-red-500" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${post.user_liked ? "fill-current" : ""}`} />
                Like
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedPost(post);
                  fetchComments(post.id);
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Comment
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleEngagement(post.id, 'save', post.user_saved || false)}
                className={post.user_saved ? "text-primary" : ""}
              >
                <Bookmark className={`h-4 w-4 ${post.user_saved ? "fill-current" : ""}`} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {posts.length === 0 && (
        <Card variant="eco">
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
          </CardContent>
        </Card>
      )}

      {/* Comments Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {comments.map(comment => (
              <div key={comment.id} className="space-y-2">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user_avatar} />
                    <AvatarFallback>{comment.user_name?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-medium">{comment.user_name}</p>
                    <p className="text-sm">{comment.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {comment.replies?.map(reply => (
                  <div key={reply.id} className="flex gap-3 ml-11">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={reply.user_avatar} />
                      <AvatarFallback>{reply.user_name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-muted/30 p-2 rounded-lg">
                      <p className="text-xs font-medium">{reply.user_name}</p>
                      <p className="text-sm">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No comments yet. Be the first!
              </p>
            )}
          </div>
          {user && (
            <div className="flex gap-2 pt-4 border-t">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={2}
                className="resize-none"
              />
              <Button onClick={handleAddComment} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
