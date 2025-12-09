import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TaskCard, Task } from "@/components/tasks/TaskCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, MapPin, Recycle, TreePine, Droplets, Users, Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  { id: "all", name: "All Tasks", icon: Zap },
  { id: "recycling", name: "Recycling", icon: Recycle },
  { id: "conservation", name: "Conservation", icon: TreePine },
  { id: "water", name: "Water", icon: Droplets },
  { id: "community", name: "Community", icon: Users },
];

const difficultyMap: Record<string, 1 | 2 | 3> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export default function Tasks() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("is_active", true);

      if (data) {
        const mappedTasks: Task[] = data.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description || "",
          category: t.category.charAt(0).toUpperCase() + t.category.slice(1),
          difficulty: difficultyMap[t.difficulty] || 1,
          points: t.points,
          locationRequired: t.location_required,
          estimatedTime: t.estimated_time || undefined,
          imageUrl: t.image_url || undefined,
        }));
        setTasks(mappedTasks);
      }
      setLoading(false);
    }

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                            task.category.toLowerCase() === selectedCategory;
    const matchesDifficulty = selectedDifficulty === null || task.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={!!user} userRole={role || "student"} onLogout={handleLogout} />
      
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Environmental Tasks
          </h1>
          <p className="text-muted-foreground">
            Complete tasks, earn points, and make a real impact
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 animate-slide-up delay-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Near Me
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="gap-2"
              >
                <cat.icon className="h-4 w-4" />
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Difficulty:</span>
            <div className="flex gap-2">
              {[
                { level: null, label: "All" },
                { level: 1, label: "Easy" },
                { level: 2, label: "Medium" },
                { level: 3, label: "Hard" },
              ].map((diff) => (
                <Badge
                  key={diff.label}
                  variant={selectedDifficulty === diff.level ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => setSelectedDifficulty(diff.level)}
                >
                  {diff.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredTasks.length} tasks
        </p>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up delay-200">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <Card variant="flat" className="animate-fade-in">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No tasks found matching your criteria.</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedDifficulty(null);
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}