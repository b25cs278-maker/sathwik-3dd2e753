import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Clock, CheckCircle2, XCircle, Trophy, ArrowRight } from "lucide-react";

interface Question {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  level: number;
  base_points: number;
  time_limit_seconds: number;
  questions: Question[];
}

export default function QuizPlay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, signOut, role } = useAuth();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    correct: number;
    total: number;
    timeTaken: number;
    points: number;
  } | null>(null);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (!quiz || isComplete) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = quiz.time_limit_seconds - elapsed;
      
      if (remaining <= 0) {
        clearInterval(timer);
        handleComplete();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, isComplete, startTime]);

  const fetchQuiz = async () => {
    if (!id) return;
    
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      toast({ title: "Quiz not found", variant: "destructive" });
      navigate("/quizzes");
    } else {
      // Parse questions if they're stored as JSON
      const questions = Array.isArray(data.questions) ? (data.questions as unknown as Question[]) : [];
      const quizData: Quiz = {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        level: data.level,
        base_points: data.base_points,
        time_limit_seconds: data.time_limit_seconds,
        questions
      };
      setQuiz(quizData);
      setTimeLeft(data.time_limit_seconds);
    }
    setLoading(false);
  };

  const calculatePoints = useCallback((correctAnswers: number, totalQuestions: number, timeTaken: number, basePoints: number, timeLimit: number) => {
    // Base score percentage
    const scorePercent = correctAnswers / totalQuestions;
    
    // Time bonus: faster = more points (up to 2x multiplier)
    const timePercent = Math.max(0, 1 - (timeTaken / timeLimit));
    const timeMultiplier = 1 + timePercent; // 1x to 2x based on speed
    
    // Calculate final points
    const points = Math.round(basePoints * scorePercent * timeMultiplier);
    return points;
  }, []);

  const handleComplete = async () => {
    if (!quiz || !user) return;

    setIsComplete(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    // Calculate results
    const finalAnswers = [...answers, selectedAnswer ?? -1];
    const correctCount = quiz.questions.reduce((acc, q, idx) => {
      return acc + (q.correctAnswer === finalAnswers[idx] ? 1 : 0);
    }, 0);
    
    const points = calculatePoints(
      correctCount, 
      quiz.questions.length, 
      timeTaken, 
      quiz.base_points,
      quiz.time_limit_seconds
    );

    setResults({
      score: Math.round((correctCount / quiz.questions.length) * 100),
      correct: correctCount,
      total: quiz.questions.length,
      timeTaken,
      points
    });

    // Save attempt to database
    const { error } = await supabase.from("quiz_attempts").insert({
      quiz_id: quiz.id,
      user_id: user.id,
      score: Math.round((correctCount / quiz.questions.length) * 100),
      correct_answers: correctCount,
      total_questions: quiz.questions.length,
      time_taken_seconds: timeTaken,
      points_earned: points
    });

    if (error) {
      console.error("Error saving attempt:", error);
      toast({ title: "Error saving your progress", variant: "destructive" });
    } else {
      // Update user points in profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("points")
        .eq("id", user.id)
        .maybeSingle();
      
      if (profile) {
        await supabase
          .from("profiles")
          .update({ points: (profile.points || 0) + points })
          .eq("id", user.id);
      }
      
      toast({ 
        title: "Quiz Complete!",
        description: `You earned ${points} points!` 
      });
    }
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    
    if (currentQuestion < quiz!.questions.length - 1) {
      setAnswers([...answers, selectedAnswer]);
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      handleComplete();
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!quiz) return null;

  if (isComplete && results) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isAuthenticated={!!user} userRole={role || "student"} onLogout={handleLogout} />
        
        <main className="container py-8 max-w-2xl mx-auto">
          <Card variant="eco" className="text-center animate-slide-up">
            <CardHeader>
              <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-foreground">{results.score}%</p>
                  <p className="text-sm text-muted-foreground">Score</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">{results.points}</p>
                  <p className="text-sm text-muted-foreground">Points Earned</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-eco-leaf" />
                  <span>{results.correct} Correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <span>{results.total - results.correct} Wrong</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{formatTime(results.timeTaken)}</span>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center pt-4">
                <Button variant="outline" onClick={() => navigate("/quizzes")}>
                  Back to Quizzes
                </Button>
                <Button onClick={() => navigate("/dashboard")}>
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  
  if (!question) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isAuthenticated={!!user} userRole={role || "student"} onLogout={handleLogout} />
        <main className="container py-8 text-center">
          <p className="text-muted-foreground">This quiz has no questions yet.</p>
          <Button className="mt-4" onClick={() => navigate("/quizzes")}>Back to Quizzes</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={!!user} userRole={role || "student"} onLogout={handleLogout} />
      
      <main className="container py-8 max-w-2xl mx-auto">
        {/* Timer and Progress */}
        <div className="mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </Badge>
            <Badge variant={timeLeft < 60 ? "destructive" : "secondary"} className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(timeLeft)}
            </Badge>
          </div>
          <Progress value={(currentQuestion / quiz.questions.length) * 100} className="h-2" />
        </div>

        {/* Question Card */}
        <Card variant="eco" className="animate-slide-up delay-100">
          <CardHeader>
            <CardTitle className="text-xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedAnswer(idx)}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  selectedAnswer === idx
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-end mt-6 animate-slide-up delay-200">
          <Button 
            onClick={handleNext} 
            disabled={selectedAnswer === null}
            size="lg"
          >
            {currentQuestion < quiz.questions.length - 1 ? "Next Question" : "Finish Quiz"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
}