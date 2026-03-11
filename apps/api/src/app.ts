import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { analysesRouter } from "./routes/analyses.js";
import { authRouter } from "./routes/auth.js";
import { healthRouter } from "./routes/health.js";
import { repositoriesRouter } from "./routes/repositories.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({
      name: "AI Open Source Contributor Assistant API",
      version: "0.1.0"
    });
  });

  app.use("/health", healthRouter);
  app.use("/auth", authRouter);
  app.use("/repositories", repositoriesRouter);
  app.use("/analyses", analysesRouter);

  return app;
}
