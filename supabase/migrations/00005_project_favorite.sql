ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;
