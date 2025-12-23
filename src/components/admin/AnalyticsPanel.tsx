import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart3, TrendingUp, Users, Leaf, Download,
  Calendar, MapPin, Activity
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface AnalyticsData {
  monthlySubmissions: { month: string; count: number }[];
  categoryBreakdown: { category: string; count: number }[];
  userGrowth: { month: string; users: number }[];
  topPerformers: { name: string; points: number }[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--eco-sky))', 'hsl(var(--eco-sun))', 'hsl(var(--eco-reward))'];

export function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsData>({
    monthlySubmissions: [],
    categoryBreakdown: [],
    userGrowth: [],
    topPerformers: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("6months");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Fetch submissions for monthly breakdown
      const { data: submissions } = await supabase
        .from('task_submissions')
        .select('created_at, status, tasks(category)')
        .eq('status', 'approved');

      // Process monthly submissions
      const monthlyMap = new Map<string, number>();
      const categoryMap = new Map<string, number>();
      
      submissions?.forEach(s => {
        const month = new Date(s.created_at).toLocaleString('default', { month: 'short' });
        monthlyMap.set(month, (monthlyMap.get(month) || 0) + 1);
        
        const category = (s.tasks as any)?.category || 'other';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });

      const monthlySubmissions = Array.from(monthlyMap.entries()).map(([month, count]) => ({
        month,
        count
      }));

      const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count
      }));

      // Fetch user growth
      const { data: profiles } = await supabase
        .from('profiles')
        .select('created_at');

      const userGrowthMap = new Map<string, number>();
      let runningTotal = 0;
      profiles?.sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime())
        .forEach(p => {
          const month = new Date(p.created_at!).toLocaleString('default', { month: 'short' });
          runningTotal++;
          userGrowthMap.set(month, runningTotal);
        });

      const userGrowth = Array.from(userGrowthMap.entries()).map(([month, users]) => ({
        month,
        users
      }));

      // Fetch top performers
      const { data: topUsers } = await supabase
        .from('profiles')
        .select('name, email, points')
        .order('points', { ascending: false })
        .limit(5);

      const topPerformers = (topUsers || []).map(u => ({
        name: u.name || u.email || 'Anonymous',
        points: u.points || 0
      }));

      setData({
        monthlySubmissions,
        categoryBreakdown,
        userGrowth,
        topPerformers
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ...data.monthlySubmissions.map(m => [`Submissions ${m.month}`, m.count]),
      ...data.categoryBreakdown.map(c => [`Category ${c.category}`, c.count]),
      ...data.topPerformers.map(p => [`Top Performer: ${p.name}`, p.points])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-report.csv';
    a.click();
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Analytics & Reports</h2>
          <p className="text-muted-foreground">Platform performance and impact metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Submissions */}
        <Card variant="eco">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Monthly Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlySubmissions}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card variant="eco">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-eco-sky" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="hsl(var(--eco-sky))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card variant="eco">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Task Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="category"
                    label={({ category }) => category}
                  >
                    {data.categoryBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card variant="eco">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-eco-sun" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <span className="font-medium">{performer.name}</span>
                  </div>
                  <Badge variant="secondary">{performer.points.toLocaleString()} pts</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
