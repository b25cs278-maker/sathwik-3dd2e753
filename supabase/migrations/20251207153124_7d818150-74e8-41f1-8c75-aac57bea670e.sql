-- Create quiz categories enum
CREATE TYPE public.quiz_category AS ENUM ('innovation', 'environment');

-- Create quiz difficulty enum
CREATE TYPE public.quiz_difficulty AS ENUM ('easy', 'medium', 'hard');

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category quiz_category NOT NULL,
  difficulty quiz_difficulty NOT NULL DEFAULT 'easy',
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 5),
  base_points INTEGER NOT NULL DEFAULT 10,
  time_limit_seconds INTEGER NOT NULL DEFAULT 300,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz attempts table
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  time_taken_seconds INTEGER NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Quiz policies
CREATE POLICY "Anyone can view active quizzes" 
ON public.quizzes 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage quizzes" 
ON public.quizzes 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Quiz attempts policies
CREATE POLICY "Users can create their own attempts" 
ON public.quiz_attempts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own attempts" 
ON public.quiz_attempts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all attempts" 
ON public.quiz_attempts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for quiz attempts
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_attempts;