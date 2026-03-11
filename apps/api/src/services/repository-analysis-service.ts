import {
  analyses,
  db,
  eq,
  repositories,
  users
} from "@acme/db";
import type { AnalysisJobPayload } from "@acme/queue";
import { AppError } from "../lib/errors.js";
import { analyzeRepository } from "./analysis-service.js";
import { getIssues, getReadme, getRepository } from "./github-service.js";

const SYSTEM_USER_GITHUB_ID = "kaizen-system";

export function parseGitHubRepositoryUrl(repoUrl: string) {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(repoUrl);
  } catch (error) {
    throw new AppError("Invalid repository URL", 400, error);
  }

  if (parsedUrl.hostname !== "github.com") {
    throw new AppError("Repository URL must point to github.com", 400);
  }

  const segments = parsedUrl.pathname.split("/").filter(Boolean);

  if (segments.length < 2) {
    throw new AppError("Repository URL must include owner and repository name", 400);
  }

  return {
    owner: segments[0],
    repo: segments[1].replace(/\.git$/, "")
  };
}

async function getOrCreateSystemUser() {
  const existingUser = await db.select().from(users).where(eq(users.githubId, SYSTEM_USER_GITHUB_ID)).limit(1);

  if (existingUser[0]) {
    return existingUser[0];
  }

  const [createdUser] = await db
    .insert(users)
    .values({
      githubId: SYSTEM_USER_GITHUB_ID,
      username: "kaizen-bot",
      email: "bot@kaizen.local",
      onboardingCompleted: true
    })
    .returning();

  return createdUser;
}

async function upsertRepositoryRecord(payload: AnalysisJobPayload) {
  const existingRepository = await db
    .select()
    .from(repositories)
    .where(eq(repositories.githubRepoId, String(payload.repository.id)))
    .limit(1);

  if (existingRepository[0]) {
    const [updatedRepository] = await db
      .update(repositories)
      .set({
        fullName: payload.repository.fullName,
        defaultBranch: payload.repository.defaultBranch,
        primaryLanguage: payload.repository.primaryLanguage,
        openIssuesCount: payload.repository.openIssuesCount,
        updatedAt: new Date()
      })
      .where(eq(repositories.id, existingRepository[0].id))
      .returning();

    return updatedRepository;
  }

  const systemUser = await getOrCreateSystemUser();

  const [createdRepository] = await db
    .insert(repositories)
    .values({
      ownerId: systemUser.id,
      githubRepoId: String(payload.repository.id),
      fullName: payload.repository.fullName,
      defaultBranch: payload.repository.defaultBranch,
      primaryLanguage: payload.repository.primaryLanguage,
      openIssuesCount: payload.repository.openIssuesCount
    })
    .returning();

  return createdRepository;
}

export async function prepareRepositoryAnalysisJob(repoUrl: string): Promise<AnalysisJobPayload> {
  const { owner, repo } = parseGitHubRepositoryUrl(repoUrl);
  const [repository, readme, issues] = await Promise.all([
    getRepository(owner, repo),
    getReadme(owner, repo),
    getIssues(owner, repo)
  ]);

  return {
    owner,
    repo,
    repoUrl,
    repository,
    readme,
    issues
  };
}

export async function processRepositoryAnalysisJob(jobData: AnalysisJobPayload) {
  const repositoryRecord = await upsertRepositoryRecord(jobData);

  const [createdAnalysis] = await db
    .insert(analyses)
    .values({
      repositoryId: repositoryRecord.id,
      queueJobId: jobData.queueJobId,
      status: "processing",
      metadata: {
        repoUrl: jobData.repoUrl
      }
    })
    .returning();

  try {
    const result = await analyzeRepository({
      repoName: jobData.repository.fullName,
      description: jobData.repository.description,
      readme: jobData.readme,
      issues: jobData.issues
    });

    const [updatedAnalysis] = await db
      .update(analyses)
      .set({
        status: "completed",
        summary: result.summary,
        architecture: result.architecture,
        setupGuide: result.setupGuide,
        contributionAreas: result.contributionAreas,
        beginnerFriendlyIssueCount: result.contributionAreas.length,
        metadata: {
          repoUrl: jobData.repoUrl,
          issuesAnalyzed: jobData.issues.length
        },
        updatedAt: new Date()
      })
      .where(eq(analyses.id, createdAnalysis.id))
      .returning();

    return updatedAnalysis;
  } catch (error) {
    await db
      .update(analyses)
      .set({
        status: "failed",
        metadata: {
          repoUrl: jobData.repoUrl,
          error: error instanceof Error ? error.message : "Unknown analysis failure"
        },
        updatedAt: new Date()
      })
      .where(eq(analyses.id, createdAnalysis.id));

    throw error;
  }
}
