import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, MapPin, Clock, Star, Filter, 
  Recycle, TreePine, Droplets, Users, Leaf
} from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  location_required: boolean;
  estimated_time: string;
  image_url: string | null;
}

const categoryIcons: Record<string, any> = {
  recycling: Recycle,
  conservation: TreePine,
  water: Droplets,
  community: Users,
  energy: Leaf,
};

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [programStatus, setProgramStatus] = useState<string>("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category] || Leaf;
    return <Icon className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Environmental Tasks
          </h1>
          <p className="text-muted-foreground">
            Complete tasks, submit evidence, and earn points for your environmental actions
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={programStatus} onValueChange={setProgramStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Program Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              <SelectItem value="present">Present Programs</SelectItem>
              <SelectItem value="upcoming">Upcoming Programs</SelectItem>
              <SelectItem value="completed">Completed Programs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <Link key={task.id} to={`/task/${task.id}`}>
                <Card variant="interactive" className="h-full overflow-hidden group">
                  {task.image_url && (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={task.image_url}
                        alt={task.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {getCategoryIcon(task.category)}
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {task.category}
                        </Badge>
                      </div>
                      <Badge className={difficultyColors[task.difficulty] || ""}>
                        {task.difficulty}
                      </Badge>
                    </div>

                    <h3 className="font-display font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {task.location_required && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>GPS</span>
                          </div>
                        )}
                        {task.estimated_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{task.estimated_time}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-eco-sun font-semibold">
                        <Star className="h-4 w-4" />
                        <span>{task.points}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or check back later for new tasks
            </p>
            <Button onClick={() => { setSearchQuery(""); setProgramStatus("all"); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}