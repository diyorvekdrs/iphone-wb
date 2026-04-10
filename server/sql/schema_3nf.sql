-- =============================================================================
-- ITBALL2 — Fully Normalised Schema (Third Normal Form)
--
-- Author: Antigravity (Google DeepMind)
-- Purpose: Academic + production-grade schema satisfying 3NF.
--
-- Key changes vs. original schema:
--   1. products      → split into `products` (base info) + `product_variants`
--                      (purchasable config: storage, color, price, stock).
--   2. orders        → removed derived `total_amount` (computed from order_items).
--   3. order_items   → FK now points to `product_variants.id`, not `products.id`.
--   4. iphone_specs  → `colors_available` TEXT replaced by `iphone_colors` table
--                      (one row per color, eliminating a multi-valued attribute).
--   5. Shipping      → preserved as atomic, structured columns (already 1NF-safe).
--   6. users         → unchanged, already in 3NF.
--
-- Run with: mysql -u root -p < sql/schema_3nf.sql
-- =============================================================================

CREATE DATABASE IF NOT EXISTS itball2
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE itball2;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: users
-- All non-key columns depend solely on `id` (PK). No transitive dependencies.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  email         VARCHAR(255)  NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  first_name    VARCHAR(100)  NOT NULL,
  last_name     VARCHAR(100)  NOT NULL,
  role          VARCHAR(32)   NOT NULL DEFAULT 'customer'
                COMMENT 'Values: customer | admin | super_admin',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: products  (base model — identity + marketing information)
--
-- 3NF rationale:
--   • `sku` uniquely identifies a model line (e.g. "iphone-17-pro").
--   • `name`, `description`, `image_url` describe the base model only.
--   • Purchasable configs (storage, color, price, stock) live in product_variants,
--     eliminating the partial dependency that existed when storage+color appeared
--     alongside model-level name/description in a single flat table.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  sku         VARCHAR(64)   NOT NULL
              COMMENT 'Model-level identifier, e.g. iphone-17-pro',
  name        VARCHAR(255)  NOT NULL,
  description TEXT          NULL,
  image_url   VARCHAR(512)  NULL,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_products_sku (sku)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: product_variants  (purchasable configurations)
