"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { analyzeRepository, isValidGitHubRepoUrl } from "../lib/api";

const EXAMPLE_REPO_URL = "https://github.com/vercel/next.js";

export function RepoInput() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState(EXAMPLE_REPO_URL);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isValidGitHubRepoUrl(repoUrl)) {
      setError("Enter a valid GitHub repository URL, for example https://github.com/vercel/next.js.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await analyzeRepository(repoUrl.trim());
        router.push(`/analysis/${result.analysisId}`);
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Unable to start repository analysis."
        );
      }
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="repo-url" className="text-sm font-medium text-[var(--foreground)]">
          GitHub repository URL
        </label>
        <input
          id="repo-url"
          name="repoUrl"
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder={EXAMPLE_REPO_URL}
          value={repoUrl}
          onChange={(event) => setRepoUrl(event.target.value)}
          className="h-14 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 text-base text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[rgba(216,107,45,0.12)]"
        />
      </div>

      {error ? (
        <p className="rounded-2xl border border-[color:rgba(165,63,43,0.18)] bg-[color:rgba(165,63,43,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 text-base font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Analyzing..." : "Analyze"}
      </button>
    </form>
  );
}
