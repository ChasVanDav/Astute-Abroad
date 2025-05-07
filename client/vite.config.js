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
      all: false,
      exclude: [
        "node_modules/",
        "dist/",
        "vite.config.*",
        "babel.config.*",
        "postcss.config.*",
        "tailwindcss.config.*",
      ],
    },
  },
  server: {
    historyApiFallback: true,
  },
})
