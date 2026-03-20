import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  AlertTriangle,
  Users,
  ArrowUpDown,
  Shield,
} from "lucide-react";

interface UserReferralData {
  id: string;
  name: string;
  email: string;
  points: number;
  referrals_count: number;
  valid_referrals: number;
  quiz_attempts: number;
  quiz_completed: boolean;
  user_ip: string | null;
  device_id: string | null;
  referral_code: string;
  referred_by: string | null;
}

export function ReferralManagement() {
  const [users, setUsers] = useState<UserReferralData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"points" | "referrals_count">("points");
  const [sortAsc, setSortAsc] = useState(false);
  const [suspicious, setSuspicious] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select(
          "id, name, email, points, referrals_count, valid_referrals, quiz_attempts, quiz_completed, user_ip, device_id, referral_code, referred_by"
        )
        .order("points", { ascending: false });

      if (data) {
        setUsers(data as UserReferralData[]);
        detectSuspicious(data as UserReferralData[]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const detectSuspicious = (data: UserReferralData[]) => {
    const suspiciousIds: string[] = [];

    // Check for duplicate IPs with many referrals
    const ipCounts: Record<string, string[]> = {};
    data.forEach((u) => {
      if (u.user_ip) {
        if (!ipCounts[u.user_ip]) ipCounts[u.user_ip] = [];
        ipCounts[u.user_ip].push(u.id);
      }
    });

    Object.values(ipCounts).forEach((ids) => {
      if (ids.length > 3) {
        ids.forEach((id) => suspiciousIds.push(id));
      }
    });

    // Check for duplicate device IDs
    const deviceCounts: Record<string, string[]> = {};
    data.forEach((u) => {
      if (u.device_id) {
        if (!deviceCounts[u.device_id]) deviceCounts[u.device_id] = [];
        deviceCounts[u.device_id].push(u.id);
      }
    });

    Object.values(deviceCounts).forEach((ids) => {
      if (ids.length > 3) {
        ids.forEach((id) => suspiciousIds.push(id));
      }
    });

    setSuspicious([...new Set(suspiciousIds)]);
  };

  const filteredUsers = users
    .filter(
      (u) =>
        !search ||
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.referral_code?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField] || 0;
      const bVal = b[sortField] || 0;
      return sortAsc ? aVal - bVal : bVal - aVal;
    });

  const toggleSort = (field: "points" | "referrals_count") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Referral Management
        </h2>
        <p className="text-muted-foreground">
          Monitor referrals, detect fraud, and manage user points
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {users.filter((u) => u.quiz_completed).length}
            </p>
            <p className="text-xs text-muted-foreground">Quiz Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {users.reduce((sum, u) => sum + (u.valid_referrals || 0), 0)}
            </p>
            <p className="text-xs text-muted-foreground">Total Valid Referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">
              {suspicious.length}
            </p>
            <p className="text-xs text-muted-foreground">Suspicious Accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort("points")}
                      className="p-0 h-auto font-medium"
                    >
                      Points <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSort("referrals_count")}
                      className="p-0 h-auto font-medium"
                    >
                      Referrals <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>Quiz</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      {u.name || "—"}
                    </TableCell>
                    <TableCell className="text-sm">{u.email || "—"}</TableCell>
                    <TableCell>{u.points || 0}</TableCell>
                    <TableCell>
                      {u.referrals_count || 0} / {u.valid_referrals || 0}
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.quiz_completed ? "default" : "secondary"}>
                        {u.quiz_attempts || 0} attempt{(u.quiz_attempts || 0) !== 1 ? "s" : ""}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {u.user_ip || "—"}
                    </TableCell>
                    <TableCell className="text-xs font-mono max-w-[80px] truncate">
                      {u.device_id || "—"}
                    </TableCell>
                    <TableCell>
                      {suspicious.includes(u.id) ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Suspicious
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <Shield className="h-3 w-3" />
                          Clean
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
