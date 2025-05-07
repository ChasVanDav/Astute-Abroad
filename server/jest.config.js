export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest", // Use Babel to transform JavaScript files
  },
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "routes/**/*.js",
    "db.js",
    "logger.js",
    "!**/node_modules/**",
    "app.js",
  ],
}
