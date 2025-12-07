import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Brain, Leaf, Lightbulb, Clock, Trophy, Lock, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  level: number;
  base_points: number;
  time_limit_seconds: number;
  questions: unknown;
}

export default function Quizzes() {
  const { user, signOut, role } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLevel, setUserLevel] = useState(1);

  useEffect(() => {
    fetchQuizzes();
    fetchUserProgress();
  }, []);

  const fetchQuizzes = async () => {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("is_active", true)
      .order("level", { ascending: true });

    if (error) {
      toast({ title: "Error loading quizzes", variant: "destructive" });
    } else {
      setQuizzes(data || []);
    }
    setLoading(false);
  };

  const fetchUserProgress = async () => {
    if (!user) return;
    
    // Get max level completed by user
    const { data } = await supabase
      .from("quiz_attempts")
      .select("quiz_id, quizzes(level)")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });

    if (data && data.length > 0) {
      const maxLevel = Math.max(...data.map((a: any) => a.quizzes?.level || 1));
      setUserLevel(maxLevel + 1);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const getCategoryIcon = (category: string) => {
    return category === "innovation" ? Lightbulb : Leaf;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "success";
      case "medium": return "pending";
      case "hard": return "destructive";
      default: return "secondary";
    }
  };

  const isLocked = (level: number) => level > userLevel;

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={!!user} userRole={role || "student"} onLogout={handleLogout} />
      
      <main className="container py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Innovation & Environment Quizzes
          </h1>
          <p className="text-muted-foreground">
            Test your knowledge and earn points! Faster completion = more points.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-6">
          <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary/10">
            <Lightbulb className="h-4 w-4 mr-2" />
            Innovation
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary/10">
            <Leaf className="h-4 w-4 mr-2" />
            Environment
          </Badge>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : quizzes.length === 0 ? (
          <Card variant="eco" className="text-center py-12">
            <CardContent>
              <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No quizzes available yet. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => {
              const CategoryIcon = getCategoryIcon(quiz.category);
              const locked = isLocked(quiz.level);
              
              return (
                <Card 
                  key={quiz.id} 
                  variant="eco" 
                  className={`relative overflow-hidden transition-all ${
                    locked ? "opacity-60" : "hover:shadow-lg cursor-pointer"
                  }`}
                >
                  {locked && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="text-center">
                        <Lock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Complete Level {quiz.level - 1} first</p>
                      </div>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        quiz.category === "innovation" ? "bg-eco-sun/10" : "bg-eco-leaf/10"
                      }`}>
                        <CategoryIcon className={`h-5 w-5 ${
                          quiz.category === "innovation" ? "text-eco-sun" : "text-eco-leaf"
                        }`} />
                      </div>
                      <Badge variant="outline">Level {quiz.level}</Badge>
                    </div>
                    <CardTitle className="mt-3">{quiz.title}</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {Math.floor(quiz.time_limit_seconds / 60)} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        Up to {quiz.base_points * 2} pts
                      </div>
                      <Badge variant={getDifficultyColor(quiz.difficulty) as any}>
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      disabled={locked}
                      onClick={() => navigate(`/quiz/${quiz.id}`)}
                    >
                      Start Quiz
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}