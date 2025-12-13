import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Wand2, Plus, Check, Copy } from 'lucide-react';
import { ProductivityTask, Habit, Goal, LifeMetrics, ExecutionRule } from '@/hooks/useLocalStorage';

interface AdvancedAIPlannerProps {
  tasks: ProductivityTask[];
  habits: Habit[];
  goals: Goal[];
  metrics: LifeMetrics;
  executionRules: ExecutionRule[];
  onAddTask: (task: ProductivityTask) => void;
  onAddHabit: (habit: Habit) => void;
  onUpdateRules: (rules: ExecutionRule[]) => void;
}

interface GeneratedPlan {
  brainDump: string[];
  tasks: { title: string; priority: 'low' | 'medium' | 'high'; category: ProductivityTask['category'] }[];
  deepWorkSessions: string[];
  reviewItems: string[];
  executionRules: string[];
}

function generatePlanFromPrompt(prompt: string, currentData: { tasks: ProductivityTask[], habits: Habit[], goals: Goal[], metrics: LifeMetrics }): GeneratedPlan {
  const promptLower = prompt.toLowerCase();
  const plan: GeneratedPlan = {
    brainDump: [],
    tasks: [],
    deepWorkSessions: [],
    reviewItems: [],
    executionRules: [],
  };

  // Brain dump based on prompt
  plan.brainDump = [
    "Capture all thoughts before starting work",
    "Write down distractions as they come",
    "Clear mental clutter in 5 minutes",
  ];

  // Generate tasks based on keywords in prompt
  if (promptLower.includes('coding') || promptLower.includes('code') || promptLower.includes('app development')) {
    plan.tasks.push({ title: 'Complete 2 hours of coding practice', priority: 'high', category: 'deep-work' });
    plan.tasks.push({ title: 'Build one small feature or fix a bug', priority: 'medium', category: 'learning' });
  }
  
  if (promptLower.includes('finance') || promptLower.includes('money')) {
    plan.tasks.push({ title: 'Study finance fundamentals (1 hour)', priority: 'high', category: 'learning' });
    plan.tasks.push({ title: 'Review budget and track expenses', priority: 'medium', category: 'routine' });
  }
  
  if (promptLower.includes('content') || promptLower.includes('youtube') || promptLower.includes('video')) {
    plan.tasks.push({ title: 'Script or edit content for 90 minutes', priority: 'high', category: 'deep-work' });
    plan.tasks.push({ title: 'Plan next week content calendar', priority: 'medium', category: 'routine' });
  }
  
  if (promptLower.includes('learn')) {
    plan.tasks.push({ title: 'Dedicated learning block (1 hour)', priority: 'high', category: 'learning' });
  }

  // Add generic tasks if needed
  if (plan.tasks.length < 3) {
    plan.tasks.push({ title: 'Complete most important task first', priority: 'high', category: 'deep-work' });
    plan.tasks.push({ title: 'Review and plan tomorrow', priority: 'low', category: 'routine' });
  }

  // Deep work sessions
  plan.deepWorkSessions = [
    "6:00-8:00 AM - First deep work block (highest focus)",
    "10:00 AM-12:00 PM - Second deep work block",
    "3:00-5:00 PM - Third deep work block (if energy permits)",
  ];

  // Review items
  plan.reviewItems = [
    "Did I complete my top 3 priorities?",
    "What did I learn today?",
    "What will I do differently tomorrow?",
    "Rate my discipline 1-10",
  ];

  // Execution rules
  plan.executionRules = [
    "No social media before deep work is complete",
    "Read your calendar as a command, not a suggestion",
    "Move your brain toward goals every single day",
    "One task at a time - no multitasking",
    "Phone in another room during deep work",
  ];

  return plan;
}

export function AdvancedAIPlanner({ 
  tasks, 
  habits, 
  goals, 
  metrics, 
  executionRules,
  onAddTask, 
  onAddHabit,
  onUpdateRules 
}: AdvancedAIPlannerProps) {
  const [prompt, setPrompt] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const plan = generatePlanFromPrompt(prompt, { tasks, habits, goals, metrics });
      setGeneratedPlan(plan);
      setIsGenerating(false);
      setAddedItems(new Set());
    }, 1000);
  };

  const handleAddTask = (task: { title: string; priority: 'low' | 'medium' | 'high'; category: ProductivityTask['category'] }) => {
    const newTask: ProductivityTask = {
      id: crypto.randomUUID(),
      title: task.title,
      completed: false,
      priority: task.priority,
      category: task.category,
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
  };

  return (
    <Card className="eco-card border-eco-reward/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-eco-reward" />
          AI Planner
          <Badge variant="outline" className="text-xs">Offline Logic</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prompt Input */}
        <div className="space-y-2">
          <Textarea
            placeholder="I want to learn coding, finance, app development, and create content. This is my real-life situation..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Plan
              </>
            )}
          </Button>
        </div>

        {/* Generated Plan */}
        {generatedPlan && (
          <div className="space-y-4 pt-4 border-t border-border">
            {/* Brain Dump */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                🧠 Brain Dump
              </h4>
              <div className="space-y-1">
                {generatedPlan.brainDump.map((item, i) => (
                  <p key={i} className="text-sm text-muted-foreground pl-4">• {item}</p>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  ✅ Tasks
                </h4>
                <Button variant="outline" size="sm" onClick={handleAddAllTasks}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add All
                </Button>
              </div>
              <div className="space-y-2">
                {generatedPlan.tasks.map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-accent/30">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">{task.priority}</Badge>
                      <span className="text-sm">{task.title}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleAddTask(task)}
                      disabled={addedItems.has(task.title)}
                    >
                      {addedItems.has(task.title) ? (
                        <Check className="h-3 w-3 text-primary" />
                      ) : (
                        <Plus className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Deep Work Sessions */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                🎧 Deep Work Sessions
              </h4>
              <div className="space-y-1">
                {generatedPlan.deepWorkSessions.map((session, i) => (
                  <p key={i} className="text-sm text-muted-foreground pl-4">• {session}</p>
                ))}
              </div>
            </div>

            {/* Execution Rules */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  ⚡ Execution Rules
                </h4>
                <Button variant="outline" size="sm" onClick={handleAddRules}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Rules
                </Button>
              </div>
              <div className="space-y-1">
                {generatedPlan.executionRules.map((rule, i) => (
                  <p key={i} className="text-sm text-muted-foreground pl-4">• {rule}</p>
                ))}
              </div>
            </div>

            {/* Review Items */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                📋 Daily Review
              </h4>
              <div className="space-y-1">
                {generatedPlan.reviewItems.map((item, i) => (
                  <p key={i} className="text-sm text-muted-foreground pl-4">• {item}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
