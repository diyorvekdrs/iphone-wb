-- Add `storage_gb` and `color` to products (run once on existing DB).
USE itball2;

ALTER TABLE products
  ADD COLUMN storage_gb INT NULL,
  ADD COLUMN color VARCHAR(64) NULL;

