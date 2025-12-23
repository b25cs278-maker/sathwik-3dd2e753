import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Sparkles, 
  Plus, 
  Check, 
  Clock, 
  Target, 
  Brain, 
  Zap,
  Calendar,
  ListTodo,
  BookOpen,
  Coffee
} from 'lucide-react';
import { ProductivityTask, Habit, Goal, LifeMetrics, ExecutionRule } from '@/hooks/useLocalStorage';

interface DeepWorkAIPlannerProps {
  tasks: ProductivityTask[];
  habits: Habit[];
  goals: Goal[];
  metrics: LifeMetrics;
  executionRules: ExecutionRule[];
  onAddTask: (task: ProductivityTask) => void;
  onAddHabit: (habit: Habit) => void;
  onUpdateRules: (rules: ExecutionRule[]) => void;
}

interface DetailedPlan {
  summary: string;
  focusAreas: string[];
  morningRoutine: { time: string; activity: string; duration: string }[];
  deepWorkBlocks: { time: string; task: string; priority: 'high' | 'medium' | 'low'; duration: string }[];
  tasks: { title: string; priority: 'low' | 'medium' | 'high'; category: ProductivityTask['category']; estimatedMinutes: number }[];
  habits: { name: string; frequency: string; reason: string }[];
  executionRules: string[];
  eveningReview: string[];
  tips: string[];
}

