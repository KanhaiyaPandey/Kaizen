import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  DATABASE_URL: z
    .string()
    .min(1)
    .default("postgresql://postgres:postgres@localhost:5432/ai_contributor_assistant"),
  REDIS_URL: z.string().min(1).default("redis://localhost:6379"),
  GITHUB_CLIENT_ID: z.string().min(1).default("local-github-client-id"),
  GITHUB_CLIENT_SECRET: z.string().min(1).default("local-github-client-secret"),
  GITHUB_WEBHOOK_SECRET: z.string().min(1).default("local-github-webhook-secret"),
  OPENAI_API_KEY: z.string().min(1).default("local-openai-key"),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini")
});

export const env = envSchema.parse(process.env);
