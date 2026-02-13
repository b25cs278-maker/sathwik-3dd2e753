import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, Flame, BarChart3, Lightbulb, 
  TrendingUp, TrendingDown, Minus, 
  CheckCircle, Target, Zap, BookOpen
} from 'lucide-react';
import { ProductivityTask, Habit, Goal } from '@/hooks/useLocalStorage';

interface ProductivityInsightsProps {
  tasks: ProductivityTask[];
  habits: Habit[];
  goals: Goal[];
}

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function getDayLabel(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
}

export function ProductivityInsights({ tasks = [], habits = [], goals = [] }: ProductivityInsightsProps) {
  const today = new Date().toISOString().split('T')[0];
  const last7 = getLast7Days();

  const insights = useMemo(() => {
    const safeTasks = tasks || [];
    const safeHabits = habits || [];
    const safeGoals = goals || [];

    // --- Focus Hours Logged ---
    const completedTasks = safeTasks.filter(t => t.completed);
    const totalFocusMinutes = completedTasks
      .filter(t => t.category === 'deep-work' || t.category === 'learning')
      .reduce((sum, t) => sum + (t.estimatedMinutes || 30), 0);
    const todayFocusMinutes = completedTasks
      .filter(t => (t.category === 'deep-work' || t.category === 'learning') && t.completedAt?.startsWith(today))
      .reduce((sum, t) => sum + (t.estimatedMinutes || 30), 0);
    const focusHours = Math.round((totalFocusMinutes / 60) * 10) / 10;
    const todayFocusHours = Math.round((todayFocusMinutes / 60) * 10) / 10;

    // --- Learning Streak ---
    let streak = 0;
    const sortedDays = [...last7].reverse();
    for (const day of sortedDays) {
      const didLearn = safeTasks.some(t => 
        t.completed && t.category === 'learning' && t.completedAt?.startsWith(day)
      ) || safeHabits.some(h => h.completedDates.includes(day));
      if (didLearn) streak++;
      else break;
    }

    // --- Weekly Performance ---
    const weekTasksCompleted = last7.map(day => 
      safeTasks.filter(t => t.completed && t.completedAt?.startsWith(day)).length
    );
    const weekTasksCreated = last7.map(day =>
      safeTasks.filter(t => t.createdAt.startsWith(day)).length
    );
    const totalWeekCompleted = weekTasksCompleted.reduce((a, b) => a + b, 0);
    const totalWeekCreated = weekTasksCreated.reduce((a, b) => a + b, 0);
    const completionRate = totalWeekCreated > 0 ? Math.round((totalWeekCompleted / totalWeekCreated) * 100) : 0;

    // Habit consistency
    const habitConsistency = safeHabits.length > 0
      ? Math.round(last7.reduce((sum, day) => {
          const done = safeHabits.filter(h => h.completedDates.includes(day)).length;
          return sum + (done / safeHabits.length) * 100;
        }, 0) / 7)
      : 0;

    // Trend: compare this week vs previous (simple: first half vs second half of week)
    const firstHalf = weekTasksCompleted.slice(0, 3).reduce((a, b) => a + b, 0);
    const secondHalf = weekTasksCompleted.slice(4).reduce((a, b) => a + b, 0);
    const trend = secondHalf > firstHalf ? 'up' : secondHalf < firstHalf ? 'down' : 'flat';

    // Goal progress average
    const avgGoalProgress = safeGoals.length > 0
      ? Math.round(safeGoals.reduce((s, g) => s + g.progress, 0) / safeGoals.length)
      : 0;

    // --- Personalized Suggestions ---
    const suggestions: { icon: string; text: string; type: 'success' | 'warning' | 'tip' }[] = [];

    if (todayFocusMinutes === 0) {
      suggestions.push({ icon: '⏰', text: 'No focus time logged today. Try starting with a 25-minute deep work session.', type: 'warning' });
    } else if (todayFocusMinutes >= 120) {
      suggestions.push({ icon: '🎯', text: `Great focus today! ${todayFocusHours}h logged. Keep the momentum going.`, type: 'success' });
    }

    if (streak === 0) {
      suggestions.push({ icon: '📚', text: 'Start a learning streak! Complete one learning task to begin.', type: 'tip' });
    } else if (streak >= 5) {
      suggestions.push({ icon: '🔥', text: `${streak}-day learning streak! You're building a powerful habit.`, type: 'success' });
    }

    if (completionRate < 50 && totalWeekCreated > 0) {
      suggestions.push({ icon: '📋', text: 'Task completion rate is below 50%. Try breaking tasks into smaller pieces.', type: 'warning' });
    }

    if (habitConsistency < 40 && safeHabits.length > 0) {
      suggestions.push({ icon: '🔄', text: 'Habit consistency is low. Focus on completing just one habit daily to build momentum.', type: 'warning' });
    } else if (habitConsistency >= 80) {
      suggestions.push({ icon: '💪', text: 'Excellent habit consistency! You\'re in the top performance zone.', type: 'success' });
    }

    const highPriorityPending = safeTasks.filter(t => !t.completed && t.priority === 'high').length;
    if (highPriorityPending > 0) {
      suggestions.push({ icon: '🚨', text: `${highPriorityPending} high-priority task${highPriorityPending > 1 ? 's' : ''} pending. Tackle these first for maximum impact.`, type: 'tip' });
    }

    if (suggestions.length === 0) {
      suggestions.push({ icon: '✨', text: 'You\'re doing well! Keep consistent and focus on your deep work blocks.', type: 'success' });
    }

    return {
      focusHours,
      todayFocusHours,
      totalFocusMinutes,
      streak,
      weekTasksCompleted,
      totalWeekCompleted,
      completionRate,
      habitConsistency,
      trend,
      avgGoalProgress,
      suggestions,
    };
  }, [tasks, habits, goals, today, last7]);

  const TrendIcon = insights.trend === 'up' ? TrendingUp : insights.trend === 'down' ? TrendingDown : Minus;
  const trendColor = insights.trend === 'up' ? 'text-primary' : insights.trend === 'down' ? 'text-destructive' : 'text-muted-foreground';

  const maxBar = Math.max(...insights.weekTasksCompleted, 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Focus Hours Logged */}
      <Card className="eco-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-primary" />
            Focus Hours Logged
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-end gap-4">
            <div>
              <p className="text-4xl font-bold text-primary">{insights.focusHours}h</p>
              <p className="text-xs text-muted-foreground">Total focus time</p>
            </div>
            <div className="pb-1">
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                {insights.todayFocusHours}h today
              </Badge>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Daily goal: 4h</span>
              <span>{Math.min(100, Math.round((insights.todayFocusHours / 4) * 100))}%</span>
            </div>
            <Progress value={Math.min(100, (insights.todayFocusHours / 4) * 100)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Learning Streak */}
      <Card className="eco-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Flame className="h-4 w-4 text-eco-sun" />
            Learning Streak
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-end gap-4">
            <div>
              <p className="text-4xl font-bold text-eco-sun">{insights.streak}</p>
              <p className="text-xs text-muted-foreground">Consecutive days</p>
            </div>
            <div className="pb-1">
              <Badge variant="outline" className="text-xs">
                {insights.streak >= 7 ? '🔥 On fire!' : insights.streak >= 3 ? '⚡ Building up' : '🌱 Getting started'}
              </Badge>
            </div>
          </div>
          {/* Mini streak calendar */}
          <div className="flex gap-1.5 justify-between">
            {getLast7Days().map((day, i) => {
              const active = (tasks || []).some(t => 
                t.completed && t.category === 'learning' && t.completedAt?.startsWith(day)
              ) || (habits || []).some(h => h.completedDates.includes(day));
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                    active ? 'bg-eco-sun text-eco-sun-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {active ? '✓' : '·'}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{getDayLabel(day)}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Performance Report */}
      <Card className="eco-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4 text-eco-sky" />
            Weekly Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendIcon className={`h-4 w-4 ${trendColor}`} />
              <span className={`text-sm font-medium ${trendColor}`}>
                {insights.trend === 'up' ? 'Improving' : insights.trend === 'down' ? 'Declining' : 'Steady'}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">{insights.totalWeekCompleted} tasks done</Badge>
          </div>
          
          {/* Mini bar chart */}
          <div className="flex items-end gap-1 h-16 justify-between">
            {insights.weekTasksCompleted.map((count, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className="w-full rounded-t bg-primary/70 min-h-[2px] transition-all"
                  style={{ height: `${(count / maxBar) * 100}%` }}
                />
                <span className="text-[9px] text-muted-foreground">{getDayLabel(getLast7Days()[i])}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-1.5 rounded bg-primary/10">
              <CheckCircle className="h-3 w-3 mx-auto text-primary mb-0.5" />
              <p className="text-sm font-bold">{insights.completionRate}%</p>
              <p className="text-[9px] text-muted-foreground">Completion</p>
            </div>
            <div className="p-1.5 rounded bg-eco-sun/10">
              <Flame className="h-3 w-3 mx-auto text-eco-sun mb-0.5" />
              <p className="text-sm font-bold">{insights.habitConsistency}%</p>
              <p className="text-[9px] text-muted-foreground">Habits</p>
            </div>
            <div className="p-1.5 rounded bg-eco-sky/10">
              <Target className="h-3 w-3 mx-auto text-eco-sky mb-0.5" />
              <p className="text-sm font-bold">{insights.avgGoalProgress}%</p>
              <p className="text-[9px] text-muted-foreground">Goals</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Suggestions */}
      <Card className="eco-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-4 w-4 text-eco-reward" />
            Personalized Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {insights.suggestions.map((s, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${
                  s.type === 'success' ? 'bg-primary/5 border-primary/20' :
                  s.type === 'warning' ? 'bg-eco-sun/5 border-eco-sun/20' :
                  'bg-eco-sky/5 border-eco-sky/20'
                }`}
              >
                <span className="text-lg leading-none mt-0.5">{s.icon}</span>
                <p className="text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
