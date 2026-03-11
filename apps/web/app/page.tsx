const pillars = [
  "AI-generated architecture summaries",
  "Repository ingestion and queued analyses",
  "Beginner-friendly issue detection",
  "Maintainer-friendly open-source workflow"
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(239,111,60,0.18),_transparent_40%),linear-gradient(180deg,_#f4efe6_0%,_#fffdfa_100%)] text-ink">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20">
        <div className="max-w-3xl space-y-6">
          <p className="inline-flex rounded-full border border-ink/10 bg-white/60 px-4 py-2 text-sm font-medium tracking-wide">
            Open-source SaaS monorepo starter
          </p>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
            Turn complex GitHub repositories into contributor-ready knowledge.
          </h1>
          <p className="text-lg leading-8 text-ink/75">
            This starter ships with a Next.js frontend, Express API, Drizzle schema package,
            Redis-backed analysis queue, and governance defaults designed for outside contributors.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => (
            <article
              key={pillar}
              className="rounded-3xl border border-ink/10 bg-white/70 p-6 shadow-[0_12px_48px_rgba(16,24,40,0.08)] backdrop-blur"
            >
              <p className="text-base font-medium">{pillar}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
