import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Users, FileCheck, AlertCircle, TrendingUp, 
  ClipboardList, Gift, Settings, ChevronRight,
  CheckCircle2, XCircle, Clock, BarChart3,
  Plus, Eye, Brain
} from "lucide-react";

// Mock admin data
const adminStats = {
  totalUsers: 1542,
  pendingSubmissions: 23,
  activeTasks: 45,
  totalPointsAwarded: 87500,
};

const pendingSubmissions = [
  { 
    id: "1", 
    userName: "Sarah Johnson", 
    taskTitle: "Park Cleanup", 
    submittedAt: "10 minutes ago",
    photos: 2,
    hasGPS: true
  },
  { 
    id: "2", 
    userName: "Mike Chen", 
    taskTitle: "Recycling Drop-off", 
    submittedAt: "25 minutes ago",
    photos: 3,
    hasGPS: true
  },
  { 
    id: "3", 
    userName: "Emma Wilson", 
    taskTitle: "Tree Planting", 
    submittedAt: "1 hour ago",
    photos: 4,
    hasGPS: false
  },
  { 
    id: "4", 
    userName: "David Lee", 
    taskTitle: "Beach Cleanup", 
    submittedAt: "2 hours ago",
    photos: 2,
    hasGPS: true
  },
];

const recentActivity = [
  { id: "1", action: "Approved submission", user: "John D.", task: "Garden Volunteer", time: "5 min ago", type: "approval" },
  { id: "2", action: "Created new task", task: "Solar Panel Workshop", time: "1 hour ago", type: "create" },
  { id: "3", action: "Rejected submission", user: "Anonymous", task: "Recycling", time: "2 hours ago", type: "rejection" },
  { id: "4", action: "Updated reward", task: "Eco Water Bottle", time: "3 hours ago", type: "update" },
];

const topPerformers = [
  { id: "1", name: "Sarah Johnson", points: 2450, tasks: 34, avatar: null },
  { id: "2", name: "Mike Chen", points: 2180, tasks: 29, avatar: null },
  { id: "3", name: "Emma Wilson", points: 1920, tasks: 26, avatar: null },
];

export default function AdminDashboard() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={!!user} userRole={role || "admin"} onLogout={handleLogout} />
      
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage submissions, tasks, and monitor platform activity
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/submissions">
                <Button variant="default">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Review Submissions
                </Button>
              </Link>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up delay-100">
          <StatsCard
            title="Total Users"
            value={adminStats.totalUsers.toLocaleString()}
            icon={Users}
            color="primary"
            trend={{ value: 8, positive: true }}
          />
          <StatsCard
            title="Pending Reviews"
            value={adminStats.pendingSubmissions}
            icon={AlertCircle}
            color="sun"
          />
          <StatsCard
            title="Active Tasks"
            value={adminStats.activeTasks}
            icon={ClipboardList}
            color="leaf"
          />
          <StatsCard
            title="Points Awarded"
            value={adminStats.totalPointsAwarded.toLocaleString()}
            icon={TrendingUp}
            color="sky"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pending Submissions */}
            <Card variant="eco" className="animate-slide-up delay-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-eco-sun" />
                      Pending Submissions
                    </CardTitle>
                    <CardDescription>
                      {adminStats.pendingSubmissions} submissions awaiting review
                    </CardDescription>
                  </div>
                  <Link to="/admin/submissions">
                    <Button variant="ghost" size="sm">
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingSubmissions.map((submission) => (
                    <div 
                      key={submission.id} 
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {submission.userName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{submission.userName}</p>
                          <p className="text-sm text-muted-foreground">{submission.taskTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <p className="text-muted-foreground">{submission.submittedAt}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {submission.photos} photos
                            </Badge>
                            {submission.hasGPS ? (
                              <Badge variant="success" className="text-xs">GPS</Badge>
                            ) : (
                              <Badge variant="pending" className="text-xs">No GPS</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-eco-leaf hover:text-eco-leaf hover:bg-eco-leaf/10">
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Grid */}
            <div className="grid sm:grid-cols-2 gap-4 animate-slide-up delay-300">
              <Card variant="eco" className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground">Create Task</h3>
                      <p className="text-sm text-muted-foreground">Add a new environmental task</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="eco" className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-eco-leaf/10 flex items-center justify-center">
                      <Gift className="h-6 w-6 text-eco-leaf" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground">Manage Rewards</h3>
                      <p className="text-sm text-muted-foreground">Update available rewards</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="eco" className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-eco-sky/10 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-eco-sky" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground">View Analytics</h3>
                      <p className="text-sm text-muted-foreground">Platform statistics & reports</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="eco" className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-eco-sun/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-eco-sun" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground">Manage Users</h3>
                      <p className="text-sm text-muted-foreground">View and manage user accounts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Performers */}
            <Card variant="eco" className="animate-slide-up delay-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-eco-leaf" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topPerformers.map((user, index) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.tasks} tasks completed</p>
                    </div>
                    <Badge variant="success">{user.points.toLocaleString()} pts</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card variant="eco" className="animate-slide-up delay-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      activity.type === 'approval' ? 'bg-eco-leaf' :
                      activity.type === 'rejection' ? 'bg-destructive' :
                      activity.type === 'create' ? 'bg-primary' :
                      'bg-eco-sun'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{activity.action}</span>
                        {activity.user && <span className="text-muted-foreground"> by {activity.user}</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.task} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card variant="eco" className="animate-slide-up delay-400">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Database</span>
                  <Badge variant="success">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Storage</span>
                  <Badge variant="success">67% used</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API</span>
                  <Badge variant="success">Operational</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
