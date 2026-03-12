import type { RepositoryAnalysis } from "../lib/api";

interface AnalysisResultProps {
  analysis: RepositoryAnalysis;
}

const sectionClasses =
  "rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_18px_60px_rgba(57,35,18,0.08)] backdrop-blur";

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  return (
    <div className="grid gap-4">
      <section className={sectionClasses}>
        <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-[var(--muted)] uppercase">
          Project Summary
        </p>
        <p className="text-base leading-7 text-[var(--foreground)]">{analysis.summary}</p>
      </section>

      <section className={sectionClasses}>
        <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-[var(--muted)] uppercase">
          Architecture Overview
        </p>
        <p className="text-base leading-7 text-[var(--foreground)]">{analysis.architecture}</p>
      </section>

      <section className={sectionClasses}>
        <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-[var(--muted)] uppercase">
          Setup Instructions
        </p>
        <p className="text-base leading-7 text-[var(--foreground)]">{analysis.setupGuide}</p>
      </section>

      <section className={sectionClasses}>
        <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-[var(--muted)] uppercase">
          Contribution Areas
        </p>
        {analysis.contributionAreas.length > 0 ? (
          <ul className="grid gap-3">
            {analysis.contributionAreas.map((area) => (
              <li
                key={area}
                className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm leading-6 text-[var(--foreground)]"
              >
                {area}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm leading-6 text-[var(--muted)]">
            No contribution areas were returned for this analysis.
          </p>
        )}
      </section>
    </div>
  );
}
