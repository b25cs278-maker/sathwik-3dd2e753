import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, TrendingUp, Dumbbell, BookOpen, Timer, Code } from 'lucide-react';
import { ProductivityTask, Habit, Goal } from '@/hooks/useLocalStorage';

interface BehaviorTrackerProps {
  tasks: ProductivityTask[];
  habits: Habit[];
  goals: Goal[];
}

function getBehaviorRating(score: number): { rating: string; emoji: string; color: string } {
  if (score >= 85) {
    return { rating: 'Focused Billionaire', emoji: '🚀', color: 'text-primary' };
  } else if (score >= 70) {
    return { rating: 'Rising Star', emoji: '⭐', color: 'text-eco-sun' };
  } else if (score >= 50) {
    return { rating: 'Average Performer', emoji: '📊', color: 'text-muted-foreground' };
  } else if (score >= 25) {
    return { rating: 'Warming Up', emoji: '🔥', color: 'text-eco-earth' };
  } else {
    return { rating: 'Lazy Lion', emoji: '🦁', color: 'text-destructive' };
  }
}

function getLifeFocusLevel(value: number): { label: string; color: string } {
  if (value >= 80) return { label: 'Peak', color: 'bg-primary' };
  if (value >= 60) return { label: 'Good', color: 'bg-eco-sun' };
  if (value >= 40) return { label: 'Moderate', color: 'bg-eco-earth' };
  return { label: 'Low', color: 'bg-destructive' };
}

export function BehaviorTracker({ tasks = [], habits = [], goals = [] }: BehaviorTrackerProps) {
  const today = new Date().toISOString().split('T')[0];

  const metrics = useMemo(() => {
    const safeTasks = tasks || [];
    const safeHabits = habits || [];
    const safeGoals = goals || [];
    
    const completedTasks = safeTasks.filter(t => t.completed);
    const todayTasks = completedTasks.filter(t => t.completedAt?.split('T')[0] === today);
    
    // Calculate deep work minutes from completed deep-work tasks
    const deepWorkMinutes = completedTasks
      .filter(t => t.category === 'deep-work')
      .reduce((sum, t) => sum + (t.estimatedMinutes || 30), 0);

    // Calculate workout minutes from tasks containing workout/exercise keywords
    const workoutKeywords = ['workout', 'exercise', 'gym', 'run', 'yoga', 'fitness', 'training', 'walk'];
    const workoutMinutes = completedTasks
      .filter(t => workoutKeywords.some(k => 
        t.title.toLowerCase().includes(k) || (t.description?.toLowerCase() || '').includes(k)
      ))
      .reduce((sum, t) => sum + (t.estimatedMinutes || 30), 0);

    // Calculate reading minutes from tasks containing read keywords
    const readKeywords = ['read', 'book', 'chapter', 'article', 'study', 'learn', 'research'];
    const readingMinutes = completedTasks
      .filter(t => readKeywords.some(k => 
        t.title.toLowerCase().includes(k) || (t.description?.toLowerCase() || '').includes(k)
      ))
      .reduce((sum, t) => sum + (t.estimatedMinutes || 20), 0);

    // Calculate coding minutes
    const codeKeywords = ['code', 'program', 'develop', 'build', 'debug', 'feature', 'api'];
    const codingMinutes = completedTasks
      .filter(t => codeKeywords.some(k => 
        t.title.toLowerCase().includes(k) || (t.description?.toLowerCase() || '').includes(k)
      ))
      .reduce((sum, t) => sum + (t.estimatedMinutes || 30), 0);

    // Body score based on workout tasks
    const bodyScore = Math.min(100, workoutMinutes > 0 ? 40 + (workoutMinutes / 60) * 30 : 20);

    // Mind score based on reading, learning, coding
    const mindScore = Math.min(100, (readingMinutes + codingMinutes) > 0 
      ? 40 + ((readingMinutes + codingMinutes) / 120) * 40 
      : 30);

    // Spirit score based on habits and goal progress
    const habitsToday = safeHabits.filter(h => h.completedDates.includes(today)).length;
    const avgGoalProgress = safeGoals.length > 0 
      ? safeGoals.reduce((sum, g) => sum + g.progress, 0) / safeGoals.length 
      : 50;
    const spiritScore = Math.min(100, 
      (habitsToday / Math.max(safeHabits.length, 1)) * 50 + 
      avgGoalProgress * 0.5
    );

    // Overall behavior score
    const behaviorScore = Math.round((bodyScore + mindScore + spiritScore) / 3);

    return {
      deepWorkMinutes,
      workoutMinutes,
      readingMinutes,
      codingMinutes,
      body: Math.round(bodyScore),
      mind: Math.round(mindScore),
      spirit: Math.round(spiritScore),
      behaviorScore,
      todayTasksCount: todayTasks.length,
    };
  }, [tasks, habits, goals, today]);

  const behavior = getBehaviorRating(metrics.behaviorScore);
  const bodyLevel = getLifeFocusLevel(metrics.body);
  const mindLevel = getLifeFocusLevel(metrics.mind);
  const spiritLevel = getLifeFocusLevel(metrics.spirit);

  return (
    <Card className="eco-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Crown className="h-5 w-5 text-eco-sun" />
          Behavior & Life Focus
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Auto-tracked from your completed tasks
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Behavioral Rating */}
        <div className="text-center p-4 rounded-lg bg-accent/30">
          <p className="text-4xl mb-2">{behavior.emoji}</p>
          <p className={`text-lg font-bold ${behavior.color}`}>{behavior.rating}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Score: {metrics.behaviorScore}/100
          </p>
        </div>

        {/* Life Focus - Body, Mind, Spirit */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Life Focus Levels
          </h4>
          
          {/* Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>💪</span>
                <span className="text-sm">Body</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{bodyLevel.label}</Badge>
                <span className="text-xs text-muted-foreground">{metrics.body}%</span>
              </div>
            </div>
            <Progress value={metrics.body} className="h-2" />
          </div>

          {/* Mind */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>🧠</span>
                <span className="text-sm">Mind</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{mindLevel.label}</Badge>
                <span className="text-xs text-muted-foreground">{metrics.mind}%</span>
              </div>
            </div>
            <Progress value={metrics.mind} className="h-2" />
          </div>

          {/* Spirit */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span className="text-sm">Spirit</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{spiritLevel.label}</Badge>
                <span className="text-xs text-muted-foreground">{metrics.spirit}%</span>
              </div>
            </div>
            <Progress value={metrics.spirit} className="h-2" />
          </div>
        </div>

        {/* Activity Summary - Auto-tracked */}
        <div className="space-y-2 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold">Activity Summary</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-card">
              <Timer className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Deep Work</p>
                <p className="text-sm font-bold">{metrics.deepWorkMinutes} min</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-card">
              <Dumbbell className="h-4 w-4 text-eco-sun" />
              <div>
                <p className="text-xs text-muted-foreground">Workout</p>
                <p className="text-sm font-bold">{metrics.workoutMinutes} min</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-card">
              <BookOpen className="h-4 w-4 text-eco-sky" />
              <div>
                <p className="text-xs text-muted-foreground">Reading</p>
                <p className="text-sm font-bold">{metrics.readingMinutes} min</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-card">
              <Code className="h-4 w-4 text-eco-reward" />
              <div>
                <p className="text-xs text-muted-foreground">Coding</p>
                <p className="text-sm font-bold">{metrics.codingMinutes} min</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
