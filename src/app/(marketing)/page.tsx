import { Hero } from "@/components/landing/hero";
import { LogoStrip } from "@/components/landing/logos";
import { LiveDemo } from "@/components/landing/live-demo";
import { Paths } from "@/components/landing/paths";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { PricingCards } from "@/components/pricing-cards";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";
import { Reveal } from "@/components/landing/reveal";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <LogoStrip />

      {/* Live demo */}
      <Section
        id="demo"
        eyebrow="Live demo"
        title="Talk to an agent right now"
        subtitle="No sign-up needed. Pick an agent and have a real conversation — this is the exact product you get."
      >
        <LiveDemo />
      </Section>

      {/* Two paths */}
      <Section
        id="paths"
        eyebrow="Two ways to win"
        title="Use it yourself, or let us build it for you"
        subtitle="Start self-serve in minutes — and when you want agents deeply wired into your business, our team takes over."
      >
        <Paths />
      </Section>

      {/* How it works */}
      <Section
        id="how"
        eyebrow="How it works"
        title="From template to teammate in three steps"
      >
        <HowItWorks />
      </Section>

      {/* Features */}
      <Section
        id="features"
        eyebrow="Feature breakdown"
        title="Everything you need to run agents in production"
        subtitle="A complete platform — not a prompt in a text box."
      >
        <Features />
      </Section>

      {/* Social proof */}
      <Section
        id="testimonials"
        eyebrow="Social proof"
        title="Teams are shipping real work with agents"
      >
        <Testimonials />
      </Section>

      {/* Pricing */}
      <Section
        id="pricing"
        eyebrow="Pricing"
        title="Transparent pricing, from free to fully managed"
        subtitle="Start free. Upgrade when your agents earn it."
      >
        <PricingCards />
      </Section>

      {/* FAQ */}
      <Section id="faq" eyebrow="FAQ" title="Questions, answered">
        <FAQ />
      </Section>

      {/* Final CTA */}
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <FinalCTA />
        </Reveal>
      </div>
    </>
  );
}

function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{subtitle}</p>
          )}
        </Reveal>
        <Reveal delay={100}>{children}</Reveal>
      </div>
    </section>
  );
}
