import type { Metadata } from "next";
import { CustomRequestForm } from "@/components/custom-request-form";
import { Reveal } from "@/components/landing/reveal";
import { Testimonials } from "@/components/landing/testimonials";
import {
  ClipboardList,
  Hammer,
  LifeBuoy,
  Rocket,
  BadgeCheck,
  Plug,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Done-for-you AI Agents",
  description:
    "Want us to build and manage AI agents for you? Our team designs, builds, integrates and manages custom agents for your business. Book a free discovery call.",
};

const PROCESS = [
  {
    icon: ClipboardList,
    title: "Discovery",
    days: "Day 1–3",
    description:
      "A free call to map your workflows and find the highest-ROI agent. You get a concrete proposal with scope and pricing.",
  },
  {
    icon: Hammer,
    title: "Build",
    days: "Week 1–2",
    description:
      "We craft the prompts, wire the knowledge base, and integrate your tools — CRM, helpdesk, data warehouse, anything with an API.",
  },
  {
    icon: Rocket,
    title: "Launch",
    days: "Week 2–4",
    description:
      "Your agent goes live with your team trained on it. We watch every conversation in the first weeks and tune aggressively.",
  },
  {
    icon: LifeBuoy,
    title: "Manage",
    days: "Ongoing",
    description:
      "We keep improving accuracy, expand capabilities, and stay on call. You get reports that show impact, not vanity metrics.",
  },
];

const INCLUDED = [
  { icon: BadgeCheck, text: "Custom system prompts engineered and tested for your use case" },
  { icon: Plug, text: "Integrations with your existing stack (CRM, helpdesk, Slack, data)" },
  { icon: RefreshCcw, text: "Continuous tuning based on real conversations" },
  { icon: ShieldCheck, text: "Security review, SLA and white-label options" },
];

export default function DoneForYouPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="bg-grid bg-grid-fade absolute inset-0 -z-10" aria-hidden />
        <div
          className="animate-aurora absolute -top-24 left-1/2 -z-10 h-[340px] w-[600px] -translate-x-1/2 rounded-full bg-fuchsia-600/20 blur-[110px]"
          aria-hidden
        />
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-400">
            Done-for-you
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
            Want us to build and manage
            <br />
            <span className="text-gradient">AI agents for you?</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Skip the setup entirely. Tell our team what your business needs and
            we&apos;ll design, build, integrate and manage custom agents that
            actually move your numbers.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            From first call to live agent in weeks
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((step, i) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-border bg-card p-6"
              >
                <span className="absolute right-5 top-5 text-4xl font-bold text-border">
                  {i + 1}
                </span>
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-fuchsia-500/15 text-fuchsia-400">
                  <step.icon className="size-5" />
                </span>
                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-fuchsia-400">
                  {step.days}
                </p>
                <h3 className="mt-1 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Included + form */}
      <section id="request" className="scroll-mt-20 py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:gap-16 lg:px-8">
          <Reveal className="lg:col-span-2">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Every engagement includes
            </h2>
            <ul className="mt-8 space-y-5">
              {INCLUDED.map((item) => (
                <li key={item.text} className="flex items-start gap-3.5">
                  <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-fuchsia-500/15 text-fuchsia-400">
                    <item.icon className="size-4" />
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-2xl border border-border bg-card p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                “I asked their team to build us a custom onboarding agent. Two
                weeks later it was live inside our product. Zero engineering
                time on our side.”
              </p>
              <p className="mt-4 text-sm font-medium">Sofia L. · COO, Finlayer</p>
            </div>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="text-xl font-semibold">Tell us what you need</h2>
              <p className="mt-1 mb-6 text-sm text-muted-foreground">
                We reply within one business day with next steps and a proposed
                time for your free discovery call.
              </p>
              <CustomRequestForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Social proof */}
      <section className="mx-auto max-w-7xl px-4 py-16 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <Testimonials />
        </Reveal>
      </section>
    </div>
  );
}
