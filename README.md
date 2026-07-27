# AgentStudio

**AI agents that actually do the work.** A hybrid AI-agent platform for
[agentstudio.tech](https://agentstudio.tech):

- **Self-serve** — pick a ready-made agent (Sales, Support, Content, Data),
  customize everything (prompt, tone, temperature, knowledge base), and chat
  with it in a real-time streaming playground.
- **Done-for-you** — request custom agents designed, built and managed by our
  team.

## Quick start (local)

```bash
npm install
cp .env.example .env      # defaults are fine for local dev
npx prisma db push        # creates the SQLite dev database
npm run dev               # → http://localhost:3000
```

Works with **zero keys**: without Clerk keys the dashboard runs in a shared
demo workspace, and without AI keys agents use a built-in mock model that
streams believable replies. Add keys in `.env` to upgrade each layer:

| Keys | Unlocks |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` | real authentication & per-user workspaces |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` | real Claude / GPT responses |

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind v4 + shadcn/ui · Clerk ·
Prisma (SQLite dev / PostgreSQL prod) · Anthropic + OpenAI SDKs · Docker +
Nginx.

- [ARCHITECTURE.md](./ARCHITECTURE.md) — folder structure & design decisions
- [DEPLOY.md](./DEPLOY.md) — step-by-step VPS deployment for agentstudio.tech

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | dev server (Turbopack) |
| `npm run build` / `npm start` | production build / serve |
| `npm run lint` | ESLint |
| `npx prisma studio` | browse the local database |
| `./scripts/sync-schemas.sh` | sync SQLite → PostgreSQL schema after model changes |
