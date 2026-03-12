import { beforeEach, describe, expect, it, vi } from "vitest";
import { analyzeRepositoryHandler } from "../routes/repositories.js";

const { queueAddMock, prepareRepositoryAnalysisJobMock, dbUpdateMock, eqMock } = vi.hoisted(() => ({
  queueAddMock: vi.fn(),
  prepareRepositoryAnalysisJobMock: vi.fn(),
  dbUpdateMock: vi.fn(),
  eqMock: vi.fn()
}));

vi.mock("@acme/queue", () => ({
  getAnalysisQueue: () => ({
    add: queueAddMock
  })
}));

vi.mock("@acme/db", () => ({
  analyses: {
    id: "id"
  },
  db: {
    update: dbUpdateMock
  },
  desc: vi.fn(),
  eq: eqMock,
  repositories: {}
}));

vi.mock("../services/repository-analysis-service.js", () => ({
  prepareRepositoryAnalysisJob: prepareRepositoryAnalysisJobMock
}));

describe("repository analyze endpoint", () => {
  beforeEach(() => {
    queueAddMock.mockReset();
    prepareRepositoryAnalysisJobMock.mockReset();
    dbUpdateMock.mockReset();
    eqMock.mockReset();

    eqMock.mockReturnValue("eq-condition");
    dbUpdateMock.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined)
      })
    });
  });

  it("queues an analysis job for a valid repository URL", async () => {
    prepareRepositoryAnalysisJobMock.mockResolvedValue({
      analysisId: "analysis-123",
      repositoryId: "repository-123",
      owner: "openai",
      repo: "openai-node",
      repoUrl: "https://github.com/openai/openai-node",
      repository: {
        id: 123,
        name: "openai-node",
        fullName: "openai/openai-node",
        owner: "openai",
        description: "OpenAI Node SDK",
        defaultBranch: "main",
        primaryLanguage: "TypeScript",
        openIssuesCount: 10,
        htmlUrl: "https://github.com/openai/openai-node"
      },
      readme: "# OpenAI Node",
      issues: []
    });
    queueAddMock.mockResolvedValue({ id: "job-123" });

    const statusJsonSpy = vi.fn();
    const statusSpy = vi.fn().mockReturnValue({
      json: statusJsonSpy
    });
    const jsonSpy = vi.fn();

    await analyzeRepositoryHandler(
      {
        body: {
          repoUrl: "https://github.com/openai/openai-node"
        }
      },
      {
        status: statusSpy,
        json: jsonSpy
      }
    );

    expect(prepareRepositoryAnalysisJobMock).toHaveBeenCalledWith(
      "https://github.com/openai/openai-node"
    );
    expect(queueAddMock).toHaveBeenCalledWith(
      "repository-analysis",
      expect.objectContaining({
        analysisId: "analysis-123",
        owner: "openai",
        repo: "openai-node"
      })
    );
    expect(statusSpy).toHaveBeenCalledWith(202);
    expect(statusJsonSpy).toHaveBeenCalledWith({
      analysisId: "analysis-123",
      status: "queued"
    });
  });

  it("rejects requests without repoUrl", async () => {
    const statusSpy = vi.fn().mockReturnValue({
      json: vi.fn()
    });
    const jsonSpy = vi.fn();

    await expect(
      analyzeRepositoryHandler(
        {
          body: {}
        },
        {
          status: statusSpy,
          json: jsonSpy
        }
      )
    ).rejects.toThrow("repoUrl is required");
  });
});
