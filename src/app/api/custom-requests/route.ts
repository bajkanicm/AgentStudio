import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { notifyTeam } from "@/lib/notify";

const requestSchema = z.object({
  name: z.string().min(1, "Your name is required").max(120),
  email: z.string().email("A valid email is required").max(200),
  company: z.string().max(200).optional().default(""),
  agentType: z.string().max(100).optional().default(""),
  budget: z.string().max(60).optional().default(""),
  timeline: z.string().max(60).optional().default(""),
  description: z
    .string()
    .min(10, "Tell us a bit more about what you need (at least 10 characters)")
    .max(5000),
});

/** Done-for-you custom agent requests. Public — no account required. */
export async function POST(req: NextRequest) {
  const parsed = requestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  // Attach the workspace when the requester is signed in (never required).
  let userId: string | null = null;
  try {
    userId = await getUserId();
    if (userId) {
      const exists = await db.user.findUnique({ where: { id: userId } });
      if (!exists) userId = null;
    }
  } catch {
    userId = null;
  }

  const request = await db.customRequest.create({
    data: { ...parsed.data, userId },
  });

  const d = parsed.data;
  await notifyTeam(
    `New custom agent request — ${d.name}${d.company ? ` (${d.company})` : ""}`,
    [
      `A new done-for-you request just arrived:`,
      ``,
      `Name:       ${d.name}`,
      `Email:      ${d.email}`,
      `Company:    ${d.company || "—"}`,
      `Agent type: ${d.agentType || "—"}`,
      `Budget:     ${d.budget || "—"}`,
      `Timeline:   ${d.timeline || "—"}`,
      ``,
      `Description:`,
      d.description,
      ``,
      `Request ID: ${request.id}`,
      `Reply to the requester within one business day.`,
    ].join("\n")
  );

  return NextResponse.json({ ok: true, id: request.id }, { status: 201 });
}
