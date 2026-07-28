"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANG_COOKIE, type Lang } from "@/lib/lang";
import { Check, Globe, LogOut } from "lucide-react";

/**
 * Eigenes Konto-Menü (ersetzt Clerks UserButton — kein sichtbares
 * Clerk-Branding) mit Sprachumschalter.
 */
export function UserMenu({
  name,
  email,
  initials,
  lang,
  canSignOut,
}: {
  name: string;
  email: string;
  initials: string;
  lang: Lang;
  canSignOut: boolean;
}) {
  const router = useRouter();

  const setLang = (next: Lang) => {
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  const signOut = () => {
    // Clerk hängt seine Instanz an window — funktioniert ohne Hook und
    // bricht im Demo-Modus (kein Provider) nicht.
    const clerk = (window as unknown as { Clerk?: { signOut: (o?: object) => Promise<void> } }).Clerk;
    if (clerk) void clerk.signOut({ redirectUrl: "/sign-in" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex size-10 items-center justify-center rounded-full bg-[#7fa69c] text-xs font-bold text-[#0a2c26] outline-none ring-primary/50 focus-visible:ring-2"
          aria-label={lang === "en" ? "Account menu" : "Konto-Menü"}
        >
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="theme-paper w-56">
        <DropdownMenuLabel>
          <span className="block truncate">{name}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
          <Globe className="size-3.5" />
          {lang === "en" ? "Language" : "Sprache"}
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setLang("de")}>
          Deutsch {lang === "de" && <Check className="ml-auto size-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLang("en")}>
          English {lang === "en" && <Check className="ml-auto size-4" />}
        </DropdownMenuItem>
        {canSignOut && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="size-4" />
              {lang === "en" ? "Sign out" : "Abmelden"}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
