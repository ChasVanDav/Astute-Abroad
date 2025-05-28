import dotenv from "dotenv"
import pg from "pg"

// local development configuraton

dotenv.config()
const { Pool } = pg

const connectionOptions = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
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

// deployment configuration
// dotenv.config()
// const { Pool } = pg

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false, // Required for Render PostgreSQL
//   },
// })

// pool
//   .connect()
//   .then(() => {
//     console.log("✅ Connected to database via DATABASE_URL")
//   })
//   .catch((err) => {
//     console.error("❌ Error connecting to the database:", err.stack)
//   })

export default pool
