import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Swords, Trophy, Star, Clock, CheckCircle2, XCircle, 
  Zap, Users, Target, Leaf
} from "lucide-react";
import { toast } from "sonner";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  base_points: number;
  time_limit_seconds: number;
  questions: any[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizAttempt {
  id: string;
  quiz_id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  points_earned: number;
  completed_at: string;
}

export function EcoQuizBattles() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
    if (user) {
      fetchRecentAttempts();
    }
  }, [user]);

  useEffect(() => {
    if (activeQuiz && timeLeft > 0 && !quizComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && activeQuiz && !quizComplete) {
      handleQuizComplete();
    }
  }, [timeLeft, activeQuiz, quizComplete]);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Parse questions from JSON
      const parsedQuizzes = (data || []).map(quiz => ({
        ...quiz,
        questions: Array.isArray(quiz.questions) ? (quiz.questions as unknown as QuizQuestion[]) : []
      }));
      setQuizzes(parsedQuizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentAttempts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentAttempts(data || []);
    } catch (error) {
      console.error('Error fetching attempts:', error);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    if (!quiz.questions || quiz.questions.length === 0) {
      toast.error('This quiz has no questions yet');
      return;
    }
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectCount(0);
    setTimeLeft(quiz.time_limit_seconds);
    setQuizComplete(false);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answerIndex: number) => {
    if (showResult || !activeQuiz) return;
    
    setSelectedAnswer(answerIndex);
    const question = activeQuiz.questions[currentQuestion];
    const correct = answerIndex === question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(prev => prev + Math.floor(activeQuiz.base_points / activeQuiz.questions.length));
      setCorrectCount(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (!activeQuiz) return;
    
    if (currentQuestion < activeQuiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    if (!activeQuiz || !user || quizComplete) return;
    
    setQuizComplete(true);
    
    try {
      // Save quiz attempt
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          quiz_id: activeQuiz.id,
          score: Math.round((correctCount / activeQuiz.questions.length) * 100),
          correct_answers: correctCount,
          total_questions: activeQuiz.questions.length,
          points_earned: score,
          time_taken_seconds: activeQuiz.time_limit_seconds - timeLeft
        });

      if (attemptError) throw attemptError;

      // Update points in profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profile) {
        await supabase
          .from('profiles')
          .update({ points: (profile.points || 0) + score })
          .eq('id', user.id);
      }

      toast.success(`Quiz complete! You earned ${score} green points!`);
      fetchRecentAttempts();
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
      // Still show completion even if save fails
      toast.success(`Quiz complete! Score: ${correctCount}/${activeQuiz.questions.length}`);
    }
  };

  const resetQuiz = () => {
    setActiveQuiz(null);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectCount(0);
    setQuizComplete(false);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-primary/10 text-primary border-primary/30';
      case 'medium': return 'bg-eco-sun/10 text-eco-sun border-eco-sun/30';
      case 'hard': return 'bg-destructive/10 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Card variant="eco">
        <CardContent className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  // Active quiz view
  if (activeQuiz && !quizComplete) {
    const question = activeQuiz.questions[currentQuestion];
    
    return (
      <Card variant="eco" className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-primary" />
              {activeQuiz.title}
            </CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {score} pts
              </Badge>
              <Badge 
                variant="outline" 
                className={`flex items-center gap-1 ${timeLeft < 30 ? 'border-destructive text-destructive' : ''}`}
              >
                <Clock className="h-3 w-3" />
                {formatTime(timeLeft)}
              </Badge>
            </div>
          </div>
          <Progress 
            value={((currentQuestion + 1) / activeQuiz.questions.length) * 100} 
            className="mt-4"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Question {currentQuestion + 1} of {activeQuiz.questions.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-lg font-medium">{question.question}</p>
          </div>
          
          <div className="space-y-3">
            {question.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  showResult
                    ? index === question.correctAnswer
                      ? 'bg-primary/10 border-primary text-primary'
                      : index === selectedAnswer
                        ? 'bg-destructive/10 border-destructive text-destructive'
                        : 'bg-muted/30 border-border'
                    : selectedAnswer === index
                      ? 'bg-primary/10 border-primary'
                      : 'bg-background border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                  {showResult && index === question.correctAnswer && (
                    <CheckCircle2 className="h-5 w-5 ml-auto text-primary" />
                  )}
                  {showResult && index === selectedAnswer && index !== question.correctAnswer && (
                    <XCircle className="h-5 w-5 ml-auto text-destructive" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="flex items-center justify-between pt-4">
              <p className={`font-medium ${isCorrect ? 'text-primary' : 'text-destructive'}`}>
                {isCorrect ? '✓ Correct!' : '✗ Wrong answer'}
              </p>
              <Button onClick={nextQuestion}>
                {currentQuestion < activeQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Quiz complete view
  if (quizComplete && activeQuiz) {
    const percentage = Math.round((correctCount / activeQuiz.questions.length) * 100);
    
    return (
      <Card variant="eco" className="max-w-md mx-auto text-center">
        <CardContent className="p-8 space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold">Quiz Complete!</h2>
            <p className="text-muted-foreground mt-1">Great job battling for the planet!</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-3xl font-bold text-primary">{percentage}%</p>
              <p className="text-sm text-muted-foreground">Score</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-3xl font-bold text-eco-sun">{score}</p>
              <p className="text-sm text-muted-foreground">Green Points</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            {correctCount} of {activeQuiz.questions.length} correct
          </div>
          <Button onClick={resetQuiz} className="w-full" variant="hero">
            <Zap className="h-4 w-4 mr-2" />
            Play Another Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Quiz selection view
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated" className="bg-gradient-to-r from-primary/10 via-eco-sky/10 to-eco-sun/10 border-none">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-primary/20">
              <Swords className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Eco Quiz Battles</h2>
              <p className="text-muted-foreground">Challenge yourself and win green points! 🌱</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Available Quizzes */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Available Battles
          </h3>
          
          {quizzes.length === 0 ? (
            <Card variant="eco">
              <CardContent className="p-8 text-center">
                <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No quiz battles available yet. Check back soon!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} variant="eco" className="hover:border-primary/50 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {quiz.base_points} pts
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">{quiz.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {quiz.description || 'Test your eco knowledge!'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTime(quiz.time_limit_seconds)}
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => startQuiz(quiz)}
                        className="flex items-center gap-1"
                      >
                        <Zap className="h-3 w-3" />
                        Battle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-eco-sun" />
            Your Stats
          </h3>
          
          <Card variant="eco">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Battles Won</span>
                <span className="font-bold">{recentAttempts.filter(a => a.score >= 70).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Points</span>
                <span className="font-bold text-eco-sun">
                  {recentAttempts.reduce((sum, a) => sum + a.points_earned, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Best Score</span>
                <span className="font-bold text-primary">
                  {recentAttempts.length > 0 ? Math.max(...recentAttempts.map(a => a.score)) : 0}%
                </span>
              </div>
            </CardContent>
          </Card>

          {recentAttempts.length > 0 && (
            <Card variant="eco">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Battles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentAttempts.slice(0, 3).map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {attempt.correct_answers}/{attempt.total_questions} correct
                    </span>
                    <Badge variant={attempt.score >= 70 ? 'default' : 'secondary'}>
                      {attempt.score}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
