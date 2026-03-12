export type AnalysisStatus = "queued" | "processing" | "completed" | "failed";

export interface AnalyzeResponse {
  jobId: string;
  status: "queued";
}

export interface RepositoryAnalysis {
  id: string;
  status: AnalysisStatus;
  summary: string;
  architecture: string;
  setupGuide: string;
  contributionAreas: string[];
}

interface ApiErrorResponse {
  error?: string;
}

const DEFAULT_API_URL = "http://localhost:4000";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
}

async function readErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as ApiErrorResponse;
    return payload.error ?? `Request failed with status ${response.status}.`;
  } catch {
    return `Request failed with status ${response.status}.`;
  }
}

export function isValidGitHubRepoUrl(value: string) {
  return /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(value.trim());
}

export async function analyzeRepository(repoUrl: string): Promise<AnalyzeResponse> {
  const response = await fetch(`${getApiBaseUrl()}/repositories/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ repoUrl })
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as AnalyzeResponse;
}

export async function getAnalysis(id: string): Promise<RepositoryAnalysis> {
  const response = await fetch(`${getApiBaseUrl()}/analyses/${id}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as RepositoryAnalysis;
}
