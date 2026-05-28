-- Enable pgvector extension
create extension if not exists vector;

-- Create assets table
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  thumbnail_url text not null,
  model_url text not null,
  embedding vector(1536), -- For OpenAI text-embedding-3-small
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.assets enable row level security;

-- Public read access
create policy "Allow public read access to assets"
  on public.assets for select
  using (true);

-- Insert initial assets (without embeddings for now)
insert into public.assets (name, category, thumbnail_url, model_url)
values 
('Modern Sofa', 'furniture', 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/sofa/thumbnail.png', 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/sofa/model.gltf'),
('Potted Plant', 'decor', 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/palm-tree/thumbnail.png', 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/palm-tree/model.gltf'),
('Floor Lamp', 'lighting', 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/floor-lamp/thumbnail.png', 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/floor-lamp/model.gltf'),
('Coffee Table', 'furniture', 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/coffee-table/thumbnail.png', 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/coffee-table/model.gltf');

-- Function for vector search
create or replace function match_assets (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  name text,
  category text,
  thumbnail_url text,
  model_url text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    assets.id,
    assets.name,
    assets.category,
    assets.thumbnail_url,
    assets.model_url,
    1 - (assets.embedding <=> query_embedding) as similarity
  from assets
  where 1 - (assets.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;
