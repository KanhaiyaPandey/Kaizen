"use client";

import { useEffect, useState } from "react";
import { AnalysisResult } from "./AnalysisResult";
import { LoadingState } from "./LoadingState";
import { getAnalysis, type RepositoryAnalysis } from "../lib/api";

interface AnalysisStatusClientProps {
  id: string;
}

export function AnalysisStatusClient({ id }: AnalysisStatusClientProps) {
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const nextAnalysis = await getAnalysis(id);

        if (cancelled) {
          return;
        }

        setAnalysis(nextAnalysis);
        setError(null);
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Unable to load analysis.");
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!analysis || (analysis.status !== "processing" && analysis.status !== "queued")) {
      return;
    }

    const interval = window.setInterval(() => {
      void (async () => {
        try {
          const nextAnalysis = await getAnalysis(id);
          setAnalysis(nextAnalysis);
          setError(null);
        } catch (loadError) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load analysis.");
        }
      })();
    }, 3000);

    return () => window.clearInterval(interval);
  }, [analysis?.status, id]);

  if (error) {
    return (
      <div className="rounded-[2rem] border border-[color:rgba(165,63,43,0.18)] bg-[color:rgba(165,63,43,0.08)] p-8">
        <p className="text-sm font-semibold tracking-[0.18em] text-[var(--danger)] uppercase">
          Error
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Unable to load analysis
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--danger)]">{error}</p>
      </div>
    );
  }

  if (!analysis || analysis.status === "processing" || analysis.status === "queued") {
    return (
      <LoadingState
        title={analysis?.status === "queued" ? "Analysis queued" : "Analysis in progress"}
        description="Kaizen is polling the backend every 3 seconds and will render the results automatically when the job finishes."
      />
    );
  }

  if (analysis.status === "failed") {
    return (
      <div className="rounded-[2rem] border border-[color:rgba(165,63,43,0.18)] bg-[color:rgba(165,63,43,0.08)] p-8">
        <p className="text-sm font-semibold tracking-[0.18em] text-[var(--danger)] uppercase">
          Analysis failed
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          The repository could not be analyzed
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--danger)]">
          The backend marked this analysis as failed. Try submitting the repository again.
        </p>
      </div>
    );
  }

  return <AnalysisResult analysis={analysis} />;
}
