import type { Metadata } from "next";
import { BusinessTermsShell } from "@/components/business-terms-shell";
import { getPublicPathname } from "@/lib/request-public-path";
import { getServerLocale } from "@/lib/server-locale";
import { alternatesWithCanonical, logicalPathFromPublicPath, withSeoKeywordFootnote } from "@/lib/seo-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const logical = logicalPathFromPublicPath(await getPublicPathname());
  const raw =
    "Commercial terms, ordering workflow, and practical guidance for wholesale buyers sourcing PS moldings and related products from Hikuada.";
  const description = withSeoKeywordFootnote(raw, locale);
  return {
    title: "Business Terms & Ordering Guide | Hikuada",
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

export default function BusinessTermsPage() {
  return (
    <BusinessTermsShell
      kicker="Hikuada — Wholesale supply"
      documentHeading="Business Terms & Ordering Guide"
      lastUpdatedLabel="Last updated:"
      lastUpdatedIso="2026-05-02"
      lastUpdatedDisplay="May 2, 2026"
      articleLang="en"
      alternate={{
        href: "/business-terms/vi",
        label: "Điều khoản kinh doanh & Hướng dẫn đặt hàng — bản tiếng Việt",
      }}
    >
      <Section title="1. Purpose and scope">
        <p>
          This document sets out standard commercial and ordering practices for business customers engaging with
          Hikuada (“we”, “us”, “our”) for PS picture-frame moldings, machinery and consumables, finished products, and
          related catalogue items. It is intended as a practical reference for quotations, purchase orders, and
          day-to-day cooperation.
        </p>
        <p>
          Unless you and Hikuada have executed a separate written agreement that expressly overrides these terms, this
          guide describes how we typically work with wholesale and B2B buyers. Any specific transaction remains subject
          to the final written quotation, order confirmation, and contract documents agreed between the parties.
        </p>
      </Section>

      <Section title="2. Inquiries, specifications, and quotations">
        <p>
          Please submit inquiries through the channels indicated on our website (including the inquiry list and contact
          options). To prepare an accurate quotation, we rely on clear information such as model references, dimensions,
          colour or finish requirements, intended annual volumes, delivery region, and any applicable standards or
          packaging preferences.
        </p>
        <p>
          Quotations are normally issued in writing (including by email or messaging apps used for business
          correspondence) and indicate validity, currency, unit basis, and any assumptions (e.g. Incoterms® rule,
          packing format, or lead-time basis). Unless otherwise stated, quotations are valid for thirty (30) calendar
          days from the date of issue.
        </p>
      </Section>

      <Section title="3. Orders and acceptance">
        <p>
          A binding order is formed when we issue a written order confirmation against your purchase order or written
          instruction, or when we commence execution with your express prior approval. Verbal requests should be
          confirmed in writing to avoid ambiguity.
        </p>
        <p>
          You are responsible for verifying model numbers, quantities, dimensions, and shipping details on the order
          confirmation. Please raise discrepancies before production or shipment scheduling begins.
        </p>
      </Section>

      <Section title="4. Pricing, currency, and taxes">
        <p>
          Prices are quoted on the basis stated in our quotation (for example, EXW, FOB, or CIF, as applicable). Unless
          expressly included, amounts exclude import duties, VAT or similar taxes, customs clearance charges, bank
          fees, and local delivery at destination, which are typically for the buyer’s account unless otherwise agreed.
        </p>
        <p>
          We may adjust prices if there is a material change in raw-material costs, exchange rates, freight benchmarks,
          or regulatory charges between quotation and shipment, where such adjustment is permitted under the governing
          contract or mutually confirmed in writing.
        </p>
      </Section>

      <Section title="5. Payment terms">
        <p>
          Standard payment arrangements are agreed case by case and reflected in the quotation or contract. Typical
          structures for new wholesale relationships include advance payment before production or shipment, and/or
          documentary balance against copy shipping documents, subject to credit assessment and order profile.
        </p>
        <p>
          Payments should be made to the bank account designated on our invoice only. Title to goods and risk of loss
          follow the agreed Incoterms® rule and contract terms.
        </p>
      </Section>

      <Section title="6. Minimum order quantities, packing, and marks">
        <p>
          Minimum order quantities (MOQ), inner/outer carton configurations, and labelling are as stated in the
          quotation or product specification sheet. Where no MOQ is stated, we will advise the economical batch size for
          the model and finish requested.
        </p>
        <p>
          Neutral or customer-specific outer markings may be available subject to feasibility, lead time, and any
          additional charges agreed in writing.
        </p>
      </Section>

      <Section title="7. Lead times, production, and scheduling">
        <p>
          Stated lead times are estimates based on current capacity and material availability at the time of order
          confirmation. They are not fixed guarantees unless expressly confirmed as binding in writing for a specific
          order line.
        </p>
        <p>
          Changes requested after order confirmation (including to specifications, quantities, or packing) may affect
          lead time and pricing and will require written agreement.
        </p>
      </Section>

      <Section title="8. Shipment, delivery, and risk">
        <p>
          Delivery obligations, transfer of risk, and insurance are determined by the Incoterms® rule and carrier terms
          stated in the contract or shipping documents. Where you arrange freight, you should provide timely booking
          instructions and comply with cut-off dates we communicate for loading.
        </p>
        <p>
          Partial shipments may be allowed where agreed. You are responsible for import compliance, permits, and
          product conformity in the destination market unless a different allocation of responsibility is expressly
          contracted.
        </p>
      </Section>

      <Section title="9. Quality standards, inspection, and claims">
        <p>
          We supply industrial and wholesale-grade products in accordance with agreed specifications, samples approved
          by both parties, or, in the absence of such agreement, our standard factory tolerances for the relevant
          product family.
        </p>
        <p>
          Upon receipt, please inspect packaging integrity and, where practical, perform a reasonable visual and
          quantity check. Any shortage, transport damage, or quality discrepancy should be notified in writing with
          supporting evidence (including photographs and packing marks) within fourteen (14) calendar days of
          delivery at the agreed destination, unless a different period is stated in the contract.
        </p>
        <p>
          Remedies may include repair, replacement, or commercial adjustment as appropriate to the facts and the
          governing contract. Use, further processing, or resale of disputed goods without our prior agreement may
          affect the assessment of a claim.
        </p>
      </Section>

      <Section title="10. Catalogue information and tolerances">
        <p>
          Website images, technical tables, and marketing materials are for general reference. Minor deviations in
          colour, texture, or dimensions may occur between batches due to raw materials and process conditions within
          industry-accepted tolerances unless a stricter specification is agreed and priced accordingly.
        </p>
      </Section>

      <Section title="11. Intellectual property and branding">
        <p>
          Trademarks, product names, and marketing assets displayed by Hikuada remain our property or that of our
          licensors. You may not use them in a manner that implies endorsement or origin beyond the scope of your
          resale or distribution rights as agreed in writing.
        </p>
      </Section>

      <Section title="12. Force majeure">
        <p>
          Neither party is liable for delay or non-performance caused by events beyond its reasonable control,
          including but not limited to natural disasters, epidemics, war, sanctions, labour disputes, major utility
          failures, or critical supply-chain disruptions, provided the affected party gives prompt notice and uses
          reasonable efforts to mitigate impact.
        </p>
      </Section>

      <Section title="13. Limitation of liability">
        <p>
          To the maximum extent permitted by applicable law, our aggregate liability arising out of or in connection with
          a specific order is governed by the written contract for that order. Where no amount is stipulated, liability
          is limited to direct damages and does not cover indirect, consequential, or punitive losses, except where
          such exclusion is prohibited by mandatory law.
        </p>
      </Section>

      <Section title="14. Governing instruments and language">
        <p>
          In case of inconsistency between this guide and a signed contract, quotation acceptance, or order confirmation,
          the latter instruments prevail. The English version of business correspondence is commonly used; where a
          bilingual document is executed, the priority of language shall be as expressly stated therein.
        </p>
      </Section>

      <Section title="15. Updates and contact">
        <p>
          We may update this page from time to time to reflect operational or regulatory changes. The “Last updated”
          date above indicates the latest revision.
        </p>
        <p>
          For quotations, scheduling, and partnership matters, please contact us via the options on our website
          homepage under Contact, including WhatsApp and Zalo where listed.
        </p>
      </Section>
    </BusinessTermsShell>
  );
}
