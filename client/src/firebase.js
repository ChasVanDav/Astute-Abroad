import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

// console.log(import.meta.env.VITE_REACT_APP_FIREBASE_CONFIG)

const firebaseConfig = {
  apiKey: "AIzaSyAGO2bh8PECz-W9lR37jx0R3oEt2xsawF8",
  authDomain: "astuteabroad-0525.firebaseapp.com",
  projectId: "astuteabroad-0525",
  storageBucket: "astuteabroad-0525.firebasestorage.app",
  messagingSenderId: "167193485736",
  appId: "1:167193485736:web:ce2d766a886665b6317d9d",
  measurementId: "G-0WEP1RY3XB",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth }
