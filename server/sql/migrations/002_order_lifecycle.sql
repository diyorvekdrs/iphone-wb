-- Run on existing databases (new installs already have this from schema.sql).
USE itball2;

UPDATE orders SET status = 'delivered' WHERE status = 'completed';

ALTER TABLE orders
  MODIFY COLUMN status VARCHAR(32) NOT NULL DEFAULT 'placed';

-- Add updated_at if your table does not have it yet (skip if you see "Duplicate column"):
-- ALTER TABLE orders
--   ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
