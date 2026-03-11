import { Router } from "express";
import { db, desc, repositories } from "@acme/db";

export const repositoriesRouter = Router();

repositoriesRouter.get("/", async (_req, res) => {
  const rows = await db.select().from(repositories).orderBy(desc(repositories.createdAt)).limit(20);
  res.json(rows);
});
