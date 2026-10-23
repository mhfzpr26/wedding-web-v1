-- ==============================================================================
-- INVATERA WEDDING - SUPABASE STORAGE CONFIGURATION SCRIPT
-- ==============================================================================
-- Jalankan skrip ini di Supabase Dashboard -> SQL Editor
-- untuk membuat bucket dan perizinan (RLS Policy) secara otomatis.
-- ==============================================================================

-- 1. Buat bucket 'wedding-photos' dan 'wedding-audio' (Public Access)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('wedding-photos', 'wedding-photos', true),
  ('wedding-audio', 'wedding-audio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Kebijakan agar foto & audio dapat diakses/dilihat publik (SELECT / Read)
DROP POLICY IF EXISTS "Public Read wedding-photos" ON storage.objects;
CREATE POLICY "Public Read wedding-photos" ON storage.objects
FOR SELECT USING (bucket_id = 'wedding-photos');

DROP POLICY IF EXISTS "Public Read wedding-audio" ON storage.objects;
CREATE POLICY "Public Read wedding-audio" ON storage.objects
FOR SELECT USING (bucket_id = 'wedding-audio');

-- 3. Kebijakan agar portal client & admin dapat mengunggah file (INSERT / Upload)
DROP POLICY IF EXISTS "Public Insert wedding-photos" ON storage.objects;
CREATE POLICY "Public Insert wedding-photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'wedding-photos');

DROP POLICY IF EXISTS "Public Insert wedding-audio" ON storage.objects;
CREATE POLICY "Public Insert wedding-audio" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'wedding-audio');

-- 4. Kebijakan agar dapat menimpa/memperbarui file (UPDATE / Upsert)
DROP POLICY IF EXISTS "Public Update wedding-photos" ON storage.objects;
CREATE POLICY "Public Update wedding-photos" ON storage.objects
FOR UPDATE USING (bucket_id = 'wedding-photos');

DROP POLICY IF EXISTS "Public Update wedding-audio" ON storage.objects;
CREATE POLICY "Public Update wedding-audio" ON storage.objects
FOR UPDATE USING (bucket_id = 'wedding-audio');
