import { readFile } from "fs/promises"

const raw = await readFile("./firebaseConfig.json", "utf-8")
const firebaseConfig = JSON.parse(raw)

console.log(JSON.stringify(firebaseConfig))
