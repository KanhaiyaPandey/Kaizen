export type AnalysisStatus = "queued" | "processing" | "completed" | "failed";

export interface RepositoryAnalysisSummary {
  repositoryId: string;
  status: AnalysisStatus;
  summary?: string;
  beginnerIssueCount?: number;
}
