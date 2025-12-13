import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { Zap, Brain, Shield, TrendingUp } from 'lucide-react';
import { LifeMetrics } from '@/hooks/useLocalStorage';

interface LifeScorePanelProps {
  metrics: LifeMetrics;
  onUpdateMetrics: (metrics: Partial<LifeMetrics>) => void;
}

export function LifeScorePanel({ metrics, onUpdateMetrics }: LifeScorePanelProps) {
  const updateMetric = (key: 'energy' | 'focus' | 'discipline', value: number) => {
    const newMetrics = { ...metrics, [key]: value };
    // Recalculate life score as average
    const lifeScore = Math.round((newMetrics.energy + newMetrics.focus + newMetrics.discipline) / 3);
    onUpdateMetrics({ 
      ...newMetrics, 
      lifeScore,
      lastUpdated: new Date().toISOString() 
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-eco-sun';
    if (score >= 40) return 'text-eco-earth';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Billionaire Mode 🚀';
    if (score >= 80) return 'Peak Performance';
    if (score >= 60) return 'Good Progress';
    if (score >= 40) return 'Room to Grow';
    return 'Time to Level Up';
  };

  return (
    <Card className="eco-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Life Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score */}
        <div className="flex items-center justify-center">
          <ProgressRing progress={metrics.lifeScore} size={120}>
            <div className="text-center">
              <p className={`text-3xl font-bold ${getScoreColor(metrics.lifeScore)}`}>
                {metrics.lifeScore}
              </p>
              <p className="text-xs text-muted-foreground">/ 100</p>
            </div>
          </ProgressRing>
        </div>
        <p className="text-center text-sm font-medium text-muted-foreground">
          {getScoreLabel(metrics.lifeScore)}
        </p>

        {/* Individual Metrics */}
        <div className="space-y-4">
          {/* Energy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-eco-sun" />
                <span className="text-sm font-medium">Energy</span>
              </div>
              <span className="text-sm text-muted-foreground">{metrics.energy}%</span>
            </div>
            <Slider
              value={[metrics.energy]}
              onValueChange={(v) => updateMetric('energy', v[0])}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Focus */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-eco-sky" />
                <span className="text-sm font-medium">Focus</span>
              </div>
              <span className="text-sm text-muted-foreground">{metrics.focus}%</span>
            </div>
            <Slider
              value={[metrics.focus]}
              onValueChange={(v) => updateMetric('focus', v[0])}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Discipline */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-eco-reward" />
                <span className="text-sm font-medium">Discipline</span>
              </div>
              <span className="text-sm text-muted-foreground">{metrics.discipline}%</span>
            </div>
            <Slider
              value={[metrics.discipline]}
              onValueChange={(v) => updateMetric('discipline', v[0])}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUpdateMetrics({ energy: 100, focus: 100, discipline: 100, lifeScore: 100 })}
          >
            Max All
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUpdateMetrics({ energy: 70, focus: 70, discipline: 70, lifeScore: 70 })}
          >
            Reset
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUpdateMetrics({ energy: 50, focus: 50, discipline: 50, lifeScore: 50 })}
          >
            Low Mode
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
