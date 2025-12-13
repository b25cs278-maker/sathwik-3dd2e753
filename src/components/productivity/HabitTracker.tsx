import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Flame, Check, Trash2 } from 'lucide-react';
import { Habit } from '@/hooks/useLocalStorage';

interface HabitTrackerProps {
  habits: Habit[];
  onAddHabit: (habit: Habit) => void;
  onToggleHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
}

const habitColors = [
  'hsl(var(--primary))',
  'hsl(var(--eco-sky))',
  'hsl(var(--eco-sun))',
  'hsl(var(--eco-reward))',
  'hsl(var(--eco-earth))',
];

export function HabitTracker({ habits, onAddHabit, onToggleHabit, onDeleteHabit }: HabitTrackerProps) {
  const [newHabit, setNewHabit] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAddHabit = () => {
    if (!newHabit.trim()) return;
    
    const habit: Habit = {
      id: crypto.randomUUID(),
      name: newHabit,
      frequency: 'daily',
      streak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
      color: habitColors[habits.length % habitColors.length],
    };
    
    onAddHabit(habit);
    setNewHabit('');
    setShowForm(false);
  };

  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = (habit: Habit) => habit.completedDates.includes(today);

  // Get last 7 days for the grid
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  return (
    <Card className="eco-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-eco-sun" />
            Habits
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <div className="flex gap-2">
            <Input
              placeholder="New habit..."
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
              className="flex-1"
            />
            <Button onClick={handleAddHabit} size="sm">Add</Button>
          </div>
        )}

        {habits.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Start building habits that shape your future!
          </p>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <div key={habit.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isCompletedToday(habit) ? 'default' : 'outline'}
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      style={{ 
                        backgroundColor: isCompletedToday(habit) ? habit.color : undefined,
                        borderColor: habit.color 
                      }}
                      onClick={() => onToggleHabit(habit.id)}
                    >
                      {isCompletedToday(habit) && <Check className="h-4 w-4" />}
                    </Button>
                    <span className="text-sm font-medium">{habit.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      🔥 {habit.streak} day{habit.streak !== 1 ? 's' : ''}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => onDeleteHabit(habit.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {/* Mini Calendar */}
                <div className="flex gap-1 pl-10">
                  {last7Days.map((date) => (
                    <div
                      key={date}
                      className="w-4 h-4 rounded-sm"
                      style={{
                        backgroundColor: habit.completedDates.includes(date) 
                          ? habit.color 
                          : 'hsl(var(--muted))',
                        opacity: habit.completedDates.includes(date) ? 1 : 0.3,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
