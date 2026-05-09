import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase";
import { AddToInquiryListButton } from "@/components/add-to-inquiry-list-button";
import { ProductCardSpecs } from "@/components/product-card-specs";
import { ProductImagePreview } from "@/components/product-image-preview";
import { productCardImageObjectFit } from "@/lib/product-card-image-fit";
import { ProductsCategoryNav } from "@/components/products-category-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getServerLocale } from "@/lib/server-locale";
import { getPageList } from "@/lib/pagination-page-list";
import { isProductDetailCategory } from "@/lib/product-catalog-back-href";
import { displayStockStatus, getSiteMessages } from "@/lib/site-messages";

const PRODUCTS_PER_PAGE = 16;

function hrefForProductsPage(page: number, category: "ps_moldings" | "frame_machinery_consumables" | "finished_products_others" | null) {
  const qs = new URLSearchParams();
  if (category) qs.set("category", category);
  if (page > 1) qs.set("page", String(page));
  const s = qs.toString();
  return s ? `/products?${s}` : "/products";
}

type Product = {
  id: number;
  model: string | null;
  category: string | null;
  sort_order: number | null;
  size: string | null;
  packing_spec: string | null;
  stock_status: string | null;
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

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { page?: string; category?: string } | Promise<{ page?: string; category?: string }>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const locale = await getServerLocale();
  const m = getSiteMessages(locale);
  const rawPage = Number(resolvedSearchParams?.page || "1");
  const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const category = resolvedSearchParams?.category;
  const from = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const to = from + PRODUCTS_PER_PAGE - 1;
  const validCategory =
    category === "ps_moldings" || category === "frame_machinery_consumables" || category === "finished_products_others"
      ? category
      : null;
  let categoryTitle = m.products.moreSeriesTitle;
  let categorySubtitle = m.products.moreSeriesSubtitle;
  if (validCategory === "ps_moldings") {
    categoryTitle = m.products.pictureMoldingsTitle;
    categorySubtitle = m.products.pictureMoldingsSubtitle;
  } else if (validCategory === "frame_machinery_consumables") {
    categoryTitle = m.products.machineryTitle;
    categorySubtitle = m.products.machinerySubtitle;
  } else if (validCategory === "finished_products_others") {
    categoryTitle = m.products.finishedTitle;
    categorySubtitle = m.products.finishedSubtitle;
  }

  const supabase = getSupabaseServerClient();
  let query = supabase
    .from("hikuada_products")
    .select("id, model, category, sort_order, size, packing_spec, stock_status, image_url, image_object_fit", {
      count: "exact",
    })
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (validCategory === "ps_moldings") {
    query = query.or("category.eq.ps_moldings,category.is.null");
  } else if (validCategory === "frame_machinery_consumables") {
    query = query.eq("category", "frame_machinery_consumables");
  } else if (validCategory === "finished_products_others") {
    query = query.eq("category", "finished_products_others");
  }

  const { data, count } = await query.range(from, to);

  const products = (data || []) as Product[];
  const totalCount = count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PRODUCTS_PER_PAGE));
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const pageItems = getPageList(currentPage, totalPages);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0 sm:flex-1">
            <h1 className="text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{categoryTitle}</h1>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-slate-600 sm:text-base">{categorySubtitle}</p>
          </div>
          <Link
            href="/#products"
            className="hidden whitespace-nowrap rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:mt-0.5 sm:inline-flex sm:shrink-0 sm:items-center sm:justify-center sm:self-auto"
          >
            {m.products.backToHome}
          </Link>
        </header>
        <ProductsCategoryNav
          validCategory={validCategory}
          navAriaLabel={m.nav.productsMenu.trigger}
          categorySelectAll={m.products.categorySelectAll}
          pictureFrameMoldings={m.nav.productsMenu.pictureFrameMoldings}
          frameMachineryConsumables={m.nav.productsMenu.frameMachineryConsumables}
          finishedOtherProducts={m.nav.productsMenu.finishedOtherProducts}
        />

        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
            {m.products.empty}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => {
              const detailHref = isProductDetailCategory(product.category)
                ? `/products/${product.id}`
                : undefined;
              return (
              <article
                key={product.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-30px_rgba(15,23,42,0.45)]"
              >
                <span
                  className={`absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-semibold ${getStockBadgeClass(
                    product.stock_status,
                  )}`}
                >
                  {displayStockStatus(product.stock_status, m.stock)}
                </span>
                <div className="h-44 border-b border-slate-200 bg-slate-100 p-4">
                  <ProductImagePreview
                    src={product.image_url}
                    alt={`${product.model || "Product"} image`}
                    objectFit={productCardImageObjectFit(product.image_object_fit)}
                    detailHref={detailHref}
                    detailAriaLabel={detailHref ? m.productDetail.viewDetailsAria : undefined}
                  />
                </div>
                <div className="space-y-2 p-5">
                  <h3 className="text-xl font-bold text-slate-900">
                    {detailHref ? (
                      <Link
                        href={detailHref}
                        className="transition hover:text-slate-700 hover:underline"
                      >
                        {product.model || "-"}
                      </Link>
                    ) : (
                      product.model || "-"
                    )}
                  </h3>
                  <ProductCardSpecs
                    size={product.size}
                    packingSpec={product.packing_spec}
                    sizeLabel={m.productCard.size}
                    packingLabel={m.productCard.packing}
                  />
                  <AddToInquiryListButton product={product} />
                </div>
              </article>
            );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <nav
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
            aria-label={m.products.paginationAria}
          >
            {hasPrevPage ? (
              <Link
                href={hrefForProductsPage(currentPage - 1, validCategory)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {m.products.previous}
              </Link>
            ) : (
              <span className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-400">
                {m.products.previous}
              </span>
            )}

            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {pageItems.map((item, idx) =>
                item === "ellipsis" ? (
                  <span
                    key={`e-${idx}`}
                    className="px-1 text-sm font-medium text-slate-400"
                    aria-hidden
                  >
                    …
                  </span>
                ) : item === currentPage ? (
                  <span
                    key={item}
                    className="inline-flex min-w-10 items-center justify-center rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                    aria-current="page"
                  >
                    {item}
                  </span>
                ) : (
                  <Link
                    key={item}
                    href={hrefForProductsPage(item, validCategory)}
                    className="inline-flex min-w-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    {item}
                  </Link>
                ),
              )}
            </div>

            {hasNextPage ? (
              <Link
                href={hrefForProductsPage(currentPage + 1, validCategory)}
                className="rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                {m.products.next}
              </Link>
            ) : (
              <span className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400">
                {m.products.next}
              </span>
            )}
          </nav>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
