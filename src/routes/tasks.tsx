import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Plus, Trash2, Wand2, RefreshCw, Eraser } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { planTasks } from "@/lib/workmate.functions";
import type { PlanResult } from "@/lib/workmate.shared";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkMate AI" },
      {
        name: "description",
        content: "Turn your task list into a prioritized daily or weekly schedule.",
      },
      { property: "og:title", content: "AI Task Planner — WorkMate AI" },
      {
        property: "og:description",
        content: "Turn your task list into a prioritized daily or weekly schedule.",
      },
    ],
  }),
  component: TasksPage,
});

type Row = { title: string; deadline: string; priority: string };
const emptyRow: Row = { title: "", deadline: "", priority: "" };

function priorityClass(priority: string) {
  const p = priority.toLowerCase();
  if (p.startsWith("high")) return "bg-destructive/10 text-destructive";
  if (p.startsWith("med")) return "bg-chart-5/20 text-chart-1";
  return "bg-primary/10 text-primary";
}

function TasksPage() {
  const run = useServerFn(planTasks);
  const [rows, setRows] = useState<Row[]>([{ ...emptyRow }]);
  const [horizon, setHorizon] = useState<"Daily" | "Weekly">("Daily");
  const [result, setResult] = useState<PlanResult | null>(null);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(i: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  async function generate() {
    const tasks = rows.filter((r) => r.title.trim());
    if (!tasks.length) {
      setError("Add at least one task before planning.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setResult(await run({ data: { tasks, horizon } }));
      setDone({});
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setRows([{ ...emptyRow }]);
    setResult(null);
    setError(null);
    setDone({});
  }

  return (
    <AppShell>
      <PageHeader
        title="AI Task Planner"
        description="List your tasks — WorkMate prioritizes them into a realistic schedule."
      />
      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Input
          </h2>
          <div className="mt-4 space-y-3">
            {rows.map((row, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[1fr_9rem_9rem_auto]">
                <Input
                  aria-label={`Task ${i + 1} title`}
                  placeholder="Task description"
                  value={row.title}
                  onChange={(e) => update(i, { title: e.target.value })}
                />
                <Input
                  aria-label={`Task ${i + 1} deadline`}
                  type="date"
                  value={row.deadline}
                  onChange={(e) => update(i, { deadline: e.target.value })}
                />
                <Select
                  value={row.priority || "unset"}
                  onValueChange={(v) => update(i, { priority: v === "unset" ? "" : v })}
                >
                  <SelectTrigger aria-label={`Task ${i + 1} priority`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unset">No priority</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove task ${i + 1}`}
                  onClick={() => setRows((p) => (p.length > 1 ? p.filter((_, x) => x !== i) : p))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setRows((p) => [...p, { ...emptyRow }])}>
              <Plus className="size-4" /> Add task
            </Button>

            <div className="flex flex-wrap items-end gap-3 pt-2">
              <div className="space-y-2">
                <Label>Schedule</Label>
                <Select value={horizon} onValueChange={(v) => setHorizon(v as "Daily" | "Weekly")}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={generate} disabled={loading}>
                <Wand2 className="size-4" /> Create plan
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
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            AI Output
          </h2>
          <div className="mt-4">
            <OutputPanel
              loading={loading}
              error={error}
              empty="Your prioritized schedule will appear here."
            >
              {result && (
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{result.overview}</p>
                  <ul className="space-y-3">
                    {result.schedule.map((task, i) => (
                      <li
                        key={i}
                        className={cn(
                          "rounded-xl border border-border p-4 transition-colors",
                          done[i] && "bg-muted/60",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={`task-${i}`}
                            checked={!!done[i]}
                            onCheckedChange={(v) => setDone((p) => ({ ...p, [i]: !!v }))}
                            className="mt-1"
                          />
                          <div className="min-w-0 flex-1">
                            <label
                              htmlFor={`task-${i}`}
                              className={cn(
                                "font-medium",
                                done[i] && "text-muted-foreground line-through",
                              )}
                            >
                              {task.title}
                            </label>
                            <p className="mt-1 text-sm text-muted-foreground">{task.reason}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                              <span
                                className={cn(
                                  "rounded-full px-2 py-1 font-medium",
                                  priorityClass(task.priority),
                                )}
                              >
                                {task.priority}
                              </span>
                              <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground">
                                {task.suggestedTime}
                              </span>
                              <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground">
                                Deadline: {task.deadline}
                              </span>
                              <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground">
                                {done[i] ? "Completed" : "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </OutputPanel>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
