import { Queue } from "bullmq";
import { redisConnectionOptions } from "../connection.js";

let analysisQueue: Queue<{ repositoryId: string }> | undefined;

export function getAnalysisQueue() {
  if (!analysisQueue) {
    analysisQueue = new Queue("repository-analysis", {
      connection: redisConnectionOptions,
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 100,
        backoff: {
          type: "exponential",
          delay: 2_000
        }
      }
    });
  }

  return analysisQueue;
}

export { analysisQueue };
