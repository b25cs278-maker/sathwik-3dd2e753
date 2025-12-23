import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Brain, Leaf, Trophy, Star, Award, BookOpen, 
  Rocket, Target, TrendingUp, Clock, CheckCircle2
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const trackInfo = {
  "ai-innovation": {
    title: "AI Innovation",
    icon: Brain,
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-600",
    totalLessons: 6,
    totalProjects: 6,
  },
  "environmental-innovation": {
    title: "Environmental Innovation",
    icon: Leaf,
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600",
    totalLessons: 6,
    totalProjects: 6,
  },
};

const badges = [
  { id: "first-lesson", title: "First Steps", description: "Complete your first lesson", icon: BookOpen, requirement: 1, type: "lessons" },
  { id: "quick-learner", title: "Quick Learner", description: "Complete 3 lessons", icon: Rocket, requirement: 3, type: "lessons" },
  { id: "knowledge-seeker", title: "Knowledge Seeker", description: "Complete 6 lessons", icon: Trophy, requirement: 6, type: "lessons" },
  { id: "first-project", title: "Builder", description: "Complete your first project", icon: Target, requirement: 1, type: "projects" },
  { id: "project-master", title: "Project Master", description: "Complete 3 projects", icon: Star, requirement: 3, type: "projects" },
  { id: "high-achiever", title: "High Achiever", description: "Score 90+ on a project", icon: Award, requirement: 90, type: "score" },
];

export default function Portfolio() {
  const [aiLessons] = useLocalStorage<string[]>("ai-innovation-lessons", []);
  const [aiProjects] = useLocalStorage<Record<string, number>>("ai-innovation-projects", {});
  const [envLessons] = useLocalStorage<string[]>("environmental-innovation-lessons", []);
  const [envProjects] = useLocalStorage<Record<string, number>>("environmental-innovation-projects", {});

  const stats = {
    ai: {
      lessonsCompleted: aiLessons.length,
      projectsCompleted: Object.keys(aiProjects).length,
      averageScore: Object.values(aiProjects).length > 0 
        ? Math.round(Object.values(aiProjects).reduce((a, b) => a + b, 0) / Object.values(aiProjects).length)
        : 0,
      highestScore: Math.max(...Object.values(aiProjects), 0),
    },
    env: {
      lessonsCompleted: envLessons.length,
      projectsCompleted: Object.keys(envProjects).length,
      averageScore: Object.values(envProjects).length > 0
        ? Math.round(Object.values(envProjects).reduce((a, b) => a + b, 0) / Object.values(envProjects).length)
        : 0,
      highestScore: Math.max(...Object.values(envProjects), 0),
    },
  };

  const totalLessons = stats.ai.lessonsCompleted + stats.env.lessonsCompleted;
  const totalProjects = stats.ai.projectsCompleted + stats.env.projectsCompleted;
  const allScores = [...Object.values(aiProjects), ...Object.values(envProjects)];
  const highestScore = Math.max(...allScores, 0);

  const earnedBadges = badges.filter(badge => {
    if (badge.type === "lessons") return totalLessons >= badge.requirement;
    if (badge.type === "projects") return totalProjects >= badge.requirement;
    if (badge.type === "score") return highestScore >= badge.requirement;
    return false;
  });

  const getSkillLevel = (lessons: number) => {
    if (lessons >= 5) return "Intermediate";
    if (lessons >= 3) return "Low Intermediate";
    return "Beginner";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-primary/5 via-violet-500/5 to-emerald-500/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              My <span className="eco-gradient-text">Portfolio</span>
            </h1>
            <p className="text-muted-foreground">
              Track your learning journey, view completed projects, and celebrate your achievements
            </p>
          </div>
        </div>
      </section>

      <div className="container py-8">
        {/* Overview Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalLessons}</p>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <Rocket className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalProjects}</p>
                <p className="text-sm text-muted-foreground">Projects Built</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10">
                <Star className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{highestScore || "-"}</p>
                <p className="text-sm text-muted-foreground">Highest Score</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Award className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{earnedBadges.length}</p>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Track Progress */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {Object.entries(trackInfo).map(([trackId, track]) => {
            const trackStats = trackId === "ai-innovation" ? stats.ai : stats.env;
            const lessonsProgress = (trackStats.lessonsCompleted / track.totalLessons) * 100;
            const projectsProgress = (trackStats.projectsCompleted / track.totalProjects) * 100;
            
            return (
              <Card key={trackId} className="overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${track.color}`} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${track.bgColor}`}>
                        <track.icon className={`h-5 w-5 ${track.textColor}`} />
                      </div>
                      {track.title}
                    </CardTitle>
                    <span className={`text-sm font-medium ${track.textColor}`}>
                      {getSkillLevel(trackStats.lessonsCompleted)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Lessons</span>
                      <span className="font-medium">{trackStats.lessonsCompleted}/{track.totalLessons}</span>
                    </div>
                    <Progress value={lessonsProgress} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Projects</span>
                      <span className="font-medium">{trackStats.projectsCompleted}/{track.totalProjects}</span>
                    </div>
                    <Progress value={projectsProgress} className="h-2" />
                  </div>
                  {trackStats.averageScore > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <span className="text-sm text-muted-foreground">Average Score</span>
                      <span className="font-bold text-foreground">{trackStats.averageScore}/100</span>
                    </div>
                  )}
                  <Link to={`/track/${trackId}`}>
                    <Button variant="outline" className="w-full">
                      Continue Learning
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Badges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => {
                const isEarned = earnedBadges.some(b => b.id === badge.id);
                
                return (
                  <div 
                    key={badge.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isEarned 
                        ? 'border-primary/50 bg-primary/5' 
                        : 'border-border opacity-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isEarned ? 'bg-primary/20' : 'bg-muted'}`}>
                        <badge.icon className={`h-5 w-5 ${isEarned ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className={`font-semibold ${isEarned ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {badge.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                        {isEarned && (
                          <div className="flex items-center gap-1 mt-1 text-primary">
                            <CheckCircle2 className="h-3 w-3" />
                            <span className="text-xs font-medium">Earned!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Completed Projects List */}
        {(Object.keys(aiProjects).length > 0 || Object.keys(envProjects).length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                Completed Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(aiProjects).map(([projectId, score]) => (
                  <div key={projectId} className="flex items-center justify-between p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-violet-500" />
                      <div>
                        <p className="font-medium text-foreground">{projectId.replace('proj-ai-', 'AI Project ')}</p>
                        <p className="text-xs text-muted-foreground">AI Innovation Track</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="font-bold">{score}/100</span>
                    </div>
                  </div>
                ))}
                {Object.entries(envProjects).map(([projectId, score]) => (
                  <div key={projectId} className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    <div className="flex items-center gap-3">
                      <Leaf className="h-5 w-5 text-emerald-500" />
                      <div>
                        <p className="font-medium text-foreground">{projectId.replace('proj-env-', 'Environment Project ')}</p>
                        <p className="text-xs text-muted-foreground">Environmental Innovation Track</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="font-bold">{score}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {totalProjects === 0 && totalLessons === 0 && (
          <Card className="text-center p-8">
            <CardContent>
              <div className="max-w-md mx-auto">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Start Your Journey</h3>
                <p className="text-muted-foreground mb-4">
                  Complete lessons and build projects to fill your portfolio with achievements!
                </p>
                <Link to="/tracks">
                  <Button>Choose a Track</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
