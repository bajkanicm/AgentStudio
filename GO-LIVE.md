# AgentStudio — Product Status & Go-Live Guide

*Last updated: 2026-07-27 (initial production deployment).*

This document answers three questions: **what is implemented**, **what is
currently simulated**, and **exactly what to do before putting real,
paying customers on the platform**.

---

## 1. What is implemented today

Live at <https://agentstudio.tech>:

| Area | Status | Notes |
| --- | --- | --- |
| Landing page | ✅ Production-ready | Hero, live interactive demo of all 4 agents, self-serve vs done-for-you paths, features, testimonials, pricing, FAQ, CTAs. Mobile-responsive. |
| Live demo chat | ✅ Working | Public, streaming, no sign-up needed. Uses the mock model by default so anonymous visitors can't spend your AI budget (`DEMO_USE_REAL_AI` opts in). |
| Authentication | ⚠️ Demo mode | Clerk fully integrated in code, but keys are not configured — everyone shares one demo workspace. |
| Dashboard | ✅ Working | Agent overview, usage stats (messages, conversations, tokens vs plan limits), quick actions, upgrade CTAs. |
| Agent templates | ✅ Working | Sales Qualification, Customer Support, Content & Marketing, Data Analyst — each with an engineered system prompt. |
| Playground + customization | ✅ Working | Real-time streaming chat; edit name, system prompt, tone, temperature, knowledge base (paste-in), model routing; save/reuse agents; delete with confirm. |
| AI responses | ⚠️ Mock model | Believable template-aware canned replies. Real Claude/GPT activates the moment API keys are set. |
| Conversations & usage tracking | ✅ Working | Agent-bound chats persist; token estimates recorded; monthly counters enforce plan limits server-side. |
| Plan limits | ✅ Enforced | Starter: 200 msgs/mo, 3 agents, 20k-char KB. Growth/Enterprise limits defined in `src/lib/plans.ts`. |
| Pricing page | ✅ Production-ready | 3 tiers + detailed comparison table. |
| Done-for-you flow | ✅ Working | Dedicated page + form; requests stored in the database (see §4 for how to read them). **No email notification yet.** |
| Billing / payments | ❌ Mocked | Billing page shows plans; "Upgrade" opens a mailto to sales@agentstudio.tech. No Stripe. Plan changes are manual (see §4). |
| Deployment | ✅ Production | Docker + Postgres + Nginx + HTTPS on the VPS, auto-restart, schema auto-sync. |

---

## 2. What is simulated, and what turning it real requires

The app was built so each simulated layer upgrades **via configuration, not
code changes** — except payments, which needs a Stripe integration.

| Simulated today | To make it real | Effort |
| --- | --- | --- |
| Shared demo login | Clerk production keys | ~30 min, config only |
| Mock AI replies | Anthropic/OpenAI API key | ~10 min, config only |
| Manual plan upgrades | Stripe Checkout + webhook | 1–2 dev days |
| DFY requests sit in DB | Email notification (SMTP/Resend) | ~half a dev day |

---

## 3. Go-live checklist

### P0 — before announcing to real users

1. **Enable real authentication (Clerk)**
   - Create a production instance at <https://dashboard.clerk.com> for
     `agentstudio.tech`; add the DNS records Clerk asks for.
   - On the server, set in `/opt/agentstudio/.env`:
     `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_…` and `CLERK_SECRET_KEY=sk_live_…`
   - Rebuild: `cd /opt/agentstudio && docker compose up -d --build`
     (the publishable key is baked in at build time).
   - Verify: `/sign-up` shows a real Clerk form; new users get their own
     empty workspace.
   - Note: existing demo-mode data stays under the `demo-user` row and
     simply stops being reachable — no cleanup required.

