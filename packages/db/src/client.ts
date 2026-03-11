import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/users.js";
import { analyses } from "./schema/analyses.js";
import { repositories } from "./schema/repositories.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({
  path: path.resolve(__dirname, "../../../.env")
});

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const sql = postgres(connectionString, {
  max: 10,
  prepare: false
});

export const db = drizzle(sql, {
  schema: {
    ...schema,
    repositories,
    analyses
  }
});
