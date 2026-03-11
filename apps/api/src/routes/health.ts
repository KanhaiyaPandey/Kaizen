import { Router } from "express";

export const healthRouter = Router();

export function healthHandler(_req: unknown, res: { json: (body: { ok: true }) => void }) {
  res.json({ ok: true });
}

healthRouter.get("/", healthHandler);
