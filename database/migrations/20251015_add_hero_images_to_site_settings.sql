-- Migration: add hero_images column to site_settings
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS hero_images TEXT NULL DEFAULT NULL;

-- Optional: initialize with empty array for existing row
UPDATE site_settings SET hero_images = '[]' WHERE id = 1 AND (hero_images IS NULL OR hero_images = '');
