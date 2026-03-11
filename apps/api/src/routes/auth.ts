import { Router } from "express";

export const authRouter = Router();

authRouter.get("/github", (_req, res) => {
  res.json({
    provider: "github",
    message: "Implement GitHub OAuth redirect and callback handlers here."
  });
});
