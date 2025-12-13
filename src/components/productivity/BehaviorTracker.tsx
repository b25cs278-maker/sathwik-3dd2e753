import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Crown, TrendingUp, Dumbbell, BookOpen, Timer, DollarSign } from 'lucide-react';
import { LifeMetrics, MoneyFlow } from '@/hooks/useLocalStorage';

interface BehaviorTrackerProps {
  metrics: LifeMetrics;
  moneyFlow: MoneyFlow;
  onUpdateMetrics: (metrics: Partial<LifeMetrics>) => void;
  onUpdateMoneyFlow: (flow: Partial<MoneyFlow>) => void;
}

function getBehaviorRating(metrics: LifeMetrics): { rating: string; emoji: string; color: string } {
  const score = (metrics.discipline + metrics.focus + metrics.energy) / 3;
  
  if (score >= 85) {
    return { rating: 'Focused Billionaire', emoji: '🚀', color: 'text-primary' };
  } else if (score >= 70) {
    return { rating: 'Rising Star', emoji: '⭐', color: 'text-eco-sun' };
  } else if (score >= 50) {
    return { rating: 'Average Performer', emoji: '📊', color: 'text-muted-foreground' };
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

export function BehaviorTracker({ metrics, moneyFlow, onUpdateMetrics, onUpdateMoneyFlow }: BehaviorTrackerProps) {
  const behavior = getBehaviorRating(metrics);
  const bodyLevel = getLifeFocusLevel(metrics.body || 50);
  const mindLevel = getLifeFocusLevel(metrics.mind || 50);
  const spiritLevel = getLifeFocusLevel(metrics.spirit || 50);

  const updateLifeFocus = (key: 'body' | 'mind' | 'spirit', value: number) => {
    onUpdateMetrics({ [key]: value, lastUpdated: new Date().toISOString() });
  };

  const updateActivity = (key: 'deepWorkMinutes' | 'workoutMinutes' | 'readingMinutes', delta: number) => {
    const current = metrics[key] || 0;
    onUpdateMetrics({ 
      [key]: Math.max(0, current + delta),
      lastUpdated: new Date().toISOString() 
    });
  };

  return (
    <Card className="eco-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-eco-sun" />
          Behavior & Life Focus
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Behavioral Rating */}
        <div className="text-center p-4 rounded-lg bg-accent/30">
          <p className="text-4xl mb-2">{behavior.emoji}</p>
          <p className={`text-lg font-bold ${behavior.color}`}>{behavior.rating}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Based on your current discipline, focus, and energy
          </p>
        </div>

        {/* Life Focus - Body, Mind, Spirit */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Life Focus Levels
          </h4>
          
          {/* Body */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>💪</span>
                <span className="text-sm">Body</span>
              </div>
              <Badge variant="outline" className="text-xs">{bodyLevel.label}</Badge>
            </div>
            <Slider
              value={[metrics.body || 50]}
              onValueChange={(v) => updateLifeFocus('body', v[0])}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Mind */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>🧠</span>
                <span className="text-sm">Mind</span>
              </div>
              <Badge variant="outline" className="text-xs">{mindLevel.label}</Badge>
            </div>
            <Slider
              value={[metrics.mind || 50]}
              onValueChange={(v) => updateLifeFocus('mind', v[0])}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Spirit */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span className="text-sm">Spirit</span>
              </div>
              <Badge variant="outline" className="text-xs">{spiritLevel.label}</Badge>
            </div>
            <Slider
              value={[metrics.spirit || 50]}
              onValueChange={(v) => updateLifeFocus('spirit', v[0])}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Activity Tracking */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold">Daily Activity Tracking</h4>
          
          {/* Deep Work */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-card">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-primary" />
              <span className="text-sm">Deep Work</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateActivity('deepWorkMinutes', -15)}>-</Button>
              <span className="text-sm font-mono min-w-[60px] text-center">{metrics.deepWorkMinutes || 0} min</span>
              <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateActivity('deepWorkMinutes', 15)}>+</Button>
            </div>
          </div>

          {/* Workout */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-card">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-eco-sun" />
              <span className="text-sm">Workout</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateActivity('workoutMinutes', -15)}>-</Button>
              <span className="text-sm font-mono min-w-[60px] text-center">{metrics.workoutMinutes || 0} min</span>
              <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateActivity('workoutMinutes', 15)}>+</Button>
            </div>
          </div>

          {/* Reading */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-card">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-eco-sky" />
              <span className="text-sm">Reading</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateActivity('readingMinutes', -15)}>-</Button>
              <span className="text-sm font-mono min-w-[60px] text-center">{metrics.readingMinutes || 0} min</span>
              <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateActivity('readingMinutes', 15)}>+</Button>
            </div>
          </div>
        </div>

        {/* Money Flow */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-eco-sun" />
            Money Flow Behavior
          </h4>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-lg bg-primary/10">
              <p className="text-xs text-muted-foreground">Saved</p>
              <p className="text-lg font-bold text-primary">${moneyFlow.saved || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-eco-sun/10">
              <p className="text-xs text-muted-foreground">Invested</p>
              <p className="text-lg font-bold text-eco-sun">${moneyFlow.invested || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-destructive/10">
              <p className="text-xs text-muted-foreground">Spent</p>
              <p className="text-lg font-bold text-destructive">${moneyFlow.spent || 0}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onUpdateMoneyFlow({ saved: (moneyFlow.saved || 0) + 10 })}
            >
              +$10 Saved
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onUpdateMoneyFlow({ invested: (moneyFlow.invested || 0) + 10 })}
            >
              +$10 Invested
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
