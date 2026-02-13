import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Lock, CheckCircle2, Play, BookOpen, 
  Rocket, Trophy, Clock, Star, HelpCircle
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ModuleQuiz } from "@/components/tracks/ModuleQuiz";
import { aiInnovationQuizzes, environmentalInnovationQuizzes } from "@/data/moduleQuizzes";
import { softSkillsQuizzes, englishLearningQuizzes, interviewSkillsQuizzes } from "@/data/skillTrainingQuizzes";
import { trackData } from "@/data/trackData";
import { toast } from "sonner";

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
  const [videoModules, setVideoModules] = useState<Array<{ youtube_url: string; resource_pdf_url: string | null }>>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await supabase
        .from("video_modules")
        .select("youtube_url, resource_pdf_url")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (data) {
        setVideoModules(data);
      }
    };
    fetchVideos();
  }, []);

  // Get the quiz data based on track
  const quizDataMap: Record<string, Record<string, any>> = {
    "ai-innovation": aiInnovationQuizzes,
    "environmental-innovation": environmentalInnovationQuizzes,
    "soft-skills": softSkillsQuizzes,
    "english-learning": englishLearningQuizzes,
    "interview-skills": interviewSkillsQuizzes,
  };
  const quizData = quizDataMap[trackId || ""] || {};

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

  const isLessonUnlocked = (_index: number) => {
    return true; // All lessons are accessible
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
                          {(() => {
                            const matchedVideo = videoModules[index];
                            if (unlocked && matchedVideo?.youtube_url) {
                              return (
                                <a 
                                  href={matchedVideo.youtube_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  <Button size="sm">Start</Button>
                                </a>
                              );
                            }
                            if (unlocked) {
                              return (
                                <Button size="sm" variant="outline" disabled>
                                  Coming Soon
                                </Button>
                              );
                            }
                            return null;
                          })()}
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
