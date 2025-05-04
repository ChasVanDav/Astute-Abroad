import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.js",
    coverage: {
      reporter: ["text", "html", "lcov"], // 'text' = terminal, 'html' = detailed HTML view
      all: true, // include files without tests
      exclude: ["node_modules/", "vite.config.*", "dist/"],
    },
  },
  server: {
    historyApiFallback: true,
  },
})
