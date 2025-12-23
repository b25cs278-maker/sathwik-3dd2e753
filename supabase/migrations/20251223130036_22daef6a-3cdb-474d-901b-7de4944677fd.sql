-- Create task evaluations table for storing AI evaluation history
CREATE TABLE public.task_evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES public.task_submissions(id) ON DELETE CASCADE,
  
  -- Scoring data
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  rubric_scores JSONB NOT NULL DEFAULT '{}',
  
  -- Feedback
  improvement_points JSONB NOT NULL DEFAULT '[]',
  summary TEXT,
  
  -- Metadata
  evaluated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  model_used TEXT DEFAULT 'google/gemini-2.5-flash',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.task_evaluations ENABLE ROW LEVEL SECURITY;

-- Users can view their own evaluations
CREATE POLICY "Users can view their own evaluations"
  ON public.task_evaluations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create evaluations for themselves
CREATE POLICY "Users can create their own evaluations"
  ON public.task_evaluations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all evaluations
CREATE POLICY "Admins can view all evaluations"
  ON public.task_evaluations
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_task_evaluations_user_id ON public.task_evaluations(user_id);
CREATE INDEX idx_task_evaluations_task_id ON public.task_evaluations(task_id);
CREATE INDEX idx_task_evaluations_evaluated_at ON public.task_evaluations(evaluated_at DESC);