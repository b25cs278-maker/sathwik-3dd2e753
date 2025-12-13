import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Target, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Goal } from '@/hooks/useLocalStorage';

interface GoalTrackerProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onDeleteGoal: (id: string) => void;
}

const categoryIcons = {
  career: '💼',
  health: '💪',
  wealth: '💰',
  relationships: '❤️',
  personal: '🌟',
};

const categoryColors = {
  career: 'bg-eco-sky',
  health: 'bg-primary',
  wealth: 'bg-eco-sun',
  relationships: 'bg-eco-reward',
  personal: 'bg-eco-earth',
};

export function GoalTracker({ goals, onAddGoal, onUpdateProgress, onDeleteGoal }: GoalTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [category, setCategory] = useState<Goal['category']>('personal');
  const [deadline, setDeadline] = useState('2025-12-31');

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    
    const goal: Goal = {
      id: crypto.randomUUID(),
      title: newGoal,
      progress: 0,
      milestones: [],
      category,
      deadline,
      steps: generateSteps(newGoal),
      createdAt: new Date().toISOString(),
    };
    
    onAddGoal(goal);
    setNewGoal('');
    setShowForm(false);
  };

  // Generate suggested steps based on goal title
  const generateSteps = (goalTitle: string): string[] => {
    const title = goalTitle.toLowerCase();
    if (title.includes('million') || title.includes('follower')) {
      return ['Define target audience', 'Create content strategy', 'Post consistently', 'Engage with community', 'Analyze and optimize'];
    }
    if (title.includes('learn') || title.includes('skill')) {
      return ['Research resources', 'Set learning schedule', 'Practice daily', 'Build projects', 'Get feedback'];
    }
    return ['Break into milestones', 'Set weekly targets', 'Track progress', 'Review and adjust'];
  };

  const adjustProgress = (id: string, currentProgress: number, delta: number) => {
    const newProgress = Math.max(0, Math.min(100, currentProgress + delta));
    onUpdateProgress(id, newProgress);
  };

  return (
    <Card className="eco-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-eco-reward" />
            Big Goals
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <div className="space-y-2">
            <Input
              placeholder="e.g., Reach 1 million followers"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
              className="w-full"
            />
            <div className="flex gap-2">
            <Select value={category} onValueChange={(v) => setCategory(v as Goal['category'])}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="career">💼 Career</SelectItem>
                <SelectItem value="health">💪 Health</SelectItem>
                <SelectItem value="wealth">💰 Wealth</SelectItem>
                <SelectItem value="relationships">❤️ Relationships</SelectItem>
                <SelectItem value="personal">🌟 Personal</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-32 text-xs"
            />
            <Button onClick={handleAddGoal} size="sm">Add</Button>
          </div>
          </div>
        )}

        {goals.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Set ambitious goals and track your progress!
          </p>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{categoryIcons[goal.category]}</span>
                    <span className="text-sm font-medium">{goal.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => adjustProgress(goal.id, goal.progress, -10)}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Badge variant="outline" className="text-xs min-w-12 justify-center">
                      {goal.progress}%
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => adjustProgress(goal.id, goal.progress, 10)}
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => onDeleteGoal(goal.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