function generateDetailedPlan(prompt: string): DetailedPlan {
  const promptLower = prompt.toLowerCase();
  
  // Parse time and context from prompt
  const hasTimeContext = promptLower.includes('hour') || promptLower.includes('minute');
  const wantsToLearn = promptLower.includes('learn') || promptLower.includes('study');
  const wantsProductivity = promptLower.includes('productive') || promptLower.includes('focus');
  const hasCoding = promptLower.includes('coding') || promptLower.includes('code') || promptLower.includes('programming') || promptLower.includes('app');
  const hasContent = promptLower.includes('content') || promptLower.includes('youtube') || promptLower.includes('video') || promptLower.includes('create');
  const hasFinance = promptLower.includes('finance') || promptLower.includes('money') || promptLower.includes('invest');
  const hasHealth = promptLower.includes('health') || promptLower.includes('workout') || promptLower.includes('exercise') || promptLower.includes('gym');
  const hasReading = promptLower.includes('read') || promptLower.includes('book');
  
  const plan: DetailedPlan = {
    summary: '',
    focusAreas: [],
    morningRoutine: [],
    deepWorkBlocks: [],
    tasks: [],
    habits: [],
    executionRules: [],
    eveningReview: [],
    tips: []
  };

  // Generate summary based on prompt
  plan.summary = `Based on your goals: "${prompt.slice(0, 100)}${prompt.length > 100 ? '...' : ''}", here's your personalized productivity plan designed for maximum deep work and focus.`;

  // Focus areas
  if (hasCoding) plan.focusAreas.push('Software Development');
  if (hasContent) plan.focusAreas.push('Content Creation');
  if (hasFinance) plan.focusAreas.push('Financial Growth');
  if (hasHealth) plan.focusAreas.push('Health & Fitness');
  if (hasReading) plan.focusAreas.push('Reading & Learning');
  if (wantsToLearn) plan.focusAreas.push('Skill Development');
  if (plan.focusAreas.length === 0) plan.focusAreas.push('Personal Development', 'Productivity');

  // Morning routine
  plan.morningRoutine = [
    { time: '5:30 AM', activity: 'Wake up, hydrate, light stretching', duration: '15 min' },
    { time: '5:45 AM', activity: 'Brain dump - write all thoughts on paper', duration: '10 min' },
    { time: '6:00 AM', activity: 'Cold shower & get ready', duration: '20 min' },
    { time: '6:20 AM', activity: 'Review goals & plan the day', duration: '10 min' },
  ];

  // Deep work blocks based on focus areas
  if (hasCoding) {
    plan.deepWorkBlocks.push({ time: '6:30 AM - 8:30 AM', task: 'Coding / App Development', priority: 'high', duration: '2 hours' });
    plan.tasks.push({ title: 'Complete 2 hours of focused coding', priority: 'high', category: 'deep-work', estimatedMinutes: 120 });
    plan.tasks.push({ title: 'Build one feature or fix 2 bugs', priority: 'medium', category: 'deep-work', estimatedMinutes: 60 });
    plan.tasks.push({ title: 'Code review and documentation', priority: 'low', category: 'routine', estimatedMinutes: 30 });
  }

  if (hasContent) {
    plan.deepWorkBlocks.push({ time: '9:00 AM - 11:00 AM', task: 'Content Creation / Scripting', priority: 'high', duration: '2 hours' });
    plan.tasks.push({ title: 'Script or record content for 90 minutes', priority: 'high', category: 'deep-work', estimatedMinutes: 90 });
    plan.tasks.push({ title: 'Edit and post one piece of content', priority: 'medium', category: 'deep-work', estimatedMinutes: 60 });
    plan.tasks.push({ title: 'Plan content calendar for the week', priority: 'low', category: 'routine', estimatedMinutes: 30 });
  }

  if (hasFinance) {
    plan.deepWorkBlocks.push({ time: '2:00 PM - 3:30 PM', task: 'Finance Study / Analysis', priority: 'medium', duration: '1.5 hours' });
    plan.tasks.push({ title: 'Study finance fundamentals (1 hour)', priority: 'high', category: 'learning', estimatedMinutes: 60 });
    plan.tasks.push({ title: 'Review portfolio and market trends', priority: 'medium', category: 'routine', estimatedMinutes: 45 });
    plan.tasks.push({ title: 'Track monthly budget and expenses', priority: 'low', category: 'routine', estimatedMinutes: 20 });
  }

  if (hasHealth) {
    plan.tasks.push({ title: 'Morning workout (strength or cardio)', priority: 'high', category: 'routine', estimatedMinutes: 45 });
    plan.tasks.push({ title: 'Meal prep for healthy eating', priority: 'medium', category: 'routine', estimatedMinutes: 30 });
    plan.habits.push({ name: 'Daily Exercise', frequency: 'Daily', reason: 'Physical fitness fuels mental performance' });
  }

  if (hasReading) {
    plan.tasks.push({ title: 'Read for 30 minutes (focused, no phone)', priority: 'medium', category: 'learning', estimatedMinutes: 30 });
    plan.habits.push({ name: 'Daily Reading', frequency: 'Daily', reason: 'Compound knowledge over time' });
  }

  // Add generic deep work block if none added
  if (plan.deepWorkBlocks.length === 0) {
    plan.deepWorkBlocks.push({ time: '6:30 AM - 8:30 AM', task: 'Most Important Task', priority: 'high', duration: '2 hours' });
    plan.deepWorkBlocks.push({ time: '9:30 AM - 11:30 AM', task: 'Secondary Priority Work', priority: 'medium', duration: '2 hours' });
  }

  // Always add afternoon block
  plan.deepWorkBlocks.push({ time: '3:30 PM - 5:00 PM', task: 'Administrative & Learning', priority: 'low', duration: '1.5 hours' });

  // Generic tasks if not enough
  if (plan.tasks.length < 3) {
    plan.tasks.push({ title: 'Complete most important task first', priority: 'high', category: 'deep-work', estimatedMinutes: 60 });
    plan.tasks.push({ title: 'Clear email and messages (batched)', priority: 'low', category: 'quick-win', estimatedMinutes: 20 });
    plan.tasks.push({ title: 'Review and plan tomorrow', priority: 'medium', category: 'routine', estimatedMinutes: 15 });
  }

  // Habits
  plan.habits = [
    ...plan.habits,
    { name: 'Morning Brain Dump', frequency: 'Daily', reason: 'Clear mental clutter before deep work' },
    { name: 'No Phone First Hour', frequency: 'Daily', reason: 'Protect morning focus and willpower' },
    { name: 'Evening Review', frequency: 'Daily', reason: 'Learn from each day and improve' },
  ];

  // Execution rules
  plan.executionRules = [
    'No social media before completing first deep work block',
    'Phone in another room during all deep work sessions',
    'Read your calendar as a command, not a suggestion',
    'One task at a time - no multitasking ever',
    'Move your brain toward goals every single day',
    'If it takes less than 2 minutes, do it now',
    'Batch similar tasks together (emails, calls, admin)',
  ];

  // Evening review
  plan.eveningReview = [
    'Did I complete my top 3 priorities today?',
    'What did I learn that moves me forward?',
    'What will I do differently tomorrow?',
    'Rate my discipline today (1-10)',
    'What am I grateful for?',
    'Set top 3 priorities for tomorrow',
  ];

  // Tips based on prompt
  plan.tips = [
    'Start with your hardest task when willpower is highest',
    'Take 5-10 minute breaks between deep work blocks',
    'Keep a "distraction list" - write down interrupting thoughts to address later',
    'Review your goals every morning to stay aligned',
    'Protect your peak energy hours for deep work only',
  ];

  return plan;
}

const priorityColors = {
  high: 'bg-destructive/20 text-destructive border-destructive/30',
  medium: 'bg-warning/20 text-warning border-warning/30',
  low: 'bg-muted text-muted-foreground border-border',
};

