
-- Drop all existing restrictive policies on coding_logs
DROP POLICY IF EXISTS "Admins can delete coding logs" ON public.coding_logs;
DROP POLICY IF EXISTS "Admins can insert coding logs" ON public.coding_logs;
DROP POLICY IF EXISTS "Admins can update coding logs" ON public.coding_logs;
DROP POLICY IF EXISTS "Anyone can view coding logs" ON public.coding_logs;

-- Recreate as PERMISSIVE policies allowing authenticated users to manage their own logs
CREATE POLICY "Anyone can view coding logs" ON public.coding_logs
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own coding logs" ON public.coding_logs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coding logs" ON public.coding_logs
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own coding logs" ON public.coding_logs
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Fix dsa_problems too
DROP POLICY IF EXISTS "Admins can delete dsa problems" ON public.dsa_problems;
DROP POLICY IF EXISTS "Admins can insert dsa problems" ON public.dsa_problems;
DROP POLICY IF EXISTS "Admins can update dsa problems" ON public.dsa_problems;
DROP POLICY IF EXISTS "Anyone can view dsa problems" ON public.dsa_problems;

CREATE POLICY "Anyone can view dsa problems" ON public.dsa_problems
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own dsa problems" ON public.dsa_problems
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dsa problems" ON public.dsa_problems
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dsa problems" ON public.dsa_problems
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Fix projects too
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;

CREATE POLICY "Anyone can view projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
