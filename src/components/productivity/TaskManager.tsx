import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Clock, Flame } from 'lucide-react';
import { ProductivityTask } from '@/hooks/useLocalStorage';

interface TaskManagerProps {
  tasks: ProductivityTask[];
  onAddTask: (task: ProductivityTask) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const categoryColors = {
  'deep-work': 'bg-primary text-primary-foreground',
  'routine': 'bg-secondary text-secondary-foreground',
  'quick-win': 'bg-eco-sun text-foreground',
  'learning': 'bg-eco-sky text-foreground',
};

const priorityColors = {
  low: 'border-muted',
  medium: 'border-eco-sun',
  high: 'border-destructive',
};

export function TaskManager({ tasks, onAddTask, onToggleTask, onDeleteTask }: TaskManagerProps) {
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState<ProductivityTask['category']>('deep-work');
  const [priority, setPriority] = useState<ProductivityTask['priority']>('medium');
  const [duration, setDuration] = useState('60');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    
    const task: ProductivityTask = {
      id: crypto.randomUUID(),
      title: newTask,
      completed: false,
      priority,
      category,
      estimatedMinutes: parseInt(duration) || 60,
      dueDate,
      createdAt: new Date().toISOString(),
    };
    
    onAddTask(task);
    setNewTask('');
  };

  const completedToday = tasks.filter(t =>
    t.completed && t.completedAt?.startsWith(new Date().toISOString().split('T')[0])
  ).length;

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <Card className="eco-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            Deep Work & Tasks
          </div>
          <Badge variant="outline" className="text-xs">
            {completedToday} done today
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Task Form */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Finish physics chapter, Edit YouTube video..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              className="flex-1"
            />
            <Button onClick={handleAddTask} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="w-24 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                  <SelectItem value="90">90 min</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={category} onValueChange={(v) => setCategory(v as ProductivityTask['category'])}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deep-work">Deep Work</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="quick-win">Quick Win</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priority} onValueChange={(v) => setPriority(v as ProductivityTask['priority'])}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-32 h-8 text-xs"
            />
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="space-y-2">
          {pendingTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No pending tasks. Add one above!
            </p>
          ) : (
            pendingTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-l-4 bg-card ${priorityColors[task.priority]}`}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => onToggleTask(task.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                  {task.estimatedMinutes && (
                    <p className="text-xs text-muted-foreground">{task.estimatedMinutes} min</p>
                  )}
                </div>
                <Badge className={`text-xs ${categoryColors[task.category]}`}>
                  {task.category}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => onDeleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Completed ({completedTasks.length})</p>
            <div className="space-y-1">
              {completedTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-2 opacity-60">
                  <Checkbox checked disabled />
                  <p className="text-sm text-muted-foreground line-through truncate">{task.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
