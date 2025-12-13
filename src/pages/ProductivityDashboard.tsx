import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TaskManager } from '@/components/productivity/TaskManager';
import { HabitTracker } from '@/components/productivity/HabitTracker';
import { GoalTracker } from '@/components/productivity/GoalTracker';
import { LifeScorePanel } from '@/components/productivity/LifeScorePanel';
import { AIPlanner } from '@/components/productivity/AIPlanner';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage, ProductivityTask, Habit, Goal, LifeMetrics } from '@/hooks/useLocalStorage';
import { Rocket, Crown } from 'lucide-react';

const defaultMetrics: LifeMetrics = {
  lifeScore: 70,
  energy: 70,
  focus: 70,
  discipline: 70,
  lastUpdated: new Date().toISOString(),
  history: [],
};

export default function ProductivityDashboard() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  // All data stored in localStorage for offline use
  const [tasks, setTasks] = useLocalStorage<ProductivityTask[]>('productivity-tasks', []);
  const [habits, setHabits] = useLocalStorage<Habit[]>('productivity-habits', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('productivity-goals', []);
  const [metrics, setMetrics] = useLocalStorage<LifeMetrics>('life-metrics', defaultMetrics);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Task handlers
  const handleAddTask = (task: ProductivityTask) => {
    setTasks(prev => [task, ...prev]);
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
      
      const isCompleted = h.completedDates.includes(today);
      const completedDates = isCompleted
        ? h.completedDates.filter(d => d !== today)
        : [...h.completedDates, today];
      
      // Calculate streak
      let streak = 0;
      const sortedDates = completedDates.sort().reverse();
      for (let i = 0; i < sortedDates.length; i++) {
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() - i);
        if (sortedDates[i] === expectedDate.toISOString().split('T')[0]) {
          streak++;
        } else {
          break;
        }
      }

      return { ...h, completedDates, streak };
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
    setGoals(prev => prev.map(g => g.id === id ? { ...g, progress } : g));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Metrics handler
  const handleUpdateMetrics = (newMetrics: Partial<LifeMetrics>) => {
    setMetrics(prev => ({ ...prev, ...newMetrics }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={!!user} userRole={role || 'student'} onLogout={handleLogout} />

      <main className="container py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="h-8 w-8 text-eco-sun" />
            <h1 className="text-3xl font-display font-bold text-foreground">
              Billionaire Mode
            </h1>
            <Rocket className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Build habits, track goals, and become your future self. Everything runs offline.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Tasks & Habits */}
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-slide-up">
              <TaskManager
                tasks={tasks}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="animate-slide-up delay-100">
                <HabitTracker
                  habits={habits}
                  onAddHabit={handleAddHabit}
                  onToggleHabit={handleToggleHabit}
                  onDeleteHabit={handleDeleteHabit}
                />
              </div>
              <div className="animate-slide-up delay-200">
                <GoalTracker
                  goals={goals}
                  onAddGoal={handleAddGoal}
                  onUpdateProgress={handleUpdateGoalProgress}
                  onDeleteGoal={handleDeleteGoal}
                />
              </div>
            </div>

            <div className="animate-slide-up delay-300">
              <AIPlanner 
                tasks={tasks} 
                habits={habits} 
                goals={goals} 
                metrics={metrics} 
              />
            </div>
          </div>

          {/* Right Column - Life Score */}
          <div className="space-y-6">
            <div className="animate-slide-up delay-100">
              <LifeScorePanel 
                metrics={metrics} 
                onUpdateMetrics={handleUpdateMetrics} 
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
