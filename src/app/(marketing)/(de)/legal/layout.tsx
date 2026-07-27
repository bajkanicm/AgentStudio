import { LEGAL_LAST_UPDATED } from "@/lib/company";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-16">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <article
          className="
            [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight sm:[&_h1]:text-4xl
            [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight
            [&_h3]:mt-6 [&_h3]:font-semibold
            [&_p]:mt-4 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground
            [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:text-sm [&_ul]:text-muted-foreground
            [&_a]:text-primary [&_a:hover]:underline
            [&_strong]:text-foreground
          "
        >
          {children}
          <p className="mt-12 border-t border-border pt-6 text-xs">
            Last updated: {LEGAL_LAST_UPDATED}
          </p>
        </article>
      </div>
    </div>
  );
}
