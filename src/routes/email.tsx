import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Copy, RefreshCw, Eraser, Wand2, Check } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/workmate.functions";
import type { EmailResult } from "@/lib/workmate.shared";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkMate AI" },
      {
        name: "description",
        content: "Generate professional emails with a formal, friendly or persuasive tone.",
      },
      { property: "og:title", content: "Smart Email Generator — WorkMate AI" },
      {
        property: "og:description",
        content: "Generate professional emails with a formal, friendly or persuasive tone.",
      },
    ],
  }),
  component: EmailPage,
});

type Tone = "Formal" | "Friendly" | "Persuasive";

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [result, setResult] = useState<EmailResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!purpose.trim()) {
      setError("Please describe the purpose or key information of the email.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setResult(await run({ data: { purpose, tone } }));
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function clear() {
    setPurpose("");
    setResult(null);
    setError(null);
  }

  return (
    <AppShell>
      <PageHeader
        title="Smart Email Generator"
        description="Describe what you need to say and pick a tone — WorkMate drafts the email."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Input
          </h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose / key information</Label>
              <Textarea
                id="purpose"
                rows={8}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Ask the vendor for an updated quote for 20 laptops, needed before the 30th."
              />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={generate} disabled={loading}>
                <Wand2 className="size-4" /> Generate email
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
            <OutputPanel
              loading={loading}
              error={error}
              empty="Your generated email will appear here."
            >
              {result && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Subject
                    </p>
                    <p className="mt-1 font-medium">{result.subject}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Body
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                      {result.body}
                    </p>
                  </div>
                </div>
              )}
            </OutputPanel>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
