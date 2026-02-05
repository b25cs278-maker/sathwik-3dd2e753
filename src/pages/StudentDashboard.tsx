import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CollapsibleCardGroup,
  AccordionCard,
  AccordionCardHeader,
  AccordionCardContent
} from "@/components/ui/collapsible-card-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LearnerNetwork } from "@/components/network/LearnerNetwork";
import { NotificationsPanel } from "@/components/user/NotificationsPanel";
import { FeedbackSupport } from "@/components/user/FeedbackSupport";
import { EcoQuizBattles } from "@/components/quiz/EcoQuizBattles";
import { LearningTracks } from "@/components/tracks/LearningTracks";
import { EcoStories } from "@/components/stories/EcoStories";
import { AIEcoCoach } from "@/components/coach/AIEcoCoach";

import { EcoCalendar } from "@/components/calendar/EcoCalendar";
import { 
  Award, Target, TrendingUp, Clock, CheckCircle2, 
  Leaf, Trophy, Star, Camera, Lightbulb, Bell, HelpCircle, Swords, GraduationCap,
  Bot, CalendarDays
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
  const [activeSection, setActiveSection] = useState("dashboard");
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
      const { data: profile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .maybeSingle();

      const { count: completedCount } = await supabase
        .from('task_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'approved');

      const { count: pendingCount } = await supabase
        .from('task_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'pending');

      const { data: userBadges } = await supabase
        .from('user_badges')
        .select(`
          earned_at,
          badges (id, name, icon_url)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false })
        .limit(5);

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
      case 'badge_earned':
        return `Earned badge: ${activity.payload?.badge_name || 'Unknown'}`;
      default:
        return activity.event_type.replace(/_/g, ' ');
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "Overview Dashboard", icon: <Target className="h-4 w-4" /> },
    { id: "quizzes", label: "Knowledge Challenges", icon: <Swords className="h-4 w-4" /> },
    { id: "tracks", label: "AI Skill Modules", icon: <GraduationCap className="h-4 w-4" /> },
    { id: "calendar", label: "My Schedule", icon: <CalendarDays className="h-4 w-4" /> },
    { id: "community", label: "Learner Interaction Space", icon: <Lightbulb className="h-4 w-4" /> },
    { id: "coach", label: "AI Learning Assistant", icon: <Bot className="h-4 w-4" /> },
    { id: "support", label: "Help & Resources", icon: <HelpCircle className="h-4 w-4" /> },
  ];

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

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Stats Cards - Tap to Expand (Accordion behavior) */}
      <CollapsibleCardGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AccordionCard id="points">
          <AccordionCardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Learning Points</p>
                <p className="text-3xl font-display font-bold text-foreground">
                  {stats.points.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-eco-sun/10">
                <Star className="h-6 w-6 text-eco-sun" />
              </div>
            </div>
          </AccordionCardHeader>
          <AccordionCardContent className="px-4 pb-4">
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Earn points by completing workshops and challenges
              </p>
              <Progress value={Math.min((stats.points / 1000) * 100, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {Math.max(0, 1000 - stats.points)} points to next level
              </p>
            </div>
          </AccordionCardContent>
        </AccordionCard>

        <AccordionCard id="completed">
          <AccordionCardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Workshops Completed</p>
                <p className="text-3xl font-display font-bold text-foreground">
                  {stats.tasksCompleted}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </AccordionCardHeader>
          <AccordionCardContent className="px-4 pb-4">
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Great progress! Keep completing workshops to level up.
              </p>
              <Link to="/tasks" className="text-sm text-primary hover:underline">
                Browse more workshops →
              </Link>
            </div>
          </AccordionCardContent>
        </AccordionCard>

        <AccordionCard id="pending">
          <AccordionCardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-display font-bold text-foreground">
                  {stats.pendingSubmissions}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-eco-sky/10">
                <Clock className="h-6 w-6 text-eco-sky" />
              </div>
            </div>
          </AccordionCardHeader>
          <AccordionCardContent className="px-4 pb-4">
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {stats.pendingSubmissions > 0 
                  ? "You have submissions awaiting review"
                  : "No pending submissions at the moment"}
              </p>
            </div>
          </AccordionCardContent>
        </AccordionCard>

        <AccordionCard id="badges">
          <AccordionCardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Achievements Earned</p>
                <p className="text-3xl font-display font-bold text-foreground">
                  {stats.badges.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-eco-reward/10">
                <Award className="h-6 w-6 text-eco-reward" />
              </div>
            </div>
          </AccordionCardHeader>
          <AccordionCardContent className="px-4 pb-4">
            <div className="space-y-2 pt-2 border-t border-border">
              {stats.badges.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {stats.badges.slice(0, 3).map((badge) => (
                    <Badge key={badge.id} variant="secondary" className="text-xs">
                      {badge.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Complete workshops to earn achievements!
                </p>
              )}
            </div>
          </AccordionCardContent>
        </AccordionCard>
      </CollapsibleCardGroup>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card variant="eco">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Get Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link to="/tasks">
                  <div className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                    <Leaf className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Explore Workshops
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Discover hands-on environmental activities
                    </p>
                  </div>
                </Link>
                <Link to="/tracks">
                  <div className="p-4 rounded-xl border border-border hover:border-eco-sky/50 hover:bg-eco-sky/5 transition-all cursor-pointer group">
                    <GraduationCap className="h-8 w-8 text-eco-sky mb-3" />
                    <h3 className="font-semibold text-foreground group-hover:text-eco-sky transition-colors">
                      AI Skill Modules
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Advance your sustainability expertise
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
                Achievement Progress
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
                  Your Achievements
                </span>
                <Link to="/badges">
                  <Button variant="ghost" size="sm">
                    View Details
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
                  Complete workshops to earn your first achievement!
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

      {/* Stories Section */}
      <EcoStories />
    </div>
  );

  const renderCalendarContent = () => (
    <div className="space-y-8">
      <EcoCalendar />
      <div className="grid md:grid-cols-2 gap-6">
        <NotificationsPanel />
        <Card variant="eco">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Alert Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure your notification preferences for upcoming eco-events and task reminders.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard": return renderDashboardContent();
      case "quizzes": return <EcoQuizBattles />;
      case "tracks": return <LearningTracks />;
      case "calendar": return renderCalendarContent();
      case "community": return <LearnerNetwork />;
      case "coach": return <AIEcoCoach />;
      case "support": return <FeedbackSupport />;
      default: return renderDashboardContent();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        <DashboardSidebar
          items={sidebarItems}
          activeItem={activeSection}
          onItemClick={setActiveSection}
          title="Welcome back!"
          subtitle="Track your learning journey"
          headerIcon={<Leaf className="h-5 w-5 text-primary" />}
          headerAction={
            <Link to="/tasks">
              <Button variant="hero" size="sm" className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Explore Workshops
              </Button>
            </Link>
          }
        />

        <main className="flex-1 overflow-auto">
          <div className="container py-8">
            {renderContent()}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
