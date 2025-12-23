import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Gift, Star, ShoppingBag, Package, CheckCircle2, 
  AlertTriangle, Loader2
} from "lucide-react";
import { toast } from "sonner";

interface Reward {
  id: string;
  name: string;
  description: string;
  cost_points: number;
  stock: number | null;
  image_url: string | null;
  redeemable_external: boolean;
}

interface Redemption {
  id: string;
  reward_id: string;
  status: string;
  created_at: string;
  rewards?: any;
}

export default function Rewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')
        .eq('is_active', true)
        .order('cost_points', { ascending: true });

      if (rewardsError) throw rewardsError;
      setRewards(rewardsData || []);

      // Fetch user points and redemptions if logged in
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', user.id)
          .maybeSingle();

        setUserPoints(profile?.points || 0);

        const { data: redemptionsData } = await supabase
          .from('redemptions')
          .select(`
            id,
            reward_id,
            status,
            created_at,
            rewards (name, description, cost_points)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        setRedemptions(redemptionsData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemClick = (reward: Reward) => {
    if (!user) {
      toast.error('Please log in to redeem rewards');
      return;
    }

    if (userPoints < reward.cost_points) {
      toast.error('Insufficient points');
      return;
    }

    setSelectedReward(reward);
    setConfirmDialogOpen(true);
  };

  const handleConfirmRedeem = async () => {
    if (!user || !selectedReward) return;

    setRedeeming(true);

    try {
      const { data, error } = await supabase.rpc('redeem_reward', {
        p_user_id: user.id,
        p_reward_id: selectedReward.id
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; redemption_id?: string };

      if (!result.success) {
        throw new Error(result.error || 'Redemption failed');
      }

      toast.success('Reward redeemed successfully!');
      setConfirmDialogOpen(false);
      setSelectedReward(null);
      fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Redemption error:', error);
      toast.error(error.message || 'Failed to redeem reward');
    } finally {
      setRedeeming(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'fulfilled':
        return <Badge className="bg-primary">Fulfilled</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
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
        {/* Header with Points */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Rewards Store
            </h1>
            <p className="text-muted-foreground">
              Redeem your earned points for eco-friendly rewards
            </p>
          </div>
          {user && (
            <Card variant="eco" className="px-6 py-3">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-eco-sun" />
                <div>
                  <p className="text-sm text-muted-foreground">Your Points</p>
                  <p className="text-2xl font-bold text-foreground">{userPoints.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Rewards Grid */}
          <div className="lg:col-span-2">
            <div className="grid sm:grid-cols-2 gap-6">
              {rewards.map((reward) => (
                <Card key={reward.id} variant="eco" className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-eco-leaf/20 flex items-center justify-center">
                    {reward.image_url ? (
                      <img
                        src={reward.image_url}
                        alt={reward.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Gift className="h-16 w-16 text-primary/50" />
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-display font-bold text-lg text-foreground">
                        {reward.name}
                      </h3>
                      {reward.stock !== null && reward.stock <= 10 && reward.stock > 0 && (
                        <Badge variant="secondary">Only {reward.stock} left</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {reward.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-eco-sun font-bold">
                        <Star className="h-5 w-5" />
                        <span>{reward.cost_points.toLocaleString()}</span>
                      </div>
                      <Button
                        variant={userPoints >= reward.cost_points ? "hero" : "outline"}
                        size="sm"
                        onClick={() => handleRedeemClick(reward)}
                        disabled={!user || (reward.stock !== null && reward.stock <= 0)}
                      >
                        {reward.stock !== null && reward.stock <= 0 ? (
                          'Out of Stock'
                        ) : userPoints >= reward.cost_points ? (
                          'Redeem'
                        ) : (
                          `Need ${(reward.cost_points - userPoints).toLocaleString()} more`
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Redemption History */}
          <div>
            <Card variant="eco">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Your Redemptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Log in to see your redemptions
                  </p>
                ) : redemptions.length > 0 ? (
                  <div className="space-y-4">
                    {redemptions.map((redemption: any) => (
                      <div key={redemption.id} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex items-start gap-3">
                          <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">{redemption.rewards?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(redemption.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(redemption.status)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No redemptions yet. Earn points and redeem rewards!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
            <DialogDescription>
              You are about to redeem:
            </DialogDescription>
          </DialogHeader>
          {selectedReward && (
            <div className="py-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
                <Gift className="h-10 w-10 text-primary" />
                <div>
                  <p className="font-semibold">{selectedReward.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedReward.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 p-3 rounded-lg bg-eco-sun/10">
                <span className="text-sm font-medium">Points to spend:</span>
                <span className="font-bold text-eco-sun">
                  {selectedReward.cost_points.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">Remaining balance:</span>
                <span className="font-bold">
                  {(userPoints - selectedReward.cost_points).toLocaleString()}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={handleConfirmRedeem} disabled={redeeming}>
              {redeeming ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirm Redemption
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}