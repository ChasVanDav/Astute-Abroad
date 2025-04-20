import admin from "firebase-admin"
import fs from "fs"

const serviceAccount = JSON.parse(
  fs.readFileSync(
    new URL("./astuteabroad-0525-80e19672d343.json", import.meta.url)
  )
)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export default admin
