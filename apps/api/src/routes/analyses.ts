import { Router } from "express";
import { analyses, db, eq } from "@acme/db";

export const analysesRouter = Router();

analysesRouter.get("/:id", async (req, res) => {
  const analysisId = req.params.id;
  const rows = await db.select().from(analyses).where(eq(analyses.id, analysisId)).limit(1);

  if (rows[0]) {
    return res.json(rows[0]);
  }

  const queuedRows = await db
    .select()
    .from(analyses)
    .where(eq(analyses.queueJobId, analysisId))
    .limit(1);

  if (!queuedRows[0]) {
    return res.status(404).json({ error: "Analysis not found" });
  }

  return res.json(queuedRows[0]);
});
