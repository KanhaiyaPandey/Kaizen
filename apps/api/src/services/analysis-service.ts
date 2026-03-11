import OpenAI from "openai";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";
import type { GitHubIssue } from "./github-service.js";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY
});

export interface RepositoryAnalysisInput {
  repoName: string;
  description: string | null;
  readme: string;
  issues: GitHubIssue[];
}

export interface RepositoryAnalysisResult {
  summary: string;
  architecture: string;
  setupGuide: string;
  contributionAreas: string[];
}

function parseJsonObject(content: string): RepositoryAnalysisResult {
  try {
    return JSON.parse(content) as RepositoryAnalysisResult;
  } catch (error) {
    throw new AppError("OpenAI returned invalid JSON", 502, error);
  }
}

export async function analyzeRepository(
  data: RepositoryAnalysisInput
): Promise<RepositoryAnalysisResult> {
  try {
    const completion = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You analyze GitHub repositories for contributors. Return valid JSON only with keys summary, architecture, setupGuide, contributionAreas."
        },
        {
          role: "user",
          content: JSON.stringify({
            instruction:
              "Analyze this GitHub repository and generate: 1. Project summary 2. Architecture overview 3. Setup instructions 4. Beginner-friendly contribution areas",
            repository: data
          })
        }
      ]
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new AppError("OpenAI returned an empty response", 502);
    }

    const parsed = parseJsonObject(content);

    return {
      summary: parsed.summary,
      architecture: parsed.architecture,
      setupGuide: parsed.setupGuide,
      contributionAreas: parsed.contributionAreas ?? []
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("OpenAI analysis failed", 502, error);
  }
}
