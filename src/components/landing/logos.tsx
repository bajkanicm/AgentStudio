const COMPANIES = [
  "Northwind Labs",
  "Vertex & Co",
  "Bluepeak SaaS",
  "Orbital CRM",
  "Finlayer",
  "Craftbase",
  "Hexaform",
  "Statwise",
  "Lumen Retail",
  "Pathlight HR",
];

/** Social-proof logo strip (text marks as placeholders until real logos land). */
export function LogoStrip() {
  const row = [...COMPANIES, ...COMPANIES];
  return (
    <div className="border-y border-border/40 bg-black/20 py-8">
      <p className="mb-6 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Trusted by operators at growing companies
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="animate-marquee flex w-max gap-14 pr-14">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap text-sm font-medium tracking-wide text-muted-foreground/70"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
