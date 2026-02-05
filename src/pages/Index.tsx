import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Brain, Leaf, Trophy, Users, Calendar,
  ArrowRight, Sparkles, Zap, Globe, MessageSquare
} from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";
import { useRealtimeStats } from "@/hooks/useRealtimeStats";

const features = [
  {
    icon: Brain,
    title: "AI Innovation",
    description: "Build chatbots, dashboards, and smart tools with cutting-edge AI technology.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: Globe,
    title: "Environmental Innovation",
    description: "Solve real-world eco problems with technology and sustainable solutions.",
    gradient: "from-emerald-500 to-green-400",
  },
  {
    icon: Trophy,
    title: "Eco Quiz Battles",
    description: "Fun challenges with green rewards that make learning exciting.",
    gradient: "from-amber-500 to-yellow-400",
  },
  {
    icon: MessageSquare,
    title: "Learner Interaction Space",
    description: "Share ideas, achievements, and collaborate with fellow learners.",
    gradient: "from-purple-500 to-pink-400",
  },
  {
    icon: Calendar,
    title: "Workshops & Schedule",
    description: "Track progress and explore live learning sessions with experts.",
    gradient: "from-rose-500 to-orange-400",
  },
];

// Helper to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export default function Index() {
  const { stats, isLoading } = useRealtimeStats();

  const displayStats = [
    { value: formatNumber(stats.totalLearners), label: "Active Learners", suffix: "+" },
    { value: formatNumber(stats.completedTasks), label: "Workshops Completed", suffix: "+" },
    { value: formatNumber(stats.totalPoints), label: "Points Earned", suffix: "" },
    { value: `${stats.successRate}%`, label: "Success Rate", suffix: "" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-eco-sky/5 to-eco-leaf/8" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/15 rounded-full blur-[100px] animate-pulse-soft" />
          <div className="absolute top-40 right-[15%] w-96 h-96 bg-eco-sky/15 rounded-full blur-[120px] animate-pulse-soft delay-300" />
          <div className="absolute bottom-20 left-[30%] w-80 h-80 bg-eco-leaf/15 rounded-full blur-[100px] animate-pulse-soft delay-500" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[15%] left-[5%] animate-float delay-100">
            <Leaf className="h-8 w-8 text-eco-leaf/30" />
          </div>
          <div className="absolute top-[25%] right-[8%] animate-float delay-300">
            <Zap className="h-6 w-6 text-eco-sky/30" />
          </div>
          <div className="absolute bottom-[30%] left-[12%] animate-float delay-500">
            <Brain className="h-7 w-7 text-primary/30" />
          </div>
          <div className="absolute bottom-[20%] right-[15%] animate-float delay-200">
            <Sparkles className="h-6 w-6 text-eco-sun/40" />
          </div>
        </div>
        
        <div className="container relative py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-eco-leaf/15 border border-primary/20 mb-6 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Welcome to the Future of Learning</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-[1.1]">
                Learn, Innovate & Grow with{" "}
                <span className="eco-gradient-text">EcoLearn</span>{" "}
                <span className="inline-block animate-float">🌱</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Empowering learners with AI and environmental skills through hands-on projects, 
                quizzes, and interactive learning experiences.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                <Link to="/signup">
                  <Button variant="hero" size="xl" className="shadow-eco group">
                    Start Learning Free
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/tracks">
                  <Button variant="outline" size="lg" className="border-2">
                    Explore Tracks
                  </Button>
                </Link>
              </div>
              
              {/* Stats - Real-time data */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg lg:max-w-none mx-auto lg:mx-0">
                {displayStats.map((stat, i) => (
                  <div key={i} className="text-center lg:text-left animate-fade-in" style={{ animationDelay: `${i * 100 + 200}ms` }}>
                    <p className={`text-2xl md:text-3xl font-display font-bold text-foreground transition-all duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                      {stat.value}{stat.suffix}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right - Hero Illustration */}
            <div className="relative animate-slide-up delay-200">
              <div className="relative">
                {/* Glow Effect Behind Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-eco-leaf/20 to-eco-sky/20 rounded-3xl blur-3xl scale-90" />
                
                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={heroIllustration} 
                    alt="EcoLearn - AI and Environmental Learning Platform" 
                    className="w-full h-auto object-cover"
                  />
                </div>
                
                {/* Floating Badge Right */}
                <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-card rounded-xl p-4 shadow-lg border border-border/50 animate-float delay-500">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-eco-sky to-primary flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">AI Certified</p>
                      <p className="text-xs text-muted-foreground">Expert Training</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
        
        <div className="container relative">
          <div className="text-center mb-16 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Platform Features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Everything You Need to{" "}
              <span className="eco-gradient-text">Succeed</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From AI innovation to environmental solutions, explore our comprehensive learning ecosystem
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card 
                key={i} 
                className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardContent className="p-6">
                  {/* Icon with gradient background */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  
                  <h3 className="font-display font-bold text-xl text-foreground mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* CTA after features */}
          <div className="text-center mt-12 animate-fade-in">
            <Link to="/signup">
              <Button variant="hero" size="lg" className="shadow-eco">
                Start Your Learning Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="relative p-8 md:p-16 bg-gradient-to-br from-primary via-eco-forest to-eco-leaf">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                  backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
                  backgroundSize: '60px 60px'
                }} />
              </div>
              
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                  Ready to Transform Your Future?
                </h2>
                <p className="text-white/90 mb-8 text-lg md:text-xl">
                  Join thousands of learners who are building AI solutions and solving environmental 
                  challenges. Your journey to innovation starts here.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/signup">
                    <Button size="xl" className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold">
                      Create Free Account
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
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
