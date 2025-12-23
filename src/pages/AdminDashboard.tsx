import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, CheckCircle2, XCircle, Clock, AlertTriangle,
  TrendingUp, Star, Gift, Eye, BarChart3, Activity,
  Package, Shield
} from "lucide-react";
import { toast } from "sonner";

interface AdminStats {
  totalUsers: number;
  pendingSubmissions: number;
  approvedToday: number;
  rejectedToday: number;
  flaggedSubmissions: number;
  totalPointsAwarded: number;
  pendingRedemptions: number;
}

interface RecentSubmission {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  ai_flagged: boolean;
  tasks?: { title: string; points: number } | null;
  user_profile?: { name: string | null; email: string | null } | null;
}

export default function AdminDashboard() {
  const { user, role } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    pendingSubmissions: 0,
    approvedToday: 0,
    rejectedToday: 0,
    flaggedSubmissions: 0,
    totalPointsAwarded: 0,
    pendingRedemptions: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && role === 'admin') {
      fetchAdminData();
    }
  }, [user, role]);

  const fetchAdminData = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch pending submissions
      const { count: pendingCount } = await supabase
        .from('task_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch approved today
      const { count: approvedTodayCount } = await supabase
        .from('task_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')
        .gte('reviewed_at', today.toISOString());

      // Fetch rejected today
      const { count: rejectedTodayCount } = await supabase
        .from('task_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected')
        .gte('reviewed_at', today.toISOString());

      // Fetch flagged submissions
      const { count: flaggedCount } = await supabase
        .from('task_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('ai_flagged', true)
        .eq('status', 'pending');

      // Fetch pending redemptions
      const { count: redemptionsCount } = await supabase
        .from('redemptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch total points awarded
      const { data: pointsData } = await supabase
        .from('task_submissions')
        .select('points_awarded')
        .eq('status', 'approved');

      const totalPoints = pointsData?.reduce((sum, s) => sum + (s.points_awarded || 0), 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        pendingSubmissions: pendingCount || 0,
        approvedToday: approvedTodayCount || 0,
        rejectedToday: rejectedTodayCount || 0,
        flaggedSubmissions: flaggedCount || 0,
        totalPointsAwarded: totalPoints,
        pendingRedemptions: redemptionsCount || 0
      });

      // Fetch recent submissions
      const { data: submissions } = await supabase
        .from('task_submissions')
        .select(`
          id, user_id, status, created_at, ai_flagged,
          tasks (title, points)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch user profiles
      if (submissions && submissions.length > 0) {
        const userIds = [...new Set(submissions.map(s => s.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, email')
          .in('id', userIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        setRecentSubmissions(submissions.map(s => ({
          ...s,
          user_profile: profileMap.get(s.user_id) || null
        })));
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, flagged: boolean) => {
    if (flagged && status === 'pending') {
      return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />Flagged</Badge>;
    }
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-primary">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-display font-bold text-foreground">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground">
              Monitor submissions, manage users, and track platform activity
            </p>
          </div>
          <Link to="/admin/review">
            <Button variant="hero">
              <Eye className="h-4 w-4 mr-2" />
              Review Submissions
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                  <p className="text-sm text-muted-foreground">Flagged</p>
                  <p className="text-3xl font-display font-bold text-destructive">
                    {stats.flaggedSubmissions}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="eco">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved Today</p>
                  <p className="text-3xl font-display font-bold text-primary">
                    {stats.approvedToday}
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
                  <p className="text-sm text-muted-foreground">Rejected Today</p>
                  <p className="text-3xl font-display font-bold text-foreground">
                    {stats.rejectedToday}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted">
                  <XCircle className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card variant="eco">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-eco-sun/10">
                  <Users className="h-6 w-6 text-eco-sun" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="eco">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Points Awarded</p>
                  <p className="text-2xl font-bold">{stats.totalPointsAwarded.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="eco">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-eco-reward/10">
                  <Package className="h-6 w-6 text-eco-reward" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Redemptions</p>
                  <p className="text-2xl font-bold">{stats.pendingRedemptions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card variant="eco">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/review" className="block">
                <div className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-primary" />
                      <span className="font-medium">Review Submissions</span>
                    </div>
                    {stats.pendingSubmissions > 0 && (
                      <Badge>{stats.pendingSubmissions}</Badge>
                    )}
                  </div>
                </div>
              </Link>
              <Link to="/admin/review?tab=flagged" className="block">
                <div className="p-4 rounded-lg border border-border hover:border-destructive/50 hover:bg-destructive/5 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <span className="font-medium">Flagged Items</span>
                    </div>
                    {stats.flaggedSubmissions > 0 && (
                      <Badge variant="destructive">{stats.flaggedSubmissions}</Badge>
                    )}
                  </div>
                </div>
              </Link>
              <Link to="/rewards" className="block">
                <div className="p-4 rounded-lg border border-border hover:border-eco-reward/50 hover:bg-eco-reward/5 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Gift className="h-5 w-5 text-eco-reward" />
                      <span className="font-medium">Manage Rewards</span>
                    </div>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Submissions */}
          <Card variant="eco" className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Recent Submissions
                </span>
                <Link to="/admin/review">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentSubmissions.length > 0 ? (
                <div className="space-y-3">
                  {recentSubmissions.slice(0, 6).map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {submission.tasks?.title || 'Unknown Task'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {submission.user_profile?.name || submission.user_profile?.email || 'Unknown'} • {new Date(submission.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(submission.status, submission.ai_flagged)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No submissions yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}