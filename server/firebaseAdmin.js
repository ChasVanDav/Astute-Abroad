import admin from "firebase-admin"
import dotenv from "dotenv"
import logger from "./logger.js"

dotenv.config()

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export default admin
