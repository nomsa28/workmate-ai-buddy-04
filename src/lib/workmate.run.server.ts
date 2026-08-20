import { streamText, Output, NoObjectGeneratedError } from "ai";
import { getModel } from "./ai-gateway.server";
import {
  EmailSchema,
  SummarySchema,
  PlanSchema,
  emailPrompt,
  notesPrompt,
  planPrompt,
  type EmailInputType,
} from "./workmate.shared";
import { z } from "zod";

export { EmailInput, NotesInput, PlanInput } from "./workmate.shared";

async function run<T>(schema: z.ZodType<T>, prompt: string): Promise<T> {
  try {
    const result = streamText({
      model: getModel(),
      prompt,
      output: Output.object({ schema }),
    });
    return (await result.output) as T;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error) && error.text) {
      try {
        return schema.parse(JSON.parse(error.text));
      } catch {
        /* fall through */
      }
    }
    const message = error instanceof Error ? error.message : "AI request failed.";
    if (message.includes("402")) {
      throw new Error("AI credits are exhausted. Please add credits to continue.");
    }
    if (message.includes("429")) {
      throw new Error("Too many requests right now. Please try again in a moment.");
    }
    throw new Error(message);
  }
}

export function runEmail(data: EmailInputType) {
  return run(EmailSchema, emailPrompt(data));
}

export function runNotes(notes: string) {
  return run(SummarySchema, notesPrompt(notes));
}

export function runPlan(data: z.infer<typeof import("./workmate.shared").PlanInput>) {
  return run(PlanSchema, planPrompt(data));
}