export function DeepWorkAIPlanner({ 
  tasks, 
  habits, 
  goals, 
  metrics, 
  executionRules,
  onAddTask, 
  onAddHabit,
  onUpdateRules 
}: DeepWorkAIPlannerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<DetailedPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsGenerating(true);
    setTimeout(() => {
      const plan = generateDetailedPlan(searchQuery);
      setGeneratedPlan(plan);
      setIsGenerating(false);
      setAddedItems(new Set());
    }, 800);
  };

  const handleAddTask = (task: DetailedPlan['tasks'][0]) => {
    const newTask: ProductivityTask = {
      id: crypto.randomUUID(),
      title: task.title,
      completed: false,
      priority: task.priority,
      category: task.category,
      estimatedMinutes: task.estimatedMinutes,
      createdAt: new Date().toISOString(),
    };
    onAddTask(newTask);
    setAddedItems(prev => new Set([...prev, task.title]));
  };

  const handleAddAllTasks = () => {
    if (!generatedPlan) return;
    generatedPlan.tasks.forEach(task => {
      if (!addedItems.has(task.title)) {
        handleAddTask(task);
      }
    });
  };

  const handleAddRules = () => {
    if (!generatedPlan) return;
    const newRules: ExecutionRule[] = generatedPlan.executionRules.map(rule => ({
      id: crypto.randomUUID(),
      rule,
      active: true,
    }));
    onUpdateRules([...executionRules, ...newRules]);
    generatedPlan.executionRules.forEach(rule => {
      setAddedItems(prev => new Set([...prev, rule]));
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Engine Style Header */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Deep Work AI Planner
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Describe your goals, situation, and what you want to achieve. Get a personalized productivity plan with tasks, schedules, and execution rules.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {isGenerating ? (
              <Sparkles className="h-5 w-5 animate-pulse text-primary" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </div>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="I want to learn coding, build an app, create content, and stay fit..."
            className="w-full h-14 pl-12 pr-32 text-base rounded-2xl border-2 border-border focus:border-primary bg-card shadow-lg"
          />
          <Button 
            type="submit"
            disabled={isGenerating || !searchQuery.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-6"
          >
            {isGenerating ? 'Generating...' : 'Generate Plan'}
          </Button>
        </div>
        
        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {['Learn coding', 'Content creation', 'Finance & investing', 'Health & fitness', 'Study for exams'].map(suggestion => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setSearchQuery(prev => prev ? `${prev}, ${suggestion.toLowerCase()}` : suggestion)}
              className="px-3 py-1.5 text-sm rounded-full bg-accent/50 hover:bg-accent text-foreground transition-colors"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      </form>

      {/* Generated Plan Results */}
      {generatedPlan && (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Summary Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Your Personalized Plan</h3>
                  <p className="text-muted-foreground">{generatedPlan.summary}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {generatedPlan.focusAreas.map((area, i) => (
                      <Badge key={i} variant="secondary" className="bg-primary/10 text-primary">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Morning Routine */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Coffee className="h-5 w-5 text-amber-500" />
                  <h3 className="font-semibold">Morning Routine</h3>
                </div>
                <div className="space-y-3">
                  {generatedPlan.morningRoutine.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-accent/30">
                      <span className="text-xs font-mono text-muted-foreground w-16">{item.time}</span>
                      <span className="flex-1 text-sm">{item.activity}</span>
                      <Badge variant="outline" className="text-xs">{item.duration}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Deep Work Blocks */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Deep Work Blocks</h3>
                </div>
                <div className="space-y-3">
                  {generatedPlan.deepWorkBlocks.map((block, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${priorityColors[block.priority]}`}>
                      <Clock className="h-4 w-4" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{block.task}</p>
                        <p className="text-xs text-muted-foreground">{block.time}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{block.duration}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tasks */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ListTodo className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">Tasks to Add</h3>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleAddAllTasks}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add All
                  </Button>
                </div>
                <ScrollArea className="h-[250px]">
                  <div className="space-y-2 pr-4">
                    {generatedPlan.tasks.map((task, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={`text-xs capitalize ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium">{task.title}</p>
                            <p className="text-xs text-muted-foreground">{task.estimatedMinutes} min</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleAddTask(task)}
                          disabled={addedItems.has(task.title)}
                        >
                          {addedItems.has(task.title) ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Execution Rules */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-500" />
                    <h3 className="font-semibold">Execution Rules</h3>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddRules}
                    disabled={addedItems.has(generatedPlan.executionRules[0])}
                  >
                    {addedItems.has(generatedPlan.executionRules[0]) ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3 mr-1" />
                        Add All
                      </>
                    )}
                  </Button>
                </div>
                <ScrollArea className="h-[250px]">
                  <div className="space-y-2 pr-4">
                    {generatedPlan.executionRules.map((rule, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-accent/30">
                        <span className="text-primary mt-1">⚡</span>
                        <p className="text-sm">{rule}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Evening Review */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <h3 className="font-semibold">Evening Review Questions</h3>
                </div>
                <div className="space-y-2">
                  {generatedPlan.eveningReview.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-accent/30">
                      <span className="text-muted-foreground">{i + 1}.</span>
                      <p className="text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pro Tips */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Pro Tips</h3>
                </div>
                <div className="space-y-2">
                  {generatedPlan.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-accent/30">
                      <span className="text-blue-500">💡</span>
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