--
-- 3NF rationale:
--   • Each row represents one unique (product, storage, color) combination.
--   • `price` and `stock` depend on *this specific variant*, not on the base
--     model — resolving the transitive dependency that existed in the old flat
--     `products` table where price/stock depended on (model + config).
--   • UNIQUE constraint on (product_id, storage_gb, color) enforces that the
--     same configuration cannot be inserted twice for one model.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_variants (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  product_id  INT UNSIGNED    NOT NULL,
  storage_gb  INT             NULL     COMMENT 'NULL means size is not applicable',
  color       VARCHAR(64)     NULL     COMMENT 'NULL means sold in one colour',
  price       DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
  stock       INT             NOT NULL DEFAULT 0,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  -- Prevent duplicate variant rows for the same product + configuration
  UNIQUE KEY uq_variant (product_id, storage_gb, color),
  KEY idx_variant_product (product_id),

  CONSTRAINT fk_variants_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: orders
--
-- 3NF rationale:
--   • `total_amount` has been REMOVED — it is a derived value computable as
--     SUM(oi.quantity * oi.unit_price) from `order_items`. Storing it would
--     introduce a transitive dependency: total_amount → order_items data.
--   • Shipping fields are atomic (1NF) and each depends solely on the order PK.
--   • `status` is a single-valued attribute on the order, not on any item.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                  INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id             INT UNSIGNED  NOT NULL,
  status              VARCHAR(32)   NOT NULL DEFAULT 'placed'
                      COMMENT 'placed | paid | processing | shipped | delivered | cancelled',
  -- Structured shipping address (1NF — every field is atomic)
  shipping_full_name  VARCHAR(255)  NOT NULL,
  shipping_phone      VARCHAR(64)   NOT NULL,
  shipping_street     VARCHAR(255)  NOT NULL,
  shipping_city       VARCHAR(100)  NOT NULL,
  shipping_region     VARCHAR(100)  NOT NULL,
  shipping_zip        VARCHAR(32)   NOT NULL,
  shipping_country    VARCHAR(100)  NOT NULL,
  notes               VARCHAR(512)  NULL,
  created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_orders_user   (user_id),
  KEY idx_orders_status (status),

  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: order_items
--
-- 3NF rationale:
--   • FK is now `product_variant_id` → product_variants.id, so the line item
--     references the exact purchasable configuration (storage + colour + price).
--   • `unit_price` is stored at the time of purchase to preserve order history
--     if the variant price changes later — this is a legitimate historical fact
--     about the order event, not a derived value.
--   • No product model name, SKU, or image is stored here; those are always
--     fetched through the FK join chain (order_items → product_variants → products).
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  order_id            INT UNSIGNED    NOT NULL,
  product_variant_id  INT UNSIGNED    NOT NULL,
  quantity            INT UNSIGNED    NOT NULL DEFAULT 1,
  unit_price          DECIMAL(10, 2)  NOT NULL
                      COMMENT 'Price at the time of purchase (snapshot)',

  PRIMARY KEY (id),
  KEY idx_order_items_order   (order_id),
  KEY idx_order_items_variant (product_variant_id),

  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_order_items_variant
    FOREIGN KEY (product_variant_id) REFERENCES product_variants (id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: iphone_specs  (comparison / marketing data)
--
-- 3NF rationale:
--   • `colors_available TEXT` violated 1NF (comma-separated multi-values) and
--     therefore blocked 3NF. It has been removed in favour of `iphone_colors`.
--   • All remaining columns are single-valued and depend only on the `id` PK.
--   • Spec attributes (chip, gpu, neural_engine, etc.) are hardware facts about
--     a specific model slug — no transitive dependency exists between them.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS iphone_specs (
  id                  INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  slug                VARCHAR(96)   NOT NULL
                      COMMENT 'URL-safe model key, e.g. iphone-17-pro',
  model_name          VARCHAR(160)  NOT NULL,
  screen_size         VARCHAR(32)   NULL,
  chip                VARCHAR(80)   NULL,
  battery_video_hours VARCHAR(32)   NULL,
  frame_material      VARCHAR(80)   NULL,
  water_resistance    VARCHAR(64)   NULL,
  pro_motion          VARCHAR(8)    NULL  COMMENT 'YES / NO',
  dynamic_island      VARCHAR(8)    NULL  COMMENT 'YES / NO',
  action_button       VARCHAR(8)    NULL  COMMENT 'YES / NO',
  camera_control      VARCHAR(8)    NULL  COMMENT 'YES / NO',
  always_on_display   VARCHAR(8)    NULL  COMMENT 'YES / NO',
  neural_engine       VARCHAR(64)   NULL,
  gpu                 VARCHAR(160)  NULL,
  front_camera        VARCHAR(160)  NULL,
  -- NOTE: colors_available removed — replaced by normalized `iphone_colors` table
  created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_iphone_specs_slug  (slug),
  KEY        idx_iphone_specs_name (model_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: iphone_colors  (extracted multi-valued attribute from iphone_specs)
--
-- 3NF rationale:
--   • Each colour is an independent, atomic fact about an iPhone model.
--   • Storing multiple colours in one TEXT column violates 1NF; this table
--     resolves that by giving each colour its own row.
--   • The composite UNIQUE constraint ensures the same colour cannot be
--     repeated for the same spec record.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS iphone_colors (
  id       INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  spec_id  INT UNSIGNED  NOT NULL,
  color    VARCHAR(80)   NOT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_iphone_colors (spec_id, color),
  KEY idx_iphone_colors_spec (spec_id),

  CONSTRAINT fk_iphone_colors_spec
    FOREIGN KEY (spec_id) REFERENCES iphone_specs (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- USEFUL VIEW: v_order_totals
-- Computes total_amount dynamically from order_items to replace derived column.
-- Use this in your Node.js queries instead of reading a stored total.
-- =============================================================================
CREATE OR REPLACE VIEW v_order_totals AS
  SELECT
    oi.order_id,
    SUM(oi.quantity * oi.unit_price) AS total_amount
  FROM order_items oi
  GROUP BY oi.order_id;


-- =============================================================================
-- USEFUL VIEW: v_order_details
-- Full order line with product model info — mirrors the join most routes need.
-- =============================================================================
CREATE OR REPLACE VIEW v_order_details AS
  SELECT
    oi.id               AS item_id,
    oi.order_id,
    oi.quantity,
    oi.unit_price,
    pv.id               AS variant_id,
    pv.storage_gb,
    pv.color,
    p.id                AS product_id,
    p.sku               AS product_sku,
    p.name              AS product_name,
    p.image_url         AS product_image_url
  FROM order_items      oi
  JOIN product_variants pv ON pv.id = oi.product_variant_id
  JOIN products         p  ON p.id  = pv.product_id;
