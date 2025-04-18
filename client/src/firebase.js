import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

// console.log(import.meta.env.VITE_REACT_APP_FIREBASE_CONFIG)

const firebaseConfig = JSON.parse(
  import.meta.env.VITE_REACT_APP_FIREBASE_CONFIG
)

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth }
