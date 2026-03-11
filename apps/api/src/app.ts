import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { env } from "./config/env.js";
import { AppError } from "./lib/errors.js";
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

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const appError =
      error instanceof AppError ? error : new AppError("Internal server error", 500, error);

    res.status(appError.statusCode).json({
      error: appError.message,
      details: appError.details
    });
  });

  return app;
}
