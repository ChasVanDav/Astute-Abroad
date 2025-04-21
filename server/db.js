import dotenv from "dotenv"
import pg from "pg"

dotenv.config()
const { Pool } = pg

const connectionOptions = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
}

const pool = new Pool(connectionOptions)

pool
  .connect()
  .then(() => {
    console.log(
      `✅ Connected to database "${connectionOptions.database}" at ${connectionOptions.host}:${connectionOptions.port}`
    )
  })
  .catch((err) => {
    console.error("❌ Error connecting to the database:", err.stack)
  })

export default pool
