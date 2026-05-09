import type { Metadata } from "next";
import { BusinessTermsShell } from "@/components/business-terms-shell";
import { SiteFooter } from "@/components/site-footer";
import { getPublicPathname } from "@/lib/request-public-path";
import { getServerLocale } from "@/lib/server-locale";
import { alternatesWithCanonical, logicalPathFromPublicPath, withSeoKeywordFootnote } from "@/lib/seo-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const logical = logicalPathFromPublicPath(await getPublicPathname());
  const raw =
    "How Hikuada collects, uses, and protects personal information in connection with our B2B wholesale website and export manufacturing services.";
  const description = withSeoKeywordFootnote(raw, locale);
  return {
    title: "Privacy Policy | Hikuada",
    description,
    ...(await alternatesWithCanonical(logical)),
  };
}

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <BusinessTermsShell
        kicker="Hikuada — Data protection"
        documentHeading="Privacy Policy"
        lastUpdatedLabel="Last updated:"
        lastUpdatedIso="2026-05-09"
        lastUpdatedDisplay="May 9, 2026"
        articleLang="en"
      >
        <Section title="1. Introduction">
          <p>
            This Privacy Policy describes how Hikuada (“Hikuada”, “we”, “us”, or “our”) handles personal information
            when you use our website, communicate with us, or otherwise engage with us in a business capacity in
            connection with our manufacturing and export of PS picture-frame moldings, related machinery and
            consumables, and other wholesale catalogue products (collectively, the “Services”).
          </p>
          <p>
            Hikuada primarily serves <strong>business customers</strong> (including distributors, importers, and
            professional buyers). This policy is written for a global audience. If you are located in the European
            Economic Area, the United Kingdom, or other regions with specific privacy laws, additional rights may apply
            as described below.
          </p>
        </Section>

        <Section title="2. Who is responsible for your information?">
          <p>
            The data controller for personal information processed through this website and related business channels
            is the Hikuada operating entity that contracts with you or responds to your inquiry. For privacy questions,
            please use the contact details in Section 12.
          </p>
        </Section>

        <Section title="3. Information we collect">
          <p>Depending on how you interact with us, we may collect the following categories of information:</p>
          <p>
            <strong>3.1 Information you provide</strong>
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Business contact and inquiry data:</strong> such as your name, company name (if provided),
              email address, phone number or messaging identifiers (for example WhatsApp or Zalo), and the content of
              your messages, specifications, or files you attach when you request quotations, samples, or support.
            </li>
            <li>
              <strong>Relationship and transaction data:</strong> such as purchase history, shipping and billing
              addresses, payment-related references (where applicable), and correspondence relating to orders,
              logistics, quality, or compliance.
            </li>
          </ul>
          <p>
            <strong>3.2 Information collected automatically</strong>
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Technical and usage data:</strong> such as IP address, general geographic region derived from
              IP, browser type, device type, operating system, referring URLs, pages viewed, and timestamps. We use this
              information to operate, secure, and improve the website.
            </li>
            <li>
              <strong>Cookies and similar technologies:</strong> we may use cookies and similar technologies for
              essential site functionality, preferences (such as language selection), and analytics where enabled. You
              can control cookies through your browser settings.
            </li>
          </ul>
        </Section>

        <Section title="4. How we use personal information">
          <p>We use personal information for purposes that are necessary for our legitimate business interests, including:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>responding to inquiries, preparing quotations, and managing customer relationships;</li>
            <li>processing, fulfilling, and documenting orders, exports, and related logistics;</li>
            <li>quality assurance, product safety, regulatory compliance, and dispute resolution;</li>
            <li>operating, maintaining, and securing our website and IT systems;</li>
            <li>measuring website performance and understanding how visitors use our pages (where analytics tools are used);</li>
            <li>complying with legal obligations and enforcing our terms.</li>
          </ul>
          <p>
            Where required by applicable law, we rely on appropriate legal bases such as contract performance, legitimate
            interests (balanced against your rights), compliance with legal obligations, and, where applicable, consent.
          </p>
        </Section>

        <Section title="5. Marketing">
          <p>
            If we send business communications (for example product updates relevant to your trade), we will do so in
            line with applicable marketing rules. You may opt out of promotional emails using the unsubscribe mechanism
            provided in those messages, where available, or by contacting us.
          </p>
        </Section>

        <Section title="6. Sharing and recipients">
          <p>
            We do not sell your personal information. We may share information with the following categories of recipients
            where necessary to provide the Services:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Service providers</strong> who host our website, store data, provide email or messaging delivery,
              analytics, customer relationship tools, or payment processing (where applicable), subject to contractual
              confidentiality and security obligations.
            </li>
            <li>
              <strong>Logistics and trade partners</strong> such as freight forwarders, customs brokers, insurers, and
              banks involved in export and settlement, where required to move goods and complete transactions.
            </li>
            <li>
              <strong>Professional advisers</strong> such as lawyers, accountants, or auditors where permitted by law.
            </li>
            <li>
              <strong>Authorities</strong> when required to comply with applicable law, court orders, or lawful requests.
            </li>
          </ul>
        </Section>

        <Section title="7. International transfers">
          <p>
            Hikuada operates in an international B2B context. Your information may be processed in countries other than
            your country of residence, including countries that may not be deemed to provide an equivalent level of data
            protection. Where required, we implement appropriate safeguards such as standard contractual clauses approved
            by relevant regulators, or other lawful transfer mechanisms.
          </p>
        </Section>

        <Section title="8. Retention">
          <p>
            We retain personal information for as long as necessary to fulfill the purposes described in this policy,
            including to satisfy legal, accounting, customs, and tax record-keeping requirements. Retention periods vary
            depending on the nature of the data and our relationship with you. When retention is no longer required, we
            delete or anonymize information in accordance with our internal policies, subject to legal exceptions.
          </p>
        </Section>

        <Section title="9. Security">
          <p>
            We implement reasonable technical and organizational measures designed to protect personal information
            against unauthorized access, loss, or misuse. No method of transmission over the Internet is completely
            secure; you should also use care when sharing sensitive information through third-party messaging apps.
          </p>
        </Section>

        <Section title="10. Your rights">
          <p>
            Depending on your location, you may have rights to access, correct, delete, restrict, or object to certain
            processing of your personal information, or to data portability. You may also have the right to lodge a
            complaint with a supervisory authority. To exercise rights, please contact us using the details below. We
            may need to verify your identity before responding.
          </p>
        </Section>

        <Section title="11. Third-party websites">
          <p>
            Our website may contain links to third-party sites or enable you to open external messaging applications.
            Those services are governed by their own privacy policies, and we are not responsible for their practices.
          </p>
        </Section>

        <Section title="12. Contact">
          <p>
            For privacy-related requests or questions, please contact us through the inquiry channels listed on this
            website (including the contact section and business messaging options). Please include enough detail for us
            to understand and address your request.
          </p>
        </Section>

        <Section title="13. Changes to this policy">
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or
            legal requirements. The “Last updated” date at the top of this page will be revised when we post changes,
            and where appropriate we will provide additional notice.
          </p>
        </Section>
      </BusinessTermsShell>
      <SiteFooter />
    </>
  );
}
