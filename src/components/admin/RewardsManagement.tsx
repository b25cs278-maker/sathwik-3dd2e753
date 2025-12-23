import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Edit, Trash2, Gift, Star, Package, Check, X
} from "lucide-react";
import { toast } from "sonner";

interface Reward {
  id: string;
  name: string;
  description: string | null;
  cost_points: number;
  stock: number | null;
  image_url: string | null;
  is_active: boolean | null;
  created_at: string;
}

interface Redemption {
  id: string;
  user_id: string;
  reward_id: string | null;
  status: string;
  created_at: string;
  fulfilled_at: string | null;
  reward?: Reward | null;
  user_profile?: { name: string | null; email: string | null } | null;
}

export function RewardsManagement() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cost_points: 100,
    stock: 10,
    image_url: "",
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')
        .order('created_at', { ascending: false });

      if (rewardsError) throw rewardsError;
      setRewards(rewardsData || []);

      // Fetch redemptions with reward details
      const { data: redemptionsData, error: redemptionsError } = await supabase
        .from('redemptions')
        .select(`
          *,
          rewards (*)
        `)
        .order('created_at', { ascending: false });

      if (redemptionsError) throw redemptionsError;

      // Fetch user profiles
      const userIds = [...new Set((redemptionsData || []).map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const redemptionsWithProfiles = (redemptionsData || []).map(r => ({
        ...r,
        reward: r.rewards,
        user_profile: profileMap.get(r.user_id) || null
      }));

      setRedemptions(redemptionsWithProfiles);
    } catch (error) {
      console.error('Error fetching rewards data:', error);
      toast.error('Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReward = async () => {
    if (!formData.name.trim()) {
      toast.error('Reward name is required');
      return;
    }

    setProcessing(true);
    try {
      if (editingReward) {
        const { error } = await supabase
          .from('rewards')
          .update(formData)
          .eq('id', editingReward.id);

        if (error) throw error;
        toast.success('Reward updated');
      } else {
        const { error } = await supabase
          .from('rewards')
          .insert(formData);

        if (error) throw error;
        toast.success('Reward created');
      }

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving reward:', error);
      toast.error('Failed to save reward');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteReward = async (id: string) => {
    if (!confirm('Delete this reward?')) return;

    try {
      const { error } = await supabase
        .from('rewards')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Reward deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting reward:', error);
      toast.error('Failed to delete reward');
    }
  };

  const handleRedemptionAction = async (redemptionId: string, action: 'fulfill' | 'reject') => {
    try {
      const updates = action === 'fulfill' 
        ? { status: 'fulfilled', fulfilled_at: new Date().toISOString() }
        : { status: 'rejected' };

      const { error } = await supabase
        .from('redemptions')
        .update(updates)
        .eq('id', redemptionId);

      if (error) throw error;
      toast.success(action === 'fulfill' ? 'Redemption fulfilled' : 'Redemption rejected');
      fetchData();
    } catch (error) {
      console.error('Error updating redemption:', error);
      toast.error('Failed to update redemption');
    }
  };

  const openEditDialog = (reward: Reward) => {
    setEditingReward(reward);
    setFormData({
      name: reward.name,
      description: reward.description || "",
      cost_points: reward.cost_points,
      stock: reward.stock || 0,
      image_url: reward.image_url || "",
      is_active: reward.is_active ?? true
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingReward(null);
    setFormData({
      name: "",
      description: "",
      cost_points: 100,
      stock: 10,
      image_url: "",
      is_active: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const pendingRedemptions = redemptions.filter(r => r.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Rewards & Points</h2>
          <p className="text-muted-foreground">Manage rewards and redemption requests</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Reward
        </Button>
      </div>

      <Tabs defaultValue="rewards">
        <TabsList>
          <TabsTrigger value="rewards">
            <Gift className="h-4 w-4 mr-2" />
            Rewards ({rewards.length})
          </TabsTrigger>
          <TabsTrigger value="redemptions">
            <Package className="h-4 w-4 mr-2" />
            Redemptions
            {pendingRedemptions.length > 0 && (
              <Badge className="ml-2" variant="destructive">{pendingRedemptions.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <Card key={reward.id} variant="eco" className={!reward.is_active ? 'opacity-60' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{reward.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(reward)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteReward(reward.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{reward.description || 'No description'}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-eco-sun" />
                      <span className="font-bold">{reward.cost_points} pts</span>
                    </div>
                    <Badge variant="outline">Stock: {reward.stock ?? '∞'}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="redemptions" className="mt-6">
          <Card variant="eco">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redemptions.map((redemption) => (
                    <TableRow key={redemption.id}>
                      <TableCell>
                        {redemption.user_profile?.name || redemption.user_profile?.email || 'Unknown'}
                      </TableCell>
                      <TableCell>{redemption.reward?.name || 'Unknown reward'}</TableCell>
                      <TableCell>
                        <Badge variant={
                          redemption.status === 'pending' ? 'secondary' :
                          redemption.status === 'fulfilled' ? 'default' : 'destructive'
                        }>
                          {redemption.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(redemption.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {redemption.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleRedemptionAction(redemption.id, 'fulfill')}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRedemptionAction(redemption.id, 'reject')}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingReward ? 'Edit Reward' : 'Add Reward'}</DialogTitle>
            <DialogDescription>Configure reward details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Points Cost</label>
                <Input
                  type="number"
                  value={formData.cost_points}
                  onChange={(e) => setFormData({ ...formData, cost_points: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Stock</label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Image URL</label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Active</label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveReward} disabled={processing}>
              {processing ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
