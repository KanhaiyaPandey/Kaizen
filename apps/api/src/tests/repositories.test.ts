import { beforeEach, describe, expect, it, vi } from "vitest";
import { analyzeRepositoryHandler } from "../routes/repositories.js";

const { queueAddMock, prepareRepositoryAnalysisJobMock } = vi.hoisted(() => ({
  queueAddMock: vi.fn(),
  prepareRepositoryAnalysisJobMock: vi.fn()
}));

vi.mock("@acme/queue", () => ({
  getAnalysisQueue: () => ({
    add: queueAddMock
  })
}));

vi.mock("../services/repository-analysis-service.js", () => ({
  prepareRepositoryAnalysisJob: prepareRepositoryAnalysisJobMock
}));

describe("repository analyze endpoint", () => {
  beforeEach(() => {
    queueAddMock.mockReset();
    prepareRepositoryAnalysisJobMock.mockReset();
  });

  it("queues an analysis job for a valid repository URL", async () => {
    prepareRepositoryAnalysisJobMock.mockResolvedValue({
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

    const statusSpy = vi.fn().mockReturnValue({
      json: vi.fn()
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
        owner: "openai",
        repo: "openai-node"
      })
    );
    expect(statusSpy).toHaveBeenCalledWith(202);
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
