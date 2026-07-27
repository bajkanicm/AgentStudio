/**
 * Team email notifications (e.g. new done-for-you requests).
 *
 * Providers, tried in order:
 *  1. Resend  — set RESEND_API_KEY (simplest: resend.com, free tier)
 *  2. SMTP    — set SMTP_HOST (+ SMTP_PORT/SMTP_USER/SMTP_PASS), e.g. your
 *               Alfahosting mailbox
 *  3. Neither — logs and skips, never breaks the calling request.
 *
 * Recipient/sender via NOTIFY_EMAIL_TO / NOTIFY_EMAIL_FROM.
 */

const TO = process.env.NOTIFY_EMAIL_TO ?? "sales@agentstudio.tech";
const FROM = process.env.NOTIFY_EMAIL_FROM ?? "AgentStudio <notifications@agentstudio.tech>";

export async function notifyTeam(subject: string, text: string): Promise<void> {
  try {
    if (process.env.RESEND_API_KEY) {
      await sendViaResend(subject, text);
      return;
    }
    if (process.env.SMTP_HOST) {
      await sendViaSmtp(subject, text);
      return;
    }
    console.log(
      `[notify] email not configured (set RESEND_API_KEY or SMTP_HOST) — skipping "${subject}"`
    );
  } catch (err) {
    // Notifications must never fail the user-facing request.
    console.error(`[notify] failed to send "${subject}":`, err);
  }
}

async function sendViaResend(subject: string, text: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [TO], subject, text }),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}

async function sendViaSmtp(subject: string, text: string) {
  const { default: nodemailer } = await import("nodemailer");
  const port = Number(process.env.SMTP_PORT ?? 587);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  await transport.sendMail({ from: FROM, to: TO, subject, text });
}
