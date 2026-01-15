import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, UserPlus, UserCheck, Search, Link2, 
  Check, X, Clock, MapPin
} from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  headline?: string;
  location?: string;
  skills?: string[];
  connection_status?: 'none' | 'pending_sent' | 'pending_received' | 'connected';
  is_following?: boolean;
  mutual_connections?: number;
}

export function NetworkConnections() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("discover");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [connections, setConnections] = useState<UserProfile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Fetch all users for discovery
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_url, headline, location, skills')
        .neq('id', user.id)
        .limit(50);

      // Fetch user's connections
      const { data: connectionsData } = await supabase
        .from('user_connections')
        .select('*')
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

      // Fetch user's follows
      const { data: followingData } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', user.id);

      const { data: followersData } = await supabase
        .from('user_follows')
        .select('follower_id')
        .eq('following_id', user.id);

      const followingIds = followingData?.map(f => f.following_id) || [];
      const followerIds = followersData?.map(f => f.follower_id) || [];

      // Process connections
      const acceptedConnections = connectionsData?.filter(c => c.status === 'accepted') || [];
      const connectedUserIds = acceptedConnections.map(c => 
        c.requester_id === user.id ? c.addressee_id : c.requester_id
      );

      const pendingReceived = connectionsData?.filter(c => 
        c.status === 'pending' && c.addressee_id === user.id
      ) || [];
      const pendingReceivedIds = pendingReceived.map(c => c.requester_id);

      const pendingSent = connectionsData?.filter(c => 
        c.status === 'pending' && c.requester_id === user.id
      ) || [];
      const pendingSentIds = pendingSent.map(c => c.addressee_id);

      // Map users with connection status
      const usersWithStatus = allUsers?.map(u => ({
        ...u,
        connection_status: connectedUserIds.includes(u.id) ? 'connected' as const :
          pendingSentIds.includes(u.id) ? 'pending_sent' as const :
          pendingReceivedIds.includes(u.id) ? 'pending_received' as const : 'none' as const,
        is_following: followingIds.includes(u.id)
      })) || [];

      setUsers(usersWithStatus.filter(u => u.connection_status === 'none'));
      setConnections(usersWithStatus.filter(u => u.connection_status === 'connected'));
      setPendingRequests(usersWithStatus.filter(u => u.connection_status === 'pending_received'));
      setFollowing(usersWithStatus.filter(u => followingIds.includes(u.id)));
      setFollowers(allUsers?.filter(u => followerIds.includes(u.id)).map(u => ({
        ...u,
        connection_status: 'none' as const,
        is_following: followingIds.includes(u.id)
      })) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (userId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('user_connections').insert({
        requester_id: user.id,
        addressee_id: userId
      });

      if (error) throw error;
      toast.success("Connection request sent!");
      fetchData();
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error("Failed to send request");
    }
  };

  const handleAcceptRequest = async (userId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_connections')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('requester_id', userId)
        .eq('addressee_id', user.id);

      if (error) throw error;
      toast.success("Connection accepted!");
      fetchData();
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error("Failed to accept request");
    }
  };

  const handleRejectRequest = async (userId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_connections')
        .delete()
        .eq('requester_id', userId)
        .eq('addressee_id', user.id);

      if (error) throw error;
      toast.success("Request declined");
      fetchData();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleFollow = async (userId: string, isFollowing: boolean) => {
    if (!user) return;

    try {
      if (isFollowing) {
        await supabase.from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);
        toast.success("Unfollowed");
      } else {
        await supabase.from('user_follows').insert({
          follower_id: user.id,
          following_id: userId
        });
        toast.success("Following!");
      }
      fetchData();
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const filteredUsers = (list: UserProfile[]) => 
    list.filter(u => 
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.headline?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const UserCard = ({ profile, showActions = true }: { profile: UserProfile; showActions?: boolean }) => (
    <Card variant="eco" className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="text-lg">{profile.name?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{profile.name}</h3>
            {profile.headline && (
              <p className="text-sm text-muted-foreground truncate">{profile.headline}</p>
            )}
            {profile.location && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {profile.location}
              </p>
            )}
            {profile.skills && profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {profile.skills.slice(0, 3).map((skill, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                ))}
              </div>
            )}
          </div>
          {showActions && (
            <div className="flex flex-col gap-2">
              {profile.connection_status === 'none' && (
                <Button size="sm" onClick={() => handleConnect(profile.id)}>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Connect
                </Button>
              )}
              {profile.connection_status === 'pending_sent' && (
                <Button size="sm" variant="outline" disabled>
                  <Clock className="h-4 w-4 mr-1" />
                  Pending
                </Button>
              )}
              {profile.connection_status === 'pending_received' && (
                <div className="flex gap-1">
                  <Button size="sm" onClick={() => handleAcceptRequest(profile.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleRejectRequest(profile.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {profile.connection_status === 'connected' && (
                <Badge variant="outline" className="text-primary border-primary">
                  <UserCheck className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              )}
              <Button 
                size="sm" 
                variant={profile.is_following ? "outline" : "secondary"}
                onClick={() => handleFollow(profile.id, profile.is_following || false)}
              >
                {profile.is_following ? "Following" : "Follow"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card variant="eco">
          <CardContent className="p-4 text-center">
            <Link2 className="h-6 w-6 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{connections.length}</p>
            <p className="text-sm text-muted-foreground">Connections</p>
          </CardContent>
        </Card>
        <Card variant="eco">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto text-eco-sun mb-1" />
            <p className="text-2xl font-bold">{pendingRequests.length}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card variant="eco">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto text-eco-sky mb-1" />
            <p className="text-2xl font-bold">{following.length}</p>
            <p className="text-sm text-muted-foreground">Following</p>
          </CardContent>
        </Card>
        <Card variant="eco">
          <CardContent className="p-4 text-center">
            <UserPlus className="h-6 w-6 mx-auto text-eco-reward mb-1" />
            <p className="text-2xl font-bold">{followers.length}</p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="connections">
            Connections {connections.length > 0 && `(${connections.length})`}
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending {pendingRequests.length > 0 && `(${pendingRequests.length})`}
          </TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredUsers(users).map(profile => (
              <UserCard key={profile.id} profile={profile} />
            ))}
          </div>
          {filteredUsers(users).length === 0 && (
            <p className="text-center text-muted-foreground py-8">No users to discover</p>
          )}
        </TabsContent>

        <TabsContent value="connections" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredUsers(connections).map(profile => (
              <UserCard key={profile.id} profile={profile} />
            ))}
          </div>
          {filteredUsers(connections).length === 0 && (
            <p className="text-center text-muted-foreground py-8">No connections yet</p>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {pendingRequests.map(profile => (
              <UserCard key={profile.id} profile={profile} />
            ))}
          </div>
          {pendingRequests.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No pending requests</p>
          )}
        </TabsContent>

        <TabsContent value="following" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredUsers(following).map(profile => (
              <UserCard key={profile.id} profile={profile} />
            ))}
          </div>
          {filteredUsers(following).length === 0 && (
            <p className="text-center text-muted-foreground py-8">Not following anyone</p>
          )}
        </TabsContent>

        <TabsContent value="followers" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredUsers(followers).map(profile => (
              <UserCard key={profile.id} profile={profile} />
            ))}
          </div>
          {filteredUsers(followers).length === 0 && (
            <p className="text-center text-muted-foreground py-8">No followers yet</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
