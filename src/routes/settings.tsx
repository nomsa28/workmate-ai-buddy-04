import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, ResponsibleAiNotice } from "@/components/AppShell";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — WorkMate AI" },
      { name: "description", content: "Set your default email tone and planning preferences." },
      { property: "og:title", content: "Settings — WorkMate AI" },
      {
        property: "og:description",
        content: "Set your default email tone and planning preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [tone, setTone] = useState("Formal");
  const [horizon, setHorizon] = useState("Daily");

  useEffect(() => {
    setTone(localStorage.getItem("wm.tone") ?? "Formal");
    setHorizon(localStorage.getItem("wm.horizon") ?? "Daily");
  }, []);

  return (
    <AppShell>
      <PageHeader title="Settings" description="Preferences for how WorkMate AI works for you." />
      <div className="space-y-6">
        <section className="grid gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Default email tone</Label>
            <Select
              value={tone}
              onValueChange={(v) => {
                setTone(v);
                localStorage.setItem("wm.tone", v);
              }}
            >
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
          <div className="space-y-2">
            <Label>Default planning horizon</Label>
            <Select
              value={horizon}
              onValueChange={(v) => {
                setHorizon(v);
                localStorage.setItem("wm.horizon", v);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-base font-semibold">Responsible AI</h2>
          <ResponsibleAiNotice />
          <p className="text-sm text-muted-foreground">
            WorkMate AI is instructed never to invent facts, decisions or deadlines. When
            information is missing from your input, it will say so instead of guessing.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
