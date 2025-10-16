-- Migration: add gallery_image_url to menu_categories
ALTER TABLE menu_categories
  ADD COLUMN gallery_image_url VARCHAR(255) NULL DEFAULT NULL;

-- Optional: backfill with NULL where missing
UPDATE menu_categories SET gallery_image_url = NULL WHERE gallery_image_url IS NULL;