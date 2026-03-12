import { Job, Queue, Worker } from "bullmq";
import { redisConnectionOptions } from "../connection.js";

export interface AnalysisRepositoryPayload {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  description: string | null;
  defaultBranch: string;
  primaryLanguage: string | null;
  openIssuesCount: number;
  htmlUrl: string;
}

export interface AnalysisIssuePayload {
  id: number;
  number: number;
  title: string;
  body: string;
  htmlUrl: string;
  state: string;
  labels: string[];
}

export interface AnalysisJobPayload {
  analysisId: string;
  repositoryId: string;
  owner: string;
  repo: string;
  repoUrl: string;
  repository: AnalysisRepositoryPayload;
  readme: string;
  issues: AnalysisIssuePayload[];
}

let analysisQueue: Queue<AnalysisJobPayload> | undefined;
let analysisWorker: Worker<AnalysisJobPayload> | undefined;

export function getAnalysisQueue() {
  if (!analysisQueue) {
    analysisQueue = new Queue<AnalysisJobPayload>("repository-analysis", {
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

export function registerAnalysisWorker(
  processor: (job: Job<AnalysisJobPayload>) => Promise<void>
) {
  if (!analysisWorker) {
    analysisWorker = new Worker<AnalysisJobPayload>("repository-analysis", processor, {
      connection: redisConnectionOptions
    });
  }

  return analysisWorker;
}

export type AnalysisJob = Job<AnalysisJobPayload>;

export { analysisQueue };
