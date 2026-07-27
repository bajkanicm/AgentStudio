import type { Metadata } from "next";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of AgentStudio.",
};

export default function TermsPage() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p>
        These terms govern your use of AgentStudio, operated by{" "}
        {COMPANY.legalName} (“we”). By creating an account or using the
        service you agree to them.
      </p>

      <h2>1. The service</h2>
      <p>
        AgentStudio lets you configure and chat with AI agents, and to request
        custom agents built by our team (“done-for-you”). Features depend on
        your plan as described on the pricing page.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You must provide accurate information and keep your credentials
        secure. You are responsible for activity in your workspace. You must
        be at least 18, or the age of majority in your jurisdiction, and use
        the service for business purposes.
      </p>

      <h2>3. Acceptable use</h2>
      <ul>
        <li>No unlawful, harmful, or deceptive use — including impersonation, spam, or generating content that violates others&apos; rights.</li>
        <li>No attempts to probe, overload, or disrupt the service or to circumvent plan limits.</li>
        <li>You are responsible for content you put into agents (prompts, knowledge bases) and for how you use generated output.</li>
      </ul>

      <h2>4. AI output disclaimer</h2>
      <p>
        AI-generated responses can be inaccurate or incomplete.{" "}
        <strong>
          Output is provided for information only and is not professional,
          legal, financial, or medical advice.
        </strong>{" "}
        Review output before relying on it or sending it to your customers.
      </p>

      <h2>5. Plans, fees &amp; changes</h2>
      <p>
        The Starter plan is free. Paid plans are billed as agreed at purchase;
        prices and limits are shown on the pricing page and may change with
        reasonable notice for future billing periods. Done-for-you engagements
        are governed by their individual proposal/contract.
      </p>

      <h2>6. Your content &amp; our IP</h2>
      <p>
        You retain all rights to content you submit and, to the extent
        permitted by law, to output generated for you. We retain all rights to
        the platform itself. You grant us the limited licence needed to store
        and process your content to operate the service. We do not use your
        content to train models.
      </p>

      <h2>7. Availability &amp; support</h2>
      <p>
        We aim for high availability but the service is provided without a
        guaranteed uptime unless agreed in an Enterprise SLA. Support channels
        depend on your plan.
      </p>

      <h2>8. Liability</h2>
      <p>
        We are liable without limitation for intent and gross negligence. For
        simple negligence we are liable only for breaches of essential
        contractual obligations, limited to typical foreseeable damage.
        Liability for data loss is limited to the restoration effort that
        would have been necessary with proper backups on your side.
      </p>

      <h2>9. Termination</h2>
      <p>
        You may stop using the service and delete your account at any time. We
        may suspend or terminate accounts that violate these terms. Upon
        termination your stored content is deleted in line with the privacy
        policy.
      </p>

      <h2>10. Governing law</h2>
      <p>
        German law applies, excluding the UN Convention on Contracts for the
        International Sale of Goods. For merchants, the place of jurisdiction
        is our registered seat.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these terms:{" "}
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
      </p>
    </>
  );
}
