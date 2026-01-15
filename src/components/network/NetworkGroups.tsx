import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, Users, Lock, Globe, Plus, Search, 
  UserPlus, LogOut, Settings
} from "lucide-react";
import { toast } from "sonner";

interface NetworkGroup {
  id: string;
  name: string;
  description?: string;
  cover_image_url?: string;
  group_type: string;
  owner_id: string;
  members_count: number;
  posts_count: number;
  created_at: string;
  owner_name?: string;
  is_member?: boolean;
  member_role?: string;
}

export function NetworkGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<NetworkGroup[]>([]);
  const [myGroups, setMyGroups] = useState<NetworkGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("discover");
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    group_type: "public"
  });

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const fetchGroups = async () => {
    try {
      const { data: groupsData, error } = await supabase
        .from('network_groups')
        .select('*')
        .order('members_count', { ascending: false });

      if (error) throw error;

      const ownerIds = [...new Set(groupsData?.map(g => g.owner_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', ownerIds);

      let userMemberships: { group_id: string; role: string }[] = [];
      if (user) {
        const { data: memberships } = await supabase
          .from('group_members')
          .select('group_id, role')
          .eq('user_id', user.id)
          .eq('status', 'active');
        userMemberships = memberships || [];
      }

      const groupsWithDetails = groupsData?.map(group => ({
        ...group,
        owner_name: profiles?.find(p => p.id === group.owner_id)?.name || 'Unknown',
        is_member: userMemberships.some(m => m.group_id === group.id) || group.owner_id === user?.id,
        member_role: group.owner_id === user?.id ? 'admin' : 
          userMemberships.find(m => m.group_id === group.id)?.role
      })) || [];

      setGroups(groupsWithDetails.filter(g => !g.is_member));
      setMyGroups(groupsWithDetails.filter(g => g.is_member));
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!user || !newGroup.name.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    try {
      const { data: group, error } = await supabase
        .from('network_groups')
        .insert({
          name: newGroup.name,
          description: newGroup.description,
          group_type: newGroup.group_type,
          owner_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Add owner as admin member
      await supabase.from('group_members').insert({
        group_id: group.id,
        user_id: user.id,
        role: 'admin',
        status: 'active'
      });

      toast.success("Group created!");
      setShowCreateDialog(false);
      setNewGroup({ name: "", description: "", group_type: "public" });
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error("Failed to create group");
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user) {
      toast.error("Please log in");
      return;
    }

    try {
      const { error } = await supabase.from('group_members').insert({
        group_id: groupId,
        user_id: user.id,
        role: 'member',
        status: 'active'
      });

      if (error) throw error;
      toast.success("Joined group!");
      fetchGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error("Failed to join group");
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success("Left group");
      fetchGroups();
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const filteredGroups = (list: NetworkGroup[]) =>
    list.filter(g =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getGroupTypeIcon = (type: string) => {
    switch (type) {
      case 'private': return <Lock className="h-4 w-4" />;
      case 'hidden': return <Lock className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Community Groups</h3>
          <p className="text-muted-foreground">Join groups to connect with like-minded learners</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Group Name *</label>
                <Input
                  value={newGroup.name}
                  onChange={(e) => setNewGroup(p => ({ ...p, name: e.target.value }))}
                  placeholder="Enter group name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newGroup.description}
                  onChange={(e) => setNewGroup(p => ({ ...p, description: e.target.value }))}
                  placeholder="What's this group about?"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Privacy</label>
                <Select value={newGroup.group_type} onValueChange={(v) => setNewGroup(p => ({ ...p, group_type: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone can join</SelectItem>
                    <SelectItem value="private">Private - Request to join</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateGroup} className="w-full">
                Create Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups ({myGroups.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups(groups).map(group => (
              <Card key={group.id} variant="eco" className="overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-primary/20 to-eco-sky/20" />
                <CardContent className="p-4 -mt-8">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-background border-4 border-background shadow-lg mb-3">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold truncate">{group.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {getGroupTypeIcon(group.group_type)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {group.description || 'No description'}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {group.members_count} members
                    </span>
                    <span>by {group.owner_name}</span>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => handleJoinGroup(group.id)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join Group
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredGroups(groups).length === 0 && (
            <Card variant="eco">
              <CardContent className="p-8 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No groups to discover. Create one!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="my-groups" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups(myGroups).map(group => (
              <Card key={group.id} variant="eco" className="overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-primary/20 to-eco-sky/20" />
                <CardContent className="p-4 -mt-8">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-background border-4 border-background shadow-lg mb-3">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold truncate">{group.name}</h4>
                    {group.member_role === 'admin' && (
                      <Badge variant="default" className="text-xs">Admin</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {group.description || 'No description'}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {group.members_count} members
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View
                    </Button>
                    {group.member_role === 'admin' ? (
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleLeaveGroup(group.id)}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredGroups(myGroups).length === 0 && (
            <Card variant="eco">
              <CardContent className="p-8 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">You haven't joined any groups yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
