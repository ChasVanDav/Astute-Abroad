import dotenv from "dotenv"
import pg from "pg"

dotenv.config() // Only load .env file if necessary (for local dev)

const { Pool } = pg

// Detect if running inside Docker
const isDockerEnv = process.env.DOCKER_ENV === "true"

// Define connection options object
let connectionOptions = {}

// Use full connection string if provided (for remote DBs like Render, Heroku, etc.)
if (process.env.DATABASE_URL) {
  console.log(
    `✅ Connected to database via DATABASE_URL: ${process.env.DATABASE_URL}`
  )

  connectionOptions = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  }
} else {
  // Default to environment variables when DATABASE_URL is not provided
  connectionOptions = {
    user: process.env.DB_USER || "your_local_user",
    host: isDockerEnv
      ? "host.docker.internal"
      : process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "astuteabroad",
    password: process.env.DB_PASSWORD || "your_local_password",
    port: process.env.DB_PORT || 5432,
  }
}

const pool = new Pool(connectionOptions)

pool
  .connect()
  .then(() => {
    console.log(
      `✅ Connected to database "${
        connectionOptions.database || process.env.DATABASE_URL
      }" at ${connectionOptions.host || "connection string"}`
    )
  })
  .catch((err) => {
    console.error("❌ Error connecting to the database:", err.stack)
  })

export default pool
