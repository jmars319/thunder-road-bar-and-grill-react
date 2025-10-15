-- Migration: add job_positions and application_fields tables
-- Date: 2025-10-15

CREATE TABLE IF NOT EXISTS job_positions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS application_fields (
  id INT PRIMARY KEY AUTO_INCREMENT,
  field_name VARCHAR(150) NOT NULL,
  field_type VARCHAR(50) DEFAULT 'text',
  required BOOLEAN DEFAULT FALSE,
  options TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: This migration is additive. Existing job_applications.position (VARCHAR)
-- remains in place to preserve historical data. We can later migrate values to
-- a position_id foreign key if desired.
