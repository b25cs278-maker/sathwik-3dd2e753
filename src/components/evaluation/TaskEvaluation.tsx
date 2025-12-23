import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Sparkles, Target, TrendingUp, CheckCircle, AlertCircle, XCircle, Zap, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TaskEvaluationProps {
  taskId: string;
  submissionId: string;
  taskTitle: string;
  taskDescription?: string;
  submissionDetails?: string;
  autoRun?: boolean;
  onEvaluationComplete?: (evaluation: EvaluationResult) => void;
}

interface RubricScores {
  completeness: number;
  quality: number;
  effort: number;
  impact: number;
}

interface EvaluationResult {
  id: string;
  overall_score: number;
  rubric_scores: RubricScores;
  improvement_points: string[];
  summary: string;
  evaluated_at: string;
  status?: 'approved' | 'rejected';
  points_awarded?: number;
  passing_threshold?: number;
}

const RUBRIC_INFO = {
  completeness: { label: 'Completeness', icon: CheckCircle, color: 'text-primary' },
  quality: { label: 'Quality', icon: Sparkles, color: 'text-eco-sun' },
  effort: { label: 'Effort', icon: TrendingUp, color: 'text-eco-sky' },
  impact: { label: 'Impact', icon: Target, color: 'text-eco-reward' },
};

function getScoreLevel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Excellent', color: 'bg-primary text-primary-foreground' };
  if (score >= 70) return { label: 'Good', color: 'bg-eco-sun/20 text-eco-sun' };
  if (score >= 50) return { label: 'Fair', color: 'bg-eco-earth/20 text-eco-earth' };
  return { label: 'Needs Work', color: 'bg-destructive/20 text-destructive' };
}

export function TaskEvaluation({
  taskId,
  submissionId,
  taskTitle,
  taskDescription,
  submissionDetails,
  autoRun = true,
  onEvaluationComplete,
}: TaskEvaluationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runEvaluation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please log in to evaluate tasks');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evaluate-task`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            taskId,
            submissionId,
            taskTitle,
            taskDescription,
            submissionDetails,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Evaluation failed');
      }

      setEvaluation(data.evaluation);
      onEvaluationComplete?.(data.evaluation);
      
      if (data.evaluation.status === 'approved') {
        toast.success(`Task verified! You earned ${data.evaluation.points_awarded} points!`);
      } else {
        toast.error('Task not verified. Score below passing threshold.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Evaluation failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-run evaluation on mount
  useEffect(() => {
    if (autoRun && !evaluation && !isLoading) {
      runEvaluation();
    }
  }, [autoRun]);

  if (evaluation) {
    const scoreLevel = getScoreLevel(evaluation.overall_score);
    const isPassing = evaluation.status === 'approved';

    return (
      <Card className={`border-2 ${isPassing ? 'border-primary/50 bg-primary/5' : 'border-destructive/50 bg-destructive/5'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              AI Verification Result
            </span>
            <div className="flex items-center gap-2">
              {isPassing ? (
                <Badge className="bg-primary text-primary-foreground gap-1">
                  <CheckCircle className="h-3 w-3" /> Verified
                </Badge>
              ) : (
                <Badge className="bg-destructive text-destructive-foreground gap-1">
                  <XCircle className="h-3 w-3" /> Not Verified
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Pass/Fail Status Banner */}
          <div className={`flex items-center justify-between p-4 rounded-lg ${isPassing ? 'bg-primary/10' : 'bg-destructive/10'}`}>
            <div className="flex items-center gap-3">
              {isPassing ? (
                <CheckCircle className="h-8 w-8 text-primary" />
              ) : (
                <XCircle className="h-8 w-8 text-destructive" />
              )}
              <div>
                <p className={`font-semibold ${isPassing ? 'text-primary' : 'text-destructive'}`}>
                  {isPassing ? 'Task Verified Successfully!' : 'Verification Failed'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Score: {evaluation.overall_score}/100 (Minimum: {evaluation.passing_threshold || 50})
                </p>
              </div>
            </div>
            {isPassing && evaluation.points_awarded !== undefined && (
              <div className="flex items-center gap-2 bg-background rounded-lg px-4 py-2">
                <Zap className="h-5 w-5 text-eco-sun" />
                <span className="text-xl font-bold">+{evaluation.points_awarded}</span>
                <span className="text-sm text-muted-foreground">pts</span>
              </div>
            )}
          </div>

          {/* Summary */}
          <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
            {evaluation.summary}
          </p>

          {/* Rubric Scores */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Rubric Scores</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(evaluation.rubric_scores).map(([key, score]) => {
                const info = RUBRIC_INFO[key as keyof typeof RUBRIC_INFO];
                const Icon = info.icon;
                return (
                  <div key={key} className="bg-muted/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`h-4 w-4 ${info.color}`} />
                      <span className="text-xs font-medium">{info.label}</span>
                      <span className="ml-auto text-sm font-bold">{score}</span>
                    </div>
                    <Progress value={score} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Improvement Points */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              How to Improve
            </h4>
            <ul className="space-y-2">
              {evaluation.improvement_points.map((point, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-2 text-sm p-2 bg-primary/5 rounded-lg"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Re-evaluate Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runEvaluation}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Re-evaluating...
              </>
            ) : (
              'Re-evaluate Task'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Loading/Initial state
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-primary" />
          AI Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <div className="text-center">
              <p className="font-medium">AI is verifying your submission...</p>
              <p className="text-sm text-muted-foreground">
                Analyzing evidence and scoring with rubric
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              AI will automatically verify your task completion. Points are only awarded if verification passes (score ≥ 50).
            </p>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button 
              onClick={runEvaluation} 
              disabled={isLoading}
              className="w-full"
            >
              <Shield className="h-4 w-4 mr-2" />
              Verify My Task
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              No bypass • AI-only verification • Score-based points
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
