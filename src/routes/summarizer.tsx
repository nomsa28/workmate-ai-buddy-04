import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Copy, RefreshCw, Eraser, Wand2, Check } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { summarizeNotes } from "@/lib/workmate.functions";
import type { SummaryResult } from "@/lib/workmate.shared";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkMate AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into a summary with key decisions, action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — WorkMate AI" },
      {
        property: "og:description",
        content:
          "Turn raw meeting notes into a summary with key decisions, action items and deadlines.",
      },
    ],
  }),
  component: SummarizerPage,
});

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      {items.length ? (
        <ul className="mt-1.5 space-y-1.5 text-sm leading-relaxed">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 text-sm text-muted-foreground">Not provided in the notes.</p>
      )}
    </div>
  );
}

function SummarizerPage() {
  const run = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!notes.trim()) {
      setError("Please paste your meeting notes first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setResult(await run({ data: { notes } }));
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!result) return;
    const text = [
      `Summary:\n${result.summary}`,
      `Key Decisions:\n${result.keyDecisions.join("\n")}`,
      `Action Items:\n${result.actionItems.join("\n")}`,
      `Deadlines:\n${result.deadlines.join("\n")}`,
    ].join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function clear() {
    setNotes("");
    setResult(null);
    setError(null);
  }

  return (
    <AppShell>
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste your notes — WorkMate extracts only what was actually said."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Input
          </h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Meeting notes</Label>
              <Textarea
                id="notes"
                rows={14}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste the raw notes or transcript here…"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={generate} disabled={loading}>
                <Wand2 className="size-4" /> Summarize
              </Button>
              <Button variant="outline" onClick={generate} disabled={loading || !result}>
                <RefreshCw className="size-4" /> Regenerate
              </Button>
              <Button variant="ghost" onClick={clear} disabled={loading}>
                <Eraser className="size-4" /> Clear
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              AI Output
            </h2>
            {result && (
              <Button size="sm" variant="outline" onClick={copy}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </div>
          <div className="mt-4">
            <OutputPanel loading={loading} error={error} empty="Your summary will appear here.">
              {result && (
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Summary
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed">{result.summary}</p>
                  </div>
                  <List title="Key Decisions" items={result.keyDecisions} />
                  <List title="Action Items" items={result.actionItems} />
                  <List title="Deadlines" items={result.deadlines} />
                </div>
              )}
            </OutputPanel>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
