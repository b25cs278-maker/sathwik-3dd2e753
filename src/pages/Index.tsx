import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Camera, MapPin, Award, Gift, Users, 
  TreePine, Droplets, Recycle, ChevronRight, 
  ArrowRight, Sparkles, Play, Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useGuest } from "@/contexts/GuestContext";

const features = [
  {
    icon: Camera,
    title: "Photo Evidence",
    description: "Capture and submit photos of your environmental actions with automatic metadata extraction.",
  },
  {
    icon: MapPin,
    title: "GPS Verification",
    description: "Location-based task verification ensures authentic completion of real-world activities.",
  },
  {
    icon: Award,
    title: "Earn Badges",
    description: "Collect achievement badges as you progress through environmental challenges.",
  },
  {
    icon: Gift,
    title: "Redeem Rewards",
    description: "Convert your earned points into real rewards and eco-friendly merchandise.",
  },
];

const categories = [
  { icon: Recycle, name: "Recycling", tasks: 24, color: "bg-eco-leaf/10 text-eco-leaf" },
  { icon: TreePine, name: "Conservation", tasks: 18, color: "bg-eco-forest/10 text-eco-forest" },
  { icon: Droplets, name: "Water", tasks: 12, color: "bg-eco-sky/10 text-eco-sky" },
  { icon: Users, name: "Community", tasks: 15, color: "bg-eco-sun/10 text-eco-earth" },
];

const stats = [
  { value: "50K+", label: "Tasks Completed" },
  { value: "12K", label: "Active Learners" },
  { value: "2.5M", label: "Points Earned" },
  { value: "98%", label: "Verification Rate" },
];

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { enableGuestMode } = useGuest();
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: "demo@ecolearn.com",
        password: "demo123456",
      });

      if (error) {
        toast({
          title: "Demo login failed",
          description: "Please try signing up or contact support.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome to EcoLearn!",
          description: "Exploring as demo user",
        });
        navigate("/student-dashboard");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDemoLoading(false);
    }
  };

  const handleGuestBrowse = () => {
    enableGuestMode();
    toast({
      title: "Welcome, Guest!",
      description: "You can browse tracks and tasks. Sign up to track progress!",
    });
    navigate("/tracks");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-eco-leaf/5 to-accent/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-eco-leaf/10 rounded-full blur-3xl animate-pulse-soft delay-500" />
        
        <div className="container relative py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Learn. Act. Earn Rewards.</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              Make Real{" "}
              <span className="eco-gradient-text">Environmental</span>
              {" "}Impact
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Complete verified environmental tasks, earn points, and redeem rewards. 
              Join thousands making a difference through action-based learning.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                variant="hero" 
                size="xl" 
                onClick={handleDemoLogin}
                disabled={demoLoading}
              >
                {demoLoading ? "Entering..." : "Try Demo"}
                <Play className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleGuestBrowse}
              >
                <Eye className="h-4 w-4 mr-2" />
                Browse as Guest
              </Button>
              <Link to="/signup">
                <Button variant="ghost" size="lg">
                  Create Account
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-slide-up delay-200">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How EcoLearn Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines real-world environmental action with verified learning outcomes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card key={i} variant="eco" className="group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Simple Steps to Impact
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Choose a Task", desc: "Browse environmental tasks in your area or interest" },
                { step: "2", title: "Complete & Submit", desc: "Take photos, capture GPS, and submit evidence" },
                { step: "3", title: "Earn & Redeem", desc: "Get verified, earn points, and redeem rewards" },
              ].map((item, i) => (
                <div key={i} className="relative text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-eco-leaf flex items-center justify-center mx-auto mb-4 shadow-eco">
                    <span className="text-2xl font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                  {i < 2 && (
                    <ChevronRight className="hidden md:block absolute top-8 -right-4 h-6 w-6 text-muted-foreground/50" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                Task Categories
              </h2>
              <p className="text-muted-foreground">Explore different ways to make an impact</p>
            </div>
            <Link to="/tasks">
              <Button variant="ghost">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Card key={i} variant="interactive" className="group">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${cat.color} transition-transform group-hover:scale-110`}>
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.tasks} tasks</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card variant="eco" className="overflow-hidden">
            <div className="relative p-8 md:p-12 bg-gradient-to-br from-primary/10 via-eco-leaf/5 to-accent/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-eco-leaf/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  Ready to Make a Difference?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Join our community of environmental champions. Every task completed brings us 
                  closer to a sustainable future.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/signup">
                    <Button variant="hero" size="lg">
                      Create Free Account
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
