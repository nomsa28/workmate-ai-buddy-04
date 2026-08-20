import { createServerFn } from "@tanstack/react-start";
import {
  EmailInput,
  NotesInput,
  PlanInput,
  runEmail,
  runNotes,
  runPlan,
} from "./workmate.run.server";

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => runEmail(data));

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) => runNotes(data.notes));

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data }) => runPlan(data));
