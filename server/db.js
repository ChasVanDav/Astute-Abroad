import dotenv from "dotenv"
import pg from "pg"

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // set to true with { rejectUnauthorized: false } when using remote DB Render
})

export default pool
