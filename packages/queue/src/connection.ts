import { config } from "dotenv";
import IORedis from "ioredis";

config();

const redisUrl = process.env.REDIS_URL;
const resolvedRedisUrl = redisUrl ?? "redis://localhost:6379";
const parsedRedisUrl = new URL(resolvedRedisUrl);

export const redisConnectionOptions = {
  host: parsedRedisUrl.hostname,
  port: Number(parsedRedisUrl.port || "6379"),
  username: parsedRedisUrl.username || undefined,
  password: parsedRedisUrl.password || undefined,
  maxRetriesPerRequest: null
};

let redisConnection: IORedis | undefined;

export function getRedisConnection() {
  if (!redisConnection) {
    redisConnection = new IORedis(redisConnectionOptions);
  }

  return redisConnection;
}

export { redisConnection };
