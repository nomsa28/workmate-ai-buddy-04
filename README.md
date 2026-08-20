# WorkMate AI

WorkMate AI is a workplace productivity assistant that helps professionals draft emails, summarize meeting notes, and plan tasks with AI. It is built as a responsive web app using TanStack Start, React, TypeScript, and Tailwind CSS.

## Features

- **Smart Email Generator** — Enter the purpose and key information, choose a tone (Formal, Friendly, or Persuasive), and generate a complete subject line and email body. Copy, regenerate, or clear the result in one click.
- **Meeting Notes Summarizer** — Paste raw meeting notes and receive a structured summary with key decisions, action items, and deadlines. The AI only uses what you provide and never invents facts.
- **AI Task Planner** — Add multiple tasks with deadlines and priorities, then generate a prioritized daily or weekly schedule with suggested time slots and clear reasoning. Mark tasks as completed as you work through them.
- **Settings** — Set your default email tone and planning horizon so the app matches your workflow.

## Responsible AI

WorkMate AI displays a **Responsible AI Notice** on every page: AI-generated content may contain errors or incomplete information. Always review and verify important information before using it.

The prompts are grounded with strict rules: the AI must not invent names, dates, deadlines, or decisions. If information is missing, it says so clearly.

## Tech Stack

- [TanStack Start](https://tanstack.com/start) — full-stack React framework
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Lovable AI Gateway](https://docs.lovable.dev/features/ai-gateway) — for AI completions

## Project Structure

```
src/
  components/        # Shared UI components (AppShell, OutputPanel, etc.)
  lib/               # Server functions, AI logic, schemas, and prompts
  routes/            # TanStack Start file-based routes
  styles.css         # Global styles and design tokens
  router.tsx         # Router setup
  start.ts           # App start configuration
public/              # Static assets
```

## Getting Started

1. Install dependencies:

```sh
bun install
```

2. Run the development server:

```sh
bun run dev
```

3. Open the app in your browser at `http://localhost:8080`.

## Environment Variables

The app uses Lovable AI Gateway for AI features. Required secrets are managed through Lovable Cloud and injected at runtime. No manual `.env` setup is needed when running inside the Lovable environment.

## Deployment

The project is developed in [Lovable](https://lovable.dev). Connect the project to GitHub from the Lovable editor (Plus menu → GitHub → Connect project) to enable two-way sync, then deploy from your GitHub repository or continue iterating in Lovable.

## License

This project is your own code and is free to modify, host, and ship as you see fit.
