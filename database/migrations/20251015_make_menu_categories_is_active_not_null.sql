-- Migration: set is_active NOT NULL DEFAULT 1 on menu_categories
ALTER TABLE menu_categories
  MODIFY COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1;

-- Backfill any NULLs just in case
UPDATE menu_categories SET is_active = 1 WHERE is_active IS NULL;