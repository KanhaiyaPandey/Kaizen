import { AppError } from "../lib/errors.js";

const GITHUB_API_BASE_URL = "https://api.github.com";

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  description: string | null;
  defaultBranch: string;
  primaryLanguage: string | null;
  openIssuesCount: number;
  htmlUrl: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  htmlUrl: string;
  state: string;
  labels: string[];
}

function getGitHubHeaders() {
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "kaizen-ai-contributor-assistant"
  };
}

async function githubRequest<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
    headers: getGitHubHeaders()
  });

  if (!response.ok) {
    throw new AppError(`GitHub API request failed for ${path}`, response.status, {
      status: response.status
    });
  }

  return (await response.json()) as T;
}

export async function getRepository(owner: string, repo: string): Promise<GitHubRepository> {
  const response = await githubRequest<{
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    default_branch: string;
    language: string | null;
    open_issues_count: number;
    html_url: string;
    owner: { login: string };
  }>(`/repos/${owner}/${repo}`);

  return {
    id: response.id,
    name: response.name,
    fullName: response.full_name,
    owner: response.owner.login,
    description: response.description,
    defaultBranch: response.default_branch,
    primaryLanguage: response.language,
    openIssuesCount: response.open_issues_count,
    htmlUrl: response.html_url
  };
}

export async function getReadme(owner: string, repo: string) {
  const response = await githubRequest<{
    content: string;
    encoding: string;
  }>(`/repos/${owner}/${repo}/readme`);

  if (response.encoding !== "base64") {
    throw new AppError("Unsupported README encoding from GitHub", 502);
  }

  return Buffer.from(response.content, "base64").toString("utf-8");
}

export async function getIssues(owner: string, repo: string): Promise<GitHubIssue[]> {
  const response = await githubRequest<
    Array<{
      id: number;
      number: number;
      title: string;
      body: string | null;
      html_url: string;
      state: string;
      labels: Array<{ name: string }>;
      pull_request?: Record<string, unknown>;
    }>
  >(`/repos/${owner}/${repo}/issues?state=open&per_page=10`);

  return response
    .filter((issue) => !issue.pull_request)
    .slice(0, 10)
    .map((issue) => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body ?? "",
      htmlUrl: issue.html_url,
      state: issue.state,
      labels: issue.labels.map((label) => label.name)
    }));
}
