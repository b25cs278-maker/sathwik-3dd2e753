import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Zap, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 1 | 2 | 3;
  points: number;
  locationRequired: boolean;
  estimatedTime?: string;
  imageUrl?: string;
}

interface TaskCardProps {
  task: Task;
}

const difficultyMap = {
  1: { label: "Easy", variant: "easy" as const },
  2: { label: "Medium", variant: "medium" as const },
  3: { label: "Hard", variant: "hard" as const },
};

const categoryIcons: Record<string, string> = {
  Recycling: "♻️",
  Conservation: "🌿",
  "Clean Energy": "⚡",
  "Community": "🤝",
  "Wildlife": "🦋",
  "Water": "💧",
};

export function TaskCard({ task }: TaskCardProps) {
  const difficulty = difficultyMap[task.difficulty];

  return (
    <Card variant="interactive" className="overflow-hidden group">
      {task.imageUrl && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={task.imageUrl}
            alt={task.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <Badge variant={difficulty.variant}>{difficulty.label}</Badge>
            <Badge variant="secondary">
              {categoryIcons[task.category] || "🌍"} {task.category}
            </Badge>
          </div>
        </div>
      )}
      
      <CardHeader className={task.imageUrl ? "pt-4" : ""}>
        {!task.imageUrl && (
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={difficulty.variant}>{difficulty.label}</Badge>
            <Badge variant="secondary">
              {categoryIcons[task.category] || "🌍"} {task.category}
            </Badge>
          </div>
        )}
        <h3 className="font-display font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {task.title}
        </h3>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {task.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {task.locationRequired && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-eco-sky" />
              Location
            </span>
          )}
          {task.estimatedTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {task.estimatedTime}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Zap className="h-5 w-5 text-eco-sun" />
          <span className="font-bold text-foreground">{task.points}</span>
          <span className="text-sm text-muted-foreground">points</span>
        </div>
        <Link to={`/tasks/${task.id}`}>
          <Button variant="ghost" size="sm" className="group-hover:text-primary">
            View Task
            <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
