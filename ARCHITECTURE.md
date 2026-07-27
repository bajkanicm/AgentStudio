# AgentStudio — Architecture

A hybrid AI-agent platform: **self-serve** (ready-made, customizable agents) and
**done-for-you** (custom agents built by our team). Built to fully replace the
site at **agentstudio.tech**.

## Stack

| Layer      | Choice                                            |
| ---------- | ------------------------------------------------- |
| Framework  | Next.js 15 (App Router, Turbopack) + TypeScript   |
| UI         | Tailwind CSS v4 + shadcn/ui (Radix), dark-first   |
| Auth       | Clerk (graceful **demo mode** when keys unset)    |
| Database   | Prisma — SQLite (dev) / PostgreSQL (prod, Docker) |
| AI         | Anthropic Claude + OpenAI, with built-in mock     |
| Deploy     | Docker + docker-compose + Nginx on a VPS          |

## Folder structure

```
AgentStudio/
├── prisma/
│   ├── schema.prisma            # dev schema (SQLite)
│   └── schema.postgres.prisma   # prod schema (copied in Docker build)
├── scripts/
│   └── sync-schemas.sh          # keeps the two schemas in sync
├── nginx/                       # reverse-proxy config for the VPS
├── public/                      # static assets, PWA manifest
├── src/
│   ├── middleware.ts            # Clerk route protection (/dashboard/*)
│   ├── app/
│   │   ├── layout.tsx           # root: fonts, metadata, ClerkProvider, dark theme
│   │   ├── (marketing)/         # public site — navbar + footer layout
│   │   │   ├── page.tsx         # landing page
│   │   │   ├── pricing/
│   │   │   └── done-for-you/    # custom-agent request flow
│   │   ├── sign-in/ sign-up/    # Clerk auth pages
│   │   ├── dashboard/           # protected app — sidebar layout
│   │   │   ├── page.tsx         # overview: agents, usage, quick actions
│   │   │   ├── templates/       # template gallery
│   │   │   ├── agents/          # saved agents list
│   │   │   │   ├── new/        # create from template
│   │   │   │   └── [id]/       # playground + customization panel
│   │   │   ├── usage/           # usage & limits
│   │   │   └── billing/         # plan management (Stripe-ready, mocked)
│   │   └── api/
│   │       ├── chat/            # streaming chat (auth’d, persists + tracks usage)
│   │       ├── demo-chat/       # public landing-page demo (mock by default)
│   │       ├── agents/          # CRUD for saved agents
│   │       └── custom-requests/ # done-for-you form submissions
│   ├── components/
│   │   ├── ui/                  # shadcn/ui primitives
│   │   ├── landing/             # hero, live demo, features, pricing, faq…
│   │   ├── chat/                # shared streaming chat UI (demo + playground)
│   │   ├── dashboard/           # sidebar, stat cards, agent cards
│   │   └── agents/              # customization panel
│   └── lib/
│       ├── db.ts                # Prisma singleton
│       ├── auth.ts              # Clerk helpers + demo-mode fallback
│       ├── plans.ts             # pricing tiers + limits (single source of truth)
│       ├── usage.ts             # per-month usage aggregation + limit checks
│       ├── agent-templates.ts   # the 4 templates: prompts, tones, demo content
│       └── ai/
│           ├── index.ts         # provider router: Claude → GPT → mock, streaming
│           └── mock.ts          # believable keyless demo model
├── Dockerfile                   # multi-stage, standalone output
├── docker-compose.yml           # app + PostgreSQL
├── DEPLOY.md                    # step-by-step VPS deployment
└── .env.example
```

## Key design decisions

**Demo mode.** Every environment works with zero secrets: without Clerk keys the
dashboard runs under a shared `demo-user`; without AI keys a template-aware mock
model streams believable replies. Adding keys upgrades each layer independently
— real auth, real models — with no code changes. This keeps local dev, CI, and
the first production deploy friction-free.

**One chat pipeline.** The landing-page demo and the dashboard playground share
the same streaming chat component and the same provider router
(`lib/ai/index.ts`). The public `/api/demo-chat` endpoint is stateless and
mock-only by default (`DEMO_USE_REAL_AI` opts in); the authenticated
`/api/chat` persists conversations and enforces plan limits.

**Prompt assembly.** A saved agent = template + overrides (name, system prompt,
tone, temperature, knowledge base). `buildSystemPrompt()` composes these into
the final system prompt at request time, so template improvements flow to
existing agents.

**Plan limits as data.** `lib/plans.ts` defines tiers and limits once; the
pricing page, dashboard usage bars, and API enforcement all read from it.

**Two Prisma schemas.** Prisma pins the provider in the schema file, so we keep
an SQLite schema for dev and a PostgreSQL twin for prod (synced via
`scripts/sync-schemas.sh`, applied with `prisma db push` on container start).

**Mobile/PWA-ready.** Responsive layouts throughout, `manifest.webmanifest`,
and an API surface (`/api/*`) that a future React Native client can consume
directly.
