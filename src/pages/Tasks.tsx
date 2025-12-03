import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TaskCard, Task } from "@/components/tasks/TaskCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, MapPin, Recycle, TreePine, Droplets, Users, Zap } from "lucide-react";

const categories = [
  { id: "all", name: "All Tasks", icon: Zap },
  { id: "recycling", name: "Recycling", icon: Recycle },
  { id: "conservation", name: "Conservation", icon: TreePine },
  { id: "water", name: "Water", icon: Droplets },
  { id: "community", name: "Community", icon: Users },
];

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Community Garden Volunteer",
    description: "Help maintain the local community garden by weeding, watering, and caring for plants.",
    category: "Conservation",
    difficulty: 1,
    points: 35,
    locationRequired: true,
    estimatedTime: "1-2 hours",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
  },
  {
    id: "2",
    title: "Beach Cleanup Challenge",
    description: "Join the weekend beach cleanup and help remove plastic waste from the shoreline.",
    category: "Community",
    difficulty: 2,
    points: 75,
    locationRequired: true,
    estimatedTime: "2-3 hours",
    imageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400",
  },
  {
    id: "3",
    title: "Recycling Drop-off",
    description: "Collect and properly sort recyclable materials from your home and drop them off at the local center.",
    category: "Recycling",
    difficulty: 1,
    points: 25,
    locationRequired: true,
    estimatedTime: "30 mins",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400",
  },
  {
    id: "4",
    title: "Tree Planting Initiative",
    description: "Participate in our urban tree planting program to help increase green cover in the city.",
    category: "Conservation",
    difficulty: 2,
    points: 100,
    locationRequired: true,
    estimatedTime: "3-4 hours",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
  },
  {
    id: "5",
    title: "Water Conservation Audit",
    description: "Learn to conduct a home water audit and identify ways to reduce water consumption.",
    category: "Water",
    difficulty: 1,
    points: 40,
    locationRequired: false,
    estimatedTime: "1 hour",
    imageUrl: "https://images.unsplash.com/photo-1538300342682-cf57afb97285?w=400",
  },
  {
    id: "6",
    title: "E-Waste Collection Drive",
    description: "Collect old electronics from neighbors and bring them to the designated e-waste recycling point.",
    category: "Recycling",
    difficulty: 3,
    points: 150,
    locationRequired: true,
    estimatedTime: "Half day",
    imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400",
  },
];

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);

  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                            task.category.toLowerCase() === selectedCategory;
    const matchesDifficulty = selectedDifficulty === null || task.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} userRole="student" />
      
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

        {/* Tasks Grid */}
        {filteredTasks.length > 0 ? (
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
