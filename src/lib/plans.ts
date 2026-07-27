export type PlanId = "starter" | "growth" | "enterprise";

export interface Plan {
  id: PlanId;
  name: string;
  price: string;
  priceNote: string;
  tagline: string;
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
  limits: {
    messagesPerMonth: number; // -1 = unlimited
    agents: number; // -1 = unlimited
    knowledgeBaseChars: number;
  };
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    priceNote: "forever free",
    tagline: "Everything you need to try AI agents on real work.",
    cta: "Start Free",
    ctaHref: "/sign-up",
    limits: { messagesPerMonth: 200, agents: 3, knowledgeBaseChars: 20_000 },
    features: [
      "All 4 ready-made agent templates",
      "200 messages / month",
      "Up to 3 saved custom agents",
      "Full customization panel",
      "Chat playground with streaming",
      "Community support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: "$49",
    priceNote: "per month",
    tagline: "For teams putting agents in front of customers.",
    cta: "Upgrade to Growth",
    ctaHref: "/dashboard/billing",
    highlighted: true,
    limits: { messagesPerMonth: 5000, agents: -1, knowledgeBaseChars: 500_000 },
    features: [
      "Everything in Starter",
      "5,000 messages / month",
      "Unlimited saved agents",
      "GPT + Claude model routing",
      "Larger knowledge bases (500k chars)",
      "Priority email support",
      "Usage analytics",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    priceNote: "annual contract",
    tagline: "Done-for-you agents, built and managed by our team.",
    cta: "Book a Call",
    ctaHref: "/done-for-you",
    limits: { messagesPerMonth: -1, agents: -1, knowledgeBaseChars: -1 },
    features: [
      "Everything in Growth",
      "Unlimited messages & agents",
      "Custom agents built by our team",
      "Private integrations (CRM, helpdesk, data)",
      "Dedicated success manager",
      "SLA & security review",
      "White-label options",
    ],
  },
];

export function getPlan(id: string): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}
