# hey247

**Das digitale Büro für deinen Betrieb.** hey247 (ein Produkt der flexC
GmbH) gibt Handwerksbetrieben KI-Mitarbeiter, die Anrufe annehmen,
Rechnungen sortieren und Papierkram erledigen — 100 % in Deutschland
gehostet. Live: <https://agentstudio.tech> (später hey247.de).

## Product

- **KI-Mitarbeiter**: Telefonassistent (Killerfeature), Rechnungs-,
  Buchhaltungs- und Angebots-Mitarbeiter — anpassbar (Prompt, Ton,
  Temperatur, Wissensbasis), mit Streaming-Playground.
- **Digitales Büro** (Welle 1, live): Ablage mit echtem Datei-Upload
  (PDF-Text + deutsche OCR), KI-Chat über die eigene Ablage mit
  Quellenangabe, Anrufe (automatische Rückruf-Notizen aus
  Telefonassistent-Gesprächen), Kalender, Aufträge-Board.
- **Zwei Sprachen**: Deutsch (root) + Englisch (`/en`).
- **Mobile**: installierbare PWA **und** native iOS-App
  (Capacitor-Shell in `ios/`, TestFlight-ready — startet direkt im
  Login, ohne Marketing-Seiten).

## Quick start (local)

```bash
npm install
cp .env.example .env      # defaults are fine for local dev
npx prisma db push        # creates the SQLite dev database
npm run dev               # → http://localhost:3000
```

Works with **zero keys**: without Clerk keys the dashboard runs in a
shared demo workspace, without AI keys a German mock model streams
believable replies. Each layer upgrades via env vars alone:

| Keys | Unlocks |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` | real auth & per-user workspaces (build-time — rebuild required) |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` | real Claude / GPT everywhere |
| `RESEND_API_KEY` or `SMTP_*` | pilot-request email notifications |

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind v4 + shadcn/ui (hey247
design tokens: Tannengrün/Signal-Orange, Space Grotesk + IBM Plex) ·
Clerk (deutsch lokalisiert) · Prisma (SQLite dev / PostgreSQL prod) ·
Anthropic + OpenAI SDKs mit Mock-Fallback · tesseract.js/pdf-parse ·
Capacitor (iOS) · Docker + Nginx.

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Struktur & Design-Entscheidungen
- [DEPLOY.md](./DEPLOY.md) — VPS-Deployment (Docker + Nginx)
- [GO-LIVE.md](./GO-LIVE.md) — Produktstatus, Pilot-Checkliste, Ops-Handbuch
- [TESTFLIGHT.md](./TESTFLIGHT.md) — iOS-App signieren & zu TestFlight hochladen
- **/hilfe** auf der Website — Kundendokumentation (deutsch)

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | dev server (Turbopack) |
| `npm run build` / `npm start` | production build / serve |
| `npx prisma studio` | browse the local database |
| `./scripts/sync-schemas.sh` | sync SQLite → PostgreSQL schema after model changes |
| `npx cap sync ios && npx cap open ios` | update & open the iOS project |
