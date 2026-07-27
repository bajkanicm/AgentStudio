import Link from "next/link";
import { cn } from "@/lib/utils";

/** hey247 wordmark: "hey" + orange "24" + "7" (deck branding). */
export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-baseline font-logo text-2xl font-bold tracking-tight",
        className
      )}
    >
      <span>hey</span>
      <span className="text-primary">24</span>
      <span>7</span>
    </Link>
  );
}

/** Small phone-bot mark used in chat headers and the favicon-style badge. */
export function BotMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 3v3" />
      <rect x="4" y="6" width="16" height="12" rx="3" />
      <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
      <path d="M9 15.5h6" />
    </svg>
  );
}
