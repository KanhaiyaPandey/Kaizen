import { Router } from "express";
import { db, desc, repositories } from "@acme/db";
import { getAnalysisQueue } from "@acme/queue";
import { AppError } from "../lib/errors.js";
import { prepareRepositoryAnalysisJob } from "../services/repository-analysis-service.js";

export const repositoriesRouter = Router();

repositoriesRouter.get("/", async (_req, res) => {
  const rows = await db.select().from(repositories).orderBy(desc(repositories.createdAt)).limit(20);
  res.json(rows);
});

export async function analyzeRepositoryHandler(
  req: { body?: { repoUrl?: string } },
  res: {
    status: (statusCode: number) => { json: (payload: unknown) => void };
    json: (payload: unknown) => void;
  }
) {
  const repoUrl = req.body?.repoUrl?.trim();

  if (!repoUrl) {
    throw new AppError("repoUrl is required", 400);
  }

  const payload = await prepareRepositoryAnalysisJob(repoUrl);

  try {
    const queue = getAnalysisQueue();
    const job = await queue.add("repository-analysis", payload);

    return res.status(202).json({
      jobId: job.id,
      status: "queued"
    });
  } catch (error) {
    throw new AppError("Failed to queue repository analysis", 500, error);
  }
}

repositoriesRouter.post("/analyze", analyzeRepositoryHandler);
