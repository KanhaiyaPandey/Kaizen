import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import IORedis from "ioredis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({
  path: path.resolve(__dirname, "../../../.env")
});

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is required");
}

const parsedRedisUrl = new URL(redisUrl);
const requiresTls =
  parsedRedisUrl.protocol === "rediss:" || parsedRedisUrl.hostname.endsWith(".upstash.io");

export const redisConnectionOptions = {
  host: parsedRedisUrl.hostname,
  port: Number(parsedRedisUrl.port || "6379"),
  username: parsedRedisUrl.username || undefined,
  password: parsedRedisUrl.password || undefined,
  maxRetriesPerRequest: null,
  tls: requiresTls ? {} : undefined
};

let redisConnection: IORedis | undefined;

export function getRedisConnection() {
  if (!redisConnection) {
    redisConnection = new IORedis(redisConnectionOptions);
  }

  return redisConnection;
}

export { redisConnection };
