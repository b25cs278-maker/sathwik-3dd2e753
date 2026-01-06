import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, Trophy, Heart, Send, Crown, Flame, Medal } from "lucide-react";
import { toast } from "sonner";

interface EcoHero {
  id: string;
  name: string;
  avatar_url: string | null;
  points: number;
  tasksCompleted: number;
}

interface SuccessStory {
  id: string;
  title: string;
  content: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  likes_count: number;
  created_at: string;
  tags: string[];
  is_featured: boolean;
}

export function EcoStories() {
  const { user } = useAuth();
  const [heroes, setHeroes] = useState<EcoHero[]>([]);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStory, setNewStory] = useState({ title: "", content: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch top eco heroes (users with most points)
      const { data: topUsers } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, points')
        .order('points', { ascending: false })
        .limit(5);

      // Get task counts for each hero
      const heroesWithTasks = await Promise.all(
        (topUsers || []).map(async (user) => {
          const { count } = await supabase
            .from('task_submissions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'approved');
          
          return {
            ...user,
            tasksCompleted: count || 0
          };
        })
      );

      setHeroes(heroesWithTasks);

      // Fetch success stories (featured posts)
      const { data: postsData } = await supabase
        .from('innovation_posts')
        .select('*')
        .eq('post_type', 'story')
        .order('is_featured', { ascending: false })
        .order('likes_count', { ascending: false })
        .limit(10);

      // Get user info for each story
      const storiesWithUsers = await Promise.all(
        (postsData || []).map(async (post) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, avatar_url')
            .eq('id', post.user_id)
            .maybeSingle();
          
          return {
            ...post,
            user_name: profile?.name || 'Eco Warrior',
            user_avatar: profile?.avatar_url
          };
        })
      );

      setStories(storiesWithUsers);
    } catch (error) {
      console.error('Error fetching eco stories data:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitStory = async () => {
    if (!user || !newStory.title.trim() || !newStory.content.trim()) {
      toast.error('Please fill in both title and story');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('innovation_posts')
        .insert({
          user_id: user.id,
          title: newStory.title,
          content: newStory.content,
          post_type: 'story',
          tags: ['success-story', 'eco-journey']
        });

      if (error) throw error;

      toast.success('Your eco story has been shared!');
      setNewStory({ title: "", content: "" });
      fetchData();
    } catch (error) {
      console.error('Error submitting story:', error);
      toast.error('Failed to submit story');
    } finally {
      setSubmitting(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1: return <Medal className="h-5 w-5 text-gray-400" />;
      case 2: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return <Star className="h-5 w-5 text-primary" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Eco Stories & <span className="eco-gradient-text">Success Wall</span>
        </h2>
        <p className="text-muted-foreground">
          Celebrating our eco heroes and inspiring stories
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly Eco Heroes */}
        <Card variant="eco" className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-eco-sun" />
              Monthly Eco Heroes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {heroes.map((hero, index) => (
              <div 
                key={hero.id} 
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20' : 'bg-muted/50'
                }`}
              >
                <div className="relative">
                  {getRankIcon(index)}
                  <span className="absolute -top-1 -right-1 text-xs font-bold">
                    #{index + 1}
                  </span>
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={hero.avatar_url || undefined} />
                  <AvatarFallback>{hero.name?.charAt(0) || 'E'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{hero.name || 'Eco Warrior'}</p>
                  <p className="text-xs text-muted-foreground">
                    {hero.points} pts • {hero.tasksCompleted} tasks
                  </p>
                </div>
                {index === 0 && (
                  <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                )}
              </div>
            ))}

            {heroes.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No heroes yet. Be the first!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Success Stories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Share Your Story */}
          <Card variant="eco">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Share Your Eco Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Story title..."
                value={newStory.title}
                onChange={(e) => setNewStory(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Share your eco success story, tips, or journey..."
                value={newStory.content}
                onChange={(e) => setNewStory(prev => ({ ...prev, content: e.target.value }))}
                rows={3}
              />
              <Button 
                onClick={submitStory} 
                disabled={submitting}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {submitting ? 'Sharing...' : 'Share Story'}
              </Button>
            </CardContent>
          </Card>

          {/* Stories Feed */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Inspiring Stories
            </h3>
            
            {stories.length > 0 ? (
              stories.map((story) => (
                <Card key={story.id} variant="eco" className={story.is_featured ? 'border-primary/50' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={story.user_avatar || undefined} />
                        <AvatarFallback>{story.user_name?.charAt(0) || 'E'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{story.user_name}</span>
                          {story.is_featured && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" /> Featured
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-medium text-foreground mt-2">{story.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                          {story.content}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" /> {story.likes_count}
                          </span>
                          <span>{new Date(story.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card variant="eco">
                <CardContent className="py-8 text-center">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">
                    No stories yet. Be the first to share your eco journey!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
