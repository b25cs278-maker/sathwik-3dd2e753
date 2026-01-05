import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, CheckCircle2, Clock, AlertTriangle, Star, 
  Leaf, Droplets, TreePine, Activity
} from "lucide-react";
import { ActiveUsersList } from "./ActiveUsersList";
interface OverviewStats {
  totalUsers: number;
  activeUsers: number;
  tasksCompleted: number;
  treesPlanted: number;
  wasteCollected: number;
  greenPointsIssued: number;
  pendingVerifications: number;
}

export function AdminOverview() {
  const [stats, setStats] = useState<OverviewStats>({
    totalUsers: 0,
    activeUsers: 0,
    tasksCompleted: 0,
    treesPlanted: 0,
    wasteCollected: 0,
    greenPointsIssued: 0,
    pendingVerifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Active users (active in last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', weekAgo.toISOString());

      // Tasks completed
      const { count: tasksCompleted } = await supabase
        .from('task_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      // Pending verifications
      const { count: pendingVerifications } = await supabase
        .from('task_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Total points awarded
      const { data: pointsData } = await supabase
        .from('task_submissions')
        .select('points_awarded')
        .eq('status', 'approved');
      
      const greenPointsIssued = pointsData?.reduce((sum, s) => sum + (s.points_awarded || 0), 0) || 0;

      // Estimate environmental impact based on task categories
      const { data: categoryData } = await supabase
        .from('task_submissions')
        .select('tasks(category)')
        .eq('status', 'approved');

      let treesPlanted = 0;
      let wasteCollected = 0;
      categoryData?.forEach(item => {
        const category = (item.tasks as any)?.category;
        if (category === 'conservation') treesPlanted++;
        if (category === 'recycling') wasteCollected++;
      });

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        tasksCompleted: tasksCompleted || 0,
        treesPlanted,
        wasteCollected,
        greenPointsIssued,
        pendingVerifications: pendingVerifications || 0
      });
    } catch (error) {
      console.error('Error fetching overview stats:', error);
    } finally {
      setLoading(false);
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Platform Overview</h2>
        <p className="text-muted-foreground">Real-time insights and performance metrics</p>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Registered Learners</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Learners</p>
                <p className="text-3xl font-bold">{stats.activeUsers}</p>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
              <div className="p-3 rounded-xl bg-eco-sky/10">
                <Activity className="h-6 w-6 text-eco-sky" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Workshops Conducted</p>
                <p className="text-3xl font-bold">{stats.tasksCompleted}</p>
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
                <p className="text-sm text-muted-foreground">Upcoming Workshops</p>
                <p className="text-3xl font-bold text-eco-sun">{stats.pendingVerifications}</p>
              </div>
              <div className="p-3 rounded-xl bg-eco-sun/10">
                <Clock className="h-6 w-6 text-eco-sun" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Impact */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <TreePine className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conservation Tasks</p>
                <p className="text-2xl font-bold">{stats.treesPlanted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-eco-sky/10">
                <Droplets className="h-6 w-6 text-eco-sky" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recycling Tasks</p>
                <p className="text-2xl font-bold">{stats.wasteCollected}</p>
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
                <p className="text-sm text-muted-foreground">Green Points Issued</p>
                <p className="text-2xl font-bold">{stats.greenPointsIssued.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Eco Impact Score</p>
                <p className="text-2xl font-bold">{Math.round(stats.tasksCompleted * 2.5)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Users List */}
      <ActiveUsersList />
    </div>
  );
}
