import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BadgeDisplay, UserBadge } from "@/components/dashboard/BadgeDisplay";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { TaskCard, Task } from "@/components/tasks/TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Zap, Target, CheckCircle2, Clock, ChevronRight, 
  TrendingUp, Calendar, ArrowRight, Brain
} from "lucide-react";

// Mock data
const userStats = {
  points: 1250,
  tasksCompleted: 23,
  streak: 7,
  rank: 156,
};

const recentSubmissions = [
  { id: "1", taskTitle: "Park Cleanup", status: "approved", points: 50, date: "2 hours ago" },
  { id: "2", taskTitle: "Recycling Drop-off", status: "pending", points: 25, date: "Yesterday" },
  { id: "3", taskTitle: "Tree Planting", status: "approved", points: 100, date: "3 days ago" },
];

const suggestedTasks: Task[] = [
  {
    id: "1",
    title: "Community Garden Volunteer",
    description: "Help maintain the local community garden by weeding and watering plants.",
    category: "Conservation",
    difficulty: 1,
    points: 35,
    locationRequired: true,
    estimatedTime: "1-2 hours",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
  },
  {
    id: "2",
    title: "Beach Cleanup Challenge",
    description: "Join the weekend beach cleanup and help remove plastic waste from the shoreline.",
    category: "Community",
    difficulty: 2,
    points: 75,
    locationRequired: true,
    estimatedTime: "2-3 hours",
    imageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400",
  },
];

const userBadges: UserBadge[] = [
  { id: "1", name: "Green Novice", description: "Complete your first 5 tasks", iconUrl: undefined, earnedAt: new Date() },
  { id: "2", name: "Recycler", description: "Complete 10 recycling tasks", iconUrl: undefined, earnedAt: new Date() },
  { id: "3", name: "Week Warrior", description: "7-day task streak", iconUrl: undefined, earnedAt: new Date() },
  { id: "4", name: "Tree Hugger", description: "Plant 5 trees", iconUrl: undefined, locked: true },
  { id: "5", name: "Ocean Guardian", description: "Complete 5 water conservation tasks", iconUrl: undefined, locked: true },
];

export default function UserDashboard() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const levelProgress = 65;
  const currentLevel = 5;

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={!!user} userRole={role || "student"} onLogout={handleLogout} />
      
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Welcome back, Alex! 👋
          </h1>
          <p className="text-muted-foreground">
            You're on a {userStats.streak}-day streak. Keep up the great work!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up delay-100">
          <StatsCard
            title="Total Points"
            value={userStats.points.toLocaleString()}
            icon={Zap}
            color="sun"
            trend={{ value: 12, positive: true }}
          />
          <StatsCard
            title="Tasks Completed"
            value={userStats.tasksCompleted}
            icon={CheckCircle2}
            color="leaf"
          />
          <StatsCard
            title="Current Streak"
            value={`${userStats.streak} days`}
            icon={TrendingUp}
            color="primary"
          />
          <StatsCard
            title="Global Rank"
            value={`#${userStats.rank}`}
            icon={Target}
            color="sky"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Level Progress */}
            <Card variant="eco" className="animate-slide-up delay-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <ProgressRing progress={levelProgress} size={100}>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{currentLevel}</p>
                      <p className="text-xs text-muted-foreground">Level</p>
                    </div>
                  </ProgressRing>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg text-foreground mb-1">
                      Eco Apprentice
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {350 - Math.floor(350 * levelProgress / 100)} points to Level {currentLevel + 1}
                    </p>
                    <div className="eco-progress w-full">
                      <div className="eco-progress-bar" style={{ width: `${levelProgress}%` }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Tasks */}
            <div className="animate-slide-up delay-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-bold text-foreground">
                  Suggested Tasks
                </h2>
                <Link to="/tasks">
                  <Button variant="ghost" size="sm">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {suggestedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="animate-slide-up delay-400">
              <BadgeDisplay badges={userBadges} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card variant="eco" className="animate-slide-up delay-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground text-sm">{submission.taskTitle}</p>
                      <p className="text-xs text-muted-foreground">{submission.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={submission.status === "approved" ? "success" : "pending"}>
                        {submission.status}
                      </Badge>
                      {submission.status === "approved" && (
                        <p className="text-xs text-eco-leaf mt-1">+{submission.points} pts</p>
                      )}
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full" size="sm">
                  View All Activity
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card variant="eco" className="animate-slide-up delay-300">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/tasks">
                  <Button variant="default" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Browse Tasks
                  </Button>
                </Link>
                <Link to="/rewards">
                  <Button variant="secondary" className="w-full justify-start">
                    <Zap className="h-4 w-4 mr-2" />
                    Redeem Rewards
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
