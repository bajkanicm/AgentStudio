import Link from "next/link";
import { Logo } from "@/components/logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Live Demo", href: "/#demo" },
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Done-for-you Agents", href: "/done-for-you" },
      { label: "Book a Call", href: "/done-for-you#request" },
      { label: "Enterprise", href: "/pricing" },
    ],
  },
  {
    title: "Agents",
    links: [
      { label: "Sales Qualification", href: "/#demo" },
      { label: "Customer Support", href: "/#demo" },
      { label: "Content & Marketing", href: "/#demo" },
      { label: "Data Analyst", href: "/#demo" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-black/20">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI agents that work for you — use them yourself, customize them
              fully, or let our team build them for you.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AgentStudio · agentstudio.tech
          </p>
          <p className="text-xs text-muted-foreground">
            Built for teams who want AI that actually ships work.
          </p>
        </div>
      </div>
    </footer>
  );
}
