import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Plus, Edit, Trash2, BookOpen, Search, GraduationCap, Clock, Star, CalendarDays
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

interface LearningEvent {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  icon: string;
  color: string;
  start_date: string;
  is_public: boolean;
  activities: string[];
  created_at: string;
}

export function LearningManagement() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [events, setEvents] = useState<LearningEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [processing, setProcessing] = useState(false);

  const [eventFormData, setEventFormData] = useState({
    title: "",
    description: "",
    event_type: "workshop",
    icon: "calendar",
    color: "text-primary",
    start_date: "",
    activities: "",
  });

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
    fetchEvents();
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

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_events')
        .select('*')
        .eq('is_public', true)
        .order('start_date', { ascending: true });
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSaveEvent = async () => {
    if (!user || !eventFormData.title.trim() || !eventFormData.start_date) {
      toast.error('Title and date are required');
      return;
    }
    setProcessing(true);
    try {
      const payload = {
        title: eventFormData.title,
        description: eventFormData.description || null,
        event_type: eventFormData.event_type,
        icon: eventFormData.icon,
        color: eventFormData.color,
        start_date: new Date(eventFormData.start_date).toISOString(),
        is_public: true,
        created_by: user.id,
        activities: eventFormData.activities.split(',').map(a => a.trim()).filter(Boolean),
      };
      const { error } = await supabase.from('learning_events').insert(payload);
      if (error) throw error;
      toast.success('Event created');
      setEventDialogOpen(false);
      setEventFormData({ title: "", description: "", event_type: "workshop", icon: "calendar", color: "text-primary", start_date: "", activities: "" });
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    try {
      const { error } = await supabase.from('learning_events').delete().eq('id', id);
      if (error) throw error;
      toast.success('Event deleted');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
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
      <div>
        <h2 className="text-2xl font-bold mb-2">AI Learning & Content</h2>
        <p className="text-muted-foreground">Manage quizzes, events, and learning content</p>
      </div>

      <Tabs defaultValue="quizzes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" /> Quizzes
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" /> Learning Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" /> Add Quiz
            </Button>
          </div>

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
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Public events visible to all learners on their schedule</p>
            <Button onClick={() => setEventDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Event
            </Button>
          </div>

          {events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <Card key={event.id} variant="eco">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteEvent(event.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{event.event_type}</Badge>
                      <Badge variant="secondary">{new Date(event.start_date).toLocaleDateString()}</Badge>
                    </div>
                    {event.activities?.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {event.activities.map((a, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{a}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card variant="eco">
              <CardContent className="py-8 text-center">
                <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No events created yet. Add your first learning event.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Quiz Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingQuiz ? 'Edit Quiz' : 'Create Quiz'}</DialogTitle>
            <DialogDescription>Configure quiz details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title *</label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} />
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
                <Input type="number" value={formData.level} onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })} min={1} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Points</label>
                <Input type="number" value={formData.base_points} onChange={(e) => setFormData({ ...formData, base_points: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Time (sec)</label>
                <Input type="number" value={formData.time_limit_seconds} onChange={(e) => setFormData({ ...formData, time_limit_seconds: parseInt(e.target.value) || 300 })} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Active</label>
              <Switch checked={formData.is_active} onCheckedChange={(v) => setFormData({ ...formData, is_active: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveQuiz} disabled={processing}>{processing ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Dialog */}
      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Learning Event</DialogTitle>
            <DialogDescription>This event will be visible to all learners</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title *</label>
              <Input value={eventFormData.title} onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea value={eventFormData.description} onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Event Type</label>
                <Select value={eventFormData.event_type} onValueChange={(v) => setEventFormData({ ...eventFormData, event_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="bootcamp">Bootcamp</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Date *</label>
                <Input type="date" value={eventFormData.start_date} onChange={(e) => setEventFormData({ ...eventFormData, start_date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Icon</label>
                <Select value={eventFormData.icon} onValueChange={(v) => setEventFormData({ ...eventFormData, icon: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calendar">Calendar</SelectItem>
                    <SelectItem value="brain">Brain/AI</SelectItem>
                    <SelectItem value="mic">Mic/Speaking</SelectItem>
                    <SelectItem value="briefcase">Briefcase/Career</SelectItem>
                    <SelectItem value="code">Code</SelectItem>
                    <SelectItem value="users">Team/Group</SelectItem>
                    <SelectItem value="graduation">Graduation</SelectItem>
                    <SelectItem value="sparkles">Sparkles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Color</label>
                <Select value={eventFormData.color} onValueChange={(v) => setEventFormData({ ...eventFormData, color: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-primary">Primary</SelectItem>
                    <SelectItem value="text-violet-500">Violet</SelectItem>
                    <SelectItem value="text-rose-500">Rose</SelectItem>
                    <SelectItem value="text-blue-500">Blue</SelectItem>
                    <SelectItem value="text-amber-600">Amber</SelectItem>
                    <SelectItem value="text-emerald-500">Emerald</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Activities (comma-separated)</label>
              <Input
                placeholder="Workshop 1, Demo, Q&A..."
                value={eventFormData.activities}
                onChange={(e) => setEventFormData({ ...eventFormData, activities: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEventDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEvent} disabled={processing}>{processing ? 'Saving...' : 'Create Event'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
