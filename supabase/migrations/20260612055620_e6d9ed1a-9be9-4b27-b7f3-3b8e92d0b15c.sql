
-- 1. Hide answer key column from clients
REVOKE SELECT ON public.quizzes FROM authenticated, anon;
GRANT SELECT (
  id, title, description, category, difficulty, level,
  base_points, time_limit_seconds, is_active, created_by,
  created_at, updated_at
) ON public.quizzes TO authenticated;

-- 2. Force quiz attempts through server-side RPC
REVOKE INSERT, UPDATE, DELETE ON public.quiz_attempts FROM authenticated, anon;

-- 3. Safe quiz fetch for play (strips correctAnswer from each question)
CREATE OR REPLACE FUNCTION public.get_active_quizzes_for_play()
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  category quiz_category,
  difficulty quiz_difficulty,
  level integer,
  base_points integer,
  time_limit_seconds integer,
  questions jsonb,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    q.id, q.title, q.description, q.category, q.difficulty, q.level,
    q.base_points, q.time_limit_seconds,
    COALESCE(
      (SELECT jsonb_agg(elem - 'correctAnswer' - 'correct_answer' - 'acceptableAnswers' - 'explanation')
       FROM jsonb_array_elements(q.questions) elem),
      '[]'::jsonb
    ) AS questions,
    q.created_at
  FROM public.quizzes q
  WHERE q.is_active = true
  ORDER BY q.created_at DESC;
$$;

REVOKE EXECUTE ON FUNCTION public.get_active_quizzes_for_play() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_active_quizzes_for_play() TO authenticated;

-- 4. Server-side quiz grading + attempt insert + points award
CREATE OR REPLACE FUNCTION public.submit_quiz_attempt(
  p_quiz_id uuid,
  p_answers jsonb,
  p_time_taken_seconds integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_quiz RECORD;
  v_questions jsonb;
  v_total int;
  v_correct int := 0;
  v_points int;
  v_attempt_id uuid;
  v_q jsonb;
  v_given jsonb;
  v_idx int;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT id, base_points, time_limit_seconds, questions, is_active
    INTO v_quiz FROM public.quizzes WHERE id = p_quiz_id;
  IF NOT FOUND OR NOT v_quiz.is_active THEN
    RAISE EXCEPTION 'Quiz not found';
  END IF;

  v_questions := v_quiz.questions;
  v_total := jsonb_array_length(v_questions);
  IF v_total = 0 THEN
    RAISE EXCEPTION 'Quiz has no questions';
  END IF;

  IF jsonb_typeof(p_answers) <> 'array' THEN
    RAISE EXCEPTION 'answers must be an array';
  END IF;

  -- Clamp time
  IF p_time_taken_seconds IS NULL OR p_time_taken_seconds < 0 THEN
    p_time_taken_seconds := 0;
  END IF;
  IF p_time_taken_seconds > v_quiz.time_limit_seconds THEN
    p_time_taken_seconds := v_quiz.time_limit_seconds;
  END IF;

  -- Grade
  FOR v_idx IN 0 .. v_total - 1 LOOP
    v_q := v_questions -> v_idx;
    v_given := p_answers -> v_idx;
    IF v_given IS NOT NULL
       AND (v_q ? 'correctAnswer')
       AND (v_q -> 'correctAnswer') = v_given THEN
      v_correct := v_correct + 1;
    END IF;
  END LOOP;

  v_points := FLOOR(v_quiz.base_points::numeric * v_correct / v_total)::int;

  INSERT INTO public.quiz_attempts (
    quiz_id, user_id, score, correct_answers, total_questions,
    time_taken_seconds, points_earned
  ) VALUES (
    p_quiz_id, v_user,
    ROUND(v_correct::numeric * 100 / v_total)::int,
    v_correct, v_total, p_time_taken_seconds, v_points
  ) RETURNING id INTO v_attempt_id;

  UPDATE public.profiles
    SET points = COALESCE(points, 0) + v_points
    WHERE id = v_user;

  INSERT INTO public.activity_logs (user_id, event_type, payload)
  VALUES (v_user, 'quiz_completed', jsonb_build_object(
    'quiz_id', p_quiz_id, 'attempt_id', v_attempt_id,
    'correct', v_correct, 'total', v_total, 'points_earned', v_points
  ));

  RETURN jsonb_build_object(
    'success', true,
    'attempt_id', v_attempt_id,
    'correct_answers', v_correct,
    'total_questions', v_total,
    'score', ROUND(v_correct::numeric * 100 / v_total)::int,
    'points_earned', v_points
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.submit_quiz_attempt(uuid, jsonb, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_quiz_attempt(uuid, jsonb, integer) TO authenticated;
