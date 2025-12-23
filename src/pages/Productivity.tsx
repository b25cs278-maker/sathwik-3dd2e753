import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskManager } from '@/components/productivity/TaskManager';
import { HabitTracker } from '@/components/productivity/HabitTracker';
import { GoalTracker } from '@/components/productivity/GoalTracker';
import { DeepWorkAIPlanner } from '@/components/productivity/DeepWorkAIPlanner';
import { LifeScorePanel } from '@/components/productivity/LifeScorePanel';
import { BehaviorTracker } from '@/components/productivity/BehaviorTracker';
import { ExecutionRulesPanel } from '@/components/productivity/ExecutionRulesPanel';
import { 
  useLocalStorage, 
  ProductivityTask, 
  Habit, 
  Goal, 
  DayPlan,
  ExecutionRule 
} from '@/hooks/useLocalStorage';
import { 
  ListTodo, 
  Target, 
  Repeat, 
  Brain, 
  Sparkles
} from 'lucide-react';

export default function Productivity() {
  // Local storage state for offline persistence
  const [tasks, setTasks] = useLocalStorage<ProductivityTask[]>('productivity-tasks', []);
  const [habits, setHabits] = useLocalStorage<Habit[]>('productivity-habits', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('productivity-goals', []);
  const [dayPlan, setDayPlan] = useLocalStorage<DayPlan[]>('productivity-day-plan', []);
  const [executionRules, setExecutionRules] = useLocalStorage<ExecutionRule[]>('execution-rules', []);

  // Task handlers
  const handleAddTask = (task: ProductivityTask) => {
    setTasks(prev => [...prev, task]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id 
        ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
        : t
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Habit handlers
  const handleAddHabit = (habit: Habit) => {
    setHabits(prev => [...prev, habit]);
  };

  const handleToggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const isCompletedToday = h.completedDates.includes(today);
      if (isCompletedToday) {
        return {
          ...h,
          completedDates: h.completedDates.filter(d => d !== today),
          streak: Math.max(0, h.streak - 1)
        };
      } else {
        return {
          ...h,
          completedDates: [...h.completedDates, today],
          streak: h.streak + 1
        };
      }
    }));
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  // Goal handlers
  const handleAddGoal = (goal: Goal) => {
    setGoals(prev => [...prev, goal]);
  };

  const handleUpdateGoalProgress = (id: string, progress: number) => {
    setGoals(prev => prev.map(g => 
      g.id === id ? { ...g, progress: Math.min(100, Math.max(0, progress)) } : g
    ));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Calculate life metrics for AI planner
  const lifeMetrics = {
    lifeScore: 75,
    energy: 80,
    focus: 70,
    discipline: 65,
    body: 70,
    mind: 75,
    spirit: 80,
    deepWorkMinutes: 120,
    workoutMinutes: 45,
    readingMinutes: 30,
    lastUpdated: new Date().toISOString(),
    history: []
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Productivity Hub
          </h1>
          <p className="text-muted-foreground">
            Track tasks, build habits, set goals & manage discipline. Everything runs offline.
          </p>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LifeScorePanel tasks={tasks} habits={habits} goals={goals} />
          <BehaviorTracker tasks={tasks} habits={habits} goals={goals} />
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="ai-planner" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
            <TabsTrigger value="ai-planner" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">AI Planner</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="habits" className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              <span className="hidden sm:inline">Habits</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="discipline" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Discipline</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-planner" className="space-y-6">
            <DeepWorkAIPlanner
              tasks={tasks}
              habits={habits}
              goals={goals}
              metrics={lifeMetrics}
              executionRules={executionRules}
              onAddTask={handleAddTask}
              onAddHabit={(habit) => setHabits(prev => [...prev, habit])}
              onUpdateRules={setExecutionRules}
            />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <TaskManager
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          </TabsContent>

          <TabsContent value="habits" className="space-y-6">
            <HabitTracker
              habits={habits}
              onAddHabit={handleAddHabit}
              onToggleHabit={handleToggleHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <GoalTracker
              goals={goals}
              onAddGoal={handleAddGoal}
              onUpdateProgress={handleUpdateGoalProgress}
              onDeleteGoal={handleDeleteGoal}
            />
          </TabsContent>

          <TabsContent value="discipline" className="space-y-6">
            <ExecutionRulesPanel
              rules={executionRules}
              onUpdateRules={setExecutionRules}
            />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
