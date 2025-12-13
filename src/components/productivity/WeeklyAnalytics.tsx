import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip } from 'recharts';
import { TrendingUp, CheckCircle, Target, Flame } from 'lucide-react';
import { ProductivityTask, Habit, Goal, LifeMetrics } from '@/hooks/useLocalStorage';

interface WeeklyAnalyticsProps {
  tasks: ProductivityTask[];
  habits: Habit[];
  goals: Goal[];
  metrics: LifeMetrics;
}

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}

function getDayLabel(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function WeeklyAnalytics({ tasks, habits, goals, metrics }: WeeklyAnalyticsProps) {
  const last7Days = getLast7Days();

  // Task completion data for each day
  const taskData = last7Days.map(day => {
    const completed = tasks.filter(t => 
      t.completed && t.completedAt?.startsWith(day)
    ).length;
    const created = tasks.filter(t => t.createdAt.startsWith(day)).length;
    return {
      day: getDayLabel(day),
      completed,
      created,
    };
  });

  // Habit completion rate for each day
  const habitData = last7Days.map(day => {
    const completedHabits = habits.filter(h => h.completedDates.includes(day)).length;
    const rate = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;
    return {
      day: getDayLabel(day),
      rate,
      completed: completedHabits,
    };
  });

  // Overall stats
  const totalTasksCompleted = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((totalTasksCompleted / totalTasks) * 100) : 0;

  const avgHabitRate = habitData.length > 0 
    ? Math.round(habitData.reduce((sum, d) => sum + d.rate, 0) / habitData.length) 
    : 0;

  const totalStreaks = habits.reduce((sum, h) => sum + h.streak, 0);
  const avgGoalProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) 
    : 0;

  // Category breakdown for pie chart
  const categoryData = [
    { name: 'Deep Work', value: tasks.filter(t => t.category === 'deep-work').length, color: 'hsl(var(--primary))' },
    { name: 'Routine', value: tasks.filter(t => t.category === 'routine').length, color: 'hsl(var(--secondary))' },
    { name: 'Quick Win', value: tasks.filter(t => t.category === 'quick-win').length, color: 'hsl(var(--eco-sun))' },
    { name: 'Learning', value: tasks.filter(t => t.category === 'learning').length, color: 'hsl(var(--eco-sky))' },
  ].filter(c => c.value > 0);

  return (
    <Card className="eco-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Weekly Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg bg-primary/10">
            <CheckCircle className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold">{taskCompletionRate}%</p>
            <p className="text-xs text-muted-foreground">Tasks Done</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-eco-sun/10">
            <Flame className="h-4 w-4 text-eco-sun mx-auto mb-1" />
            <p className="text-lg font-bold">{avgHabitRate}%</p>
            <p className="text-xs text-muted-foreground">Habit Rate</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-eco-reward/10">
            <Target className="h-4 w-4 text-eco-reward mx-auto mb-1" />
            <p className="text-lg font-bold">{avgGoalProgress}%</p>
            <p className="text-xs text-muted-foreground">Goal Progress</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-eco-sky/10">
            <Flame className="h-4 w-4 text-eco-sky mx-auto mb-1" />
            <p className="text-lg font-bold">{totalStreaks}</p>
            <p className="text-xs text-muted-foreground">Total Streaks</p>
          </div>
        </div>

        {/* Tasks Completed Chart */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Tasks Completed This Week
          </h4>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskData}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Habit Completion Rate */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Flame className="h-4 w-4" />
            Habit Completion Rate
          </h4>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={habitData}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Completion']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="hsl(var(--eco-sun))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--eco-sun))', strokeWidth: 0, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Categories */}
        {categoryData.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3">Task Categories</h4>
            <div className="flex items-center gap-4">
              <div className="h-[100px] w-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={45}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-1">
                {categoryData.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span>{cat.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">{cat.value}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
