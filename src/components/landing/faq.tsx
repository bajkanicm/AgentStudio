import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Do I need my own AI API keys?",
    a: "No. AgentStudio works out of the box. If you add an Anthropic (Claude) or OpenAI key, your agents automatically use those models — and you can route each agent to the model you prefer on the Growth plan.",
  },
  {
    q: "What can I customize on an agent?",
    a: "Everything that matters: its name, the full system prompt, tone of voice, creativity (temperature), and a knowledge base of your docs, FAQs and policies. Save as many variations as your plan allows and reuse them anytime.",
  },
  {
    q: "What does “Done-for-you” include?",
    a: "A discovery call to find your highest-ROI workflow, then our team designs, builds, integrates and manages custom agents for you — including connections to tools like your CRM or helpdesk, ongoing tuning, and support. Typical delivery is 2–4 weeks.",
  },
  {
    q: "Is there really a free plan?",
    a: "Yes — Starter is free forever: all four agent templates, the full customization panel, and 200 messages a month. No credit card required.",
  },
  {
    q: "Can agents be embedded in my website or product?",
    a: "The platform is API-first, and embeddable widgets are on the near-term roadmap. Enterprise customers can get custom embeds and white-labeling today via the done-for-you track.",
  },
  {
    q: "How is my data handled?",
    a: "Your prompts, conversations and knowledge bases are stored in your workspace and isolated per user. We don't train models on your data. Enterprise plans add security review, SLAs and custom data-retention policies.",
  },
];

export function FAQ() {
  return (
    <Accordion type="single" collapsible className="mx-auto w-full max-w-3xl">
      {FAQS.map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger className="text-left text-base hover:no-underline">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
