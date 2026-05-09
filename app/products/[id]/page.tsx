import { notFound } from "next/navigation";
import Link from "next/link";
import { AddToInquiryListButton } from "@/components/add-to-inquiry-list-button";
import { ProductDetailMachineryFeatures } from "@/components/product-detail-machinery-features";
import { ProductDetailSpecsBlock } from "@/components/product-detail-specs-block";
import { ProductImagePreview } from "@/components/product-image-preview";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { catalogBackHrefForCategory, isProductDetailCategory } from "@/lib/product-catalog-back-href";
import { getServerLocale } from "@/lib/server-locale";
import { getSupabaseServerClient } from "@/lib/supabase";
import { displayStockStatus, getSiteMessages } from "@/lib/site-messages";

type ProductRow = {
  id: number;
  model: string | null;
  display_name: string | null;
  category: string | null;
  size: string | null;
  packing_spec: string | null;
  detail_specs: string | null;
  stock_status: string | null;
  stock_quantity: number | null;
  image_url: string | null;
  image_object_fit: string | null;
};

function getStockBadgeClass(status: string | null) {
  const normalized = (status || "").trim().toLowerCase();
  if (normalized === "low stock") {
    return "bg-amber-500 text-white";
  }
  if (normalized === "out stock" || normalized === "out of stock") {
    return "bg-slate-500 text-white";
  }
  return "bg-emerald-600 text-white";
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  const id = Number(raw);
  if (!Number.isFinite(id) || id <= 0) {
    return { title: "Product | Hikuada" };
  }
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("hikuada_products")
    .select("model, display_name, category")
    .eq("id", id)
    .maybeSingle();
  if (!data || !isProductDetailCategory(data.category as string | null)) {
    return { title: "Hikuada" };
  }
  const rawDn = data.display_name;
  const displayName = typeof rawDn === "string" && rawDn.trim().length > 0 ? rawDn.trim() : "";
  const model = (data.model as string | null)?.trim() || `Product #${id}`;
  const titleHead = displayName || model;
  return {
    title: `${titleHead} | Hikuada`,
    description: `${titleHead} — specifications and factory-direct wholesale inquiry.`,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  const id = Number(raw);
  if (!Number.isFinite(id) || id <= 0) {
    notFound();
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("hikuada_products")
    .select(
      "id, model, display_name, category, sort_order, size, packing_spec, detail_specs, stock_status, stock_quantity, image_url, image_object_fit, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const product = data as ProductRow;
  if (!isProductDetailCategory(product.category)) {
    notFound();
  }

  const locale = await getServerLocale();
  const m = getSiteMessages(locale);
  const vi = locale === "en" ? getSiteMessages("vi") : null;

  const slug = (product.category || "").trim();
  const { data: catRow } = await supabase
    .from("hikuada_categories")
    .select("name")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  const categoryLabel = (catRow?.name as string | undefined)?.trim() || slug || "—";

  const backHref = catalogBackHrefForCategory(product.category);
  const displayTitle = product.display_name?.trim() || product.model?.trim() || "—";
  const modelSku = product.model?.trim() || "—";
  const hasDetailSpecs = Boolean(product.detail_specs?.trim());

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href={backHref}
          className="inline-flex text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
        >
          {m.productDetail.backToCatalog}
        </Link>

        <header className="mt-4 border-b border-slate-200 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {displayTitle}
              </h1>
              {product.display_name?.trim() ? (
                <p className="mt-1 text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">{m.productDetail.modelSkuLabel}</span>{" "}
                  {modelSku}
                </p>
              ) : null}
              <p className="mt-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">{m.productDetail.categoryLabel}</span>{" "}
                {categoryLabel}
              </p>
            </div>
            <span
              className={`shrink-0 self-start rounded-full px-3 py-1 text-xs font-semibold ${getStockBadgeClass(
                product.stock_status,
              )}`}
            >
              {displayStockStatus(product.stock_status, m.stock)}
            </span>
          </div>
        </header>

        <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-stretch">
          <div className="flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 p-3 sm:p-5">
            <ProductImagePreview
              galleryContain
              src={product.image_url}
              alt={`${product.model || "Product"} image`}
            />
          </div>
          <div className="flex min-h-0 min-w-0 flex-col gap-6 self-stretch">
            {!hasDetailSpecs ? (
              <>
                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{m.productCard.size}</h2>
                  <p className="mt-1 whitespace-pre-wrap text-base leading-relaxed text-slate-800">
                    {product.size?.trim() || "—"}
                  </p>
                </section>
                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{m.productCard.packing}</h2>
                  <p className="mt-1 whitespace-pre-wrap text-base leading-relaxed text-slate-800">
                    {product.packing_spec?.trim() || "—"}
                  </p>
                </section>
              </>
            ) : (
              <>
                <ProductDetailMachineryFeatures
                  title={m.productDetail.machineryFeaturesTitle}
                  lines={[
                    m.productDetail.machineryFeaturePrecision,
                    m.productDetail.machineryFeaturePs,
                    m.productDetail.machineryFeatureNailing,
                  ]}
                />
                {vi ? (
                  <ProductDetailMachineryFeatures
                    title={vi.productDetail.machineryFeaturesTitle}
                    lines={[
                      vi.productDetail.machineryFeaturePrecision,
                      vi.productDetail.machineryFeaturePs,
                      vi.productDetail.machineryFeatureNailing,
                    ]}
                  />
                ) : null}
              </>
            )}
            {product.stock_quantity != null ? (
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">{m.productDetail.stockQtyLabel}</span>{" "}
                {product.stock_quantity}
              </p>
            ) : null}
            <div className="mt-auto flex flex-col gap-3 pt-1">
              {hasDetailSpecs ? (
                <p className="text-center text-sm font-bold leading-snug tracking-tight text-slate-900 sm:text-left">
                  {m.productDetail.machineryBulkWholesaleNote}
                </p>
              ) : null}
              <AddToInquiryListButton product={product} />
            </div>
          </div>
        </div>

        {hasDetailSpecs ? (
          <section
            className="mt-12 border-t border-slate-200 pt-10"
            aria-labelledby="product-detail-specs-heading"
          >
            <h2
              id="product-detail-specs-heading"
              className="text-sm font-semibold uppercase tracking-wide text-slate-500"
            >
              {m.productDetail.fullSpecsHeading}
            </h2>
            <div className="mt-5">
              <ProductDetailSpecsBlock
                variant="threeColumnGrid"
                raw={product.detail_specs ?? ""}
                parameterColumnLabel={m.productDetail.specParameterColumn}
                valueColumnLabel={m.productDetail.specValueColumn}
              />
            </div>
          </section>
        ) : null}
      </div>
      <SiteFooter />
    </main>
  );
}
