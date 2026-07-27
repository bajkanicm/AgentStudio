import type { GenerateOptions } from "./index";

/**
 * Built-in mock model. Produces believable, template-aware responses and
 * streams them word-by-word so the product is fully demoable with zero API
 * keys. Swapped out automatically as soon as OPENAI_API_KEY or
 * ANTHROPIC_API_KEY is configured.
 */
export async function* mockCompletionStream(
  opts: GenerateOptions
): AsyncGenerator<string> {
  const lastUser =
    [...opts.messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const reply = composeReply(opts.templateSlug ?? inferSlug(opts.system), lastUser, opts);

  // Stream in small word groups with a natural cadence.
  const words = reply.split(/(\s+)/);
  for (let i = 0; i < words.length; i += 2) {
    yield words.slice(i, i + 2).join("");
    await sleep(18 + Math.random() * 30);
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function inferSlug(system: string): string {
  const s = system.toLowerCase();
  if (s.includes("sales") || s.includes("bant")) return "sales";
  if (s.includes("support")) return "support";
  if (s.includes("content") || s.includes("copywriter")) return "content";
  if (s.includes("analyst") || s.includes("data")) return "data";
  return "general";
}

function composeReply(slug: string, userText: string, opts: GenerateOptions): string {
  const t = userText.toLowerCase();
  const kb = extractKb(opts.system);
  const kbNote = kb
    ? `\n\n_(Grounded in your knowledge base: "${kb.slice(0, 120)}${kb.length > 120 ? "…" : ""}")_`
    : "";

  switch (slug) {
    case "sales":
      if (t.includes("pricing") || t.includes("price") || t.includes("cost")) {
        return `Great question — pricing depends a lot on team size and usage, so let me make sure I point you to the right plan.\n\nA few quick questions:\n1. Roughly how many people would be using this?\n2. Is this replacing an existing tool, or a new initiative?\n3. Do you have a timeline in mind for rolling it out?\n\nOnce I know that, I can tell you whether Starter, Growth, or a custom Enterprise plan fits best — and if it makes sense, get you 15 minutes with our team.${kbNote}`;
      }
      if (t.includes("competitor") || t.includes("comparing") || t.includes("vs")) {
        return `Totally fair — you should compare. Here's the honest version:\n\n- **Where we win:** speed to value. You can customize an agent and put it to work today, or have our team build it for you end-to-end.\n- **Where others may fit better:** if you need on-prem deployment on day one, that's an Enterprise conversation.\n\nWhat's the #1 thing you're evaluating on — price, capability, or time to launch? That'll tell me quickly if we're a fit.`;
      }
      return `Thanks for sharing that — sounds like there's a real need here. To make sure I'm useful, mind if I ask a couple of quick questions?\n\n1. What's the main outcome you're hoping for (more leads, faster response times, less manual work)?\n2. Who else would be involved in a decision like this?\n3. Any rough timeline?\n\nBased on your answers, I'll either point you to the right plan or set up a short call with our team.${kbNote}`;

    case "support":
      if (t.includes("log") || t.includes("password") || t.includes("token")) {
        return `Sorry you're hitting that — login issues are frustrating. Let's fix it step by step:\n\n1. Clear your browser cache, or try an incognito window.\n2. Request a fresh sign-in link/reset — expired tokens are the #1 cause of "invalid token" errors.\n3. Check that your system clock is set automatically (a skewed clock invalidates tokens).\n\nDid step 2 get you back in? If not, tell me what error you see now and I'll escalate with everything we've tried so far.${kbNote}`;
      }
      if (t.includes("charge") || t.includes("refund") || t.includes("billing")) {
        return `I completely understand — unexpected charges are upsetting, and I'll help you get this sorted.\n\nHere's what I can do right now:\n1. I've flagged the duplicate charge for review.\n2. Duplicate charges are typically reversed within 3–5 business days once confirmed.\n3. I'm escalating this to our billing team with priority, including the details you've shared.\n\nCould you confirm the last 4 digits of the invoice number (or the charge date)? That's all I need to finish the escalation.${kbNote}`;
      }
      if (t.includes("export")) {
        return `Absolutely — exporting your data takes about a minute:\n\n1. Go to **Settings → Data & Privacy**.\n2. Click **Export data** and choose CSV or JSON.\n3. You'll get an email with a secure download link (valid for 24 hours).\n\nWant me to also walk you through importing that export into another tool?${kbNote}`;
      }
      return `Thanks for reaching out — I'm on it. To route this correctly, could you tell me:\n\n1. What you were trying to do,\n2. What happened instead (exact error text helps a lot),\n3. When it started.\n\nIf it's urgent, say the word and I'll escalate straight to a human with a full summary of this conversation.${kbNote}`;

    case "content":
      if (t.includes("tweet") || t.includes("thread") || t.includes("social")) {
        return `Here's a launch thread with a strong hook — three options for tweet #1, then the spine of the thread:\n\n**Hook options:**\n1. "We just shipped the feature our users threatened to build themselves."\n2. "Your analytics shouldn't need an analyst. As of today, they don't."\n3. "6 months. 14 prototypes. 1 launch. Here's what we built →"\n\n**Thread spine:**\n2/ The problem — one concrete, painful example.\n3/ What we built — one sentence, one screenshot.\n4/ How it works — 3 bullets max.\n5/ Early result or customer quote.\n6/ CTA with link + a reason to click *today*.\n\n**Strategic intent:** lead with tension, prove with specifics, close with urgency. Want me to write the full thread from option 1?${kbNote}`;
      }
      if (t.includes("email") || t.includes("sequence")) {
        return `Here's a 4-touch cold sequence for SaaS founders — short, specific, no fluff:\n\n**Email 1 (Day 1) — The problem:** 2 sentences on the pain, 1 sentence on what you do, soft CTA ("worth a look?").\n**Email 2 (Day 3) — Proof:** one customer result with a real number. CTA: 15-min call.\n**Email 3 (Day 7) — The objection:** preempt the top objection ("too busy to switch tools") and dissolve it.\n**Email 4 (Day 12) — The breakup:** short, warm, easy out. Highest reply rate of the sequence.\n\n**Subject line options:** "quick question about {{company}}'s support load" · "how {{peer company}} cut response time 60%" · "closing the loop".\n\nWant me to draft the full copy for all four?${kbNote}`;
      }
      return `Love it — here are 5 angles that could actually rank and convert:\n\n1. **"AI agents vs chatbots: what actually changed"** — definitional posts earn links.\n2. **"We let an AI agent run our support queue for 30 days"** — narrative + data = shares.\n3. **"The 4 agent types every SaaS team deploys first"** — maps to search intent, product-adjacent.\n4. **"How to write a system prompt that doesn't embarrass you"** — practical, low competition.\n5. **"Build vs buy: the real cost of DIY AI agents"** — bottom-of-funnel, sales-ready.\n\nMy pick: start with #3 — it matches how buyers search and showcases your product naturally. Want an outline?${kbNote}`;

    case "data":
      if (t.includes("sql")) {
        return `Here's the query:\n\n\`\`\`sql\nSELECT c.name,\n       SUM(i.amount) AS total_revenue\nFROM customers c\nJOIN invoices i ON i.customer_id = c.id\nWHERE i.status = 'paid'\n  AND i.paid_at >= NOW() - INTERVAL '12 months'\nGROUP BY c.name\nORDER BY total_revenue DESC\nLIMIT 10;\n\`\`\`\n\nIn one sentence: it sums paid invoices per customer over the trailing 12 months and returns the top 10.\n\n⚠️ One thing to verify: whether refunds live in \`invoices\` (as negative amounts) or a separate table — that changes the join.${kbNote}`;
      }
      if (t.includes("churn")) {
        return `Let's define it first: churn spike = monthly logo churn meaningfully above your trailing 6-month average.\n\n**Most likely causes, in order of how often I see them:**\n1. **A cohort effect** — a big acquisition month 11–12 months ago hitting annual renewal.\n2. **A pricing or packaging change** — check if churned accounts skew toward one plan.\n3. **A product regression** — overlay churn dates with your deploy/incident log.\n4. **One large multi-seat account** — logo churn vs revenue churn can tell different stories.\n\n**Analysis plan:** cut churned accounts by signup cohort, plan, and seat count; compare against the prior 6 months. If cut #1 lights up, it's renewal timing, not product.\n\nShare the numbers and I'll narrate what they say.${kbNote}`;
      }
      if (t.includes("mrr") || t.includes("arr")) {
        return `Sure — the new-hire version:\n\n**MRR (Monthly Recurring Revenue):** what your subscriptions earn in a month. A $1,200/year customer = $100 MRR.\n\n**ARR (Annual Recurring Revenue):** MRR × 12. Same money, annual lens — used for planning and valuation.\n\n**The catch:** both exclude one-time revenue (setup fees, services). If someone quotes "revenue," ask *recurring or total?* — that question makes you look senior on day one.\n\nWant me to explain expansion vs contraction MRR next? That's the pair that usually follows.${kbNote}`;
      }
      return `Good question. Before I answer, let me restate it as something measurable — that's how we avoid vibes-based analysis.\n\n1. **Metric definition:** what exactly are we measuring, over what window, for which segment?\n2. **Data needed:** which tables/exports hold it, and how fresh are they?\n3. **Confounders:** seasonality, pricing changes, one big account.\n\nPaste some numbers or describe the tables you have, and I'll turn this into a concrete analysis with a headline finding.${kbNote}`;

    default:
      return `Here's my take:\n\n${userText ? `On "${userText.slice(0, 80)}${userText.length > 80 ? "…" : ""}" — ` : ""}I'd break this into three parts: what we know, what we need to find out, and the next concrete step. Tell me a bit more about your context and I'll get specific.${kbNote}`;
  }
}

function extractKb(system: string): string | null {
  const match = system.match(/--- KNOWLEDGE BASE ---\n([\s\S]*?)\n--- END KNOWLEDGE BASE ---/);
  if (!match) return null;
  const kb = match[1].replace(/^Use the following[^\n]*\n/, "").trim();
  return kb || null;
}
