import { getSiteBaseUrl } from "@/lib/site-url";

function absoluteImageUrl(url: string | null): string | undefined {
  if (!url?.trim()) return undefined;
  const u = url.trim();
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = getSiteBaseUrl();
  return `${base}${u.startsWith("/") ? "" : "/"}${u}`;
}

function schemaAvailability(stockStatus: string | null): string {
  const n = (stockStatus || "").trim().toLowerCase();
  if (n === "out stock" || n === "out of stock") return "https://schema.org/OutOfStock";
  if (n === "low stock") return "https://schema.org/LimitedAvailability";
  return "https://schema.org/InStock";
}

export function JsonLdProduct({
  name,
  description,
  imageUrl,
  sku,
  productPageUrl,
  stockStatus,
}: {
  name: string;
  description: string;
  imageUrl: string | null;
  sku: string;
  productPageUrl: string;
  stockStatus: string | null;
}) {
  const image = absoluteImageUrl(imageUrl);
  const payload = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    sku,
    brand: { "@type": "Brand", name: "Hikuada" },
    ...(image ? { image: [image] } : {}),
    offers: {
      "@type": "Offer",
      url: productPageUrl,
      availability: schemaAvailability(stockStatus),
      priceCurrency: "USD",
      businessFunction: "http://purl.org/goodrelations/v1#Wholesale",
      seller: { "@type": "Organization", name: "Hikuada" },
    },
  };

  const json = JSON.stringify(payload);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
