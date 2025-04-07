import pool from "./db.js"

const seedUsers = async () => {
  try {
    const query = `
      INSERT INTO users (firebase_uid, email)
      VALUES 
        ('uid_abc123', 'user1@example.com'),
        ('uid_def456', 'user2@example.com'),
        ('uid_ghi789', 'user3@example.com')
      ON CONFLICT (firebase_uid) DO NOTHING;
    `

    await pool.query(query)
    console.log("✅ Users table seeded!")
  } catch (err) {
    console.error("❌ Error seeding users:", err)
  } finally {
    await pool.end() // Close connection
  }
}

seedUsers()
