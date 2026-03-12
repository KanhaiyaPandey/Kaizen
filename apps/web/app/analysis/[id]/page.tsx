import Link from "next/link";
import { AnalysisStatusClient } from "../../../components/AnalysisStatusClient";

export default async function AnalysisPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen px-6 py-10 sm:px-8 lg:px-12">
      <section className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold tracking-[0.18em] text-[var(--muted)] uppercase">
              Analysis Job
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">Repository Analysis</h1>
            <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Tracking analysis job <span className="font-semibold text-[var(--foreground)]">{id}</span>.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Analyze another repo
          </Link>
        </div>

        <AnalysisStatusClient id={id} />
      </section>
    </main>
  );
}
