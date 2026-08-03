import { readFile } from "node:fs/promises";
import path from "node:path";

type ContactEntry = {
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

async function readContactInbox(): Promise<ContactEntry[]> {
  const contactPath = path.join(process.cwd(), ".data", "contact.json");
  try {
    const raw = await readFile(contactPath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as ContactEntry[]) : [];
  } catch {
    return [];
  }
}

export default async function AdminInboxPage() {
  const entries = await readContactInbox();
  const sorted = [...entries].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Inbox
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">Contact</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Demo submissions from{" "}
          <span className="font-mono">.data/contact.json</span>
          {" — "}
          posted via <span className="font-mono">/contact</span>.
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="border border-border px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">No messages yet.</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Submit the form on <span className="font-mono">/contact</span> to
            append an entry.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border border border-border">
          {sorted.map((entry, index) => (
            <li className="space-y-3 px-4 py-4" key={`${entry.createdAt}-${index}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-foreground">
                  {entry.name}
                </p>
                <time
                  className="font-mono text-[11px] text-muted-foreground"
                  dateTime={entry.createdAt}
                >
                  {entry.createdAt}
                </time>
              </div>
              <p className="font-mono text-[11px] text-muted-foreground">
                {entry.email}
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {entry.message}
              </p>
            </li>
          ))}
        </ul>
      )}

      <p className="border-t border-border pt-6 text-sm text-muted-foreground">
        {sorted.length === 0
          ? "Empty until /api/contact writes the store."
          : `${sorted.length} message${sorted.length === 1 ? "" : "s"} in demo inbox.`}
      </p>
    </div>
  );
}
