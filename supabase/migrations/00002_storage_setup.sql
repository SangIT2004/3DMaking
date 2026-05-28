-- Create models bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('models', 'models', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read models
CREATE POLICY "Public Access to Models"
ON storage.objects FOR SELECT
USING (bucket_id = 'models');

-- Allow authenticated users to upload to models
CREATE POLICY "Authenticated Users Upload Models"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'models');

-- Allow users to delete their own project's models (optional but good for cleanup)
CREATE POLICY "Users Manage Models"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'models');
