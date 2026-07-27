# hey247 — Product Status & Go-Live Guide

*Last updated: 2026-07-27 (real auth + real AI live in production).*

hey247 (a flexC GmbH product) is the German-first digital office for
trade businesses, live at <https://agentstudio.tech> (later: hey247.de).
This document answers three questions: **what is implemented**, **what is
currently simulated**, and **exactly what to do before putting real,
paying pilot businesses on the platform**.

---

## 1. What is implemented today

| Area | Status | Notes |
| --- | --- | --- |
| Landing page (DE) | ✅ Production-ready | Follows the pitch deck: hero with phone-call mock, Papierkram problem section, live demo, 8 modules with Welle badges, Ablage/KI-Chat features, KI-Mitarbeiter cards + "Mensch entscheidet", Germany data-residency section, deck pricing, pilot section, FAQ. Official design-system tokens (Tannengrün/Signal-Orange, Space Grotesk + IBM Plex). |
| English fallback | ✅ Working | Full landing, pricing and pilot pages under `/en`, EN/DE switch in the navbar. |
| Live demo chat | ✅ Working | Public, streaming, no sign-up. All four KI-Mitarbeiter with German replies. Mock model by default so anonymous visitors can't spend your AI budget (`DEMO_USE_REAL_AI` opts in). |
| KI-Mitarbeiter | ✅ Working | Telefonassistent (killer feature, transparent-AI rules, structured Rückruf-Notizen), Rechnungs-Mitarbeiter (E-Rechnung aware), Buchhaltungs-Mitarbeiter (DATEV-oriented), Angebots-Mitarbeiter (Aufmaß → Angebotsentwurf). German system prompts; legacy AgentStudio agents map automatically. |
| Playground + customization | ✅ Working | Streaming chat; Name, System-Prompt, Ton, Temperatur, Wissensbasis, model routing; save/reuse/delete. German UI. |
| Dashboard | ✅ Working | German UI: Übersicht, Vorlagen, KI-Mitarbeiter, Nutzung, Abrechnung. Usage vs plan limits enforced server-side. |
| Authentication | ✅ Live (dev keys) | Clerk active in production: real sign-up/login, per-user workspaces, protected dashboard. Currently pk_test keys — switch to a production instance (DNS) before paying customers. |
| AI responses | ✅ Live (Claude) | ANTHROPIC_API_KEY configured — agents, KI-Chat and call-note extraction run on real Claude. Public landing demo stays on the mock (DEMO_USE_REAL_AI=false) to protect the budget. **Deck promises German-hosted models — see §3.** |
| Plans | ✅ Enforced | Pilotbetrieb (default, 1.000 msgs/mo) / Basis / Basis+KI-Mitarbeiter in `src/lib/plans.ts`; legacy plan ids map automatically. |
| Pilot request flow | ✅ Working | `/pilot` form (Gewerk, Betriebsgröße, Zeitfresser) → database + email notification (needs mail credentials, §3). `/done-for-you` redirects here. |
| Legal pages | ⚠️ Placeholders | Datenschutz, AGB, Impressum in German for flexC GmbH — **company address/Geschäftsführung are bracketed placeholders** in `src/lib/company.ts`. |
| Billing / payments | ❌ Manual | Abrechnung page shows plans; changes via mailto to pilot@hey247.de. No Stripe. |
| Ablage (Dokumente) | ✅ Working | Document filing with **real file upload**: PDF text extraction + German OCR for photos (Tesseract, runs on our server — no external service), auto-classification (type + amount), original file preview, search, Freigabe workflow. |
| KI-Chat über die Ablage | ✅ Working (v1) | "Frag deine Ablage": grounded answers with cited sources, saved Verläufe, mail drafting. Uses mock retrieval until AI keys are set. |
| App shell | ✅ Redesigned | Matches the mobile mockups: dark frame, pale-green panel, pill navigation, mockup stat cards. |
| PWA | ✅ Installable | Service worker with offline fallback + static caching, Apple web-app meta. "Add to Home Screen" works on iOS/Android. |
| Native iOS app | ✅ Built, TestFlight-ready | Capacitor shell (`ios/`, bundle id de.hey247.app) around the production app: native icon/splash, German camera/photo permissions, offline fallback. Runs in the simulator. Upload to TestFlight = owner task in Xcode — see TESTFLIGHT.md. Web deploys update the app content automatically. |
| Anrufe (Rückruf-Notizen) | ✅ Working | Call log per mockup — and **Telefonassistent conversations now create Rückruf-Notizen automatically** (name/phone/urgency extraction; AI-based once keys are set, solid heuristic without). Real telephony (voice line) still Welle 2. |
| Aufträge & Anfragen | ✅ Working (v1) | Board with Neu / In Arbeit / Wartet auf Kunde / Erledigt, priorities, sources, create dialog, samples. |
| Kalender | ✅ Working (v1) | Week view (KW navigation, kind-colored entries), local appointments + create dialog. External calendar sync (IMAP/CalDAV) still Welle 2. |
| Deck modules noch offen | ❌ Roadmap | Mail-Postfach-Anbindung (IMAP), echte Telefonie (voice line), Marketing-Modul. |
| Deployment | ✅ Production | Docker + Postgres + Nginx + HTTPS on the VPS, auto-restart, schema auto-sync. |

---

## 2. What is simulated, and what turning it real requires

Each simulated layer upgrades **via configuration, not code changes** —
except payments and the Welle-2/3 modules, which need development.

