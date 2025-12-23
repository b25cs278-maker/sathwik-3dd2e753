import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { History, TrendingUp, Award } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface EvaluationRecord {
  id: string;
  overall_score: number;
  rubric_scores: {
    completeness: number;
    quality: number;
    effort: number;
    impact: number;
  };
  summary: string;
  evaluated_at: string;
  task_id: string;
}

export function EvaluationHistory() {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('task_evaluations')
        .select('*')
        .eq('user_id', user.id)
        .order('evaluated_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching evaluation history:', error);
      } else {
        // Cast the data to our expected type
        const records = (data || []).map((item: any) => ({
          id: item.id,
          overall_score: item.overall_score,
          rubric_scores: item.rubric_scores as EvaluationRecord['rubric_scores'],
          summary: item.summary,
          evaluated_at: item.evaluated_at,
          task_id: item.task_id,
        }));
        setEvaluations(records);
      }
      setIsLoading(false);
    };

    fetchHistory();
  }, [user]);

  if (!user) {
    return null;
  }

  const averageScore = evaluations.length > 0
    ? Math.round(evaluations.reduce((sum, e) => sum + e.overall_score, 0) / evaluations.length)
    : 0;

  const chartData = [...evaluations]
    .reverse()
    .slice(-10)
    .map((e, index) => ({
      name: `#${index + 1}`,
      score: e.overall_score,
      date: new Date(e.evaluated_at).toLocaleDateString(),
    }));

  const avgRubricScores = evaluations.length > 0
    ? {
        completeness: Math.round(evaluations.reduce((sum, e) => sum + e.rubric_scores.completeness, 0) / evaluations.length),
        quality: Math.round(evaluations.reduce((sum, e) => sum + e.rubric_scores.quality, 0) / evaluations.length),
        effort: Math.round(evaluations.reduce((sum, e) => sum + e.rubric_scores.effort, 0) / evaluations.length),
        impact: Math.round(evaluations.reduce((sum, e) => sum + e.rubric_scores.impact, 0) / evaluations.length),
      }
    : null;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5 text-primary" />
          Evaluation History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : evaluations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>No evaluations yet</p>
            <p className="text-xs">Complete tasks to get AI evaluations</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-primary/10 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">{averageScore}</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold">{evaluations.length}</p>
                <p className="text-xs text-muted-foreground">Evaluations</p>
              </div>
              <div className="bg-eco-sun/10 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-eco-sun">
                  {evaluations.filter(e => e.overall_score >= 70).length}
                </p>
                <p className="text-xs text-muted-foreground">Good+</p>
              </div>
            </div>

            {/* Progress Chart */}
            {chartData.length > 1 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Score Trend
                </h4>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                        formatter={(value: number) => [`${value}/100`, 'Score']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Average Rubric Scores */}
            {avgRubricScores && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Average Rubric Scores</h4>
                <div className="space-y-2">
                  {Object.entries(avgRubricScores).map(([key, score]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-24 capitalize">{key}</span>
                      <Progress value={score} className="flex-1 h-2" />
                      <span className="text-xs font-medium w-8">{score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Evaluations */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recent</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {evaluations.slice(0, 5).map((evaluation) => (
                  <div 
                    key={evaluation.id} 
                    className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground truncate">
                        {evaluation.summary?.slice(0, 50)}...
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(evaluation.evaluated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={evaluation.overall_score >= 70 ? 'default' : 'secondary'}
                      className="ml-2 text-xs"
                    >
                      {evaluation.overall_score}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
