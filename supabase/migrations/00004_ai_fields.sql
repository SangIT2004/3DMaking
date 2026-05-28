-- Bổ sung trường scad_code và prompt vào bảng entities cho luồng Text-to-3D mới
ALTER TABLE entities
  ADD COLUMN IF NOT EXISTS scad_code TEXT,
  ADD COLUMN IF NOT EXISTS prompt TEXT;

-- Bảng ai_logs đã có sẵn, bổ sung scad_code để lưu trữ thay cho file glb
ALTER TABLE ai_logs
  ADD COLUMN IF NOT EXISTS scad_code TEXT;
