import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Brain, Leaf, Lock, CheckCircle2, Play, BookOpen, 
  Rocket, Trophy, ArrowRight, Clock, Star, HelpCircle
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ModuleQuiz } from "@/components/tracks/ModuleQuiz";
import { aiInnovationQuizzes, environmentalInnovationQuizzes } from "@/data/moduleQuizzes";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "beginner" | "low-intermediate" | "intermediate";
  projectId: string;
  completed: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  lessonRequired: string;
  unlocked: boolean;
  completed: boolean;
  score?: number;
}

const trackData = {
  "ai-innovation": {
    title: "AI Innovation",
    icon: Brain,
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-600",
    lessons: [
      { id: "ai-1", title: "What is AI?", description: "Introduction to artificial intelligence concepts", duration: "10 min", level: "beginner" as const, projectId: "proj-ai-1", completed: false },
      { id: "ai-2", title: "Understanding Data", description: "Learn how AI uses data to make decisions", duration: "12 min", level: "beginner" as const, projectId: "proj-ai-2", completed: false },
      { id: "ai-3", title: "Pattern Recognition", description: "How AI finds patterns in information", duration: "15 min", level: "beginner" as const, projectId: "proj-ai-3", completed: false },
      { id: "ai-4", title: "Building a Chatbot", description: "Create your first conversational AI", duration: "15 min", level: "low-intermediate" as const, projectId: "proj-ai-4", completed: false },
      { id: "ai-5", title: "Sentiment Analysis", description: "Teach AI to understand emotions", duration: "18 min", level: "low-intermediate" as const, projectId: "proj-ai-5", completed: false },
      { id: "ai-6", title: "Predictive Models", description: "Build AI that predicts outcomes", duration: "20 min", level: "intermediate" as const, projectId: "proj-ai-6", completed: false },
    ],
    projects: [
      { id: "proj-ai-1", title: "AI Concept Quiz", description: "Test your understanding of AI basics", lessonRequired: "ai-1", unlocked: false, completed: false },
      { id: "proj-ai-2", title: "Data Explorer", description: "Visualize and understand datasets", lessonRequired: "ai-2", unlocked: false, completed: false },
      { id: "proj-ai-3", title: "Pattern Finder Game", description: "Interactive pattern matching game", lessonRequired: "ai-3", unlocked: false, completed: false },
      { id: "proj-ai-4", title: "Simple Chatbot", description: "Build a basic question-answer bot", lessonRequired: "ai-4", unlocked: false, completed: false },
      { id: "proj-ai-5", title: "Mood Detector", description: "Analyze text sentiment", lessonRequired: "ai-5", unlocked: false, completed: false },
      { id: "proj-ai-6", title: "Prediction Dashboard", description: "Create a predictive analytics app", lessonRequired: "ai-6", unlocked: false, completed: false },
    ],
  },
  "environmental-innovation": {
    title: "Environmental Innovation",
    icon: Leaf,
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600",
    lessons: [
      { id: "env-1", title: "Environmental Data", description: "Understanding environmental metrics", duration: "10 min", level: "beginner" as const, projectId: "proj-env-1", completed: false },
      { id: "env-2", title: "Waste & Recycling", description: "Learn about waste categories and recycling", duration: "12 min", level: "beginner" as const, projectId: "proj-env-2", completed: false },
      { id: "env-3", title: "Carbon Footprint", description: "Understanding CO₂ emissions and impact", duration: "15 min", level: "beginner" as const, projectId: "proj-env-3", completed: false },
      { id: "env-4", title: "Data Visualization", description: "Create charts and graphs for environmental data", duration: "15 min", level: "low-intermediate" as const, projectId: "proj-env-4", completed: false },
      { id: "env-5", title: "Interactive Games", description: "Build engaging educational games", duration: "18 min", level: "low-intermediate" as const, projectId: "proj-env-5", completed: false },
      { id: "env-6", title: "Dashboard Design", description: "Create full-featured analytics dashboards", duration: "20 min", level: "intermediate" as const, projectId: "proj-env-6", completed: false },
    ],
    projects: [
      { id: "proj-env-1", title: "Environment Quiz", description: "Test your environmental knowledge", lessonRequired: "env-1", unlocked: false, completed: false },
      { id: "proj-env-2", title: "Waste Sorting Game", description: "Interactive recycling game", lessonRequired: "env-2", unlocked: false, completed: false },
      { id: "proj-env-3", title: "CO₂ Calculator", description: "Calculate your carbon footprint", lessonRequired: "env-3", unlocked: false, completed: false },
      { id: "proj-env-4", title: "Eco Data Charts", description: "Visualize environmental statistics", lessonRequired: "env-4", unlocked: false, completed: false },
      { id: "proj-env-5", title: "Recycling Challenge", description: "Build an educational game", lessonRequired: "env-5", unlocked: false, completed: false },
      { id: "proj-env-6", title: "Sustainability Dashboard", description: "Full environmental analytics app", lessonRequired: "env-6", unlocked: false, completed: false },
    ],
  },
};

