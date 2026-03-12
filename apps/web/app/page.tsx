import { RepoInput } from "../components/RepoInput";

const highlights = [
  "Parse any public GitHub repository into an accessible contributor brief.",
  "Surface architecture, setup steps, and realistic contribution entry points.",
  "Track queued analysis jobs until the backend finishes processing."
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-10 sm:px-8 lg:px-12">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center gap-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold tracking-[0.18em] text-[var(--muted)] uppercase backdrop-blur">
              AI Open Source Contributor Assistant
            </p>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
                Kaizen
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
                AI assistant for open source contributors. Paste a GitHub repository URL and get
                a contributor-focused analysis with setup guidance, architecture context, and
                practical next steps.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map((highlight) => (
                <article
                  key={highlight}
                  className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_18px_50px_rgba(57,35,18,0.08)] backdrop-blur"
                >
                  <p className="text-sm leading-6 text-[var(--foreground)]">{highlight}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_24px_80px_rgba(57,35,18,0.12)] backdrop-blur sm:p-8">
            <div className="mb-6 space-y-2">
              <p className="text-sm font-semibold tracking-[0.18em] text-[var(--muted)] uppercase">
                Analyze a repository
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">Start with a GitHub URL</h2>
              <p className="text-sm leading-6 text-[var(--muted)]">
                Example: `https://github.com/vercel/next.js`
              </p>
            </div>
            <RepoInput />
          </div>
        </div>
      </section>
    </main>
  );
}