2. **Enable real AI**
   - Get an Anthropic key (<https://console.anthropic.com>) and/or OpenAI key.
   - Set `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` in `.env`, rebuild as above.
   - Set **billing limits in the provider console** (hard cap + alert) —
     plan limits protect you per-user, provider caps protect you globally.
   - Decide whether the public landing demo uses real AI
     (`DEMO_USE_REAL_AI=true`) — recommended **only after** adding rate
     limiting (P1), otherwise leave it on the mock.

3. **Legal pages** *(✅ built 2026-07-27 — needs your company details)*
   - `/legal/privacy`, `/legal/terms`, `/legal/imprint` exist and are linked
     in the footer.
   - **Action required:** fill in the real company name, address,
     representative, register/VAT entries in `src/lib/company.ts` (single
     file, bracketed placeholders render on the live pages until you do),
     then redeploy. Have the wording reviewed by a lawyer — it is a sensible
     template, not legal advice.

4. **Working email addresses**
   - The UI references `sales@agentstudio.tech`. Create the mailbox (or an
     alias) so upgrade requests and DFY replies actually reach you.

5. **Database backups** *(documented but not yet scheduled on the server)*
   - Install the nightly pg_dump cron from DEPLOY.md §6. Two minutes.

### P1 — first weeks with real users

6. **DFY request notifications** *(✅ built 2026-07-27 — needs credentials)*
   — every new done-for-you request now emails the team automatically once
   you set either `RESEND_API_KEY` **or** `SMTP_HOST`/`SMTP_PORT`/
   `SMTP_USER`/`SMTP_PASS` in `/opt/agentstudio/.env` (recipient:
   `NOTIFY_EMAIL_TO`, default sales@agentstudio.tech), then
   `docker compose up -d --build`. Until then requests are stored in the DB
   only (§4) and the app logs a "email not configured" line.
7. **Rate limiting** on `/api/demo-chat` (per-IP) before pointing real AI
   at anonymous traffic.
8. **Analytics** — Plausible or Umami (self-hostable on the same VPS) for
   conversion tracking; landing CTAs are already distinct URLs.
9. **Uptime monitoring** — a free ping service (UptimeRobot etc.) on
   `https://agentstudio.tech` + `/api/demo-chat`.
10. **Error monitoring** — Sentry's free tier wires into Next.js in an hour.

### P2 — when revenue justifies it

11. **Stripe self-serve checkout** — replace the mailto upgrade flow with
    Stripe Checkout + customer portal + webhook that flips `User.plan`.
    Env slots (`STRIPE_*`) already exist in `.env.example`.
12. **Knowledge-base file upload** (the button is a disabled placeholder).
13. **Embeddable chat widget** for customers' own websites (mentioned in FAQ
    as roadmap).
14. **Transactional product emails** — welcome, limit-warning at 80%, monthly
    usage summary.

---

## 4. Operating handbook (until the automation exists)

All commands run on the VPS (`ssh root@vps47388.alfahosting-vps.de`, then
`cd /opt/agentstudio`).

**Read new done-for-you requests:**

```bash
docker compose exec db psql -U agentstudio agentstudio -c \
  "SELECT \"createdAt\", name, email, company, \"agentType\", budget, timeline, left(description,120) AS description, status FROM \"CustomRequest\" ORDER BY \"createdAt\" DESC LIMIT 20;"
```

**Mark a request handled:**

```bash
docker compose exec db psql -U agentstudio agentstudio -c \
  "UPDATE \"CustomRequest\" SET status='contacted' WHERE id='REQUEST_ID';"
```

**Upgrade a customer's plan** (after they've paid you by invoice/transfer):

```bash
docker compose exec db psql -U agentstudio agentstudio -c \
  "UPDATE \"User\" SET plan='growth' WHERE email='customer@example.com';"
```

Valid plans: `starter`, `growth`, `enterprise`. The new limits apply on
their next page load — no restart needed.

**Watch logs / restart / update:** see DEPLOY.md §5–6.

---

## 5. Monthly running costs (estimate)

| Item | Cost |
| --- | --- |
| VPS (already owned, shared with other sites) | €0 extra |
| Clerk | free to 10k MAU |
| Anthropic/OpenAI usage | usage-based — with Growth users at 5k msgs/mo, roughly $1–5 per active user with a small model; set provider caps |
| Domain + TLS | already owned / free (Let's Encrypt) |
| Plausible/Sentry/UptimeRobot | free tiers to start |

The only meaningful variable cost is AI usage — which is why per-plan
message limits and provider-side caps are both in place before enabling
real models for anonymous visitors.
