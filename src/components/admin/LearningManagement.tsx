import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Plus, Edit, Trash2, BookOpen, Search, GraduationCap, Clock, Star
} from "lucide-react";
import { toast } from "sonner";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  level: number;
  base_points: number;
  time_limit_seconds: number;
  is_active: boolean;
  created_at: string;
}

export function LearningManagement() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "environment" as const,
    difficulty: "easy" as const,
    level: 1,
    base_points: 10,
    time_limit_seconds: 300,
    is_active: true
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (!formData.title.trim()) {
      toast.error('Quiz title is required');
      return;
    }

    setProcessing(true);
    try {
      if (editingQuiz) {
        const { error } = await supabase
          .from('quizzes')
          .update(formData)
          .eq('id', editingQuiz.id);

        if (error) throw error;
        toast.success('Quiz updated');
      } else {
        const { error } = await supabase
          .from('quizzes')
          .insert(formData);

        if (error) throw error;
        toast.success('Quiz created');
      }

      setDialogOpen(false);
      resetForm();
      fetchQuizzes();
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error('Failed to save quiz');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!confirm('Delete this quiz?')) return;

    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Quiz deleted');
      fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error('Failed to delete quiz');
    }
  };

  const handleToggleActive = async (quiz: Quiz) => {
    try {
      const { error } = await supabase
        .from('quizzes')
        .update({ is_active: !quiz.is_active })
        .eq('id', quiz.id);

      if (error) throw error;
      toast.success(quiz.is_active ? 'Quiz deactivated' : 'Quiz activated');
      fetchQuizzes();
    } catch (error) {
      console.error('Error toggling quiz:', error);
      toast.error('Failed to update quiz');
    }
  };

  const openEditDialog = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description || "",
      category: quiz.category as any,
      difficulty: quiz.difficulty as any,
      level: quiz.level,
      base_points: quiz.base_points,
      time_limit_seconds: quiz.time_limit_seconds,
      is_active: quiz.is_active
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingQuiz(null);
    setFormData({
      title: "",
      description: "",
      category: "environment",
      difficulty: "easy",
      level: 1,
      base_points: 10,
      time_limit_seconds: 300,
      is_active: true
    });
  };

  const filteredQuizzes = quizzes.filter(q =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <Badge className="bg-primary">Easy</Badge>;
      case 'medium':
        return <Badge className="bg-eco-sun">Medium</Badge>;
      case 'hard':
        return <Badge variant="destructive">Hard</Badge>;
      default:
        return <Badge variant="outline">{difficulty}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">AI Learning & Content</h2>
          <p className="text-muted-foreground">Manage quizzes and learning content</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Quiz
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} variant="eco" className={!quiz.is_active ? 'opacity-60' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(quiz)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteQuiz(quiz.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {quiz.description || 'No description'}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{quiz.category}</Badge>
                {getDifficultyBadge(quiz.difficulty)}
                <Badge variant="secondary">Level {quiz.level}</Badge>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-eco-sun" />
                    {quiz.base_points} pts
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {Math.round(quiz.time_limit_seconds / 60)}m
                  </span>
                </div>
                <Switch
                  checked={quiz.is_active}
                  onCheckedChange={() => handleToggleActive(quiz)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingQuiz ? 'Edit Quiz' : 'Create Quiz'}</DialogTitle>
            <DialogDescription>Configure quiz details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="innovation">Innovation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select value={formData.difficulty} onValueChange={(v) => setFormData({ ...formData, difficulty: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Level</label>
                <Input
                  type="number"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                  min={1}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Points</label>
                <Input
                  type="number"
                  value={formData.base_points}
                  onChange={(e) => setFormData({ ...formData, base_points: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Time (sec)</label>
                <Input
                  type="number"
                  value={formData.time_limit_seconds}
                  onChange={(e) => setFormData({ ...formData, time_limit_seconds: parseInt(e.target.value) || 300 })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Active</label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveQuiz} disabled={processing}>
              {processing ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
