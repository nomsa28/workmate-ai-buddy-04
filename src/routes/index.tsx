import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, ArrowRight } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkMate AI — Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Write professional emails, summarize meeting notes and plan your tasks with WorkMate AI.",
      },
      { property: "og:title", content: "WorkMate AI — Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Write professional emails, summarize meeting notes and plan your tasks with WorkMate AI.",
      },
    ],
  }),
  component: Dashboard,
});

const features = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    text: "Turn a few key points into a polished email with the right tone.",
  },
  {
    to: "/summarizer" as const,
    icon: FileText,
    title: "Meeting Summarizer",
    text: "Extract summary, decisions, action items and deadlines from raw notes.",
  },
  {
    to: "/tasks" as const,
    icon: ListChecks,
    title: "AI Task Planner",
    text: "Get a prioritized daily or weekly schedule from your task list.",
  },
];

function Dashboard() {
  return (
    <AppShell>
      <PageHeader
        title="Welcome to WorkMate AI"
        description="Your assistant for professional writing, meeting notes and daily planning."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.to}
            to={f.to}
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <f.icon className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-base font-semibold">{f.title}</h2>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{f.text}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Open tool
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
