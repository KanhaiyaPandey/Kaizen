const path = require("node:path");
const dotenv = require("dotenv");
const { defineConfig } = require("drizzle-kit");

dotenv.config({
  path: path.resolve(__dirname, "../../.env")
});

module.exports = defineConfig({
  schema: "./src/schema/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || ""
  }
});
