import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Sparkles, Target, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TaskEvaluationProps {
  taskId: string;
  submissionId: string;
  taskTitle: string;
  taskDescription?: string;
  submissionDetails?: string;
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
      toast.success('Task evaluated successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Evaluation failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (evaluation) {
    const scoreLevel = getScoreLevel(evaluation.overall_score);

    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Evaluation
            </span>
            <Badge className={scoreLevel.color}>
              {evaluation.overall_score}/100 - {scoreLevel.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
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

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Task Evaluation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Get AI-powered feedback on your task completion with rubric-based scoring and actionable improvement suggestions.
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
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Evaluating with AI...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Evaluate My Task
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Powered by AI • Rubric-based scoring • 3 improvement points
        </p>
      </CardContent>
    </Card>
  );
}
