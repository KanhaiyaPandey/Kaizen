interface LoadingStateProps {
  title?: string;
  description?: string;
}

export function LoadingState({
  title = "Analyzing repository",
  description = "The backend is processing the repository. This page refreshes automatically every 3 seconds."
}: LoadingStateProps) {
  return (
    <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-8 shadow-[0_24px_80px_rgba(57,35,18,0.1)] backdrop-blur">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="h-14 w-14 rounded-full border-4 border-[rgba(216,107,45,0.18)] border-t-[var(--accent)] animate-spin" />
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mx-auto max-w-xl text-sm leading-6 text-[var(--muted)]">{description}</p>
        </div>
      </div>
    </div>
  );
}
