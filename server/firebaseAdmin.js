import admin from "firebase-admin"
import serviceAccount from "./astuteabroad-0525-80e19672d343.json"

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export default admin
