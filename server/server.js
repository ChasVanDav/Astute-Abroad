import http from "http"
import app from "./app.js"
import logger from "./logger.js"
import { setupWebSocket } from "./websocket.js"
import { bootstrap } from "./bootstrap.js"

const PORT = process.env.SERVER_PORT || 5000

const server = http.createServer(app)

setupWebSocket(server) // WebSocket setup happens here
bootstrap()

server.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`)
})