| Simulated today | To make it real | Effort |
| --- | --- | --- |
| Shared demo login | Clerk production keys | ~30 min, config only |
| Mock AI replies | Anthropic/OpenAI key (or a German-hosted provider, see §3) | ~10 min, config only |
| Pilot-request emails sit in DB | `RESEND_API_KEY` or SMTP credentials | ~10 min, config only |
| Legal placeholders | Fill `src/lib/company.ts`, redeploy | ~10 min |
| Manual plan changes | Stripe Checkout + webhook | 1–2 dev days |
| Welle 2/3 modules (Ablage-OCR, Kalender & Mail, Anfragenboard) | Product development per deck roadmap | weeks per module |

---

## 3. Go-live checklist

### P0 — before pitching pilot businesses

1. **Impressum** *(✅ done 2026-07-27)* — real flexC GmbH data (Mannheim,
   HRB 735477, USt-Id, Geschäftsführer) is live on /legal/imprint, taken
   from flexc.de/impressum. Still recommended: have Datenschutz/AGB
   wording reviewed by a lawyer — it's a solid template, not legal advice.
2. **Create the hey247.de mailboxes** referenced in the UI:
   `pilot@hey247.de` (CTAs, notifications), `hallo@hey247.de`,
   `datenschutz@hey247.de`. Until they exist, mailto links go nowhere.
3. **Enable pilot-request notifications** *(still open)* — set `RESEND_API_KEY` **or**
   `SMTP_*` in `/opt/agentstudio/.env`, then
   `docker compose up -d --build`. Otherwise requests only land in the DB (§4).
4. **Enable real AI** *(✅ done 2026-07-27 — Anthropic key active)* — set
   **billing caps in the provider console**. ⚠️ The deck promises
   "KI-Modelle laufen in Deutschland": Anthropic/OpenAI do **not** satisfy
   that claim. Either integrate a German/EU-hosted model provider (e.g.
   via an EU inference endpoint — the provider router in `src/lib/ai/` is
   built to be extended) or soften the landing-page claim until that's true.
5. **Enable real authentication (Clerk)** *(✅ dev keys live 2026-07-27; production instance still open)* — production instance for the domain, keys into `.env`, rebuild. Note: Clerk is a US processor; it is
   named in the Datenschutzerklärung, but for the strict "Daten bleiben in
   Deutschland" positioning consider an EU-hosted auth alternative later.
6. **Database backups** — install the nightly pg_dump cron from DEPLOY.md §6.

### P1 — first weeks of the pilot

7. **Rate limiting** on `/api/demo-chat` before pointing real AI at
   anonymous traffic.
8. **Analytics** (Plausible/Umami, cookieless — fits the no-tracking
   promise in the Datenschutzerklärung) and **uptime monitoring**.
9. **Error monitoring** (Sentry free tier).
10. **hey247.de domain** — when ready, point DNS at the VPS, add the vhost
    + certbot, set `NEXT_PUBLIC_APP_URL=https://hey247.de`, rebuild.

### P2 — after pilot validation

11. **Stripe checkout** for Basis/KI-Mitarbeiter (env slots prepared).
12. **Welle 2 integrations**: file upload + OCR for the Ablage, mail inbox
    (IMAP) + external calendar sync — the local Kalender/Aufträge/Anrufe
    screens are live and ready to receive that data.
13. **Real phone integration** for the Telefonassistent (today it's a
    chat-based demo; production needs telephony, e.g. SIP/Twilio-style
    voice + STT/TTS with a German provider).
14. **Knowledge-base file upload** (button is a disabled placeholder).

---

## 3b. Customer documentation

German user guide for pilot businesses lives at **/hilfe** on the site
(linked in the footer): first login, KI-Mitarbeiter, Dokumente upload/OCR,
KI-Chat, Anrufe, Kalender, Aufträge, and "App aufs Handy" (PWA install).
Update it when features change — it is part of the product.

## 4. Operating handbook (until the automation exists)

All commands run on the VPS (`ssh root@vps47388.alfahosting-vps.de`, then
`cd /opt/agentstudio`).

**Read new pilot requests:**

```bash
docker compose exec db psql -U agentstudio agentstudio -c \
  "SELECT \"createdAt\", name, email, company, \"agentType\" AS gewerk, budget AS groesse, timeline, left(description,120) AS zeitfresser, status FROM \"CustomRequest\" ORDER BY \"createdAt\" DESC LIMIT 20;"
```

**Mark a request handled:**

```bash
docker compose exec db psql -U agentstudio agentstudio -c \
  "UPDATE \"CustomRequest\" SET status='contacted' WHERE id='REQUEST_ID';"
```

**Change a workspace's plan** (`pilot`, `basis`, `komplett`):

```bash
docker compose exec db psql -U agentstudio agentstudio -c \
  "UPDATE \"User\" SET plan='basis' WHERE email='kunde@betrieb.de';"
```

New limits apply on the customer's next page load — no restart needed.

**Watch logs / restart / update:** see DEPLOY.md §5–6.

---

## 5. Monthly running costs (estimate)

| Item | Cost |
| --- | --- |
| VPS (already owned, shared with other sites) | €0 extra |
| Clerk | free to 10k MAU |
| AI usage | usage-based; with pilot businesses at ≤1.000 msgs/mo, roughly €1–5 per active business on a small model — set provider caps |
| Domain + TLS | owned / free (Let's Encrypt) |
| Plausible/Sentry/UptimeRobot | free tiers to start |

The only meaningful variable cost is AI usage — which is why per-plan
message limits and provider-side caps are both in place before enabling
real models for anonymous visitors.
