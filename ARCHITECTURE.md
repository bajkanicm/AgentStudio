# hey247 — Architecture

Das digitale Büro für Handwerksbetriebe (flexC GmbH), live auf
**agentstudio.tech** (später hey247.de). Deutsch-first mit englischem
Fallback; Design nach dem offiziellen hey247-Design-System
(Tannengrün `#0E3B33`, Signal-Orange `#E8590C`, Paper-Neutrals,
Space Grotesk + IBM Plex).

## Stack

| Layer      | Choice                                                     |
| ---------- | ---------------------------------------------------------- |
| Framework  | Next.js 15 (App Router, Turbopack) + TypeScript             |
| UI         | Tailwind CSS v4 + shadcn/ui; dark-green marketing, light "paper panel" app |
| Auth       | Clerk (deutsch via `@clerk/localizations`; Demo-Modus ohne Keys) |
| Database   | Prisma — SQLite (dev) / PostgreSQL (prod, Docker)           |
| AI         | Anthropic Claude (aktiv) + OpenAI, Router mit Mock-Fallback |
| Extraction | pdf-parse (PDF-Text) + tesseract.js (deutsche OCR, lokal)   |
| Mobile     | PWA (Service Worker) + Capacitor-iOS-Shell (`ios/`)         |
| Deploy     | Docker Compose (app + postgres + uploads-Volume) hinter Host-Nginx |

## Folder structure

```
├── prisma/schema.prisma            # dev (SQLite); schema.postgres.prisma = prod twin
├── scripts/sync-schemas.sh         # hält beide Schemas synchron
├── capacitor.config.ts             # iOS-Shell: lädt Produktion, UA "hey247App"
├── ios/                            # natives Xcode-Projekt (TestFlight, s. TESTFLIGHT.md)
├── capacitor-www/                  # Offline-Fallback der iOS-App
├── assets/                         # App-Icon-Quelle (icon.png 1024)
├── public/sw.js                    # PWA: Offline-Fallback + Static-Cache
├── nginx/agentstudio.conf          # Reverse-Proxy (deployte Fassung)
├── src/
│   ├── middleware.ts               # Clerk-Schutz /dashboard/* + App-UA-Redirect
│   ├── app/
│   │   ├── (marketing)/(de)/       # deutsche Website: Landing, pricing, pilot,
│   │   │                           #   hilfe (Kundendoku), legal/* (flexC)
│   │   ├── (marketing)/en/         # englischer Fallback (Landing, pricing, pilot)
│   │   ├── sign-in|sign-up/        # Clerk (deutsch); Demo-Karte ohne Keys
│   │   ├── offline/                # PWA-Fallback-Seite
│   │   ├── dashboard/              # App-Panel (theme-paper):
│   │   │   ├── page.tsx            #   Übersicht (Mockup-Statkarten)
│   │   │   ├── anrufe|chat|dokumente|kalender|auftraege/
│   │   │   ├── agents/ (+new, [id])#   KI-Mitarbeiter + Playground
│   │   │   └── templates|usage|billing/
│   │   └── api/
│   │       ├── chat/               # Agent-Chat (streaming, Limits, CallNote-Hook)
│   │       ├── ablage-chat/        # KI-Chat über Dokumente (Quellen, Verläufe)
│   │       ├── demo-chat/          # öffentliche Landing-Demo (Mock by default)
│   │       ├── documents/ (+upload, [id]/file)  # CRUD + OCR-Upload + Datei-Serving
│   │       ├── anrufe|auftraege|termine/        # Module-CRUD (+loadSamples)
│   │       ├── agents/             # KI-Mitarbeiter CRUD
│   │       └── custom-requests/    # Pilotanfragen (+ E-Mail-Notification)
│   ├── components/
│   │   ├── landing/                # Deck-Sektionen (Problem, Module, Trust …)
│   │   ├── dashboard/              # Shell (Pill-Nav), Modul-Views
│   │   ├── agents/                 # Playground + Einstellungs-Panel
│   │   └── chat/                   # gemeinsamer Streaming-Chat + Mini-Markdown
│   └── lib/
│       ├── agent-templates.ts      # 4 KI-Mitarbeiter (Legacy-Slug-Mapping)
│       ├── ai/                     # Provider-Router (Claude→GPT→Mock) + Mock
│       ├── extract.ts              # PDF-Text/OCR + Typ-/Betrags-Heuristik
│       ├── call-extract.ts         # Gespräch → Rückruf-Notiz (AI/Heuristik)
│       ├── documents|plans|usage|locale|company|notify|auth|db.ts
├── Dockerfile · docker-compose.yml · docker-entrypoint.sh
└── DEPLOY.md · GO-LIVE.md · TESTFLIGHT.md
```

## Key design decisions

**Demo-Modus überall.** Ohne Clerk-Keys läuft ein geteilter
`demo-user`-Workspace, ohne AI-Keys ein deutsches Mock-Modell, ohne
Mail-Keys wird Benachrichtigung geloggt statt gesendet. Jede Schicht
wird per Env-Var real — deshalb war derselbe Code vom ersten Tag an
deploybar und ist heute mit echten Keys „scharf".

**Ein Chat-Pfad, drei Endpunkte.** `AgentChat` (Client) streamt gegen
`/api/demo-chat` (öffentlich, mock-only), `/api/chat` (Agent-gebunden,
persistiert, Limits, erzeugt CallNotes bei Telefon-Template) und
`/api/ablage-chat` (Dokumente als `### Titel (Meta)`-Wissensbasis,
Antworten mit Quellen, Verläufe = Conversations mit `agentId null`).

**theme-paper.** Die App nutzt das helle Mockup-Design, das Marketing
das dunkle Deck-Design — eine CSS-Klasse (`.theme-paper`) remappt die
shadcn-Token-Variablen, statt Komponenten zu doppeln.

**Extraction lokal.** pdf-parse + tesseract.js laufen im Container
(Standalone-Tracing braucht `outputFileTracingIncludes` für die
Worker-Deps und `@napi-rs/canvas` für DOMMatrix auf Alpine). Kein
externer OCR-Dienst — passt zur „Daten bleiben in Deutschland"-Zusage.

**Native App = Shell, Web = Produkt.** Die iOS-App lädt die Produktion
(`server.url`), hängt `hey247App` an den User-Agent, und die Middleware
blendet Marketing-Routen aus (App startet im Login). Web-Deploys
aktualisieren die App ohne neues TestFlight-Build.

**Pläne & Limits als Daten.** `lib/plans.ts` (pilot/basis/komplett,
Legacy-IDs gemappt) speist Preisseite, Usage-Bars und API-Enforcement.

**Zwei Prisma-Schemas.** Provider ist im Schema fixiert → SQLite-Schema
für dev, PostgreSQL-Twin für prod (Docker-Build kopiert um, Entrypoint
macht `prisma db push`).
