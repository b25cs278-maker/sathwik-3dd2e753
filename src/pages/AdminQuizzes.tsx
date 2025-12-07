import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Plus, Brain, Users, Trophy, Clock, BarChart3, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  time_taken_seconds: number;
  points_earned: number;
  completed_at: string;
  profiles?: { name: string; email: string };
  quizzes?: { title: string };
}

interface QuizStats {
  totalAttempts: number;
  averageScore: number;
  totalPointsAwarded: number;
  averageTime: number;
}

export default function AdminQuizzes() {
  const { user, signOut, role } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [stats, setStats] = useState<QuizStats>({ totalAttempts: 0, averageScore: 0, totalPointsAwarded: 0, averageTime: 0 });
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // Create quiz form state
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    description: "",
    category: "environment" as "innovation" | "environment",
    difficulty: "easy" as "easy" | "medium" | "hard",
    level: 1,
    base_points: 50,
    time_limit_seconds: 300,
    questions: [] as any[]
  });
  const [questionInput, setQuestionInput] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch all quiz attempts
    const { data: attemptsData, error: attemptsError } = await supabase
      .from("quiz_attempts")
      .select("*")
      .order("completed_at", { ascending: false })
      .limit(50);

    if (attemptsError) {
      console.error("Error fetching attempts:", attemptsError);
      setLoading(false);
      return;
    }
    
    // Fetch profiles and quizzes for each attempt
    const attemptsList: QuizAttempt[] = [];
    for (const attempt of (attemptsData || [])) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, email")
        .eq("id", attempt.user_id)
        .maybeSingle();
      
      const { data: quiz } = await supabase
        .from("quizzes")
        .select("title")
        .eq("id", attempt.quiz_id)
        .maybeSingle();
      
      attemptsList.push({
        ...attempt,
        profiles: profile || undefined,
        quizzes: quiz || undefined
      });
    }
    
    setAttempts(attemptsList);
    
    // Calculate stats
    if (attemptsList.length > 0) {
      const totalAttempts = attemptsList.length;
      const averageScore = Math.round(attemptsList.reduce((acc, a) => acc + a.score, 0) / totalAttempts);
      const totalPointsAwarded = attemptsList.reduce((acc, a) => acc + a.points_earned, 0);
      const averageTime = Math.round(attemptsList.reduce((acc, a) => acc + a.time_taken_seconds, 0) / totalAttempts);
      
      setStats({ totalAttempts, averageScore, totalPointsAwarded, averageTime });
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const addQuestion = () => {
    if (!questionInput.question || questionInput.options.some(o => !o)) {
      toast({ title: "Please fill all question fields", variant: "destructive" });
      return;
    }
    
    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, { ...questionInput, id: crypto.randomUUID() }]
    });
    setQuestionInput({ question: "", options: ["", "", "", ""], correctAnswer: 0 });
  };

  const createQuiz = async () => {
    if (!newQuiz.title || newQuiz.questions.length === 0) {
      toast({ title: "Please add a title and at least one question", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("quizzes").insert({
      ...newQuiz,
      created_by: user?.id
    });

    if (error) {
      toast({ title: "Error creating quiz", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Quiz created successfully!" });
      setIsCreateOpen(false);
      setNewQuiz({
        title: "",
        description: "",
        category: "environment",
        difficulty: "easy",
        level: 1,
        base_points: 50,
        time_limit_seconds: 300,
        questions: []
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={!!user} userRole={role || "admin"} onLogout={handleLogout} />
      
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Quiz Management
            </h1>
            <p className="text-muted-foreground">
              Create quizzes and view all student attempts and statistics
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Quiz</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input 
                      value={newQuiz.title} 
                      onChange={e => setNewQuiz({...newQuiz, title: e.target.value})}
                      placeholder="Quiz title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newQuiz.category} onValueChange={(v: any) => setNewQuiz({...newQuiz, category: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="innovation">Innovation</SelectItem>
                        <SelectItem value="environment">Environment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    value={newQuiz.description} 
                    onChange={e => setNewQuiz({...newQuiz, description: e.target.value})}
                    placeholder="Brief description"
                  />
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select value={newQuiz.difficulty} onValueChange={(v: any) => setNewQuiz({...newQuiz, difficulty: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Level (1-5)</Label>
                    <Input 
                      type="number" 
                      min={1} 
                      max={5}
                      value={newQuiz.level} 
                      onChange={e => setNewQuiz({...newQuiz, level: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Base Points</Label>
                    <Input 
                      type="number" 
                      value={newQuiz.base_points} 
                      onChange={e => setNewQuiz({...newQuiz, base_points: parseInt(e.target.value) || 50})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time (sec)</Label>
                    <Input 
                      type="number" 
                      value={newQuiz.time_limit_seconds} 
                      onChange={e => setNewQuiz({...newQuiz, time_limit_seconds: parseInt(e.target.value) || 300})}
                    />
                  </div>
                </div>

                {/* Questions List */}
                {newQuiz.questions.length > 0 && (
                  <div className="space-y-2">
                    <Label>Questions ({newQuiz.questions.length})</Label>
                    <div className="space-y-2">
                      {newQuiz.questions.map((q, idx) => (
                        <div key={q.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="text-sm">{idx + 1}. {q.question.substring(0, 50)}...</span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setNewQuiz({
                              ...newQuiz,
                              questions: newQuiz.questions.filter((_, i) => i !== idx)
                            })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Question Form */}
                <div className="border rounded-lg p-4 space-y-3">
                  <Label className="text-base font-medium">Add Question</Label>
                  <Input 
                    value={questionInput.question}
                    onChange={e => setQuestionInput({...questionInput, question: e.target.value})}
                    placeholder="Enter question"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {questionInput.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="correct" 
                          checked={questionInput.correctAnswer === idx}
                          onChange={() => setQuestionInput({...questionInput, correctAnswer: idx})}
                        />
                        <Input 
                          value={opt}
                          onChange={e => {
                            const newOpts = [...questionInput.options];
                            newOpts[idx] = e.target.value;
                            setQuestionInput({...questionInput, options: newOpts});
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        />
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" onClick={addQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>

                <Button className="w-full" onClick={createQuiz}>
                  Create Quiz
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up delay-100">
          <Card variant="eco">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalAttempts}</p>
                  <p className="text-sm text-muted-foreground">Total Attempts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card variant="eco">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-eco-leaf/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-eco-leaf" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.averageScore}%</p>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card variant="eco">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-eco-sun/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-eco-sun" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalPointsAwarded.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Points Awarded</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card variant="eco">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-eco-sky/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-eco-sky" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{formatTime(stats.averageTime)}</p>
                  <p className="text-sm text-muted-foreground">Avg Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attempts Table */}
        <Card variant="eco" className="animate-slide-up delay-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              All Quiz Attempts
            </CardTitle>
            <CardDescription>View all student quiz attempts with scores and time</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : attempts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No quiz attempts yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Student</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Quiz</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Score</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Correct</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Time</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Points</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((attempt) => (
                      <tr key={attempt.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-foreground">{attempt.profiles?.name || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground">{attempt.profiles?.email}</p>
                          </div>
                        </td>
                        <td className="p-3 text-foreground">{attempt.quizzes?.title || "Unknown"}</td>
                        <td className="p-3">
                          <Badge variant={attempt.score >= 70 ? "success" : attempt.score >= 50 ? "pending" : "destructive"}>
                            {attempt.score}%
                          </Badge>
                        </td>
                        <td className="p-3 text-foreground">{attempt.correct_answers}/{attempt.total_questions}</td>
                        <td className="p-3 text-foreground">{formatTime(attempt.time_taken_seconds)}</td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-primary">+{attempt.points_earned}</Badge>
                        </td>
                        <td className="p-3 text-muted-foreground text-sm">
                          {new Date(attempt.completed_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}