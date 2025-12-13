import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, RefreshCw, Sparkles } from 'lucide-react';
import { ProductivityTask, Habit, Goal, DayPlan } from '@/hooks/useLocalStorage';

interface AIDayPlannerProps {
  tasks: ProductivityTask[];
  habits: Habit[];
  goals: Goal[];
  dayPlan: DayPlan[];
  onUpdateDayPlan: (plan: DayPlan[]) => void;
}

function generateDayPlan(tasks: ProductivityTask[], habits: Habit[], goals: Goal[]): DayPlan[] {
  const plan: DayPlan[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  // Morning routine
  plan.push({
    id: crypto.randomUUID(),
    time: '5:00 AM',
    activity: 'Wake up & Brain Dump',
    type: 'brain-dump',
    completed: false,
  });

  plan.push({
    id: crypto.randomUUID(),
    time: '5:30 AM',
    activity: 'Morning Routine & Hydration',
    type: 'routine',
    completed: false,
  });

  // Add incomplete habits
  const incompleteHabits = habits.filter(h => !h.completedDates.includes(today));
  if (incompleteHabits.length > 0) {
    plan.push({
      id: crypto.randomUUID(),
      time: '6:00 AM',
      activity: `Complete habits: ${incompleteHabits.slice(0, 2).map(h => h.name).join(', ')}`,
      type: 'routine',
      completed: false,
    });
  }

  // Deep work blocks for high priority tasks
  const highPriorityTasks = tasks.filter(t => !t.completed && t.priority === 'high');
  const deepWorkTasks = tasks.filter(t => !t.completed && t.category === 'deep-work');

  let currentHour = 6;
  
  highPriorityTasks.slice(0, 2).forEach((task, i) => {
    currentHour += 1;
    plan.push({
      id: crypto.randomUUID(),
      time: `${currentHour}:00 AM`,
      activity: `Deep Work: ${task.title}`,
      type: 'deep-work',
      completed: false,
    });
  });

  // Mid-morning break
  plan.push({
    id: crypto.randomUUID(),
    time: '10:00 AM',
    activity: 'Break & Movement (15 min)',
    type: 'break',
    completed: false,
  });

  // Add learning/routine tasks
  const learningTasks = tasks.filter(t => !t.completed && t.category === 'learning');
  if (learningTasks.length > 0) {
    plan.push({
      id: crypto.randomUUID(),
      time: '10:30 AM',
      activity: `Learning: ${learningTasks[0].title}`,
      type: 'deep-work',
      completed: false,
    });
  }

  // Afternoon schedule
  plan.push({
    id: crypto.randomUUID(),
    time: '12:00 PM',
    activity: 'Lunch & Recharge',
    type: 'break',
    completed: false,
  });

  // Add remaining tasks
  const remainingTasks = tasks.filter(t => !t.completed && t.priority === 'medium');
  remainingTasks.slice(0, 2).forEach((task, i) => {
    plan.push({
      id: crypto.randomUUID(),
      time: `${1 + i}:00 PM`,
      activity: task.title,
      type: 'routine',
      completed: false,
    });
  });

  // Evening review
  plan.push({
    id: crypto.randomUUID(),
    time: '6:00 PM',
    activity: 'Daily Review & Tomorrow Planning',
    type: 'review',
    completed: false,
  });

  plan.push({
    id: crypto.randomUUID(),
    time: '9:00 PM',
    activity: 'Wind down - No screens',
    type: 'routine',
    completed: false,
  });

  return plan;
}

const typeColors = {
  'brain-dump': 'bg-eco-sky text-foreground',
  'deep-work': 'bg-primary text-primary-foreground',
  'routine': 'bg-secondary text-secondary-foreground',
  'break': 'bg-eco-sun text-foreground',
  'review': 'bg-eco-reward text-foreground',
};

export function AIDayPlanner({ tasks, habits, goals, dayPlan, onUpdateDayPlan }: AIDayPlannerProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newPlan = generateDayPlan(tasks, habits, goals);
      onUpdateDayPlan(newPlan);
      setIsGenerating(false);
    }, 800);
  };

  const toggleItem = (id: string) => {
    onUpdateDayPlan(
      dayPlan.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = dayPlan.filter(d => d.completed).length;

  return (
    <Card className="eco-card border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            AI Day Planner
            <Badge variant="secondary" className="text-xs">Time-Locked</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {completedCount}/{dayPlan.length} done
            </Badge>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {dayPlan.length === 0 ? (
          <div className="text-center py-6">
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              Let AI organize your day hour by hour
            </p>
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate My Day'}
            </Button>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {dayPlan.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  item.completed ? 'bg-muted/50 opacity-60' : 'bg-card'
                }`}
              >
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => toggleItem(item.id)}
                />
                <div className="flex items-center gap-2 min-w-[70px]">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-mono text-muted-foreground">{item.time}</span>
                </div>
                <span className={`flex-1 text-sm ${item.completed ? 'line-through' : ''}`}>
                  {item.activity}
                </span>
                <Badge className={`text-xs ${typeColors[item.type]}`}>
                  {item.type.replace('-', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
