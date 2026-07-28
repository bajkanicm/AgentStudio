import { cookies } from "next/headers";

export type Lang = "de" | "en";

export const LANG_COOKIE = "hey247_lang";

/** App-UI-Sprache (Dashboard/Auth) aus dem Cookie; Standard Deutsch. */
export async function getLang(): Promise<Lang> {
  const store = await cookies();
  return store.get(LANG_COOKIE)?.value === "en" ? "en" : "de";
}
