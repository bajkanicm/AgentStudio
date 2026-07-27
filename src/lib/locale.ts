export type Locale = "de" | "en";

/** Prefix a path for the locale: German lives at the root, English under /en. */
export function localeHref(locale: Locale, path: string): string {
  if (locale === "de") return path;
  if (path === "/") return "/en";
  if (path.startsWith("/#")) return `/en${path.slice(1)}`; // "/#demo" → "/en#demo"
  return `/en${path}`;
}
