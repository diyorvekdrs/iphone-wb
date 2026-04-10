-- Run once if your DB was created before `iphone_specs` existed:
-- mysql -u root -p itball2 < server/sql/migration_add_iphone_specs.sql

USE itball2;

CREATE TABLE IF NOT EXISTS iphone_specs (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(96) NOT NULL,
  model_name VARCHAR(160) NOT NULL,
  screen_size VARCHAR(32) NULL,
  chip VARCHAR(80) NULL,
  battery_video_hours VARCHAR(32) NULL,
  frame_material VARCHAR(80) NULL,
  water_resistance VARCHAR(64) NULL,
  pro_motion VARCHAR(8) NULL,
  dynamic_island VARCHAR(8) NULL,
  action_button VARCHAR(8) NULL,
  camera_control VARCHAR(8) NULL,
  always_on_display VARCHAR(8) NULL,
  neural_engine VARCHAR(64) NULL,
  gpu VARCHAR(160) NULL,
  front_camera VARCHAR(160) NULL,
  colors_available TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_iphone_specs_slug (slug),
  KEY idx_iphone_specs_model (model_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
