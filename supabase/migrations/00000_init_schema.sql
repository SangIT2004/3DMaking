-- Create public users table (profiles)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  room_type TEXT,
  environment_settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create entities table
CREATE TABLE IF NOT EXISTS public.entities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL,
  position JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}'::jsonb,
  rotation JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}'::jsonb,
  scale JSONB DEFAULT '{"x": 1, "y": 1, "z": 1}'::jsonb,
  color VARCHAR(20),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create room_connections table
CREATE TABLE IF NOT EXISTS public.room_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  to_room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  door_entity_id UUID REFERENCES public.entities(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ai_logs table
CREATE TABLE IF NOT EXISTS public.ai_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  result_url TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile."
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for projects
CREATE POLICY "Users can view their own projects."
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert their own projects."
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects."
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects."
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for rooms (Access via project_id)
CREATE POLICY "Users can view rooms of their projects."
  ON public.rooms FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects WHERE projects.id = rooms.project_id AND (projects.user_id = auth.uid() OR projects.is_public = true)
  ));

CREATE POLICY "Users can insert rooms to their projects."
  ON public.rooms FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update rooms of their projects."
  ON public.rooms FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete rooms of their projects."
  ON public.rooms FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.user_id = auth.uid()
  ));

-- RLS Policies for entities (Access via room_id -> project_id)
CREATE POLICY "Users can view entities of their rooms."
  ON public.entities FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.rooms
    JOIN public.projects ON rooms.project_id = projects.id
    WHERE rooms.id = entities.room_id AND (projects.user_id = auth.uid() OR projects.is_public = true)
  ));

CREATE POLICY "Users can insert entities to their rooms."
  ON public.entities FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.rooms
    JOIN public.projects ON rooms.project_id = projects.id
    WHERE rooms.id = room_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update entities of their rooms."
  ON public.entities FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.rooms
    JOIN public.projects ON rooms.project_id = projects.id
    WHERE rooms.id = room_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete entities of their rooms."
  ON public.entities FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.rooms
    JOIN public.projects ON rooms.project_id = projects.id
    WHERE rooms.id = room_id AND projects.user_id = auth.uid()
  ));

-- RLS Policies for room_connections
CREATE POLICY "Users can view room connections of their projects."
  ON public.room_connections FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.rooms
    JOIN public.projects ON rooms.project_id = projects.id
    WHERE rooms.id = room_connections.from_room_id AND (projects.user_id = auth.uid() OR projects.is_public = true)
  ));

CREATE POLICY "Users can manage room connections of their projects."
  ON public.room_connections FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.rooms
    JOIN public.projects ON rooms.project_id = projects.id
    WHERE rooms.id = room_connections.from_room_id AND projects.user_id = auth.uid()
  ));

-- RLS Policies for ai_logs
CREATE POLICY "Users can view their own AI logs."
  ON public.ai_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI logs."
  ON public.ai_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
