import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { ProductivityTask, Habit, Goal, LifeMetrics } from '@/hooks/useLocalStorage';

interface AIPlannerProps {
  tasks: ProductivityTask[];
  habits: Habit[];
  goals: Goal[];
  metrics: LifeMetrics;
}

// Offline AI planner - generates suggestions based on local data patterns
function generateSuggestions(
  tasks: ProductivityTask[],
  habits: Habit[],
  goals: Goal[],
  metrics: LifeMetrics
): string[] {
  const suggestions: string[] = [];
  const today = new Date().toISOString().split('T')[0];

  // Check incomplete habits
  const incompleteHabits = habits.filter(h => !h.completedDates.includes(today));
  if (incompleteHabits.length > 0) {
    suggestions.push(`📌 Complete your habits: ${incompleteHabits.map(h => h.name).join(', ')}`);
  }

  // Check high priority pending tasks
  const highPriorityTasks = tasks.filter(t => !t.completed && t.priority === 'high');
  if (highPriorityTasks.length > 0) {
    suggestions.push(`🔥 Focus on high priority: ${highPriorityTasks[0].title}`);
  }

  // Check goals needing attention
  const stagnantGoals = goals.filter(g => g.progress < 50);
  if (stagnantGoals.length > 0) {
    suggestions.push(`🎯 Boost your goal "${stagnantGoals[0].title}" - currently at ${stagnantGoals[0].progress}%`);
  }

  // Energy-based suggestions
  if (metrics.energy < 50) {
    suggestions.push('⚡ Low energy detected - take a 15-min break or do light exercise');
  }

  if (metrics.focus < 50) {
    suggestions.push('🧠 Focus is low - try a 25-min pomodoro session');
  }

  if (metrics.discipline < 50) {
    suggestions.push('💪 Discipline needs work - complete one small task to build momentum');
  }

  // Deep work suggestion
  const deepWorkTasks = tasks.filter(t => !t.completed && t.category === 'deep-work');
  if (deepWorkTasks.length > 0 && metrics.focus >= 70) {
    suggestions.push(`🎧 High focus mode! Perfect time for deep work on "${deepWorkTasks[0].title}"`);
  }

  // Streak motivation
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  if (bestStreak > 0) {
    suggestions.push(`🔥 Keep your ${bestStreak}-day streak alive!`);
  }

  // Billionaire mindset quotes
  const quotes = [
    '💡 "The way to get started is to quit talking and begin doing." - Walt Disney',
    '💡 "Success is not final, failure is not fatal: it is the courage to continue that counts."',
    '💡 "Your time is limited, don\'t waste it living someone else\'s life." - Steve Jobs',
    '💡 "The only way to do great work is to love what you do." - Steve Jobs',
    '💡 "It\'s not about ideas. It\'s about making ideas happen."',
  ];
  suggestions.push(quotes[Math.floor(Math.random() * quotes.length)]);

  // Fill with generic suggestions if needed
  if (suggestions.length < 3) {
    suggestions.push('📅 Plan your top 3 priorities for tomorrow');
    suggestions.push('🏆 Review your wins from this week');
  }

  return suggestions.slice(0, 5);
}

export function AIPlanner({ tasks, habits, goals, metrics }: AIPlannerProps) {
  const [suggestions, setSuggestions] = useState<string[]>(() => 
    generateSuggestions(tasks, habits, goals, metrics)
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSuggestions(generateSuggestions(tasks, habits, goals, metrics));
      setIsRefreshing(false);
    }, 500);
  };

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className="eco-card border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Planner
            <Badge variant="secondary" className="text-xs">Offline</Badge>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index}
            className="group flex items-start gap-3 p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
          >
            <p className="flex-1 text-sm text-foreground">{suggestion}</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleCopy(index, suggestion)}
            >
              {copied === index ? (
                <Check className="h-3 w-3 text-primary" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
