# hey247 — Product Status & Go-Live Guide

*Last updated: 2026-07-28.*

hey247 (a flexC GmbH product) is a German-first digital office for trade
businesses, live at <https://agentstudio.tech> (later: hey247.de). This
document covers what is implemented, what still needs configuration or
development, and how to operate the product. German terms in quotes are
actual product/UI names.

## 1. What is implemented and live

| Area | Status | Notes |
| --- | --- | --- |
| Landing page | ✅ | Follows the pitch deck (problem section, live demo, module waves, data-residency section, pricing, pilot section, FAQ) in the official design system. German at the root, English under `/en`. |
| Authentication | ✅ (dev keys) | Custom hey247 sign-in/sign-up forms (headless Clerk, no visible Clerk branding): email+password, Google (web only), password reset, email verification. Switch to a Clerk production instance before paying customers. |
| App UI | ✅ | Fully bilingual (German/English) via a persistent language setting — navigation, all modules, agent identities, toasts. Switcher: account menu, the "Mehr" screen in the app, and on the login screen. |
| AI | ✅ (Claude) | Agents, document chat and call-note extraction run on the configured Anthropic key. The public landing demo intentionally uses a mock model. Note: the deck promises German-hosted models — Anthropic/OpenAI do not satisfy that; integrate an EU-hosted provider or soften the claim before scaling. |
| AI employees | ✅ | Phone assistant, invoice, bookkeeping and quote employees with engineered prompts, customization panel and streaming playground. |
| Documents ("Dokumente") | ✅ | Real file upload: PDF text extraction and German OCR on our own server, auto-classification with amount detection, approval workflow, original-file preview, full-text search. |
| Document chat ("KI-Chat") | ✅ | Answers grounded in the user's documents with cited sources, saved history, email drafting. |
| Calls ("Anrufe") | ✅ | Phone-assistant conversations automatically produce structured callback notes (name, number, urgency). A real phone line is a Wave-2 integration. |
| Calendar / Jobs board | ✅ | Week-view calendar and a four-column request board ("Aufträge & Anfragen"). External calendar/mail sync is Wave 2. |
| Pilot requests | ✅ | Form → database + German summary email to pilot@hey247.de via Microsoft 365 SMTP (live, tested). |
| iOS app | ✅ | Capacitor shell (bundle `de.hey247.app`), uploaded to TestFlight. Native app mode: bottom tab bar, static header (no jumping), no browser artifacts, language setting in the app. Web deploys update the app instantly; see TESTFLIGHT.md. |
| PWA | ✅ | Installable with offline fallback. |
| Legal | ✅ | German Impressum with real flexC GmbH registry data, Datenschutzerklärung, AGB. Recommended: lawyer review of the wording. |
| Customer guide | ✅ | German quick-start at `/hilfe`, linked in the footer. |
| Payments | ❌ | Manual plan changes via email; Stripe is prepared but not integrated. |

## 2. Open items

**Before onboarding paying customers**
1. Clerk production instance for the domain (DNS records, `pk_live_` keys, rebuild). Also rename the Clerk app to "hey247" in the Clerk dashboard.
2. Nightly database backup cron (DEPLOY.md §6) — not yet installed.
3. Remaining mailboxes referenced in the UI: hallo@hey247.de, datenschutz@hey247.de.
4. Provider-side AI spending caps; rate limiting on the public demo before pointing it at real AI.
5. Resolve the "AI models run in Germany" claim (EU-hosted model provider, or adjust wording).

**Wave 2 development**
6. Real phone line for the phone assistant (telephony provider + German speech-to-text).
7. Mailbox ingestion (IMAP) and external calendar sync.
8. Stripe self-serve checkout.
9. Knowledge-base file upload (button is a placeholder).

## 3. Operating handbook

All commands run on the VPS (`ssh root@vps47388.alfahosting-vps.de`, then `cd /opt/agentstudio`).

Read new pilot requests:

```bash
docker compose exec db psql -U agentstudio agentstudio -c \
  "SELECT \"createdAt\", name, email, company, \"agentType\", budget, timeline, left(description,120), status FROM \"CustomRequest\" ORDER BY \"createdAt\" DESC LIMIT 20;"
```

Mark a request handled:

```bash
docker compose exec db psql -U agentstudio agentstudio -c \
  "UPDATE \"CustomRequest\" SET status='contacted' WHERE id='REQUEST_ID';"
```

Change a workspace's plan (`pilot`, `basis`, `komplett`) after payment:

```bash
docker compose exec db psql -U agentstudio agentstudio -c \
  "UPDATE \"User\" SET plan='basis' WHERE email='customer@example.com';"
```

Email notifications depend on "Authenticated SMTP" staying enabled for the
pilot@hey247.de mailbox in the Microsoft 365 admin center; failures appear
as `[notify] failed` in `docker compose logs app`.

Deployment, updates and backups: see DEPLOY.md. iOS releases: TESTFLIGHT.md.

## 4. Running costs

VPS already owned; Clerk free to 10k users; AI usage is the only
meaningful variable cost (roughly €1–5 per active business per month at
pilot limits — set provider caps). Free tiers cover analytics/monitoring
when added.
