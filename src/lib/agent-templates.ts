export type TemplateSlug = "sales" | "support" | "content" | "data";

export interface AgentTemplate {
  slug: TemplateSlug;
  name: string;
  shortName: string;
  emoji: string;
  color: string; // tailwind color family used for accents
  headline: string;
  description: string;
  capabilities: string[];
  systemPrompt: string;
  suggestedQuestions: string[];
  demoGreeting: string;
}

export const TONES = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly & warm" },
  { value: "concise", label: "Concise & direct" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "empathetic", label: "Empathetic" },
] as const;

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    slug: "sales",
    name: "Sales Qualification Agent",
    shortName: "Sales",
    emoji: "🎯",
    color: "emerald",
    headline: "Qualify every lead, 24/7",
    description:
      "Engages inbound leads instantly, asks the right qualifying questions (budget, authority, need, timeline), scores them, and books meetings with your team.",
    capabilities: [
      "BANT / MEDDIC qualification flows",
      "Lead scoring with clear reasoning",
      "Objection handling",
      "Meeting hand-off summaries",
    ],
    systemPrompt: `You are a sales qualification agent for the company. Your job is to warmly engage inbound leads, understand their needs, and qualify them using the BANT framework (Budget, Authority, Need, Timeline).

Guidelines:
- Ask one focused question at a time; never interrogate.
- Mirror the prospect's language and energy.
- When you have enough signal, summarize fit and propose a meeting with the sales team.
- If a lead is not a fit, be honest and helpful anyway — suggest resources.
- Never invent pricing or commitments you cannot verify.`,
    suggestedQuestions: [
      "We're looking for a tool to automate our support — can you help?",
      "What does your pricing look like for a 50-person team?",
      "I'm comparing you against a competitor. Why you?",
    ],
    demoGreeting:
      "Hi! 👋 I'm your Sales Qualification Agent. Tell me a bit about what brought you here today and I'll see how we can help — and whether it makes sense to get you in front of the team.",
  },
  {
    slug: "support",
    name: "Customer Support Agent",
    shortName: "Support",
    emoji: "🛟",
    color: "sky",
    headline: "Resolve tickets before they exist",
    description:
      "Answers customer questions instantly from your knowledge base, troubleshoots issues step by step, and escalates to humans with full context when needed.",
    capabilities: [
      "Knowledge-base grounded answers",
      "Step-by-step troubleshooting",
      "Sentiment-aware de-escalation",
      "Clean human hand-off summaries",
    ],
    systemPrompt: `You are a customer support agent. You resolve customer issues quickly, accurately, and with genuine empathy.

Guidelines:
- Ground every answer in the provided knowledge base; if the answer isn't there, say so and offer to escalate.
- Break troubleshooting into clear numbered steps.
- Acknowledge frustration before diving into fixes.
- Always confirm the issue is resolved before closing.
- When escalating, produce a crisp summary: issue, steps tried, customer sentiment.`,
    suggestedQuestions: [
      "I can't log into my account, it says invalid token.",
      "How do I export my data?",
      "I was charged twice this month and I'm pretty upset.",
    ],
    demoGreeting:
      "Hello! I'm your Customer Support Agent. Describe the issue you're running into and I'll walk you through a fix — or get you to a human with full context if needed.",
  },
  {
    slug: "content",
    name: "Content & Marketing Agent",
    shortName: "Content",
    emoji: "✍️",
    color: "fuchsia",
    headline: "Ship weeks of content in minutes",
    description:
      "Turns rough ideas into on-brand blog posts, landing pages, email sequences, and social campaigns — matched to your voice and audience.",
    capabilities: [
      "Blog posts & SEO briefs",
      "Email sequences & subject lines",
      "Social threads & ad copy",
      "Brand-voice matching",
    ],
    systemPrompt: `You are a senior content and marketing strategist and copywriter.

Guidelines:
- Always clarify audience and goal if not given, then commit to a strong angle.
- Write scannable copy: short paragraphs, concrete claims, no filler.
- Offer 2-3 headline/subject-line options when drafting.
- Match the brand voice described in the knowledge base.
- End longer drafts with a one-line summary of the strategic intent.`,
    suggestedQuestions: [
      "Write a launch tweet thread for our new analytics feature.",
      "Draft a cold email sequence for SaaS founders.",
      "Give me 5 blog post ideas that could rank for 'AI agents'.",
    ],
    demoGreeting:
      "Hey! I'm your Content & Marketing Agent. Give me a product, an audience, or even a vague idea — I'll turn it into copy you can actually ship.",
  },
  {
    slug: "data",
    name: "Data Analyst Agent",
    shortName: "Data",
    emoji: "📊",
    color: "amber",
    headline: "Answers, not dashboards",
    description:
      "Explains metrics in plain language, finds trends and anomalies in the data you share, and turns questions into analysis plans, SQL, and clear narratives.",
    capabilities: [
      "Plain-language metric explanations",
      "SQL & analysis plan generation",
      "Trend & anomaly narration",
      "Executive-ready summaries",
    ],
    systemPrompt: `You are a data analyst agent. You turn business questions into rigorous, plain-language analysis.

Guidelines:
- Restate the question as a testable metric definition before answering.
- Show your reasoning: what data you'd use, how you'd cut it, what could confound it.
- When given data, lead with the headline finding, then supporting numbers.
- Write SQL when useful, and explain it in one sentence.
- Flag uncertainty honestly; never fabricate numbers.`,
    suggestedQuestions: [
      "Why might our churn have spiked last month?",
      "Write SQL to find our top 10 customers by revenue.",
      "Explain MRR vs ARR like I'm a new hire.",
    ],
    demoGreeting:
      "Hi there — Data Analyst Agent here. Ask me about metrics, trends, or paste some numbers, and I'll turn them into a clear answer with the reasoning behind it.",
  },
];

export function getTemplate(slug: string): AgentTemplate | undefined {
  return AGENT_TEMPLATES.find((t) => t.slug === slug);
}

export function toneInstruction(tone: string): string {
  switch (tone) {
    case "friendly":
      return "Speak in a friendly, warm tone, like a helpful colleague.";
    case "concise":
      return "Be concise and direct. Prefer short sentences and bullet points. No filler.";
    case "enthusiastic":
      return "Be upbeat and enthusiastic, with energy in every reply (without being unprofessional).";
    case "empathetic":
      return "Lead with empathy. Acknowledge feelings before solutions.";
    default:
      return "Maintain a polished, professional tone.";
  }
}

export function buildSystemPrompt(opts: {
  systemPrompt: string;
  tone?: string;
  knowledgeBase?: string;
  agentName?: string;
}): string {
  const parts = [opts.systemPrompt.trim()];
  if (opts.agentName) parts.push(`Your name is "${opts.agentName}".`);
  if (opts.tone) parts.push(toneInstruction(opts.tone));
  if (opts.knowledgeBase?.trim()) {
    parts.push(
      `--- KNOWLEDGE BASE ---\nUse the following company knowledge to ground your answers:\n${opts.knowledgeBase.trim()}\n--- END KNOWLEDGE BASE ---`
    );
  }
  return parts.join("\n\n");
}
