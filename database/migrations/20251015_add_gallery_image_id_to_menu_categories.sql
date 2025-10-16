-- Migration: add gallery_image_id to menu_categories and backfill from gallery_image_url
ALTER TABLE menu_categories
  ADD COLUMN gallery_image_id INT NULL DEFAULT NULL;

-- Backfill gallery_image_id by matching existing gallery_image_url to media_library.file_url
UPDATE menu_categories mc
JOIN media_library ml ON mc.gallery_image_url = ml.file_url
SET mc.gallery_image_id = ml.id;

-- Optionally keep gallery_image_url for compatibility (we'll stop writing to it going forward)
-- You can drop it later once frontend is fully migrated.
