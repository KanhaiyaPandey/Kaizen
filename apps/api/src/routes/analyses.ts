import { Router } from "express";
import { getAnalysisQueue } from "@acme/queue";

export const analysesRouter = Router();

analysesRouter.post("/", async (req, res) => {
  const repositoryId = req.body?.repositoryId as string | undefined;

  if (!repositoryId) {
    return res.status(400).json({ error: "repositoryId is required" });
  }

  const job = await getAnalysisQueue().add("repository-analysis", { repositoryId });

  return res.status(202).json({ jobId: job.id, status: "queued" });
});
