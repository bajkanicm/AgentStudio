import { db } from "@/lib/db";

/**
 * Clerk is enabled when both keys are configured. Without keys the app runs
 * in "demo mode": the dashboard is usable under a shared demo user so the
 * product can be evaluated before wiring up Clerk. See README/DEPLOY.md.
 */
export const clerkEnabled = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

export const DEMO_USER_ID = "demo-user";

/** Returns the current user id, or null when signed out (Clerk mode only). */
export async function getUserId(): Promise<string | null> {
  if (!clerkEnabled) return DEMO_USER_ID;
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  return userId;
}

/**
 * Returns the current user id and lazily ensures a matching User row exists.
 */
export async function requireDbUser() {
  if (!clerkEnabled) {
    const user = await db.user.upsert({
      where: { id: DEMO_USER_ID },
      update: {},
      create: { id: DEMO_USER_ID, email: "demo@agentstudio.tech", name: "Demo User" },
    });
    return user;
  }
  const { auth, currentUser } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) return null;
  const existing = await db.user.findUnique({ where: { id: userId } });
  if (existing) return existing;
  const clerkUser = await currentUser();
  // Upsert: Layout und Page rufen dies parallel auf — create würde beim
  // ersten Login an der Unique-Constraint scheitern (P2002-Race).
  return db.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: clerkUser?.primaryEmailAddress?.emailAddress ?? null,
      name:
        [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
        clerkUser?.username ||
        null,
    },
  });
}
