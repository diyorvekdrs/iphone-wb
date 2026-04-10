/**
 * Load server/data/iphone_comparison.csv into `iphone_specs`.
 * Usage: node server/scripts/import-iphone-specs.mjs [path/to.csv]
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'csv-parse/sync'
import mysql from 'mysql2/promise'
import { modelNameToSlug } from '../utils/modelSlug.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'itball2',
} = process.env

async function main() {
  const csvPath =
    process.argv[2] ?? path.join(__dirname, '../data/iphone_comparison.csv')
  if (!fs.existsSync(csvPath)) {
    console.error('CSV not found:', csvPath)
    process.exit(1)
  }

  const raw = fs.readFileSync(csvPath, 'utf8')
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
  })

  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  })

  let n = 0
  for (const row of rows) {
    const model = row.Model
    if (!model) continue
    const slug = modelNameToSlug(model)
    const vals = [
      slug,
      model,
      row['Screen Size'] ?? null,
      row.Chip ?? null,
      row['Battery (Video Hours)'] != null ? String(row['Battery (Video Hours)']) : null,
      row['Frame Material'] ?? null,
      row['Water Resistance'] ?? null,
      row.ProMotion ?? null,
      row['Dynamic Island'] ?? null,
      row['Action Button'] ?? null,
      row['Camera Control'] ?? null,
      row['Always-On Display'] ?? null,
      row['Neural Engine'] ?? null,
      row.GPU ?? null,
      row['Front Camera'] ?? null,
      row['Colors Available'] ?? null,
    ]

    await conn.execute(
      `INSERT INTO iphone_specs (
        slug, model_name, screen_size, chip, battery_video_hours,
        frame_material, water_resistance, pro_motion, dynamic_island,
        action_button, camera_control, always_on_display, neural_engine,
        gpu, front_camera, colors_available
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        model_name = VALUES(model_name),
        screen_size = VALUES(screen_size),
        chip = VALUES(chip),
        battery_video_hours = VALUES(battery_video_hours),
        frame_material = VALUES(frame_material),
        water_resistance = VALUES(water_resistance),
        pro_motion = VALUES(pro_motion),
        dynamic_island = VALUES(dynamic_island),
        action_button = VALUES(action_button),
        camera_control = VALUES(camera_control),
        always_on_display = VALUES(always_on_display),
        neural_engine = VALUES(neural_engine),
        gpu = VALUES(gpu),
        front_camera = VALUES(front_camera),
        colors_available = VALUES(colors_available)`,
      vals,
    )
    n += 1
  }

  await conn.end()
  console.log(`Imported ${n} rows into iphone_specs from ${csvPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
