# WorkMate AI

Build a functional responsive web app called "WorkMate AI – Workplace Productivity Assistant".

PURPOSE:

Create an AI workplace productivity assistant that helps users write professional emails, summarize meeting notes, and organize tasks.

REQUIRED FEATURES:

1. SMART EMAIL GENERATOR

- User enters the purpose/key information of an email.

- User selects tone: Formal, Friendly, or Persuasive.

- AI generates a professional email with a subject line.

- Include Copy, Regenerate, and Clear buttons.

2. MEETING NOTES SUMMARIZER

- User pastes meeting notes.

- AI generates:

  - Summary

  - Key Decisions

  - Action Items

  - Deadlines

- Never invent missing information.

- Include Copy, Regenerate, and Clear buttons.

3. AI TASK PLANNER

- User enters multiple tasks with optional deadlines and priorities.

- AI creates a prioritized daily or weekly schedule.

- Prioritize tasks based on urgency, deadline, importance, and effort.

- Display tasks clearly with priority, suggested time, deadline, and status.

- Allow users to mark tasks as Completed.

UI REQUIREMENTS:

- Professional modern dashboard.

- Sidebar navigation with:

  Dashboard

  Email Generator

  Meeting Summarizer

  Task Planner

  Settings

- Dashboard should contain three feature cards linking to each tool.

- Each tool must have a clear Input section and AI Output section.

- Include loading and error states.

- Fully responsive on desktop and mobile.

- Use clean typography, cards, icons, spacing, and professional colors.

RESPONSIBLE AI:

Display this disclaimer on the application:

"Responsible AI Notice: AI-generated content may contain errors or incomplete information. Always review and verify important information before using it."

The AI must not fabricate information, deadlines, decisions, or facts. If information is missing, clearly say that it was not provided.

FUNCTIONALITY:

This must be a working application, not a static mockup. Connect the features to an available AI API/integration supported by Lovable. User inputs must produce actual AI-generated outputs.

Keep the implementation simple and focused. Prioritize the three required AI features, functionality, responsive design, and professional UI over unnecessary features.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://workmate-ai-buddy-04.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c38a2238-8955-475c-bea1-61c2c2f338ca).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
