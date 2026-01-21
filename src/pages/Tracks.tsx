import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Brain, Leaf, ArrowRight, BookOpen, Rocket, Trophy, CheckCircle2 } from "lucide-react";

const tracks = [
  {
    id: "ai-innovation",
    title: "AI Innovation",
    icon: Brain,
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-600",
    description: "Learn AI concepts, data handling, and predictive logic through hands-on projects",
    projects: ["Chatbots", "Sentiment Analysis", "Predictive Dashboards"],
    skills: ["Data Handling", "Predictive Logic", "AI Concepts"],
    lessonsCount: 6,
    projectsCount: 6,
  },
  {
    id: "environmental-innovation",
    title: "Environmental Innovation",
    icon: Leaf,
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600",
    description: "Solve environmental problems with coding logic, data visualization, and analysis",
    projects: ["Waste Sorting Game", "CO₂ Tracker", "Recycling Dashboard"],
    skills: ["Data Visualization", "Problem Solving", "Environmental Analysis"],
    lessonsCount: 6,
    projectsCount: 6,
  },
];

const skillLevels = [
  { level: "Beginner", description: "Start with fundamentals and visual learning", icon: BookOpen },
  { level: "Low Intermediate", description: "Build on basics with guided projects", icon: Rocket },
  { level: "Intermediate", description: "Create full-featured mini-apps", icon: Trophy },
];

export default function Tracks() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-violet-500/5 to-emerald-500/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Choose Your <span className="eco-gradient-text">Learning Track</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Two specialized paths designed for students with zero coding experience. 
              Learn through interactive lessons and build real projects.
            </p>
          </div>
        </div>
      </section>

      {/* Skill Levels */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-display font-bold text-center mb-8">Skill Progression</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {skillLevels.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border">
                <div className="p-2 rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.level}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track Cards */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {tracks.map((track) => (
              <Card key={track.id} variant="eco" className="overflow-hidden group hover:shadow-eco transition-all duration-300">
                <div className={`h-2 bg-gradient-to-r ${track.color}`} />
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl ${track.bgColor}`}>
                      <track.icon className={`h-8 w-8 ${track.textColor}`} />
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{track.lessonsCount} Lessons</p>
                      <p>{track.projectsCount} Projects</p>
                    </div>
                  </div>
                  <CardTitle className="text-2xl mt-4">{track.title}</CardTitle>
                  <p className="text-muted-foreground">{track.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Projects You'll Build</h4>
                    <div className="flex flex-wrap gap-2">
                      {track.projects.map((project) => (
                        <span key={project} className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">
                          {project}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Skills You'll Learn</h4>
                    <div className="space-y-1">
                      {track.skills.map((skill) => (
                        <div key={skill} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link to={`/track/${track.id}`}>
                    <Button className={`w-full bg-gradient-to-r ${track.color} text-white hover:opacity-90`}>
                      Start This Track
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Flow */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-display font-bold text-center mb-8">Your Daily Learning Flow</h2>
          <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              { time: "10-15 min", title: "Concept Learning", desc: "Interactive lessons" },
              { time: "15-20 min", title: "Mini-Project", desc: "Apply what you learned" },
              { time: "5-10 min", title: "Challenge", desc: "Optional extension" },
              { time: "Auto", title: "Scoring", desc: "Get instant feedback" },
              { time: "Auto", title: "Portfolio", desc: "Track your progress" },
            ].map((step, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-background border border-border">
                <div className="text-xs text-primary font-medium mb-1">{step.time}</div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
