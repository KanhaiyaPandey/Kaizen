import dotenv from "dotenv";
import path from "node:path";
import type { AnalysisJob } from "@acme/queue";
import { registerAnalysisWorker } from "@acme/queue";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { processRepositoryAnalysisJob } from "./services/repository-analysis-service.js";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env")
});

const app = createApp();

registerAnalysisWorker(async (job: AnalysisJob) => {
  await processRepositoryAnalysisJob({
    ...job.data,
    queueJobId: String(job.id)
  });
});

app.listen(env.API_PORT, () => {
  console.log(`API listening on http://localhost:${env.API_PORT}`);
});
