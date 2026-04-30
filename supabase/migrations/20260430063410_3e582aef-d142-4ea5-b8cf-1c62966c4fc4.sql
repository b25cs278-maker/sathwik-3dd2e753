
-- Partners: scope admin-manage policy to authenticated admins only
DROP POLICY IF EXISTS "Admins can manage partners" ON public.partners;
CREATE POLICY "Admins can manage partners"
ON public.partners
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Quizzes: questions JSONB contains correct_answer; require authentication to read.
DROP POLICY IF EXISTS "Anyone can view active quizzes" ON public.quizzes;
CREATE POLICY "Authenticated users can view active quizzes"
ON public.quizzes
FOR SELECT
TO authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage quizzes" ON public.quizzes;
CREATE POLICY "Admins can manage quizzes"
ON public.quizzes
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
