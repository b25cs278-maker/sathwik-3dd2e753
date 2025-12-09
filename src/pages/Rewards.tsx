import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RewardCard, Reward } from "@/components/rewards/RewardCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Gift, ShoppingBag, TreePine, Ticket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: "all", name: "All Rewards", icon: Gift },
  { id: "merchandise", name: "Merchandise", icon: ShoppingBag },
  { id: "experiences", name: "Experiences", icon: Ticket },
  { id: "donations", name: "Donations", icon: TreePine },
];

const mockRewards: Reward[] = [
  {
    id: "1",
    name: "EcoLearn T-Shirt",
    description: "Organic cotton t-shirt with the EcoLearn logo. Show your commitment to the environment!",
    costPoints: 500,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    stock: 25,
    category: "Merchandise",
  },
  {
    id: "2",
    name: "Reusable Water Bottle",
    description: "Premium stainless steel water bottle. Help reduce plastic waste with every sip.",
    costPoints: 300,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    stock: 50,
    category: "Merchandise",
  },
  {
    id: "3",
    name: "Plant a Tree",
    description: "We'll plant a tree in your name through our partner organization. Certificate included.",
    costPoints: 100,
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
    category: "Donations",
  },
  {
    id: "4",
    name: "Nature Walk Tour",
    description: "Guided nature walk with a local ecologist. Learn about local flora and fauna.",
    costPoints: 750,
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    stock: 10,
    category: "Experiences",
  },
  {
    id: "5",
    name: "Eco-Friendly Tote Bag",
    description: "Sturdy canvas tote bag made from recycled materials. Perfect for shopping.",
    costPoints: 200,
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400",
    stock: 100,
    category: "Merchandise",
  },
  {
    id: "6",
    name: "Ocean Cleanup Donation",
    description: "Your points will fund the removal of 1kg of plastic from the ocean.",
    costPoints: 250,
    imageUrl: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=400",
    category: "Donations",
  },
];

export default function Rewards() {
  const { toast } = useToast();
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserPoints() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("points")
        .eq("id", user.id)
        .maybeSingle();
      
      if (data) {
        setUserPoints(data.points || 0);
      }
      setLoading(false);
    }

    fetchUserPoints();
  }, [user]);

  const filteredRewards = mockRewards.filter(
    (reward) => selectedCategory === "all" || reward.category?.toLowerCase() === selectedCategory
  );

  const handleRedeem = async (rewardId: string) => {
    if (!user) {
      toast({ title: "Please log in to redeem rewards", variant: "destructive" });
      return;
    }

    const reward = mockRewards.find((r) => r.id === rewardId);
    if (!reward) return;

    if (userPoints < reward.costPoints) {
      toast({ 
        title: "Not enough points", 
        description: `You need ${reward.costPoints - userPoints} more points to redeem this reward.`,
        variant: "destructive" 
      });
      return;
    }

    // Deduct points from profile
    const newPoints = userPoints - reward.costPoints;
    const { error } = await supabase
      .from("profiles")
      .update({ points: newPoints })
      .eq("id", user.id);

    if (error) {
      toast({ title: "Error redeeming reward", variant: "destructive" });
      return;
    }

    setUserPoints(newPoints);
    toast({
      title: "Reward Redeemed!",
      description: `You've successfully redeemed ${reward.name} for ${reward.costPoints} points. Check your email for details.`,
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={!!user} userRole={role || "student"} onLogout={handleLogout} />
      
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Rewards Store
          </h1>
          <p className="text-muted-foreground">
            Redeem your hard-earned points for eco-friendly rewards
          </p>
        </div>

        {/* Points Balance */}
        <Card variant="eco" className="mb-8 animate-slide-up delay-100">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-eco-sun/20 to-eco-leaf/20">
                  <Zap className="h-8 w-8 text-eco-sun" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Balance</p>
                  <p className="text-4xl font-display font-bold text-foreground">
                    {loading ? "..." : userPoints.toLocaleString()}
                    <span className="text-lg font-normal text-muted-foreground ml-2">points</span>
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8 animate-slide-up delay-200">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="gap-2"
            >
              <cat.icon className="h-4 w-4" />
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Rewards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up delay-300">
          {filteredRewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              userPoints={userPoints}
              onRedeem={handleRedeem}
            />
          ))}
        </div>

        {/* How It Works */}
        <Card variant="flat" className="mt-12 animate-slide-up delay-400">
          <CardContent className="p-8">
            <h2 className="text-xl font-display font-bold text-foreground mb-6 text-center">
              How Rewards Work
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Earn Points</h3>
                <p className="text-sm text-muted-foreground">
                  Complete quizzes and environmental tasks to earn points
                </p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Choose Reward</h3>
                <p className="text-sm text-muted-foreground">
                  Browse and select from our eco-friendly rewards
                </p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Redeem & Enjoy</h3>
                <p className="text-sm text-muted-foreground">
                  Redeem your points and receive your reward
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}