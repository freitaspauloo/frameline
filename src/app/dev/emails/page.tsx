import Link from "next/link";

import {
  NURTURE_ISSUES,
  nurtureUnsubscribeUrl,
  renderNurtureEmail,
} from "@/lib/nurture";

export const dynamic = "force-dynamic";

const PREVIEW_EMAIL = "preview@frameline.ai";

type Search = Promise<{ issue?: string }>;

export default async function DevEmailsPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const params = await searchParams;
  const selected =
    NURTURE_ISSUES.find((issue) => issue.id === params.issue) ??
    NURTURE_ISSUES[0];

  if (!selected) {
    return <p>No nurture issues defined.</p>;
  }

  const unsubscribeUrl = nurtureUnsubscribeUrl(
    PREVIEW_EMAIL,
    "https://frameline.ai",
  );
  const rendered = renderNurtureEmail(selected, {
    email: PREVIEW_EMAIL,
    unsubscribeUrl,
    baseUrl: "https://frameline.ai",
  });

  return (
    <div className="min-h-dvh bg-[#FCFCFD] text-[#0B0D12]">
      <header className="border-b border-[#E6E8EC] bg-white px-6 py-5">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-[#2D6BFF] uppercase">
          Dev · Resend templates
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-instrument)] text-3xl tracking-tight">
          Biweekly notes
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B7280]">
          Four rotating templates, first send 15 days after signup, then every
          15 days. Preview uses{" "}
          <span className="font-mono text-[#0B0D12]">frameline.ai</span> links.
          Cron: <span className="font-mono">GET /api/cron/nurture</span>
        </p>
        <nav className="mt-5 flex flex-wrap gap-2">
          {NURTURE_ISSUES.map((issue) => {
            const active = issue.id === selected.id;
            return (
              <Link
                className={
                  active
                    ? "border border-[#2D6BFF] bg-[#2D6BFF] px-3 py-1.5 text-[11px] font-semibold tracking-widest text-white uppercase"
                    : "border border-[#E6E8EC] bg-white px-3 py-1.5 text-[11px] font-semibold tracking-widest text-[#6B7280] uppercase hover:border-[#2D6BFF] hover:text-[#2D6BFF]"
                }
                href={`/dev/emails?issue=${issue.id}`}
                key={issue.id}
              >
                {String(issue.number).padStart(2, "0")} · {issue.id}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="grid gap-8 px-6 py-8 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
        <aside className="space-y-4 text-sm leading-relaxed text-[#6B7280]">
          <p>
            <span className="font-medium text-[#0B0D12]">Subject</span>
            <br />
            {selected.subject}
          </p>
          <p>
            <span className="font-medium text-[#0B0D12]">Preheader</span>
            <br />
            {selected.preheader}
          </p>
          <p>
            <span className="font-medium text-[#0B0D12]">CTA</span>
            <br />
            {selected.ctaLabel} → {selected.path}
          </p>
          <p className="text-[12px]">
            Enrolled on account signup and waitlist. Welcome mail stays on the
            Resend <span className="font-mono">user.signed_up</span> automation.
          </p>
        </aside>
        <div className="overflow-hidden border border-[#E6E8EC] bg-[#F7F8FA]">
          <iframe
            className="h-[900px] w-full bg-[#FCFCFD]"
            srcDoc={rendered.html}
            title={selected.subject}
          />
        </div>
      </div>
    </div>
  );
}
