import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InnovationHub } from "@/components/community/InnovationHub";
import { NotificationsPanel } from "@/components/user/NotificationsPanel";
import { FeedbackSupport } from "@/components/user/FeedbackSupport";
import { EcoQuizBattles } from "@/components/quiz/EcoQuizBattles";
import { LearningTracks } from "@/components/tracks/LearningTracks";
import { EcoStories } from "@/components/stories/EcoStories";
import { AIEcoCoach } from "@/components/coach/AIEcoCoach";
import { SmartRewardBoost } from "@/components/rewards/SmartRewardBoost";
import { EcoCalendar } from "@/components/calendar/EcoCalendar";
import { 
  Award, Gift, Target, TrendingUp, Clock, CheckCircle2, 
  ArrowRight, Leaf, Trophy, Star, Camera, Lightbulb, Bell, HelpCircle, Swords, GraduationCap,
  Heart, Bot, Zap, CalendarDays
} from "lucide-react";
import { toast } from "sonner";

interface UserStats {
  points: number;
  tasksCompleted: number;
  pendingSubmissions: number;
  badges: Array<{ id: string; name: string; icon_url: string; earned_at: string }>;
}

interface RecentActivity {
  id: string;
  event_type: string;
  payload: any;
  created_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    points: 0,
    tasksCompleted: 0,
    pendingSubmissions: 0,
    badges: []
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      // Fetch user profile for points
      const { data: profile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .maybeSingle();

      // Fetch completed submissions count
      const { count: completedCount } = await supabase
        .from('task_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'approved');

      // Fetch pending submissions count
      const { count: pendingCount } = await supabase
        .from('task_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'pending');

      // Fetch user badges
      const { data: userBadges } = await supabase
        .from('user_badges')
        .select(`
          earned_at,
          badges (id, name, icon_url)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false })
        .limit(5);

      // Fetch recent activity
      const { data: activity } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        points: profile?.points || 0,
        tasksCompleted: completedCount || 0,
        pendingSubmissions: pendingCount || 0,
        badges: userBadges?.map((ub: any) => ({
          id: ub.badges?.id,
          name: ub.badges?.name,
          icon_url: ub.badges?.icon_url,
          earned_at: ub.earned_at
        })) || []
      });

      setRecentActivity(activity || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (eventType: string) => {
    switch (eventType) {
      case 'points_awarded':
        return <Star className="h-4 w-4 text-eco-sun" />;
      case 'reward_redeemed':
        return <Gift className="h-4 w-4 text-eco-reward" />;
      case 'badge_earned':
        return <Award className="h-4 w-4 text-primary" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityText = (activity: RecentActivity) => {
    switch (activity.event_type) {
      case 'points_awarded':
        return `Earned ${activity.payload?.points || 0} points`;
      case 'reward_redeemed':
        return 'Redeemed a reward';
      case 'badge_earned':
        return `Earned badge: ${activity.payload?.badge_name || 'Unknown'}`;
      default:
        return activity.event_type.replace(/_/g, ' ');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Welcome back!
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your environmental impact and earn rewards
            </p>
          </div>
          <Link to="/tasks">
            <Button variant="hero">
              <Camera className="h-4 w-4 mr-2" />
              Browse Tasks
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2">
              <Swords className="h-4 w-4" />
              <span className="hidden sm:inline">Quiz Battles</span>
            </TabsTrigger>
            <TabsTrigger value="tracks" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Tracks</span>
            </TabsTrigger>
            <TabsTrigger value="stories" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Stories</span>
            </TabsTrigger>
            <TabsTrigger value="coach" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">AI Coach</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Help</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="eco">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-3xl font-display font-bold text-foreground">
                    {stats.points.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-eco-sun/10">
                  <Star className="h-6 w-6 text-eco-sun" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="eco">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tasks Completed</p>
                  <p className="text-3xl font-display font-bold text-foreground">
                    {stats.tasksCompleted}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="eco">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-3xl font-display font-bold text-foreground">
                    {stats.pendingSubmissions}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-eco-sky/10">
                  <Clock className="h-6 w-6 text-eco-sky" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="eco">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Badges Earned</p>
                  <p className="text-3xl font-display font-bold text-foreground">
                    {stats.badges.length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-eco-reward/10">
                  <Award className="h-6 w-6 text-eco-reward" />
                </div>
              </div>
            </CardContent>
          </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card variant="eco">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link to="/tasks">
                    <div className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                      <Leaf className="h-8 w-8 text-primary mb-3" />
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        Find Tasks
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Browse and complete environmental tasks
                      </p>
                    </div>
                  </Link>
                  <Link to="/rewards">
                    <div className="p-4 rounded-xl border border-border hover:border-eco-reward/50 hover:bg-eco-reward/5 transition-all cursor-pointer group">
                      <Gift className="h-8 w-8 text-eco-reward mb-3" />
                      <h3 className="font-semibold text-foreground group-hover:text-eco-reward transition-colors">
                        Redeem Rewards
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Exchange points for eco-friendly rewards
                      </p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Progress to Next Badge */}
            <Card variant="eco">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-eco-sun" />
                  Progress to Next Badge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Green Novice</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.min(stats.tasksCompleted, 5)} / 5 tasks
                      </span>
                    </div>
                    <Progress value={Math.min((stats.tasksCompleted / 5) * 100, 100)} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Eco Contributor</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.min(stats.tasksCompleted, 25)} / 25 tasks
                      </span>
                    </div>
                    <Progress value={Math.min((stats.tasksCompleted / 25) * 100, 100)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges */}
            <Card variant="eco">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Your Badges
                  </span>
                  <Link to="/badges">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.badges.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {stats.badges.map((badge) => (
                      <Badge key={badge.id} variant="secondary" className="px-3 py-1">
                        {badge.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Complete tasks to earn your first badge!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card variant="eco">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3">
                        {getActivityIcon(activity.event_type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {getActivityText(activity)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent activity yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
          </TabsContent>

          <TabsContent value="quizzes">
            <EcoQuizBattles />
          </TabsContent>

          <TabsContent value="tracks">
            <LearningTracks />
          </TabsContent>

          <TabsContent value="stories">
            <EcoStories />
          </TabsContent>

          <TabsContent value="coach">
            <AIEcoCoach />
          </TabsContent>

          <TabsContent value="rewards">
            <SmartRewardBoost />
          </TabsContent>

          <TabsContent value="calendar">
            <EcoCalendar />
          </TabsContent>

          <TabsContent value="community">
            <InnovationHub />
          </TabsContent>

          <TabsContent value="notifications">
            <div className="grid md:grid-cols-2 gap-6">
              <NotificationsPanel />
              <Card variant="eco">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Alert Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Task Reminders</p>
                      <p className="text-xs text-muted-foreground">Get reminded about pending tasks</p>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary">On</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Approval Notifications</p>
                      <p className="text-xs text-muted-foreground">Know when your tasks are reviewed</p>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary">On</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">New Challenges</p>
                      <p className="text-xs text-muted-foreground">Get alerts for new community challenges</p>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary">On</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Reward Updates</p>
                      <p className="text-xs text-muted-foreground">Be notified about new rewards</p>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary">On</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="support">
            <div className="grid md:grid-cols-2 gap-6">
              <FeedbackSupport />
              <Card variant="eco">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Quick Help
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h4 className="font-medium text-sm mb-2">How to Complete Tasks</h4>
                    <p className="text-xs text-muted-foreground">
                      1. Browse available tasks in the Tasks section<br/>
                      2. Take a photo as proof of completion<br/>
                      3. Submit with your location for verification<br/>
                      4. Wait for admin approval to earn points
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-eco-sky/5 border border-eco-sky/20">
                    <h4 className="font-medium text-sm mb-2">Report Fake Activities</h4>
                    <p className="text-xs text-muted-foreground">
                      If you spot someone submitting fake proofs or cheating, 
                      use the "Report Fake Activity" option in the feedback form.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-eco-sun/5 border border-eco-sun/20">
                    <h4 className="font-medium text-sm mb-2">Earn More Points</h4>
                    <p className="text-xs text-muted-foreground">
                      Complete harder tasks, participate in community challenges, 
                      and maintain a high verification score to unlock advanced tasks.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}