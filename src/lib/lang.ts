import { cookies } from "next/headers";
import { LANG_COOKIE, type Lang } from "@/lib/lang-shared";

export type { Lang };
export { LANG_COOKIE };

/** App-UI-Sprache (Dashboard/Auth) aus dem Cookie; Standard Deutsch. */
export async function getLang(): Promise<Lang> {
  const store = await cookies();
  return store.get(LANG_COOKIE)?.value === "en" ? "en" : "de";
}
