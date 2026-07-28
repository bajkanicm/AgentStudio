"use client";

import { useRouter } from "next/navigation";
import { LANG_COOKIE, type Lang } from "@/lib/lang-shared";
import { cn } from "@/lib/utils";

/** Kleiner DE|EN-Umschalter für Auth-Seiten (Cookie + Refresh). */
export function LangToggle({ lang }: { lang: Lang }) {
  const router = useRouter();
  const set = (next: Lang) => {
    if (next === lang) return;
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-border bg-card/60 p-0.5 text-xs font-semibold">
      {(["de", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => set(l)}
          className={cn(
            "rounded-full px-2.5 py-1 uppercase transition-colors",
            l === lang ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