const levelConfig = {
  beginner: { label: "Beginner", icon: BookOpen, color: "text-blue-500" },
  "low-intermediate": { label: "Low Intermediate", icon: Rocket, color: "text-orange-500" },
  intermediate: { label: "Intermediate", icon: Trophy, color: "text-purple-500" },
};

export default function TrackDetail() {
  const { trackId } = useParams<{ trackId: string }>();
  const track = trackData[trackId as keyof typeof trackData];

  const [completedLessons, setCompletedLessons] = useLocalStorage<string[]>(`${trackId}-lessons`, []);
  const [projectScores, setProjectScores] = useLocalStorage<Record<string, number>>(`${trackId}-projects`, {});
  const [quizScores, setQuizScores] = useLocalStorage<Record<string, number>>(`${trackId}-quizzes`, {});
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);

  // Get the quiz data based on track
  const quizData = trackId === "ai-innovation" ? aiInnovationQuizzes : environmentalInnovationQuizzes;

  if (!track) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Track not found</h1>
          <Link to="/tracks">
            <Button>Back to Tracks</Button>
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = completedLessons.length;
  const totalLessons = track.lessons.length;
  const progress = (completedCount / totalLessons) * 100;

  const isLessonUnlocked = (index: number) => {
    if (index === 0) return true;
    // Need to complete previous lesson AND its quiz
    const prevLessonId = track.lessons[index - 1].id;
    return completedLessons.includes(prevLessonId) && quizScores[prevLessonId] !== undefined && quizScores[prevLessonId] >= 70;
  };

  const isProjectUnlocked = (lessonRequired: string) => {
    // Project unlocks after completing lesson AND passing quiz
    return completedLessons.includes(lessonRequired) && quizScores[lessonRequired] !== undefined && quizScores[lessonRequired] >= 70;
  };

  const isQuizUnlocked = (lessonId: string) => {
    return completedLessons.includes(lessonId);
  };

  const isQuizCompleted = (lessonId: string) => {
    return quizScores[lessonId] !== undefined && quizScores[lessonId] >= 70;
  };

  const handleQuizComplete = (lessonId: string, score: number, passed: boolean) => {
    setQuizScores({ ...quizScores, [lessonId]: score });
    if (passed) {
      toast.success(`Quiz passed with ${score}%! Next module unlocked.`);
    } else {
      toast.error(`Score: ${score}%. You need 70% to pass. Try again!`);
    }
    setActiveQuiz(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Track Header */}
      <section className={`relative py-12 bg-gradient-to-r ${track.color}`}>
        <div className="container">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/tracks" className="text-white/80 hover:text-white text-sm">
              ← Back to Tracks
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur">
              <track.icon className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">{track.title}</h1>
              <p className="text-white/80">Track your learning journey</p>
            </div>
          </div>
          <div className="mt-6 max-w-md">
            <div className="flex justify-between text-sm text-white/80 mb-2">
              <span>{completedCount} of {totalLessons} lessons completed</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-white/20" />
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Lessons Column */}
          <div>
            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Learning Modules
            </h2>
            <div className="space-y-4">
              {track.lessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const unlocked = isLessonUnlocked(index);
                const config = levelConfig[lesson.level];
                const quizPassed = isQuizCompleted(lesson.id);
                const quizUnlocked = isQuizUnlocked(lesson.id);

                return (
                  <div key={lesson.id} className="space-y-2">
                    {/* Lesson Card */}
                    <Card 
                      className={`transition-all ${!unlocked ? 'opacity-60' : ''} ${isCompleted ? 'border-primary/50 bg-primary/5' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${isCompleted ? 'bg-primary/20' : 'bg-muted'}`}>
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            ) : unlocked ? (
                              <Play className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <Lock className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {lesson.duration}
                              </span>
                            </div>
                            <h3 className="font-semibold text-foreground">{lesson.title}</h3>
                            <p className="text-sm text-muted-foreground">{lesson.description}</p>
                          </div>
                          {unlocked && !isCompleted && (
                            <Link to={`/lesson/${trackId}/${lesson.id}`}>
                              <Button size="sm">Start</Button>
                            </Link>
                          )}
                          {isCompleted && (
                            <Link to={`/lesson/${trackId}/${lesson.id}`}>
                              <Button size="sm" variant="outline">Review</Button>
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quiz Card - appears after lesson is completed */}
                    {quizUnlocked && (
                      <Card 
                        className={`ml-8 transition-all border-l-4 ${quizPassed ? 'border-l-green-500 bg-green-50/50' : 'border-l-amber-500 bg-amber-50/50'}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${quizPassed ? 'bg-green-100' : 'bg-amber-100'}`}>
                              {quizPassed ? (
                                <Trophy className="h-4 w-4 text-green-600" />
                              ) : (
                                <HelpCircle className="h-4 w-4 text-amber-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">
                                {lesson.title} Quiz
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {quizPassed 
                                  ? `Passed with ${quizScores[lesson.id]}%` 
                                  : 'Complete to unlock next module'
                                }
                              </p>
                            </div>
                            {!quizPassed && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-amber-300 hover:bg-amber-100"
                                onClick={() => setActiveQuiz(lesson.id)}
                              >
                                Take Quiz
                              </Button>
                            )}
                            {quizPassed && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => setActiveQuiz(lesson.id)}
                              >
                                Retake
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Active Quiz Modal/Inline */}
                    {activeQuiz === lesson.id && quizData[lesson.id] && (
                      <div className="ml-8">
                        <ModuleQuiz
                          lessonId={lesson.id}
                          lessonTitle={lesson.title}
                          questions={quizData[lesson.id]}
                          onComplete={(score, passed) => handleQuizComplete(lesson.id, score, passed)}
                          trackColor={track.color}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Projects Column */}
          <div>
            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Mini-Projects
            </h2>
            <div className="space-y-4">
              {track.projects.map((project) => {
                const unlocked = isProjectUnlocked(project.lessonRequired);
                const score = projectScores[project.id];
                const isCompleted = score !== undefined;

                return (
                  <Card 
                    key={project.id}
                    className={`transition-all ${!unlocked ? 'opacity-60' : ''} ${isCompleted ? 'border-primary/50 bg-primary/5' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${isCompleted ? 'bg-primary/20' : unlocked ? track.bgColor : 'bg-muted'}`}>
                          {isCompleted ? (
                            <Star className="h-5 w-5 text-primary" />
                          ) : unlocked ? (
                            <Rocket className={`h-5 w-5 ${track.textColor}`} />
                          ) : (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{project.title}</h3>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                          {isCompleted && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs font-medium text-primary">Score: {score}/100</span>
                            </div>
                          )}
                        </div>
                        {unlocked && !isCompleted && (
                          <Link to={`/project/${trackId}/${project.id}`}>
                            <Button size="sm" className={`bg-gradient-to-r ${track.color} text-white`}>
                              Build
                            </Button>
                          </Link>
                        )}
                        {isCompleted && (
                          <Link to={`/project/${trackId}/${project.id}`}>
                            <Button size="sm" variant="outline">Improve</Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
