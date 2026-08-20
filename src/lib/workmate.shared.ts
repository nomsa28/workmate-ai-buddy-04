import { z } from "zod";

export const NOT_PROVIDED = "Not provided in the notes.";

export const RESPONSIBLE_AI_NOTICE =
  "Responsible AI Notice: AI-generated content may contain errors or incomplete information. Always review and verify important information before using it.";

export const GROUNDING_RULE = [
  "You must never invent, assume, or fabricate information, facts, names, decisions, deadlines or dates.",
  "Only use what the user provided. If something is missing, say clearly that it was not provided.",
].join(" ");

export const EmailInput = z.object({
  purpose: z.string().min(1),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});
export type EmailInputType = z.infer<typeof EmailInput>;

export const EmailSchema = z.object({
  subject: z.string(),
  body: z.string(),
});
export type EmailResult = z.infer<typeof EmailSchema>;

export const NotesInput = z.object({ notes: z.string().min(1) });

export const SummarySchema = z.object({
  summary: z.string(),
  keyDecisions: z.array(z.string()),
  actionItems: z.array(z.string()),
  deadlines: z.array(z.string()),
});
export type SummaryResult = z.infer<typeof SummarySchema>;

export const TaskItem = z.object({
  title: z.string(),
  deadline: z.string(),
  priority: z.string(),
});

export const PlanInput = z.object({
  tasks: z.array(TaskItem).min(1),
  horizon: z.enum(["Daily", "Weekly"]),
});

export const PlanSchema = z.object({
  overview: z.string(),
  schedule: z.array(
    z.object({
      title: z.string(),
      priority: z.string(),
      suggestedTime: z.string(),
      deadline: z.string(),
      reason: z.string(),
    }),
  ),
});
export type PlanResult = z.infer<typeof PlanSchema>;

export function emailPrompt(data: EmailInputType) {
  return [
    `Write a professional email in a ${data.tone} tone.`,
    GROUNDING_RULE,
    "Do not use placeholders like [Name] unless the user gave no name — in that case write a neutral greeting.",
    "Return a concise subject line and a complete email body with greeting and sign-off.",
    "",
    "Purpose / key information provided by the user:",
    data.purpose,
  ].join("\n");
}

export function notesPrompt(notes: string) {
  return [
    "Summarize the following meeting notes.",
    GROUNDING_RULE,
    `If there are no key decisions, action items or deadlines stated, return a single item: "${NOT_PROVIDED}".`,
    "Keep each list item short and factual.",
    "",
    "Meeting notes:",
    notes,
  ].join("\n");
}

export function planPrompt(data: z.infer<typeof PlanInput>) {
  return [
    `Create a prioritized ${data.horizon.toLowerCase()} schedule from the user's tasks.`,
    GROUNDING_RULE,
    "Order tasks by urgency, deadline, importance and estimated effort.",
    'Priority must be one of: "High", "Medium", "Low".',
    'suggestedTime is a short slot suggestion (e.g. "Mon 09:00–10:30").',
    `If a task has no deadline, set deadline to "No deadline provided".`,
    "Keep reason to one short sentence.",
    "",
    "Tasks:",
    ...data.tasks.map(
      (t, i) =>
        `${i + 1}. ${t.title} | deadline: ${t.deadline || "not provided"} | user priority: ${t.priority || "not provided"}`,
    ),
  ].join("\n");
}
