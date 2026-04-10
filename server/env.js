import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
/** Always load repo-root `.env`, even when `node server/index.js` is run from another cwd. */
dotenv.config({ path: path.join(rootDir, '.env') })
