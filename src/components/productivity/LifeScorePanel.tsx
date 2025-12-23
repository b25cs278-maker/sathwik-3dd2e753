import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { Zap, Brain, Shield, TrendingUp, CheckCircle, Target, Flame } from 'lucide-react';
import { ProductivityTask, Habit, Goal } from '@/hooks/useLocalStorage';
import { Progress } from '@/components/ui/progress';

interface LifeScorePanelProps {
  tasks: ProductivityTask[];
  habits: Habit[];
  goals: Goal[];
}

export function LifeScorePanel({ tasks, habits, goals }: LifeScorePanelProps) {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const metrics = useMemo(() => {
    // Tasks completed today
    const todayTasks = tasks.filter(t => t.completed && t.completedAt?.split('T')[0] === today);
    const totalTodayTasks = tasks.filter(t => t.dueDate === today || t.createdAt.split('T')[0] === today);
    
    // Tasks completed this week
    const weekTasks = tasks.filter(t => {
      if (!t.completed || !t.completedAt) return false;
      return new Date(t.completedAt) >= weekAgo;
    });

    // Habits completed today
    const habitsCompletedToday = habits.filter(h => h.completedDates.includes(today)).length;
    const totalHabits = habits.length;

    // Calculate scores based on performance
    const taskCompletionRate = totalTodayTasks.length > 0 
      ? (todayTasks.length / totalTodayTasks.length) * 100 
      : (todayTasks.length > 0 ? 100 : 50);

    const habitCompletionRate = totalHabits > 0 
      ? (habitsCompletedToday / totalHabits) * 100 
      : 50;

    // Goal progress average
    const avgGoalProgress = goals.length > 0 
      ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length 
      : 50;

    // Calculate individual metrics
    const energy = Math.round(
      (taskCompletionRate * 0.4) + 
      (habitCompletionRate * 0.4) + 
      (weekTasks.length > 0 ? Math.min(weekTasks.length * 5, 20) : 0)
    );

    const focus = Math.round(
      (tasks.filter(t => t.completed && t.category === 'deep-work').length * 10) +
      (todayTasks.filter(t => t.priority === 'high').length * 15) +
      (taskCompletionRate * 0.3)
    );

    const discipline = Math.round(
      (habitCompletionRate * 0.5) +
      (habits.reduce((sum, h) => sum + Math.min(h.streak * 3, 30), 0) / Math.max(habits.length, 1)) +
      (avgGoalProgress * 0.2)
    );

    // Clamp values to 0-100
    const clamp = (val: number) => Math.min(100, Math.max(0, val));
    
    const energyClamped = clamp(energy);
    const focusClamped = clamp(focus);
    const disciplineClamped = clamp(discipline);

    const lifeScore = Math.round((energyClamped + focusClamped + disciplineClamped) / 3);

    return {
      lifeScore: clamp(lifeScore),
      energy: energyClamped,
      focus: focusClamped,
      discipline: disciplineClamped,
      tasksToday: todayTasks.length,
      habitsToday: habitsCompletedToday,
      totalStreaks: habits.reduce((sum, h) => sum + h.streak, 0),
    };
  }, [tasks, habits, goals, today, weekAgo]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-eco-sun';
    if (score >= 40) return 'text-eco-earth';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Peak Performance 🚀';
    if (score >= 80) return 'On Fire!';
    if (score >= 60) return 'Good Progress';
    if (score >= 40) return 'Building Momentum';
    if (score >= 20) return 'Getting Started';
    return 'Time to Level Up';
  };

  return (
    <Card className="eco-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Life Score
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Auto-calculated from your performance
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Main Score */}
        <div className="flex items-center justify-center">
          <ProgressRing progress={metrics.lifeScore} size={110}>
            <div className="text-center">
              <p className={`text-3xl font-bold ${getScoreColor(metrics.lifeScore)}`}>
                {metrics.lifeScore}
              </p>
              <p className="text-xs text-muted-foreground">/ 100</p>
            </div>
          </ProgressRing>
        </div>
        <p className="text-center text-sm font-medium text-muted-foreground">
          {getScoreLabel(metrics.lifeScore)}
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-primary/10">
            <CheckCircle className="h-4 w-4 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold">{metrics.tasksToday}</p>
            <p className="text-[10px] text-muted-foreground">Tasks Today</p>
          </div>
          <div className="p-2 rounded-lg bg-eco-sun/10">
            <Target className="h-4 w-4 mx-auto text-eco-sun mb-1" />
            <p className="text-lg font-bold">{metrics.habitsToday}</p>
            <p className="text-[10px] text-muted-foreground">Habits Done</p>
          </div>
          <div className="p-2 rounded-lg bg-eco-reward/10">
            <Flame className="h-4 w-4 mx-auto text-eco-reward mb-1" />
            <p className="text-lg font-bold">{metrics.totalStreaks}</p>
            <p className="text-[10px] text-muted-foreground">Total Streaks</p>
          </div>
        </div>

        {/* Individual Metrics - Display Only */}
        <div className="space-y-3">
          {/* Energy */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-eco-sun" />
                <span className="text-sm font-medium">Energy</span>
              </div>
              <span className="text-sm font-bold">{metrics.energy}%</span>
            </div>
            <Progress value={metrics.energy} className="h-2" />
          </div>

          {/* Focus */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-eco-sky" />
                <span className="text-sm font-medium">Focus</span>
              </div>
              <span className="text-sm font-bold">{metrics.focus}%</span>
            </div>
            <Progress value={metrics.focus} className="h-2" />
          </div>

          {/* Discipline */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-eco-reward" />
                <span className="text-sm font-medium">Discipline</span>
              </div>
              <span className="text-sm font-bold">{metrics.discipline}%</span>
            </div>
            <Progress value={metrics.discipline} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
