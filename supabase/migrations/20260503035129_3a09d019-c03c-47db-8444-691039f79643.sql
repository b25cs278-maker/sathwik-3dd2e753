
-- Make module-resources bucket private (no broad public SELECT exists; serve via signed URLs)
UPDATE storage.buckets SET public = false WHERE id = 'module-resources';

-- Restrict quizzes SELECT to authenticated users only (hide correct answers from anon)
DROP POLICY IF EXISTS "Authenticated users can view active quizzes" ON public.quizzes;
CREATE POLICY "Authenticated users can view active quizzes"
  ON public.quizzes FOR SELECT
  TO authenticated
  USING (is_active = true);
