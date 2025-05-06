import admin from "firebase-admin"
import dotenv from "dotenv"
import logger from "./logger.js"

dotenv.config()

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY)
console.log(serviceAccount)

// console.log("Parsed Firebase Admin Key:", serviceAccount)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export default admin
