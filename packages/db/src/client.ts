import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/users.js";
import { analyses } from "./schema/analyses.js";
import { repositories } from "./schema/repositories.js";

config();

const connectionString = process.env.DATABASE_URL;
const resolvedConnectionString =
  connectionString ?? "postgresql://postgres:postgres@localhost:5432/ai_contributor_assistant";

const sql = postgres(resolvedConnectionString, {
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
