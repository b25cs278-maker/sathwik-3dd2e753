import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Shield, Users, Activity, AlertTriangle, Eye, Search, Clock
} from "lucide-react";
import { toast } from "sonner";

interface ActivityLog {
  id: string;
  user_id: string | null;
  event_type: string;
  payload: any;
  created_at: string;
  user_profile?: { name: string | null; email: string | null } | null;
}

interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  user_profile?: { name: string | null; email: string | null } | null;
}

export function SecurityPanel() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch activity logs
      const { data: logs, error: logsError } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (logsError) throw logsError;

      // Fetch user profiles for logs
      const logUserIds = [...new Set((logs || []).map(l => l.user_id).filter(Boolean))];
      const { data: logProfiles } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', logUserIds as string[]);

      const logProfileMap = new Map(logProfiles?.map(p => [p.id, p]) || []);
      
      const logsWithProfiles = (logs || []).map(l => ({
        ...l,
        user_profile: l.user_id ? logProfileMap.get(l.user_id) || null : null
      }));

      setActivityLogs(logsWithProfiles);

      // Fetch admin users
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('role', 'admin');

      if (rolesError) throw rolesError;

      // Fetch profiles for admins
      const adminUserIds = (roles || []).map(r => r.user_id);
      const { data: adminProfiles } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', adminUserIds);

      const adminProfileMap = new Map(adminProfiles?.map(p => [p.id, p]) || []);

      const adminsWithProfiles = (roles || []).map(r => ({
        ...r,
        user_profile: adminProfileMap.get(r.user_id) || null
      }));

      setAdminUsers(adminsWithProfiles);
    } catch (error) {
      console.error('Error fetching security data:', error);
      toast.error('Failed to load security data');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = activityLogs.filter(log =>
    log.event_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user_profile?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEventBadge = (eventType: string) => {
    if (eventType.includes('reward') || eventType.includes('points')) {
      return <Badge className="bg-eco-sun">{eventType}</Badge>;
    }
    if (eventType.includes('error') || eventType.includes('fail')) {
      return <Badge variant="destructive">{eventType}</Badge>;
    }
    return <Badge variant="secondary">{eventType}</Badge>;
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
        <h2 className="text-2xl font-bold mb-2">Security & Access Control</h2>
        <p className="text-muted-foreground">Monitor activity and manage admin access</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admin Users</p>
                <p className="text-2xl font-bold">{adminUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Activity Logs</p>
                <p className="text-2xl font-bold">{activityLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-eco-sun/10">
                <AlertTriangle className="h-6 w-6 text-eco-sun" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Flagged Activities</p>
                <p className="text-2xl font-bold">
                  {activityLogs.filter(l => l.event_type.includes('flag') || l.event_type.includes('reject')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Users */}
      <Card variant="eco">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Admin Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {adminUsers.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium">{admin.user_profile?.name || 'Unnamed'}</p>
                    <p className="text-sm text-muted-foreground">{admin.user_profile?.email}</p>
                  </div>
                </div>
                <Badge variant="destructive">Admin</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs */}
      <Card variant="eco">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Activity Logs
            </span>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.slice(0, 20).map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{getEventBadge(log.event_type)}</TableCell>
                  <TableCell>
                    {log.user_profile?.name || log.user_profile?.email || 'System'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.payload ? JSON.stringify(log.payload).slice(0, 50) : '-'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
