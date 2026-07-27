import { MousePointerClick, SlidersHorizontal, Send } from "lucide-react";

const STEPS = [
  {
    icon: MousePointerClick,
    step: "01",
    title: "Pick a template",
    description:
      "Choose Sales, Support, Content or Data. Each ships with a proven system prompt and example conversations.",
  },
  {
    icon: SlidersHorizontal,
    step: "02",
    title: "Make it yours",
    description:
      "Rename it, rewrite the prompt, set the tone and temperature, and paste in your company knowledge.",
  },
  {
    icon: Send,
    step: "03",
    title: "Put it to work",
    description:
      "Chat in the playground, save your agent, and reuse it across your workflows. Upgrade when you need more volume.",
  },
];

export function HowItWorks() {
  return (
    <div className="relative grid gap-6 md:grid-cols-3">
      {/* Connector line */}
      <div
        className="absolute left-[16%] right-[16%] top-12 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block"
        aria-hidden
      />
      {STEPS.map((s) => (
        <div key={s.step} className="relative text-center md:px-4">
          <div className="glow-primary relative z-10 mx-auto flex size-24 items-center justify-center rounded-2xl border border-primary/30 bg-card">
            <s.icon className="size-8 text-primary" />
            <span className="absolute -right-2 -top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
              {s.step}
            </span>
          </div>
          <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {s.description}
          </p>
        </div>
      ))}
    </div>
  );
}
