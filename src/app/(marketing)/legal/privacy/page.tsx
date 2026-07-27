import type { Metadata } from "next";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How AgentStudio collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p>
        This policy explains what personal data AgentStudio (
        {COMPANY.legalName}, {COMPANY.address.street}, {COMPANY.address.zipCity},{" "}
        {COMPANY.address.country} — “we”) processes when you use{" "}
        <a href={COMPANY.website}>{COMPANY.website}</a>, and your rights under
        the EU General Data Protection Regulation (GDPR).
      </p>

      <h2>1. What we collect</h2>
      <ul>
        <li>
          <strong>Account data</strong> — when you sign up: email address, name,
          and authentication identifiers. Authentication is operated by our
          processor Clerk Inc.
        </li>
        <li>
          <strong>Content you provide</strong> — agent configurations, system
          prompts, knowledge-base text, and chat messages you exchange with
          agents. This content is stored so you can revisit and reuse it.
        </li>
        <li>
          <strong>Custom-agent requests</strong> — if you submit the
          done-for-you form: name, email, company, budget/timeline selections
          and your project description.
        </li>
        <li>
          <strong>Usage data</strong> — message counts and token estimates per
          workspace, used to enforce plan limits.
        </li>
        <li>
          <strong>Technical data</strong> — our servers and reverse proxy keep
          short-lived logs (IP address, timestamp, requested URL) for security
          and troubleshooting.
        </li>
      </ul>

      <h2>2. What we do NOT do</h2>
      <ul>
        <li>We do not sell personal data.</li>
        <li>We do not use your prompts or knowledge bases to train AI models.</li>
        <li>We do not show third-party advertising or use ad trackers.</li>
      </ul>

      <h2>3. AI processing</h2>
      <p>
        When you chat with an agent, the conversation and the agent&apos;s
        configuration are sent to an AI model provider to generate the reply.
        Depending on configuration this is Anthropic (Claude) or OpenAI (GPT),
        processing on our behalf under their business terms, which exclude
        training on API data. Avoid entering sensitive personal data into
        chats and knowledge bases.
      </p>

      <h2>4. Legal bases</h2>
      <p>
        Art. 6(1)(b) GDPR (performance of contract) for account, content and
        usage data; Art. 6(1)(f) GDPR (legitimate interest in security and
        operation) for technical logs; Art. 6(1)(b) GDPR (pre-contractual
        steps) for done-for-you requests.
      </p>

      <h2>5. Cookies</h2>
      <p>
        We use only cookies that are strictly necessary for the service to
        function — primarily authentication session cookies set by Clerk. We
        set no analytics or advertising cookies.
      </p>

      <h2>6. Processors &amp; recipients</h2>
      <ul>
        <li>Hosting: our virtual server in Germany (Alfahosting GmbH).</li>
        <li>Authentication: Clerk Inc. (USA — EU-U.S. Data Privacy Framework / SCCs).</li>
        <li>AI models: Anthropic PBC and/or OpenAI LLC (USA — SCCs), only when AI features are used.</li>
      </ul>

      <h2>7. Retention</h2>
      <p>
        Account and content data are kept until you delete them or your
        account. Server logs are rotated within days. Done-for-you requests
        are kept as long as needed to handle your inquiry and any resulting
        engagement.
      </p>

      <h2>8. Your rights</h2>
      <p>
        You have the right to access, rectification, erasure, restriction,
        data portability, and objection (Art. 15–21 GDPR), and to lodge a
        complaint with a supervisory authority. Contact:{" "}
        <a href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a>.
      </p>

      <h2>9. Changes</h2>
      <p>
        We will update this policy as the service evolves (for example when
        self-serve payments launch) and note the revision date below.
      </p>
    </>
  );
}
